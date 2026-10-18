/* Pure logic for the recipe scaler (no DOM). Classic script: window.ScalerCore; module.exports under Node. */
(function (root) {
  "use strict";
  var B = (typeof module !== "undefined" && module.exports) ? require("../common/bar-math.js") : root.BarMath;

  var UNIT_ML = { ml: 1, cl: 10, oz_bar: B.BAR_OZ_ML, oz: B.ML_PER_OZ, barspoon: 5, tsp: 5, tbsp: 15, dash: 0.8 };
  var UNIT_LABEL = { ml: "ml", cl: "cl", oz_bar: "oz (bar)", oz: "oz (exact)", barspoon: "barspoon", tsp: "tsp", tbsp: "tbsp", dash: "dash", text: "text" };

  var VULGAR = { "½": 0.5, "¼": 0.25, "¾": 0.75, "⅓": 1 / 3, "⅔": 2 / 3, "⅛": 0.125 };

  // "1 1/2", "1½", "¾", "3/4", "0.75", "1,5" -> number; NaN when not a number.
  function parseQty(input) {
    var s = String(input === undefined || input === null ? "" : input).trim().replace(",", ".");
    if (!s) return NaN;
    var total = 0, found = false;
    s = s.replace(/[½¼¾⅓⅔⅛]/g, function (c) { total += VULGAR[c]; found = true; return " "; }).trim();
    if (!s) return found ? total : NaN;
    var parts = s.split(/\s+/);
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i], v;
      if (/^\d+(\.\d+)?\/\d+(\.\d+)?$/.test(p)) { var f = p.split("/"); v = parseFloat(f[0]) / parseFloat(f[1]); }
      else if (/^\d*\.?\d+$/.test(p)) v = parseFloat(p);
      else return NaN;
      if (!isFinite(v)) return NaN;
      total += v;
    }
    return total;
  }

  // 1.75 -> "1¾"; 0.5 -> "½"; 2 -> "2"
  function fmtQuarter(x) {
    var q = Math.round(x * 4) / 4, whole = Math.floor(q), frac = q - whole;
    var sym = frac === 0.25 ? "¼" : frac === 0.5 ? "½" : frac === 0.75 ? "¾" : "";
    return (whole === 0 && sym ? "" : String(whole)) + sym;
  }

  function lineMl(line) {
    if (!line || line.unit === "text") return null;
    var q = typeof line.qty === "number" ? line.qty : parseQty(line.qty);
    if (!isFinite(q)) return null;
    return q * UNIT_ML[line.unit];
  }

  // recipes.js ingredient -> editor line {item, qty, unit, abv}
  function fromSpec(ing) {
    var abv = B.guessAbv(ing.item);
    if (typeof ing.ml === "number") return { item: ing.item, qty: ing.ml, unit: "ml", abv: abv };
    var a = String(ing.amount || "").toLowerCase(), m;
    var about = a.match(/about\s+([\d.]+)\s*ml/);
    if (about) return { item: ing.item, qty: parseFloat(about[1]), unit: "ml", abv: abv, note: ing.amount };
    if ((m = a.match(/^([\d.]+)\s*dash/))) return { item: ing.item, qty: parseFloat(m[1]), unit: "dash", abv: abv };
    if ((m = a.match(/^([\d.]+)\s*bar ?spoons?/))) return { item: ing.item, qty: parseFloat(m[1]), unit: "barspoon", abv: abv };
    if ((m = a.match(/^([\d.]+)\s*(tsp|teaspoons?)\b/))) return { item: ing.item, qty: parseFloat(m[1]), unit: "tsp", abv: abv };
    return { item: ing.item, qty: ing.amount || "", unit: "text", abv: abv };
  }

  // Text amount for N drinks: "1 cube" x 4 -> "4 × (1 cube)"
  function scaleText(text, n) { return n === 1 ? String(text) : n + " × (" + text + ")"; }

  // lines: editor lines; mode 'premix' | 'prediluted'; dilution fraction.
  function planBatch(lines, n, mode, dilution) {
    var ml = [], text = [];
    lines.forEach(function (l) {
      var v = lineMl(l);
      if (v === null) { if (String(l.item || "").trim() || String(l.qty || "").trim()) text.push(l); }
      else ml.push({ item: l.item, ml: v, abv: (l.abv || 0) });
    });
    var d = mode === "premix" ? 0 : (dilution || 0);
    var b = B.batch(ml.map(function (x) { return { item: x.item, ml: x.ml }; }), n, d);
    var oneMl = B.totalMl(ml);
    var abvBefore = B.mixAbv(ml);
    var abvAfter = B.abvAfterDilution(abvBefore, d);
    var fp = B.freezingPointC(abvAfter);
    return {
      n: n, mode: mode, dilution: d,
      lines: ml.map(function (x, i) { return { item: x.item, oneMl: x.ml, batchMl: b.ingredients[i].ml, abv: x.abv }; }),
      textLines: text.map(function (l) { return { item: l.item, one: l.qty, batch: scaleText(l.qty, n) }; }),
      oneMl: oneMl, undilutedMl: oneMl * n, waterMl: b.waterMl, totalMl: b.totalMl, servingMl: n > 0 ? b.totalMl / n : 0,
      alcoholMl: n * ml.reduce(function (s, x) { return s + x.ml * x.abv; }, 0),
      abvBefore: abvBefore, abvAfter: abvAfter, freezeC: fp,
      containerMl: b.totalMl * 1.1,
      storage: storageAdvice(mode, fp, abvAfter),
      keepOut: keepOut(lines)
    };
  }

  // Lesson 08.3: a -18 °C home freezer keeps only batches whose freezing point is well below it (about 35% ABV+).
  function fmtC(x) { return (x < 0 ? "−" : "") + Math.abs(x).toFixed(1); }
  function storageAdvice(mode, freezeC, abvAfter) {
    if (mode === "premix") return { key: "fridge", text: "Fridge (cool, dark), or as the ingredients require. No water: the ice adds it at service." };
    if (abvAfter <= 0) return { key: "fridge", text: "Fridge. An alcohol-free batch freezes solid at 0 °C." };
    if (freezeC <= -19) return { key: "freezer", text: "Safe in a −18 °C freezer: it freezes only below about " + fmtC(freezeC) + " °C. The fridge works too." };
    if (freezeC <= -14) return { key: "slush", text: "May slush in a −18 °C freezer (freezes at about " + fmtC(freezeC) + " °C). Use a freezer set to about −12 °C, less water, or the fridge." };
    return { key: "fridge", text: "Fridge. At about " + fmtC(freezeC) + " °C it would slush or freeze in a −18 °C freezer and could crack a glass bottle." };
  }

  var KEEP_OUT = [
    [/soda|tonic|ginger beer|cola|prosecco|champagne|sparkling/i, "Carbonated: add it to each glass at service, never to the batch."],
    [/egg|aquafaba/i, "Egg white or aquafaba: shake it to order, for texture and food safety."],
    [/mint|basil|cut into|fresh ginger|leaves/i, "Muddled herbs or fruit: muddle to order; they turn brown and bitter."],
    [/lemon|lime juice|grapefruit juice|orange juice|fresh .*juice/i, "Fresh citrus: add it on the day of service, or per drink."]
  ];
  function keepOut(lines) {
    var out = [];
    KEEP_OUT.forEach(function (k) {
      var hits = lines.filter(function (l) { return k[0].test(l.item || ""); }).map(function (l) { return l.item; });
      if (hits.length) out.push({ items: hits, text: k[1] });
    });
    return out;
  }

  // Practice quiz: 5 questions from a seeded rng (Sim.rng).
  function quiz(rng) {
    var ozs = [0.5, 0.75, 1, 1.25, 1.5, 2];
    var oz = rng.pick(ozs);
    var cl = rng.pick([2, 2.5, 3, 4.5, 6]);
    var ml = rng.pick([20, 25, 40, 50, 55, 70]);
    var dashes = 1 + rng.int(4), spoons = 1 + rng.int(3);
    var ratio = rng.pick([[2, 1, 1], [1.5, 0.75, 0.75], [2, 0.75, 0.75], [1.5, 0.75, 0.5], [3, 1, 1]]);
    var sum = ratio[0] + ratio[1] + ratio[2];
    var total = rng.pick([90, 100, 105, 110, 120]);
    var base = Math.round(total * ratio[0] / sum * 10) / 10;
    return [
      { q: "A recipe asks for " + fmtQuarter(oz) + " oz. How many ml (bar convention)?", answer: oz * 30, kind: "ml" },
      { q: "An old European card says " + cl + " cl. How many ml?", answer: cl * 10, kind: "ml" },
      { q: "A metric spec gives " + ml + " ml. What is that in bar ounces, to the nearest ¼ oz?", answer: B.barOz(ml), kind: "oz" },
      { q: "How many ml are " + dashes + " dash" + (dashes > 1 ? "es" : "") + " plus " + spoons + " barspoon" + (spoons > 1 ? "s" : "") + "?", answer: dashes * 0.8 + spoons * 5, kind: "ml" },
      { q: "A drink is " + ratio.map(fmtQuarter).join(" : ") + " (base : sour : sweet), " + total + " ml in total. How many ml of base?", answer: base, kind: "ml" }
    ];
  }

  function checkQuizAnswer(question, given) {
    var v = parseQty(given);
    if (!isFinite(v)) return false;
    if (question.kind === "oz") return Math.abs(v - question.answer) < 0.01;
    return Math.abs(v - question.answer) <= 0.5;
  }

  var api = { UNIT_ML: UNIT_ML, UNIT_LABEL: UNIT_LABEL, parseQty: parseQty, fmtQuarter: fmtQuarter, lineMl: lineMl,
    fromSpec: fromSpec, scaleText: scaleText, planBatch: planBatch, storageAdvice: storageAdvice, keepOut: keepOut,
    quiz: quiz, checkQuizAnswer: checkQuizAnswer };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.ScalerCore = api;
})(typeof window !== "undefined" ? window : globalThis);
