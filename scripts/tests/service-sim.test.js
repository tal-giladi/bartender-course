// node --test scripts/tests/  — service-sim: lesson 08.5 time model, dead drinks, correctness, presets, stock, scoring (ops-math).
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");
const ROOT = path.join(__dirname, "../..");
const O = require(path.join(ROOT, "simulations/common/ops-math.js"));
const SC = require(path.join(ROOT, "simulations/service-sim/service-cards.js"));
const S = require(path.join(ROOT, "simulations/service-sim/service-core.js"));
const near = (a, b, tol = 1e-6) => assert.ok(Math.abs(a - b) <= tol, `${a} != ${b} (±${tol})`);

// A shift with hand-made tickets (all arriving at 0 unless given).
function custom(tickets, opts = {}) {
  const st = S.createShift("practice", 1);
  st.tickets = []; st.slots = {}; st.nextSlot = 1; st.sendBackFrom = null; st.stock = {};
  st.p = Object.assign({}, st.p, { arrivals: { mode: "every", every: 0 } }, opts.p || {});
  tickets.forEach((drinks, i) => {
    const t = { id: i + 1, arrival: (opts.arrivals || [])[i] || 0, source: "Bar", drinks, slots: [], servedAt: null };
    st.tickets.push(t);
    drinks.forEach((d) => {
      const id = st.nextSlot++;
      st.slots[id] = { id, ticket: t.id, drink: d, ordered: d, sub: false, glass: null, ice: "none", vessel: null, usedVessel: null, vc: {}, gc: {},
        muddled: false, shaken: 0, stirred: 0, stirredGlass: 0, strained: false, garnish: null, shakenAt: null, strainedAt: null, lastStep: null, warmInVessel: false, result: null };
      t.slots.push(id);
    });
  });
  return st;
}
const ok = (st, a) => { const r = S.act(st, a); assert.ok(r.ok, r.msg); return r; };
const card = (id) => SC.CARDS[id];

