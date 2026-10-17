/* Shared helpers for all simulations. Classic script: exposes window.Sim. No network, no popups. */
(function (root) {
  "use strict";

  function params() {
    var out = {};
    try {
      new URLSearchParams(root.location ? root.location.search : "").forEach(function (v, k) { out[k] = v; });
    } catch (e) { /* ignore */ }
    return out;
  }

  function preset(allowed, fallback) {
    var p = params().preset;
    return allowed.indexOf(p) >= 0 ? p : fallback;
  }

  function seed() {
    var s = parseInt(params().seed, 10);
    return isFinite(s) ? s : Math.floor(Math.random() * 1e9);
  }

  // mulberry32: small deterministic RNG
  function rng(s) {
    var a = s >>> 0;
    var f = function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    f.int = function (n) { return Math.floor(f() * n); };
    f.pick = function (arr) { return arr[f.int(arr.length)]; };
    f.shuffle = function (arr) {
      var a2 = arr.slice();
      for (var i = a2.length - 1; i > 0; i--) { var j = f.int(i + 1); var t = a2[i]; a2[i] = a2[j]; a2[j] = t; }
      return a2;
    };
    return f;
  }

  var store = {
    get: function (k, d) {
      try { var v = root.localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; }
    },
    set: function (k, v) { try { root.localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* optional */ } }
  };

  function csvCell(v) {
    var s = v === null || v === undefined ? "" : String(v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }

  function toCSV(rows) { return rows.map(function (r) { return r.map(csvCell).join(","); }).join("\n"); }

  // Returns an <a> element that downloads the CSV via a data: link.
  function csvLink(rows, filename, text) {
    var a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(toCSV(rows));
    a.download = filename;
    a.textContent = text || "Download CSV";
    return a;
  }

  function el(tag, attrs, children) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "text") e.textContent = attrs[k];
      else if (k === "class") e.className = attrs[k];
      else if (k.slice(0, 2) === "on") e.addEventListener(k.slice(2), attrs[k]);
      else e.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c != null) e.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return e;
  }

  function label() { return el("span", { class: "sim-label", text: "Educational model — not a real bar" }); }

  function fmt(n, d) { return (Math.round(n * Math.pow(10, d || 0)) / Math.pow(10, d || 0)).toLocaleString("en-US", { maximumFractionDigits: d || 0 }); }

  root.Sim = { params: params, preset: preset, seed: seed, rng: rng, store: store, toCSV: toCSV, csvLink: csvLink, el: el, label: label, fmt: fmt };
})(typeof window !== "undefined" ? window : globalThis);
