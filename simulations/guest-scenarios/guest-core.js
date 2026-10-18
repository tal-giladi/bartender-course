/* Pure logic for guest scenarios (no DOM). Classic script: window.GuestCore; module.exports under Node. */
(function (root) {
  "use strict";
  var NODE = typeof module !== "undefined" && module.exports;
  var O = NODE ? require("../common/ops-math.js") : root.OpsMath;
  var SC = NODE ? require("./scenarios.js") : root.GUEST_SCENARIOS;
  if (NODE) require("../common/sim.js");
  var S = NODE ? globalThis.Sim : root.Sim;

  var IDS = SC.map(function (s) { return s.id; });
  function byId(id) { return SC.filter(function (s) { return s.id === id; })[0]; }

  // Order of scenarios for a run: exam = all seven shuffled by seed; a single preset = that one.
  function runOrder(preset, seed) {
    if (preset === "exam") return S.rng(seed).shuffle(IDS);
    return IDS.indexOf(preset) >= 0 ? [preset] : [];
  }

  // Display order of the three choices at each decision point (seeded so the best answer is not always first).
  function choiceOrders(seed, scenarioId) {
    var r = S.rng((seed >>> 0) ^ (hash(scenarioId) >>> 0));
    return byId(scenarioId).steps.map(function (st) { return r.shuffle(st.choices.map(function (c, i) { return i; })); });
  }
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h; }

  // picks: original choice indexes, one per step.
  function scoreScenario(id, picks) {
    var sc = byId(id);
    var chosen = sc.steps.map(function (st, i) { var c = st.choices[picks[i]]; return { points: c.points, safety: c.safety || null }; });
    var r = O.scenarioResult(chosen, sc.steps.length * 2);
    r.id = id; r.title = sc.title;
    r.path = sc.steps.map(function (st, i) {
      var c = st.choices[picks[i]], best = st.choices.filter(function (x) { return x.points === 2; })[0];
      return { prompt: st.prompt, chosen: c.text, points: c.points, safety: c.safety || null, model: best.text, why: st.why };
    });
    return r;
  }

  function modelPicks(id) { return byId(id).steps.map(function (st) { var i = 0; st.choices.forEach(function (c, j) { if (c.points === 2) i = j; }); return i; }); }

  function examResult(results) { return O.guestExamResult(results); }

  function copyText(kind, seed, results, dateStr) {
    var ex = examResult(results);
    var lines = [kind === "exam" ? "Guest scenarios exam (lesson 11.5) — guest-scenarios exam preset" : "Guest scenarios practice (lesson 09.7) — " + results.map(function (r) { return r.title; }).join(", "),
      "Date: " + dateStr + " · seed " + seed,
      "Points: " + ex.points + "/" + ex.max + " = " + ex.pct.toFixed(1) + "%"];
    results.forEach(function (r) { lines.push("  " + r.title + ": " + r.points + "/" + r.max + (r.pass ? " pass" : " not passed") + (r.safety.length ? " (safety-critical)" : "")); });
    lines.push("Safety-critical choices: " + (ex.safety.length ? ex.safety.join(" | ") : "none"));
    if (kind === "exam") lines.push("Safety result: " + (ex.safetyPass ? "passed (no safety-critical choice)" : "NOT passed: remediation and retest"),
      "Written component input: 0.25 × " + ex.pct.toFixed(1) + "%");
    lines.push("Educational model; self-scored and unverified.");
    return lines.join("\n");
  }

  var api = { IDS: IDS, byId: byId, runOrder: runOrder, choiceOrders: choiceOrders, scoreScenario: scoreScenario, modelPicks: modelPicks, examResult: examResult, copyText: copyText };
  if (NODE) module.exports = api;
  else root.GuestCore = api;
})(typeof window !== "undefined" ? window : globalThis);