// Make drinks on given slot ids with passes (the 08.5 method); returns nothing, acts on st.
function makeTogether(st, ids) {
  const slots = ids.map((i) => st.slots[i]);
  const byGlass = {};
  slots.forEach((s) => (byGlass[card(s.drink).glass[0]] = (byGlass[card(s.drink).glass[0]] || []).concat(s.id)));
  Object.keys(byGlass).forEach((g) => ok(st, { type: "glass", slots: byGlass[g], glass: g }));
  const iced = slots.filter((s) => card(s.drink).ice !== "none");
  ["cubes", "crushed"].forEach((ice) => { const x = iced.filter((s) => card(s.drink).ice === ice).map((s) => s.id); if (x.length) ok(st, { type: "ice", slots: x, ice }); });
  const shake = slots.filter((s) => card(s.drink).method === "shake").map((s) => s.id);
  const stir = slots.filter((s) => card(s.drink).method === "stir").map((s) => s.id);
  if (shake.length) ok(st, { type: "vessel", slots: shake, vessel: "tin" });
  if (stir.length) ok(st, { type: "vessel", slots: stir, vessel: "mix" });
  // pours and adds in passes: one bottle across all drinks that need it
  const passes = {};
  slots.forEach((s) => card(s.drink).items.forEach((it) => {
    if (it.optional) return;
    const k = it.keys[0];
    if (it.kind === "top" || (k === "sparkling" && card(s.drink).method === "shake")) return;
    const key = k + "|" + (it.kind === "pour" ? it.ml : "p");
    (passes[key] = passes[key] || { key: k, ml: it.ml, ids: [] }).ids.push(s.id);
  }));
  Object.values(passes).forEach((p) => {
    restock(st, p.key, p.ml * p.ids.length);
    ok(st, { type: "pour", slots: p.ids, key: p.key, ml: p.ml });
  });
  const mud = slots.filter((s) => card(s.drink).muddle).map((s) => s.id);
  if (mud.length) ok(st, { type: "muddle", slots: mud });
  if (stir.length) ok(st, { type: "stir", slots: stir });
  if (shake.length) ok(st, { type: "shake", slots: shake });
  const toStrain = stir.concat(shake);
  if (toStrain.length) ok(st, { type: "strain", slots: toStrain });
  const sig = slots.filter((s) => card(s.drink).stirInGlass).map((s) => s.id);
  if (sig.length) ok(st, { type: "stirGlass", slots: sig });
  const beer = slots.filter((s) => s.drink === "beer").map((s) => s.id), wine = slots.filter((s) => s.drink === "wine").map((s) => s.id);
  if (beer.length) ok(st, { type: "beer", slots: beer });
  if (wine.length) ok(st, { type: "wine", slots: wine });
  const tops = {};
  slots.forEach((s) => card(s.drink).items.forEach((it) => {
    const k = it.keys[0];
    if (it.kind === "top" || (k === "sparkling" && card(s.drink).method === "shake")) (tops[k] = tops[k] || []).push(s.id);
  }));
  Object.keys(tops).forEach((k) => { restock(st, k, 120 * tops[k].length); ok(st, { type: "top", slots: tops[k], key: k }); });
  const gar = {};
  slots.forEach((s) => { const g = card(s.drink).garnish[0]; if (g !== "none") (gar[g] = gar[g] || []).push(s.id); });
  Object.keys(gar).forEach((g) => ok(st, { type: "garnish", slots: gar[g], garnish: g }));
}
function restock(st, key, need) {
  const sk = st.stock[key];
  if (!sk) return;
  while (sk.level < need) ok(st, { type: sk.juice ? "squeeze" : "fetch", key });
}
// Oldest first; drinks of a ticket in passes, in groups the station can hold.
function bot(st) {
  let guard = 0;
  while (!st.done && guard++ < 2000) {
    const open = S.openTickets(st).sort((a, b) => a.arrival - b.arrival);
    if (!open.length) { ok(st, { type: "waitNext" }); continue; }
    const t = open[0];
    // ask the barback at the first low-stock warning (lesson 08.4)
    Object.values(st.stock).forEach((sk) => { if (sk.warnAt && sk.level <= sk.warnAt && !sk.pending && (sk.juice || sk.storeroom > 0)) ok(st, { type: "barback", key: sk.key }); });
    const ids = t.slots.filter((id) => !st.slots[id].glass);
    // station limits: 4 tins, 2 mixing glasses
    let group = [], tins = 0, mix = 0;
    const flush = () => { if (group.length) makeTogether(st, group); group = []; tins = 0; mix = 0; };
    ids.forEach((id) => {
      const m = card(st.slots[id].drink).method;
      if ((m === "shake" && tins === 4) || (m === "stir" && mix === 2)) flush();
      group.push(id); if (m === "shake") tins++; if (m === "stir") mix++;
    });
    flush();
    ok(st, { type: "serve", ticket: t.id });
  }
  return S.metrics(st);
}

test("time table matches lesson 08.5", () => {
  assert.deepEqual([S.T.glass, S.T.ice, S.T.pourFirst, S.T.pourNext, S.T.top, S.T.muddle, S.T.shake, S.T.stir, S.T.stirGlass, S.T.strain, S.T.garnish,
    S.T.beer, S.T.wine, S.T.rinse, S.T.bin, S.T.serve, S.T.barback, S.T.barbackBottle, S.T.barbackJuice, S.T.fetch, S.T.squeeze, S.T.eightySix],
  [2, 3, 4, 2, 3, 8, 12, 20, 5, 3, 4, 8, 6, 3, 2, 3, 3, 60, 120, 45, 90, 3]);
  assert.equal(S.DEAD_AFTER, 30);
});

test("every service card resolves against recipes.js", () => {
  assert.deepEqual(SC.PROBLEMS, []);
  const menu = new Set(Object.values(S.PRESETS).flatMap((p) => p.menu));
  menu.forEach((d) => assert.ok(SC.CARDS[d], "card for " + d));
  assert.equal(card("daiquiri").items[0].checkMl, 60);
  assert.equal(card("moscow-mule").items[1].checkMl, 120);
});

