// node --test scripts/tests/  — recipe-scaler: bar-math conversions, scaling, batching, ABV, freezing; scaler core.
const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("path");
const B = require(path.join(__dirname, "../../simulations/common/bar-math.js"));
const C = require(path.join(__dirname, "../../simulations/recipe-scaler/scaler-core.js"));
const RECIPES = require(path.join(__dirname, "../../simulations/common/recipes.js"));
require(path.join(__dirname, "../../simulations/common/sim.js"));
const Sim = globalThis.Sim;
const near = (a, b, tol = 1e-6) => assert.ok(Math.abs(a - b) <= tol, `${a} != ${b} (±${tol})`);

test("unit conversions (lesson 03.1 values)", () => {
  near(B.toMl(1.5, "oz"), 44.36, 0.01);
  near(B.toMl(4.5, "cl"), 45);
  near(B.toMl(2, "dash"), 1.6);
  near(B.toMl(1, "barspoon"), 5);
  near(B.fromMl(15, "tbsp"), 1);
  near(B.convert(1, "oz", "ml"), 29.5735);
  assert.throws(() => B.toMl(1, "gallon"));
  assert.equal(B.BAR_OZ_ML, 30);
  assert.equal(B.barOz(50), 1.75);       // worksheet 03.1 #4
  assert.equal(B.barOz(45), 1.5);
});

test("parts to ml", () => {
  const r = B.partsToMl([{ item: "a", parts: 2 }, { item: "b", parts: 0.75 }, { item: "c", parts: 0.75 }], 105);
  near(r[0].ml, 60); near(r[1].ml, 22.5); near(r[2].ml, 22.5);
  const r7 = B.partsToMl([{ item: "a", parts: 1.5 }, { item: "b", parts: 0.75 }, { item: "c", parts: 0.5 }], 110);
  near(r7[0].ml, 60); near(r7[1].ml, 30); near(r7[2].ml, 20);   // worksheet #7
});

test("scale, total and batch (03.1 worked example and worksheet)", () => {
  const one = [{ item: "spirit", ml: 60 }, { item: "vermouth", ml: 30 }, { item: "bitters", ml: 1.6 }];
  assert.deepEqual(B.scale(one, 10).map(x => x.ml), [600, 300, 16]);
  near(B.totalMl(one), 91.6);
  const b = B.batch(one, 10, 0.4);
  near(b.waterMl, 366.4); near(b.totalMl, 1282.4); near(b.perServingMl, 128.24);
  const w9 = B.batch([{ ml: 50 }, { ml: 25 }, { ml: 25 }], 8, 0.3);
  near(w9.waterMl, 240); near(w9.totalMl, 1040); near(w9.perServingMl, 130);
  const w10 = B.batch([{ ml: 60 }, { ml: 22.5 }, { ml: 22.5 }], 20, 0);
  near(w10.waterMl, 0); near(w10.totalMl, 2100);
});

test("ABV of a mix, ABV after dilution, freezing point (lessons 03.5, 08.3)", () => {
  near(B.mixAbv([{ ml: 60, abv: 0.4 }, { ml: 22.5, abv: 0 }, { ml: 22.5, abv: 0 }]), 24 / 105);
  near(B.mixAbv([{ ml: 60, abv: 0.4 }], 40), 0.24);
  near(B.mixAbv([]), 0);
  near(B.abvAfterDilution(0.229, 0.6), 0.143, 0.001);
  near(B.freezingPointC(0), 0);
  near(B.freezingPointC(0.2), -9);
  near(B.freezingPointC(0.238), -11.28, 0.01);   // Manhattan batch: about -11 °C
  near(B.freezingPointC(0.307), -15.56, 0.01);   // Martini 3a: about -15 to -16 °C
  near(B.freezingPointC(0.357), -19.56, 0.01);   // Martini 3b: below about -19 °C
  near(B.freezingPointC(0.55), -36.5, 0.01);     // extrapolated past the table
});

test("ABV guesses and spec amounts", () => {
  assert.equal(B.guessAbv("rye whiskey"), 0.40);
  assert.equal(B.guessAbv("sweet red vermouth"), 0.16);
  assert.equal(B.guessAbv("dry vermouth"), 0.18);
  assert.equal(B.guessAbv("Angostura bitters"), 0.447);
  assert.equal(B.guessAbv("fresh lime juice"), 0);
  assert.equal(B.guessAbv("coffee liqueur (Kahlúa)"), 0.20);
  assert.equal(B.guessAbv("ginger beer"), 0);
  assert.equal(B.guessAbv("something unknown"), 0);
  near(B.amountToMl("2 bar spoons"), 10);
  near(B.amountToMl("1 dash"), 0.8);
  near(B.amountToMl("2 tsp"), 10);
  near(B.amountToMl("1 shot (about 30 ml)"), 30);
  near(B.amountToMl("1.5 oz"), 45);
  near(B.amountToMl("4 cl"), 40);
  assert.equal(B.amountToMl("few dashes"), null);
  assert.equal(B.amountToMl("to top"), null);
});

