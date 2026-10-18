// node --test scripts/tests/  — guest-scenarios: scenario data contract (09.7) and scoring (ops-math), exam (11.5).
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");
const ROOT = path.join(__dirname, "../..");
const O = require(path.join(ROOT, "simulations/common/ops-math.js"));
const SC = require(path.join(ROOT, "simulations/guest-scenarios/scenarios.js"));
const G = require(path.join(ROOT, "simulations/guest-scenarios/guest-core.js"));

const PRESETS = ["underage", "intoxicated", "unclear", "allergy", "complaint", "strong", "alcohol-free"];

test("seven presets, each 4 decision points × 3 choices scored 2/1/0", () => {
  assert.deepEqual(SC.map((s) => s.id), PRESETS);
  SC.forEach((s) => {
    assert.equal(s.steps.length, 4, s.id);
    assert.ok(s.card && s.rule, s.id);
    s.steps.forEach((st, i) => {
      assert.equal(st.choices.length, 3, s.id + " step " + i);
      assert.deepEqual(st.choices.map((c) => c.points).sort(), [0, 1, 2], s.id + " step " + i);
      assert.ok(st.prompt && st.why);
      st.choices.forEach((c) => { assert.ok(c.text && c.reaction); if (c.safety) assert.equal(c.points, 0, "safety flags only on 0-choices"); });
    });
  });
});

test("safety-critical choices match the Module 9 contract", () => {
  const flags = (id) => SC.find((s) => s.id === id).steps.flatMap((st) => st.choices.filter((c) => c.safety).map((c) => c.safety.toLowerCase()));
  assert.deepEqual(flags("unclear"), []);
  assert.deepEqual(flags("complaint"), []);
  const has = (id, re) => assert.ok(flags(id).some((f) => re.test(f)), id + " " + re);
  has("underage", /physical id/); has("underage", /friend's second beer/);
  has("intoxicated", /served alcohol to a clearly intoxicated/); has("intoxicated", /drive/); has("intoxicated", /alone/);
  has("allergy", /guess/); has("allergy", /orgeat/); has("allergy", /unwashed shaker/);
  has("strong", /above the house spec/); has("strong", /fast or heavy/); has("strong", /signs of intoxication/);
  has("alcohol-free", /bitters/); has("alcohol-free", /0\.5% beer/);
});

test("ops-math scenario scoring: pass = ≥ 70% (6/8) and no safety-critical choice", () => {
  assert.deepEqual(O.scenarioResult([{ points: 2 }, { points: 2 }, { points: 1 }, { points: 1 }]).pass, true);   // 6/8
  assert.equal(O.scenarioResult([{ points: 2 }, { points: 1 }, { points: 1 }, { points: 1 }]).pass, false);       // 5/8
  const flagged = O.scenarioResult([{ points: 2 }, { points: 2 }, { points: 2 }, { points: 0, safety: "x" }]);
  assert.equal(flagged.points, 6); assert.equal(flagged.pct, 75); assert.equal(flagged.pass, false); assert.deepEqual(flagged.safety, ["x"]);
  const ex = O.guestExamResult([flagged, O.scenarioResult([{ points: 2 }, { points: 2 }, { points: 2 }, { points: 2 }])]);
  assert.equal(ex.points, 14); assert.equal(ex.max, 16); assert.equal(ex.safetyPass, false);
});

test("model path scores 8/8 and passes in every preset; worst path fails", () => {
  PRESETS.forEach((id) => {
    const r = G.scoreScenario(id, G.modelPicks(id));
    assert.equal(r.points, 8); assert.equal(r.pass, true); assert.equal(r.path.length, 4);
    const worst = SC.find((s) => s.id === id).steps.map((st) => st.choices.findIndex((c) => c.points === 0));
    const w = G.scoreScenario(id, worst);
    assert.equal(w.points, 0); assert.equal(w.pass, false);
  });
});

test("a high score with one safety flag still fails (09.7 likely confusion)", () => {
  const picks = G.modelPicks("underage");
  picks[1] = SC[0].steps[1].choices.findIndex((c) => c.safety);
  const r = G.scoreScenario("underage", picks);
  assert.equal(r.points, 6); assert.equal(r.pass, false); assert.equal(r.safety.length, 1);
});

test("exam: all seven in seeded random order, 56 points, safety listed separately", () => {
  const a = G.runOrder("exam", 12345), b = G.runOrder("exam", 12345), c = G.runOrder("exam", 54321);
  assert.deepEqual(a, b);
  assert.deepEqual([...a].sort(), [...PRESETS].sort());
  assert.notDeepEqual(a, c);
  const results = a.map((id) => G.scoreScenario(id, G.modelPicks(id)));
  const ex = G.examResult(results);
  assert.equal(ex.max, 56); assert.equal(ex.points, 56); assert.equal(ex.pct, 100); assert.equal(ex.safetyPass, true);
  results[2] = G.scoreScenario(a[2], [0, 0, 0, 0].map((_, i) => SC.find((s) => s.id === a[2]).steps[i].choices.findIndex((x) => x.points === 1)));
  const ex2 = G.examResult(results);
  assert.equal(ex2.points, 52); assert.equal(ex2.pct.toFixed(1), "92.9"); assert.equal(ex2.safetyPass, true);   // low but safe is not a fail
  const txt = G.copyText("exam", 12345, results, "2026-10-18");
  assert.match(txt, /seed 12345/); assert.match(txt, /52\/56/); assert.match(txt, /Safety-critical choices: none/);
  assert.deepEqual(G.runOrder("allergy", 1), ["allergy"]);
});

test("choice display order is seeded and a permutation", () => {
  const o1 = G.choiceOrders(7, "allergy"), o2 = G.choiceOrders(7, "allergy");
  assert.deepEqual(o1, o2);
  o1.forEach((p) => assert.deepEqual([...p].sort(), [0, 1, 2]));
});