test("lesson 08.5 worked times: four Daiquiris 77 s in passes, 119 s drink by drink", () => {
  let st = custom([["daiquiri", "daiquiri", "daiquiri", "daiquiri"]]);
  const ids = st.tickets[0].slots;
  ok(st, { type: "glass", slots: ids, glass: "cocktail" });
  ok(st, { type: "vessel", slots: ids, vessel: "tin" });
  ok(st, { type: "pour", slots: ids, key: "whiterum", ml: 60 });
  ok(st, { type: "pour", slots: ids, key: "lime", ml: 20 });
  ok(st, { type: "pour", slots: ids, key: "sugar" });
  ok(st, { type: "shake", slots: ids });
  ok(st, { type: "strain", slots: ids });
  ok(st, { type: "serve", ticket: 1 });
  assert.equal(st.now, 77);
  const m = S.metrics(st);
  assert.equal(m.accuracy, 100); assert.equal(m.avgTime, 77); assert.equal(m.waste, 0);

  st = custom([["daiquiri", "daiquiri", "daiquiri", "daiquiri"]]);
  st.tickets[0].slots.forEach((id) => {
    ok(st, { type: "glass", slots: [id], glass: "cocktail" });
    ok(st, { type: "vessel", slots: [id], vessel: "tin" });
    ok(st, { type: "pour", slots: [id], key: "whiterum", ml: 60 });
    ok(st, { type: "pour", slots: [id], key: "lime", ml: 20 });
    ok(st, { type: "pour", slots: [id], key: "sugar" });
    ok(st, { type: "shake", slots: [id] });
    ok(st, { type: "strain", slots: [id] });
  });
  ok(st, { type: "serve", ticket: 1 });
  assert.equal(st.now, 119);
  // the first Daiquiri waited far more than 30 s after its last step: dead
  assert.equal(S.metrics(st).dead, 3);
});

test("worksheet 08.5: ticket A (Negroni, Daiquiri, Espresso Martini) 83 s; two beers 23 s; B first lowers the average", () => {
  const st = custom([["negroni", "daiquiri", "espresso-martini"], ["beer", "beer"]]);
  const [b1, b2] = st.tickets[1].slots;
  ok(st, { type: "glass", slots: [b1, b2], glass: "pint" });
  ok(st, { type: "beer", slots: [b1, b2] });
  ok(st, { type: "serve", ticket: 2 });
  assert.equal(st.now, 23);
  makeTogether(st, st.tickets[0].slots);
  ok(st, { type: "serve", ticket: 1 });
  assert.equal(st.now, 23 + 83);
  const m = S.metrics(st);
  assert.equal(m.accuracy, 100);
  near(m.avgTime, 64.5);
});

test("worksheet 08.5: 4 Moscow Mules in passes 71 s; wine 11 s; Manhattan + Margarita + Spritz 93 s", () => {
  let st = custom([["moscow-mule", "moscow-mule", "moscow-mule", "moscow-mule"]]);
  makeTogether(st, st.tickets[0].slots); ok(st, { type: "serve", ticket: 1 });
  assert.equal(st.now, 71); assert.equal(S.metrics(st).accuracy, 100);
  st = custom([["wine"]]);
  makeTogether(st, st.tickets[0].slots); ok(st, { type: "serve", ticket: 1 });
  assert.equal(st.now, 11);
  st = custom([["manhattan", "margarita", "aperol-spritz"]]);
  makeTogether(st, st.tickets[0].slots); ok(st, { type: "serve", ticket: 1 });
  assert.equal(st.now, 93); assert.equal(S.metrics(st).accuracy, 100);
});

test("dead drink rule: a finished Mojito waiting 32 s is dead (worksheet 08.5 #4)", () => {
  const st = custom([["mojito", "daiquiri"]]);
  const [mo, da] = st.tickets[0].slots;
  makeTogether(st, [mo]);
  makeTogether(st, [da]);       // glass 2 + pours 12 (sugar is a new bottle) + shake 12 + strain 3 = 29 s
  ok(st, { type: "serve", ticket: 1 });
  const r = st.slots[mo].result;
  assert.equal(r.dead, true); assert.equal(r.correct, false);
  assert.equal(st.slots[da].result.correct, true);
  const m = S.metrics(st);
  near(m.accuracy, 50);
  assert.ok(m.wasteMl > 0 && st.waste.dead === r.ml);
});

