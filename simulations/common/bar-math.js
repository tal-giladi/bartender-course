/* Pure bar calculation functions shared by simulations and tested with `node --test scripts/tests/`.
   Classic script: exposes window.BarMath in the browser and module.exports under Node.
   Conventions: volumes in ml, money in ILS, rates as fractions (0.18 = 18%). */
(function (root) {
  "use strict";

  var ML_PER_OZ = 29.5735;           // US fluid ounce
  var BAR_OZ_ML = 30;                // bar convention used by the course (lesson 03.1)
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

  // ABV after adding water: ABV before ÷ (1 + dilution) (lessons 03.5, 08.3).
  function abvAfterDilution(abv, dilution) { return abv / (1 + (dilution || 0)); }

  // Approximate freezing point (°C) of an ethanol-water mix by ABV (fraction).
  // Engineering ToolBox points, linear between them (lesson 08.3 table): 10% -4, 20% -9, 30% -15, 40% -23, 50% -32.
  var FREEZE_POINTS = [[0, 0], [0.10, -4], [0.20, -9], [0.30, -15], [0.40, -23], [0.50, -32]];
  function freezingPointC(abv) {
    var a = Math.max(0, abv);
    for (var i = 1; i < FREEZE_POINTS.length; i++) {
      var p0 = FREEZE_POINTS[i - 1], p1 = FREEZE_POINTS[i];
      if (a <= p1[0]) return p0[1] + (p1[1] - p0[1]) * (a - p0[0]) / (p1[0] - p0[0]);
    }
    var l0 = FREEZE_POINTS[FREEZE_POINTS.length - 2], l1 = FREEZE_POINTS[FREEZE_POINTS.length - 1];
    return l1[1] + (l1[1] - l0[1]) * (a - l1[0]) / (l1[0] - l0[0]);
  }

  // Time constants (s) used by dilutionFraction; exposed so other models share the same curve.
  var DILUTION_TAU = { shake: 4, stir: 15, build: 120, throw: 8 };
  // How close each method gets to the drink's ice-equilibrium temperature (its freezing point after dilution).
  // Shaking reaches it (Arnold, Difford's: about -5 to -8 °C for a sour); stirring, throwing and building lose
  // cold to the glass and air. Educational estimates.
  var TEMP_REACH = { shake: 1.0, stir: 0.75, throw: 0.6, build: 0.5 };

  // Full educational dilution + temperature model used by dilution-lab.
  // opts: {method, abv (fraction), seconds, volumeMl=100, ice='cubes'|'crushed', iceState='machine'|'wet'|'freezer',
  //        startTempC=20, iceG=150}
  // With cubes, machine ice and 20 °C ingredients the dilution equals dilutionFraction exactly (the lesson numbers).
  // Adjustments (educational estimates, lessons 01.6 and 03.5):
  //  - crushed ice: about twice as fast (tau x0.5), plateau x1.15 (x1.3 when built) - smaller ice melts faster;
  //  - wet ice: surface water of about 3 g per 100 g of ice goes straight in;
  //  - freezer ice at -18 °C: its extra cold replaces some melting. Fully used it would be
  //    iceG x 0.5 cal/g°C x 18 °C ÷ 80 cal/g (Arnold: 150 g at -10 °C = about 9.5 g of melting), but in a short
  //    mix only the outer layer of each cube warms, so the model uses 30% of it (about 5 g per 150 g of ice):
  //    "very cold freezer ice does not change much" (lesson 03.5);
  //  - colder ingredients need less melting: volume x 0.9 cal/g°C x (20 - start) ÷ 80.
  function dilutionModel(opts) {
    var o = opts || {};
    var method = o.method, abv = o.abv || 0, vol = o.volumeMl || 100;
    var ice = o.ice || "cubes", state = o.iceState || "machine";
    var start = o.startTempC === undefined ? 20 : o.startTempC;
    var iceG = o.iceG === undefined ? 150 : o.iceG;
    var t = o.seconds === undefined ? Infinity : Math.max(0, o.seconds);
    var plateau = dilutionFraction(method, abv);       // throws on unknown method
    var tau = DILUTION_TAU[method];
    if (ice === "crushed") { tau *= 0.5; plateau *= method === "build" ? 1.3 : 1.15; }
    var progress = 1 - Math.exp(-t / tau);
    var water = plateau * vol * progress;
    if (state === "wet" && t > 0) water += 0.03 * iceG;
    if (state === "freezer") water -= 0.3 * iceG * 0.5 * 18 / 80 * progress;
    water -= vol * 0.9 * (20 - start) / 80 * progress;
    water = Math.max(0, water);
    var d = water / vol;
    var abvAfter = abvAfterDilution(abv, d);
    // Temperature: same progress curve as the dilution (no chilling without dilution), heading for the
    // freezing point of the drink at its plateau dilution, scaled by how close the method gets.
    var eq = freezingPointC(abvAfterDilution(abv, plateau));
    var target = eq * TEMP_REACH[method];
    var temp = start + (target - start) * progress;
    return { dilution: d, waterMl: water, finalMl: vol + water, abvAfter: abvAfter, tempC: temp,
      plateau: plateau, progress: progress, equilibriumC: eq };
  }

  // ---- ingredient ABV guesses (typical label values, assumed for maths; learners should use their bottle) ----
  var ABV_GUESS = [
    [/angostura|bitters/i, 0.447], [/sweet.*vermouth|red vermouth/i, 0.16], [/dry vermouth/i, 0.18], [/vermouth/i, 0.16],
    [/campari/i, 0.25], [/aperol/i, 0.11], [/cointreau/i, 0.40], [/triple sec|curaçao|curacao/i, 0.30],
    [/coffee liqueur|kahl/i, 0.20], [/elderflower/i, 0.20], [/amaro/i, 0.35], [/genever/i, 0.35],
    [/islay|lagavulin|single malt/i, 0.43], [/prosecco/i, 0.11], [/champagne|sparkling wine/i, 0.12],
    [/cordial|syrup|juice|soda|water|cola|ginger beer|tonic|espresso|coffee|egg|aquafaba|sugar|tea|cranberry|tomato|honey|orgeat|salt|mint|basil|ginger|lime|lemon|worcestershire|tabasco/i, 0],
    [/gin|vodka|rum|whisk|bourbon|rye|scotch|tequila|mezcal|cognac|brandy|pisco|cachaça|cachaca|arak|ouzo|spirit/i, 0.40]
  ];
  function guessAbv(item) {
    for (var i = 0; i < ABV_GUESS.length; i++) if (ABV_GUESS[i][0].test(item || "")) return ABV_GUESS[i][1];
    return 0;
  }

  // Non-ml spec amounts that can be turned into ml ("1 dash", "2 bar spoons", "1 shot (about 30 ml)"); else null.
  function amountToMl(amount) {
    var s = String(amount || "").toLowerCase();
    var about = s.match(/about\s+([\d.]+)\s*ml/);
    if (about) return parseFloat(about[1]);
    var m = s.match(/^([\d.]+)\s*(dash|dashes|bar ?spoons?|barspoons?|tsp|teaspoons?|tbsp|tablespoons?|ml|cl|oz)\b/);
    if (!m) return null;
    var n = parseFloat(m[1]), u = m[2];
    if (/^dash/.test(u)) return n * UNITS.dash;
    if (/bar ?spoon/.test(u)) return n * UNITS.barspoon;
    if (/^(tsp|teaspoon)/.test(u)) return n * UNITS.tsp;
    if (/^(tbsp|tablespoon)/.test(u)) return n * UNITS.tbsp;
    if (u === "cl") return n * 10;
    if (u === "oz") return n * BAR_OZ_ML;
    return n;
  }

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
    BAR_OZ_ML: BAR_OZ_ML, abvAfterDilution: abvAfterDilution, freezingPointC: freezingPointC,
    DILUTION_TAU: DILUTION_TAU, TEMP_REACH: TEMP_REACH, dilutionModel: dilutionModel,
    guessAbv: guessAbv, amountToMl: amountToMl,
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
