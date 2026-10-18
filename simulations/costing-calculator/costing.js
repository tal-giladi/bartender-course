/* Costing calculator UI. Depends on Sim, BarMath, OpsMath, CostingData, CostingCore. */
(function () {
  "use strict";
  var S = window.Sim, B = window.BarMath, O = window.OpsMath, D = window.CostingData, C = window.CostingCore;
  var $ = function (id) { return document.getElementById(id); };
  var el = S.el;
  var VATR = O.VAT;

  function m2(x) { return isFinite(x) ? x.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—"; }
  function m4(x) { return isFinite(x) ? x.toFixed(4) : "—"; }
  function pct(x, d) { return isFinite(x) ? (x * 100).toFixed(d === undefined ? 1 : d) + "%" : "—"; }
  function int(x) { return isFinite(x) ? Math.round(x).toLocaleString("en-US") : "—"; }
  function n(v) { var x = parseFloat(String(v).replace(",", ".")); return isFinite(x) ? x : NaN; }
  function kpi(label, value, formula, cls) {
    return el("div", { class: "kpi" }, [el("div", { class: "muted", text: label }), el("div", { class: "v " + (cls || ""), text: value }), formula ? el("div", { class: "f", text: formula }) : null]);
  }
  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); return node; }
  function input(attrs, onInput) { var i = el("input", attrs); if (onInput) i.addEventListener("input", onInput); return i; }
  function th(t, cls) { return el("th", { class: cls || "", text: t }); }
  function td(t, cls) { return el("td", { class: cls || "", text: t === undefined ? "" : String(t) }); }
  function copyBlock(pre, msg) {
    var txt = pre.textContent;
    function fallback() {
      var r = document.createRange(); r.selectNodeContents(pre);
      var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      msg.textContent = "Selected: press Ctrl+C (Cmd+C on a Mac) to copy.";
    }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(function () { msg.textContent = "Copied."; }, fallback);
      else fallback();
    } catch (e) { fallback(); }
  }

  // ---------- presets ----------
  var PRESETS = {
    single: { tab: "single", title: "One drink: cost, price, pour cost",
      trains: "Cost per serving from a price list with VAT removed and waste allowances (10.1), then price for a target pour cost with VAT and rounding, pour cost, gross profit, margin and markup (10.2).",
      task: "The Daiquiri house spec is loaded (white rum 60 ml, lime juice 20 ml, 1:1 syrup 15 ml). Target: cost per serving 9.66 ILS; at a 20% target with VAT 18% and rounding to 2 ILS the price is 58, pour cost 19.7%, gross profit 39.49, margin 80.3%, markup 409%. Then replace the lime line with your own yield and price, switch VAT off and on, try a 25% target and rounding steps of 1 and 5 ILS." },
    yield: { tab: "yield", title: "Bottle and produce yield",
      trains: "Servings per bottle after a waste allowance, and the cost of a ml of juice from fruit bought by the kg (10.1).",
      task: "For a 700 ml bottle change the pour (30, 45, 60 ml) and the waste (0%, 3%, 10%). Targets: 700 ml at 45 ml and 3% → 15 servings; 0% → 15, 10% → 14; at 30 ml 0% → 23, 10% → 21; 750 ml at 60 ml, 3% → 12. Lime juice at 6.90 per 350 g and 300 ml/kg → 0.0557 ILS per ml. Then enter your own lemon test." },
    menu: { tab: "menu", title: "Whole menu",
      trains: "Costing and pricing a 14-drink menu, sales-weighted menu pour cost and average gross profit, and menu engineering (10.4, 10.5).",
      task: "The course example menu is loaded with the price list, VAT on, target 20%, rounding 2 ILS, the example's final prices and the week's sales mix. Target: formula prices match the solution (Daiquiri 58 … Mai Tai 98), menu pour cost 21.1%, average gross profit 37.62 ILS. Then enter your own drinks, prices and sales and export the CSV." },
    variance: { tab: "variance", title: "Inventory variance",
      trains: "Theoretical vs actual usage, variance in ml, % and ILS, unexplained variance after the waste log, and flags at ±3% (10.3).",
      task: "The 10.3 worksheet's five items are loaded. Compare with your worksheet. Target: variance 110 / 300 / 60 / −200 / 120 ml; flags on white rum, Aperol and gin; total variance value 61.06 ILS; theoretical cost 2,139.74 → actual 2,200.80." },
    exam: { tab: "exam", title: "Final assignment (11.6)",
      trains: "The costing and operations part of the final assessment: costs, prices, menu-wide check, reconciliation and order list on new data.",
      task: "Work from the brief (labs/module-11/costing-exam-brief.md) and the data below, then enter parts A–E and mark them: 36 points with the brief's tolerances. Add your part F (0–4) for a score out of 40. Minimum 70% (28 points). A retake uses a new seed, which changes the sales and stock counts." }
  };
  var presetKey = S.preset(Object.keys(PRESETS), "single");

  function renderTask() {
    var p = PRESETS[presetKey];
    var c = clear($("task-card"));
    c.appendChild(el("h2", { text: p.title }));
    c.appendChild(el("p", {}, [el("strong", { text: "What it trains: " }), p.trains]));
    c.appendChild(el("p", {}, [el("strong", { text: "Task: " }), p.task]));
  }

  function showTab(t) {
    Array.prototype.forEach.call(document.querySelectorAll(".tab"), function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-tab") === t)); });
    Array.prototype.forEach.call(document.querySelectorAll(".panel"), function (p) { p.hidden = p.id !== "panel-" + t; });
    if (PRESETS[t]) { presetKey = t; renderTask(); }
  }

  // ---------- ONE DRINK ----------
  var PRICES = C.index(D.PRICE_LIST);
  var QUNITS = [["ml", "ml"], ["cl", "cl"], ["oz", "oz (30 ml)"], ["dash", "dash (0.8 ml)"], ["barspoon", "barspoon (5 ml)"]];
  function lineFromKey(key, qty) {
    var p = PRICES[key];
    return { name: p.item, price: p.price, size: p.size, unit: p.unit, yieldMl: p.yieldMlPerKg || 300, qty: qty, qunit: p.unit === "pieces" ? "pieces" : "ml", waste: Math.round(p.waste * 100) };
  }
  function daiquiri() { return D.MENU[0].lines.map(function (l) { return lineFromKey(l[0], l[1]); }); }
  var sg = { lines: daiquiri() };

  function qtyMl(l) {
    var v = n(l.qty);
    if (l.qunit === "pieces" || l.qunit === "ml") return v;
    if (l.qunit === "oz") return v * B.BAR_OZ_ML;
    return B.toMl(v, l.qunit);
  }
  function sgLineCalc(l) {
    if (l.other) return { cpu: NaN, cost: n(l.unitCost) || 0 };
    var cpu = O.unitCost({ price: n(l.price), vatIncluded: $("sg-vat-buy").checked, size: n(l.size), unit: l.unit, yieldMlPerKg: n(l.yieldMl) });
    return { cpu: cpu, cost: O.lineCost(qtyMl(l), cpu, (n(l.waste) || 0) / 100) };
  }

  function sgRows() {
    var tb = clear($("sg-rows"));
    sg.lines.forEach(function (l, i) {
      var tr = el("tr");
      var nameIn = input({ type: "text", value: l.name, "aria-label": "Ingredient " + (i + 1) }, function () { l.name = this.value; sgUpdate(); });
      tr.appendChild(el("td", { class: "name" }, [nameIn]));
      if (l.other) {
        tr.appendChild(el("td", { colspan: "7", class: "muted", text: "Garnish or other: a fixed cost per serving, ex VAT" }));
        tr.appendChild(el("td", {}, [input({ type: "number", step: "0.01", min: "0", value: l.unitCost, "aria-label": "Unit cost ex VAT" }, function () { l.unitCost = this.value; sgUpdate(); })]));
      } else {
        tr.appendChild(el("td", {}, [input({ type: "number", step: "0.01", min: "0", value: l.price, "aria-label": "Package price" }, function () { l.price = this.value; sgUpdate(); })]));
        tr.appendChild(el("td", {}, [input({ type: "number", step: "any", min: "0", value: l.size, "aria-label": "Package size" }, function () { l.size = this.value; sgUpdate(); })]));
        var us = el("select", { "aria-label": "Bought as" });
        [["ml", "ml (bottle, syrup)"], ["kg", "kg of fruit"], ["pieces", "pieces"]].forEach(function (o) { us.appendChild(el("option", { value: o[0], text: o[1] })); });
        us.value = l.unit;
        us.addEventListener("change", function () { l.unit = this.value; l.qunit = l.unit === "pieces" ? "pieces" : "ml"; sgRows(); sgUpdate(); });
        tr.appendChild(el("td", {}, [us]));
        var y = input({ type: "number", step: "1", min: "1", value: l.yieldMl, "aria-label": "Juice yield ml per kg" }, function () { l.yieldMl = this.value; sgUpdate(); });
        y.disabled = l.unit !== "kg";
        tr.appendChild(el("td", {}, [y]));
        tr.appendChild(el("td", {}, [input({ type: "number", step: "any", min: "0", value: l.qty, "aria-label": "Quantity" }, function () { l.qty = this.value; sgUpdate(); })]));
        var qu = el("select", { "aria-label": "Quantity unit" });
        if (l.unit === "pieces") qu.appendChild(el("option", { value: "pieces", text: "pieces" }));
        else QUNITS.forEach(function (o) { qu.appendChild(el("option", { value: o[0], text: o[1] })); });
        qu.value = l.qunit;
        qu.addEventListener("change", function () { l.qunit = this.value; sgUpdate(); });
        tr.appendChild(el("td", {}, [qu]));
        tr.appendChild(el("td", {}, [input({ type: "number", step: "1", min: "0", max: "90", value: l.waste, "aria-label": "Waste percent" }, function () { l.waste = this.value; sgUpdate(); })]));
        tr.appendChild(el("td", { class: "num cpu" }));
      }
      tr.appendChild(el("td", { class: "num lc" }));
      tr.appendChild(el("td", {}, [el("button", { type: "button", class: "rm", "aria-label": "Remove line " + (i + 1), text: "✕", onclick: function () { sg.lines.splice(i, 1); sgRows(); sgUpdate(); } })]));
      tb.appendChild(tr);
    });
  }

  function sgUpdate() {
    var rows = $("sg-rows").children, total = 0, parts = [];
    sg.lines.forEach(function (l, i) {
      var c = sgLineCalc(l);
      total += c.cost;
      var cpuCell = rows[i] && rows[i].querySelector(".cpu");
      if (cpuCell) cpuCell.textContent = m4(c.cpu) + (l.unit === "kg" ? " /ml juice" : l.unit === "pieces" ? " /piece" : " /ml");
      if (rows[i]) rows[i].querySelector(".lc").textContent = m2(c.cost);
      parts.push(m2(c.cost));
    });
    var cost = O.round2(total);
    var vatOn = $("sg-vat-sell").checked, target = (n($("sg-target").value) || 20) / 100, roundTo = n($("sg-round").value) || 0;
    var formula = O.formulaPrice(cost, target, vatOn, roundTo);
    var priceIn = n($("sg-price").value);
    var price = isFinite(priceIn) && priceIn > 0 ? priceIn : formula;
    var pc = O.priceCheck(cost, price, vatOn);
    var out = clear($("sg-out"));
    var raw = cost / target;
    var grid = el("div", { class: "kpis" }, [
      kpi("Cost per serving", m2(cost) + " ILS", "Σ lines = " + parts.join(" + ")),
      kpi("Formula price", m2(formula) + " ILS", m2(cost) + " ÷ " + (target * 100) + "% = " + m2(raw) + (vatOn ? " × 1.18 = " + m2(raw * (1 + VATR)) : " (no VAT)") + (roundTo ? ", up to " + roundTo : "")),
      kpi("Menu price used", m2(price) + " ILS", isFinite(priceIn) && priceIn > 0 ? "your menu price" : "formula price"),
      kpi("Net price (ex VAT)", m2(pc.net) + " ILS", vatOn ? m2(price) + " ÷ 1.18" : "VAT off: net = price"),
      kpi("Pour cost", pct(pc.pourCost), m2(cost) + " ÷ " + m2(pc.net), pc.pourCost <= target + 1e-9 ? "ok-target" : "miss-target"),
      kpi("Gross profit", m2(pc.grossProfit) + " ILS", m2(pc.net) + " − " + m2(cost)),
      kpi("Margin", pct(pc.margin), "gross profit ÷ net price"),
      kpi("Markup", pct(pc.markup, 0), "gross profit ÷ cost")
    ]);
    out.appendChild(grid);
    if (!vatOn) out.appendChild(el("p", { class: "warn", text: "VAT off: this is the classic error if your menu prices in Israel include VAT. The pour cost above is " + pct(pc.pourCost) + "; with VAT it would be " + pct(O.priceCheck(cost, price, true).pourCost) + "." }));
    sg.cost = cost;
  }

  function sgInit() {
    var sel = $("sg-load");
    sel.appendChild(el("option", { value: "", text: "— choose a product —" }));
    D.PRICE_LIST.forEach(function (p) { sel.appendChild(el("option", { value: p.key, text: p.item + " · " + m2(p.price) + " ILS" })); });
    sel.addEventListener("change", function () { if (!this.value) return; sg.lines.push(lineFromKey(this.value, PRICES[this.value].unit === "pieces" ? 1 : 30)); this.value = ""; sgRows(); sgUpdate(); });
    $("sg-add").addEventListener("click", function () { sg.lines.push({ name: "new ingredient", price: 100, size: 700, unit: "ml", yieldMl: 300, qty: 30, qunit: "ml", waste: 3 }); sgRows(); sgUpdate(); });
    $("sg-add-other").addEventListener("click", function () { sg.lines.push({ name: "garnish", other: true, unitCost: 0.30 }); sgRows(); sgUpdate(); });
    $("sg-reset").addEventListener("click", function () { sg.lines = daiquiri(); $("sg-name").value = "Daiquiri"; $("sg-price").value = ""; $("sg-target").value = 20; $("sg-round").value = "2"; $("sg-vat-buy").checked = true; $("sg-vat-sell").checked = true; sgRows(); sgUpdate(); });
    ["sg-vat-buy", "sg-vat-sell", "sg-target", "sg-round", "sg-price"].forEach(function (id) { $(id).addEventListener("input", sgUpdate); $(id).addEventListener("change", sgUpdate); });
    $("sg-check").addEventListener("click", function () {
      var g = n($("sg-guess").value), o = $("sg-check-out");
      if (!isFinite(g)) { o.textContent = "Enter your answer first."; o.className = "warn"; return; }
      var d = Math.abs(g - sg.cost);
      o.className = d <= 0.05 ? "good" : "bad";
      o.textContent = d <= 0.05 ? "Within 0.05 ILS of the calculator (" + m2(sg.cost) + "). Well done." :
        "The calculator says " + m2(sg.cost) + " ILS (you are " + m2(d) + " away). Check: VAT divided by 1.18 (not × 0.82), waste divided by (1 − waste), cost per ml kept to 4 decimals.";
    });
    sgRows(); sgUpdate();
  }

  // ---------- YIELD ----------
  var FRUIT = { lime: [6.90, 0.35, 300], lemon: [12.90, 1, 300], grapefruit: [7.90, 1, 400] };
  function ydUpdate() {
    var bottle = n($("yd-bottle").value), pour = n($("yd-pour").value), w = n($("yd-waste").value) / 100, price = n($("yd-price").value);
    $("yd-waste-v").textContent = Math.round(w * 100);
    var usable = B.usableMl(bottle, w), serv = B.servingsPerBottle(bottle, pour, w);
    var ex = B.priceExVat(price, VATR);
    var out = clear($("yd-out"));
    out.appendChild(el("div", { class: "kpis" }, [
      kpi("Usable ml", m2(usable).replace(".00", ""), int(bottle) + " × (1 − " + Math.round(w * 100) + "%)"),
      kpi("Servings per bottle", String(serv), m2(usable) + " ÷ " + pour + " = " + (usable / pour).toFixed(2) + " → rounded down"),
      kpi("Bottle ex VAT", m2(ex) + " ILS", m2(price) + " ÷ 1.18"),
      kpi("Spirit cost per serving (check)", serv > 0 ? m2(ex / serv) + " ILS" : "—", m2(ex) + " ÷ " + serv + " servings")
    ]));
    var g = C.yieldGrid([700, 750, 1000], [30, 45, 60], [0, 0.03, 0.05, 0.10]);
    var t = el("table");
    t.appendChild(el("thead", {}, [el("tr", {}, [th("Bottle"), th("Pour"), th("0%", "num"), th("3%", "num"), th("5%", "num"), th("10%", "num")])]));
    var tb = el("tbody");
    g.forEach(function (b) { b.rows.forEach(function (r) {
      var tr = el("tr", {}, [td(b.bottle + " ml"), td(r.pour + " ml")].concat(r.servings.map(function (s) { return td(s, "num"); })));
      if (b.bottle === bottle && r.pour === pour) tr.className = "selected";
      tb.appendChild(tr);
    }); });
    t.appendChild(tb);
    clear($("yd-grid")).appendChild(t);
  }
  function pdUpdate() {
    var price = n($("pd-price").value), kg = n($("pd-kg").value), y = n($("pd-yield").value), q = n($("pd-qty").value), w = n($("pd-waste").value) / 100;
    var perKg = B.priceExVat(price / kg, VATR);
    var cpm = O.unitCost({ price: price, size: kg, unit: "kg", yieldMlPerKg: y });
    clear($("pd-out")).appendChild(el("div", { class: "kpis" }, [
      kpi("Price per kg ex VAT", m2(perKg) + " ILS", m2(price) + " ÷ " + kg + " kg ÷ 1.18"),
      kpi("Cost per ml of juice", m4(cpm) + " ILS", m2(perKg) + " ÷ " + y + " ml"),
      kpi("Juice line in the drink", m2(O.lineCost(q, cpm, w)) + " ILS", q + " × " + m4(cpm) + " ÷ (1 − " + Math.round(w * 100) + "%)")
    ]));
  }
  function ydInit() {
    ["yd-bottle", "yd-pour", "yd-waste", "yd-price"].forEach(function (id) { $(id).addEventListener("input", ydUpdate); });
    ["pd-price", "pd-kg", "pd-yield", "pd-qty", "pd-waste"].forEach(function (id) { $(id).addEventListener("input", pdUpdate); });
    Array.prototype.forEach.call(document.querySelectorAll("[data-bottle]"), function (b) { b.addEventListener("click", function () { $("yd-bottle").value = b.getAttribute("data-bottle"); ydUpdate(); }); });
    Array.prototype.forEach.call(document.querySelectorAll("[data-pour]"), function (b) { b.addEventListener("click", function () { $("yd-pour").value = b.getAttribute("data-pour"); ydUpdate(); }); });
    Array.prototype.forEach.call(document.querySelectorAll("[data-fruit]"), function (b) { b.addEventListener("click", function () {
      var f = FRUIT[b.getAttribute("data-fruit")]; $("pd-price").value = f[0]; $("pd-kg").value = f[1]; $("pd-yield").value = f[2]; pdUpdate(); }); });
    $("pd-use").addEventListener("click", function () {
      var g = n($("pd-g").value), ml = n($("pd-ml").value);
      if (!(g > 0) || !(ml >= 0)) return;
      $("pd-yield").value = Math.round(ml / g * 1000); pdUpdate();
    });
    ydUpdate(); pdUpdate();
  }

  // ---------- MENU ----------
  var mn = {};
  function mnReset() {
    mn.prices = C.clone(D.PRICE_LIST);
    mn.drinks = D.MENU.map(function (d) { return C.clone(d); });
    mn.edit = 0;
  }
  function mnIndex() { return C.index(mn.prices); }

  function plTable() {
    var t = clear($("pl-table"));
    t.appendChild(el("thead", {}, [el("tr", {}, [th("Product"), th("Price incl. VAT"), th("Size"), th("Unit"), th("Yield ml/kg"), th("Waste %"), th("Cost per unit", "num"), th("Source")])]));
    var tb = el("tbody");
    mn.prices.forEach(function (p) {
      var cpuCell = td("", "num");
      function upd() { cpuCell.textContent = m4(O.unitCost(p)); mnUpdate(); }
      var y = input({ type: "number", step: "1", value: p.yieldMlPerKg || "", "aria-label": p.item + " yield" }, function () { p.yieldMlPerKg = n(this.value); upd(); });
      y.disabled = p.unit !== "kg";
      tb.appendChild(el("tr", {}, [td(p.item),
        el("td", {}, [input({ type: "number", step: "0.01", value: p.price, "aria-label": p.item + " price" }, function () { p.price = n(this.value) || 0; upd(); })]),
        el("td", {}, [input({ type: "number", step: "any", value: p.size, "aria-label": p.item + " size" }, function () { p.size = n(this.value) || 1; upd(); })]),
        td(p.unit === "kg" ? "kg" : p.unit), el("td", {}, [y]),
        el("td", {}, [input({ type: "number", step: "1", value: Math.round(p.waste * 100), "aria-label": p.item + " waste" }, function () { p.waste = (n(this.value) || 0) / 100; upd(); })]),
        cpuCell, td(p.source, "muted")]));
      cpuCell.textContent = m4(O.unitCost(p));
    });
    t.appendChild(tb);
  }

  function mnCompute() {
    var idx = mnIndex(), vatOn = $("mn-vat").checked, target = (n($("mn-target").value) || 20) / 100, roundTo = n($("mn-round").value) || 0;
    var rows = mn.drinks.map(function (d) {
      var c = C.costDrink(d, idx, true);
      var pc = O.priceCheck(c.cost, d.final, vatOn);
      return { d: d, cost: c.cost, costing: c, formula: O.formulaPrice(c.cost, target, vatOn, roundTo), check: pc };
    });
    var sum = O.menuSummary(rows.map(function (r) { return { cost: r.cost, price: r.d.final, sold: r.d.sold }; }), vatOn);
    var avgPop = rows.length ? 1 / rows.length : 0;
    rows.forEach(function (r) {
      r.pop = sum.sold ? (r.d.sold || 0) / sum.sold : 0;
      r.cls = sum.sold ? O.menuClass(r.pop, r.check.grossProfit, avgPop, sum.avgGrossProfit) : "";
    });
    return { rows: rows, sum: sum, avgPop: avgPop, target: target, vatOn: vatOn };
  }

  function mnTable() {
    var t = clear($("mn-table"));
    t.appendChild(el("thead", {}, [el("tr", {}, [th("Drink"), th("Cost", "num"), th("Formula price", "num"), th("Final price"), th("Net", "num"), th("Pour cost", "num"), th("Gross profit", "num"), th("Sold"), th("Popularity", "num"), th("Class"), th("")])]));
    var tb = el("tbody"); tb.id = "mn-body";
    mn.drinks.forEach(function (d, i) {
      var tr = el("tr", { "data-i": String(i) }, [td(d.name), td("", "num c-cost"), td("", "num c-formula"),
        el("td", {}, [input({ type: "number", step: "1", min: "0", value: d.final, "aria-label": d.name + " final price" }, function () { d.final = n(this.value) || 0; mnUpdate(); })]),
        td("", "num c-net"), td("", "num c-pc"), td("", "num c-gp"),
        el("td", {}, [input({ type: "number", step: "1", min: "0", value: d.sold, "aria-label": d.name + " sold" }, function () { d.sold = Math.max(0, Math.round(n(this.value) || 0)); mnUpdate(); })]),
        td("", "num c-pop"), td("", "c-cls"),
        el("td", {}, [el("button", { type: "button", class: "linkish", text: "Edit", "aria-label": "Edit " + d.name, onclick: function () { mn.edit = i; mnEditor(); mnUpdate(); } })])]);
      tb.appendChild(tr);
    });
    t.appendChild(tb);
  }

  function mnUpdate() {
    var r = mnCompute(), body = $("mn-body");
    if (!body) return;
    r.rows.forEach(function (row, i) {
      var tr = body.children[i]; if (!tr) return;
      tr.className = i === mn.edit ? "selected" : "";
      tr.querySelector(".c-cost").textContent = m2(row.cost);
      tr.querySelector(".c-formula").textContent = m2(row.formula);
      tr.querySelector(".c-net").textContent = m2(row.check.net);
      var pcc = tr.querySelector(".c-pc"); pcc.textContent = pct(row.check.pourCost); pcc.className = "num c-pc " + (row.check.pourCost <= r.target + 1e-9 ? "ok-target" : "miss-target");
      tr.querySelector(".c-gp").textContent = m2(row.check.grossProfit);
      tr.querySelector(".c-pop").textContent = pct(row.pop);
      var cc = tr.querySelector(".c-cls"); cc.textContent = row.cls; cc.className = "c-cls class-" + row.cls;
    });
    var s = r.sum, box = clear($("mn-summary"));
    box.appendChild(el("h2", { text: "Menu-wide check" }));
    box.appendChild(el("div", { class: "kpis" }, [
      kpi("Drinks sold", int(s.sold), "Σ sold"),
      kpi("Net sales", m2(s.netSales) + " ILS", "Σ sold × price" + (r.vatOn ? " ÷ 1.18" : "")),
      kpi("Theoretical cost", m2(s.theoreticalCost) + " ILS", "Σ sold × cost"),
      kpi("Menu pour cost", pct(s.menuPourCost), m2(s.theoreticalCost) + " ÷ " + m2(s.netSales), s.menuPourCost <= r.target + 1e-9 ? "ok-target" : "miss-target"),
      kpi("Average gross profit", m2(s.avgGrossProfit) + " ILS", "Σ sold × gross profit ÷ drinks sold"),
      kpi("Average popularity", pct(r.avgPop), "100% ÷ " + r.rows.length + " drinks")
    ]));
    var worst = r.rows.filter(function (x) { return (x.d.sold || 0) > 0; }).sort(function (a, b) { return (b.check.pourCost - r.target) * b.d.sold - (a.check.pourCost - r.target) * a.d.sold; })[0];
    if (worst && worst.check.pourCost > r.target) box.appendChild(el("p", { text: "Biggest effect on the menu pour cost: " + worst.d.name + " (" + pct(worst.check.pourCost) + ", " + worst.d.sold + " sold). Try a new final price or a cheaper product and watch the menu pour cost." }));
    // CSV
    var rows = [["drink", "cost_ils", "formula_price_ils", "final_price_ils", "net_ils", "pour_cost_pct", "gross_profit_ils", "sold", "popularity_pct", "class"]];
    r.rows.forEach(function (x) { rows.push([x.d.name, x.cost.toFixed(2), x.formula, x.d.final, x.check.net.toFixed(2), (x.check.pourCost * 100).toFixed(1), x.check.grossProfit.toFixed(2), x.d.sold, (x.pop * 100).toFixed(1), x.cls]); });
    rows.push(["TOTAL", "", "", "", s.netSales.toFixed(2), (s.menuPourCost * 100).toFixed(1), s.avgGrossProfit.toFixed(2), s.sold, "", "theoretical cost " + s.theoreticalCost.toFixed(2)]);
    var a = S.csvLink(rows, "menu-costing.csv", "Download menu CSV"); a.className = "button-link";
    clear($("mn-csv")).appendChild(a);
    mnEditorTotals(r);
  }

  function mnEditor() {
    var box = clear($("mn-editor")), d = mn.drinks[mn.edit];
    if (!d) { box.appendChild(el("p", { class: "muted", text: "Choose Edit on a drink to see and change its lines." })); return; }
    box.appendChild(el("h2", { text: "Edit: " + d.name }));
    box.appendChild(el("div", { class: "row" }, [el("div", {}, [el("label", { for: "ed-name", text: "Name" }), input({ id: "ed-name", type: "text", value: d.name }, function () { d.name = this.value; var c = $("mn-body").children[mn.edit]; if (c) c.firstChild.textContent = d.name; mnUpdate(); })]),
      el("div", {}, [el("label", { for: "ed-other", text: "Garnish and other (ILS ex VAT)" }), input({ id: "ed-other", type: "number", step: "0.01", min: "0", value: d.other }, function () { d.other = n(this.value) || 0; mnUpdate(); })])]));
    var t = el("table", { class: "editor" });
    t.appendChild(el("thead", {}, [el("tr", {}, [th("Product"), th("Quantity"), th("Unit"), th("Cost per unit", "num"), th("Waste", "num"), th("Line cost", "num"), th("")])]));
    var tb = el("tbody"); tb.id = "ed-body";
    d.lines.forEach(function (l, i) {
      var sel = el("select", { "aria-label": "Product " + (i + 1) });
      mn.prices.forEach(function (p) { sel.appendChild(el("option", { value: p.key, text: p.item })); });
      sel.value = l[0];
      sel.addEventListener("change", function () { l[0] = this.value; mnEditor(); mnUpdate(); });
      tb.appendChild(el("tr", {}, [el("td", {}, [sel]),
        el("td", {}, [input({ type: "number", step: "any", min: "0", value: l[1], "aria-label": "Quantity " + (i + 1) }, function () { l[1] = n(this.value) || 0; mnUpdate(); })]),
        td(C.unitLabel(mnIndex()[l[0]])), td("", "num e-cpu"), td("", "num e-w"), td("", "num e-lc"),
        el("td", {}, [el("button", { type: "button", class: "rm", text: "✕", "aria-label": "Remove line " + (i + 1), onclick: function () { d.lines.splice(i, 1); mnEditor(); mnUpdate(); } })])]));
    });
    t.appendChild(tb);
    t.appendChild(el("tfoot", {}, [el("tr", { class: "total" }, [td("Cost per serving"), td(""), td(""), td(""), td(""), td("", "num e-total"), td("")])]));
    box.appendChild(el("div", { class: "table-wrap" }, [t]));
    box.appendChild(el("div", { class: "row" }, [
      el("div", {}, [el("button", { type: "button", class: "secondary", text: "Add a line", onclick: function () { d.lines.push(["gin", 30]); mnEditor(); mnUpdate(); } })]),
      el("div", {}, [el("button", { type: "button", class: "secondary", text: "Remove this drink", onclick: function () { mn.drinks.splice(mn.edit, 1); mn.edit = Math.min(mn.edit, mn.drinks.length - 1); mnTable(); mnEditor(); mnUpdate(); } })])
    ]));
  }
  function mnEditorTotals(r) {
    var body = $("ed-body"), row = r.rows[mn.edit];
    if (!body || !row) return;
    row.costing.lines.forEach(function (l, i) {
      var tr = body.children[i]; if (!tr) return;
      tr.querySelector(".e-cpu").textContent = m4(l.costPerUnit);
      tr.querySelector(".e-w").textContent = Math.round(l.waste * 100) + "%";
      tr.querySelector(".e-lc").textContent = m2(l.lineCost);
    });
    var tot = document.querySelector(".e-total"); if (tot) tot.textContent = m2(row.cost);
  }

  function mnInit() {
    mnReset();
    ["mn-vat", "mn-target", "mn-round"].forEach(function (id) { $(id).addEventListener("input", mnUpdate); $(id).addEventListener("change", mnUpdate); });
    $("mn-formula").addEventListener("click", function () { mnCompute().rows.forEach(function (r) { r.d.final = r.formula; }); mnTable(); mnUpdate(); });
    $("mn-add").addEventListener("click", function () { mn.drinks.push({ name: "New drink", lines: [["gin", 50], ["lemon", 25], ["sugar", 20]], other: 0.30, final: 58, sold: 0 }); mn.edit = mn.drinks.length - 1; mnTable(); mnEditor(); mnUpdate(); });
    $("mn-reset").addEventListener("click", function () { mnReset(); $("mn-vat").checked = true; $("mn-target").value = 20; $("mn-round").value = "2"; plTable(); mnTable(); mnEditor(); mnUpdate(); });
    plTable(); mnTable(); mnEditor(); mnUpdate();
  }

  // ---------- VARIANCE ----------
  var vr = {};
  function vrReset() { vr.sales = C.clone(D.VARIANCE.sales); vr.items = C.clone(D.VARIANCE.items); $("vr-tol").value = D.VARIANCE.tolerancePct; }
  function vrTables() {
    var keys = vr.items.map(function (i) { return i.key; });
    var t = clear($("vr-sales"));
    t.appendChild(el("thead", {}, [el("tr", {}, [th("Drink"), th("Sold")].concat(vr.items.map(function (i) { return th(i.item + " ml", "num"); })))]));
    var tb = el("tbody");
    vr.sales.forEach(function (s) {
      tb.appendChild(el("tr", {}, [td(s.drink), el("td", {}, [input({ type: "number", min: "0", step: "1", value: s.sold, "aria-label": s.drink + " sold" }, function () { s.sold = Math.max(0, n(this.value) || 0); vrUpdate(); })])]
        .concat(keys.map(function (k) { return td(s.uses[k] || "", "num"); }))));
    });
    tb.appendChild(el("tr", { class: "total", id: "vr-theo-row" }, [td("Theoretical ml"), td("")].concat(keys.map(function () { return td("", "num"); }))));
    t.appendChild(tb);
    var t2 = clear($("vr-items"));
    var F = [["bottleMl", "Bottle ml"], ["opening", "Opening"], ["received", "Received"], ["closing", "Closing"], ["wasteMl", "Logged waste ml"], ["costPerMl", "Cost per ml"]];
    t2.appendChild(el("thead", {}, [el("tr", {}, [th("Item")].concat(F.map(function (f) { return th(f[1]); })).concat([th("Waste reason")]))]));
    var tb2 = el("tbody");
    vr.items.forEach(function (it) {
      tb2.appendChild(el("tr", {}, [td(it.item)].concat(F.map(function (f) {
        return el("td", {}, [input({ type: "number", step: f[0] === "costPerMl" ? "0.0001" : f[0] === "bottleMl" || f[0] === "wasteMl" ? "1" : "0.1", value: it[f[0]], "aria-label": it.item + " " + f[1] }, function () { it[f[0]] = n(this.value) || 0; vrUpdate(); })]);
      })).concat([td(it.reason, "muted")])));
    });
    t2.appendChild(tb2);
  }
  function vrUpdate() {
    var theo = C.theoreticalFromSales(vr.sales), tol = n($("vr-tol").value);
    if (!isFinite(tol)) tol = 3;
    var row = $("vr-theo-row");
    vr.items.forEach(function (it, i) { row.children[i + 2].textContent = int(theo[it.key] || 0); });
    var r = C.reconcileAll(vr.items, theo, tol);
    var t = clear($("vr-out"));
    t.appendChild(el("thead", {}, [el("tr", {}, [th("Item"), th("Theoretical ml", "num"), th("Actual ml", "num"), th("Variance ml", "num"), th("Variance %", "num"), th("Unexplained ml", "num"), th("Unexplained %", "num"), th("Value ILS", "num"), th("Flag")])]));
    var tb = el("tbody");
    r.rows.forEach(function (x) {
      var flag = x.flag === "none" ? "within ±" + tol + "%" : x.flag === "explained" ? "explained by waste log" : "investigate" + (x.varianceMl < 0 ? " (below theoretical)" : "");
      tb.appendChild(el("tr", {}, [td(x.item.item), td(int(x.theoreticalMl), "num"),
        td(x.item.opening + " + " + x.item.received + " − " + x.item.closing + " = " + O.round(x.item.opening + x.item.received - x.item.closing, 2) + " → " + int(x.actualMl), "num"),
        td(int(x.varianceMl), "num"), td(x.variancePct.toFixed(1) + "%", "num"), td(int(x.unexplainedMl), "num"), td(x.unexplainedPct.toFixed(1) + "%", "num"),
        td(m2(x.value), "num"), el("td", { class: x.flag === "investigate" ? "bad" : x.flag === "explained" ? "warn" : "good", text: flag })]));
    });
    tb.appendChild(el("tr", { class: "total" }, [td("Total"), td(""), td(""), td(""), td(""), td(""), td(""), td(m2(r.totals.value), "num"), td("")]));
    t.appendChild(tb);
    clear($("vr-tot")).appendChild(el("div", { class: "kpis" }, [
      kpi("Theoretical cost", m2(r.totals.theoreticalCost) + " ILS", "Σ theoretical ml × cost per ml"),
      kpi("Actual cost", m2(r.totals.actualCost) + " ILS", "Σ actual ml × cost per ml"),
      kpi("Difference", m2(r.totals.actualCost - r.totals.theoreticalCost) + " ILS", "= total variance value")
    ]));
    var rows = [["item", "theoretical_ml", "actual_ml", "variance_ml", "variance_pct", "logged_waste_ml", "unexplained_ml", "unexplained_pct", "cost_per_ml", "value_ils", "flag"]];
    r.rows.forEach(function (x) { rows.push([x.item.item, x.theoreticalMl, Math.round(x.actualMl), Math.round(x.varianceMl), x.variancePct.toFixed(1), x.item.wasteMl, Math.round(x.unexplainedMl), x.unexplainedPct.toFixed(1), x.item.costPerMl, x.value.toFixed(2), O.FLAG_LABEL[x.flag]]); });
    var a = S.csvLink(rows, "reconciliation.csv", "Download CSV"); a.className = "button-link";
    clear($("vr-csv")).appendChild(a);
  }
  function vrInit() {
    vrReset(); vrTables(); vrUpdate();
    $("vr-tol").addEventListener("input", vrUpdate);
    $("vr-reset").addEventListener("click", function () { vrReset(); vrTables(); vrUpdate(); });
  }

  // ---------- EXAM ----------
  var ex = {};
  function exLoad(seed) {
    ex.seed = seed; ex.data = C.examData(seed); ex.sol = C.examSolution(ex.data);
    $("ex-seed").textContent = "seed " + seed + (seed === C.PUBLISHED_SEED ? " · published data" : "");
    exData(); exForm(); $("ex-result").hidden = true;
  }
  function table(head, rows) {
    var t = el("table");
    t.appendChild(el("thead", {}, [el("tr", {}, head.map(function (h) { return th(h); }))]));
    var tb = el("tbody");
    rows.forEach(function (r) { tb.appendChild(el("tr", {}, r.map(function (c) { return td(c); }))); });
    t.appendChild(tb);
    return el("div", { class: "table-wrap" }, [t]);
  }
  function exData() {
    var box = clear($("ex-data")), d = ex.data, P = C.examPrices();
    box.appendChild(el("p", { text: "A small bar in Tel Aviv. VAT 18%. Target pour cost 20%. Menu prices rounded up to the next 2 ILS. Variance tolerance ±3%. Extra product (course assumption): ginger beer, 330 ml can, 5.90 ILS incl. VAT, waste 5%." }));
    box.appendChild(el("h3", { text: "Specs, menu prices and a normal week's sales" }));
    box.appendChild(table(["Drink", "Lines", "Garnish and other (ex VAT)", "Menu price", "Sold per week"], d.drinks.map(function (x) {
      return [x.name, x.lines.map(function (l) { return P[l[0]].item.split(" (")[0] + " " + l[1] + " ml"; }).join(", "), x.otherLabel + " " + m2(x.other), x.price, x.sold];
    })));
    var keys = {}; d.drinks.forEach(function (x) { x.lines.forEach(function (l) { keys[l[0]] = 1; }); });
    box.appendChild(el("h3", { text: "Price list (rows you need)" }));
    box.appendChild(table(["Product", "Package", "Price incl. VAT", "Waste", "Yield ml/kg"], Object.keys(keys).map(function (k) {
      var p = P[k]; return [p.item, p.unit === "kg" ? p.size + " kg" : p.size + " " + p.unit, m2(p.price), Math.round(p.waste * 100) + "%", p.yieldMlPerKg || ""];
    })));
    box.appendChild(el("h3", { text: "Stock file (last week; sales were exactly the normal week)" }));
    box.appendChild(table(["Item", "Bottle ml", "Par", "Opening", "Received", "Closing", "Logged waste ml", "Reason"], d.stock.map(function (s) {
      return [s.item, s.bottleMl, s.par, s.opening, s.received, s.closing, s.wasteMl, s.reason];
    })));
  }
  function field(id, label) { return el("div", {}, [el("label", { for: id, text: label }), el("input", { id: id, type: "text", inputmode: "decimal", autocomplete: "off" })]); }
  function exForm() {
    var f = clear($("ex-form")), d = ex.data;
    f.appendChild(el("fieldset", {}, [el("legend", { text: "A. Cost per serving (ILS) — 8 points" }), el("div", { class: "exam-grid" }, d.drinks.map(function (x, i) { return field("exA" + i, x.name); }))]));
    f.appendChild(el("fieldset", {}, [el("legend", { text: "B. Prices — 8 points" }), el("div", { class: "exam-grid" }, d.drinks.map(function (x, i) { return field("exB" + i, "Formula price at 20%: " + x.name); })
      .concat([field("exBpc", d.focus + " at its menu price: pour cost %"), field("exBgp", "gross profit ILS"), field("exBmg", "margin %"), field("exBmk", "markup %")]))]));
    f.appendChild(el("fieldset", {}, [el("legend", { text: "C. Menu-wide check — 5 points" }), el("div", { class: "exam-grid" }, [field("exCnet", "Net sales ILS"), field("exCtheo", "Theoretical cost ILS"), field("exCpc", "Menu pour cost %"), field("exCgp", "Average gross profit ILS"), field("exCact", "Actual pour cost %")])]));
    var dset = el("fieldset", {}, [el("legend", { text: "D. Reconciliation — 10 points" })]);
    d.stock.forEach(function (s, i) {
      var name = s.item.split(" (")[0];
      var sel = el("select", { id: "exDf" + i });
      [["", "—"], ["none", "none"], ["investigate", "investigate"], ["explained", "explained by waste log"]].forEach(function (o) { sel.appendChild(el("option", { value: o[0], text: o[1] })); });
      dset.appendChild(el("h4", { text: name }));
      dset.appendChild(el("div", { class: "exam-grid" }, [field("exDa" + i, "Actual ml"), field("exDv" + i, "Variance ml"), field("exDp" + i, "Variance %"), field("exDu" + i, "Unexplained ml"), field("exDval" + i, "Value ILS"),
        el("div", {}, [el("label", { for: "exDf" + i, text: "Flag" }), sel])]));
    });
    f.appendChild(dset);
    f.appendChild(el("fieldset", {}, [el("legend", { text: "E. Order list (bottles) — 5 points" }), el("div", { class: "exam-grid" }, d.stock.map(function (s, i) { return field("exE" + i, s.item.split(" (")[0]); }))]));
  }
  function v(id) { var e = $(id); return e ? e.value.trim() : ""; }
  function exAnswers() {
    var d = ex.data;
    return {
      A: d.drinks.map(function (x, i) { return v("exA" + i); }),
      B: { prices: d.drinks.map(function (x, i) { return v("exB" + i); }), pourCost: v("exBpc"), gp: v("exBgp"), margin: v("exBmg"), markup: v("exBmk") },
      C: { net: v("exCnet"), theo: v("exCtheo"), menuPc: v("exCpc"), avgGp: v("exCgp"), actualPc: v("exCact") },
      D: d.stock.map(function (s, i) { return { actual: v("exDa" + i), variance: v("exDv" + i), pct: v("exDp" + i), unexplained: v("exDu" + i), value: v("exDval" + i), flag: v("exDf" + i) }; }),
      E: d.stock.map(function (s, i) { return v("exE" + i); })
    };
  }
  function exMark() {
    var m = C.markExam(exAnswers(), ex.sol);
    var fRaw = n(v("ex-f")), F = isFinite(fRaw) ? Math.max(0, Math.min(4, Math.round(fRaw))) : null;
    var total = m.points + (F || 0), p = total / 40 * 100;
    var box = $("ex-result"); clear(box); box.hidden = false;
    box.appendChild(el("h2", { text: "Result" }));
    var t = el("table");
    t.appendChild(el("thead", {}, [el("tr", {}, [th("Part"), th("Answer"), th("Yours"), th("Correct"), th("Points", "num")])]));
    var tb = el("tbody");
    m.items.forEach(function (x) {
      var cls = x.points === x.max ? "ptsfull" : x.points === 0 ? "pts0" : "ptspart";
      tb.appendChild(el("tr", { class: cls }, [td(x.part), td(x.label), td(x.answer === "" || x.answer === undefined ? "—" : x.answer), td(x.correct), td(x.points + " / " + x.max, "num p")]));
    });
    t.appendChild(tb);
    var parts = ["A", "B", "C", "D", "E"].map(function (k) {
      var it = m.items.filter(function (x) { return x.part === k; });
      return k + " " + it.reduce(function (s, x) { return s + x.points; }, 0) + "/" + it.reduce(function (s, x) { return s + x.max; }, 0);
    });
    box.appendChild(el("div", { class: "kpis" }, [
      kpi("Parts A–E", m.points + " / 36", parts.join(" · ")),
      kpi("Part F (self-scored)", F === null ? "not entered" : F + " / 4", "report: 4 criteria"),
      kpi("Total", total + " / 40", "score = points ÷ 40 × 100"),
      kpi("Score", p.toFixed(1) + "%", "minimum 70% (28 points)", p >= 70 ? "ok-target" : "miss-target")
    ]));
    box.appendChild(el("div", { class: "table-wrap" }, [t]));
    var s = ex.sol;
    var lines = [
      "Costing and operations assignment (lesson 11.6) — costing-calculator exam preset",
      "Date: " + new Date().toISOString().slice(0, 10) + " · seed " + ex.seed,
      "Parts A–E: " + m.points + "/36 (" + parts.join(", ") + ")",
      "Part F (self-scored): " + (F === null ? "not entered" : F + "/4"),
      "Total: " + total + "/40 = " + p.toFixed(1) + "% (minimum 70%) → " + (p >= 70 ? "minimum met" : "below minimum"),
      "Menu pour cost " + (s.summary.menuPourCost * 100).toFixed(1) + "%, actual " + (s.actualPourCost * 100).toFixed(1) + "%, variance value " + m2(s.reconciliation.totals.value) + " ILS",
      "Missed: " + (m.items.filter(function (x) { return x.points < x.max; }).map(function (x) { return x.label; }).join("; ") || "none"),
      "Self-scored and unverified."
    ];
    var pre = el("pre", { class: "copy", text: lines.join("\n") }), msg = el("p", { class: "muted", "aria-live": "polite" });
    box.appendChild(el("h3", { text: "Copy results (for the performance report)" }));
    box.appendChild(pre);
    box.appendChild(el("button", { type: "button", text: "Copy results", onclick: function () { copyBlock(pre, msg); } }));
    box.appendChild(msg);
    box.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function exInit() {
    var p = parseInt(S.params().seed, 10);
    exLoad(isFinite(p) && p > 0 ? p : C.PUBLISHED_SEED);
    $("ex-mark").addEventListener("click", exMark);
    $("ex-new").addEventListener("click", function () { var s; do { s = 2 + Math.floor(Math.random() * 99998); } while (s === ex.seed); exLoad(s); });
    $("ex-published").addEventListener("click", function () { exLoad(C.PUBLISHED_SEED); });
  }

  // ---------- init ----------
  $("label-slot").appendChild(S.label());
  Array.prototype.forEach.call(document.querySelectorAll(".tab"), function (b) { b.addEventListener("click", function () { showTab(b.getAttribute("data-tab")); }); });
  sgInit(); ydInit(); mnInit(); vrInit(); exInit();
  showTab(PRESETS[presetKey].tab);
})();
