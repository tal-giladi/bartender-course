// node --test scripts/tests/  — recipe-drill: card building, marking (±5 ml, method, glass and ice, garnish),
// exam draw and summary (outline §6, lesson 11.2), families (06.1), Leitner boxes (05.1), finalGrade.
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");
const B = require(path.join(__dirname, "../../simulations/common/bar-math.js"));
const D = require(path.join(__dirname, "../../simulations/recipe-drill/drill-core.js"));
const RECIPES = require(path.join(__dirname, "../../simulations/common/recipes.js"));
require(path.join(__dirname, "../../simulations/common/sim.js"));
const Sim = globalThis.Sim;
const R = id => RECIPES.find(r => r.id === id);

// A perfect answer for a built card, with an optional tweak.
function perfect(r, card, tweak = {}) {
  const ing = {};
  card.candidates.forEach(c => {
    if (!c.correct || c.optional) { ing[c.item] = { selected: false }; return; }
    ing[c.item] = { selected: true, ml: c.kind === "ml" ? c.specMl : null, amount: c.kind === "amount" ? c.specAmount : null };
  });
  const gi = D.acceptedGlassIce(r)[0];
  return Object.assign({ ingredients: ing, method: r.method, glass: gi[0], ice: gi[1], garnish: D.garnishKey(r.garnish) }, tweak);
}

test("every recipe gets a playable card and a perfect answer scores 4", () => {
  const rng = Sim.rng(11);
  RECIPES.forEach(r => {
    assert.ok(D.acceptedGlassIce(r).length > 0, "glass mapping for " + r.id);
    const card = D.buildCard(r, RECIPES, rng);
    const correct = card.candidates.filter(c => c.correct).map(c => c.item).sort();
    assert.deepEqual(correct, r.ingredients.map(i => i.item).sort(), r.id);
    const groups = new Set(r.ingredients.map(i => D.group(i.item)));
    card.candidates.filter(c => !c.correct).forEach(c => assert.ok(!groups.has(D.group(c.item)), r.id + " distractor synonym " + c.item));
    assert.ok(card.candidates.length >= 7, r.id);
    card.candidates.filter(c => c.kind === "amount").forEach(c => assert.ok(c.amountOptions.length >= 2));
    assert.equal(D.markCard(r, card, perfect(r, card)).points, 4, r.id);
  });
});

test("cards are deterministic for a seed", () => {
  const a = D.buildCard(R("margarita"), RECIPES, Sim.rng(5));
  const b = D.buildCard(R("margarita"), RECIPES, Sim.rng(5));
  assert.deepEqual(a, b);
});

test("±5 ml tolerance and the lesson 11.2 Margarita example", () => {
  const r = R("margarita"), card = D.buildCard(r, RECIPES, Sim.rng(1));
  const ans = perfect(r, card);
  ans.ingredients["fresh lime juice"].ml = 20;            // 15 + 5: still a point
  assert.equal(D.markCard(r, card, ans).cells.ingredients.ok, true);
  ans.ingredients["fresh lime juice"].ml = 25;            // 10 ml off: no point
  const m = D.markCard(r, card, ans);
  assert.equal(m.cells.ingredients.ok, false);
  assert.deepEqual(m.errors, ["ml"]);
  assert.equal(m.points, 3);
});

test("missing or extra ingredient, method, glass and garnish errors", () => {
  const r = R("negroni"), card = D.buildCard(r, RECIPES, Sim.rng(2));
  const a = perfect(r, card);
  a.ingredients["Campari"].selected = false;
  let m = D.markCard(r, card, a);
  assert.deepEqual(m.cells.ingredients.missing, ["Campari"]);
  assert.ok(m.errors.includes("missing ingredient"));
  const b = perfect(r, card);
  const distractor = card.candidates.find(c => !c.correct).item;
  b.ingredients[distractor] = { selected: true, ml: 10 };
  m = D.markCard(r, card, b);
  assert.deepEqual(m.cells.ingredients.extra, [distractor]);
  // 11.2 example: Negroni with a lemon twist loses the garnish point only
  m = D.markCard(r, card, perfect(r, card, { garnish: "lemon twist" }));
  assert.equal(m.points, 3); assert.deepEqual(m.errors, ["garnish"]);
  m = D.markCard(r, card, perfect(r, card, { method: "shake" }));
  assert.deepEqual(m.errors, ["method"]);
  m = D.markCard(r, card, perfect(r, card, { ice: "none" }));
  assert.deepEqual(m.errors, ["glass"]);
  m = D.markCard(r, card, perfect(r, card, { ice: "large" }));   // large cube accepted in a rocks glass
  assert.equal(m.points, 4);
  m = D.markCard(r, card, {});
  assert.equal(m.points, 0); assert.equal(m.blank, true);
});

