// node --test scripts/tests/  — costing-calculator: bar-math costing functions, ops-math, costing core vs the course solutions.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "../..");
const B = require(path.join(ROOT, "simulations/common/bar-math.js"));
const O = require(path.join(ROOT, "simulations/common/ops-math.js"));
const D = require(path.join(ROOT, "simulations/costing-calculator/costing-data.js"));
const C = require(path.join(ROOT, "simulations/costing-calculator/costing-core.js"));
const near = (a, b, tol = 1e-6) => assert.ok(Math.abs(a - b) <= tol, `${a} != ${b} (±${tol})`);

function csv(file) {
  const text = fs.readFileSync(path.join(ROOT, file), "utf8").trim().split(/\r?\n/);
  const split = (line) => { const out = []; let cur = "", q = false;
    for (const ch of line) { if (ch === '"') q = !q; else if (ch === "," && !q) { out.push(cur); cur = ""; } else cur += ch; }
    out.push(cur); return out; };
  const head = split(text[0]);
  return text.slice(1).map((l) => { const v = split(l); const o = {}; head.forEach((h, i) => (o[h] = v[i])); return o; });
}

test("bar-math costing primitives (lesson 10.1 / 10.2 numbers)", () => {
  near(B.priceExVat(119.90, 0.18), 101.61, 0.005);
  near(B.priceIncVat(48.30, 0.18), 56.99, 0.005);
  near(B.costPerMl(101.61, 750), 0.1355, 0.00005);
  near(B.yieldCostPerMl(6.90 / 0.35 / 1.18, 300), 0.0557, 0.00005);
  near(B.usableMl(700, 0.03), 679);
  assert.equal(B.servingsPerBottle(700, 45, 0.03), 15);
  assert.equal(B.servingsPerBottle(700, 30, 0.03), 22);
  assert.equal(B.servingsPerBottle(750, 60, 0.03), 12);
  assert.equal(B.servingsPerBottle(1000, 60, 0.03), 16);
  assert.equal(B.servingsPerBottle(700, 45, 0), 15);
  assert.equal(B.servingsPerBottle(700, 45, 0.10), 14);
  assert.equal(B.servingsPerBottle(700, 30, 0), 23);
  assert.equal(B.servingsPerBottle(700, 30, 0.10), 21);
  near(B.costPerServing([{ ml: 60, packagePrice: 0.1355, packageMl: 1, wasteFraction: 0.03 }]), 8.38, 0.005);
  near(B.pourCost(9.66, 58 / 1.18), 0.197, 0.0005);
  near(B.grossProfit(9.66, 58 / 1.18), 39.49, 0.005);
  near(B.margin(9.66, 58 / 1.18), 0.803, 0.0005);
  near(B.markup(9.66, 58 / 1.18), 4.09, 0.005);
  assert.equal(B.priceForPourCost(9.66, 0.20, 0.18, 2), 58);
  assert.equal(B.usage(2.3, 5, 1.0), 6.3);
  assert.equal(B.variance(4410, 4300), 110);
  near(B.variancePercent(4410, 4300), 2.558, 0.001);
  assert.equal(B.orderQuantity(3, 1.4), 2);
});

test("embedded price list matches labs/module-10/price-list.csv", () => {
  const rows = csv("labs/module-10/price-list.csv");
  assert.equal(rows.length, D.PRICE_LIST.length);
  rows.forEach((r) => {
    const p = D.PRICE_LIST.find((x) => x.key === r.key);
    assert.ok(p, "missing " + r.key);
    near(p.price, Number(r.price_inc_vat_ils), 1e-9);
    near(p.waste * 100, Number(r.waste_pct), 1e-9);
    // the CSV's cost column is the unrounded cost shown to four decimals
    near(O.unitCost(p), Number(r.cost_ex_vat_ils), 0.00005 + 1e-9);
  });
});

test("embedded sales mix matches labs/module-10/pos-sales-week.csv", () => {
  const rows = csv("labs/module-10/pos-sales-week.csv");
  assert.equal(rows.length, 14);
  rows.forEach((r, i) => assert.equal(D.MENU[i].sold, Number(r.sold_week), r.drink));
});

test("embedded exam stock matches labs/module-11/costing-exam-inventory.csv", () => {
  const rows = csv("labs/module-11/costing-exam-inventory.csv");
  rows.forEach((r, i) => {
    const s = D.EXAM.stock[i];
    assert.equal(s.key, r.price_list_key);
    ["bottle_ml", "par_bottles", "opening_count_bottles", "received_bottles", "closing_count_bottles", "logged_waste_ml"].forEach((k, j) => {
      const field = ["bottleMl", "par", "opening", "received", "closing", "wasteMl"][j];
      assert.equal(s[field], Number(r[k]), r.item + " " + k);
    });
  });
});

