/* Guest scenarios UI. Depends on Sim, OpsMath, GUEST_SCENARIOS, GuestCore. */
(function () {
  "use strict";
  var S = window.Sim, G = window.GuestCore;
  var $ = function (id) { return document.getElementById(id); };
  var el = S.el;

  var PRESETS = ["all", "exam"].concat(G.IDS);
  var preset = S.preset(PRESETS, "all");
  var seed = S.seed();
  var run = null; // {kind, order, si, step, picks: [[...]], orders, results, awaiting}

  function clear(n) { while (n.firstChild) n.removeChild(n.firstChild); return n; }
  function focusFirst(node) { var b = node.querySelector("button, h2"); if (b) { if (b.tagName === "H2") b.setAttribute("tabindex", "-1"); b.focus({ preventScroll: false }); } }

  function renderTask() {
    var c = clear($("task-card"));
    if (preset === "exam") {
      c.appendChild(el("h2", { text: "Final exam: all seven situations (11.5)" }));
      c.appendChild(el("p", {}, [el("strong", { text: "What it trains: " }), "Making the safe, professional choice in all seven situations, in random order, with no feedback until the end."]));
      c.appendChild(el("p", {}, [el("strong", { text: "Task: " }), "Answer all seven in the order they come; take your time. Write down the seed. Score = points ÷ 56 × 100 (feeds the written component at 25%). The part is pass or fail on safety: any safety-critical choice means remediation and a retest. First complete run counts; a retake uses a new seed."]));
    } else if (preset === "all") {
      c.appendChild(el("h2", { text: "Practice: choose a situation" }));
      c.appendChild(el("p", {}, [el("strong", { text: "What it trains: " }), "Noticing the risk, applying the rule, acting safely, offering an alternative and involving the team (Module 9)."]));
      c.appendChild(el("p", {}, [el("strong", { text: "Task: " }), "Write your own response first (labs/module-09/scenario-response-sheet.md), then run each situation. Target: every situation passed with at least 6 of 8 and no safety-critical choice."]));
    } else {
      var sc = G.byId(preset);
      c.appendChild(el("h2", { text: sc.title + " (" + sc.lesson + ")" }));
      c.appendChild(el("p", {}, [el("strong", { text: "What it trains: " }), "The " + sc.title.toLowerCase() + " situation: four decisions, scored after the last one."]));
      c.appendChild(el("p", {}, [el("strong", { text: "Task: " }), "Write your response first, then run it. Target: at least 6 of 8 points (75%) and no safety-critical choice. Then compare your written answer with the model path."]));
    }
  }

  // ---------- picker ----------
  function showPicker() {
    run = null;
    var st = clear($("stage"));
    var card = el("section", { class: "card" }, [el("h2", { text: "Situations" })]);
    var grid = el("div", { class: "picker" });
    G.IDS.forEach(function (id) {
      var sc = G.byId(id);
      grid.appendChild(el("button", { type: "button", class: "secondary", onclick: function () { start("single", [id]); } }, [el("strong", { text: sc.title }), el("br"), el("span", { class: "muted", text: "lesson " + sc.lesson })]));
    });
    card.appendChild(grid);
    card.appendChild(el("div", { class: "actions" }, [el("button", { type: "button", text: "Run all seven in order (practice)", onclick: function () { start("practice-all", G.IDS.slice()); } })]));
    st.appendChild(card);
  }

  // ---------- run ----------
  function start(kind, order) {
    run = { kind: kind, order: order, si: 0, step: 0, picks: order.map(function () { return []; }),
      orders: order.map(function (id) { return G.choiceOrders(seed, id); }), results: [] };
    showStep();
  }

  function header(sc) {
    var total = run.order.length;
    return el("p", { class: "progress", text: (total > 1 ? "Situation " + (run.si + 1) + " of " + total + " · " : "") + "Decision " + (run.step + 1) + " of " + sc.steps.length + (run.kind === "exam" ? " · seed " + seed : "") });
  }

  function showStep() {
    var id = run.order[run.si], sc = G.byId(id), stp = sc.steps[run.step];
    var st = clear($("stage"));
    var card = el("section", { class: "card" });
    card.appendChild(el("h2", { text: sc.title }));
    card.appendChild(header(sc));
    card.appendChild(el("p", { class: "situation muted", text: sc.card }));
    card.appendChild(el("p", { class: "prompt", text: stp.prompt }));
    var group = el("div", { class: "choices", role: "group", "aria-label": "Your reply or action" });
    run.orders[run.si][run.step].forEach(function (ci, k) {
      group.appendChild(el("button", { type: "button", onclick: function () { choose(ci); } }, [el("strong", { text: String.fromCharCode(65 + k) + ". " }), stp.choices[ci].text]));
    });
    card.appendChild(group);
    st.appendChild(card);
    focusFirst(group);
  }

  function choose(ci) {
    var id = run.order[run.si], sc = G.byId(id), stp = sc.steps[run.step];
    run.picks[run.si][run.step] = ci;
    if (run.kind === "exam") { advance(); return; }
    // practice: show the guest's reaction (not the score) before the next decision
    var st = clear($("stage"));
    var card = el("section", { class: "card" });
    card.appendChild(el("h2", { text: sc.title }));
    card.appendChild(header(sc));
    card.appendChild(el("p", { class: "prompt", text: stp.prompt }));
    card.appendChild(el("p", {}, [el("strong", { text: "You: " }), stp.choices[ci].text]));
    card.appendChild(el("p", { class: "reaction", text: stp.choices[ci].reaction }));
    var last = run.step === sc.steps.length - 1;
    card.appendChild(el("div", { class: "actions" }, [el("button", { type: "button", text: last ? "See your result" : "Next decision", onclick: advance })]));
    st.appendChild(card);
    focusFirst(card.querySelector(".actions"));
  }

  function advance() {
    var id = run.order[run.si], sc = G.byId(id);
    if (run.step < sc.steps.length - 1) { run.step++; showStep(); return; }
    run.results[run.si] = G.scoreScenario(id, run.picks[run.si]);
    if (run.kind === "exam") {
      if (run.si < run.order.length - 1) { run.si++; run.step = 0; showStep(); } else showExamEnd();
      return;
    }
    showScenarioEnd();
  }

  function pathTable(r) {
    var t = el("table", { class: "path" });
    t.appendChild(el("thead", {}, [el("tr", {}, [el("th", { text: "#" }), el("th", { text: "Your choice" }), el("th", { text: "Points" }), el("th", { text: "Model choice and why" })])]));
    var tb = el("tbody");
    r.path.forEach(function (p, i) {
      tb.appendChild(el("tr", {}, [el("td", { text: String(i + 1) }),
        el("td", {}, [p.chosen, p.safety ? el("div", { class: "flag", text: "Safety-critical: " + p.safety }) : null]),
        el("td", {}, [el("span", { class: "pts pts-" + p.points, text: p.points + " / 2" })]),
        el("td", {}, [p.points === 2 ? el("em", { text: "Your choice was the model choice. " }) : el("span", { text: p.model + " " }), el("span", { class: "muted", text: p.why })])]));
    });
    t.appendChild(tb);
    return el("div", { class: "table-wrap" }, [t]);
  }

  function verdict(r) {
    return el("p", { class: "verdict " + (r.pass ? "good" : "bad"), text: (r.pass ? "Passed" : "Not passed") + ": " + r.points + " / " + r.max + " (" + r.pct.toFixed(0) + "%)" +
      (r.safety.length ? " · safety-critical choice" : r.pct < 70 ? " · below 6 of 8" : "") });
  }

  function copyBox(text) {
    var pre = el("pre", { class: "copy", text: text }), msg = el("p", { class: "muted", "aria-live": "polite" });
    var btn = el("button", { type: "button", text: "Copy results", onclick: function () {
      function fb() { var r = document.createRange(); r.selectNodeContents(pre); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); msg.textContent = "Selected: press Ctrl+C (Cmd+C on a Mac) to copy."; }
      try { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { msg.textContent = "Copied."; }, fb); else fb(); } catch (e) { fb(); }
    } });
    return el("div", {}, [el("h3", { text: "Copy results" }), pre, btn, msg]);
  }

  function showScenarioEnd() {
    var r = run.results[run.si], sc = G.byId(r.id);
    var st = clear($("stage"));
    var card = el("section", { class: "card" });
    card.appendChild(el("h2", { text: "Result: " + sc.title }));
    card.appendChild(verdict(r));
    if (r.safety.length) card.appendChild(el("p", { class: "flag", text: "A safety-critical choice fails the situation whatever the points. Rerun it until you pass cleanly." }));
    card.appendChild(pathTable(r));
    card.appendChild(el("p", {}, [el("strong", { text: "Rule: " }), sc.rule]));
    var acts = el("div", { class: "actions" });
    if (run.kind === "practice-all" && run.si < run.order.length - 1) acts.appendChild(el("button", { type: "button", text: "Next situation", onclick: function () { run.si++; run.step = 0; showStep(); } }));
    acts.appendChild(el("button", { type: "button", class: "secondary", text: "Run this situation again", onclick: function () { seed = (seed + 7919) >>> 0; start("single", [r.id]); } }));
    acts.appendChild(el("button", { type: "button", class: "secondary", text: "Choose another situation", onclick: showPicker }));
    card.appendChild(acts);
    var done = run.results.filter(Boolean);
    card.appendChild(copyBox(G.copyText("practice", seed, done, new Date().toISOString().slice(0, 10))));
    st.appendChild(card);
    focusFirst(card);
  }

  function showExamEnd() {
    var ex = G.examResult(run.results);
    var st = clear($("stage"));
    var card = el("section", { class: "card" });
    card.appendChild(el("h2", { text: "Exam result" }));
    card.appendChild(el("div", { class: "kpis" }, [
      el("div", { class: "kpi" }, [el("div", { class: "muted", text: "Points" }), el("div", { class: "v", text: ex.points + " / " + ex.max })]),
      el("div", { class: "kpi" }, [el("div", { class: "muted", text: "Guest scenarios exam %" }), el("div", { class: "v", text: ex.pct.toFixed(1) + "%" }), el("div", { class: "muted", text: "points ÷ 56 × 100 → written component × 0.25" })]),
      el("div", { class: "kpi" }, [el("div", { class: "muted", text: "Safety" }), el("div", { class: "v " + (ex.safetyPass ? "good" : "bad"), text: ex.safetyPass ? "Passed" : "Not passed" })])
    ]));
    card.appendChild(el("h3", { text: "Safety-critical choices" }));
    if (ex.safety.length) {
      var ul = el("ul");
      run.results.forEach(function (r) { r.safety.forEach(function (s) { ul.appendChild(el("li", { class: "flag", text: r.title + ": " + s })); }); });
      card.appendChild(ul);
      card.appendChild(el("p", { text: "Remediation: re-read the Module 9 lesson for that situation, pass its single-situation preset twice, rewrite the failed case, then retake the exam with a new seed." }));
    } else card.appendChild(el("p", { class: "good", text: "None." }));
    card.appendChild(el("h3", { text: "Each situation: your path and the model path" }));
    run.results.forEach(function (r) {
      var d = el("details", { class: "scn" }, [el("summary", { text: r.title + " — " + r.points + "/" + r.max + (r.safety.length ? " · safety-critical" : "") }), pathTable(r), el("p", {}, [el("strong", { text: "Rule: " }), G.byId(r.id).rule])]);
      card.appendChild(d);
    });
    card.appendChild(copyBox(G.copyText("exam", seed, run.results, new Date().toISOString().slice(0, 10))));
    card.appendChild(el("p", { class: "muted", text: "Exam conditions: the first complete run counts. A retake (after a logged remediation session) uses a new seed." }));
    card.appendChild(el("div", { class: "actions" }, [el("button", { type: "button", class: "secondary", text: "Retake with a new seed", onclick: function () { seed = Math.floor(Math.random() * 1e9); startForPreset(); } })]));
    st.appendChild(card);
    focusFirst(card);
  }

  function startForPreset() {
    if (preset === "all") showPicker();
    else if (preset === "exam") start("exam", G.runOrder("exam", seed));
    else start("single", [preset]);
  }

  $("label-slot").appendChild(S.label());
  renderTask();
  startForPreset();
})();