test("non-ml amounts, optional items and none garnish", () => {
  const of = R("old-fashioned"), card = D.buildCard(of, RECIPES, Sim.rng(3));
  const a = perfect(of, card);
  a.ingredients["Angostura bitters"].amount = card.candidates.find(c => c.item === "Angostura bitters").amountOptions.find(o => o !== "few dashes");
  assert.equal(D.markCard(of, card, a).cells.ingredients.ok, false);
  const ws = R("whiskey-sour"), wc = D.buildCard(ws, RECIPES, Sim.rng(4));
  const w = perfect(ws, wc);
  assert.equal(D.markCard(ws, wc, w).points, 4);                       // optional egg white left out
  w.ingredients["pasteurised egg white (optional)"] = { selected: true, amount: "few drops" };
  assert.equal(D.markCard(ws, wc, w).points, 4);                       // or included
  assert.ok(D.glassIceOk(ws, "rocks", "cubes"));                        // on the rocks
  assert.ok(!D.glassIceOk(ws, "rocks", "none"));
  assert.equal(D.garnishKey(R("daiquiri").garnish), "none");
  assert.equal(D.garnishKey(R("sidecar").garnish), "none");
  assert.equal(D.garnishOptions(RECIPES)[0][0], "none");
  const ps = R("pisco-sour"), pc = D.buildCard(ps, RECIPES, Sim.rng(6));
  const egg = pc.candidates.find(c => /aquafaba/.test(c.item));
  assert.equal(egg.kind, "ml"); assert.equal(egg.specMl, 30);
});

test("glass mapping", () => {
  assert.deepEqual(D.glassIds("double old fashioned glass"), ["double-rocks"]);
  assert.deepEqual(D.glassIds("old fashioned glass (chilled)"), ["rocks"]);
  assert.deepEqual(D.glassIds("mule cup (lined) or rocks glass").sort(), ["mule", "rocks"]);
  assert.deepEqual(D.glassIds("coupe (chilled)"), ["cocktail"]);
  assert.equal(D.iceId("collins-cubes"), "cubes");
  assert.ok(D.glassIceOk(R("mojito"), "highball", "crushed"));
  assert.ok(D.glassIceOk(R("caipirinha"), "double-rocks", "crushed"));
  assert.ok(!D.glassIceOk(R("caipirinha"), "rocks", "crushed"));
});

test("decks and exam draw (20 cards, no repeats, seeded)", () => {
  assert.equal(D.deck("m05", RECIPES).length, 12);
  assert.ok(D.deck("m06", RECIPES).every(r => /^06\./.test(r.lesson)));
  assert.equal(D.deck("exam", RECIPES).length, RECIPES.length);
  const a = D.examDraw(RECIPES, Sim.rng(2026)).map(r => r.id);
  const b = D.examDraw(RECIPES, Sim.rng(2026)).map(r => r.id);
  assert.equal(a.length, 20); assert.equal(new Set(a).size, 20); assert.deepEqual(a, b);
  assert.notDeepEqual(a, D.examDraw(RECIPES, Sim.rng(2027)).map(r => r.id));
});