test("ops-math helpers", () => {
  near(O.lineCost(20, 0.0557, 0.10), 1.2378, 0.0001);
  assert.equal(O.drinkCost([{ qty: 60, costPerUnit: 0.1355, waste: 0.03 }, { unitCost: 0.40 }]), 8.78);
  assert.equal(O.formulaPrice(9.66, 0.20, true, 2), 58);
  assert.equal(O.formulaPrice(9.66, 0.20, false, 2), 50);   // VAT off: 48.30 → 50
  assert.equal(O.formulaPrice(9.66, 0.25, true, 5), 50);    // 45.60 → 50
  assert.equal(O.formulaPrice(9.66, 0.20, true, 1), 57);
  assert.equal(O.formulaPrice(10, 0.20, false, 2), 50);     // exactly on a step is not rounded up
  const pc = O.priceCheck(9.66, 58, true);
  near(pc.net, 49.15, 0.005); near(pc.pourCost, 0.197, 0.0005); near(pc.markup, 4.09, 0.005);
  assert.equal(O.menuClass(0.189, 34.27, 0.10, 37.55), "plowhorse");
  assert.equal(O.menuClass(0.142, 39.60, 0.10, 37.55), "star");
  assert.equal(O.menuClass(0.024, 46.03, 0.10, 37.55), "puzzle");
  assert.equal(O.menuClass(0.083, 35.25, 0.10, 37.55), "dog");
  assert.equal(O.orderFor(6, 1.4), 5);
  assert.equal(O.round2(-2.68525), -2.69);
});

test("single preset: Daiquiri 9.66, price 58, 19.7%, GP 39.49, margin 80.3%, markup 409%", () => {
  const prices = C.index(D.PRICE_LIST);
  const c = C.costDrink(D.MENU[0], prices, true);
  assert.equal(c.cost, 9.66);
  assert.deepEqual(c.lines.map((l) => l.lineCost.toFixed(2)), ["8.38", "1.24", "0.04"]);
  near(c.lines[1].costPerUnit, 0.0557, 0.00005);
  assert.equal(O.formulaPrice(c.cost, 0.20, true, 2), 58);
  const pc = O.priceCheck(c.cost, 58, true);
  assert.equal((pc.pourCost * 100).toFixed(1), "19.7");
  assert.equal(pc.grossProfit.toFixed(2), "39.49");
  assert.equal((pc.margin * 100).toFixed(1), "80.3");
  assert.equal((pc.markup * 100).toFixed(0), "409");
});

test("menu preset: 14 costs and formula prices match costing-project-solution.md; 21.1% and 37.62", () => {
  const prices = C.index(D.PRICE_LIST);
  const costs = [9.66, 9.74, 13.01, 13.70, 7.18, 11.04, 10.60, 8.39, 12.86, 16.54, 6.50, 9.55, 2.89, 2.47];
  const formula = [58, 58, 78, 82, 44, 66, 64, 50, 76, 98, 40, 58, 18, 16];
  const rows = D.MENU.map((d, i) => {
    const c = C.costDrink(d, prices, true);
    assert.equal(c.cost, costs[i], d.name);
    assert.equal(O.formulaPrice(c.cost, 0.20, true, 2), formula[i], d.name);
    return { cost: c.cost, price: d.final, sold: d.sold };
  });
  const s = O.menuSummary(rows, true);
  assert.equal(s.sold, 630);
  assert.equal(s.netSales.toFixed(2), "30025.42");
  assert.equal((s.menuPourCost * 100).toFixed(1), "21.1");
  assert.equal(s.avgGrossProfit.toFixed(2), "37.62");
  // Σ sold × cost; the solution file prints 6,325.50, an addition slip (its own rows sum to 6,325.89)
  assert.equal(s.theoreticalCost.toFixed(2), "6325.89");
});

test("yield preset grid", () => {
  const g = C.yieldGrid([700, 750], [30, 45, 60], [0, 0.03, 0.05, 0.10]);
  assert.deepEqual(g[0].rows[1].servings, [15, 15, 14, 14]);
  assert.deepEqual(g[0].rows[0].servings, [23, 22, 22, 21]);
  assert.equal(g[1].rows[2].servings[1], 12);
});

