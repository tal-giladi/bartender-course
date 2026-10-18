# Module 10 plan — Costing and Menu Design

Planning file, not imported. Written 2026-10-18.

Module practical piece: 10.5 cost and price the twelve-drink menu from 06.8 (plus its alcohol-free drinks) with the costing calculator `menu` preset, set final menu prices with a target and a menu-wide check, and reconcile one week of inventory for the same menu in money. Files: `labs/module-10/price-list.csv`, `labs/module-10/menu-costing.csv`, `labs/module-10/inventory-week-menu.csv`, `labs/module-10/costing-project-brief.md`, `labs/module-10/costing-project-solution.md`.

Simulations linked: costing-calculator `single` (10.1, 10.2), `yield` (10.1), `variance` (10.3), `menu` (10.4, 10.5). `exam` is Module 11.

## Formula contract (must match `simulations/common/bar-math.js`)

- Money in ILS, volumes in ml, rates as fractions. VAT rate 18% (Israel Tax Authority, in force since 1 January 2025; checked on gov.il 2026-10-18).
- Purchase prices are converted to ex-VAT before costing: `priceExVat(p, 0.18) = p ÷ 1.18` (a VAT-registered bar reclaims input VAT).
- `costPerMl = packagePrice ÷ packageMl`.
- Waste allowance: `costPerServing` line = ml × costPerMl ÷ (1 − waste). Course defaults (professional judgment): spirits, liqueurs, vermouth, syrups bought in bottles 3%; sparkling wine 10%; mixers 5%; fresh juice 10%; herbs 20%; ginger 10%; home-made sugar and honey syrup 0%.
- `usableMl = bottleMl × (1 − waste)`; `servingsPerBottle = floor(usableMl ÷ pour)`.
- Produce: `yieldCostPerMl = pricePerKg ÷ mlPerKg`; course default yield 300 ml juice per kg of lemons or limes (03.4 reference result about 30 ml per 100 g), 400 ml per kg of grapefruit (assumption; learners measure their own).
- Garnish and "other" are `unitCost` lines (ex VAT).
- `pourCost = cost ÷ netPrice` (net = ex VAT); `grossProfit = net − cost`; `margin = (net − cost) ÷ net`; `markup = (net − cost) ÷ cost`.
- `priceForPourCost(cost, target, 0.18, roundTo)`: net = cost ÷ target; × 1.18; round UP to `roundTo` (course examples: 20% target, round to 2 ILS).
- Inventory: `usage = opening + received − closing`; `variance = used − sold`; `variance% = variance ÷ sold × 100`; money value = variance ml × costPerMl (ex VAT). Theoretical (ideal) cost = sold ml × costPerMl; actual cost = used ml × costPerMl.

## Costing-calculator presets (for the simulation agent)

| Preset | Loads | Learner task / target |
|---|---|---|
| single | Daiquiri: white rum 750 ml at 119.90 incl. VAT, 60 ml, 3% waste; lime 6.90 per 350 g pack, yield 300 ml/kg, 20 ml, 10% waste; 1:1 syrup 5.50 per kg sugar → 1,626 ml, 15 ml | cost per serving 9.66; price at 20% target, VAT 18%, round to 2 → 58; pour cost 19.7%, GP 39.49, margin 80.3%, markup 409% |
| yield | 700 ml and 750 ml bottles at pours 30/45/60 ml with waste 0–10%; produce price per kg + yield | servings per bottle; juice cost per ml (lime 0.0557) |
| variance | the 10.3 worksheet's five items (counts, received, POS-sold ml, waste, prices) | used, variance ml/%, unexplained, ILS value |
| menu | the 14 drinks of `labs/module-10/menu-costing.csv` with `price-list.csv` | cost, price at target, pour cost, GP; menu-weighted pour cost from a sales mix; CSV export |

## Lessons

| Lesson | Objectives (short) | Prereqs | Hands-on | Sources to verify |
|---|---|---|---|---|
| 10.1 Cost per serving, bottle yield and waste | ex-VAT unit cost; cost per serving with waste; servings per bottle; juice yield cost | 03.1, 03.4, 08.4 | price-list CSV; cost 4 drinks by hand; measure own lemon yield and cost; calculator `single` + `yield` | gov.il VAT history; Tax Authority on input VAT; Shufersal online prices (2026-10-18) |
| 10.2 Pour cost, margin, markup and menu prices | pour cost on net price; margin vs markup; price for target incl. VAT rounding; total-price law | 10.1 | pricing worksheet; spot VAT/markup errors; calculator `single` | Nevo Consumer Protection Law s.1, 17ב, 17ד, 17ה; BevSpot pour cost data; Wikipedia markup |
| 10.3 Standard recipes and inventory reconciliation | write a standard recipe card with cost; theoretical vs actual usage; variance in ILS | 08.4, 10.1 | standard recipe card; reconciliation worksheet; calculator `variance` | 08.4 sources; BevSpot |
| 10.4 Menu design and writing descriptions | layout by style; honest descriptions (s.2); menu engineering matrix; responsible upselling | 06.8, 10.2 | rewrite 8 descriptions; menu-engineering exercise on sales CSV | Nevo s.2; Cornell Yang/Kimes/Sessarego 2009; Loaded menu matrix; Kasavana & Smith case study |
| 10.5 Costing project | cost and price 06.8 menu; set final prices; weighted pour cost; reconcile week | 10.1–10.4, 06.8 | module practical | as above |

Prices: retail shelf prices from Shufersal online (regular, not promotional), checked 2026-10-18, incl. VAT, as examples only; items not found there are marked "course assumption". Bars buy at trade prices from importers/distributors, usually lower (professional judgment).