test("correctness: glass, ice, ±5 ml, method, garnish; missing and unapproved ingredients", () => {
  const st = custom([["margarita", "margarita"], ["moscow-mule"], ["negroni"]]);
  const [a, b] = st.tickets[0].slots, [c] = st.tickets[1].slots, [d] = st.tickets[2].slots;
  ok(st, { type: "glass", slots: [a], glass: "cocktail" });
  ok(st, { type: "glass", slots: [b], glass: "rocks" });              // wrong glass
  ok(st, { type: "vessel", slots: [a, b], vessel: "tin" });
  ok(st, { type: "pour", slots: [a, b], key: "tequila", ml: 55 });      // +5 ml is within tolerance
  ok(st, { type: "pour", slots: [a], key: "cointreau", ml: 20 });
  ok(st, { type: "pour", slots: [b], key: "cointreau", ml: 26 });       // +6 ml: wrong
  ok(st, { type: "pour", slots: [a, b], key: "lime", ml: 15 });
  ok(st, { type: "shake", slots: [a, b] });
  ok(st, { type: "strain", slots: [a, b] });
  ok(st, { type: "serve", ticket: 1 });
  ok(st, { type: "glass", slots: [c], glass: "mule" });
  ok(st, { type: "ice", slots: [c], ice: "cubes" });
  ok(st, { type: "pour", slots: [c], key: "vodka", ml: 45 });           // lime missing
  ok(st, { type: "top", slots: [c], key: "gingerbeer" });
  ok(st, { type: "garnish", slots: [c], garnish: "lime" });
  ok(st, { type: "serve", ticket: 2 });
  ok(st, { type: "glass", slots: [d], glass: "rocks" });
  ok(st, { type: "ice", slots: [d], ice: "cubes" });
  ["gin", "campari", "sweetvermouth"].forEach((k) => ok(st, { type: "pour", slots: [d], key: k, ml: 30 }));
  ok(st, { type: "pour", slots: [d], key: "bitters" });                 // not on the card
  ok(st, { type: "garnish", slots: [d], garnish: "orange-slice" });     // and not stirred in the glass
  ok(st, { type: "serve", ticket: 3 });
  assert.equal(st.slots[a].result.correct, true);
  const rb = st.slots[b].result.problems.join(" ");
  assert.match(rb, /wrong glass/); assert.match(rb, /triple sec 26 ml/);
  assert.equal(st.slots[c].result.missing, true);
  assert.equal(st.slots[d].result.unapproved, true);
  assert.match(st.slots[d].result.problems.join(" "), /stir it in the glass/);
  assert.equal(S.metrics(st).missingOrUnapproved, 2);
  near(S.metrics(st).accuracy, 25);
});

test("shaken drink left in the tin more than 30 s before straining is dead", () => {
  const st = custom([["daiquiri", "beer"]]);
  const [da, be] = st.tickets[0].slots;
  ok(st, { type: "glass", slots: [da], glass: "cocktail" });
  ok(st, { type: "vessel", slots: [da], vessel: "tin" });
  ok(st, { type: "pour", slots: [da], key: "whiterum", ml: 60 });
  ok(st, { type: "pour", slots: [da], key: "lime", ml: 20 });
  ok(st, { type: "pour", slots: [da], key: "sugar" });
  ok(st, { type: "shake", slots: [da] });
  ok(st, { type: "wait", seconds: 31 });
  ok(st, { type: "strain", slots: [da] });
  ok(st, { type: "glass", slots: [be], glass: "pint" });
  ok(st, { type: "beer", slots: [be] });
  ok(st, { type: "serve", ticket: 1 });
  assert.equal(st.slots[da].result.dead, true);
});

test("pour timing: 4 s first pour, 2 s for the next from the same bottle in a row", () => {
  const st = custom([["negroni", "negroni"]]);
  const [a, b] = st.tickets[0].slots;
  ok(st, { type: "glass", slots: [a, b], glass: "rocks" });
  const t0 = st.now;
  ok(st, { type: "pour", slots: [a], key: "gin", ml: 30 });
  ok(st, { type: "pour", slots: [b], key: "gin", ml: 30 });
  assert.equal(st.now - t0, 6);
  ok(st, { type: "pour", slots: [a], key: "campari", ml: 30 });
  ok(st, { type: "pour", slots: [b], key: "sweetvermouth", ml: 30 });
  assert.equal(st.now - t0, 14);
});

test("station: 4 tins, 2 mixing glasses; dirty vessels are rinsed (3 s) before reuse", () => {
  const st = custom([["manhattan", "manhattan", "manhattan"]]);
  const ids = st.tickets[0].slots;
  ok(st, { type: "glass", slots: ids, glass: "cocktail" });
  ok(st, { type: "vessel", slots: ids.slice(0, 2), vessel: "mix" });
  assert.equal(S.act(st, { type: "vessel", slots: [ids[2]], vessel: "mix" }).ok, false);
  ok(st, { type: "pour", slots: ids.slice(0, 2), key: "rye", ml: 50 });
  ok(st, { type: "stir", slots: ids.slice(0, 2) });
  ok(st, { type: "strain", slots: ids.slice(0, 2) });
  const t = st.now;
  ok(st, { type: "vessel", slots: [ids[2]], vessel: "mix" });
  assert.equal(st.now - t, 3);
});

