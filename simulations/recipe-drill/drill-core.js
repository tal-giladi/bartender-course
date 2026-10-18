/* Pure logic for the recipe drill (no DOM). Classic script: window.DrillCore; module.exports under Node.
   Specs come only from common/recipes.js (generated from curriculum/recipes.yaml). */
(function (root) {
  "use strict";

  var TOL_ML = 5;   // ±5 ml (lessons 05.1, 05.8, 11.2)

  var METHODS = [
    { id: "build", label: "Build in the glass" },
    { id: "stir", label: "Stir with ice, strain" },
    { id: "shake", label: "Shake with ice, strain" }
  ];

  var GLASSES = [
    { id: "cocktail", label: "Cocktail glass (coupe or martini glass)", re: /martini glass|cocktail glass|coupe/i },
    { id: "rocks", label: "Old fashioned (rocks) glass", re: /(^|[^e] )old fashioned glass|rocks glass|^old fashioned/i },
    { id: "double-rocks", label: "Double old fashioned (double rocks) glass", re: /double old fashioned|double rocks/i },
    { id: "highball", label: "Highball (Collins) glass", re: /highball|collins/i },
    { id: "wine", label: "Wine glass", re: /wine glass/i },
    { id: "flute", label: "Champagne flute", re: /flute/i },
    { id: "goblet", label: "Goblet", re: /goblet/i },
    { id: "cobbler", label: "Cobbler glass", re: /cobbler/i },
    { id: "mule", label: "Mule cup", re: /mule cup/i },
    { id: "small", label: "Small narrow glass", re: /small narrow/i }
  ];
  var ICES = [
    { id: "none", label: "No ice (served up)" },
    { id: "cubes", label: "Ice cubes" },
    { id: "large", label: "Large cube" },
    { id: "crushed", label: "Crushed ice" }
  ];

  // Glass ids named in a spec's glass text ("double rocks glass" is not also "rocks").
  function glassIds(text) {
    var t = String(text || "");
    var ids = [];
    GLASSES.forEach(function (g) { if (g.re.test(t)) ids.push(g.id); });
    if (ids.indexOf("double-rocks") >= 0) {
      var stripped = t.replace(/double old fashioned( glass)?|double rocks( glass)?/ig, "");
      if (!/old fashioned|rocks glass/i.test(stripped)) ids = ids.filter(function (i) { return i !== "rocks"; });
    }
    return ids;
  }
  function iceId(ice) { return ice === "collins-cubes" ? "cubes" : (ice || "none"); }

  // Accepted alternatives the course cards name (lessons 05.3–06.7); everything else comes from recipes.js.
  var GLASS_ICE_EXTRA = {
    "mojito": [["highball", "crushed"]],                                            // 05.6: crushed is common
    "mai-tai": [["double-rocks", "crushed"], ["highball", "crushed"]],              // 06.4 card: on ice; practised on crushed
    "boulevardier": [["rocks", "large"], ["rocks", "cubes"]],                       // 06.5: on a large cube is a common alternative
    "pisco-sour": [["cocktail", "none"]],                                           // 06.2: goblet or coupe
    "arak-grapefruit": [["cocktail", "cubes"], ["highball", "cubes"]]               // 06.7: chilled glass with ice
  };

  // Specs whose glass text holds an "or ... on ice" alternative: the full accepted list.
  var GLASS_ICE_OVERRIDE = {
    "whiskey-sour": [["cobbler", "none"], ["goblet", "none"], ["cocktail", "none"], ["rocks", "cubes"]], // 05.5: cobbler (a small goblet; many bars a coupe), or rocks glass on ice
    "bloody-mary": [["rocks", "none"], ["rocks", "cubes"], ["highball", "cubes"]]                     // 06.4: rocks glass; highball with ice if asked
  };

  function acceptedGlassIce(r) {
    if (GLASS_ICE_OVERRIDE[r.id]) return GLASS_ICE_OVERRIDE[r.id].slice();
    var ice = iceId(r.ice);
    var out = glassIds(r.glass).map(function (g) {
      return [g, ice];
    });
    // A rocks glass on cubes also accepts a large cube (05.3, 06.5 cards).
    out.slice().forEach(function (c) { if (c[0] === "rocks" && c[1] === "cubes") out.push(["rocks", "large"]); });
    (GLASS_ICE_EXTRA[r.id] || []).forEach(function (c) { out.push(c); });
    return out;
  }
  function glassIceOk(r, glass, ice) {
    return acceptedGlassIce(r).some(function (c) { return c[0] === glass && c[1] === ice; });
  }

  // ---- ingredients ----
  function group(item) {
    var s = String(item || "").toLowerCase().replace(/\(.*?\)/g, "").replace(/fresh /g, "").trim();
    if (/whisk|bourbon|rye|scotch|islay/.test(s)) return "whiskey";
    if (/genever|gin\b/.test(s)) return "gin";
    if (/cachaça|cachaca/.test(s)) return "cachaca";
    if (/rum\b/.test(s)) return "rum";
    if (/tequila/.test(s)) return "tequila";
    if (/vodka/.test(s)) return "vodka";
    if (/triple sec|cointreau|curaçao|curacao/.test(s)) return "orange liqueur";
    if (/honey/.test(s)) return "honey";
    if (/syrup 1:1|syrup 2:1|simple syrup|sugar syrup/.test(s)) return "syrup";
    if (/sugar/.test(s)) return "sugar";
    if (/lime cordial/.test(s)) return "lime cordial";
    if (/lime/.test(s)) return "lime";
    if (/lemon/.test(s)) return "lemon";
    if (/soda water/.test(s)) return "soda";
    if (/water/.test(s)) return "water";
    if (/prosecco|champagne/.test(s)) return "sparkling wine";
    if (/mint/.test(s)) return "mint";
    if (/egg|aquafaba/.test(s)) return "egg";
    if (/sweet.*vermouth/.test(s)) return "sweet vermouth";
    return s;
  }
  function isOptional(ing) { return /optional/i.test(ing.item) || /optional/i.test(String(ing.amount || "")); }
  function specMl(ing) {
    if (typeof ing.ml === "number") return ing.ml;
    var m = String(ing.amount || "").match(/about\s+([\d.]+)\s*ml/i);
    return m ? parseFloat(m[1]) : null;
  }

  function amountPool(recipes) {
    var set = {};
    recipes.forEach(function (r) { r.ingredients.forEach(function (i) { if (specMl(i) === null && i.amount) set[i.amount] = true; }); });
    return Object.keys(set).sort();
  }

  // One card: the recipe's ingredients plus distractors (never a synonym of a right answer), shuffled.
  function buildCard(r, recipes, rng) {
    var groups = {};
    r.ingredients.forEach(function (i) { groups[group(i.item)] = true; });
    var pool = amountPool(recipes);
    var seen = {};
    var others = [];
    var sameFamily = recipes.filter(function (x) { return x.id !== r.id && x.family === r.family; });
    var rest = recipes.filter(function (x) { return x.id !== r.id && x.family !== r.family; });
    rng.shuffle(sameFamily).concat(rng.shuffle(rest)).forEach(function (x) {
      x.ingredients.forEach(function (i) {
        var g = group(i.item);
        if (groups[g] || seen[g]) return;
        seen[g] = true;
        others.push(i);
      });
    });
    var nDistract = Math.max(4, 8 - r.ingredients.length);
    // half from the same family where possible, the rest from anywhere (already ordered that way)
    var distract = others.slice(0, nDistract);
    function cand(i, correct) {
      var ml = specMl(i);
      var c = { item: i.item, correct: correct, optional: correct && isOptional(i), kind: ml === null ? "amount" : "ml" };
      if (correct) { c.specMl = ml; c.specAmount = i.amount || null; }
      if (c.kind === "amount") {
        var opts = [i.amount].concat(rng.shuffle(pool.filter(function (a) { return a !== i.amount; })).slice(0, 3));
        c.amountOptions = rng.shuffle(opts);
      }
      return c;
    }
    var cands = r.ingredients.map(function (i) { return cand(i, true); }).concat(distract.map(function (i) { return cand(i, false); }));
    return { id: r.id, name: r.name, candidates: rng.shuffle(cands) };
  }

  // answer: {ingredients: {[item]: {selected, ml, amount}}, method, glass, ice, garnish}
  function markCard(r, card, answer) {
    var a = answer || {}, ans = a.ingredients || {};
    var ingErrors = [], missing = [], extra = [], wrongAmt = [];
    card.candidates.forEach(function (c) {
      var x = ans[c.item] || {};
      if (c.correct) {
        if (!x.selected) { if (!c.optional) missing.push(c.item); return; }
        if (c.optional) return;
        if (c.kind === "ml") {
          var v = typeof x.ml === "number" ? x.ml : parseFloat(x.ml);
          if (!isFinite(v) || Math.abs(v - c.specMl) > TOL_ML) wrongAmt.push({ item: c.item, given: isFinite(v) ? v + " ml" : "no amount", spec: c.specAmount ? c.specAmount : c.specMl + " ml" });
        } else if (x.amount !== c.specAmount) wrongAmt.push({ item: c.item, given: x.amount || "no amount", spec: c.specAmount });
      } else if (x.selected) extra.push(c.item);
    });
    if (missing.length || extra.length) ingErrors.push("missing ingredient");
    if (wrongAmt.length) ingErrors.push("ml");
    var cells = {
      ingredients: { ok: ingErrors.length === 0, missing: missing, extra: extra, wrongAmt: wrongAmt },
      method: { ok: a.method === r.method, given: a.method || "" },
      glass: { ok: glassIceOk(r, a.glass, a.ice), given: [a.glass || "", a.ice || ""] },
      garnish: { ok: !!a.garnish && garnishKey(a.garnish) === garnishKey(r.garnish), given: a.garnish || "" }
    };
    var errors = ingErrors.slice();
    if (!cells.method.ok) errors.push("method");
    if (!cells.glass.ok) errors.push("glass");
    if (!cells.garnish.ok) errors.push("garnish");
    var points = ["ingredients", "method", "glass", "garnish"].filter(function (k) { return cells[k].ok; }).length;
    return { id: r.id, name: r.name, points: points, cells: cells, errors: errors, blank: isBlank(a) };
  }
  // Every "none in the IBA spec (...)" garnish counts as "none" (lesson 11.2: "none" where the spec has none).
  function garnishKey(g) { return /^none\b/i.test(String(g || "")) ? "none" : String(g || ""); }
  function garnishOptions(recipes) {
    var s = {};
    recipes.forEach(function (r) { s[garnishKey(r.garnish)] = true; });
    return Object.keys(s).sort(function (a, b) { return a === "none" ? -1 : b === "none" ? 1 : a.localeCompare(b); })
      .map(function (k) { return [k, k === "none" ? "None (the spec has no garnish)" : k]; });
  }

  function isBlank(a) {
    var ing = a.ingredients || {};
    var any = Object.keys(ing).some(function (k) { return ing[k] && ing[k].selected; });
    return !any && !a.method && !a.glass && !a.ice && !a.garnish;
  }

  // ---- decks ----
  function deck(presetKey, recipes) {
    if (presetKey === "m05") return recipes.filter(function (r) { return /^05\./.test(r.lesson); });
    if (presetKey === "m06") return recipes.filter(function (r) { return /^06\./.test(r.lesson); });
    return recipes.slice();
  }
  // Exam (outline §6, lesson 11.2): 20 cards without repeats from all specs, seeded.
  var EXAM_CARDS = 20;
  function examDraw(recipes, rng) { return rng.shuffle(recipes).slice(0, Math.min(EXAM_CARDS, recipes.length)); }

  function examSummary(results) {
    var points = results.reduce(function (s, r) { return s + r.points; }, 0);
    var max = EXAM_CARDS * 4;
    var pct = points / max * 100;
    var counts = { "ml": 0, "missing ingredient": 0, "method": 0, "glass": 0, "garnish": 0 };
    results.forEach(function (r) { r.errors.forEach(function (e) { counts[e]++; }); });
    var dominant = Object.keys(counts).reduce(function (best, k) { return counts[k] > (best ? counts[best] : 0) ? k : best; }, null);
    return { points: points, max: max, percent: pct, pass: pct >= 80, minPoints: Math.ceil(max * 0.8), counts: counts, dominant: dominant,
      weighted: pct * 0.25 };
  }

  var ERROR_LABEL = { "ml": "ml", "missing ingredient": "missing ingredient", "method": "method", "glass": "glass and ice", "garnish": "garnish" };
  function examReport(results, seed, date, glassLabel, iceLabel) {
    var s = examSummary(results);
    var lines = [
      "Recipe recall exam (lesson 11.2) — recipe-drill preset=exam",
      "Seed: " + seed + " · Date: " + date,
      "Points: " + s.points + " / " + s.max + " · Score: " + s.percent.toFixed(1) + "% · Minimum 80% (" + s.minPoints + " points): " + (s.pass ? "met" : "NOT met"),
      "Final-grade weight 25% → contributes " + s.weighted.toFixed(1) + " of 100 points",
      "Errors by type: " + Object.keys(s.counts).map(function (k) { return ERROR_LABEL[k] + " " + s.counts[k]; }).join(", ") +
        (s.dominant ? " · dominant: " + ERROR_LABEL[s.dominant] : " · none"),
      "",
      "Per card (I = ingredients and ml, M = method, G = glass and ice, Gn = garnish):"
    ];
    results.forEach(function (r, i) {
      var c = r.cells;
      lines.push((i + 1) + ". " + r.name + ": " + r.points + "/4 [I " + (c.ingredients.ok ? "✓" : "✗") + " M " + (c.method.ok ? "✓" : "✗") +
        " G " + (c.glass.ok ? "✓" : "✗") + " Gn " + (c.garnish.ok ? "✓" : "✗") + "]" + (r.errors.length ? " — " + r.errors.map(function (e) { return ERROR_LABEL[e]; }).join(", ") : ""));
    });
    lines.push("", "Self-recorded, closed book, first complete run.");
    return lines.join("\n");
  }

  // ---- families (lesson 06.1) ----
  var FAMILIES = [
    { id: "sour", label: "Sour", pattern: "base spirit + citrus + sweetener (syrup or liqueur), no fizz; usually shaken" },
    { id: "collins-fizz", label: "Collins and fizz", pattern: "a sour lengthened with soda water" },
    { id: "highball", label: "Highball", pattern: "spirit + a larger amount of fizzy mixer, often a little citrus; built" },
    { id: "old-fashioned", label: "Old fashioned", pattern: "spirit + a little sugar + bitters (+ water); built and stirred" },
    { id: "martini-manhattan", label: "Martini and Manhattan (spirit-forward stirred)", pattern: "base spirit + aromatised wine or bitter aperitif, no citrus; stirred" },
    { id: "spritz-sparkling", label: "Spritz and sparkling", pattern: "sparkling wine as the lengthener" },
    { id: "tiki-punch", label: "Tiki and punch", pattern: "rum (often several), several juices and syrups, spice or nut; shaken, crushed ice" },
    { id: "savory", label: "Savory", pattern: "salt, spice, tomato or other savory ingredients" },
    { id: "coffee", label: "Coffee", pattern: "coffee with spirit and liqueur; shaken" },
    { id: "other", label: "Other", pattern: "anything that does not fit the families above" }
  ];
  // Accepted alternatives from labs/module-06/family-sort-cards-solution.md.
  var FAMILY_ALT = { "caipirinha": ["highball"], "french-75": ["collins-fizz"], "mai-tai": ["sour"] };
  function markFamily(r, family, method) {
    var famOk = family === r.family || (FAMILY_ALT[r.id] || []).indexOf(family) >= 0;
    var methOk = method === r.method;
    return { id: r.id, name: r.name, points: (famOk ? 1 : 0) + (methOk ? 1 : 0), familyOk: famOk, methodOk: methOk };
  }

  // ---- Leitner boxes (lesson 05.1): box 1 daily, box 2 every 2 days, box 3 weekly ----
  var BOX_DAYS = { 1: 1, 2: 2, 3: 7 };
  function nextBox(box, pass) { return pass ? Math.min(3, (box || 1) + 1) : 1; }
  function daysBetween(a, b) { return Math.round((Date.parse(b) - Date.parse(a)) / 86400000); }
  function isDue(entry, today) {
    if (!entry || !entry.last) return true;
    return daysBetween(entry.last, today) >= BOX_DAYS[entry.box || 1];
  }
  function dueIds(ids, boxes, today) { return ids.filter(function (id) { return isDue(boxes[id], today); }); }

  var api = { TOL_ML: TOL_ML, METHODS: METHODS, GLASSES: GLASSES, ICES: ICES, glassIds: glassIds, iceId: iceId,
    acceptedGlassIce: acceptedGlassIce, glassIceOk: glassIceOk, group: group, specMl: specMl, isOptional: isOptional,
    amountPool: amountPool, garnishKey: garnishKey, garnishOptions: garnishOptions, buildCard: buildCard, markCard: markCard, deck: deck, EXAM_CARDS: EXAM_CARDS, examDraw: examDraw,
    examSummary: examSummary, examReport: examReport, ERROR_LABEL: ERROR_LABEL, FAMILIES: FAMILIES, FAMILY_ALT: FAMILY_ALT,
    markFamily: markFamily, BOX_DAYS: BOX_DAYS, nextBox: nextBox, isDue: isDue, dueIds: dueIds, daysBetween: daysBetween };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.DrillCore = api;
})(typeof window !== "undefined" ? window : globalThis);