test("variance preset: 110 / 300 / 60 / −200 / 120 ml, total 61.06, costs 2,139.74 → 2,200.80", () => {
  const theo = C.theoreticalFromSales(D.VARIANCE.sales);
  assert.deepEqual(theo, { vodka: 4300, rum: 4500, tequila: 2250, aperol: 4200, gin: 1770 });
  const r = C.reconcileAll(D.VARIANCE.items, theo, 3);
  assert.deepEqual(r.rows.map((x) => Math.round(x.varianceMl)), [110, 300, 60, -200, 120]);
  assert.deepEqual(r.rows.map((x) => x.variancePct.toFixed(1)), ["2.6", "6.7", "2.7", "-4.8", "6.8"]);
  assert.deepEqual(r.rows.map((x) => Math.round(x.unexplainedMl)), [110, 255, 60, -200, 60]);
  assert.deepEqual(r.rows.map((x) => x.flag), ["none", "investigate", "none", "investigate", "investigate"]);
  assert.equal(r.totals.value.toFixed(2), "61.06");
  assert.equal(r.totals.theoreticalCost.toFixed(2), "2139.74");
  assert.equal(r.totals.actualCost.toFixed(2), "2200.80");
});

test("exam preset, published seed: reproduces costing-exam-solution.md and marks it 36/36", () => {
  const ex = C.examData(C.PUBLISHED_SEED);
  const sol = C.examSolution(ex);
  assert.deepEqual(sol.drinks.map((d) => d.cost.toFixed(2)), ["17.04", "8.50", "11.99", "6.76"]);
  assert.deepEqual(sol.drinks.map((d) => d.formula), [102, 52, 72, 40]);
  assert.equal((sol.focus.check.pourCost * 100).toFixed(1), "18.6");
  assert.equal(sol.focus.check.grossProfit.toFixed(2), "37.26");
  assert.equal((sol.focus.check.margin * 100).toFixed(1), "81.4");
  assert.equal((sol.focus.check.markup * 100).toFixed(0), "438");
  assert.equal(sol.summary.netSales.toFixed(2), "9169.49");
  assert.equal(sol.summary.theoreticalCost.toFixed(2), "2233.80");
  assert.equal((sol.summary.menuPourCost * 100).toFixed(1), "24.4");
  assert.equal(sol.summary.avgGrossProfit.toFixed(2), "34.68");
  assert.equal(sol.reconciliation.totals.value.toFixed(2), "57.07");
  assert.equal((sol.actualPourCost * 100).toFixed(1), "25.0");
  assert.deepEqual(sol.reconciliation.rows.map((r) => Math.round(r.varianceMl)), [170, -30, -20, 200, 60]);
  assert.deepEqual(sol.reconciliation.rows.map((r) => r.value.toFixed(2)), ["41.14", "-5.26", "-2.69", "18.80", "5.08"]);
  assert.deepEqual(sol.reconciliation.rows.map((r) => r.flag), ["investigate", "investigate", "none", "explained", "none"]);
  assert.deepEqual(sol.orders, [2, 1, 2, 5, 3]);
  const m = C.markExam(C.solutionAsAnswers(sol), sol);
  assert.equal(m.max, 36);
  assert.equal(m.points, 36);
});

test("exam marking tolerances (brief)", () => {
  const sol = C.examSolution(C.examData(C.PUBLISHED_SEED));
  const a = C.solutionAsAnswers(sol);
  a.A = ["17.08", "8.90", "12.60", "6.76"];          // ±0.05 → 2, ±0.50 → 1, else 0
  a.B.prices = [100, 52, 72, 40];                      // rounded down: wrong
  a.B.pourCost = "15.7";                               // VAT left in: wrong
  a.C.menuPc = "24.5";                                 // within 0.2
  a.D[1].flag = "none";                                // negative variance ignored
  a.E = [2, 1, 2, 4, 3];
  const m = C.markExam(a, sol);
  const pts = (label) => m.items.filter((x) => x.label.startsWith(label)).map((x) => x.points);
  assert.deepEqual(pts("Cost per serving"), [2, 1, 0, 2]);
  assert.deepEqual(pts("Formula price"), [0, 1, 1, 1]);
  assert.deepEqual(pts("Whiskey Sour pour cost"), [0]);
  assert.deepEqual(pts("Menu pour cost"), [1]);
  assert.deepEqual(pts("Cointreau: unexplained"), [0]);
  assert.equal(m.points, 36 - 3 - 1 - 1 - 1 - 1);
});

test("exam preset, other seeds: only sales and stock counts change; data stays consistent", () => {
  for (const seed of [2, 77, 12345, 999999]) {
    const ex = C.examData(seed);
    assert.deepEqual(ex.drinks.map((d) => d.price), [66, 54, 52, 48]);
    assert.deepEqual(ex.drinks.map((d) => d.lines), D.EXAM.drinks.map((d) => d.lines));
    ex.stock.forEach((s) => { assert.ok(s.closing >= 0.3); assert.ok(s.opening + s.received - s.closing > 0); });
    const sol = C.examSolution(ex);
    assert.deepEqual(sol.drinks.map((d) => d.cost.toFixed(2)), ["17.04", "8.50", "11.99", "6.76"]);
    assert.equal(C.markExam(C.solutionAsAnswers(sol), sol).points, 36);
  }
  assert.deepEqual(C.examData(42), C.examData(42));
});