test("bin: ml to waste, the drink starts again", () => {
  const st = custom([["negroni"]]);
  const [a] = st.tickets[0].slots;
  ok(st, { type: "glass", slots: [a], glass: "rocks" });
  ok(st, { type: "pour", slots: [a], key: "gin", ml: 60 });
  ok(st, { type: "bin", slots: [a] });
  assert.equal(st.wasteMl, 60); assert.equal(st.slots[a].glass, null);
  makeTogether(st, [a]); ok(st, { type: "serve", ticket: 1 });
  const m = S.metrics(st);
  assert.equal(m.accuracy, 100);
  near(m.waste, 60 / 150 * 100);
});

test("presets match the 08.5 / 08.8 / 08.4 / 11.4 contracts", () => {
  const P = S.PRESETS;
  assert.deepEqual([P.tutorial.tickets, P.practice.tickets, P.rush.tickets, P.stockout.tickets, P.exam.tickets], [5, 12, 20, 15, 20]);
  assert.deepEqual(P.tutorial.menu, ["daiquiri", "margarita", "negroni", "moscow-mule", "cuba-libre", "aperol-spritz"]);
  assert.deepEqual(P.practice.menu, S.M5);
  ["tom-collins", "paloma", "cuba-libre", "french-75", "beer", "wine"].forEach((d) => assert.ok(P.rush.menu.includes(d)));
  ["white-lady", "sidecar", "pisco-sour", "french-75", "tom-collins", "paloma", "bloody-mary", "mai-tai", "beer", "wine"].forEach((d) => assert.ok(P.exam.menu.includes(d)));
  assert.deepEqual(P.tutorial.targets, { accuracy: 100, avgTime: 90, waste: 0 });
  assert.deepEqual(P.practice.targets, { accuracy: 90, avgTime: 150, waste: 5 });
  assert.deepEqual(P.rush.targets, { accuracy: 90, avgTime: 300, waste: 5 });
  assert.deepEqual(P.stockout.targets, { accuracy: 90, avgTime: 180, waste: 5 });
  assert.equal(P.tutorial.hints, true); assert.equal(P.exam.hints, false); assert.equal(P.exam.cards, false);
  for (const seed of [1, 2, 3, 99, 2026]) {
    const tu = S.generate("tutorial", seed);
    assert.equal(tu.tickets.length, 5); tu.tickets.forEach((t) => assert.ok(t.drinks.length >= 1 && t.drinks.length <= 2));
    const pr = S.generate("practice", seed);
    pr.tickets.forEach((t, i) => { assert.equal(t.arrival, i * 75); assert.ok(t.drinks.length <= 3); });
    const so = S.generate("stockout", seed);
    so.tickets.forEach((t, i) => assert.equal(t.arrival, i * 70));
    for (const k of ["rush", "exam"]) {
      const g = S.generate(k, seed);
      const a = g.tickets.map((t) => t.arrival);
      assert.equal(a.filter((x) => x < 180).length, 6, k + " wave 1");
      assert.equal(a.filter((x) => x >= 180 && x < 600).length, 6, k + " wave 2");
      assert.equal(a.filter((x) => x >= 600 && x < 1080).length, 8, k + " wave 3");
      g.tickets.forEach((t) => assert.ok(t.drinks.length >= 1 && t.drinks.length <= 4));
      assert.ok(g.tickets.some((t) => /Server/.test(t.source)));
      assert.ok(g.tickets.some((t, i) => /Server/.test(t.source) && g.tickets.some((u, j) => j !== i && u.arrival === t.arrival && u.source === "Bar")), "table and bar together");
      assert.ok(g.sendBack >= 5 && g.sendBack <= 11);
    }
    assert.deepEqual(S.generate("rush", seed), S.generate("rush", seed));
  }
});