test("exam summary and report (pass at 64 of 80)", () => {
  const mk = (points, errors) => ({ name: "X", points, errors, cells: { ingredients: { ok: !errors.includes("ml") }, method: { ok: true }, glass: { ok: true }, garnish: { ok: !errors.includes("garnish") } } });
  const results = Array.from({ length: 20 }, (_, i) => i < 16 ? mk(4, []) : mk(0, ["ml", "missing ingredient", "method", "glass"]));
  let s = D.examSummary(results);                 // 16 x 4 = 64 points
  assert.equal(s.points, 64); assert.equal(s.max, 80); assert.equal(s.percent, 80); assert.equal(s.pass, true); assert.equal(s.minPoints, 64);
  assert.equal(s.weighted, 20);
  results[0] = mk(3, ["garnish"]);
  s = D.examSummary(results);
  assert.equal(s.points, 63); assert.equal(s.pass, false);
  assert.equal(s.counts.garnish, 1); assert.equal(s.counts.ml, 4); assert.equal(s.dominant, "ml");
  const txt = D.examReport(results, 99, "2026-10-18");
  assert.match(txt, /Seed: 99 · Date: 2026-10-18/);
  assert.match(txt, /Points: 63 \/ 80 · Score: 78\.8%/);
  assert.match(txt, /NOT met/);
  assert.equal(txt.split("\n").filter(l => /^\d+\. /.test(l)).length, 20);
});

test("families (lesson 06.1) with accepted alternatives", () => {
  assert.equal(D.FAMILIES.length, 10);
  RECIPES.forEach(r => assert.ok(D.FAMILIES.some(f => f.id === r.family), "family of " + r.id));
  assert.equal(D.markFamily(R("caipirinha"), "highball", "build").points, 2);
  assert.equal(D.markFamily(R("caipirinha"), "sour", "build").points, 2);
  assert.equal(D.markFamily(R("french-75"), "collins-fizz", "shake").points, 2);
  assert.equal(D.markFamily(R("mai-tai"), "sour", "shake").points, 2);
  assert.equal(D.markFamily(R("negroni"), "sour", "stir").points, 0);
  assert.deepEqual(D.markFamily(R("paloma"), "highball", "shake"), { id: "paloma", name: "Paloma", points: 1, familyOk: true, methodOk: false });
});

test("Leitner boxes (lesson 05.1)", () => {
  assert.equal(D.nextBox(1, true), 2); assert.equal(D.nextBox(3, true), 3); assert.equal(D.nextBox(3, false), 1); assert.equal(D.nextBox(undefined, true), 2);
  assert.equal(D.isDue(undefined, "2026-10-18"), true);
  assert.equal(D.isDue({ box: 1, last: "2026-10-18" }, "2026-10-18"), false);
  assert.equal(D.isDue({ box: 1, last: "2026-10-17" }, "2026-10-18"), true);
  assert.equal(D.isDue({ box: 2, last: "2026-10-17" }, "2026-10-18"), false);
  assert.equal(D.isDue({ box: 2, last: "2026-10-16" }, "2026-10-18"), true);
  assert.equal(D.isDue({ box: 3, last: "2026-10-12" }, "2026-10-18"), false);
  assert.equal(D.isDue({ box: 3, last: "2026-10-11" }, "2026-10-18"), true);
  assert.deepEqual(D.dueIds(["a", "b"], { a: { box: 3, last: "2026-10-18" } }, "2026-10-18"), ["b"]);
});

test("finalGrade (outline §6) with the recall component", () => {
  assert.equal(B.WEIGHTS.recall, 0.25); assert.equal(B.MINIMUMS.recall, 80);
  const g = B.finalGrade({ written: 80, recall: 85, technique: 80, service: 79, costing: 80 }, false);
  assert.ok(Math.abs(g.total - 81.05) < 1e-9); assert.equal(g.pass, true);
  assert.equal(B.finalGrade({ written: 90, recall: 79, technique: 90, service: 90, costing: 90 }, false).pass, false);
  assert.equal(B.finalGrade({ written: 90, recall: 90, technique: 90, service: 90, costing: 90 }, true).pass, false);
  assert.deepEqual(B.finalGrade({ recall: 90 }).missing, ["written", "technique", "service", "costing"]);
});
