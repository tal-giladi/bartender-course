/* Data for the costing calculator, copied from the course labs (checked by scripts/tests/costing-calculator.test.js):
   labs/module-10/price-list.csv, costing-project-solution.md, pos-sales-week.csv, reconciliation-worksheet.md,
   labs/module-11/costing-exam-brief.md and costing-exam-inventory.csv.
   Prices: Shufersal online regular retail prices incl. VAT (checked 2026-10-18) or "course assumption". Examples only.
   Classic script: window.CostingData; module.exports under Node. */
(function (root) {
  "use strict";

  // unit: 'ml' (bottle or made syrup), 'kg' (produce, costed per ml of juice via yield), 'pieces'
  var PRICE_LIST = [
    { key: "gin", item: "London dry gin (Gordon's)", size: 700, unit: "ml", price: 105.90, waste: 0.03, source: "Shufersal online, 2026-10-18" },
    { key: "rum", item: "White rum (Bacardi Carta Blanca)", size: 750, unit: "ml", price: 119.90, waste: 0.03, source: "Shufersal online, 2026-10-18" },
    { key: "vodka", item: "Vodka (Smirnoff Red)", size: 700, unit: "ml", price: 69.90, waste: 0.03, source: "Shufersal online, 2026-10-18" },
    { key: "bourbon", item: "Bourbon (Jim Beam White)", size: 700, unit: "ml", price: 110.90, waste: 0.03, source: "Shufersal online, 2026-10-18" },
    { key: "scotch", item: "Blended Scotch (Grant's)", size: 700, unit: "ml", price: 104.90, waste: 0.03, source: "Shufersal online, 2026-10-18" },
    { key: "tequila", item: "Tequila 100% agave (Patrón Silver)", size: 700, unit: "ml", price: 199.90, waste: 0.03, source: "Shufersal online, 2026-10-18" },
    { key: "arak", item: "Arak (Elite)", size: 700, unit: "ml", price: 64.90, waste: 0.03, source: "Shufersal online, 2026-10-18" },
    { key: "campari", item: "Campari", size: 700, unit: "ml", price: 105.90, waste: 0.03, source: "Shufersal online, 2026-10-18" },
    { key: "vermouth", item: "Sweet vermouth (Martini Rosso)", size: 750, unit: "ml", price: 64.90, waste: 0.03, source: "Shufersal online, 2026-10-18" },
    { key: "cointreau", item: "Cointreau (triple sec)", size: 700, unit: "ml", price: 144.90, waste: 0.03, source: "Shufersal online, 2026-10-18" },
    { key: "aperol", item: "Aperol", size: 1000, unit: "ml", price: 110.90, waste: 0.03, source: "Shufersal online, 2026-10-18" },
    { key: "oldtom", item: "Old Tom gin", size: 700, unit: "ml", price: 150.00, waste: 0.03, source: "course assumption" },
    { key: "islay", item: "Islay single malt", size: 700, unit: "ml", price: 300.00, waste: 0.03, source: "course assumption" },
    { key: "jamaica", item: "Amber Jamaican rum", size: 700, unit: "ml", price: 130.00, waste: 0.03, source: "course assumption" },
    { key: "martinique", item: "Martinique rum", size: 700, unit: "ml", price: 160.00, waste: 0.03, source: "course assumption" },
    { key: "curacao", item: "Orange curaçao", size: 700, unit: "ml", price: 90.00, waste: 0.03, source: "course assumption" },
    { key: "coffeeliq", item: "Coffee liqueur", size: 700, unit: "ml", price: 95.00, waste: 0.03, source: "course assumption" },
    { key: "elder", item: "Elderflower liqueur", size: 700, unit: "ml", price: 150.00, waste: 0.03, source: "course assumption" },
    { key: "prosecco", item: "Prosecco", size: 750, unit: "ml", price: 50.00, waste: 0.10, source: "course assumption" },
    { key: "orgeat", item: "Orgeat syrup", size: 700, unit: "ml", price: 60.00, waste: 0.03, source: "course assumption" },
    { key: "bitters", item: "Angostura bitters", size: 200, unit: "ml", price: 90.00, waste: 0, source: "course assumption" },
    { key: "soda", item: "Soda water (Schweppes)", size: 1000, unit: "ml", price: 4.90, waste: 0.05, source: "Shufersal online, 2026-10-18" },
    { key: "gfsoda", item: "Pink grapefruit soda (Nordic Mist)", size: 1000, unit: "ml", price: 6.90, waste: 0.05, source: "Shufersal online, 2026-10-18" },
    { key: "tomato", item: "Tomato juice", size: 1000, unit: "ml", price: 12.00, waste: 0.05, source: "course assumption" },
    { key: "lemon", item: "Lemons (juice)", size: 1, unit: "kg", yieldMlPerKg: 300, price: 12.90, waste: 0.10, source: "Shufersal online, 2026-10-18" },
    { key: "lime", item: "Limes (juice), 350 g pack", size: 0.35, unit: "kg", yieldMlPerKg: 300, price: 6.90, waste: 0.10, source: "Shufersal online, 2026-10-18" },
    { key: "grapefruit", item: "White grapefruit (juice)", size: 1, unit: "kg", yieldMlPerKg: 400, price: 7.90, waste: 0.10, source: "Shufersal online, 2026-10-18" },
    { key: "sugar", item: "1:1 syrup (1 kg sugar makes about 1,626 ml)", size: 1626, unit: "ml", price: 5.50, waste: 0, source: "Shufersal online, 2026-10-18" },
    { key: "honey", item: "Honey syrup 2:1 (1 kg honey makes about 1,200 ml)", size: 1200, unit: "ml", price: 39.90, waste: 0, source: "Shufersal online, 2026-10-18" },
    { key: "basil", item: "Basil leaves (about 100 per 50 g)", size: 100, unit: "pieces", price: 7.90, waste: 0.20, source: "Shufersal online, 2026-10-18" },
    { key: "mint", item: "Mint leaves (about 40 per bunch)", size: 40, unit: "pieces", price: 4.90, waste: 0.20, source: "Shufersal online, 2026-10-18" },
    { key: "ginger", item: "Fresh ginger slices (about 330 per kg)", size: 330, unit: "pieces", price: 34.90, waste: 0.10, source: "Shufersal online, 2026-10-18" }
  ];

  // Course example menu (labs/module-06 solution), costed in labs/module-10/costing-project-solution.md.
  // lines: [key, quantity]; other: garnish and other, ILS ex VAT; final: final menu price incl. VAT; sold: pos-sales-week.csv
  var MENU = [
    { name: "Daiquiri", lines: [["rum", 60], ["lime", 20], ["sugar", 15]], other: 0, final: 58, sold: 70 },
    { name: "Gin Basil Smash", lines: [["gin", 60], ["lemon", 22.5], ["sugar", 22.5], ["basil", 10]], other: 0, final: 58, sold: 55 },
    { name: "Penicillin", lines: [["scotch", 60], ["lemon", 22.5], ["honey", 22.5], ["ginger", 3], ["islay", 7.5]], other: 0.50, final: 68, sold: 30 },
    { name: "Paloma", lines: [["tequila", 50], ["lime", 5], ["gfsoda", 100]], other: 0.30, final: 66, sold: 45 },
    { name: "Arak and grapefruit", lines: [["arak", 60], ["grapefruit", 120], ["basil", 1]], other: 0, final: 44, sold: 80 },
    { name: "Tom Collins", lines: [["oldtom", 45], ["lemon", 30], ["sugar", 15], ["soda", 60]], other: 1.10, final: 58, sold: 35 },
    { name: "Negroni", lines: [["gin", 30], ["campari", 30], ["vermouth", 30]], other: 0.40, final: 62, sold: 60 },
    { name: "Old Fashioned", lines: [["bourbon", 45], ["bitters", 2.4]], other: 1.25, final: 56, sold: 40 },
    { name: "Hugo Spritz", lines: [["mint", 8], ["elder", 40], ["soda", 60], ["prosecco", 60]], other: 0.30, final: 58, sold: 65 },
    { name: "Mai Tai", lines: [["jamaica", 30], ["martinique", 30], ["curacao", 15], ["orgeat", 15], ["lime", 30], ["sugar", 7.5]], other: 1.00, final: 72, sold: 25 },
    { name: "Bloody Mary", lines: [["vodka", 45], ["tomato", 90], ["lemon", 15]], other: 1.00, final: 48, sold: 20 },
    { name: "Espresso Martini", lines: [["vodka", 50], ["coffeeliq", 30], ["sugar", 10]], other: 1.60, final: 58, sold: 75 },
    { name: "Virgin Mary (alcohol-free)", lines: [["tomato", 120], ["lemon", 15]], other: 1.00, final: 26, sold: 12 },
    { name: "Grapefruit-basil soda (alcohol-free)", lines: [["grapefruit", 60], ["lime", 10], ["sugar", 10], ["basil", 3], ["soda", 100]], other: 0.02, final: 26, sold: 18 }
  ];

  // Lesson 10.3 reconciliation worksheet: five items, POS counts × standard recipes.
  var VARIANCE = {
    tolerancePct: 3,
    sales: [
      { drink: "Moscow Mule", sold: 40, uses: { vodka: 45 } },
      { drink: "Espresso Martini", sold: 50, uses: { vodka: 50 } },
      { drink: "Daiquiri", sold: 30, uses: { rum: 60 } },
      { drink: "Mojito", sold: 60, uses: { rum: 45 } },
      { drink: "Margarita", sold: 45, uses: { tequila: 50 } },
      { drink: "Aperol Spritz", sold: 70, uses: { aperol: 60 } },
      { drink: "Negroni", sold: 35, uses: { gin: 30 } },
      { drink: "Dry Martini", sold: 12, uses: { gin: 60 } }
    ],
    items: [
      { key: "vodka", item: "Vodka", bottleMl: 700, opening: 2.3, received: 5, closing: 1.0, wasteMl: 0, reason: "", costPerMl: 0.0846 },
      { key: "rum", item: "White rum", bottleMl: 750, opening: 1.4, received: 6, closing: 1.0, wasteMl: 45, reason: "Daiquiri remade (wrong drink made)", costPerMl: 0.1355 },
      { key: "tequila", item: "Tequila", bottleMl: 700, opening: 1.5, received: 3, closing: 1.2, wasteMl: 0, reason: "", costPerMl: 0.2420 },
      { key: "aperol", item: "Aperol", bottleMl: 1000, opening: 1.2, received: 4, closing: 1.2, wasteMl: 0, reason: "", costPerMl: 0.0940 },
      { key: "gin", item: "Gin", bottleMl: 700, opening: 2.0, received: 2, closing: 1.3, wasteMl: 60, reason: "Dry Martini sent back (too warm)", costPerMl: 0.1282 }
    ]
  };

  // Lesson 11.6 costing exam (labs/module-11/costing-exam-brief.md). Seed 1 = the published data.
  var EXAM = {
    extra: [{ key: "gingerbeer", item: "Ginger beer, 330 ml can", size: 330, unit: "ml", price: 5.90, waste: 0.05, source: "course assumption" }],
    target: 0.20, roundTo: 2, tolerancePct: 3,
    drinks: [
      { name: "Margarita", lines: [["tequila", 50], ["cointreau", 20], ["lime", 15]], other: 0.02, otherLabel: "half salt rim", price: 66, sold: 40 },
      { name: "Whiskey Sour", lines: [["bourbon", 45], ["lemon", 25], ["sugar", 20]], other: 1.20, otherLabel: "orange slice and cherry", price: 54, sold: 30 },
      { name: "Aperol Spritz", lines: [["prosecco", 90], ["aperol", 60], ["soda", 30]], other: 0.40, otherLabel: "orange slice", price: 52, sold: 80 },
      { name: "Moscow Mule", lines: [["vodka", 45], ["gingerbeer", 120], ["lime", 10]], other: 0.30, otherLabel: "lime slice", price: 48, sold: 50 }
    ],
    focus: "Whiskey Sour",
    stock: [
      { key: "tequila", item: "Tequila 100% agave (Patrón Silver)", bottleMl: 700, par: 3, opening: 1.5, received: 3, closing: 1.4, wasteMl: 50, reason: "Margarita remade (wrong glass)" },
      { key: "cointreau", item: "Cointreau (triple sec)", bottleMl: 700, par: 2, opening: 1.3, received: 1, closing: 1.2, wasteMl: 0, reason: "" },
      { key: "bourbon", item: "Bourbon (Jim Beam White)", bottleMl: 700, par: 3, opening: 1.6, received: 2, closing: 1.7, wasteMl: 0, reason: "" },
      { key: "aperol", item: "Aperol", bottleMl: 1000, par: 6, opening: 1.4, received: 5, closing: 1.4, wasteMl: 120, reason: "two Aperol Spritzes knocked over" },
      { key: "vodka", item: "Vodka (Smirnoff Red)", bottleMl: 700, par: 4, opening: 2.0, received: 3, closing: 1.7, wasteMl: 0, reason: "" }
    ]
  };

  var api = { PRICE_LIST: PRICE_LIST, MENU: MENU, VARIANCE: VARIANCE, EXAM: EXAM };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.CostingData = api;
})(typeof window !== "undefined" ? window : globalThis);