test("stock-out shift: lime 300 ml runs out around ticket 6 (6–7), Aperol 200 ml around ticket 11", () => {
  for (const seed of [1, 7, 42, 1234, 99999]) {
    const g = S.generate("stockout", seed);
    assert.equal(g.stock.lime.level, 300); assert.equal(g.stock.aperol.level, 200); assert.equal(g.stock.aperol.storeroom, 1);
    const cum = (key, last) => g.tickets.slice(0, last + 1).reduce((s, t) => s + S.ticketUse(t, key), 0);
    assert.ok(cum("lime", 4) < 300 && cum("lime", 6) >= 300, "lime crosses 300 ml in ticket 6 or 7 (seed " + seed + ")");
    assert.ok(cum("aperol", 9) <= 200 && cum("aperol", 10) > 200, "Aperol crosses 200 ml in ticket 11 (seed " + seed + ")");
    g.tickets.forEach((t) => assert.ok(t.drinks.length >= 1 && t.drinks.length <= 4));
  }
});

test("exam: one seeded stock-out (lime, Aperol or ginger beer) around ticket 8", () => {
  const seen = new Set();
  for (let seed = 1; seed < 40; seed++) {
    const g = S.generate("exam", seed);
    const keys = Object.keys(g.stock);
    assert.equal(keys.length, 1);
    const k = keys[0]; seen.add(k);
    const cum = (last) => g.tickets.slice(0, last + 1).reduce((s, t) => s + S.ticketUse(t, k), 0);
    assert.ok(cum(6) < g.stock[k].level + 1e-9 && cum(7) > g.stock[k].level, "runs out in ticket 8 (seed " + seed + ")");
  }
  assert.deepEqual([...seen].sort(), ["aperol", "gingerbeer", "lime"]);
});

test("stock: blocked pour, barback 60/120 s, fetch 45 s, squeeze 90 s, 86 with a substitute", () => {
  const st = custom([["daiquiri", "margarita"]]);
  st.stock.lime = { key: "lime", label: "Lime juice", juice: true, bottleMl: 500, level: 10, start: 10, storeroom: 0, warnAt: 90, pending: null };
  st.stock.aperol = { key: "aperol", label: "Aperol", juice: false, bottleMl: 1000, level: 0, start: 0, storeroom: 1, warnAt: 120, pending: null };
  const [da, ma] = st.tickets[0].slots;
  ok(st, { type: "glass", slots: [da], glass: "cocktail" });
  ok(st, { type: "vessel", slots: [da], vessel: "tin" });
  assert.equal(S.act(st, { type: "pour", slots: [da], key: "lime", ml: 20 }).ok, false);
  let t = st.now; ok(st, { type: "barback", key: "lime" }); assert.equal(st.now - t, 3);
  assert.equal(S.act(st, { type: "barback", key: "lime" }).ok, false);
  ok(st, { type: "waitNext" }); assert.equal(st.now, t + 3 + 120); assert.equal(st.stock.lime.level, 510);
  t = st.now; ok(st, { type: "squeeze", key: "lime" }); assert.equal(st.now - t, 90);
  t = st.now; ok(st, { type: "fetch", key: "aperol" }); assert.equal(st.now - t, 45); assert.equal(st.stock.aperol.level, 1000);
  assert.equal(S.act(st, { type: "fetch", key: "aperol" }).ok, false);
  // 86: only when out, approved substitute
  st.stock.lime.level = 0;
  assert.equal(S.act(st, { type: "eightySix", slot: ma, sub: "negroni" }).ok, true);
  assert.equal(st.slots[ma].drink, "negroni"); assert.equal(st.slots[ma].sub, true);
  assert.equal(S.act(st, { type: "eightySix", slot: da, sub: "manhattan" }).ok, false, "a started drink must be binned first");
});

test("ops-math service scoring and the 11.4 exam formula", () => {
  near(O.accuracyPct(18, 20), 90);
  near(O.wastePct(30, 600), 5);
  near(O.averageTicketTime([100, 200, 300]), 200);
  assert.equal(O.timePenalty(300), 0); near(O.timePenalty(330), 2); assert.equal(O.timePenalty(1000), 20);
  assert.equal(O.wastePenalty(5), 0); near(O.wastePenalty(6), 2); assert.equal(O.wastePenalty(30), 20);
  assert.deepEqual(O.serviceExamScore(88, 330, 6), { accuracy: 88, timePenalty: 2, wastePenalty: 2, score: 84, pass: true });
  assert.equal(O.serviceExamScore(92, 287, 4).score, 92);
  assert.equal(O.serviceExamScore(10, 900, 40).score, 0);
  assert.equal(O.serviceExamScore(84, 352, 6).score, 79);   // 84 − 3.47 − 2 = 78.5 → 79
  assert.deepEqual(O.meetsTargets({ accuracy: 90, avgTime: 150, waste: 5 }, { accuracy: 90, avgTime: 150, waste: 5 }), { accuracy: true, avgTime: true, waste: true });
});

