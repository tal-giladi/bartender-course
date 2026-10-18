/* Recipe drill UI. Depends on Sim, BarMath, RECIPES, DrillCore. */
(function () {
  "use strict";
  var S = window.Sim, D = window.DrillCore, RECIPES = window.RECIPES || [];
  var $ = function (id) { return document.getElementById(id); };
  var el = S.el;

  var PRESETS = {
    all: { title: "All course specs", trains: "Recall of all 30 course specs (Modules 5 and 6) with Leitner boxes.",
      task: "Run one round of the cards due today. Target: every card 4 of 4; missed cards go back to box 1 and come back tomorrow." },
    m05: { title: "Module 5 classics", trains: "Recall of the twelve Module 5 classics: ingredients and ml, method, glass and ice, garnish (lessons 05.1–05.8).",
      task: "Pass the cards of the lesson you just finished (pick it under Deck), or run all twelve. Target: 4 of 4 on each card; 80% over all twelve is the 05.8 and 11.2 standard." },
    m06: { title: "Module 6 classics", trains: "Recall of the Module 6 specs, including the 06.5 classics and the arak serves (lessons 06.2–06.8).",
      task: "Pass the cards of the lesson you just finished (pick it under Deck), or pick your own twelve-drink menu with \"My own selection\". Target: 4 of 4 on each card." },
    families: { title: "Cocktail families", trains: "Sorting drinks into the course's ten families and naming the method from the ingredient pattern (lesson 06.1).",
      task: "Sort each drink by its family and method. One point for the family (or the accepted alternative), one for the method. Target: 80% or more; re-sort the misses after lesson 06.5." },
    exam: { title: "Final exam: recipe recall", trains: "The recipe recall part of the final assessment (lesson 11.2): 25% of the final grade, minimum 80%.",
      task: "20 cards drawn without repeats from all 30 specs, closed book, no hints, specs hidden until the end. 4 points per card (ingredients and ml ±5 ml, method, glass and ice, garnish), 80 points in all; pass = 64 points (80%). Write the seed down before you start. The first complete run counts." }
  };
  var presetKey = S.preset(Object.keys(PRESETS), "all");
  var P = PRESETS[presetKey];
  var seed = S.seed();
  var BOX_KEY = "recipe-drill-boxes", CUSTOM_KEY = "recipe-drill-custom";

  function byId(id) { return RECIPES.filter(function (r) { return r.id === id; })[0]; }
  function today() { var d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function methodLabel(id) { var m = D.METHODS.filter(function (x) { return x.id === id; })[0]; return m ? m.label : (id || "—"); }
  function glassLabel(id) { var g = D.GLASSES.filter(function (x) { return x.id === id; })[0]; return g ? g.label : (id || "—"); }
  function iceLabel(id) { var g = D.ICES.filter(function (x) { return x.id === id; })[0]; return g ? g.label : (id || "—"); }
  function familyLabel(id) { var f = D.FAMILIES.filter(function (x) { return x.id === id; })[0]; return f ? f.label : id; }
  var GARNISHES = D.garnishOptions(RECIPES);

  function amountText(i) { return typeof i.ml === "number" ? i.ml + " ml" : i.amount; }
  function specBlock(r) {
    var ul = el("ul");
    r.ingredients.forEach(function (i) {
      var oz = typeof i.ml === "number" ? " (" + S.fmt(i.ml / 30, 2) + " oz)" : "";
      ul.appendChild(el("li", { text: amountText(i) + oz + " " + i.item }));
    });
    return el("div", { class: "spec" }, [
      el("strong", { text: r.name + " — course spec (" + r.lesson + ")" }), ul,
      el("p", { text: "Method: " + methodLabel(r.method) }),
      el("p", { text: "Glass and ice: " + r.glass + "; ice: " + iceLabel(D.iceId(r.ice)).toLowerCase() }),
      el("p", { text: "Garnish: " + r.garnish }),
      el("p", { class: "muted small", text: "Source: " + (r.source && r.source.title ? r.source.title : "course card") })
    ]);
  }

  // ---------- header ----------
  function renderTask() {
    var box = $("task-card");
    box.appendChild(el("h2", { text: "Preset: " + P.title }));
    box.appendChild(el("p", null, [el("strong", { text: "Trains: " }), P.trains]));
    box.appendChild(el("p", null, [el("strong", { text: "Task: " }), P.task]));
  }

  // ---------- Leitner ----------
  function boxes() { var b = S.store.get(BOX_KEY, {}); return b && typeof b === "object" ? b : {}; }
  function saveBox(id, pass) {
    var b = boxes(), e = b[id] || { box: 1 };
    b[id] = { box: D.nextBox(e.box, pass), last: today() };
    S.store.set(BOX_KEY, b);
  }

  // ---------- setup ----------
  var deckSel, dueChk;
  function currentDeckIds() {
    var v = deckSel ? deckSel.value : "preset";
    if (v === "all") return RECIPES.map(function (r) { return r.id; });
    if (v === "custom") return S.store.get(CUSTOM_KEY, []).filter(byId);
    if (v === "m05" || v === "m06") return D.deck(v, RECIPES).map(function (r) { return r.id; });
    if (v.slice(0, 7) === "lesson:") return RECIPES.filter(function (r) { return r.lesson === v.slice(7); }).map(function (r) { return r.id; });
    return D.deck(presetKey, RECIPES).map(function (r) { return r.id; });
  }

  function renderSetup() {
    var box = $("setup");
    var prevDeck = deckSel ? deckSel.value : null, prevDue = dueChk ? dueChk.checked : true;
    box.textContent = "";
    if (presetKey === "exam") return renderExamSetup(box);
    box.appendChild(el("h2", { text: presetKey === "families" ? "Set up a sort" : "Set up a round" }));
    deckSel = el("select", { id: "deck" });
    var base = D.deck(presetKey, RECIPES);
    if (presetKey === "families") {
      deckSel.appendChild(el("option", { value: "all", text: "All " + RECIPES.length + " course drinks" }));
      deckSel.appendChild(el("option", { value: "m05", text: "Module 5 drinks (12)" }));
      deckSel.appendChild(el("option", { value: "m06", text: "Module 6 drinks (" + D.deck("m06", RECIPES).length + ")" }));
    } else {
      deckSel.appendChild(el("option", { value: "preset", text: P.title + " (" + base.length + " cards)" }));
      var lessons = {};
      base.forEach(function (r) { (lessons[r.lesson] = lessons[r.lesson] || []).push(r.name); });
      Object.keys(lessons).sort().forEach(function (l) { deckSel.appendChild(el("option", { value: "lesson:" + l, text: "Lesson " + l + ": " + lessons[l].join(", ") })); });
      if (presetKey !== "all") deckSel.appendChild(el("option", { value: "all", text: "All " + RECIPES.length + " course specs" }));
      deckSel.appendChild(el("option", { value: "custom", text: "My own selection" }));
    }
    box.appendChild(el("div", { class: "row" }, [el("div", null, [el("label", { for: "deck", text: "Deck" }), deckSel])]));
    var picker = el("div", { class: "picker", id: "picker", hidden: "hidden" });
    var chosen = S.store.get(CUSTOM_KEY, []);
    RECIPES.forEach(function (r) {
      var cb = el("input", { type: "checkbox", value: r.id });
      cb.checked = chosen.indexOf(r.id) >= 0;
      cb.addEventListener("change", function () {
        var list = [].slice.call(picker.querySelectorAll("input:checked")).map(function (x) { return x.value; });
        S.store.set(CUSTOM_KEY, list); renderBoxes();
      });
      picker.appendChild(el("label", null, [cb, r.name + " (" + r.lesson + ")"]));
    });
    box.appendChild(picker);
    if (presetKey !== "families") {
      dueChk = el("input", { type: "checkbox", id: "due" });
      dueChk.checked = true;
      dueChk.addEventListener("change", renderBoxes);
      box.appendChild(el("label", { class: "inline" }, [dueChk, "Only cards due today (Leitner: box 1 daily, box 2 every 2 days, box 3 weekly)"]));
      box.appendChild(el("div", { class: "boxes", id: "boxes" }));
    }
    var startBtn = el("button", { type: "button", id: "start", text: presetKey === "families" ? "Start sorting" : "Start round", onclick: startRound });
    var btns = [startBtn];
    if (presetKey !== "families") btns.push(el("button", { type: "button", class: "secondary", text: "Reset boxes for this deck", onclick: function () {
      var b = boxes(); currentDeckIds().forEach(function (id) { delete b[id]; }); S.store.set(BOX_KEY, b);
      $("setup-msg").textContent = "Boxes reset: every card in this deck is back in box 1."; renderBoxes();
    } }));
    box.appendChild(el("div", { class: "btns" }, btns));
    box.appendChild(el("p", { id: "setup-msg", class: "muted small", "aria-live": "polite", text: "Shuffle seed " + seed + "." }));
    deckSel.addEventListener("change", function () { picker.hidden = deckSel.value !== "custom"; renderBoxes(); });
    if (prevDeck && [].some.call(deckSel.options, function (o) { return o.value === prevDeck; })) { deckSel.value = prevDeck; picker.hidden = prevDeck !== "custom"; }
    if (dueChk) dueChk.checked = prevDue;
    renderBoxes();
  }
  function renderBoxes() {
    var bx = $("boxes");
    if (!bx) return;
    var ids = currentDeckIds(), b = boxes(), counts = { 1: 0, 2: 0, 3: 0 };
    ids.forEach(function (id) { counts[(b[id] && b[id].box) || 1]++; });
    var due = D.dueIds(ids, b, today()).length;
    bx.textContent = "";
    [1, 2, 3].forEach(function (k) { bx.appendChild(el("span", { class: "pill", text: "Box " + k + ": " + counts[k] })); });
    bx.appendChild(el("span", { class: "pill", text: "Due today: " + due + " of " + ids.length }));
  }

  // ---------- rounds ----------
  var round = null;   // {mode, ids, i, results, cards, answers}
  function startRound() {
    var ids = currentDeckIds();
    var msg = $("setup-msg");
    if (!ids.length) { msg.textContent = "This deck is empty: tick some drinks under My own selection."; return; }
    if (presetKey !== "families" && dueChk && dueChk.checked) {
      var due = D.dueIds(ids, boxes(), today());
      if (!due.length) { msg.textContent = "No cards due today in this deck. Untick \"Only cards due today\" to practise them anyway."; return; }
      ids = due;
    }
    var rng = S.rng(seed);
    var order = rng.shuffle(ids);
    round = { mode: presetKey === "families" ? "families" : "practice", ids: order, i: 0, results: [], rng: rng };
    $("summary").hidden = true;
    $("stage").hidden = false;
    renderCard();
  }

  function newSeed() { seed = Math.floor(Math.random() * 1e9); }

  // ---------- recall card ----------
  function recallForm(card, saved) {
    var wrap = el("div");
    var fsI = el("fieldset", null, [el("legend", { text: "Ingredients and ml" }),
      el("p", { class: "muted small", text: "Tick every ingredient in the spec (and nothing else) and give its amount." })]);
    card.candidates.forEach(function (c, j) {
      var sv = (saved && saved.ingredients && saved.ingredients[c.item]) || {};
      var cb = el("input", { type: "checkbox", id: "cand-" + j });
      cb.checked = !!sv.selected;
      var amt;
      if (c.kind === "ml") {
        amt = el("input", { type: "number", min: "0", step: "0.5", id: "amt-" + j, "aria-label": "ml of " + c.item, placeholder: "ml" });
        if (sv.ml !== undefined && sv.ml !== null && sv.ml !== "") amt.value = sv.ml;
      } else {
        amt = el("select", { id: "amt-" + j, "aria-label": "Amount of " + c.item });
        amt.appendChild(el("option", { value: "", text: "— amount —" }));
        c.amountOptions.forEach(function (o) { amt.appendChild(el("option", { value: o, text: o })); });
        if (sv.amount) amt.value = sv.amount;
      }
      var row = el("div", { class: "cand" + (cb.checked ? " sel" : ""), id: "row-" + j }, [
        el("label", { class: "check", for: "cand-" + j }, [cb, c.item]),
        el("div", { class: "amt" }, c.kind === "ml" ? [amt, el("span", { class: "muted", text: "ml" })] : [amt]),
        el("div", { class: "mark", id: "mark-" + j })
      ]);
      cb.addEventListener("change", function () { row.className = "cand" + (cb.checked ? " sel" : ""); });
      amt.addEventListener("input", function () { if (!cb.checked && amt.value) { cb.checked = true; row.className = "cand sel"; } });
      fsI.appendChild(row);
    });
    fsI.appendChild(el("div", { class: "cell-mark", id: "cm-ingredients" }));
    wrap.appendChild(fsI);

    function sel(id, label, opts, value) {
      var s = el("select", { id: id });
      s.appendChild(el("option", { value: "", text: "— choose —" }));
      opts.forEach(function (o) { s.appendChild(el("option", { value: o[0], text: o[1] })); });
      if (value) s.value = value;
      return el("div", null, [el("label", { for: id, text: label }), s]);
    }
    var a = saved || {};
    wrap.appendChild(el("fieldset", null, [el("legend", { text: "Method" }),
      sel("f-method", "Method", D.METHODS.map(function (m) { return [m.id, m.label]; }), a.method), el("div", { class: "cell-mark", id: "cm-method" })]));
    wrap.appendChild(el("fieldset", null, [el("legend", { text: "Glass and ice" }), el("div", { class: "row" }, [
      sel("f-glass", "Glass", D.GLASSES.map(function (g) { return [g.id, g.label]; }), a.glass),
      sel("f-ice", "Ice in the glass", D.ICES.map(function (g) { return [g.id, g.label]; }), a.ice)]), el("div", { class: "cell-mark", id: "cm-glass" })]));
    wrap.appendChild(el("fieldset", null, [el("legend", { text: "Garnish" }),
      sel("f-garnish", "Garnish", GARNISHES, a.garnish), el("div", { class: "cell-mark", id: "cm-garnish" })]));
    return wrap;
  }
  function readAnswer(card) {
    var ing = {};
    card.candidates.forEach(function (c, j) {
      var cb = $("cand-" + j), amt = $("amt-" + j);
      var v = amt.value;
      ing[c.item] = { selected: cb.checked, ml: c.kind === "ml" ? (v === "" ? null : parseFloat(v)) : null, amount: c.kind === "amount" ? (v || null) : null };
    });
    return { ingredients: ing, method: $("f-method").value, glass: $("f-glass").value, ice: $("f-ice").value, garnish: $("f-garnish").value };
  }
  function lockForm() { [].slice.call($("stage").querySelectorAll("input, select")).forEach(function (x) { x.disabled = true; }); }

  function showMarks(r, card, res) {
    card.candidates.forEach(function (c, j) {
      var m = $("mark-" + j), ans = res.cells.ingredients;
      if (c.correct) {
        var wrong = ans.wrongAmt.filter(function (w) { return w.item === c.item; })[0];
        if (ans.missing.indexOf(c.item) >= 0) { m.className = "mark no"; m.textContent = "In the spec: " + (c.specMl !== null ? c.specMl + " ml" : c.specAmount); }
        else if (wrong) { m.className = "mark no"; m.textContent = "Spec: " + wrong.spec + " (you: " + wrong.given + ")"; }
        else if (c.optional) { m.className = "mark muted"; m.textContent = "Optional in the spec (" + (c.specAmount || c.specMl + " ml") + ")"; }
        else { m.className = "mark ok"; m.textContent = "Right" + (c.specMl !== null ? " (spec " + c.specMl + " ml)" : ""); }
      } else if (ans.extra.indexOf(c.item) >= 0) { m.className = "mark no"; m.textContent = "Not in this spec"; }
    });
    function cell(id, ok, text) { var e = $(id); e.className = "cell-mark " + (ok ? "ok" : "no"); e.textContent = text; }
    var acc = D.acceptedGlassIce(r).map(function (c) { return glassLabel(c[0]) + ", " + iceLabel(c[1]).toLowerCase(); });
    cell("cm-ingredients", res.cells.ingredients.ok, res.cells.ingredients.ok ? "Ingredients and ml: point" : "Ingredients and ml: no point");
    cell("cm-method", res.cells.method.ok, res.cells.method.ok ? "Method: point" : "Method: " + methodLabel(r.method));
    cell("cm-glass", res.cells.glass.ok, res.cells.glass.ok ? "Glass and ice: point" : "Glass and ice: " + acc[0] + (acc.length > 1 ? " (also accepted: " + acc.slice(1).join("; ") + ")" : ""));
    cell("cm-garnish", res.cells.garnish.ok, res.cells.garnish.ok ? "Garnish: point" : "Garnish: " + r.garnish);
  }

  function renderCard() {
    var st = $("stage");
    st.textContent = "";
    if (round.mode === "families") return renderFamilyCard(st);
    var r = byId(round.ids[round.i]);
    var card = D.buildCard(r, RECIPES, round.rng);
    st.appendChild(el("p", { class: "progress", text: "Card " + (round.i + 1) + " of " + round.ids.length }));
    st.appendChild(el("h2", { class: "drink-name", text: r.name }));
    st.appendChild(recallForm(card, null));
    var result = el("div", { id: "card-result" });
    var checkBtn = el("button", { type: "button", text: "Check" });
    var showBtn = el("button", { type: "button", class: "secondary", text: "Show answer (counts as a miss)" });
    var nextBtn = el("button", { type: "button", text: round.i + 1 < round.ids.length ? "Next card" : "See results", hidden: "hidden" });
    function finish(res) {
      lockForm();
      checkBtn.hidden = true; showBtn.hidden = true; nextBtn.hidden = false;
      showMarks(r, card, res);
      var pass = res.points === 4;
      saveBox(r.id, pass);
      round.results.push(res);
      result.textContent = "";
      result.appendChild(el("p", { class: pass ? "good" : "bad", text: res.points + " of 4" + (pass ? ": pass, up one box." : ": back to box 1.") }));
      result.appendChild(specBlock(r));
      nextBtn.focus();
    }
    checkBtn.addEventListener("click", function () { finish(D.markCard(r, card, readAnswer(card))); });
    showBtn.addEventListener("click", function () { var res = D.markCard(r, card, {}); res.points = 0; res.shown = true; finish(res); });
    nextBtn.addEventListener("click", function () { round.i++; if (round.i < round.ids.length) renderCard(); else practiceSummary(); });
    st.appendChild(el("div", { class: "btns" }, [checkBtn, showBtn, nextBtn]));
    st.appendChild(result);
    st.scrollIntoView({ block: "start" });
  }

  function practiceSummary() {
    var sm = $("summary");
    sm.textContent = "";
    sm.hidden = false;
    $("stage").hidden = true;
    var pts = round.results.reduce(function (s, r) { return s + r.points; }, 0), max = round.results.length * 4;
    var passed = round.results.filter(function (r) { return r.points === 4; }).length;
    sm.appendChild(el("h2", { text: "Round results" }));
    sm.appendChild(el("p", { class: "big", text: passed + " of " + round.results.length + " cards passed" }));
    sm.appendChild(el("p", { text: pts + " / " + max + " points (" + S.fmt(pts / max * 100) + "%). The course standard is 80%." }));
    var t = el("table", { class: "breakdown" });
    t.appendChild(el("tr", null, ["Drink", "Points", "Missed"].map(function (h) { return el("th", { text: h }); })));
    round.results.forEach(function (r) {
      t.appendChild(el("tr", null, [el("td", { text: r.name }), el("td", { text: r.points + "/4" }),
        el("td", { text: r.shown ? "answer shown" : r.errors.map(function (e) { return D.ERROR_LABEL[e]; }).join(", ") || "—" })]));
    });
    sm.appendChild(el("div", { class: "table-wrap" }, [t]));
    var misses = round.results.filter(function (r) { return r.points < 4; }).map(function (r) { return r.name; });
    sm.appendChild(el("p", { text: misses.length ? "Back in box 1 for tomorrow: " + misses.join(", ") + ". Write what you missed in your practice log." : "Every card moved up a box." }));
    sm.appendChild(el("div", { class: "btns" }, [el("button", { type: "button", text: "New round", onclick: function () { newSeed(); sm.hidden = true; renderSetup(); $("setup").scrollIntoView(); } })]));
    renderBoxes();
    sm.scrollIntoView({ block: "start" });
  }

  // ---------- families ----------
  function renderFamilyCard(st) {
    var r = byId(round.ids[round.i]);
    st.appendChild(el("p", { class: "progress", text: "Drink " + (round.i + 1) + " of " + round.ids.length }));
    st.appendChild(el("h2", { class: "drink-name", text: r.name }));
    st.appendChild(el("p", { class: "ingredient-clue", text: "Ingredients: " + r.ingredients.map(function (i) { return i.item; }).join(", ") }));
    var fam = el("select", { id: "f-family" }), meth = el("select", { id: "f-method" });
    fam.appendChild(el("option", { value: "", text: "— choose —" }));
    D.FAMILIES.forEach(function (f) { fam.appendChild(el("option", { value: f.id, text: f.label })); });
    meth.appendChild(el("option", { value: "", text: "— choose —" }));
    D.METHODS.forEach(function (m) { meth.appendChild(el("option", { value: m.id, text: m.label })); });
    st.appendChild(el("div", { class: "row" }, [el("div", null, [el("label", { for: "f-family", text: "Family" }), fam]), el("div", null, [el("label", { for: "f-method", text: "Method" }), meth])]));
    var out = el("div", { "aria-live": "polite" });
    var check = el("button", { type: "button", text: "Check" });
    var next = el("button", { type: "button", text: round.i + 1 < round.ids.length ? "Next drink" : "See results", hidden: "hidden" });
    check.addEventListener("click", function () {
      var res = D.markFamily(r, fam.value, meth.value);
      round.results.push(res);
      fam.disabled = true; meth.disabled = true; check.hidden = true; next.hidden = false;
      var f = D.FAMILIES.filter(function (x) { return x.id === r.family; })[0];
      var alt = (D.FAMILY_ALT[r.id] || []).map(familyLabel);
      out.appendChild(el("p", { class: res.familyOk ? "ok" : "no", text: "Family: " + familyLabel(r.family) + (alt.length ? " (also accepted: " + alt.join(", ") + ")" : "") + " — " + (f ? f.pattern : "") }));
      out.appendChild(el("p", { class: res.methodOk ? "ok" : "no", text: "Method: " + methodLabel(r.method) }));
      next.focus();
    });
    next.addEventListener("click", function () { round.i++; if (round.i < round.ids.length) renderCard(); else familySummary(); });
    st.appendChild(el("div", { class: "btns" }, [check, next]));
    st.appendChild(out);
  }
  function familySummary() {
    var sm = $("summary");
    sm.textContent = ""; sm.hidden = false; $("stage").hidden = true;
    var pts = round.results.reduce(function (s, r) { return s + r.points; }, 0), max = round.results.length * 2;
    sm.appendChild(el("h2", { text: "Sort results" }));
    sm.appendChild(el("p", { class: "big", text: pts + " / " + max + " (" + S.fmt(pts / max * 100) + "%)" }));
    var t = el("table", { class: "breakdown" });
    t.appendChild(el("tr", null, ["Drink", "Family", "Method"].map(function (h) { return el("th", { text: h }); })));
    round.results.forEach(function (r) {
      var rec = byId(r.id);
      t.appendChild(el("tr", null, [el("td", { text: r.name }), el("td", { class: r.familyOk ? "ok" : "no", text: familyLabel(rec.family) }), el("td", { class: r.methodOk ? "ok" : "no", text: methodLabel(rec.method) })]));
    });
    sm.appendChild(el("div", { class: "table-wrap" }, [t]));
    sm.appendChild(el("div", { class: "btns" }, [el("button", { type: "button", text: "Sort again (new order)", onclick: function () { newSeed(); sm.hidden = true; renderSetup(); $("setup").scrollIntoView(); } })]));
    sm.scrollIntoView({ block: "start" });
  }

  // ---------- exam ----------
  var exam = null;
  function renderExamSetup(box) {
    box.appendChild(el("h2", { text: "Before you start" }));
    box.appendChild(el("p", null, ["Exam seed: ", el("span", { class: "seed", text: String(seed) })]));
    box.appendChild(el("p", { class: "muted", text: "Write the seed on your exam score sheet. Put the recipe library, flashcards and notes away. You can move between cards and change answers until you finish; nothing is marked before that." }));
    box.appendChild(el("div", { class: "btns" }, [el("button", { type: "button", id: "start", text: "Start exam", onclick: startExam })]));
  }
  function startExam() {
    var rng = S.rng(seed);
    var drawn = D.examDraw(RECIPES, rng);
    exam = { seed: seed, date: today(), recipes: drawn, cards: drawn.map(function (r) { return D.buildCard(r, RECIPES, rng); }), answers: drawn.map(function () { return null; }), i: 0, confirm: false };
    $("setup").hidden = true;
    $("summary").hidden = true;
    $("stage").hidden = false;
    renderExamCard();
  }
  function saveExam() { exam.answers[exam.i] = readAnswer(exam.cards[exam.i]); }
  function renderExamCard() {
    var st = $("stage");
    st.textContent = "";
    var r = exam.recipes[exam.i], card = exam.cards[exam.i];
    var answered = exam.answers.filter(function (a) { return a && !isBlankAnswer(a); }).length;
    st.appendChild(el("p", { class: "progress", text: "Exam seed " + exam.seed + " · Card " + (exam.i + 1) + " of " + exam.cards.length + " · " + answered + " answered" }));
    st.appendChild(el("h2", { class: "drink-name", text: r.name }));
    st.appendChild(recallForm(card, exam.answers[exam.i]));
    var prev = el("button", { type: "button", class: "secondary", text: "Previous card" });
    prev.disabled = exam.i === 0;
    var last = exam.i === exam.cards.length - 1;
    var next = el("button", { type: "button", text: last ? "Finish exam" : "Next card" });
    var confirmBox = el("div", { id: "confirm", "aria-live": "polite" });
    prev.addEventListener("click", function () { saveExam(); exam.i--; renderExamCard(); });
    next.addEventListener("click", function () {
      saveExam();
      if (!last) { exam.i++; renderExamCard(); return; }
      var blanks = exam.answers.filter(function (a) { return !a || isBlankAnswer(a); }).length;
      confirmBox.textContent = "";
      confirmBox.appendChild(el("p", { class: "warn", text: (blanks ? blanks + " card" + (blanks > 1 ? "s are" : " is") + " blank and will score zero. " : "") + "Finish and mark the exam? You cannot change answers afterwards." }));
      var yes = el("button", { type: "button", text: "Yes, finish and mark", onclick: finishExam });
      var no = el("button", { type: "button", class: "secondary", text: "Go back to the cards", onclick: function () { confirmBox.textContent = ""; } });
      confirmBox.appendChild(el("div", { class: "btns" }, [yes, no]));
      yes.focus();
    });
    st.appendChild(el("div", { class: "btns" }, [prev, next]));
    st.appendChild(confirmBox);
    st.scrollIntoView({ block: "start" });
  }
  function isBlankAnswer(a) {
    var ing = a.ingredients || {};
    return !Object.keys(ing).some(function (k) { return ing[k].selected; }) && !a.method && !a.glass && !a.ice && !a.garnish;
  }
  function finishExam() {
    var results = exam.recipes.map(function (r, i) { return D.markCard(r, exam.cards[i], exam.answers[i] || {}); });
    var sum = D.examSummary(results);
    var st = $("stage"); st.hidden = true;
    var sm = $("summary"); sm.textContent = ""; sm.hidden = false;
    sm.appendChild(el("h2", { text: "Exam results" }));
    sm.appendChild(el("p", { class: "big " + (sum.pass ? "good" : "bad"), text: sum.points + " / " + sum.max + " points · " + S.fmt(sum.percent, 1) + "%" }));
    sm.appendChild(el("p", { text: (sum.pass ? "Minimum met" : "Minimum NOT met") + ": the recipe recall component needs 80% (" + sum.minPoints + " points). Seed " + exam.seed + ", " + exam.date + "." }));
    var w = el("table");
    w.appendChild(el("tr", null, ["Component (lesson 11.1)", "Weight", "Minimum", "Your score", "Weighted points"].map(function (h) { return el("th", { text: h }); })));
    w.appendChild(el("tr", null, ["Recipe recall (11.2)", "25%", "80%", S.fmt(sum.percent, 1) + "%", S.fmt(sum.weighted, 1) + " of 25"].map(function (v) { return el("td", { text: v }); })));
    sm.appendChild(el("div", { class: "table-wrap" }, [w]));
    sm.appendChild(el("p", { class: "muted small", text: "Pass overall = weighted total of all five components ≥ 80%, every component minimum met, and no safety-critical failure (lesson 11.1)." }));
    sm.appendChild(el("h3", { text: "Errors by type" }));
    sm.appendChild(el("p", { text: Object.keys(sum.counts).map(function (k) { return D.ERROR_LABEL[k] + ": " + sum.counts[k]; }).join(" · ") + (sum.dominant ? " — dominant type: " + D.ERROR_LABEL[sum.dominant] : " — no errors") }));

    sm.appendChild(el("h3", { text: "Card by card" }));
    var t = el("table", { class: "breakdown" });
    t.appendChild(el("tr", null, ["#", "Drink", "Ingredients and ml", "Method", "Glass and ice", "Garnish", "Points"].map(function (h) { return el("th", { text: h }); })));
    results.forEach(function (res, i) {
      var r = exam.recipes[i], c = res.cells;
      var ingTxt = c.ingredients.ok ? "right" : [].concat(
        c.ingredients.missing.map(function (m) { return "missing " + m; }),
        c.ingredients.extra.map(function (m) { return "not in spec: " + m; }),
        c.ingredients.wrongAmt.map(function (w) { return w.item + " " + w.given + " (spec " + w.spec + ")"; })).join("; ");
      var acc = D.acceptedGlassIce(r)[0];
      t.appendChild(el("tr", null, [
        el("td", { text: String(i + 1) }), el("td", { text: r.name }),
        el("td", { class: c.ingredients.ok ? "ok" : "no", text: ingTxt }),
        el("td", { class: c.method.ok ? "ok" : "no", text: c.method.ok ? methodLabel(r.method) : "you: " + (c.method.given ? methodLabel(c.method.given) : "blank") + " · spec: " + methodLabel(r.method) }),
        el("td", { class: c.glass.ok ? "ok" : "no", text: c.glass.ok ? "right" : "you: " + (c.glass.given[0] ? glassLabel(c.glass.given[0]) : "blank") + ", " + (c.glass.given[1] ? iceLabel(c.glass.given[1]).toLowerCase() : "blank") + " · spec: " + glassLabel(acc[0]) + ", " + iceLabel(acc[1]).toLowerCase() }),
        el("td", { class: c.garnish.ok ? "ok" : "no", text: c.garnish.ok ? "right" : "you: " + (c.garnish.given === "none" ? "none" : c.garnish.given || "blank") + " · spec: " + r.garnish }),
        el("td", { text: res.points + "/4" })]));
    });
    sm.appendChild(el("div", { class: "table-wrap" }, [t]));

    var det = el("details", null, [el("summary", { text: "Correct spec for every card" })]);
    exam.recipes.forEach(function (r) { det.appendChild(specBlock(r)); });
    sm.appendChild(det);

    sm.appendChild(el("h3", { text: "Copy results" }));
    var report = D.examReport(results, exam.seed, exam.date);
    var pre = el("pre", { class: "copy", id: "report", text: report });
    sm.appendChild(pre);
    var msg = el("p", { class: "muted small", "aria-live": "polite" });
    var copy = el("button", { type: "button", text: "Copy results", onclick: function () {
      function fallback() { var range = document.createRange(); range.selectNodeContents(pre); var s = window.getSelection(); s.removeAllRanges(); s.addRange(range); msg.textContent = "Selected: press Ctrl+C (Cmd+C on a Mac) to copy."; }
      try { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(report).then(function () { msg.textContent = "Copied. Paste it into your exam score sheet."; }, fallback); else fallback(); } catch (e) { fallback(); }
    } });
    var rows = [["#", "Drink", "Ingredients", "Method", "Glass and ice", "Garnish", "Points", "Errors"]].concat(results.map(function (r, i) {
      return [i + 1, r.name, r.cells.ingredients.ok ? 1 : 0, r.cells.method.ok ? 1 : 0, r.cells.glass.ok ? 1 : 0, r.cells.garnish.ok ? 1 : 0, r.points, r.errors.join("; ")];
    }));
    var csv = S.csvLink(rows, "recall-exam-" + exam.seed + ".csv", "Download results (CSV)");
    csv.className = "button-link";
    var again = el("button", { type: "button", class: "secondary", text: "New exam with a new seed (retake)", onclick: function () {
      newSeed(); sm.hidden = true; $("setup").hidden = false; renderSetup(); $("setup").scrollIntoView();
    } });
    sm.appendChild(el("div", { class: "btns" }, [copy, csv, again]));
    sm.appendChild(msg);
    sm.scrollIntoView({ block: "start" });
  }

  // ---------- init ----------
  $("label-slot").appendChild(S.label());
  renderTask();
  renderSetup();
})();
