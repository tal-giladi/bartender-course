/* Dilution lab UI. Depends on Sim, BarMath, RECIPES, LabCore. */
(function () {
  "use strict";
  var S = window.Sim, L = window.LabCore, RECIPES = window.RECIPES || [];
  var $ = function (id) { return document.getElementById(id); };
  var el = S.el;
  var COLORS = { shake: "#3b7dd8", stir: "#2e9e5b", build: "#a05ac9", throw: "#c98a1a" };

  var PRESETS = {
    explore: { title: "Explore", method: "shake", trains: "How method, time, ice and strength change dilution and temperature (lessons 03.5, 04.1)." },
    shake: { title: "Shaking", method: "shake", trains: "Shaking chills and dilutes fast: most of the change happens in the first 10 seconds and little is added after about 15 seconds (lessons 03.5, 04.4)." },
    stir: { title: "Stirring", method: "stir", trains: "Stirring is slower: the time you stir sets the dilution, and past about 30 seconds each extra 15 seconds adds only a few percent (lessons 03.5, 04.3)." },
    build: { title: "Building on ice", method: "build", trains: "A drink built on ice starts with little water and keeps diluting while the guest drinks it (lessons 03.5, 03.6, 04.1)." },
    throw: { title: "Throwing", method: "throw", trains: "Throwing chills and dilutes between stirring and shaking: 4–5 throws of about 2 seconds each (lesson 04.6). The model's throwing numbers are a rough estimate." },
    temperature: { title: "Temperature", method: "shake", trains: "Why stronger drinks get colder and more diluted, why an alcohol-free mix stops near 0 °C, and what freezer ice, wet ice and chilled ingredients change (lessons 01.6, 03.5)." }
  };
  var presetKey = S.preset(Object.keys(PRESETS), "explore");
  var preset = PRESETS[presetKey];
  var tasks = L.TASKS[presetKey];

  // ---------- drink setup ----------
  function buildDrinkSelect() {
    var sel = $("drink");
    var g1 = el("optgroup", { label: "Lesson drinks" });
    Object.keys(L.DRINKS).forEach(function (k) { g1.appendChild(el("option", { value: k, text: L.DRINKS[k].name })); });
    sel.appendChild(g1);
    var g2 = el("optgroup", { label: "Course recipes (ABV from typical labels)" });
    RECIPES.forEach(function (r) { g2.appendChild(el("option", { value: "r:" + r.id, text: r.name + " (" + r.lesson + ")" })); });
    sel.appendChild(g2);
    sel.appendChild(el("option", { value: "custom", text: "Custom (my own volume and ABV)" }));
    sel.addEventListener("change", function () { applyDrink(sel.value, true); update(); });
  }
  function applyDrink(key, setMethod) {
    var d;
    if (key.slice(0, 2) === "r:") {
      var r = RECIPES.filter(function (x) { return x.id === key.slice(2); })[0];
      d = L.drinkFromRecipe(r);
      if (setMethod && d.method) setMethodTo(d.method);
    } else d = L.DRINKS[key];
    if (!d) return;
    $("vol").value = Math.round(d.volumeMl * 10) / 10;
    $("abv").value = Math.round(d.abv * 1000) / 10;
  }
  function setMethodTo(m) {
    $("method").value = m;
    var max = L.MAX_T[m];
    $("time").max = max;
    if (+$("time-num").value > max) setTime(max);
  }
  function setTime(t) { $("time").value = t; $("time-num").value = t; }

  function settings() {
    var v = parseFloat($("vol").value), a = parseFloat($("abv").value), st = parseFloat($("start").value);
    return { method: $("method").value, volumeMl: v > 0 ? v : 100, abv: isFinite(a) ? Math.max(0, Math.min(a, 60)) / 100 : 0,
      ice: $("ice").value, iceState: $("ice-state").value, startTempC: isFinite(st) ? st : 20 };
  }
  function time() { var t = parseFloat($("time-num").value); return isFinite(t) && t >= 0 ? t : 0; }

  ["vol", "abv"].forEach(function (id) { $(id).addEventListener("input", function () { $("drink").value = "custom"; update(); }); });
  $("start").addEventListener("input", update);
  ["ice", "ice-state", "metric"].forEach(function (id) { $(id).addEventListener("change", update); });
  $("compare-all").addEventListener("change", update);
  $("method").addEventListener("change", function () { setMethodTo($("method").value); update(); });
  $("time").addEventListener("input", function () { $("time-num").value = $("time").value; update(); });
  $("time-num").addEventListener("input", function () {
    var t = time();
    var m = $("method").value;
    if (t > +$("time").max) $("time").max = Math.min(900, Math.max(L.MAX_T[m], t));
    $("time").value = t; update();
  });

  // ---------- output ----------
  function fmtC(x) { return (x < -0.05 ? "−" : "") + S.fmt(Math.abs(x), 1) + " °C"; }
  function stat(k, v) { return el("div", { class: "stat" }, [el("div", { class: "v", text: v }), el("div", { class: "k", text: k })]); }

  function update() {
    var s = settings(), t = time();
    $("time-out").textContent = L.fmtTime(t);
    var m = L.at(s, t);
    var box = $("stats");
    box.textContent = "";
    box.appendChild(stat("water added (" + S.fmt(m.waterMl, 1) + " ml)", S.fmt(m.dilution * 100, 1) + "%"));
    box.appendChild(stat("in the glass", S.fmt(m.finalMl) + " ml"));
    box.appendChild(stat("ABV after", s.abv > 0 ? S.fmt(m.abvAfter * 100, 1) + "%" : "0%"));
    box.appendChild(stat("temperature", fmtC(m.tempC)));
    box.appendChild(stat("of the plateau reached", S.fmt(m.progress * 100) + "%"));
    $("model-note").textContent = "Plateau for this drink and method: about " + S.fmt(m.plateau * 100) + "% water. It would stop getting colder at about " +
      fmtC(m.equilibriumC * L_TEMP_REACH(s.method)) + " (" + (s.abv > 0 ? "alcohol lets it go below 0 °C" : "water cannot go below 0 °C with ice") + "). " +
      "Ice size, wet or freezer ice and chilled ingredients are rough estimates on top of the fitted model; cubes, machine ice and 20 °C ingredients give the lesson numbers.";
    drawChart(s, t);
  }
  function L_TEMP_REACH(method) { return window.BarMath.TEMP_REACH[method]; }

  function drawChart(s, t) {
    var metric = $("metric").value;
    var cw = $("chart").clientWidth || 640;
    var W = Math.max(320, Math.min(640, cw)), H = W < 480 ? 240 : 280, pl = 42, pr = 12, pt = 12, pb = 34;
    var tMax = Math.max(L.MAX_T[s.method], t);
    var methods = $("compare-all").checked ? Object.keys(L.METHODS) : [s.method];
    var series = methods.map(function (mth) { return { m: mth, pts: L.curve(Object.assign({}, s, { method: mth }), metric, tMax, 90) }; });
    var ys = [];
    series.forEach(function (se) { se.pts.forEach(function (p) { ys.push(p[1]); }); });
    var yMin, yMax;
    if (metric === "temp") { yMin = Math.min(-10, Math.floor(Math.min.apply(null, ys) / 5) * 5); yMax = Math.max(25, Math.ceil(Math.max.apply(null, ys) / 5) * 5); }
    else { yMin = 0; yMax = Math.max(30, Math.ceil(Math.max.apply(null, ys) / 10) * 10); }
    var x = function (v) { return pl + (W - pl - pr) * v / tMax; };
    var y = function (v) { return pt + (H - pt - pb) * (1 - (v - yMin) / (yMax - yMin)); };
    var parts = [];
    function esc(v) { return String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); }
    function add(tag, attrs, text) {
      var a = Object.keys(attrs).map(function (k) { return k + '="' + esc(attrs[k]) + '"'; }).join(" ");
      parts.push("<" + tag + " " + a + (text === undefined ? "/>" : ">" + esc(text) + "</" + tag + ">"));
    }
    var yStep = metric === "temp" ? 5 : 10;
    for (var gy = yMin; gy <= yMax + 1e-9; gy += yStep) {
      add("line", { x1: pl, x2: W - pr, y1: y(gy), y2: y(gy), class: "grid" });
      add("text", { x: pl - 6, y: y(gy) + 4, "text-anchor": "end" }, (gy < 0 ? "−" + Math.abs(gy) : gy) + (metric === "temp" ? "°" : "%"));
    }
    var xStep = tMax <= 30 ? 5 : tMax <= 60 ? 10 : tMax <= 180 ? 30 : 120;
    for (var gx = 0; gx <= tMax + 1e-9; gx += xStep) {
      add("line", { x1: x(gx), x2: x(gx), y1: H - pb, y2: H - pb + 4, class: "axis" });
      add("text", { x: x(gx), y: H - pb + 16, "text-anchor": "middle" }, L.fmtTime(gx));
    }
    add("line", { x1: pl, x2: W - pr, y1: H - pb, y2: H - pb, class: "axis" });
    add("line", { x1: pl, x2: pl, y1: pt, y2: H - pb, class: "axis" });
    add("text", { x: (W + pl) / 2, y: H - 4, "text-anchor": "middle" }, "time");
    if (metric === "temp" && yMin < 0) add("line", { x1: pl, x2: W - pr, y1: y(0), y2: y(0), class: "axis" });
    series.forEach(function (se) {
      var d = se.pts.map(function (p, i) { return (i ? "L" : "M") + x(p[0]).toFixed(1) + " " + y(p[1]).toFixed(1); }).join(" ");
      add("path", { d: d, class: se.m === s.method ? "main" : "other m-" + se.m });
    });
    var cur = L.at(s, t), cv = metric === "temp" ? cur.tempC : cur.dilution * 100;
    add("line", { x1: x(t), x2: x(t), y1: pt, y2: H - pb, class: "marker" });
    add("circle", { cx: x(t), cy: y(cv), r: 5, class: "dot" });
    var chart = $("chart");
    chart.innerHTML = '<svg viewBox="0 0 ' + W + " " + H + '" aria-hidden="true">' + parts.join("") + "</svg>";
    chart.setAttribute("aria-label", (metric === "temp" ? "Temperature" : "Dilution") + " over time for " + L.METHODS[s.method].toLowerCase() +
      "; at " + L.fmtTime(t) + ": " + (metric === "temp" ? fmtC(cv) : S.fmt(cv, 1) + "%"));
    if (methods.length > 1) {
      var lg = el("div", { class: "legend" });
      methods.forEach(function (mth) {
        var sp = el("span", { text: L.METHODS[mth] + (mth === s.method ? " (selected)" : "") });
        sp.style.color = mth === s.method ? "var(--accent)" : COLORS[mth];
        lg.appendChild(sp);
      });
      chart.appendChild(lg);
    }
  }

  // ---------- task ----------
  function renderTaskHeader() {
    $("task-title").textContent = "Preset: " + preset.title;
    $("task-trains").textContent = "Trains: " + preset.trains;
    var sel = $("task-select");
    tasks.forEach(function (tk, i) { sel.appendChild(el("option", { value: String(i), text: tk.title })); });
    sel.addEventListener("change", function () { renderTask(+sel.value); });
  }
  var current = 0;
  function renderTask(i) {
    current = i;
    var tk = tasks[i];
    $("task-text").textContent = "Write your prediction for each row (" + (tk.metric === "temp" ? "temperature in °C" : "water added, % of the starting volume") +
      "), then compare. Target: every prediction within " + L.TOL[tk.metric] + (tk.metric === "temp" ? " °C" : " percentage points") + " of the model. \"Show\" loads that row into the lab below.";
    var tbl = $("task-table");
    tbl.textContent = "";
    tbl.className = "task-table";
    tbl.appendChild(el("tr", null, [el("th", { text: "Setup" }), el("th", { text: "My prediction" }), el("th", { text: "Model" }), el("th", { text: "" })]));
    tk.rows.forEach(function (r, j) {
      var inp = el("input", { type: "number", step: "0.5", id: "pred-" + j, "aria-label": "Prediction for " + L.rowLabel(r) });
      tbl.appendChild(el("tr", null, [el("td", { text: L.rowLabel(r) }), el("td", null, [inp]), el("td", { id: "model-" + j, text: "?" }),
        el("td", null, [el("button", { type: "button", class: "secondary", text: "Show", "aria-label": "Show " + L.rowLabel(r) + " in the lab", onclick: function () { loadRow(r, tk.metric); } })])]));
    });
    $("task-result").textContent = "";
    loadRow(tk.rows[0], tk.metric);
  }
  function loadRow(r, metric) {
    $("drink").value = r.drink;
    $("vol").value = r.volumeMl; $("abv").value = Math.round(r.abv * 1000) / 10;
    setMethodTo(r.method);
    $("ice").value = r.ice; $("ice-state").value = r.iceState; $("start").value = r.startTempC;
    $("time").max = Math.max(L.MAX_T[r.method], r.t);
    setTime(r.t);
    $("metric").value = metric;
    update();
  }
  $("task-compare").addEventListener("click", function () {
    var tk = tasks[current];
    var preds = tk.rows.map(function (_, j) { var v = parseFloat($("pred-" + j).value); return isFinite(v) ? v : null; });
    var ev = L.evaluateTask(tk, preds);
    ev.rows.forEach(function (row, j) {
      var unit = tk.metric === "temp" ? " °C" : "%";
      var txt = (tk.metric === "temp" ? fmtC(row.model) : S.fmt(row.model, 1) + unit);
      if (row.predicted !== null) txt += row.close ? " · close (" + (row.diff >= 0 ? "+" : "−") + S.fmt(Math.abs(row.diff), 1) + ")" : " · off by " + (row.diff >= 0 ? "+" : "−") + S.fmt(Math.abs(row.diff), 1);
      var cell = $("model-" + j);
      cell.textContent = txt;
      cell.className = row.predicted === null ? "" : row.close ? "good" : "bad";
    });
    var r = $("task-result");
    if (!ev.answered) { r.className = "warn"; r.textContent = "No predictions entered: the model values are shown. Next time write your guess first."; return; }
    r.className = ev.close === ev.total ? "good" : "";
    r.textContent = ev.close + " of " + ev.total + " predictions close" + (ev.close === ev.total ? ": target met." : ". Look at where the curve flattens and how strength changes the plateau, then try another task.");
  });
  $("task-clear").addEventListener("click", function () { renderTask(current); });

  // ---------- measurement log ----------
  var LOG_KEY = "dilution-lab-log";
  var log = S.store.get(LOG_KEY, []);
  if (!Array.isArray(log)) log = [];
  function renderLog() {
    var t = $("m-table");
    t.textContent = "";
    var csv = $("m-csv");
    csv.textContent = "";
    if (!log.length) return;
    var head = ["Method", "Time (s)", "ABV %", "Ice", "Before (g)", "After (g)", "Measured %", "Model %", "Difference", "Temp °C"];
    t.appendChild(el("tr", null, head.map(function (h) { return el("th", { text: h }); })));
    log.forEach(function (r) {
      t.appendChild(el("tr", null, [r.method, r.t, r.abv, r.ice, r.before, r.after, S.fmt(r.measured, 1), S.fmt(r.model, 1), S.fmt(r.diff, 1), r.temp === null ? "" : r.temp]
        .map(function (v) { return el("td", { text: String(v) }); })));
    });
    csv.appendChild(S.csvLink([head].concat(log.map(function (r) { return [r.method, r.t, r.abv, r.ice, r.before, r.after, r.measured.toFixed(1), r.model.toFixed(1), r.diff.toFixed(1), r.temp === null ? "" : r.temp]; })), "dilution-log.csv", "Download log (CSV)"));
    csv.firstChild.className = "button-link";
  }
  $("m-add").addEventListener("click", function () {
    var b = parseFloat($("m-before").value), a = parseFloat($("m-after").value), t = parseFloat($("m-time").value), tp = parseFloat($("m-temp").value);
    var res = $("m-result");
    if (!(b > 0) || !(a > 0) || !(t >= 0)) { res.className = "warn"; res.textContent = "Enter weight before, weight after and time."; return; }
    var s = settings();
    var m = L.measurement(b, a, s, t);
    log.push({ method: s.method, t: t, abv: Math.round(s.abv * 1000) / 10, ice: s.ice + ", " + s.iceState, before: b, after: a,
      measured: m.measured, model: m.model, diff: m.diff, temp: isFinite(tp) ? tp : null });
    S.store.set(LOG_KEY, log);
    res.className = "";
    res.textContent = "Measured " + S.fmt(m.measured, 1) + "% · model " + S.fmt(m.model, 1) + "% · difference " + (m.diff >= 0 ? "+" : "−") + S.fmt(Math.abs(m.diff), 1) +
      " points. " + (s.abv === 0 ? "At 0% ABV your own number is the better guide, especially for stirring." : "") + (m.measured < 0 ? " After is lighter than before: check the tare and the holdback." : "");
    renderLog();
  });
  $("m-clear").addEventListener("click", function () { log = []; S.store.set(LOG_KEY, log); $("m-result").textContent = "Log cleared."; renderLog(); });

  // ---------- init ----------
  $("label-slot").appendChild(S.label());
  buildDrinkSelect();
  setMethodTo(preset.method);
  renderTaskHeader();
  renderLog();
  renderTask(0);
  var rt = null;
  window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(update, 150); });
})();
