# Pricing worksheet — solution (lesson 10.2)

Computed with the costing calculator's formulas (`simulations/common/bar-math.js`: `priceExVat`, `pourCost`, `grossProfit`, `margin`, `markup`, `priceForPourCost`).

## Part A

| Drink | Cost | Menu | Net | Pour cost | Gross profit | Margin | Markup |
|---|---|---|---|---|---|---|---|
| Daiquiri | 9.66 | 58 | 49.15 | 19.7% | 39.49 | 80.3% | 409% |
| Tom Collins | 11.04 | 56 | 47.46 | 23.3% | 36.42 | 76.7% | 330% |
| Bloody Mary | 6.50 | 40 | 33.90 | 19.2% | 27.40 | 80.8% | 422% |
| Paloma | 13.70 | 66 | 55.93 | 24.5% | 42.23 | 75.5% | 308% |

Most shekels: Paloma (42.23). Lowest pour cost: Bloody Mary (19.2%). Not the same drink: a low percentage on a cheap drink can earn fewer shekels than a higher percentage on an expensive one.

## Part B

| Drink | Net | × 1.18 | Menu | Real pour cost |
|---|---|---|---|---|
| Negroni | 53.00 | 62.54 | 64 | 19.5% |
| Espresso Martini | 43.41 | 51.22 | 52 | 21.7% |
| Old Fashioned | 41.95 | 49.50 | 50 | 19.8% |

## Part C

| Drink | Error | Correct |
|---|---|---|
| Old Fashioned | VAT forgotten: 42 is a net price put on the menu; real net 35.59, pour cost 23.6% | 50 |
| Bloody Mary | Markup confused with margin: × 1.8 is an 80% markup (44% margin) | 6.50 ÷ 0.20 × 1.18 = 38.35 → 40 |
| Daiquiri | Pour cost calculated on the VAT-inclusive price; real pour cost 9.66 ÷ 49.15 = 19.7%, on target | keep 58 |

## Part D

1. 229.90 ÷ 1.18 = 194.83; ÷ 700 = 0.2783 per ml; 50 × 0.2783 ÷ 0.97 = **14.35**
2. 14.35 + 1.23 = **15.58**
3. 15.58 ÷ 55.93 = **27.8%** (gross profit 40.36)
4. Any reasoned answer. Examples: keep 66 for now and watch sales, because guests compare with nearby menus; raise to 70 (pour cost 26.3%) if similar bars charge that; or move to a cheaper 100% agave tequila and re-taste. Do not quietly pour less tequila: that changes the standard recipe and misleads guests.
