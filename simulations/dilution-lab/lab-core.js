/* Pure logic for the dilution lab (no DOM). Classic script: window.LabCore; module.exports under Node.
   All numbers come from BarMath.dilutionModel (common/bar-math.js), the course's one dilution model. */
(function (root) {
  "use strict";
  var B = (typeof module !== "undefined" && module.exports) ? require("../common/bar-math.js") : root.BarMath;

  var METHODS = { shake: "Shake", stir: "Stir", build: "Build on ice", throw: "Throw" };
  var MAX_T = { shake: 60, stir: 180, build: 900, throw: 30 };

  var DRINKS = {
    "na-sour": { name: "Practice sour, alcohol-free: 60 water, 22.5 lemon, 22.5 syrup (03.5)", volumeMl: 105, abv: 0 },
    "water": { name: "Plain water drill (04.3, 04.4)", volumeMl: 90, abv: 0 },
    "sour25": { name: "A sour, about 25% ABV, 95 ml (04.1, 04.4)", volumeMl: 95, abv: 0.25 },
    "whiskey-sour": { name: "Whiskey sour, about 23% ABV (Arnold's anchor)", volumeMl: 90, abv: 0.23 },
    "stirred32": { name: "Spirit-forward, 32% ABV, 90 ml: 60 ml 40% spirit + 30 ml 16% vermouth (04.3)", volumeMl: 90, abv: 0.32 },
    "thrown33": { name: "A spirit-forward drink for throwing, about 33% (04.6)", volumeMl: 90, abv: 0.33 },
    "highball10": { name: "A highball on cubes, about 10% ABV (04.1)", volumeMl: 170, abv: 0.10 }
  };

  // Volume (ml lines plus convertible amounts) and ABV of a course recipe, ABVs guessed from typical labels.
  function drinkFromRecipe(r) {
    var lines = [];
    r.ingredients.forEach(function (i) {
      var ml = typeof i.ml === "number" ? i.ml : B.amountToMl(i.amount);
      if (ml !== null && ml !== undefined) lines.push({ ml: ml, abv: B.guessAbv(i.item) });
    });
    return { name: r.name + " (" + r.lesson + ")", volumeMl: B.totalMl(lines), abv: B.mixAbv(lines), method: r.method };
  }

  // settings: {method, abv, volumeMl, ice, iceState, startTempC}; returns the model at t seconds.
  function at(settings, t) {
    var s = Object.assign({}, settings, { seconds: t });
    return B.dilutionModel(s);
  }

  function curve(settings, metric, tMax, steps) {
    var pts = [], n = steps || 60;
    for (var i = 0; i <= n; i++) {
      var t = tMax * i / n, m = at(settings, t);
      pts.push([t, metric === "temp" ? m.tempC : m.dilution * 100]);
    }
    return pts;
  }

  var TOL = { dilution: 5, temp: 2 };   // percentage points; °C
  function grade(metric, predicted, model) {
    var diff = predicted - model;
    return { diff: diff, close: Math.abs(diff) <= TOL[metric] };
  }

  function S(drink, method, t, extra) {
    var d = DRINKS[drink];
    return Object.assign({ drink: drink, method: method, t: t, volumeMl: d.volumeMl, abv: d.abv, ice: "cubes", iceState: "machine", startTempC: 20 }, extra || {});
  }

  // Tasks per preset. Each row has its own settings and time, so one task can compare setups.
  var TASKS = {
    shake: [
      { title: "A 25% ABV sour, shaken (lesson 04.4)", metric: "dilution",
        rows: [S("sour25", "shake", 5), S("sour25", "shake", 10), S("sour25", "shake", 15)] },
      { title: "Alcohol-free practice sour, shaken (lesson 03.5)", metric: "dilution",
        rows: [S("na-sour", "shake", 5), S("na-sour", "shake", 10), S("na-sour", "shake", 15), S("na-sour", "shake", 30)] }
    ],
    stir: [
      { title: "A 90 ml, 32% ABV drink, stirred (lesson 04.3)", metric: "dilution",
        rows: [S("stirred32", "stir", 10), S("stirred32", "stir", 20), S("stirred32", "stir", 30)] },
      { title: "Alcohol-free practice sour, stirred (lesson 03.5)", metric: "dilution",
        rows: [S("na-sour", "stir", 15), S("na-sour", "stir", 30), S("na-sour", "stir", 45)] }
    ],
    build: [
      { title: "Practice sour poured over ice, 2 minutes (lesson 03.5)", metric: "dilution",
        rows: [S("na-sour", "build", 120)] },
      { title: "A highball keeps diluting in the glass (lessons 03.6, 04.1)", metric: "dilution",
        rows: [S("highball10", "build", 30), S("highball10", "build", 300), S("highball10", "build", 600)] }
    ],
    throw: [
      { title: "A 33% ABV drink, thrown (lesson 04.6)", metric: "dilution",
        rows: [S("thrown33", "throw", 5), S("thrown33", "throw", 8), S("thrown33", "throw", 10)] }
    ],
    temperature: [
      { title: "How cold does it get? (lesson 03.5)", metric: "temp",
        rows: [S("na-sour", "shake", 15), S("sour25", "shake", 15), S("stirred32", "stir", 45), S("na-sour", "build", 120)] },
      { title: "Machine, freezer and wet ice: same drink, 15 s shake (lessons 01.6, 03.5)", metric: "dilution",
        rows: [S("sour25", "shake", 15), S("sour25", "shake", 15, { iceState: "freezer" }), S("sour25", "shake", 15, { iceState: "wet" })] },
      { title: "Chilled ingredients: room temperature vs fridge-cold, 15 s shake", metric: "dilution",
        rows: [S("sour25", "shake", 15), S("sour25", "shake", 15, { startTempC: 4 })] }
    ]
  };
  TASKS.explore = [TASKS.shake[0], TASKS.stir[0], TASKS.build[1], TASKS.throw[0], TASKS.temperature[0]];

  var ICE_LABEL = { cubes: "cubes", crushed: "crushed" };
  var STATE_LABEL = { machine: "machine ice, 0 °C, dry", wet: "wet ice from the well", freezer: "freezer ice, −18 °C" };
  function rowLabel(r) {
    var parts = [DRINKS[r.drink].name.replace(/ \(.*\)$/, "").replace(/:.*/, ""), METHODS[r.method].toLowerCase() + " " + fmtTime(r.t)];
    if (r.ice !== "cubes") parts.push(ICE_LABEL[r.ice] + " ice");
    if (r.iceState !== "machine") parts.push(STATE_LABEL[r.iceState]);
    if (r.startTempC !== 20) parts.push("ingredients at " + r.startTempC + " °C");
    return parts.join(", ");
  }
  function fmtTime(t) { return t >= 120 && t % 60 === 0 ? (t / 60) + " min" : t + " s"; }

  function evaluateTask(task, predictions) {
    var close = 0, answered = 0;
    var rows = task.rows.map(function (r, i) {
      var m = at(r, r.t);
      var model = task.metric === "temp" ? m.tempC : m.dilution * 100;
      var p = predictions[i];
      var g = (typeof p === "number" && isFinite(p)) ? grade(task.metric, p, model) : null;
      if (g) { answered++; if (g.close) close++; }
      return { label: rowLabel(r), model: model, predicted: g ? p : null, diff: g ? g.diff : null, close: g ? g.close : null, result: m };
    });
    return { rows: rows, close: close, answered: answered, total: task.rows.length };
  }

  // Home measurement: weights in g (ml for water-based mixes) -> dilution %, compared with the model.
  function measurement(beforeG, afterG, settings, t) {
    var measured = B.dilutionPercent(beforeG, afterG);
    var model = at(Object.assign({}, settings, { volumeMl: beforeG }), t).dilution * 100;
    return { measured: measured, model: model, diff: measured - model };
  }

  var api = { METHODS: METHODS, MAX_T: MAX_T, DRINKS: DRINKS, TASKS: TASKS, TOL: TOL, drinkFromRecipe: drinkFromRecipe,
    at: at, curve: curve, grade: grade, rowLabel: rowLabel, fmtTime: fmtTime, evaluateTask: evaluateTask, measurement: measurement };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.LabCore = api;
})(typeof window !== "undefined" ? window : globalThis);
