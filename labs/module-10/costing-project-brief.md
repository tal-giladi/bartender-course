# Costing project — brief and rubric (lesson 10.5)

Module 10 practical piece. You cost and price the menu you built in lesson 06.8 (twelve cocktails and at least two alcohol-free drinks), check what the whole menu will do for a week of sales, and reconcile a week of stock in shekels.

## Files

| File | Use |
|---|---|
| `price-list.csv` | example prices (incl. and ex VAT, waste allowance, cost per unit, source, date); extend it with your own products |
| `menu-costing.csv` | one row per ingredient line; the Daiquiri is filled in as an example |
| `pos-sales-week.csv` | a week's sales mix for the course example menu (use it, or estimate your own for your bar) |
| `inventory-week-menu.csv` | a week of counts, deliveries, theoretical ml and waste for ten bottles of the example menu |
| `standard-recipe-template.md` | for any drink you change |

Formulas (same as the costing calculator): price ex VAT = price incl. VAT ÷ 1.18; line cost = quantity × cost per unit ÷ (1 − waste); formula price = cost ÷ target × 1.18, rounded up; pour cost = cost ÷ (menu price ÷ 1.18); menu pour cost = Σ(sold × cost) ÷ Σ(sold × net price); variance = actual − theoretical; variance value = variance ml × cost per ml.

## 1. Settings

- Target pour cost: ______ % (course default 20%)
- Rounding step: ______ ILS (course default 2)
- Price list date and sources: ______
- Your lemon yield (lesson 10.1): ______ ml per kg

## 2. Prices

| Drink | Cost | Formula price | Final price | Pour cost | Gross profit | Reason for any change |
|---|---|---|---|---|---|---|
| | | | | | | |

## 3. Menu-wide check

- Drinks in the sales mix: ______
- Net sales: ______ ILS
- Theoretical cost: ______ ILS
- Menu pour cost: ______ %
- Average gross profit per drink: ______ ILS
- Drink to act on first, and what you would do: ______

## 4. Reconciliation

| Item | Theoretical ml | Actual ml | Variance ml | % | Unexplained ml | Variance ILS | Flag (> 3%) |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

Total variance value: ______ ILS · Actual cost: ______ ILS · Actual pour cost: ______ %

## 5. Report (5–10 lines)

Menu pour cost and average gross profit; weakest drink and your action; biggest variance and your first two checks; one thing you would change before launch.

## 6. Rubric (self-scored, 20 points; pass 14)

| Criterion | 0 | 1 | 2 |
|---|---|---|---|
| Price list | no dates or sources | dated, some prices still incl. VAT | every price ex VAT, dated, sourced |
| Costing completeness | drinks or lines missing | all drinks, some small lines missing | every drink and line, incl. garnish and alcohol-free drinks |
| Costing accuracy (two drinks checked by hand vs calculator) | off by > 0.50 ILS | off by 0.10–0.50 | within 0.10 |
| Waste allowances | none | one value for everything | by ingredient type |
| Formula prices | VAT forgotten or margin/markup mixed up | correct, rounding down | correct, rounded up |
| Final prices | no reasons | reasons for some changes | a reason for every change; bands by section |
| Alcohol-free drinks | not costed or priced | costed or priced | costed and priced as real choices |
| Menu-wide pour cost | not calculated | simple average of pour costs | sales-weighted, with an action |
| Reconciliation | ml only | ml and %, no ILS | ml, %, unexplained, ILS, actual pour cost |
| Report | missing | numbers without actions | numbers, actions and checks in order |

This score is self-assessed and unverified. If you can, ask a working bartender or bar manager to look at your prices and tell you what they would change.
