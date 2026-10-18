/* Service simulation UI. Depends on Sim, OpsMath, ServiceCards, ServiceCore. */
(function () {
  "use strict";
  var S = window.Sim, O = window.OpsMath, SC = window.ServiceCards, E = window.ServiceCore;
  var $ = function (id) { return document.getElementById(id); };
  var el = S.el;
  var CARDS = SC.CARDS;

  var INFO = {
    tutorial: { title: "Tutorial shift (08.5)", trains: "The controls and the order of work: glass → ice → ingredients → method → garnish → serve. Hints show the next step.",
      task: "5 tickets of 1–2 drinks (Daiquiri, Margarita, Negroni, Moscow Mule, Cuba Libre, Aperol Spritz). The next ticket arrives when you serve the last. Targets: accuracy 100%, average ticket time ≤ 90 s, waste 0%." },
    practice: { title: "Practice shift (08.5)", trains: "Overlapping tickets: oldest first with one quick win, pours in passes, slowest ice step first, bubbles and garnish last.",
      task: "12 tickets of 1–3 drinks from the twelve Module 5 drinks, one every 75 s whether you are ready or not. Targets: accuracy ≥ 90%, average ticket time ≤ 150 s, waste ≤ 5%. Fill in the service debrief afterwards." },
    rush: { title: "Friday rush (08.8)", trains: "A full rush: three waves, rounds of up to four, a server's table and bar guests at once, and a drink sent back.",
      task: "20 tickets in waves (6 in minutes 0–3, 6 in 3–10, 8 in 10–18); Module 5 drinks plus Tom Collins, Paloma, Cuba Libre, French 75, draught beer and house wine. One guest sends a correct drink back: remake it (waste, not an error). Targets: accuracy ≥ 90%, average ticket time ≤ 300 s, waste ≤ 5%. Play it through without restarting." },
    stockout: { title: "Stock-out shift (08.4)", trains: "Watching stock during service: ask early, fetch or squeeze, or 86 and offer a substitute; then count and order.",
      task: "15 tickets of 1–3 Module 5 drinks, one about every 70 s. Lime juice starts at 300 ml and runs out around ticket 6; the open Aperol (200 ml) around ticket 11, with a backup in the storeroom. Never serve a drink with a missing or quietly changed ingredient. After the last ticket, count six items and order par − on hand, rounded up. Targets: accuracy ≥ 90%, average ticket time ≤ 180 s, waste ≤ 5%, no missing or unapproved ingredient, order list 6/6." },
    exam: { title: "Simulated service exam (11.4)", trains: "The service part of the final assessment, under exam conditions: no hints, recipe cards hidden.",
      task: "20 tickets in three waves from the Module 5 drinks plus White Lady, Sidecar, Pisco Sour, French 75, Tom Collins, Paloma, Bloody Mary, Mai Tai, draught beer and house wine; one stock-out around ticket 8; one correct drink sent back. Score = accuracy − time penalty ((average − 300) ÷ 15 above 300 s, max 20) − waste penalty ((waste − 5) × 2 above 5%, max 20), rounded; minimum 70. Write down the seed; the first complete run counts." }
  };

  var preset = S.preset(Object.keys(E.PRESETS), "practice");
  var seed = S.seed();
  var st, P, selected = [], openCards = [];

  function clear(n) { while (n.firstChild) n.removeChild(n.firstChild); return n; }
  function mmss(s) { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2); }

  function renderTask() {
    var i = INFO[preset], c = clear($("task-card"));
    c.appendChild(el("h2", { text: i.title }));
    c.appendChild(el("p", {}, [el("strong", { text: "What it trains: " }), i.trains]));
    c.appendChild(el("p", {}, [el("strong", { text: "Task: " }), i.task]));
    c.appendChild(el("p", { class: "muted small", text: "Seed " + seed + " (add &seed=" + seed + " to the address to replay this shift). Recipe specs follow the course cards (IBA, Modules 5 and 6)." }));
  }

  function fillSelects() {
    var g = clear($("a-glass"));
    SC.GLASSES.forEach(function (x) { g.appendChild(el("option", { value: x[0], text: x[1] })); });
    var b = clear($("a-bottle"));
    var og1 = el("optgroup", { label: "Bottles, juices, syrups (ml)" }), og2 = el("optgroup", { label: "Portions (dash, cube, leaves, pinch)" });
    SC.BOTTLES.forEach(function (x) { if (x[2] === "pour") og1.appendChild(el("option", { value: x[0], text: x[1] })); else if (x[2] === "add") og2.appendChild(el("option", { value: x[0], text: x[1] })); });
    b.appendChild(og1); b.appendChild(og2);
    var t = clear($("a-top"));
    SC.TOPS.forEach(function (k) { t.appendChild(el("option", { value: k, text: E.bottleName(k) })); });
    var gr = clear($("a-garnish"));
    SC.GARNISHES.forEach(function (x) { gr.appendChild(el("option", { value: x[0], text: x[1] })); });
    b.addEventListener("change", function () { $("a-ml").disabled = SC.KIND[b.value] === "add"; });
  }

  function newShift(s) {
    seed = s; st = E.createShift(preset, seed); P = st.p; selected = [];
    $("game").hidden = false; $("debrief").hidden = true;
    renderTask(); render();
    say("Shift started. " + (preset === "tutorial" ? "Select the drink, then follow the hint." : "Tickets arrive on the shift clock."), "ok");
  }

  function say(text, kind) { var m = $("msg"); m.textContent = text || ""; m.className = "msg " + (kind || ""); }

  function doAct(a) {
    var r = E.act(st, a);
    if (!r.ok) { say(r.msg, "err"); return; }
    say(r.msg + (r.dt ? " (+" + r.dt + " s)" : ""), "ok");
    selected = selected.filter(function (id) { var s = st.slots[id]; return s && !s.result; });
    if (st.done) { showDebrief(); return; }
    render();
  }

  // ---------- render ----------
  function render() {
    renderStatus(); renderTickets(); renderSide(); renderChips(); renderHint();
    $("sel-summary").textContent = selected.length ? "· " + selected.length + " selected" : "· select drinks below";
  }

  function renderStatus() {
    var b = clear($("status"));
    var served = st.tickets.filter(function (t) { return t.servedAt !== null; }).length;
    var nt = E.nextEventTime(st);
    b.appendChild(el("span", { class: "clock", text: mmss(st.now) }));
    b.appendChild(el("span", { text: "Served " + served + " / " + st.tickets.length }));
    b.appendChild(el("span", { class: "muted", text: nt !== null ? "next ticket or delivery in " + (nt - st.now) + " s" : P.arrivals.mode === "onServe" && served < st.tickets.length ? "next ticket when you serve" : "no more tickets coming" }));
    b.appendChild(el("span", { class: "sp" }));
    b.appendChild(el("button", { type: "button", class: "secondary", text: "Wait 10 s", onclick: function () { doAct({ type: "wait", seconds: 10 }); } }));
    var wn = el("button", { type: "button", class: "secondary", text: "Wait for next", onclick: function () { doAct({ type: "waitNext" }); } });
    if (nt === null) wn.disabled = true;
    b.appendChild(wn);
  }

  function contentText(o) {
    return Object.keys(o).map(function (k) {
      var kind = SC.KIND[k], v = o[k];
      if (k === "beer" || k === "wine") return E.bottleName(k);
      return E.bottleName(k).replace(/ \(.*\)$/, "") + (kind === "add" ? (v.n > 1 ? " ×" + v.n : "") : " " + Math.round(v.ml * 10) / 10 + " ml");
    }).join(", ");
  }

  function slotStatus(s) {
    var parts = [];
    parts.push(s.glass ? "glass: " + E.glassName(s.glass) : "no glass");
    if (s.ice !== "none") parts.push("ice: " + s.ice);
    if (s.vessel) parts.push((s.usedVessel === "tin" ? "tin " : "mixing glass ") + s.vessel + (Object.keys(s.vc).length ? " [" + contentText(s.vc) + "]" : " [empty]"));
    if (Object.keys(s.gc).length) parts.push("in glass [" + contentText(s.gc) + "]");
    var m = [];
    if (s.muddled) m.push("muddled"); if (s.shaken) m.push("shaken"); if (s.stirred) m.push("stirred"); if (s.stirredGlass) m.push("stirred in glass"); if (s.strained) m.push("strained");
    if (m.length) parts.push(m.join(", "));
    if (s.garnish) parts.push("garnish: " + E.garnishName(s.garnish));
    if (s.lastStep !== null) parts.push("last step " + (st.now - s.lastStep) + " s ago");
    return parts.join(" · ");
  }

  function cardSpec(id) {
    var c = CARDS[id];
    if (c.method === "beer" || c.method === "wine") return el("div", { class: "cardspec" }, [c.name + ": " + E.glassName(c.glass[0]) + ", " + c.amountText + "."]);
    var ul = el("ul");
    c.items.forEach(function (it) { ul.appendChild(el("li", { text: it.item + ": " + it.amount + (it.kind === "top" ? " (top)" : "") + (it.optional ? " (optional)" : "") })); });
    var method = c.method === "shake" ? "shake in a tin, strain" : c.method === "stir" ? "stir in a mixing glass, strain" : "build in the glass" + (c.stirInGlass ? ", stir in the glass" : "");
    if (c.muddle) method = "muddle; " + method;
    return el("div", { class: "cardspec" }, [el("strong", { text: c.name }), " · " + c.glass.map(E.glassName).join(" or ") + " · ice: " + c.ice + " · " + method + " · garnish: " + c.garnish.map(E.garnishName).join(" or "), ul]);
  }

  function outItems(drinkId) { return Object.keys(st.stock).filter(function (k) { return E.usesKey(drinkId, k) && st.stock[k].level < E.usesKey(drinkId, k); }); }

  function renderTickets() {
    var box = clear($("tickets"));
    var open = E.openTickets(st).sort(function (a, b) { return a.arrival - b.arrival || (a.id > b.id ? 1 : -1); });
    if (!open.length) box.appendChild(el("div", { class: "card muted", text: "No open tickets. Use “Wait for next” to move the clock to the next ticket." }));
    open.forEach(function (t) {
      var age = st.now - t.arrival;
      var card = el("div", { class: "ticket" + (t.remake ? " remake" : age > (P.targets.avgTime || 150) ? " old" : "") });
      var head = el("div", { class: "ticket-head" }, [
        el("span", { class: "t", text: t.remake ? "Remake" : "Ticket #" + t.id }), el("span", { class: "pill", text: t.source }),
        el("span", { class: age > 120 ? "warn" : "muted", text: "waiting " + age + " s" }), el("span", { class: "sp" }),
        el("button", { type: "button", class: "secondary", text: "Select all", onclick: function () { t.slots.forEach(function (id) { if (selected.indexOf(id) < 0) selected.push(id); }); render(); } }),
        el("button", { type: "button", text: "Serve " + (t.remake ? "remake" : "#" + t.id), onclick: function () { doAct({ type: "serve", ticket: t.id }); } })
      ]);
      card.appendChild(head);
      if (t.note) card.appendChild(el("p", { class: "small", text: t.note }));
      t.slots.forEach(function (id, k) {
        var s = st.slots[id], c = CARDS[s.drink];
        var cbId = "cb-" + id;
        var cb = el("input", { type: "checkbox", id: cbId });
        cb.checked = selected.indexOf(id) >= 0;
        cb.addEventListener("change", function () { if (cb.checked) { if (selected.indexOf(id) < 0) selected.push(id); } else selected = selected.filter(function (x) { return x !== id; }); render(); var n = $(cbId); if (n) n.focus(); });
        var tools = el("div", { class: "tools" }), spec = null;
        if (P.cards) {
          var show = el("button", { type: "button", text: "Card", "aria-expanded": "false" });
          spec = cardSpec(s.drink); spec.hidden = openCards.indexOf(id) < 0;
          show.setAttribute("aria-expanded", String(!spec.hidden));
          show.addEventListener("click", function () {
            spec.hidden = !spec.hidden; show.setAttribute("aria-expanded", String(!spec.hidden));
            if (spec.hidden) openCards = openCards.filter(function (x) { return x !== id; }); else openCards.push(id);
          });
          tools.appendChild(show);
        }
        tools.appendChild(el("button", { type: "button", text: "Bin", onclick: function () { doAct({ type: "bin", slots: [id] }); } }));
        var outs = outItems(s.drink);
        if (outs.length) {
          var sub = el("select", { "aria-label": "Substitute for " + c.name });
          P.menu.filter(function (d) { return d !== s.drink && !outItems(d).length; }).forEach(function (d) { sub.appendChild(el("option", { value: d, text: CARDS[d].name })); });
          tools.appendChild(el("span", { class: "warn small", text: st.stock[outs[0]].label + " is out:" }));
          tools.appendChild(sub);
          tools.appendChild(el("button", { type: "button", text: "86 it, offer substitute", onclick: function () { doAct({ type: "eightySix", slot: id, sub: sub.value }); } }));
        }
        var right = el("div", {}, [el("label", { for: cbId, class: "name", text: (k + 1) + ". " + c.name + (s.sub ? " (substitute for " + CARDS[s.ordered].name + ")" : "") }),
          el("div", { class: "stat", text: slotStatus(s) }), tools, spec]);
        card.appendChild(el("div", { class: "slot" + (cb.checked ? " selected" : "") }, [cb, right]));
      });
      box.appendChild(card);
    });
  }

  function renderSide() {
    var sb = clear($("stock"));
    sb.appendChild(el("h2", { text: "Stock" }));
    var keys = Object.keys(st.stock).filter(function (k) { return preset !== "stockout" || ["lime", "aperol"].indexOf(k) >= 0 || st.stock[k].level < 150; });
    if (!keys.length) sb.appendChild(el("p", { class: "muted small", text: "Plenty of everything at the station in this shift." }));
    keys.forEach(function (k) {
      var sk = st.stock[k];
      var pctFull = Math.max(0, Math.min(100, sk.level / sk.bottleMl * 100));
      var low = sk.level <= sk.warnAt, out = sk.level < 5;
      var row = el("div", { class: "stockrow" }, [
        el("div", {}, [el("strong", { text: sk.label }), " " + Math.max(0, Math.round(sk.level)) + " ml" + (sk.juice ? "" : " · storeroom: " + sk.storeroom + " bottle" + (sk.storeroom === 1 ? "" : "s")),
          out ? el("span", { class: "bad", text: " · OUT" }) : low ? el("span", { class: "warn", text: " · running low" }) : null,
          sk.pending ? el("span", { class: "muted", text: " · barback arriving in " + (sk.pending - st.now) + " s" }) : null]),
        el("div", { class: "bar" + (out ? " out" : low ? " low" : "") }, [el("span", { style: "width:" + pctFull + "%" })])
      ]);
      var btns = el("div", { class: "btns" });
      btns.appendChild(el("button", { type: "button", class: "secondary", text: "Ask barback (3 s)", onclick: function () { doAct({ type: "barback", key: k }); } }));
      if (sk.juice) btns.appendChild(el("button", { type: "button", class: "secondary", text: "Squeeze it yourself (90 s)", onclick: function () { doAct({ type: "squeeze", key: k }); } }));
      else btns.appendChild(el("button", { type: "button", class: "secondary", text: "Fetch from storeroom (45 s)", onclick: function () { doAct({ type: "fetch", key: k }); } }));
      row.appendChild(btns);
      sb.appendChild(row);
    });
    var stn = clear($("station"));
    stn.appendChild(el("h2", { text: "Station" }));
    stn.appendChild(el("p", { class: "small", text: st.vessels.map(function (v) { return v.id + " " + (v.state === "inuse" ? "in use" : v.state === "dirty" ? "needs rinse" : "clean"); }).join(" · ") }));
    stn.appendChild(el("p", { class: "muted small", text: "T = tin, M = mixing glass. A dirty one is rinsed automatically (3 s) when you need it." }));
    var lg = clear($("log"));
    lg.appendChild(el("h2", { text: "Shift log" }));
    var ol = el("ol");
    st.log.slice(0, 14).forEach(function (x) { ol.appendChild(el("li", { text: mmss(x.t) + " " + x.msg + (x.dt ? " (+" + x.dt + " s)" : "") })); });
    lg.appendChild(ol);
  }

  function renderChips() {
    var box = clear($("chips"));
    if (!P.cards || !selected.length) return;
    var s = st.slots[selected[0]]; if (!s) return;
    var c = CARDS[s.drink];
    box.appendChild(el("span", { class: "muted small", text: c.name + " card: " }));
    if (c.method === "beer" || c.method === "wine") { box.appendChild(el("span", { class: "small", text: c.amountText })); return; }
    c.items.forEach(function (it) {
      box.appendChild(el("button", { type: "button", text: it.item + " " + it.amount, onclick: function () {
        var k = it.keys[0];
        if (it.kind === "top") { $("a-top").value = k; }
        else { $("a-bottle").value = k; $("a-ml").disabled = it.kind === "add"; if (it.kind === "pour") $("a-ml").value = it.checkMl || it.ml; }
      } }));
    });
  }

  function renderHint() {
    var h = $("hint");
    if (!P.hints) { h.textContent = ""; return; }
    var open = E.openTickets(st).sort(function (x, y) { return x.arrival - y.arrival; });
    if (!open.length) { h.textContent = "Hint: press “Wait for next”."; return; }
    var t = selected.length ? E.ticketById(st, st.slots[selected[0]].ticket) : open[0];
    h.textContent = "Hint for " + (t.remake ? "the remake" : "ticket #" + t.id) + ": " + E.ticketHint(st, t.id) + (selected.length ? "" : " Tick the drinks to select them (or Select all).");
  }

  // ---------- action buttons ----------
  function wire() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-act]"), function (b) {
      b.addEventListener("click", function () {
        var a = b.getAttribute("data-act"), sl = selected.slice();
        switch (a) {
          case "glass": return doAct({ type: "glass", slots: sl, glass: $("a-glass").value });
          case "ice-cubes": return doAct({ type: "ice", slots: sl, ice: "cubes" });
          case "ice-crushed": return doAct({ type: "ice", slots: sl, ice: "crushed" });
          case "tin": return doAct({ type: "vessel", slots: sl, vessel: "tin" });
          case "mix": return doAct({ type: "vessel", slots: sl, vessel: "mix" });
          case "pour": return doAct({ type: "pour", slots: sl, key: $("a-bottle").value, ml: parseFloat($("a-ml").value) });
          case "top": return doAct({ type: "top", slots: sl, key: $("a-top").value });
          case "garnish": return doAct({ type: "garnish", slots: sl, garnish: $("a-garnish").value });
          case "clear": selected = []; render(); return;
          default: return doAct({ type: a, slots: sl });
        }
      });
    });
  }

  // ---------- debrief ----------
  function showDebrief() {
    $("game").hidden = true;
    var d = $("debrief"); d.hidden = false; clear(d);
    var m = E.metrics(st), t = P.targets;
    var card = el("section", { class: "card" });
    card.appendChild(el("h2", { text: "End of shift: debrief" }));
    var k = el("div", { class: "kpis" });
    function kpi(label, v, f, good) { k.appendChild(el("div", { class: "kpi" }, [el("div", { class: "muted", text: label }), el("div", { class: "v " + (good === undefined ? "" : good ? "good" : "bad"), text: v }), f ? el("div", { class: "f", text: f }) : null])); }
    kpi("Accuracy", m.accuracy.toFixed(1) + "%", m.correct + " correct of " + m.ordered + " drinks ordered · target ≥ " + t.accuracy + "%", P.exam ? undefined : m.targets.accuracy);
    kpi("Average ticket time", Math.round(m.avgTime) + " s", "arrival to serve, " + m.served + " tickets · target ≤ " + t.avgTime + " s", P.exam ? undefined : m.targets.avgTime);
    kpi("Waste", m.waste.toFixed(1) + "%", Math.round(m.wasteMl) + " ml of " + Math.round(m.pouredMl) + " ml poured · target ≤ " + t.waste + "%", P.exam ? undefined : m.targets.waste);
    kpi("Shift length", mmss(m.shiftSeconds), "shift clock at the last serve");
    card.appendChild(k);
    if (P.exam) {
      var x = m.exam;
      card.appendChild(el("h3", { text: "Exam score (lesson 11.4)" }));
      var tb = el("table");
      [["Accuracy", m.accuracy.toFixed(1)], ["Time penalty: (" + Math.round(m.avgTime) + " − 300) ÷ 15 if above 300 s, max 20", "− " + x.timePenalty.toFixed(1)],
        ["Waste penalty: (" + m.waste.toFixed(1) + " − 5) × 2 if above 5%, max 20", "− " + x.wastePenalty.toFixed(1)], ["Service score (rounded, never below 0)", String(x.score)]].forEach(function (r, i) {
        tb.appendChild(el("tr", { class: i === 3 ? "total" : "" }, [el("td", { text: r[0] }), el("td", { class: "num", text: r[1] })]));
      });
      card.appendChild(el("div", { class: "table-wrap" }, [tb]));
      card.appendChild(el("p", { class: "verdict " + (x.pass ? "good" : "bad"), text: x.pass ? "Minimum (70) met." : "Below the minimum of 70: remediate and retake with a new seed." }));
    }
    // incorrect drinks
    card.appendChild(el("h3", { text: "Incorrect drinks" }));
    var bad = [];
    st.tickets.forEach(function (tk) { tk.slots.forEach(function (id) { var s = st.slots[id]; if (s.result && !s.result.correct) bad.push("Ticket #" + tk.id + " " + CARDS[s.drink].name + ": " + s.result.problems.join("; ")); }); });
    if (bad.length) { var ul = el("ul"); bad.forEach(function (b) { ul.appendChild(el("li", { text: b })); }); card.appendChild(ul); }
    else card.appendChild(el("p", { class: "good", text: "None: every drink matched its card and was served on time." }));
    // slowest tickets
    var times = st.tickets.map(function (tk) { return { id: tk.id, time: tk.servedAt - tk.arrival, n: tk.drinks.length }; }).sort(function (a, b) { return b.time - a.time; });
    card.appendChild(el("h3", { text: "Slowest tickets" }));
    card.appendChild(el("p", { text: times.slice(0, 3).map(function (x) { return "#" + x.id + " (" + x.n + " drink" + (x.n > 1 ? "s" : "") + "): " + x.time + " s"; }).join(" · ") + ". Was the time spent waiting in the queue (a decision problem) or working on the ticket (a sequence problem)?" }));
    // waste
    card.appendChild(el("h3", { text: "Waste" }));
    card.appendChild(el("p", { text: "Binned " + Math.round(st.waste.binned) + " ml · dead drinks " + Math.round(st.waste.dead) + " ml · remade (sent back) " + Math.round(st.waste.remade) + " ml. Waste % = ml binned, dead and remade ÷ all ml poured × 100." }));
    if (st.remake) card.appendChild(el("p", { class: "muted", text: st.remake.note + " Remake served at " + mmss(st.remake.servedAt) + "." }));
    // stock
    if (Object.keys(st.stock).length) {
      card.appendChild(el("h3", { text: "Stock" }));
      card.appendChild(el("p", { text: Object.keys(st.stock).filter(function (kk) { return ["lime", "aperol", "gingerbeer"].indexOf(kk) >= 0; }).map(function (kk) { var sk = st.stock[kk]; return sk.label + ": started " + Math.round(sk.start) + " ml" + (sk.eightySixed ? ", 86'd at least once" : ""); }).join(" · ") }));
      if (preset === "stockout" || P.exam) card.appendChild(el("p", { class: m.missingOrUnapproved ? "bad" : "good", text: "Drinks served with a missing or unapproved ingredient: " + m.missingOrUnapproved + (preset === "stockout" ? " (target 0)" : "") }));
    }
    // consumption table
    var used = Object.keys(st.usage).sort(function (a, b) { return st.usage[b] - st.usage[a]; });
    var ct = el("table");
    ct.appendChild(el("thead", {}, [el("tr", {}, [el("th", { text: "Product" }), el("th", { class: "num", text: "Poured (ml)" })])]));
    var cb = el("tbody");
    used.forEach(function (u) { cb.appendChild(el("tr", {}, [el("td", { text: E.bottleName(u) }), el("td", { class: "num", text: String(Math.round(st.usage[u] * 10) / 10) })])); });
    ct.appendChild(cb);
    card.appendChild(el("details", {}, [el("summary", { text: "Inventory consumption (everything poured, including waste)" }), el("div", { class: "table-wrap" }, [ct])]));
    var lg = el("ol"); st.log.slice().reverse().forEach(function (x) { lg.appendChild(el("li", { text: mmss(x.t) + " " + x.msg + (x.dt ? " (+" + x.dt + " s)" : "") })); });
    card.appendChild(el("details", {}, [el("summary", { text: "Full shift log" }), lg]));
    d.appendChild(card);

    var orderScoreText = "";
    if (preset === "stockout") d.appendChild(orderCard(function (txt) { orderScoreText = txt; refreshCopy(); }));

    var copyCard = el("section", { class: "card" });
    var pre = el("pre", { class: "copy" }), msg = el("p", { class: "muted", "aria-live": "polite" });
    function refreshCopy() { pre.textContent = E.copyText(st, m, new Date().toISOString().slice(0, 10), orderScoreText); }
    refreshCopy();
    copyCard.appendChild(el("h3", { text: "Copy results (service debrief / exam score sheet)" }));
    copyCard.appendChild(pre);
    var rows = [["ticket", "source", "arrival_s", "served_s", "ticket_time_s", "drink", "correct", "problems"]];
    st.tickets.forEach(function (tk) { tk.slots.forEach(function (id) { var s = st.slots[id]; rows.push([tk.id, tk.source, tk.arrival, tk.servedAt, tk.servedAt - tk.arrival, CARDS[s.drink].name, s.result.correct ? "yes" : "no", s.result.problems.join("; ")]); }); });
    var csv = S.csvLink(rows, "service-shift-" + preset + "-" + seed + ".csv", "Download tickets CSV"); csv.className = "button-link";
    copyCard.appendChild(el("div", { class: "actions" }, [
      el("button", { type: "button", text: "Copy results", onclick: function () {
        function fb() { var r = document.createRange(); r.selectNodeContents(pre); var s = window.getSelection(); s.removeAllRanges(); s.addRange(r); msg.textContent = "Selected: press Ctrl+C (Cmd+C on a Mac) to copy."; }
        try { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(pre.textContent).then(function () { msg.textContent = "Copied."; }, fb); else fb(); } catch (e) { fb(); }
      } }), csv,
      el("button", { type: "button", class: "secondary", text: "New shift (new seed)", onclick: function () { newShift(Math.floor(Math.random() * 1e9)); } }),
      el("button", { type: "button", class: "secondary", text: "Same shift again (seed " + seed + ")", onclick: function () { newShift(seed); } })
    ]));
    copyCard.appendChild(msg);
    if (P.exam) copyCard.appendChild(el("p", { class: "muted small", text: "Exam conditions: the first complete run counts; a retake after remediation uses a new seed." }));
    d.appendChild(copyCard);
    d.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function orderCard(onScore) {
    var sheet = E.countSheet(st);
    var c = el("section", { class: "card" });
    c.appendChild(el("h2", { text: "End-of-shift count and order" }));
    c.appendChild(el("p", { text: "Your count (bottles, tenths for the open bottle, plus full bottles in the storeroom). Order = par − on hand, rounded up to whole bottles (0 if negative)." }));
    var grid = el("div", { class: "order-grid" });
    sheet.forEach(function (x, i) {
      grid.appendChild(el("div", {}, [el("label", { for: "ord-" + i, text: x.label + ": par " + x.par + ", on hand " + x.onHand }), el("input", { id: "ord-" + i, type: "number", min: "0", step: "1" })]));
    });
    c.appendChild(grid);
    var out = el("p", { "aria-live": "polite" });
    c.appendChild(el("div", { class: "actions" }, [el("button", { type: "button", text: "Check my order list", onclick: function () {
      var right = 0, notes = [];
      sheet.forEach(function (x, i) { var v = parseInt($("ord-" + i).value, 10); if (v === x.order) right++; else notes.push(x.label + ": " + x.par + " − " + x.onHand + " = " + O.round(x.par - x.onHand, 1) + " → " + x.order); });
      out.className = right === sheet.length ? "good" : "bad";
      out.textContent = "Order list " + right + "/" + sheet.length + (notes.length ? ". Correct: " + notes.join("; ") : ". All correct.");
      onScore(right + "/" + sheet.length);
    } })]));
    c.appendChild(out);
    return c;
  }

  $("label-slot").appendChild(S.label());
  fillSelects(); wire();
  newShift(seed);
})();
