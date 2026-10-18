/* Service simulation engine (no DOM): presets, ticket generation, the lesson 08.5 time model, correctness,
   dead drinks, stock and scoring. The clock moves only by actions (fixed seconds per action), never by real time.
   Classic script: window.ServiceCore; module.exports under Node. */
(function (root) {
  "use strict";
  var NODE = typeof module !== "undefined" && module.exports;
  var O = NODE ? require("../common/ops-math.js") : root.OpsMath;
  var SC = NODE ? require("./service-cards.js") : root.ServiceCards;
  if (NODE) require("../common/sim.js");
  var Sim = NODE ? globalThis.Sim : root.Sim;
  var CARDS = SC.CARDS, KIND = SC.KIND;

  // ---------- lesson 08.5 time table (shift seconds) ----------
  var T = { glass: 2, ice: 3, pourFirst: 4, pourNext: 2, top: 3, muddle: 8, shake: 12, stir: 20, stirGlass: 5, strain: 3, garnish: 4,
    beer: 8, wine: 6, rinse: 3, bin: 2, serve: 3, barback: 3, barbackBottle: 60, barbackJuice: 120, fetch: 45, squeeze: 90, eightySix: 3 };
  var DEAD_AFTER = 30;
  var TINS = 4, MIXING = 2;
  var BEER_ML = 400, WINE_ML = 150;

  var M5 = ["dry-martini", "manhattan", "old-fashioned", "negroni", "daiquiri", "margarita", "whiskey-sour", "cosmopolitan", "mojito", "moscow-mule", "aperol-spritz", "espresso-martini"];

  var PRESETS = {
    tutorial: { tickets: 5, sizes: [1, 2], menu: ["daiquiri", "margarita", "negroni", "moscow-mule", "cuba-libre", "aperol-spritz"],
      arrivals: { mode: "onServe" }, hints: true, cards: true, targets: { accuracy: 100, avgTime: 90, waste: 0 } },
    practice: { tickets: 12, sizes: [1, 3], menu: M5, arrivals: { mode: "every", every: 75 }, hints: false, cards: true, targets: { accuracy: 90, avgTime: 150, waste: 5 } },
    rush: { tickets: 20, sizes: [1, 4], rounds: true, menu: M5.concat(["tom-collins", "paloma", "cuba-libre", "french-75", "beer", "wine"]),
      arrivals: { mode: "waves", waves: [[6, 0, 180], [6, 180, 600], [8, 600, 1080]] }, together: true, sendBack: true, hints: false, cards: true,
      targets: { accuracy: 90, avgTime: 300, waste: 5 } },
    stockout: { tickets: 15, sizes: [1, 3], menu: M5, arrivals: { mode: "every", every: 70 }, hints: false, cards: true, stockout: "fixed",
      targets: { accuracy: 90, avgTime: 180, waste: 5 } },
    exam: { tickets: 20, sizes: [1, 4], rounds: true,
      menu: M5.concat(["white-lady", "sidecar", "pisco-sour", "french-75", "tom-collins", "paloma", "bloody-mary", "mai-tai", "beer", "wine"]),
      arrivals: { mode: "waves", waves: [[6, 0, 180], [6, 180, 600], [8, 600, 1080]] }, together: true, sendBack: true, hints: false, cards: false,
      stockout: "seeded", targets: { accuracy: 90, avgTime: 300, waste: 5 }, exam: true }
  };

  // Stock items that can run out (others are unlimited at the station).
  var STOCK_DEF = {
    lime: { label: "Lime juice", juice: true, bottleMl: 500 },
    aperol: { label: "Aperol", juice: false, bottleMl: 1000 },
    gingerbeer: { label: "Ginger beer", juice: false, bottleMl: 1000 },
    whiterum: { label: "White rum", juice: false, bottleMl: 750 },
    vodka: { label: "Vodka", juice: false, bottleMl: 700 },
    tequila: { label: "Tequila 100% agave", juice: false, bottleMl: 700 },
    cointreau: { label: "Cointreau (triple sec)", juice: false, bottleMl: 700 },
    gin: { label: "London dry gin", juice: false, bottleMl: 700 }
  };
  // Stock-out shift (lesson 08.4): end-of-shift count of six items with par levels.
  var COUNT_ITEMS = [
    { key: "whiterum", par: 4, open: 0.8, storeroom: 1 }, { key: "vodka", par: 4, open: 0.7, storeroom: 1 },
    { key: "tequila", par: 3, open: 0.9, storeroom: 0 }, { key: "aperol", par: 6, open: 0.2, storeroom: 1 },
    { key: "cointreau", par: 2, open: 0.6, storeroom: 0 }, { key: "gin", par: 3, open: 0.5, storeroom: 1 }
  ];

  function usesKey(drinkId, key) {
    var c = CARDS[drinkId]; if (!c) return 0;
    var it = c.items.filter(function (i) { return i.keys[0] === key; })[0];
    return it ? it.ml : 0;
  }
  function ticketUse(t, key) { return t.drinks.reduce(function (s, d) { return s + usesKey(d, key); }, 0); }

  // ---------- ticket generation ----------
  function pickSize(r, p) {
    var lo = p.sizes[0], hi = p.sizes[1];
    if (hi === 2) return 1 + r.int(2);
    if (hi === 3) { var x = r(); return x < 0.4 ? 1 : x < 0.75 ? 2 : 3; }
    var y = r(); return y < 0.3 ? 1 : y < 0.65 ? 2 : y < 0.85 ? 3 : 4;
  }

  function generate(presetKey, seed) {
    var p = PRESETS[presetKey], r = Sim.rng(seed);
    var tickets = [];
    for (var i = 0; i < p.tickets; i++) {
      var drinks = [];
      if (p.rounds && r() < 0.25) {
        // rounds of one drink: shaken, built or beer (two mixing glasses cannot finish a round of stirred drinks together)
        var d = r.pick(p.menu.filter(function (x) { return x !== "wine" && CARDS[x].method !== "stir"; }));
        var n = 3 + r.int(2);
        for (var k = 0; k < n; k++) drinks.push(d);
      } else {
        var size = pickSize(r, p);
        if (p.rounds && size === 4) size = 3; // mixed tickets up to 3; 4 only as rounds of 3–4 or the server table
        for (var j = 0; j < size; j++) drinks.push(r.pick(p.menu));
      }
      tickets.push({ id: i + 1, drinks: drinks, source: "Bar" });
    }
    // arrivals
    if (p.arrivals.mode === "every") tickets.forEach(function (t, i) { t.arrival = i * p.arrivals.every; });
    else if (p.arrivals.mode === "onServe") tickets.forEach(function (t, i) { t.arrival = i === 0 ? 0 : null; });
    else {
      var times = [];
      p.arrivals.waves.forEach(function (w) { for (var q = 0; q < w[0]; q++) times.push(w[1] + Math.floor(r() * (w[2] - w[1]))); });
      times.sort(function (a, b) { return a - b; });
      times[0] = 0;
      tickets.forEach(function (t, i) { t.arrival = times[i]; });
    }
    // a server's table ticket and bar guests' tickets arrive together (wave 1)
    if (p.together) {
      var ti = 2 + r.int(2);
      var table = tickets[ti];
      table.source = "Server · table " + (4 + r.int(12));
      if (table.drinks.length < 4 && !allSame(table.drinks)) { while (table.drinks.length < 4) table.drinks.push(r.pick(p.menu)); }
      tickets[ti + 1].arrival = table.arrival;
      tickets[ti + 1].source = "Bar";
    }
    tickets.forEach(function (t) { if (t.source === "Bar" && p.together && r() < 0.25 && t.drinks.length >= 3) t.source = "Server · table " + (4 + r.int(12)); });
    var stock = {};
    if (p.stockout === "fixed") stock = stockoutFixed(tickets, r);
    else if (p.stockout === "seeded") stock = stockoutSeeded(tickets, r, p);
    var sendBack = p.sendBack ? 5 + r.int(7) : null; // ticket index from which a correct drink is sent back
    return { tickets: tickets, stock: stock, sendBack: sendBack };
  }
  function allSame(a) { return a.every(function (x) { return x === a[0]; }); }

  var LIME_DRINKS = ["daiquiri", "mojito", "margarita", "cosmopolitan", "moscow-mule"];
  var NEUTRAL = ["old-fashioned", "negroni", "manhattan", "dry-martini", "espresso-martini", "whiskey-sour"];
  function cum(tickets, key, last) { var s = 0; for (var i = 0; i <= last; i++) s += ticketUse(tickets[i], key); return s; }

  // Lesson 08.4: lime juice starts at 300 ml and runs out around ticket 6 (here: in ticket 6 or 7);
  // the open Aperol (200 ml) around ticket 11.
  function stockoutFixed(tickets, r) {
    var guard = 0;
    while (cum(tickets, "lime", 6) < 300 && guard++ < 200) {
      var cands = [];
      for (var i = 0; i <= 6; i++) tickets[i].drinks.forEach(function (d, j) { if (usesKey(d, "lime") < 20) cands.push([i, j]); });
      var small = tickets.slice(0, 7).map(function (t, i) { return [i, t.drinks.length]; }).filter(function (x) { return x[1] < 3; });
      if (cands.length) { var c = r.pick(cands); tickets[c[0]].drinks[c[1]] = r() < 0.5 ? "daiquiri" : "mojito"; }
      else if (small.length) tickets[r.pick(small)[0]].drinks.push(r() < 0.5 ? "daiquiri" : "mojito");
      else break;
    }
    guard = 0;
    while (cum(tickets, "lime", 4) >= 300 && guard++ < 200) {
      var lc = [];
      for (var a = 0; a <= 4; a++) tickets[a].drinks.forEach(function (d, j) { if (usesKey(d, "lime")) lc.push([a, j]); });
      var x = r.pick(lc); tickets[x[0]].drinks[x[1]] = r.pick(NEUTRAL);
    }
    // aperol: at most 3 Spritzes (180 ml) in tickets 1–10, a fourth in ticket 11
    var seen = 0;
    for (var t = 0; t <= 9; t++) tickets[t].drinks.forEach(function (d, j) {
      if (d === "aperol-spritz") { seen++; if (seen > 3) tickets[t].drinks[j] = r.pick(NEUTRAL); }
    });
    var spare = [];
    for (var u = 6; u <= 9; u++) tickets[u].drinks.forEach(function (d, j) { if (NEUTRAL.indexOf(d) >= 0) spare.push([u, j]); });
    while (seen < 3 && spare.length) { var s = spare.splice(r.int(spare.length), 1)[0]; tickets[s[0]].drinks[s[1]] = "aperol-spritz"; seen++; }
    if (seen < 3) for (var u2 = 0; u2 <= 9; u2++) tickets[u2].drinks.forEach(function (d, j) { if (d !== "aperol-spritz" && !usesKey(d, "lime")) spare.push([u2, j]); });
    while (seen < 3 && spare.length) { var s2 = spare.splice(r.int(spare.length), 1)[0]; if (tickets[s2[0]].drinks[s2[1]] !== "aperol-spritz") { tickets[s2[0]].drinks[s2[1]] = "aperol-spritz"; seen++; } }
    for (var u3 = 7; seen < 3 && u3 <= 9; u3++) if (tickets[u3].drinks.length < 3) { tickets[u3].drinks.push("aperol-spritz"); seen++; }
    if (tickets[10].drinks.indexOf("aperol-spritz") < 0) {
      var k = tickets[10].drinks.findIndex(function (d) { return !usesKey(d, "lime"); });
      if (k >= 0) tickets[10].drinks[k] = "aperol-spritz"; else tickets[10].drinks.push("aperol-spritz");
    }
    var stock = {
      lime: { level: 300, storeroom: 0 },
      aperol: { level: 200, storeroom: 1 }
    };
    COUNT_ITEMS.forEach(function (c) {
      if (c.key === "aperol") return;
      var def = STOCK_DEF[c.key];
      var need = cum(tickets, c.key, tickets.length - 1);
      var lvl = Math.max(Math.round(c.open * def.bottleMl), need + 150);
      stock[c.key] = { level: Math.min(lvl, def.bottleMl * 2), storeroom: c.storeroom };
      if (stock[c.key].level < need + 100) stock[c.key].level = need + 150;
    });
    return stock;
  }

  // Lesson 11.4: one seeded stock-out (lime juice, Aperol or ginger beer) around ticket 8.
  function stockoutSeeded(tickets, r, p) {
    var key = r.pick(["lime", "aperol", "gingerbeer"]);
    var drinkFor = { lime: ["daiquiri", "margarita", "mojito", "mai-tai"], aperol: ["aperol-spritz"], gingerbeer: ["moscow-mule"] }[key];
    var t8 = tickets[7];
    if (ticketUse(t8, key) === 0) {
      var j = t8.drinks.findIndex(function (d) { return d !== "beer" && d !== "wine"; });
      if (allSame(t8.drinks)) t8.drinks = t8.drinks.map(function () { return drinkFor[0]; });
      else t8.drinks[j < 0 ? 0 : j] = r.pick(drinkFor);
    }
    var before = cum(tickets, key, 6), at8 = ticketUse(t8, key);
    var level = before + Math.max(1, Math.floor(at8 / 2));
    var o = {}; o[key] = { level: level, storeroom: STOCK_DEF[key].juice ? 0 : 1 };
    return o;
  }

  // ---------- shift state ----------
  function createShift(presetKey, seed) {
    var p = PRESETS[presetKey];
    var g = generate(presetKey, seed);
    var st = {
      preset: presetKey, seed: seed, p: p, now: 0, lastBottle: null, log: [], errors: [],
      tickets: g.tickets.map(function (t) { return { id: t.id, arrival: t.arrival, source: t.source, drinks: t.drinks.slice(), slots: [], servedAt: null }; }),
      slots: {}, nextSlot: 1, vessels: [], deliveries: [], stock: {}, sendBackFrom: g.sendBack, sendBackDone: false, remake: null,
      pouredMl: 0, wasteMl: 0, waste: { binned: 0, dead: 0, remade: 0 }, usage: {}, done: false, finishedAt: null
    };
    for (var i = 1; i <= TINS; i++) st.vessels.push({ id: "T" + i, type: "tin", state: "clean", slot: null });
    for (var m = 1; m <= MIXING; m++) st.vessels.push({ id: "M" + m, type: "mix", state: "clean", slot: null });
    Object.keys(g.stock).forEach(function (k) {
      var def = STOCK_DEF[k];
      st.stock[k] = { key: k, label: def.label, juice: def.juice, bottleMl: def.bottleMl, level: g.stock[k].level, start: g.stock[k].level,
        storeroom: g.stock[k].storeroom, warnAt: ({ lime: 90, aperol: 120, gingerbeer: 240 })[k] || 0, pending: null, eightySixed: false };
    });
    st.tickets.forEach(function (t) { t.drinks.forEach(function (d) { t.slots.push(newSlot(st, t.id, d)); }); });
    return st;
  }

  function newSlot(st, ticketId, drinkId) {
    var id = st.nextSlot++;
    st.slots[id] = { id: id, ticket: ticketId, drink: drinkId, ordered: drinkId, sub: false, glass: null, ice: "none", vessel: null, usedVessel: null,
      vc: {}, gc: {}, muddled: false, shaken: 0, stirred: 0, stirredGlass: 0, strained: false, garnish: null, shakenAt: null, strainedAt: null,
      lastStep: null, warmInVessel: false, result: null };
    return id;
  }

  function visibleTickets(st) { return st.tickets.filter(function (t) { return t.arrival !== null && t.arrival <= st.now && t.servedAt === null; }); }
  function openTickets(st) { var v = visibleTickets(st); if (st.remake && st.remake.servedAt === null && st.remake.arrival <= st.now) v.push(st.remake); return v; }
  function ticketById(st, id) { if (st.remake && st.remake.id === id) return st.remake; return st.tickets.filter(function (t) { return t.id === id; })[0]; }

  function nextEventTime(st) {
    var times = [];
    st.tickets.forEach(function (t) { if (t.arrival !== null && t.arrival > st.now) times.push(t.arrival); });
    st.deliveries.forEach(function (d) { if (d.at > st.now) times.push(d.at); });
    return times.length ? Math.min.apply(null, times) : null;
  }

  function addContent(obj, key, ml) { if (!obj[key]) obj[key] = { ml: 0, n: 0 }; obj[key].ml += ml; obj[key].n += 1; }
  function slotMl(s) { var t = 0; [s.vc, s.gc].forEach(function (o) { Object.keys(o).forEach(function (k) { t += o[k].ml; }); }); return t; }
  function nameOf(s, st) { var c = CARDS[s.drink]; return (c ? c.name : s.drink) + " (ticket " + (s.ticket === "R" ? "remake" : "#" + s.ticket) + ")"; }
  function cardItemFor(drinkId, key) { var c = CARDS[drinkId]; if (!c) return null; return c.items.filter(function (i) { return i.keys.indexOf(key) >= 0; })[0] || null; }

  function getSlots(st, ids) {
    var out = [];
    for (var i = 0; i < (ids || []).length; i++) {
      var s = st.slots[ids[i]];
      if (!s || s.result) return null;
      var t = ticketById(st, s.ticket);
      if (!t || t.arrival === null || t.arrival > st.now) return null;
      out.push(s);
    }
    return out;
  }

  function fail(msg) { return { ok: false, msg: msg, dt: 0 }; }

  // ---------- actions ----------
  function act(st, a) {
    if (st.done) return fail("The shift is over.");
    var res = doAct(st, a);
    if (!res.ok) return res;
    st.lastBottle = res.bottle || null;
    var t0 = st.now;
    st.now += res.dt;
    (res.touched || []).forEach(function (s) { s.lastStep = st.now; });
    if (res.after) res.after(st);
    processEvents(st);
    if (res.dt || res.msg) st.log.unshift({ t: t0, dt: res.dt, msg: res.msg });
    checkEnd(st);
    return res;
  }

  function need(slots, msg) { return !slots || !slots.length ? fail(msg || "Select one or more drinks first.") : null; }

  function doAct(st, a) {
    var slots = a.slots ? getSlots(st, a.slots) : null, e, dt, i;
    switch (a.type) {
      case "glass":
        if ((e = need(slots))) return e;
        if (slots.some(function (s) { return s.glass; })) return fail("A selected drink already has a glass.");
        slots.forEach(function (s) { s.glass = a.glass; });
        return { ok: true, dt: T.glass * slots.length, touched: slots, msg: "Glass out (" + glassName(a.glass) + ") × " + slots.length };
      case "ice":
        if ((e = need(slots))) return e;
        if (slots.some(function (s) { return !s.glass; })) return fail("Take the glass first.");
        if (slots.some(function (s) { return s.ice !== "none"; })) return fail("A selected glass already has ice.");
        slots.forEach(function (s) { s.ice = a.ice; });
        return { ok: true, dt: T.ice * slots.length, touched: slots, msg: "Ice (" + a.ice + ") in " + slots.length + " glass" + (slots.length > 1 ? "es" : "") };
      case "vessel":
        if ((e = need(slots))) return e;
        if (slots.some(function (s) { return s.vessel || s.strained; })) return fail("A selected drink already has a tin or mixing glass.");
        var type = a.vessel === "mix" ? "mix" : "tin", rinses = 0, got = [];
        for (i = 0; i < slots.length; i++) {
          var v = st.vessels.filter(function (x) { return x.type === type && x.state === "clean"; })[0];
          if (!v) { v = st.vessels.filter(function (x) { return x.type === type && x.state === "dirty"; })[0]; if (v) rinses++; }
          if (!v) { got.forEach(function (g) { g.state = g.wasState; g.slot = null; }); return fail("No free " + (type === "tin" ? "tin (4 on the station)" : "mixing glass (2 on the station)") + ": strain or bin a drink first."); }
          v.wasState = v.state; v.state = "inuse"; v.slot = slots[i].id; got.push(v);
        }
        slots.forEach(function (s, k) { s.vessel = got[k].id; s.usedVessel = type; });
        return { ok: true, dt: T.rinse * rinses, touched: [], msg: (type === "tin" ? "Tin" : "Mixing glass") + " for " + slots.length + " drink" + (slots.length > 1 ? "s" : "") + (rinses ? " (rinsed " + rinses + ")" : "") };
      case "pour":
        if ((e = need(slots))) return e;
        var kind = KIND[a.key];
        if (!kind) return fail("Choose an ingredient.");
        if (kind === "top" && a.key !== "sparkling") return fail("Use Top for soda, ginger beer, cola and grapefruit soda.");
        if (slots.some(function (s) { return !s.vessel && !s.glass; })) return fail("Take a glass, tin or mixing glass first.");
        var amounts = slots.map(function (s) {
          if (kind === "add") { var it = cardItemFor(s.drink, a.key); return it ? it.ml : 0; }
          return Number(a.ml);
        });
        if (kind === "pour" && !(Number(a.ml) > 0 && Number(a.ml) <= 250)) return fail("Enter the ml to pour (1–250).");
        var total = amounts.reduce(function (x, y) { return x + y; }, 0);
        if ((e = stockCheck(st, a.key, total))) return e;
        slots.forEach(function (s, k) { addContent(s.vessel ? s.vc : s.gc, a.key, amounts[k]); });
        useStock(st, a.key, total);
        dt = (st.lastBottle === a.key ? T.pourNext : T.pourFirst) + T.pourNext * (slots.length - 1);
        return { ok: true, dt: dt, touched: slots, bottle: a.key, msg: (kind === "add" ? "Add " : "Pour ") + bottleName(a.key) + (kind === "pour" ? " " + a.ml + " ml" : "") + " → " + slots.map(nameOf).join(", ") };
      case "top":
        if ((e = need(slots))) return e;
        if (SC.TOPS.indexOf(a.key) < 0) return fail("Choose what to top with.");
        if (slots.some(function (s) { return !s.glass; })) return fail("Tops go into the glass: take the glass first.");
        if (slots.some(function (s) { return s.vessel; })) return fail("Strain the drink into its glass before topping.");
        var am = slots.map(function (s) { var it = cardItemFor(s.drink, a.key); return it ? it.ml : 60; });
        var tot = am.reduce(function (x, y) { return x + y; }, 0);
        if ((e = stockCheck(st, a.key, tot))) return e;
        slots.forEach(function (s, k) { addContent(s.gc, a.key, am[k]); });
        useStock(st, a.key, tot);
        return { ok: true, dt: T.top * slots.length, touched: slots, msg: "Top with " + bottleName(a.key) + " → " + slots.map(nameOf).join(", ") };
      case "muddle":
        if ((e = need(slots))) return e;
        if (slots.some(function (s) { return isEmpty(s.vessel ? s.vc : s.gc); })) return fail("Put the ingredients in first, then muddle.");
        slots.forEach(function (s) { s.muddled = true; });
        return { ok: true, dt: T.muddle * slots.length, touched: slots, msg: "Muddle × " + slots.length };
      case "shake":
      case "stir":
        if ((e = need(slots))) return e;
        var vt = a.type === "shake" ? "tin" : "mix";
        if (slots.some(function (s) { return !s.vessel || s.usedVessel !== vt; })) return fail(a.type === "shake" ? "Shaking needs the drink in a tin." : "Stirring needs the drink in a mixing glass (or use Stir in glass for a built drink).");
        if (slots.some(function (s) { return isEmpty(s.vc); })) return fail("The " + (vt === "tin" ? "tin" : "mixing glass") + " is empty.");
        slots.forEach(function (s) { if (a.type === "shake") s.shaken++; else s.stirred++; });
        var groups = Math.ceil(slots.length / 2);
        return { ok: true, dt: (a.type === "shake" ? T.shake : T.stir) * groups, touched: slots,
          after: function (stt) { slots.forEach(function (s) { s.shakenAt = stt.now; }); },
          msg: (a.type === "shake" ? "Shake" : "Stir") + " " + slots.length + " (" + groups + "× " + (a.type === "shake" ? "12" : "20") + " s, two at once)" };
      case "stirGlass":
        if ((e = need(slots))) return e;
        if (slots.some(function (s) { return s.vessel || !s.glass || isEmpty(s.gc); })) return fail("Stir in glass is for a built drink with its ingredients in the glass.");
        slots.forEach(function (s) { s.stirredGlass++; });
        return { ok: true, dt: T.stirGlass * slots.length, touched: slots, msg: "Stir in glass × " + slots.length };
      case "strain":
        if ((e = need(slots))) return e;
        if (slots.some(function (s) { return !s.vessel; })) return fail("Only drinks in a tin or mixing glass can be strained.");
        if (slots.some(function (s) { return !s.glass; })) return fail("Take the glass first.");
        return { ok: true, dt: T.strain * slots.length, touched: slots, msg: "Strain × " + slots.length,
          after: function (stt) {
            slots.forEach(function (s) {
              Object.keys(s.vc).forEach(function (k) { if (!s.gc[k]) s.gc[k] = { ml: 0, n: 0 }; s.gc[k].ml += s.vc[k].ml; s.gc[k].n += s.vc[k].n; });
              s.vc = {};
              if (s.shakenAt !== null && stt.now - s.shakenAt > DEAD_AFTER + T.strain * slots.length) s.warmInVessel = true;
              s.strained = true; s.strainedAt = stt.now;
              var v = vesselById(stt, s.vessel); v.state = "dirty"; v.slot = null; s.vessel = null;
            });
          } };
      case "garnish":
        if ((e = need(slots))) return e;
        if (!a.garnish) return fail("Choose a garnish.");
        if (slots.some(function (s) { return !s.glass; })) return fail("Take the glass first.");
        slots.forEach(function (s) { s.garnish = a.garnish; });
        return { ok: true, dt: T.garnish * slots.length, touched: slots, msg: "Garnish (" + garnishName(a.garnish) + ") × " + slots.length };
      case "beer":
      case "wine":
        if ((e = need(slots))) return e;
        if (slots.some(function (s) { return !s.glass || s.vessel; })) return fail("Take the glass first.");
        slots.forEach(function (s) { addContent(s.gc, a.type, a.type === "beer" ? BEER_ML : WINE_ML); });
        st.pouredMl += (a.type === "beer" ? BEER_ML : WINE_ML) * slots.length;
        addUsage(st, a.type, (a.type === "beer" ? BEER_ML : WINE_ML) * slots.length);
        return { ok: true, dt: (a.type === "beer" ? T.beer : T.wine) * slots.length, touched: slots, msg: (a.type === "beer" ? "Draught beer" : "Glass of wine") + " × " + slots.length };
      case "bin":
        if ((e = need(slots))) return e;
        var binned = 0;
        slots.forEach(function (s) {
          binned += slotMl(s);
          if (s.vessel) { var v2 = vesselById(st, s.vessel); v2.state = "dirty"; v2.slot = null; }
          var fresh = newSlotObj(s);
          Object.keys(fresh).forEach(function (k) { s[k] = fresh[k]; });
        });
        st.wasteMl += binned; st.waste.binned += binned;
        st.errors.push({ t: st.now, msg: "Binned " + slots.map(nameOf).join(", ") + " (" + Math.round(binned) + " ml)" });
        return { ok: true, dt: T.bin * slots.length, touched: [], msg: "Bin × " + slots.length + " (" + Math.round(binned) + " ml wasted)" };
      case "serve":
        var t = ticketById(st, a.ticket);
        if (!t || t.servedAt !== null || t.arrival === null || t.arrival > st.now) return fail("That ticket is not open.");
        var ts = t.slots.map(function (id) { return st.slots[id]; });
        if (ts.some(function (s) { return !s.glass || isEmpty(s.gc); })) return fail("Every drink on the ticket needs to be in its glass before you serve.");
        if (ts.some(function (s) { return s.vessel; })) return fail("A drink on this ticket is still in its tin or mixing glass: strain it first.");
        return { ok: true, dt: T.serve, touched: [], msg: "Serve ticket " + (t.remake ? "(remake)" : "#" + t.id), after: function (stt) { serveTicket(stt, t); } };
      case "barback":
      case "fetch":
      case "squeeze":
        var sk = st.stock[a.key];
        if (!sk) return fail("That item does not run out in this shift.");
        if (a.type === "barback") {
          if (sk.pending) return fail("The barback is already bringing " + sk.label + ".");
          if (!sk.juice && sk.storeroom < 1) return fail("No backup " + sk.label + " in the storeroom: 86 the drinks that need it and offer a substitute.");
          return { ok: true, dt: T.barback, touched: [], msg: "Asked the barback for " + sk.label + " (arrives in " + (sk.juice ? T.barbackJuice : T.barbackBottle) + " s)",
            after: function (stt) { var at = stt.now + (sk.juice ? T.barbackJuice : T.barbackBottle); sk.pending = at; stt.deliveries.push({ key: a.key, at: at }); } };
        }
        if (a.type === "fetch") {
          if (sk.juice) return fail("Juice is squeezed, not fetched: squeeze it yourself or ask the barback.");
          if (sk.storeroom < 1) return fail("No backup in the storeroom.");
          return { ok: true, dt: T.fetch, touched: [], msg: "Fetched " + sk.label + " from the storeroom", after: function () { sk.storeroom--; sk.level += sk.bottleMl; } };
        }
        if (!sk.juice) return fail("Only juice can be squeezed.");
        return { ok: true, dt: T.squeeze, touched: [], msg: "Squeezed a new bottle of " + sk.label, after: function () { sk.level += sk.bottleMl; } };
      case "eightySix":
        var s86 = getSlots(st, [a.slot]);
        if (!s86) return fail("Select the drink to 86.");
        var sl = s86[0];
        if (sl.glass || sl.vessel || !isEmpty(sl.gc)) return fail("Bin what you started for this drink first, then 86 it.");
        if (!CARDS[a.sub] || st.p.menu.indexOf(a.sub) < 0 || a.sub === sl.drink) return fail("Choose a substitute from the menu.");
        var outKey = Object.keys(st.stock).filter(function (k) { return usesKey(sl.drink, k) && st.stock[k].level < usesKey(sl.drink, k); })[0];
        if (!outKey) return fail("Only 86 a drink when an ingredient for it has run out.");
        if (Object.keys(st.stock).some(function (k) { return usesKey(a.sub, k) && st.stock[k].level < usesKey(a.sub, k); })) return fail("The substitute needs something that is also out.");
        return { ok: true, dt: T.eightySix, touched: [], msg: "86 " + nameOf(sl) + " (" + st.stock[outKey].label + " out): server offers " + CARDS[a.sub].name,
          after: function () { sl.sub = true; sl.drink = a.sub; st.stock[outKey].eightySixed = true; } };
      case "wait":
        var w = Math.max(1, Math.min(600, Math.round(a.seconds || 10)));
        return { ok: true, dt: w, touched: [], msg: "Wait " + w + " s" };
      case "waitNext":
        var nt = nextEventTime(st);
        if (nt === null) return fail("Nothing more is coming: finish and serve the open tickets.");
        return { ok: true, dt: nt - st.now, touched: [], msg: "Wait " + (nt - st.now) + " s for the next ticket or delivery" };
    }
    return fail("Unknown action.");
  }

  function newSlotObj(s) {
    return { glass: null, ice: "none", vessel: null, usedVessel: null, vc: {}, gc: {}, muddled: false, shaken: 0, stirred: 0, stirredGlass: 0,
      strained: false, garnish: null, shakenAt: null, strainedAt: null, lastStep: null, warmInVessel: false, result: null, drink: s.drink };
  }
  function isEmpty(o) { return !Object.keys(o).length; }
  function vesselById(st, id) { return st.vessels.filter(function (v) { return v.id === id; })[0]; }

  function stockCheck(st, key, ml) {
    var sk = st.stock[key];
    if (!sk || ml <= 0) return null;
    if (sk.level + 1e-9 < ml) return fail(sk.label + ": only " + Math.round(sk.level) + " ml left. Ask the barback, " + (sk.juice ? "squeeze some yourself" : "fetch it from the storeroom") + ", or 86 the drink and offer a substitute.");
    return null;
  }
  function useStock(st, key, ml) {
    st.pouredMl += ml; addUsage(st, key, ml);
    if (st.stock[key]) st.stock[key].level -= ml;
  }
  function addUsage(st, key, ml) { st.usage[key] = (st.usage[key] || 0) + ml; }

  function processEvents(st) {
    st.deliveries = st.deliveries.filter(function (d) {
      if (d.at > st.now) return true;
      var sk = st.stock[d.key];
      sk.level += sk.bottleMl; if (!sk.juice) sk.storeroom--; sk.pending = null;
      st.log.unshift({ t: d.at, dt: 0, msg: "Barback delivered " + sk.label });
      return false;
    });
  }

  // ---------- correctness ----------
  function evaluate(s, servedAt) {
    var c = CARDS[s.drink], problems = [], missing = false, unapproved = false;
    if (c.glass.indexOf(s.glass) < 0) problems.push("wrong glass (" + glassName(s.glass) + "; card: " + c.glass.map(glassName).join(" or ") + ")");
    if (s.ice !== c.ice) problems.push("ice: " + s.ice + " (card: " + c.ice + ")");
    var g = s.gc;
    if (c.method === "beer" || c.method === "wine") {
      if (!g[c.method]) { problems.push("no " + (c.method === "beer" ? "beer" : "wine") + " poured"); missing = true; }
      Object.keys(g).forEach(function (k) { if (k !== c.method) { problems.push("extra: " + bottleName(k)); unapproved = true; } });
    } else {
      c.items.forEach(function (it) {
        var have = it.keys.filter(function (k) { return g[k]; });
        if (!have.length) { if (!it.optional) { problems.push("missing " + it.item); missing = true; } return; }
        if (it.checkMl !== null && it.checkMl !== undefined) {
          var ml = have.reduce(function (t, k) { return t + g[k].ml; }, 0);
          if (Math.abs(ml - it.checkMl) > 5 + 1e-9) problems.push(it.item + " " + round1(ml) + " ml (card " + it.checkMl + " ml, ±5)");
        }
      });
      Object.keys(g).forEach(function (k) {
        if (!c.items.some(function (it) { return it.keys.indexOf(k) >= 0; })) { problems.push("not on the card: " + bottleName(k)); unapproved = true; }
      });
      // method
      if (c.method === "shake" && !(s.usedVessel === "tin" && s.shaken && s.strained)) problems.push("method: card says shake and strain");
      if (c.method === "stir" && !(s.usedVessel === "mix" && s.stirred && s.strained)) problems.push("method: card says stir in a mixing glass and strain");
      if (c.method === "build") {
        if (s.usedVessel) problems.push("method: card says build in the glass");
        if (c.stirInGlass && !s.stirredGlass) problems.push("method: stir it in the glass");
      }
      if (c.method !== "build" && s.stirredGlass) problems.push("method: stirred in the glass");
      if (c.muddle && !s.muddled) problems.push("method: muddle");
      if (!c.muddle && s.muddled) problems.push("method: muddled (not on the card)");
    }
    var gar = s.garnish || "none";
    if (c.garnish.indexOf(gar) < 0) problems.push("garnish: " + garnishName(gar) + " (card: " + c.garnish.map(garnishName).join(" or ") + ")");
    var dead = false, deadWhy = "";
    if (s.lastStep !== null && servedAt - s.lastStep > DEAD_AFTER) { dead = true; deadWhy = "waited " + (servedAt - s.lastStep) + " s after its last step"; }
    if (s.warmInVessel) { dead = true; deadWhy = deadWhy || "left on ice in the " + (s.usedVessel === "mix" ? "mixing glass" : "tin") + " for more than 30 s before straining"; }
    if (dead) problems.push("dead: " + deadWhy);
    return { correct: problems.length === 0, problems: problems, dead: dead, missing: missing, unapproved: unapproved, ml: slotMl(s) };
  }
  function round1(x) { return Math.round(x * 10) / 10; }

  function serveTicket(st, t) {
    t.servedAt = st.now;
    t.slots.forEach(function (id) {
      var s = st.slots[id];
      s.result = evaluate(s, st.now);
      if (s.result.dead) { st.wasteMl += s.result.ml; st.waste.dead += s.result.ml; }
      if (!s.result.correct) st.errors.push({ t: st.now, msg: nameOf(s) + ": " + s.result.problems.join("; ") });
    });
    if (t.remake) {
      var orig = st.slots[t.of];
      var r = st.slots[t.slots[0]].result;
      orig.remakeResult = r;
      if (!r.correct) { orig.result = { correct: false, problems: ["remake: " + r.problems.join("; ")], dead: r.dead, missing: r.missing, unapproved: r.unapproved, ml: orig.result.ml }; }
      return;
    }
    // one guest sends a correct drink back (rush, exam): remake = waste, not an error
    if (st.sendBackFrom !== null && !st.sendBackDone && t.id - 1 >= st.sendBackFrom) {
      var ok = t.slots.map(function (id) { return st.slots[id]; }).filter(function (s) { return s.result.correct && s.drink !== "beer" && s.drink !== "wine"; })[0];
      if (ok) {
        st.sendBackDone = true;
        st.wasteMl += ok.result.ml; st.waste.remade += ok.result.ml;
        var rid = "R";
        st.remake = { id: rid, remake: true, of: ok.id, arrival: st.now, source: "Sent back", drinks: [ok.drink], slots: [], servedAt: null,
          note: "The guest sends back the " + CARDS[ok.drink].name + " from ticket #" + t.id + " (\"not what I expected\"). It was made to spec: remake it." };
        st.remake.slots.push(newSlot(st, rid, ok.drink));
        st.log.unshift({ t: st.now, dt: 0, msg: st.remake.note });
      }
    }
    if (st.p.arrivals.mode === "onServe") {
      var nxt = st.tickets.filter(function (x) { return x.arrival === null; })[0];
      if (nxt) nxt.arrival = st.now;
    }
  }

  function checkEnd(st) {
    var all = st.tickets.every(function (t) { return t.servedAt !== null; });
    var remakeOk = !st.remake || st.remake.servedAt !== null;
    if (all && remakeOk) { st.done = true; st.finishedAt = st.now; }
  }

  // ---------- metrics ----------
  function metrics(st) {
    var ordered = 0, correct = 0, missingOrUnapproved = 0, dead = 0, times = [];
    st.tickets.forEach(function (t) {
      t.slots.forEach(function (id) {
        var s = st.slots[id]; ordered++;
        if (s.result && s.result.correct) correct++;
        if (s.result && (s.result.missing || s.result.unapproved)) missingOrUnapproved++;
        if (s.result && s.result.dead) dead++;
      });
      if (t.servedAt !== null) times.push(t.servedAt - t.arrival);
    });
    var acc = O.accuracyPct(correct, ordered), avg = O.averageTicketTime(times), waste = O.wastePct(st.wasteMl, st.pouredMl);
    var m = { ordered: ordered, correct: correct, accuracy: acc, avgTime: avg, waste: waste, wasteMl: st.wasteMl, pouredMl: st.pouredMl,
      served: times.length, tickets: st.tickets.length, dead: dead, missingOrUnapproved: missingOrUnapproved, shiftSeconds: st.now };
    m.targets = O.meetsTargets(m, st.p.targets);
    if (st.p.exam) m.exam = O.serviceExamScore(acc, avg, waste);
    return m;
  }

  // End-of-shift count (stock-out shift): on hand in bottles (tenths) and the correct order.
  function countSheet(st) {
    if (st.preset !== "stockout") return [];
    return COUNT_ITEMS.map(function (c) {
      var sk = st.stock[c.key];
      var onHand = Math.round((Math.max(0, sk.level) / sk.bottleMl + sk.storeroom) * 10) / 10;
      return { key: c.key, label: sk.label, par: c.par, onHand: onHand, order: O.orderFor(c.par, onHand) };
    });
  }

  // Next step for a drink (tutorial hints): glass → ice → ingredients → method → garnish → serve.
  function hint(st, slotId) {
    var s = st.slots[slotId]; if (!s || s.result) return "";
    var c = CARDS[s.drink], all = Object.assign({}, s.gc, s.vc);
    if (!s.glass) return "Take a " + glassName(c.glass[0]).toLowerCase() + ".";
    if (c.method === "beer") return all.beer ? "Ready: serve the ticket when all its drinks are ready." : "Pour the draught beer.";
    if (c.method === "wine") return all.wine ? "Ready: serve the ticket when all its drinks are ready." : "Pour the glass of wine.";
    if (c.ice !== "none" && s.ice === "none") return "Ice the glass (" + c.ice + ").";
    var needVessel = c.method === "shake" ? "tin" : c.method === "stir" ? "mix" : null;
    if (needVessel && !s.vessel && !s.strained) return "Take a " + (needVessel === "tin" ? "tin" : "mixing glass") + " for it.";
    var pending = c.items.filter(function (it) { return !it.optional && it.kind !== "top" && !(it.keys[0] === "sparkling" && c.method === "shake") && !it.keys.some(function (k) { return all[k]; }); });
    if (pending.length) return (pending[0].kind === "add" ? "Add " : "Pour ") + pending[0].item + (pending[0].checkMl ? " " + pending[0].checkMl + " ml" : "") + (needVessel && !s.strained ? " into the " + (needVessel === "tin" ? "tin" : "mixing glass") : "") + ".";
    if (c.muddle && !s.muddled) return "Muddle.";
    if (c.method === "shake" && !s.shaken) return "Shake (two tins at once if you can).";
    if (c.method === "stir" && !s.stirred) return "Stir in the mixing glass.";
    if (needVessel && !s.strained) return "Strain into the glass.";
    if (c.stirInGlass && !s.stirredGlass) return "Stir it in the glass.";
    var tops = c.items.filter(function (it) { return (it.kind === "top" || (it.keys[0] === "sparkling" && c.method === "shake")) && !it.keys.some(function (k) { return all[k]; }); });
    if (tops.length) return "Top with " + tops[0].item + ".";
    if (c.garnish.indexOf("none") < 0 && !s.garnish) return "Garnish: " + garnishName(c.garnish[0]).toLowerCase() + ".";
    return "Ready: serve the ticket when all its drinks are ready.";
  }

  // Ticket-level hint (tutorial): the next step across all drinks of a ticket, in passes —
  // glasses → ice → tins/mixing glasses → ingredients (one bottle across all drinks) → muddle → stir → shake → strain
  // → stir in glass → tops → garnish → serve.
  function stepOf(st, s) {
    var c = CARDS[s.drink], all = Object.assign({}, s.gc, s.vc);
    var needVessel = c.method === "shake" ? "tin" : c.method === "stir" ? "mix" : null;
    if (!s.glass) return { rank: 0, text: "Take the glasses", act: "glass" };
    if (c.ice !== "none" && s.ice === "none") return { rank: 1, text: "Ice the glasses (" + c.ice + ")", act: "ice" };
    if (c.method === "beer" && !all.beer) return { rank: 3, text: "Pour the draught beer", act: "beer" };
    if (c.method === "wine" && !all.wine) return { rank: 3, text: "Pour the wine", act: "wine" };
    if (needVessel && !s.vessel && !s.strained) return { rank: 2, text: "Take " + (needVessel === "tin" ? "tins" : "mixing glasses"), act: needVessel };
    var pending = c.items.filter(function (it) { return !it.optional && it.kind !== "top" && !(it.keys[0] === "sparkling" && c.method === "shake") && !it.keys.some(function (k) { return all[k]; }); });
    if (pending.length) return { rank: 3, text: "Pour", act: "pour", items: pending };
    if (c.muddle && !s.muddled) return { rank: 4, text: "Muddle", act: "muddle" };
    if (c.method === "stir" && !s.stirred) return { rank: 5, text: "Stir (slowest ice step first; two at once)", act: "stir" };
    if (c.method === "shake" && !s.shaken) return { rank: 6, text: "Shake (two tins at once)", act: "shake" };
    if (needVessel && !s.strained) return { rank: 7, text: "Strain", act: "strain" };
    if (c.stirInGlass && !s.stirredGlass) return { rank: 8, text: "Stir in the glass", act: "stirGlass" };
    var tops = c.items.filter(function (it) { return (it.kind === "top" || (it.keys[0] === "sparkling" && c.method === "shake")) && !it.keys.some(function (k) { return all[k]; }); });
    if (tops.length) return { rank: 9, text: "Top (bubbles last)", act: "top", items: tops };
    if (c.garnish.indexOf("none") < 0 && !s.garnish) return { rank: 10, text: "Garnish", act: "garnish" };
    return { rank: 11, text: "ready", act: null };
  }
  function ticketHint(st, ticketId) {
    var t = ticketById(st, ticketId); if (!t) return "";
    var steps = t.slots.map(function (id) { return { s: st.slots[id], step: stepOf(st, st.slots[id]) }; });
    var min = Math.min.apply(null, steps.map(function (x) { return x.step.rank; }));
    if (min === 11) return "All drinks on " + (t.remake ? "the remake" : "ticket #" + t.id) + " are ready: serve them together now.";
    var group = steps.filter(function (x) { return x.step.rank === min; });
    if (min === 3 || min === 9) {
      // one bottle across every drink that needs it
      var key = null, names = [];
      group.forEach(function (x) { if (x.step.items) x.step.items.forEach(function (it) { if (!key && x.step.act !== "beer" && x.step.act !== "wine") key = it.keys[0]; }); });
      if (!key) return group[0].step.text + ": " + group.map(function (x) { return CARDS[x.s.drink].name; }).join(", ") + ".";
      group.forEach(function (x) { (x.step.items || []).forEach(function (it) { if (it.keys[0] === key) names.push(CARDS[x.s.drink].name + (it.checkMl ? " " + it.checkMl + " ml" : "")); }); });
      return (min === 9 ? "Top with " : SC.KIND[key] === "add" ? "Add " : "Pour ") + bottleName(key).replace(/ \(.*\)$/, "") + " for: " + names.join(", ") + (names.length > 1 ? " (one bottle, all drinks in a row)." : ".");
    }
    var gl = min === 0 ? " — " + group.map(function (x) { return CARDS[x.s.drink].name + ": " + glassName(CARDS[x.s.drink].glass[0]).toLowerCase(); }).join("; ") : "";
    var gar = min === 10 ? " — " + group.map(function (x) { return CARDS[x.s.drink].name + ": " + garnishName(CARDS[x.s.drink].garnish[0]).toLowerCase(); }).join("; ") : "";
    return group[0].step.text + " for: " + group.map(function (x) { return CARDS[x.s.drink].name; }).join(", ") + gl + gar + ".";
  }

  function glassName(id) { var g = SC.GLASSES.filter(function (x) { return x[0] === id; })[0]; return g ? g[1] : String(id); }
  function bottleName(k) { if (k === "beer") return "draught beer"; if (k === "wine") return "house wine"; var b = SC.BOTTLES.filter(function (x) { return x[0] === k; })[0]; return b ? b[1] : k; }
  function garnishName(id) { if (id === "none") return "no garnish"; var g = SC.GARNISHES.filter(function (x) { return x[0] === id; })[0]; return g ? g[1] : String(id); }

  function copyText(st, m, dateStr, orderScore) {
    var lines = ["Service simulation — preset " + st.preset + " · seed " + st.seed + " · " + dateStr,
      "Tickets completed: " + m.served + " / " + m.tickets,
      "Accuracy: " + m.accuracy.toFixed(1) + "% (" + m.correct + " of " + m.ordered + " drinks correct)",
      "Average ticket time: " + Math.round(m.avgTime) + " s",
      "Waste: " + m.waste.toFixed(1) + "% (" + Math.round(m.wasteMl) + " of " + Math.round(m.pouredMl) + " ml: binned " + Math.round(st.waste.binned) + ", dead " + Math.round(st.waste.dead) + ", remade " + Math.round(st.waste.remade) + ")"];
    if (m.exam) lines.push("Time penalty: " + m.exam.timePenalty.toFixed(1) + " · Waste penalty: " + m.exam.wastePenalty.toFixed(1),
      "Service score: " + m.accuracy.toFixed(1) + " − " + m.exam.timePenalty.toFixed(1) + " − " + m.exam.wastePenalty.toFixed(1) + " = " + m.exam.score + " (minimum 70)");
    else lines.push("Targets: accuracy ≥ " + st.p.targets.accuracy + "% " + (m.targets.accuracy ? "met" : "missed") + " · avg ≤ " + st.p.targets.avgTime + " s " + (m.targets.avgTime ? "met" : "missed") + " · waste ≤ " + st.p.targets.waste + "% " + (m.targets.waste ? "met" : "missed"));
    if (st.preset === "stockout") lines.push("Drinks with a missing or unapproved ingredient: " + m.missingOrUnapproved + (orderScore ? " · order list " + orderScore : ""));
    lines.push("Educational model: fixed action times, not a measure of your hands.");
    return lines.join("\n");
  }

  var api = { T: T, DEAD_AFTER: DEAD_AFTER, PRESETS: PRESETS, M5: M5, STOCK_DEF: STOCK_DEF, COUNT_ITEMS: COUNT_ITEMS, generate: generate, createShift: createShift, act: act,
    openTickets: openTickets, visibleTickets: visibleTickets, ticketById: ticketById, nextEventTime: nextEventTime, evaluate: evaluate, metrics: metrics,
    countSheet: countSheet, hint: hint, ticketHint: ticketHint, stepOf: stepOf, glassName: glassName, bottleName: bottleName, garnishName: garnishName, slotMl: slotMl, usesKey: usesKey,
    ticketUse: ticketUse, copyText: copyText, CARDS: CARDS };
  if (NODE) module.exports = api;
  else root.ServiceCore = api;
})(typeof window !== "undefined" ? window : globalThis);
