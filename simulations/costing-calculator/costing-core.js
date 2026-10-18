/* Pure logic for the costing calculator (no DOM). Classic script: window.CostingCore; module.exports under Node. */
(function (root) {
  "use strict";
  var NODE = typeof module !== "undefined" && module.exports;
  var B = NODE ? require("../common/bar-math.js") : root.BarMath;
  var O = NODE ? require("../common/ops-math.js") : root.OpsMath;
  var D = NODE ? require("./costing-data.js") : root.CostingData;
  if (NODE) require("../common/sim.js");
  var S = NODE ? globalThis.Sim : root.Sim;

  function clone(x) { return JSON.parse(JSON.stringify(x)); }

  function index(list) { var o = {}; list.forEach(function (p) { o[p.key] = p; }); return o; }

  function unitLabel(p) { return p.unit === "kg" ? "ml of juice" : p.unit === "pieces" ? "piece" : "ml"; }

  // drink: {lines: [[key, qty]], other}; prices: index of price-list items. vatIncluded: purchase prices incl. VAT.
  function costDrink(drink, prices, vatIncluded) {
    var lines = drink.lines.map(function (l) {
      var p = prices[l[0]];
      if (!p) return { key: l[0], item: "(unknown product)", qty: l[1], costPerUnit: 0, waste: 0, lineCost: 0, missing: true };
      var cpu = O.unitCost({ price: p.price, vatIncluded: vatIncluded !== false, size: p.size, unit: p.unit, yieldMlPerKg: p.yieldMlPerKg });
      return { key: l[0], item: p.item, qty: l[1], unit: unitLabel(p), costPerUnit: cpu, waste: p.waste, lineCost: O.lineCost(l[1], cpu, p.waste) };
    });
    var cost = O.drinkCost(lines.map(function (l) { return { qty: l.qty, costPerUnit: l.costPerUnit, waste: l.waste }; })
      .concat([{ unitCost: drink.other || 0 }]));
    return { lines: lines, other: drink.other || 0, cost: cost };
  }

  // Bottle yield grid for the yield preset.
  function yieldGrid(bottles, pours, wastes) {
    return bottles.map(function (b) {
      return { bottle: b, rows: pours.map(function (p) {
        return { pour: p, servings: wastes.map(function (w) { return B.servingsPerBottle(b, p, w); }) };
      }) };
    });
  }

  // Theoretical ml per item from POS counts × standard recipes.
  function theoreticalFromSales(sales) {
    var out = {};
    sales.forEach(function (s) {
      Object.keys(s.uses).forEach(function (k) { out[k] = (out[k] || 0) + s.sold * s.uses[k]; });
    });
    return out;
  }

  function reconcileAll(items, theoretical, tolerancePct) {
    var rows = items.map(function (it) {
      var r = O.reconcile({ bottleMl: it.bottleMl, opening: it.opening, received: it.received, closing: it.closing,
        theoreticalMl: theoretical[it.key] || 0, wasteMl: it.wasteMl, costPerMl: it.costPerMl }, tolerancePct);
      r.item = it; r.theoreticalMl = theoretical[it.key] || 0;
      return r;
    });
    var tot = rows.reduce(function (a, r) {
      a.value += r.value; a.theoreticalCost += r.theoreticalCost; a.actualCost += r.actualCost; return a;
    }, { value: 0, theoreticalCost: 0, actualCost: 0 });
    return { rows: rows, totals: tot };
  }

  // ---------- exam (lesson 11.6) ----------
  var PUBLISHED_SEED = 1;

  function examData(seed) {
    var ex = clone(D.EXAM);
    if (seed === PUBLISHED_SEED) return ex;
    var r = S.rng(seed);
    ex.drinks.forEach(function (d) { d.sold = Math.max(10, Math.round(d.sold * (0.7 + 0.6 * r()))); });
    var uses = {};
    ex.drinks.forEach(function (d) { d.lines.forEach(function (l) { uses[l[0]] = (uses[l[0]] || 0) + d.sold * l[1]; }); });
    ex.stock.forEach(function (s) {
      var theo = uses[s.key] || 0;
      var f = -0.06 + 0.16 * r();                      // −6% … +10% variance
      var tenth = s.bottleMl / 10;
      var actual = Math.max(tenth, Math.round(theo * (1 + f) / tenth) * tenth);
      s.opening = Math.max(0.5, Math.round((s.opening + (r() - 0.5) * 0.6) * 10) / 10);
      var closing = Math.round((s.opening + s.received - actual / s.bottleMl) * 10) / 10;
      while (closing < 0.3) { s.received += 1; closing = Math.round((closing + 1) * 10) / 10; }
      s.closing = closing;
    });
    return ex;
  }

  function examPrices() { return index(D.PRICE_LIST.concat(D.EXAM.extra)); }

  function examSolution(ex) {
    var prices = examPrices();
    var drinks = ex.drinks.map(function (d) {
      var c = costDrink(d, prices, true);
      var pc = O.priceCheck(c.cost, d.price, true);
      return { name: d.name, costing: c, cost: c.cost, formula: O.formulaPrice(c.cost, ex.target, true, ex.roundTo), price: d.price, sold: d.sold, check: pc };
    });
    var sum = O.menuSummary(drinks.map(function (d) { return { cost: d.cost, price: d.price, sold: d.sold }; }), true);
    var theo = {};
    ex.drinks.forEach(function (d) { d.lines.forEach(function (l) { theo[l[0]] = (theo[l[0]] || 0) + d.sold * l[1]; }); });
    var items = ex.stock.map(function (s) {
      var cpm = O.unitCost({ price: prices[s.key].price, size: prices[s.key].size, unit: prices[s.key].unit });
      return { key: s.key, item: s.item, bottleMl: s.bottleMl, opening: s.opening, received: s.received, closing: s.closing, wasteMl: s.wasteMl, costPerMl: cpm };
    });
    var rec = reconcileAll(items, theo, ex.tolerancePct);
    var orders = ex.stock.map(function (s) { return O.orderFor(s.par, s.closing); });
    var focus = drinks.filter(function (d) { return d.name === ex.focus; })[0];
    return { drinks: drinks, summary: sum, focus: focus, reconciliation: rec, orders: orders,
      actualPourCost: (sum.theoreticalCost + rec.totals.value) / sum.netSales };
  }

  function num(v) { if (v === null || v === undefined) return NaN; var s = String(v).trim().replace(/,/g, "").replace("%", ""); return s === "" ? NaN : Number(s); }

  // answers: {A: [4], B: {prices: [4], pourCost, gp, margin, markup}, C: {net, theo, menuPc, avgGp, actualPc},
  //           D: [{actual, variance, pct, unexplained, value, flag}] x5, E: [5]}; percentages entered as % numbers.
  // Returns {items: [{part, label, answer, correct, points, max}], points, max: 36}
  function markExam(answers, sol) {
    var items = [];
    function add(part, label, answer, correct, points, max, shown) { items.push({ part: part, label: label, answer: answer, correct: shown !== undefined ? shown : correct, points: points, max: max }); }
    var a = answers || {};
    var A = a.A || [];
    sol.drinks.forEach(function (d, i) {
      var v = num(A[i]);
      var p = O.within(v, d.cost, 0.05) ? 2 : O.within(v, d.cost, 0.5) ? 1 : 0;
      add("A", "Cost per serving — " + d.name, A[i], d.cost.toFixed(2), p, 2);
    });
    var Bp = (a.B && a.B.prices) || [];
    sol.drinks.forEach(function (d, i) {
      var v = num(Bp[i]);
      add("B", "Formula price — " + d.name, Bp[i], String(d.formula), isFinite(v) && v === d.formula ? 1 : 0, 1);
    });
    var f = sol.focus.check, b = a.B || {};
    add("B", sol.focus.name + " pour cost (%)", b.pourCost, (f.pourCost * 100).toFixed(1), O.within(num(b.pourCost), f.pourCost * 100, 0.2) ? 1 : 0, 1);
    add("B", sol.focus.name + " gross profit (ILS)", b.gp, f.grossProfit.toFixed(2), O.within(num(b.gp), O.round2(f.grossProfit), 0.05) ? 1 : 0, 1);
    add("B", sol.focus.name + " margin (%)", b.margin, (f.margin * 100).toFixed(1), O.within(num(b.margin), f.margin * 100, 0.2) ? 1 : 0, 1);
    add("B", sol.focus.name + " markup (%)", b.markup, (f.markup * 100).toFixed(0), O.within(num(b.markup), f.markup * 100, 1) ? 1 : 0, 1);
    var c = a.C || {}, s = sol.summary;
    add("C", "Net sales (ILS)", c.net, s.netSales.toFixed(2), O.within(num(c.net), O.round2(s.netSales), 1) ? 1 : 0, 1);
    add("C", "Theoretical cost (ILS)", c.theo, s.theoreticalCost.toFixed(2), O.within(num(c.theo), O.round2(s.theoreticalCost), 1) ? 1 : 0, 1);
    add("C", "Menu pour cost (%)", c.menuPc, (s.menuPourCost * 100).toFixed(1), O.within(num(c.menuPc), s.menuPourCost * 100, 0.2) ? 1 : 0, 1);
    add("C", "Average gross profit (ILS)", c.avgGp, s.avgGrossProfit.toFixed(2), O.within(num(c.avgGp), O.round2(s.avgGrossProfit), 0.05) ? 1 : 0, 1);
    add("C", "Actual pour cost (%)", c.actualPc, (sol.actualPourCost * 100).toFixed(1), O.within(num(c.actualPc), sol.actualPourCost * 100, 0.2) ? 1 : 0, 1);
    var Dd = a.D || [];
    sol.reconciliation.rows.forEach(function (r, i) {
      var u = Dd[i] || {};
      var p1 = O.within(num(u.actual), r.actualMl, 1) && O.within(num(u.variance), r.varianceMl, 1) && O.within(num(u.pct), r.variancePct, 0.2);
      var p2 = O.within(num(u.unexplained), r.unexplainedMl, 1) && O.within(num(u.value), O.round2(r.value), 0.05) && u.flag === r.flag;
      var name = r.item.item.split(" (")[0];
      add("D", name + ": actual, variance ml and %", [u.actual, u.variance, u.pct].map(function (x) { return x === undefined || x === "" ? "—" : x; }).join(" / "),
        Math.round(r.actualMl) + " / " + Math.round(r.varianceMl) + " / " + r.variancePct.toFixed(1) + "%", p1 ? 1 : 0, 1);
      add("D", name + ": unexplained, value, flag", [u.unexplained, u.value, u.flag ? O.FLAG_LABEL[u.flag] : ""].map(function (x) { return x === undefined || x === "" ? "—" : x; }).join(" / "),
        Math.round(r.unexplainedMl) + " / " + r.value.toFixed(2) + " / " + O.FLAG_LABEL[r.flag], p2 ? 1 : 0, 1);
    });
    var E = a.E || [];
    sol.orders.forEach(function (o, i) {
      var v = num(E[i]);
      add("E", "Order — " + sol.reconciliation.rows[i].item.item.split(" (")[0], E[i], String(o), isFinite(v) && v === o ? 1 : 0, 1);
    });
    var points = items.reduce(function (t, x) { return t + x.points; }, 0);
    var max = items.reduce(function (t, x) { return t + x.max; }, 0);
    return { items: items, points: points, max: max };
  }

  // The worked solution as an answer sheet (used by the tests and the "show solution" check).
  function solutionAsAnswers(sol) {
    return {
      A: sol.drinks.map(function (d) { return d.cost.toFixed(2); }),
      B: { prices: sol.drinks.map(function (d) { return d.formula; }), pourCost: (sol.focus.check.pourCost * 100).toFixed(1),
        gp: sol.focus.check.grossProfit.toFixed(2), margin: (sol.focus.check.margin * 100).toFixed(1), markup: (sol.focus.check.markup * 100).toFixed(0) },
      C: { net: sol.summary.netSales.toFixed(2), theo: sol.summary.theoreticalCost.toFixed(2), menuPc: (sol.summary.menuPourCost * 100).toFixed(1),
        avgGp: sol.summary.avgGrossProfit.toFixed(2), actualPc: (sol.actualPourCost * 100).toFixed(1) },
      D: sol.reconciliation.rows.map(function (r) { return { actual: Math.round(r.actualMl), variance: Math.round(r.varianceMl), pct: r.variancePct.toFixed(1),
        unexplained: Math.round(r.unexplainedMl), value: r.value.toFixed(2), flag: r.flag }; }),
      E: sol.orders.slice()
    };
  }

  var api = { index: index, unitLabel: unitLabel, costDrink: costDrink, yieldGrid: yieldGrid, theoreticalFromSales: theoreticalFromSales,
    reconcileAll: reconcileAll, PUBLISHED_SEED: PUBLISHED_SEED, examData: examData, examPrices: examPrices, examSolution: examSolution,
    markExam: markExam, solutionAsAnswers: solutionAsAnswers, clone: clone };
  if (NODE) module.exports = api;
  else root.CostingCore = api;
})(typeof window !== "undefined" ? window : globalThis);
