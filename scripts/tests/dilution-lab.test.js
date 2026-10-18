// node --test scripts/tests/  — dilution-lab: the course dilution model must reproduce the lesson numbers.
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");
const B = require(path.join(__dirname, "../../simulations/common/bar-math.js"));
const L = require(path.join(__dirname, "../../simulations/dilution-lab/lab-core.js"));
const RECIPES = require(path.join(__dirname, "../../simulations/common/recipes.js"));
const pct = (m, abv, t) => B.dilutionFraction(m, abv, t) * 100;
const near = (a, b, tol) => assert.ok(Math.abs(a - b) <= tol, `${a} != ${b} (±${tol})`);

test("dilutionFraction: Arnold anchors (BUILD_PROGRESS decision)", () => {
  near(B.dilutionFraction("shake", 0.23), 0.6255, 1e-9);   // shaken whiskey sour ~63%
  near(B.dilutionFraction("stir", 0.32), 0.508, 1e-9);     // stirred Manhattan ~50%
  near(B.dilutionFraction("shake", 0), 0.20, 1e-9);        // water ~20-25%
  near(B.dilutionFraction("stir", 0), 0.22, 1e-9);
  assert.throws(() => B.dilutionFraction("blend", 0.2));
  assert.equal(B.dilutionFraction("shake", 0.25, 0), 0);
  near(B.dilutionFraction("shake", 0.9), B.dilutionFraction("shake", 0.6), 1e-12); // capped at 60%
});

test("lesson 04.1 table", () => {
  near(pct("shake", 0.25, 12), 63, 0.5);
  near(pct("stir", 0.32, 20), 37, 0.5);
  near(pct("stir", 0.32, 30), 44, 0.5);
  near(pct("throw", 0.33, 8), 35, 0.6);
  near(pct("throw", 0.33, 10), 39, 0.5);
  near(pct("build", 0.10, 30), 3, 0.5);
  near(pct("build", 0.10, 300), 14, 0.5);
});

test("lessons 04.3, 04.4, 04.6, 08.3 numbers", () => {
  near(pct("stir", 0, 25), 18, 0.5);          // 04.3 water stir 25 s
  near(pct("shake", 0, 12), 19, 0.5);         // 04.4 water shake 12 s
  near(pct("shake", 0.25, 10), 61, 0.5);      // 04.4
  near(pct("shake", 0.25, 15), 65, 0.5);      // 04.4
  near(pct("throw", 0.33, 5), 25, 0.5);       // 04.6
  const man = 1 / 1.416 * (1000 * 0.4 + 400 * 0.16 + 16 * 0.447) / 1000; // IBA Manhattan ABV ~33.3%
  near(pct("stir", man, 45), 49, 0.5);        // 08.3: about 49% for a 45 s stir
});

test("dilutionPercent and ABV after (lesson 03.5 measurement)", () => {
  near(B.dilutionPercent(111, 140), 26.1, 0.1);
  near(B.dilutionPercent(100, 100), 0, 1e-12);
  near(B.abvAfterDilution(0.229, 0.6) * 100, 14.3, 0.05);
  near(B.abvAfterDilution(0.2, 0), 0.2, 1e-12);
});

test("dilutionModel: defaults equal the fitted curve; adjustments move it the right way", () => {
  const base = { method: "shake", abv: 0.25, seconds: 15, volumeMl: 95 };
  const m = B.dilutionModel(base);
  near(m.dilution, B.dilutionFraction("shake", 0.25, 15), 1e-12);
  near(m.finalMl, 95 * (1 + m.dilution), 1e-9);
  near(m.abvAfter, 0.25 / (1 + m.dilution), 1e-12);
  assert.ok(B.dilutionModel({ ...base, iceState: "freezer" }).dilution < m.dilution);
  assert.ok(B.dilutionModel({ ...base, iceState: "wet" }).dilution > m.dilution);
  assert.ok(B.dilutionModel({ ...base, startTempC: 4 }).dilution < m.dilution);
  assert.ok(B.dilutionModel({ method: "build", abv: 0, seconds: 30, ice: "crushed" }).dilution >
            B.dilutionModel({ method: "build", abv: 0, seconds: 30 }).dilution);
  assert.equal(B.dilutionModel({ method: "stir", abv: 0, seconds: 0 }).dilution, 0);
  assert.ok(B.dilutionModel({ method: "shake", abv: 0, seconds: 60, startTempC: 0, iceState: "freezer" }).dilution >= 0);
  assert.throws(() => B.dilutionModel({ method: "roll", abv: 0.1, seconds: 5 }));
});

test("dilutionModel temperatures match lesson 03.5", () => {
  const t = (o) => B.dilutionModel(o).tempC;
  near(t({ method: "shake", abv: 0, seconds: 15 }), 0, 1);           // NA shake 15 s near 0 °C
  const sour = t({ method: "shake", abv: 0.25, seconds: 15 });
  assert.ok(sour <= -5 && sour >= -8, "shaken sour -5 to -8 °C, got " + sour);
  const stir = t({ method: "stir", abv: 0.32, seconds: 45 });
  assert.ok(stir <= -0.5 && stir >= -7, "stirred -0.5 to -7 °C, got " + stir);
  near(t({ method: "build", abv: 0, seconds: 120 }), 7, 1);          // reference build 2 min: 7 °C
  assert.ok(t({ method: "stir", abv: 0, seconds: 45 }) > t({ method: "shake", abv: 0, seconds: 15 })); // stirring leaves it warmer
  near(t({ method: "shake", abv: 0.25, seconds: 0 }), 20, 1e-9);
  near(B.dilutionModel({ method: "shake", abv: 0 }).equilibriumC, 0, 1e-12);
});

test("lab core: drinks, tasks, grading, measurement", () => {
  const man = L.drinkFromRecipe(RECIPES.find(r => r.id === "manhattan"));
  near(man.volumeMl, 70.8, 0.01); near(man.abv, 0.3327, 0.001); assert.equal(man.method, "stir");
  ["explore", "shake", "stir", "build", "throw", "temperature"].forEach(k => assert.ok(L.TASKS[k].length > 0, k));
  const ev = L.evaluateTask(L.TASKS.shake[0], [47, 70, null]);
  assert.equal(ev.total, 3); assert.equal(ev.answered, 2);
  assert.equal(ev.rows[0].close, true); assert.equal(ev.rows[1].close, false); assert.equal(ev.rows[2].close, null);
  near(ev.rows[0].model, 47.3, 0.5); near(ev.rows[1].model, 60.8, 0.5);
  assert.deepEqual(L.grade("temp", -4, -5.9).close, true);
  assert.deepEqual(L.grade("temp", 0, -5.9).close, false);
  const c = L.curve({ method: "stir", abv: 0.32, volumeMl: 90 }, "dilution", 60, 6);
  assert.equal(c.length, 7); assert.equal(c[0][1], 0); assert.ok(c[6][1] > c[3][1]);
  const ms = L.measurement(111, 140, { method: "shake", abv: 0 }, 15);
  near(ms.measured, 26.1, 0.1); near(ms.model, 19.5, 0.1);
  assert.equal(L.fmtTime(120), "2 min"); assert.equal(L.fmtTime(45), "45 s");
  assert.match(L.rowLabel(L.TASKS.temperature[1].rows[1]), /freezer/);
});