test("a well-sequenced run meets the targets: tutorial, practice, stock-out (with the order list), rush, exam", () => {
  for (const seed of [1, 2, 3]) {
    const tu = S.createShift("tutorial", seed); const mt = bot(tu);
    assert.equal(mt.accuracy, 100, "tutorial accuracy"); assert.ok(mt.avgTime <= 90, "tutorial " + mt.avgTime); assert.equal(mt.waste, 0);
    const pr = S.createShift("practice", seed); const mp = bot(pr);
    assert.equal(mp.accuracy, 100); assert.ok(mp.avgTime <= 150, "practice avg " + mp.avgTime);
    const so = S.createShift("stockout", seed); const ms = bot(so);
    assert.equal(ms.accuracy, 100); assert.ok(ms.avgTime <= 180, "stockout avg " + ms.avgTime); assert.equal(ms.missingOrUnapproved, 0);
    const sheet = S.countSheet(so);
    assert.equal(sheet.length, 6);
    sheet.forEach((c) => assert.equal(c.order, O.orderFor(c.par, c.onHand)));
    const ru = S.createShift("rush", seed); const mr = bot(ru);
    assert.ok(mr.accuracy >= 90, "rush accuracy " + mr.accuracy); assert.ok(ru.sendBackDone, "a drink was sent back"); assert.ok(ru.waste.remade > 0);
    assert.ok(mr.waste <= 5, "rush waste " + mr.waste); assert.ok(mr.avgTime <= 300, "rush avg " + mr.avgTime);
    const ex = S.createShift("exam", seed); const me = bot(ex);
    assert.ok(me.exam.score >= 70, "exam score " + me.exam.score);
    assert.match(S.copyText(ex, me, "2026-10-18"), /Service score: /);
  }
});

// A learner who simply follows the tutorial's ticket hints.
function followHints(st) {
  let guard = 0;
  while (!st.done && guard++ < 1000) {
    const open = S.openTickets(st).sort((a, b) => a.arrival - b.arrival);
    if (!open.length) { ok(st, { type: "waitNext" }); continue; }
    const t = open[0];
    const steps = t.slots.map((id) => ({ s: st.slots[id], step: S.stepOf(st, st.slots[id]) }));
    const min = Math.min(...steps.map((x) => x.step.rank));
    if (min === 11) { ok(st, { type: "serve", ticket: t.id }); continue; }
    const group = steps.filter((x) => x.step.rank === min);
    const ids = group.map((x) => x.s.id), act = group[0].step.act;
    if (act === "glass") group.forEach((x) => ok(st, { type: "glass", slots: [x.s.id], glass: card(x.s.drink).glass[0] }));
    else if (act === "ice") ok(st, { type: "ice", slots: ids, ice: card(group[0].s.drink).ice });
    else if (act === "tin" || act === "mix") ok(st, { type: "vessel", slots: ids, vessel: act });
    else if (act === "pour" || act === "top") {
      const key = group[0].step.items[0].keys[0];
      const withKey = group.filter((x) => x.step.items.some((it) => it.keys[0] === key));
      if (act === "top") ok(st, { type: "top", slots: withKey.map((x) => x.s.id), key });
      else withKey.forEach((x, i) => { const it = x.step.items.find((y) => y.keys[0] === key); ok(st, { type: "pour", slots: [x.s.id], key, ml: it.checkMl || it.ml }); });
    } else if (act === "garnish") group.forEach((x) => ok(st, { type: "garnish", slots: [x.s.id], garnish: card(x.s.drink).garnish[0] }));
    else ok(st, { type: act, slots: ids });
  }
  return S.metrics(st);
}

test("tutorial: following the ticket hints meets 100% / ≤ 90 s / 0% waste", () => {
  for (const seed of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
    const st = S.createShift("tutorial", seed);
    assert.match(S.ticketHint(st, 1), /^Take the glasses/);
    const m = followHints(st);
    assert.equal(m.accuracy, 100, "seed " + seed + " " + st.errors.map((e) => e.msg).join("; "));
    assert.ok(m.avgTime <= 90, "seed " + seed + " avg " + m.avgTime);
    assert.equal(m.waste, 0);
  }
});