test("scaler core: quantities, quarters, lines", () => {
  assert.equal(C.parseQty("1 1/2"), 1.5);
  assert.equal(C.parseQty("1½"), 1.5);
  assert.equal(C.parseQty("¾"), 0.75);
  assert.equal(C.parseQty("22,5"), 22.5);
  assert.ok(Number.isNaN(C.parseQty("abc")));
  assert.ok(Number.isNaN(C.parseQty("")));
  assert.equal(C.fmtQuarter(1.75), "1¾");
  assert.equal(C.fmtQuarter(0.5), "½");
  assert.equal(C.fmtQuarter(2), "2");
  near(C.lineMl({ qty: 2, unit: "dash" }), 1.6);
  near(C.lineMl({ qty: "1½", unit: "oz_bar" }), 45);
  assert.equal(C.lineMl({ qty: "to top", unit: "text" }), null);
  assert.deepEqual(C.fromSpec({ item: "Angostura bitters", amount: "1 dash" }), { item: "Angostura bitters", qty: 1, unit: "dash", abv: 0.447 });
  assert.equal(C.fromSpec({ item: "white rum", ml: 60 }).unit, "ml");
  assert.equal(C.fromSpec({ item: "superfine sugar", amount: "2 bar spoons" }).unit, "barspoon");
  assert.equal(C.fromSpec({ item: "soda water", amount: "to top" }).unit, "text");
  assert.equal(C.scaleText("1 cube", 4), "4 × (1 cube)");
});

test("planBatch matches the 08.3 worksheet solution", () => {
  const man = RECIPES.find(r => r.id === "manhattan").ingredients.map(C.fromSpec);
  const p = C.planBatch(man, 24, "prediluted", 0.4);
  near(p.undilutedMl, 1699.2, 0.01); near(p.waterMl, 679.68, 0.01); near(p.totalMl, 2378.88, 0.01);
  near(p.servingMl, 99.12, 0.01); near(p.alcoholMl, 565.4, 0.1);
  near(p.abvBefore * 100, 33.3, 0.05); near(p.abvAfter * 100, 23.8, 0.05);
  assert.equal(p.storage.key, "fridge");
  const neg = RECIPES.find(r => r.id === "negroni").ingredients.map(C.fromSpec);
  const q = C.planBatch(neg, 30, "premix", 0.4);
  near(q.waterMl, 0); near(q.totalMl, 2700); near(q.servingMl, 90); near(q.containerMl, 2970);
  const mar = RECIPES.find(r => r.id === "dry-martini").ingredients.map(C.fromSpec);
  const a = C.planBatch(mar, 12, "prediluted", 0.2);
  near(a.waterMl, 168); near(a.totalMl, 1008); near(a.servingMl, 84); near(a.abvAfter * 100, 30.7, 0.05);
  assert.equal(a.storage.key, "slush");
  mar[0].abv = 0.47;
  const b = C.planBatch(mar, 12, "prediluted", 0.2);
  near(b.abvAfter * 100, 35.7, 0.05);
  assert.equal(b.storage.key, "freezer");
});

test("storage advice and keep-out warnings", () => {
  assert.equal(C.storageAdvice("premix", -5, 0.2).key, "fridge");
  assert.equal(C.storageAdvice("prediluted", 0, 0).key, "fridge");
  assert.equal(C.storageAdvice("prediluted", -25, 0.42).key, "freezer");
  const k = C.keepOut([{ item: "soda water" }, { item: "fresh lemon juice" }, { item: "egg white (pasteurised) or aquafaba" }, { item: "mint" }, { item: "gin" }]);
  assert.equal(k.length, 4);
  assert.equal(C.keepOut([{ item: "gin" }, { item: "dry vermouth" }]).length, 0);
});

test("practice quiz is deterministic and gradeable", () => {
  const q1 = C.quiz(Sim.rng(42)), q2 = C.quiz(Sim.rng(42));
  assert.deepEqual(q1, q2);
  assert.equal(q1.length, 5);
  q1.forEach(q => {
    const ans = q.kind === "oz" ? C.fmtQuarter(q.answer) : String(q.answer);
    assert.ok(C.checkQuizAnswer(q, ans), q.q + " -> " + ans);
    assert.ok(!C.checkQuizAnswer(q, String(q.answer + 3)));
  });
});
