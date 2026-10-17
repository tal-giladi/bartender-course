/* Pure bar calculation functions shared by simulations and tested with `node --test scripts/tests/`.
   Classic script: exposes window.BarMath in the browser and module.exports under Node.
   Conventions: volumes in ml, money in ILS, rates as fractions (0.18 = 18%). */
(function (root) {
  "use strict";

  var ML_PER_OZ = 29.5735;           // US fluid ounce
  var UNITS = {                      // ml per unit (bar conventions; dash and barspoon are approximate)
    ml: 1, cl: 10, oz: ML_PER_OZ, barspoon: 5, tsp: 5, tbsp: 15, dash: 0.8
  };

  function toMl(value, unit) {
    if (!(unit in UNITS)) throw new Error("unknown unit " + unit);
    return value * UNITS[unit];
  }
  function fromMl(ml, unit) {
    if (!(unit in UNITS)) throw new Error("unknown unit " + unit);
    return ml / UNITS[unit];
  }
  function convert(value, from, to) { return fromMl(toMl(value, from), to); }

  // Bar-friendly oz: nearest quarter ounce (30 ml is taught as "1 oz" in bar convention).
  function barOz(ml) { return Math.round(ml / 30 * 4) / 4; }

  // parts: [{item, parts}] + total ml -> [{item, ml}]
  function partsToMl(parts, totalMl) {
    var sum = parts.reduce(function (s, p) { return s + p.parts; }, 0);
    return parts.map(function (p) { return { item: p.item, ml: totalMl * p.parts / sum }; });
  }

  // ingredients: [{item, ml}] -> scaled for n drinks
  function scale(ingredients, n) {
    return ingredients.map(function (i) { return { item: i.item, ml: i.ml * n }; });
  }
  function totalMl(ingredients) { return ingredients.reduce(function (s, i) { return s + (i.ml || 0); }, 0); }

  // Batch for n drinks with planned dilution (fraction of the undiluted volume added as water).
  function batch(ingredients, n, dilution) {
    var scaled = scale(ingredients, n);
    var base = totalMl(scaled);
    var water = base * (dilution || 0);
    return { ingredients: scaled, waterMl: water, totalMl: base + water, perServingMl: (base + water) / n };
  }

  // ABV of a mix: ingredients [{ml, abv}] with abv as fraction; optional added water ml.
  function mixAbv(ingredients, addedWaterMl) {
    var alc = ingredients.reduce(function (s, i) { return s + i.ml * (i.abv || 0); }, 0);
    var vol = totalMl(ingredients) + (addedWaterMl || 0);
    return vol > 0 ? alc / vol : 0;
  }

  // Educational dilution model: fraction of water added relative to the starting volume, by method and
  // starting ABV (fraction), approaching a plateau over time. Linear fit to two anchors per method:
  // Dave Arnold, Cooking Issues (2010): shaken whiskey sour (~23% ABV) ~63%, stirred Manhattan (~32% ABV) ~50%;
  // at 0% ABV chilling water to ~0 °C needs ~20-25% (lesson 03.5). Build and throw are rough estimates.
  function dilutionFraction(method, startAbv, seconds) {
    var a = Math.max(0, Math.min(startAbv, 0.6));
    var plateau, tau;
    if (method === "shake") { plateau = 0.20 + 1.85 * a; tau = 4; }          // ~98% of plateau by 15 s
    else if (method === "stir") { plateau = 0.22 + 0.90 * a; tau = 15; }     // ~95% of plateau by 45 s
    else if (method === "build") { plateau = 0.10 + 0.50 * a; tau = 120; }   // on cubes, slow melt
    else if (method === "throw") { plateau = 0.15 + 1.20 * a; tau = 8; }
    else throw new Error("unknown method " + method);
    var t = seconds === undefined ? Infinity : Math.max(0, seconds);
    return plateau * (1 - Math.exp(-t / tau));
  }

  function dilutionPercent(beforeMl, afterMl) { return (afterMl - beforeMl) / beforeMl * 100; }

  // ---- costing ----
  function costPerMl(packagePrice, packageMl) { return packagePrice / packageMl; }

  // Usable ml from a bottle after waste/spillage allowance (fraction).
  function usableMl(bottleMl, wasteFraction) { return bottleMl * (1 - (wasteFraction || 0)); }
  function servingsPerBottle(bottleMl, pourMl, wasteFraction) { return Math.floor(usableMl(bottleMl, wasteFraction) / pourMl); }

  // Yield for produce: usable fraction (e.g. juice ml per kg of fruit).
  function yieldCostPerMl(pricePerKg, mlPerKg) { return pricePerKg / mlPerKg; }

  // lines: [{ml, packagePrice, packageMl, wasteFraction?}] or [{unitCost}] (garnish etc.)
  function costPerServing(lines) {
    return lines.reduce(function (s, l) {
      if (l.unitCost !== undefined) return s + l.unitCost;
      var waste = l.wasteFraction || 0;
      return s + l.ml * costPerMl(l.packagePrice, l.packageMl) / (1 - waste);
    }, 0);
  }

  function priceExVat(priceIncVat, vatRate) { return priceIncVat / (1 + vatRate); }
  function priceIncVat(priceExVatValue, vatRate) { return priceExVatValue * (1 + vatRate); }

  // Pour cost % = cost ÷ net (ex-VAT) selling price.
  function pourCost(cost, netPrice) { return cost / netPrice; }
  function grossProfit(cost, netPrice) { return netPrice - cost; }
  function margin(cost, netPrice) { return (netPrice - cost) / netPrice; }     // share of price
  function markup(cost, netPrice) { return (netPrice - cost) / cost; }         // share of cost

  // Net price needed for a target pour cost, then optionally VAT-inclusive and rounded up to `roundTo`.
  function priceForPourCost(cost, targetPourCost, vatRate, roundTo) {
    var net = cost / targetPourCost;
    var gross = vatRate ? priceIncVat(net, vatRate) : net;
    if (roundTo) gross = Math.ceil(gross / roundTo) * roundTo;
    return gross;
  }

  // Inventory: used = opening + received - closing; variance = used - sold.
  function usage(opening, received, closing) { return opening + received - closing; }
  function variance(used, sold) { return used - sold; }
  function variancePercent(used, sold) { return sold === 0 ? 0 : (used - sold) / sold * 100; }
  function orderQuantity(par, onHand) { return Math.max(0, Math.ceil(par - onHand)); }

  // Measurement accuracy: error % of a measured pour vs target.
  function accuracyError(targetMl, measuredMl) { return (measuredMl - targetMl) / targetMl * 100; }
  function withinTolerance(targetMl, measuredMl, tolPct) { return Math.abs(accuracyError(targetMl, measuredMl)) <= tolPct; }

  // Final assessment (course-outline §6).
  var WEIGHTS = { written: 0.20, recall: 0.25, technique: 0.25, service: 0.20, costing: 0.10 };
  var MINIMUMS = { written: 70, recall: 80, technique: 75, service: 70, costing: 70 };
  function finalGrade(scores, safetyFail) {
    var total = 0, allMin = true, missing = [];
    Object.keys(WEIGHTS).forEach(function (k) {
      var s = scores[k];
      if (typeof s !== "number") { missing.push(k); allMin = false; return; }
      total += s * WEIGHTS[k];
      if (s < MINIMUMS[k]) allMin = false;
    });
    return { total: total, allMinimumsMet: allMin, missing: missing, pass: total >= 80 && allMin && !safetyFail };
  }

  var api = {
    ML_PER_OZ: ML_PER_OZ, UNITS: UNITS, toMl: toMl, fromMl: fromMl, convert: convert, barOz: barOz,
    partsToMl: partsToMl, scale: scale, totalMl: totalMl, batch: batch, mixAbv: mixAbv,
    dilutionFraction: dilutionFraction, dilutionPercent: dilutionPercent,
    costPerMl: costPerMl, usableMl: usableMl, servingsPerBottle: servingsPerBottle, yieldCostPerMl: yieldCostPerMl,
    costPerServing: costPerServing, priceExVat: priceExVat, priceIncVat: priceIncVat,
    pourCost: pourCost, grossProfit: grossProfit, margin: margin, markup: markup, priceForPourCost: priceForPourCost,
    usage: usage, variance: variance, variancePercent: variancePercent, orderQuantity: orderQuantity,
    accuracyError: accuracyError, withinTolerance: withinTolerance,
    WEIGHTS: WEIGHTS, MINIMUMS: MINIMUMS, finalGrade: finalGrade
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.BarMath = api;
})(typeof window !== "undefined" ? window : globalThis);
