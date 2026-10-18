/* Operations maths shared by costing-calculator, guest-scenarios and service-sim.
   Pure functions, no DOM. Classic script: window.OpsMath; module.exports under Node.
   Builds on bar-math.js (costPerMl, costPerServing, priceExVat, pourCost, margin, markup,
   priceForPourCost, usage, variance, variancePercent, orderQuantity) and only adds what it lacks.
   Conventions as bar-math: ml, ILS, rates as fractions unless a name ends in Pct. */
(function (root) {
  "use strict";
  var B = (typeof module !== "undefined" && module.exports) ? require("./bar-math.js") : root.BarMath;

  var VAT = 0.18; // Israel, in force since 1 January 2025 (checked on gov.il 2026-10-18)

  function round(x, d) { var f = Math.pow(10, d || 0); return Math.round((x + (x >= 0 ? 1e-9 : -1e-9)) * f) / f; }
  function round2(x) { return round(x, 2); }
  function round4(x) { return round(x, 4); }

  // ---------- costing ----------

  // Cost per usable unit (ml, ml of juice, or piece), ex VAT, unrounded: lesson 10.1 rounds only the final
  // answer (show it to four decimals). The course solutions are computed this way.
  // item: {price, vatIncluded, size, unit: 'ml'|'kg'|'pieces', yieldMlPerKg?}
  function unitCost(item, vatRate) {
    var rate = vatRate === undefined ? VAT : vatRate;
    var ex = item.vatIncluded === false ? item.price : B.priceExVat(item.price, rate);
    if (item.unit === "kg") return B.yieldCostPerMl(ex / item.size, item.yieldMlPerKg);
    return B.costPerMl(ex, item.size);
  }

  // One recipe line: quantity × cost per unit ÷ (1 − waste). Same as bar-math costPerServing for one line.
  function lineCost(qty, costPerUnit, wasteFraction) {
    return B.costPerServing([{ ml: qty, packagePrice: costPerUnit, packageMl: 1, wasteFraction: wasteFraction || 0 }]);
  }

  // lines: [{qty, costPerUnit, waste}] or [{unitCost}] -> cost per serving rounded to agorot.
  function drinkCost(lines) {
    return round2(B.costPerServing(lines.map(function (l) {
      if (l.unitCost !== undefined) return { unitCost: l.unitCost };
      return { ml: l.qty, packagePrice: l.costPerUnit, packageMl: 1, wasteFraction: l.waste || 0 };
    })));
  }

  // Price checks for one drink at a menu price. vatOn: menu price includes VAT.
  function priceCheck(cost, menuPrice, vatOn, vatRate) {
    var rate = vatRate === undefined ? VAT : vatRate;
    var net = vatOn ? B.priceExVat(menuPrice, rate) : menuPrice;
    return { net: net, pourCost: B.pourCost(cost, net), grossProfit: B.grossProfit(cost, net),
      margin: B.margin(cost, net), markup: B.markup(cost, net) };
  }

  // Formula price: cost ÷ target, × (1 + VAT) when vatOn, rounded UP to roundTo.
  function formulaPrice(cost, target, vatOn, roundTo, vatRate) {
    var rate = vatRate === undefined ? VAT : vatRate;
    // guard against 57.000000001 being rounded up to the next step
    var raw = B.priceForPourCost(cost, target, vatOn ? rate : 0, 0);
    raw = round(raw, 6);
    return roundTo ? Math.ceil(raw / roundTo - 1e-9) * roundTo : raw;
  }

  // Menu-wide check. drinks: [{cost, price, sold}] with price incl. VAT when vatOn.
  function menuSummary(drinks, vatOn, vatRate) {
    var sold = 0, net = 0, cost = 0, gp = 0;
    drinks.forEach(function (d) {
      var n = d.sold || 0;
      var p = priceCheck(d.cost, d.price, vatOn, vatRate);
      sold += n; net += n * p.net; cost += n * d.cost; gp += n * p.grossProfit;
    });
    return { sold: sold, netSales: net, theoreticalCost: cost,
      menuPourCost: net > 0 ? cost / net : 0, avgGrossProfit: sold > 0 ? gp / sold : 0 };
  }

  // Menu engineering (lesson 10.4): popularity vs 1 ÷ n, gross profit vs sales-weighted average.
  function menuClass(popularity, grossProfit, avgPopularity, avgGrossProfit) {
    var hiPop = popularity >= avgPopularity - 1e-12, hiGp = grossProfit >= avgGrossProfit - 1e-12;
    return hiPop ? (hiGp ? "star" : "plowhorse") : (hiGp ? "puzzle" : "dog");
  }

  // ---------- inventory reconciliation (lessons 08.4, 10.3, 11.6) ----------
  // item: {bottleMl, opening, received, closing, theoreticalMl, wasteMl, costPerMl}; tolerance in %.
  function reconcile(item, tolerancePct) {
    var tol = tolerancePct === undefined ? 3 : tolerancePct;
    var actual = round(B.usage(item.opening, item.received, item.closing) * item.bottleMl, 6);
    var v = B.variance(actual, item.theoreticalMl);
    var vPct = B.variancePercent(actual, item.theoreticalMl);
    var unexplained = v - (item.wasteMl || 0);
    var uPct = item.theoreticalMl ? unexplained / item.theoreticalMl * 100 : 0;
    var flag = Math.abs(vPct) <= tol + 1e-9 ? "none" : (Math.abs(uPct) <= tol + 1e-9 ? "explained" : "investigate");
    return { actualMl: actual, varianceMl: v, variancePct: vPct, unexplainedMl: unexplained, unexplainedPct: uPct,
      value: v * item.costPerMl, unexplainedValue: unexplained * item.costPerMl,
      theoreticalCost: item.theoreticalMl * item.costPerMl, actualCost: actual * item.costPerMl, flag: flag };
  }

  var FLAG_LABEL = { none: "none", explained: "explained by waste log", investigate: "investigate" };

  // Order list: par − on hand, rounded up to whole bottles (bar-math orderQuantity), on hand counted in tenths.
  function orderFor(par, onHandBottles) { return B.orderQuantity(par, round(onHandBottles, 1)); }

  // ---------- marking helpers ----------
  function within(answer, correct, tol) {
    if (answer === null || answer === undefined || answer === "" || !isFinite(answer)) return false;
    return Math.abs(Number(answer) - correct) <= tol + 1e-9;
  }

  // ---------- service simulation scoring (lessons 08.5, 08.8, 11.4) ----------
  function accuracyPct(correct, ordered) { return ordered > 0 ? correct / ordered * 100 : 0; }
  function wastePct(wasteMl, pouredMl) { return pouredMl > 0 ? wasteMl / pouredMl * 100 : 0; }
  function averageTicketTime(times) {
    if (!times.length) return 0;
    return times.reduce(function (s, t) { return s + t; }, 0) / times.length;
  }
  // Exam: accuracy − time penalty − waste penalty, floor 0, rounded (lesson 11.4).
  function timePenalty(avgSeconds) { return Math.min(20, Math.max(0, (avgSeconds - 300) / 15)); }
  function wastePenalty(wastePctValue) { return Math.min(20, Math.max(0, (wastePctValue - 5) * 2)); }
  function serviceExamScore(accuracy, avgSeconds, wastePctValue) {
    var tp = timePenalty(avgSeconds), wp = wastePenalty(wastePctValue);
    return { accuracy: accuracy, timePenalty: tp, wastePenalty: wp,
      score: Math.max(0, Math.round(accuracy - tp - wp)), pass: Math.max(0, Math.round(accuracy - tp - wp)) >= 70 };
  }
  // Targets: {accuracy (min %), avgTime (max s), waste (max %)}
  function meetsTargets(m, t) {
    return { accuracy: m.accuracy >= t.accuracy - 1e-9, avgTime: m.avgTime <= t.avgTime + 1e-9, waste: m.waste <= t.waste + 1e-9 };
  }

  // ---------- guest scenarios scoring (lessons 09.7, 11.5) ----------
  // picks: [{points: 0|1|2, safety: string|null}] for one scenario (4 decision points).
  function scenarioResult(picks, maxPoints) {
    var max = maxPoints || picks.length * 2;
    var points = picks.reduce(function (s, p) { return s + p.points; }, 0);
    var safety = picks.filter(function (p) { return p.safety; }).map(function (p) { return p.safety; });
    var pct = max ? points / max * 100 : 0;
    return { points: points, max: max, pct: pct, safety: safety, pass: pct >= 70 - 1e-9 && safety.length === 0 };
  }
  // results: array of scenarioResult; exam % = points ÷ 56 × 100; pass = no safety-critical choice anywhere.
  function guestExamResult(results) {
    var points = 0, max = 0, safety = [];
    results.forEach(function (r) { points += r.points; max += r.max; safety = safety.concat(r.safety); });
    return { points: points, max: max, pct: max ? points / max * 100 : 0, safety: safety, safetyPass: safety.length === 0 };
  }

  var api = {
    VAT: VAT, round: round, round2: round2, round4: round4,
    unitCost: unitCost, lineCost: lineCost, drinkCost: drinkCost, priceCheck: priceCheck, formulaPrice: formulaPrice,
    menuSummary: menuSummary, menuClass: menuClass, reconcile: reconcile, FLAG_LABEL: FLAG_LABEL, orderFor: orderFor,
    within: within,
    accuracyPct: accuracyPct, wastePct: wastePct, averageTicketTime: averageTicketTime,
    timePenalty: timePenalty, wastePenalty: wastePenalty, serviceExamScore: serviceExamScore, meetsTargets: meetsTargets,
    scenarioResult: scenarioResult, guestExamResult: guestExamResult
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.OpsMath = api;
})(typeof window !== "undefined" ? window : globalThis);
