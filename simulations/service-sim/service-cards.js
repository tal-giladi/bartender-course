/* Service-simulation cards: how each course recipe (common/recipes.js) is made at the station.
   ml values are read from recipes.js at load (`from` = the recipe's ingredient text), so the cards follow the
   course specs (Modules 5 and 6). Glass, ice, method and garnish are the recipe cards' values in the station's
   short vocabulary. Draught beer and house wine are single quick steps (lesson 08.8).
   Classic script: window.ServiceCards; module.exports under Node. */
(function (root) {
  "use strict";
  var NODE = typeof module !== "undefined" && module.exports;
  var B = NODE ? require("../common/bar-math.js") : root.BarMath;
  var RECIPES = NODE ? require("../common/recipes.js") : (root.RECIPES || []);

  var GLASSES = [
    ["cocktail", "Cocktail / martini glass"], ["rocks", "Rocks (old fashioned) glass"], ["highball", "Highball / Collins glass"],
    ["wine", "Wine glass"], ["flute", "Champagne flute"], ["goblet", "Goblet"], ["cobbler", "Cobbler glass"], ["mule", "Mule cup"], ["pint", "Beer glass"]
  ];

  // kind: pour = jigger, ml chosen; add = a portion (dash, cube, leaves, pinch); top = soda-style top-up (3 s)
  var BOTTLES = [
    ["gin", "London dry gin", "pour"], ["oldtom", "Old Tom gin", "pour"], ["vodka", "Vodka", "pour"], ["citrusvodka", "Citrus vodka", "pour"],
    ["whiterum", "White rum", "pour"], ["jamaica", "Amber Jamaican rum", "pour"], ["martinique", "Martinique rum", "pour"],
    ["tequila", "Tequila 100% agave", "pour"], ["bourbon", "Bourbon", "pour"], ["rye", "Rye whiskey", "pour"], ["cognac", "Cognac", "pour"], ["pisco", "Pisco", "pour"],
    ["cointreau", "Cointreau (triple sec)", "pour"], ["curacao", "Orange curaçao", "pour"], ["campari", "Campari", "pour"], ["aperol", "Aperol", "pour"],
    ["sweetvermouth", "Sweet red vermouth", "pour"], ["dryvermouth", "Dry vermouth", "pour"], ["coffeeliq", "Coffee liqueur", "pour"],
    ["sparkling", "Sparkling wine (Prosecco / Champagne)", "pour"],
    ["lime", "Lime juice", "pour"], ["lemon", "Lemon juice", "pour"], ["syrup", "1:1 syrup", "pour"], ["orgeat", "Orgeat (almond) syrup", "pour"],
    ["cranberry", "Cranberry juice", "pour"], ["tomato", "Tomato juice", "pour"], ["espresso", "Espresso", "pour"],
    ["bitters", "Angostura bitters (dash)", "add"], ["worcestershire", "Worcestershire sauce (dashes)", "add"], ["seasoning", "Tabasco, celery salt, pepper", "add"],
    ["sugarcube", "Sugar cube", "add"], ["sugar", "Sugar (bar spoons / tsp)", "add"], ["water", "Plain water (dash)", "add"],
    ["mint", "Mint", "add"], ["salt", "Salt (pinch)", "add"], ["eggwhite", "Egg white (pasteurised) or aquafaba", "add"],
    ["soda", "Soda water", "top"], ["gingerbeer", "Ginger beer", "top"], ["cola", "Cola", "top"], ["gfsoda", "Pink grapefruit soda", "top"]
  ];
  var TOPS = ["soda", "gingerbeer", "cola", "gfsoda", "sparkling"]; // sparkling wine can be poured or topped

  var GARNISHES = [
    ["lemon-peel", "Lemon peel / twist"], ["orange-peel", "Orange peel / twist"], ["olive", "Olive"], ["cherry", "Cocktail cherry"],
    ["orange-slice", "Orange slice"], ["orange-cherry", "Orange slice + cherry"], ["lemon-cherry", "Lemon slice + cherry"],
    ["lime", "Lime slice / wedge"], ["mint-lime", "Mint sprig + lime slice"], ["coffee-beans", "3 coffee beans"], ["salt-rim", "Half salt rim"],
    ["celery", "Celery stick"], ["bitters-drops", "Bitters drops on the foam"], ["maitai", "Pineapple, mint and lime peel"]
  ];

  // items: [keys (accepted bottle keys), from (recipe ingredient text), optional?]
  var SPEC = {
    "dry-martini": { glass: ["cocktail"], ice: "none", method: "stir", garnish: ["lemon-peel", "olive"], items: [[["gin"], "gin"], [["dryvermouth"], "dry vermouth"]] },
    "manhattan": { glass: ["cocktail"], ice: "none", method: "stir", garnish: ["cherry"], items: [[["rye"], "rye whiskey"], [["sweetvermouth"], "sweet red vermouth"], [["bitters"], "Angostura bitters"]] },
    "old-fashioned": { glass: ["rocks"], ice: "cubes", method: "build", muddle: true, garnish: ["orange-cherry"],
      items: [[["bourbon", "rye"], "bourbon or rye whiskey"], [["sugarcube"], "sugar cube"], [["bitters"], "Angostura bitters"], [["water"], "plain water"]] },
    "negroni": { glass: ["rocks"], ice: "cubes", method: "build", stirInGlass: true, garnish: ["orange-slice"], items: [[["gin"], "gin"], [["campari"], "Campari"], [["sweetvermouth"], "sweet red vermouth"]] },
    "daiquiri": { glass: ["cocktail"], ice: "none", method: "shake", garnish: ["none"], items: [[["whiterum"], "white rum"], [["lime"], "fresh lime juice"], [["sugar", "syrup"], "superfine sugar"]] },
    "margarita": { glass: ["cocktail"], ice: "none", method: "shake", garnish: ["none", "salt-rim"], items: [[["tequila"], "tequila 100% agave"], [["cointreau"], "triple sec"], [["lime"], "fresh lime juice"]] },
    "whiskey-sour": { glass: ["cobbler"], ice: "none", method: "shake", garnish: ["orange-cherry"],
      items: [[["bourbon"], "bourbon whiskey"], [["lemon"], "fresh lemon juice"], [["syrup"], "sugar syrup 1:1"], [["eggwhite"], "pasteurised egg white (optional)", true]] },
    "cosmopolitan": { glass: ["cocktail"], ice: "none", method: "shake", garnish: ["lemon-peel"],
      items: [[["citrusvodka"], "citrus vodka"], [["cointreau"], "Cointreau"], [["lime"], "fresh lime juice"], [["cranberry"], "cranberry juice"]] },
    "mojito": { glass: ["highball"], ice: "cubes", method: "build", muddle: true, garnish: ["mint-lime"],
      items: [[["whiterum"], "white rum"], [["lime"], "fresh lime juice"], [["mint"], "mint"], [["sugar"], "white cane sugar"], [["soda"], "soda water"]] },
    "moscow-mule": { glass: ["mule", "rocks"], ice: "cubes", method: "build", garnish: ["lime"], items: [[["vodka"], "vodka"], [["gingerbeer"], "ginger beer"], [["lime"], "fresh lime juice"]] },
    "aperol-spritz": { glass: ["wine"], ice: "cubes", method: "build", garnish: ["orange-slice"], items: [[["sparkling"], "Prosecco"], [["aperol"], "Aperol"], [["soda"], "soda water"]] },
    "espresso-martini": { glass: ["cocktail"], ice: "none", method: "shake", garnish: ["coffee-beans"],
      items: [[["vodka"], "vodka"], [["coffeeliq"], "coffee liqueur (Kahlúa)"], [["syrup"], "sugar syrup 1:1"], [["espresso"], "strong espresso"]] },
    "white-lady": { glass: ["cocktail"], ice: "none", method: "shake", garnish: ["none", "lemon-peel"], items: [[["gin"], "gin"], [["cointreau"], "triple sec"], [["lemon"], "fresh lemon juice"]] },
    "sidecar": { glass: ["cocktail"], ice: "none", method: "shake", garnish: ["none", "orange-peel", "lemon-peel"], items: [[["cognac"], "cognac"], [["cointreau"], "triple sec"], [["lemon"], "fresh lemon juice"]] },
    "pisco-sour": { glass: ["goblet"], ice: "none", method: "shake", garnish: ["bitters-drops"],
      items: [[["pisco"], "pisco"], [["lemon"], "fresh lemon juice"], [["syrup"], "simple syrup 1:1"], [["eggwhite"], "egg white (pasteurised) or aquafaba"]] },
    "french-75": { glass: ["flute"], ice: "none", method: "shake", garnish: ["none", "lemon-peel"],
      items: [[["gin"], "gin"], [["lemon"], "fresh lemon juice"], [["syrup"], "sugar syrup 1:1"], [["sparkling"], "Champagne (brut)"]] },
    "tom-collins": { glass: ["highball"], ice: "cubes", method: "build", garnish: ["lemon-cherry"],
      items: [[["oldtom"], "Old Tom gin"], [["lemon"], "fresh lemon juice"], [["syrup"], "simple syrup 1:1"], [["soda"], "soda water"]] },
    "paloma": { glass: ["highball"], ice: "cubes", method: "build", garnish: ["lime"],
      items: [[["tequila"], "tequila (100% agave)"], [["lime"], "fresh lime juice"], [["salt"], "salt"], [["gfsoda"], "pink grapefruit soda"]] },
    "bloody-mary": { glass: ["rocks"], ice: "none", method: "stir", garnish: ["celery"],
      items: [[["vodka"], "vodka"], [["tomato"], "tomato juice"], [["lemon"], "fresh lemon juice"], [["worcestershire"], "Worcestershire sauce"], [["seasoning"], "Tabasco, celery salt, black pepper"]] },
    "mai-tai": { glass: ["rocks", "highball"], ice: "cubes", method: "shake", garnish: ["maitai"],
      items: [[["jamaica"], "amber Jamaican rum"], [["martinique"], "Martinique molasses rum"], [["curacao"], "orange curaçao"], [["orgeat"], "orgeat (almond) syrup"], [["lime"], "fresh lime juice"], [["syrup"], "simple syrup 1:1"]] },
    "cuba-libre": { glass: ["highball"], ice: "cubes", method: "build", garnish: ["lime"], items: [[["whiterum"], "white rum"], [["cola"], "cola"], [["lime"], "fresh lime juice"]] }
  };

  var EXTRA = {
    beer: { id: "beer", name: "Draught beer", glass: ["pint"], ice: "none", method: "beer", garnish: ["none"], items: [], amountText: "one draught pour (about 400 ml)" },
    wine: { id: "wine", name: "House wine", glass: ["wine"], ice: "none", method: "wine", garnish: ["none"], items: [], amountText: "one glass (150 ml)" }
  };
  var DEFAULT_TOP_ML = { "to top": 60, "splash": 30 };

  var KIND = {}; BOTTLES.forEach(function (b) { KIND[b[0]] = b[2]; });

  function build() {
    var cards = {}, problems = [];
    Object.keys(SPEC).forEach(function (id) {
      var r = RECIPES.filter(function (x) { return x.id === id; })[0];
      if (!r) { problems.push("recipe missing: " + id); return; }
      var s = SPEC[id];
      var items = s.items.map(function (it) {
        var ing = r.ingredients.filter(function (i) { return i.item === it[1]; })[0];
        if (!ing) { problems.push(id + ": ingredient not found: " + it[1]); return null; }
        var kind = KIND[it[0][0]];
        var ml = typeof ing.ml === "number" ? ing.ml : null;
        var approx = ml !== null ? ml : (B.amountToMl(ing.amount) || DEFAULT_TOP_ML[String(ing.amount || "").toLowerCase()] || 0);
        if (kind === "pour" && ml === null && approx) ml = approx;            // "1 shot (about 30 ml)" espresso
        var checkMl = (kind === "pour" || kind === "top") && typeof ing.ml === "number" ? ing.ml : (kind === "pour" && ml !== null ? ml : null);
        if (it[0].length > 1 && KIND[it[0][1]] !== kind) checkMl = null;      // sugar or syrup: presence only
        return { keys: it[0], kind: kind, item: ing.item, amount: ing.ml !== undefined ? ing.ml + " ml" : ing.amount, ml: approx, checkMl: checkMl, optional: !!it[2] };
      }).filter(Boolean);
      cards[id] = { id: id, name: r.name, glass: s.glass, ice: s.ice, method: s.method, muddle: !!s.muddle, stirInGlass: !!s.stirInGlass,
        garnish: s.garnish, garnishText: r.garnish, glassText: r.glass, items: items };
    });
    Object.keys(EXTRA).forEach(function (k) { cards[k] = EXTRA[k]; });
    return { cards: cards, problems: problems };
  }

  var built = build();
  var api = { GLASSES: GLASSES, BOTTLES: BOTTLES, TOPS: TOPS, GARNISHES: GARNISHES, KIND: KIND, CARDS: built.cards, PROBLEMS: built.problems };
  if (NODE) module.exports = api;
  else root.ServiceCards = api;
})(typeof window !== "undefined" ? window : globalThis);
