# Module 10 labs — Costing and Menu Design

Price lists, worksheets and data for the Module 10 hands-on work and the module's practical piece (lesson 10.5, costing and pricing your 06.8 menu and reconciling a week of stock). Everything here is spreadsheet and calculator work; no alcohol is needed.

| File | Lesson | What it is |
|---|---|---|
| `price-list.csv` | 10.1–10.5 | 32 products: package, price incl. and ex VAT, waste allowance, yield, cost per unit, source |
| `cost-per-serving-worksheet.md` | 10.1 | Check the price list, cost three drinks, servings per bottle, your own lemon yield |
| `cost-per-serving-solution.md` | 10.1 | Worked answers |
| `pricing-worksheet.md` | 10.2 | Check four prices, set three, find a colleague's three errors, a supplier price rise |
| `pricing-solution.md` | 10.2 | Worked answers |
| `standard-recipe-template.md` | 10.3, 10.5 | One page per drink: spec, method, allergens, costing, price, description, versions |
| `reconciliation-worksheet.md` | 10.3 | Five bottles, one week: theoretical usage from POS counts, variance in ml, % and ILS |
| `reconciliation-solution.md` | 10.3 | Worked answers and likely causes |
| `menu-descriptions.md` | 10.4 | Eight descriptions to rewrite honestly |
| `menu-descriptions-solution.md` | 10.4 | Model answers |
| `menu-sales.csv` | 10.4 | Four weeks of sales, prices and costs for ten drinks (menu engineering) |
| `costing-project-brief.md` | 10.5 | Module practical: settings, prices, menu-wide check, reconciliation, report, rubric |
| `menu-costing.csv` | 10.5 | One row per ingredient line (Daiquiri filled in as an example) |
| `pos-sales-week.csv` | 10.5 | A week's sales mix for the course example menu (630 drinks) |
| `inventory-week-menu.csv` | 10.5 | Counts, deliveries, theoretical ml and waste for ten bottles of the example menu |
| `costing-project-solution.md` | 10.5 | The course example menu costed, priced and reconciled — compare after writing your own |

Templates used alongside: `templates/practice-log.md`, `templates/inventory-count.md`, `templates/waste-log.md`.

Simulation: `costing-calculator` presets `single` and `yield` (10.1), `single` (10.2), `variance` (10.3), `menu` (10.4, 10.5).

Data and sources:

- Prices marked "Shufersal online, regular price, checked 2026-10-18" are retail shelf prices including VAT (regular, not promotional prices) from shufersal.co.il, used as examples only. Bars buy at trade prices from importers and distributors, usually lower (professional judgment). Rows marked "course assumption" are invented, plausible prices for products not found there.
- Yields and piece counts are course assumptions for practice: 300 ml juice per kg of lemons or limes (in line with the lesson 03.4 reference result), 400 ml per kg of grapefruit, about 100 basil leaves per 50 g, about 40 mint leaves per bunch, about 330 ginger slices per kg; 1 kg sugar + 1 l water ≈ 1,626 ml of 1:1 syrup; 1 kg honey + 0.5 l water ≈ 1,200 ml of 2:1 honey syrup. Measure your own.
- Waste allowances are course defaults (professional judgment): spirits, liqueurs and bottled syrups 3%, sparkling wine 10%, mixers 5%, fresh juice 10%, herbs 20%, ginger 10%, house syrups 0%.
- VAT 18% in force since 1 January 2025 (Israel Tax Authority, gov.il, checked 2026-10-18).
- Sales, counts and waste logs are invented for practice, not data from a real bar.
- Formulas match `simulations/common/bar-math.js` (`priceExVat`, `costPerMl`, `yieldCostPerMl`, `costPerServing`, `servingsPerBottle`, `pourCost`, `grossProfit`, `margin`, `markup`, `priceForPourCost`, `usage`, `variance`, `variancePercent`).
- Specs are the course cards from Modules 5 and 6 (IBA unless stated, checked 2026-10-17).
