/* Recipe scaler UI. Depends on Sim, BarMath, RECIPES, ScalerCore. */
(function () {
  "use strict";
  var S = window.Sim, B = window.BarMath, C = window.ScalerCore, RECIPES = window.RECIPES || [];
  var $ = function (id) { return document.getElementById(id); };
  var el = S.el;

  var PRESETS = {
    convert: { tab: "convert", title: "Convert units",
      trains: "Converting ml, oz, cl, dashes and barspoons, and turning parts into ml (lesson 03.1, 03.2).",
      task: "Answer the five practice conversions without a calculator, then check. Target: 5 of 5. Use the converter above to check any oz value from your free-pour drill." },
    scale: { tab: "scale", title: "Scale a recipe",
      trains: "Multiplying every line by N and checking the total volume (lesson 03.1).",
      task: "The practice sour is loaded (60 ml tea, 22.5 ml lemon, 22.5 ml syrup). Scale it to 4 serves on paper, then enter your total below. Target: within 1 ml of the scaler (it should be 420 ml)." },
    batch: { tab: "batch", title: "Batch with dilution",
      trains: "Pre-mix versus pre-diluted batches, batch water, serving size, ABV after dilution and fridge-or-freezer (lessons 03.1 and 08.3).",
      task: "Load each worksheet problem (03.1 problem 9, 08.3 problems 1–3), compare the batch card with your paper answers, and enter your water and serving to check. Target: every answer within 1 ml." }
  };
  var presetKey = S.preset(Object.keys(PRESETS), "scale");
  var seed = S.seed();

  // ---------- sources ----------
  var CUSTOM = {
    "practice-sour": { name: "Practice sour (lesson 03.1)", lines: [
      { item: "cold black tea", qty: 60, unit: "ml", abv: 0 }, { item: "fresh lemon juice", qty: 22.5, unit: "ml", abv: 0 },
      { item: "1:1 syrup", qty: 22.5, unit: "ml", abv: 0 }] },
    "stirred-031": { name: "Stirred drink (lesson 03.1 worked example)", lines: [
      { item: "spirit", qty: 60, unit: "ml", abv: 0.40 }, { item: "vermouth", qty: 30, unit: "ml", abv: 0.16 },
      { item: "bitters", qty: 2, unit: "dash", abv: 0.447 }] },
    "ws8-031": { name: "Worksheet 03.1 problem 8", lines: [
      { item: "base spirit", qty: 45, unit: "ml", abv: 0.40 }, { item: "fresh lemon juice", qty: 20, unit: "ml", abv: 0 },
      { item: "syrup", qty: 15, unit: "ml", abv: 0 }, { item: "bitters", qty: 1, unit: "dash", abv: 0.447 }] },
    "ws9-031": { name: "Worksheet 03.1 problem 9", lines: [
      { item: "spirit", qty: 50, unit: "ml", abv: 0.40 }, { item: "aperitif", qty: 25, unit: "ml", abv: 0.25 },
      { item: "vermouth", qty: 25, unit: "ml", abv: 0.16 }] },
    "batch-b-083": { name: "Batch B, stirred-style NA (lesson 08.3)", lines: [
      { item: "cold black tea", qty: 60, unit: "ml", abv: 0 }, { item: "red grape juice", qty: 20, unit: "ml", abv: 0 },
      { item: "1:1 syrup", qty: 5, unit: "ml", abv: 0 }] }
  };

  function loadSource(key) {
    var lines;
    if (CUSTOM[key]) { lines = CUSTOM[key].lines.map(function (l) { return Object.assign({}, l); }); state.name = CUSTOM[key].name.replace(/ \(.*\)$/, ""); }
    else {
      var r = RECIPES.filter(function (x) { return x.id === key; })[0];
      if (!r) return;
      lines = r.ingredients.map(C.fromSpec);
      state.name = r.name;
    }
    state.lines = lines;
    $("rc-source").value = key;
    $("bt-name").value = state.name;
    renderRows();
    update();
  }

  var state = { lines: [], name: "" };

  function buildSourceSelect() {
    var sel = $("rc-source");
    var g1 = el("optgroup", { label: "Lesson examples" });
    Object.keys(CUSTOM).forEach(function (k) { g1.appendChild(el("option", { value: k, text: CUSTOM[k].name })); });
    sel.appendChild(g1);
    var g2 = el("optgroup", { label: "Course recipes (IBA unless noted)" });
    RECIPES.forEach(function (r) { g2.appendChild(el("option", { value: r.id, text: r.name + " (" + r.lesson + ")" })); });
    sel.appendChild(g2);
    sel.addEventListener("change", function () { loadSource(sel.value); });
  }

  // ---------- recipe editor ----------
  function renderRows() {
    var body = $("rc-rows");
    body.textContent = "";
    state.lines.forEach(function (l, i) {
      var unitSel = el("select", { "aria-label": "Unit, line " + (i + 1) });
      Object.keys(C.UNIT_LABEL).forEach(function (u) { unitSel.appendChild(el("option", { value: u, text: C.UNIT_LABEL[u] })); });
      unitSel.value = l.unit;
      var item = el("input", { type: "text", value: l.item, "aria-label": "Ingredient, line " + (i + 1) });
      var qty = el("input", { type: "text", value: String(l.qty), inputmode: "decimal", "aria-label": "Amount, line " + (i + 1) });
      var abv = el("input", { type: "number", min: "0", max: "100", step: "0.1", value: String(Math.round((l.abv || 0) * 1000) / 10), "aria-label": "ABV percent, line " + (i + 1) });
      item.addEventListener("input", function () { l.item = item.value; update(); });
      qty.addEventListener("input", function () { l.qty = qty.value; update(); });
      unitSel.addEventListener("change", function () { l.unit = unitSel.value; update(); });
      abv.addEventListener("input", function () { var v = parseFloat(abv.value); l.abv = isFinite(v) ? v / 100 : 0; update(); });
      var rm = el("button", { type: "button", class: "rm", text: "✕", "aria-label": "Remove line " + (i + 1),
        onclick: function () { state.lines.splice(i, 1); renderRows(); update(); } });
      body.appendChild(el("tr", null, [el("td", null, [item]), el("td", null, [qty]), el("td", null, [unitSel]),
        el("td", { class: "abv-col" }, [abv]), el("td", null, [rm])]));
    });
  }
  $("rc-add").addEventListener("click", function () { state.lines.push({ item: "", qty: "", unit: "ml", abv: 0 }); renderRows(); update(); });

  function n() { var v = parseInt($("rc-n").value, 10); return isFinite(v) && v > 0 ? v : 1; }
  function mode() { return document.querySelector('input[name="bt-mode"]:checked').value; }
  function dil() { var v = parseFloat($("bt-dil").value); return isFinite(v) && v >= 0 ? v / 100 : 0; }
  function f1(x) { return S.fmt(x, 1); }

  // ---------- convert ----------
  function updateConvert() {
    var v = C.parseQty($("cv-value").value), u = $("cv-unit").value, t = $("cv-table");
    t.textContent = "";
    if (!isFinite(v)) { t.appendChild(el("tr", null, [el("td", { text: "Enter a number, e.g. 1.5, 1½ or 3/4." })])); return; }
    var ml = v * C.UNIT_ML[u];
    var rows = [
      ["ml", f1(ml) + " ml"], ["cl", S.fmt(ml / 10, 2) + " cl"],
      ["oz, bar convention (÷ 30)", S.fmt(ml / 30, 2) + " oz → nearest ¼: " + C.fmtQuarter(B.barOz(ml)) + " oz"],
      ["oz, exact US (÷ 29.57)", S.fmt(B.fromMl(ml, "oz"), 2) + " oz"],
      ["barspoons / teaspoons (÷ 5)", S.fmt(ml / 5, 1)], ["tablespoons (÷ 15)", S.fmt(ml / 15, 2)], ["dashes (÷ 0.8)", S.fmt(ml / 0.8, 1)]
    ];
    t.appendChild(el("tr", null, [el("th", { text: "Unit" }), el("th", { text: "Value" })]));
    rows.forEach(function (r) { t.appendChild(el("tr", null, [el("td", { text: r[0] }), el("td", { text: r[1] })])); });
  }
  $("cv-value").addEventListener("input", updateConvert);
  $("cv-unit").addEventListener("change", updateConvert);

  var parts = [{ item: "base", parts: "2" }, { item: "sour", parts: "¾" }, { item: "sweet", parts: "¾" }];
  function renderParts() {
    var box = $("parts-rows");
    box.textContent = "";
    parts.forEach(function (p, i) {
      var name = el("input", { type: "text", value: p.item, "aria-label": "Ingredient " + (i + 1) });
      var val = el("input", { type: "text", value: p.parts, inputmode: "decimal", "aria-label": "Parts, ingredient " + (i + 1) });
      name.addEventListener("input", function () { p.item = name.value; updateParts(); });
      val.addEventListener("input", function () { p.parts = val.value; updateParts(); });
      var rm = el("button", { type: "button", class: "secondary", text: "Remove", "aria-label": "Remove ingredient " + (i + 1),
        onclick: function () { parts.splice(i, 1); renderParts(); updateParts(); } });
      box.appendChild(el("div", { class: "parts-row" }, [name, val, rm]));
    });
  }
  function updateParts() {
    var t = $("parts-table"), total = parseFloat($("parts-total").value);
    t.textContent = "";
    var valid = parts.map(function (p) { return { item: p.item || "?", parts: C.parseQty(p.parts) }; }).filter(function (p) { return isFinite(p.parts) && p.parts > 0; });
    if (!valid.length || !(total > 0)) { t.appendChild(el("tr", null, [el("td", { text: "Enter parts and a total volume." })])); return; }
    var res = B.partsToMl(valid, total);
    var sum = valid.reduce(function (s, p) { return s + p.parts; }, 0);
    t.appendChild(el("tr", null, [el("th", { text: "Ingredient" }), el("th", { text: "Parts" }), el("th", { text: "ml" }), el("th", { text: "oz (bar)" })]));
    res.forEach(function (r, i) {
      t.appendChild(el("tr", null, [el("td", { text: r.item }), el("td", { text: S.fmt(valid[i].parts, 3) }), el("td", { text: f1(r.ml) }), el("td", { text: S.fmt(r.ml / 30, 2) })]));
    });
    t.appendChild(el("tr", { class: "total" }, [el("td", { text: "Total" }), el("td", { text: S.fmt(sum, 3) + " parts" }),
      el("td", { text: f1(total) }), el("td", { text: "1 part = " + f1(total / sum) + " ml" })]));
  }
  $("parts-add").addEventListener("click", function () { parts.push({ item: "", parts: "1" }); renderParts(); updateParts(); });
  $("parts-total").addEventListener("input", updateParts);

  var questions = [];
  function renderQuiz() {
    questions = C.quiz(S.rng(seed));
    var box = $("quiz");
    box.textContent = "";
    questions.forEach(function (q, i) {
      var inp = el("input", { type: "text", inputmode: "decimal", id: "quiz-" + i, "aria-label": "Answer " + (i + 1) });
      box.appendChild(el("div", { class: "quiz-q" }, [el("span", { class: "q", text: (i + 1) + ". " + q.q }), inp,
        el("span", { class: "fb", id: "quiz-fb-" + i, "aria-live": "polite" })]));
    });
    $("quiz-result").textContent = "Question set " + seed + ".";
  }
  $("quiz-check").addEventListener("click", function () {
    var right = 0;
    questions.forEach(function (q, i) {
      var ok = C.checkQuizAnswer(q, $("quiz-" + i).value);
      if (ok) right++;
      var fb = $("quiz-fb-" + i);
      fb.className = "fb " + (ok ? "good" : "bad");
      fb.textContent = (ok ? "Correct: " : "Not yet. Answer: ") + (q.kind === "oz" ? C.fmtQuarter(q.answer) + " oz" : f1(q.answer) + " ml");
    });
    $("quiz-result").textContent = right + " of 5 correct" + (right === 5 ? ": target met." : ". Redo the misses and write down the rule you broke.");
  });
  $("quiz-new").addEventListener("click", function () { seed = Math.floor(Math.random() * 1e9); renderQuiz(); });

  // ---------- scale ----------
  var lastPlan = null;
  function updateScale(p) {
    var t = $("sc-table");
    t.textContent = "";
    t.appendChild(el("tr", null, [el("th", { text: "Line" }), el("th", { text: "One drink" }), el("th", { text: "× " + p.n })]));
    p.lines.forEach(function (l) {
      t.appendChild(el("tr", null, [el("td", { text: l.item || "?" }), el("td", { text: f1(l.oneMl) + " ml (" + S.fmt(l.oneMl / 30, 2) + " oz)" }), el("td", { text: f1(l.batchMl) + " ml" })]));
    });
    p.textLines.forEach(function (l) {
      t.appendChild(el("tr", null, [el("td", { text: l.item || "?" }), el("td", { text: String(l.one) }), el("td", { text: l.batch })]));
    });
    t.appendChild(el("tr", { class: "total" }, [el("td", { text: "Total (ml lines)" }), el("td", { text: f1(p.oneMl) + " ml" }), el("td", { text: f1(p.undilutedMl) + " ml" })]));
    $("sc-notes").textContent = "Container: at least " + S.fmt(Math.ceil(p.undilutedMl * 1.1 - 1e-6)) + " ml (the total plus 10%)." +
      (p.textLines.length ? " Lines without an ml amount are not in the total." : "");
  }
  $("sc-check").addEventListener("click", function () {
    var g = parseFloat($("sc-guess").value), r = $("sc-result");
    if (!isFinite(g) || !lastPlan) { r.textContent = "Enter your total in ml."; r.className = "warn"; return; }
    var diff = g - lastPlan.undilutedMl;
    var ok = Math.abs(diff) <= 1;
    r.className = ok ? "good" : "bad";
    r.textContent = ok ? "Match: " + f1(lastPlan.undilutedMl) + " ml." :
      "Off by " + f1(diff) + " ml (scaler: " + f1(lastPlan.undilutedMl) + " ml). Check a forgotten dash, a rounded line or a missed line.";
  });

  // ---------- batch ----------
  var LOADERS = [
    { label: "03.1 worked example: ×10, 40%", src: "stirred-031", n: 10, mode: "prediluted", dil: 40 },
    { label: "03.1 problem 9: ×8, 30%", src: "ws9-031", n: 8, mode: "prediluted", dil: 30 },
    { label: "03.1 problem 10: ×20 shaken to order", src: "practice-sour", n: 20, mode: "premix", dil: 0 },
    { label: "08.3 problem 1: Manhattan ×24, 40%", src: "manhattan", n: 24, mode: "prediluted", dil: 40, glass: "a chilled coupe; cherry; do not stir" },
    { label: "08.3 problem 2: Negroni ×30", src: "negroni", n: 30, mode: "premix", dil: 0, glass: "an old fashioned glass over ice, stir in the glass" },
    { label: "08.3 problem 3a: Martini ×12, gin 40%, 20%", src: "dry-martini", n: 12, mode: "prediluted", dil: 20, gin: 0.40, glass: "a chilled martini glass" },
    { label: "08.3 problem 3b: Martini ×12, gin 47%, 20%", src: "dry-martini", n: 12, mode: "prediluted", dil: 20, gin: 0.47, glass: "a chilled martini glass" },
    { label: "08.3 Batch B: NA ×4, 15%", src: "batch-b-083", n: 4, mode: "prediluted", dil: 15 }
  ];
  function buildLoaders() {
    var box = $("bt-loaders");
    LOADERS.forEach(function (L) {
      box.appendChild(el("button", { type: "button", class: "secondary", text: L.label, onclick: function () {
        $("rc-n").value = L.n;
        document.querySelector('input[name="bt-mode"][value="' + L.mode + '"]').checked = true;
        $("bt-dil").value = L.dil;
        if (L.glass) $("bt-glass").value = L.glass;
        loadSource(L.src);
        if (L.gin) { state.lines.forEach(function (l) { if (/gin/i.test(l.item)) l.abv = L.gin; }); renderRows(); }
        update();
      } }));
    });
  }
  document.querySelectorAll("[data-dil]").forEach(function (b) {
    b.addEventListener("click", function () { $("bt-dil").value = b.getAttribute("data-dil"); update(); });
  });
  document.querySelectorAll('input[name="bt-mode"]').forEach(function (r) { r.addEventListener("change", update); });
  $("bt-dil").addEventListener("input", update);
  $("rc-n").addEventListener("input", update);
  $("bt-name").addEventListener("input", update);
  $("bt-glass").addEventListener("input", update);

  function updateBatch(p) {
    $("bt-dil-row").hidden = p.mode === "premix";
    var t = $("bt-table");
    t.textContent = "";
    var rows = [];
    p.lines.forEach(function (l) { rows.push([l.item + " (" + f1(l.oneMl) + " × " + p.n + ")", f1(l.batchMl) + " ml"]); });
    p.textLines.forEach(function (l) { rows.push([l.item, l.batch + " (not in ml totals)"]); });
    rows.push(["Undiluted batch", f1(p.undilutedMl) + " ml"]);
    if (p.mode === "premix") rows.push(["Water", "none: the ice adds it when each serving is shaken or stirred"]);
    else rows.push(["Water (" + f1(p.undilutedMl) + " × " + S.fmt(p.dilution, 2) + ")", f1(p.waterMl) + " ml → measure " + S.fmt(Math.round(p.waterMl)) + " ml"]);
    rows.push(["Batch total", f1(p.totalMl) + " ml"]);
    rows.push(["One serving (total ÷ " + p.n + ")", f1(p.servingMl) + " ml"]);
    rows.push(["ABV before → after", p.abvBefore > 0 && p.mode === "premix" ? S.fmt(p.abvBefore * 100, 1) + "% before ice (alcohol " + f1(p.alcoholMl) + " ml); the ice dilutes each serving" : p.abvBefore > 0 ? S.fmt(p.abvBefore * 100, 1) + "% → " + S.fmt(p.abvAfter * 100, 1) + "% (alcohol " + f1(p.alcoholMl) + " ml)" : "0% (alcohol-free)"]);
    if (p.mode === "prediluted" && p.abvAfter > 0) rows.push(["Freezes at about", (p.freezeC < 0 ? "−" : "") + S.fmt(Math.abs(p.freezeC), 1) + " °C"]);
    rows.push(["Storage", p.storage.text]);
    rows.push(["Container", "at least " + S.fmt(Math.ceil(p.containerMl - 1e-6)) + " ml (10% headspace)"]);
    rows.forEach(function (r, i) {
      var cls = /^(Undiluted|Batch total|One serving)/.test(r[0]) ? "total" : null;
      t.appendChild(el("tr", cls ? { class: cls } : null, [el("td", { text: r[0] }), el("td", { text: r[1] })]));
    });
    var w = $("bt-warn");
    w.textContent = "";
    p.keepOut.forEach(function (k) { w.appendChild(el("p", { class: "warn-box", text: k.text + " (" + k.items.join(", ") + ")" })); });
    renderCard(p);
  }

  function cardText(p) {
    var name = $("bt-name").value || "Batch";
    var lines = [name + " batch × " + p.n, ""];
    p.lines.forEach(function (l) { lines.push("  " + (l.item || "?") + ": " + f1(l.batchMl) + " ml"); });
    p.textLines.forEach(function (l) { lines.push("  " + (l.item || "?") + ": " + l.batch); });
    if (p.mode === "prediluted") lines.push("  water: " + S.fmt(Math.round(p.waterMl)) + " ml");
    lines.push("");
    lines.push("Total: " + S.fmt(Math.round(p.totalMl)) + " ml · container at least " + S.fmt(Math.ceil(p.containerMl - 1e-6)) + " ml");
    lines.push(p.mode === "prediluted" ? "WATER INCLUDED: yes, " + S.fmt(Math.round(p.waterMl)) + " ml (" + S.fmt(p.dilution * 100) + "%)" : "WATER INCLUDED: NO");
    if (p.abvBefore > 0) lines.push("ABV: " + S.fmt(p.abvAfter * 100, 1) + "%" + (p.mode === "premix" ? " (before ice)" : ""));
    var serve = S.fmt(Math.round(p.servingMl)) + " ml";
    lines.push(p.mode === "prediluted" ? "Serve: pour " + serve + " into " + ($("bt-glass").value || "a chilled glass") + ". Do not stir on ice." :
      "Serve: measure " + serve + ", shake or stir with ice as the spec says, into " + ($("bt-glass").value || "the spec glass") + ".");
    lines.push("Store: " + p.storage.text);
    if (p.keepOut.length) lines.push("Add at service: " + p.keepOut.map(function (k) { return k.items.join(", "); }).join("; "));
    lines.push("Made: ____ (date) ____ (time) · initials ____ · discard by ____");
    return lines.join("\n");
  }
  function renderCard(p) {
    var txt = cardText(p);
    $("bt-card-text").textContent = txt;
    var dl = $("bt-download");
    dl.textContent = "";
    var a = el("a", { href: "data:text/plain;charset=utf-8," + encodeURIComponent(txt), download: "batch-card.txt", class: "button-link", text: "Download batch card (.txt)" });
    dl.appendChild(a);
  }
  $("bt-copy").addEventListener("click", function () {
    var txt = $("bt-card-text").textContent, msg = $("bt-copy-msg");
    function fallback() {
      var range = document.createRange(); range.selectNodeContents($("bt-card-text"));
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(range);
      msg.textContent = "Selected: press Ctrl+C (Cmd+C on a Mac) to copy.";
    }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(function () { msg.textContent = "Copied."; }, fallback);
      } else fallback();
    } catch (e) { fallback(); }
  });

  $("bt-check").addEventListener("click", function () {
    var gw = parseFloat($("bt-guess-water").value), gs = parseFloat($("bt-guess-serv").value), r = $("bt-result");
    if (!lastPlan || (!isFinite(gw) && !isFinite(gs))) { r.className = "warn"; r.textContent = "Enter your water and/or serving in ml."; return; }
    var out = [], ok = true;
    if (isFinite(gw)) {
      var dw = gw - lastPlan.waterMl;
      if (Math.abs(dw) <= 1) out.push("Water matches (" + f1(lastPlan.waterMl) + " ml).");
      else { ok = false; out.push("Water off by " + f1(dw) + " ml (scaler " + f1(lastPlan.waterMl) + " ml)." + (lastPlan.mode === "premix" && gw > 0 ? " A pre-mix gets no water: the ice adds it." : "")); }
    }
    if (isFinite(gs)) {
      var ds = gs - lastPlan.servingMl;
      if (Math.abs(ds) <= 1) out.push("Serving matches (" + f1(lastPlan.servingMl) + " ml).");
      else { ok = false; out.push("Serving off by " + f1(ds) + " ml (scaler " + f1(lastPlan.servingMl) + " ml)."); }
    }
    r.className = ok ? "good" : "bad";
    r.textContent = out.join(" ");
  });

  // ---------- tabs and task ----------
  function showTab(tab) {
    document.querySelectorAll(".tab").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-tab") === tab)); });
    $("panel-convert").hidden = tab !== "convert";
    $("panel-recipe").hidden = tab === "convert";
    $("panel-scale").hidden = tab !== "scale";
    $("panel-batch").hidden = tab !== "batch";
    $("rc-table").classList.toggle("no-abv", tab !== "batch");
  }
  document.querySelectorAll(".tab").forEach(function (b) { b.addEventListener("click", function () { showTab(b.getAttribute("data-tab")); }); });

  function renderTask() {
    var p = PRESETS[presetKey], box = $("task-card");
    box.appendChild(el("h2", { text: "Preset: " + p.title }));
    box.appendChild(el("p", null, [el("strong", { text: "Trains: " }), p.trains]));
    box.appendChild(el("p", null, [el("strong", { text: "Task: " }), p.task]));
  }

  function update() {
    var p = C.planBatch(state.lines, n(), mode(), dil());
    lastPlan = p;
    updateScale(p);
    updateBatch(p);
  }

  // ---------- init ----------
  $("label-slot").appendChild(S.label());
  renderTask();
  buildSourceSelect();
  buildLoaders();
  renderParts(); updateParts(); updateConvert(); renderQuiz();
  if (presetKey === "batch") { LOADERS[0] && $("bt-loaders").firstChild.click(); }
  else { $("rc-n").value = 4; loadSource("practice-sour"); }
  showTab(PRESETS[presetKey].tab);
})();
