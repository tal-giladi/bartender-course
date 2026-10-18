# Inventory reconciliation — solution (lesson 10.3)

Formulas as in `simulations/common/bar-math.js` (`usage`, `variance`, `variancePercent`) plus value = variance ml × cost per ml.

## Theoretical usage

- Vodka: 40 × 45 + 50 × 50 = 1,800 + 2,500 = 4,300 ml
- White rum: 30 × 60 + 60 × 45 = 1,800 + 2,700 = 4,500 ml
- Tequila: 45 × 50 = 2,250 ml
- Aperol: 70 × 60 = 4,200 ml
- Gin: 35 × 30 + 12 × 60 = 1,050 + 720 = 1,770 ml

## Reconciliation

| Item | Actual (bottles → ml) | Variance ml | % | Unexplained ml (%) | Value (ILS) | Unexplained value | Flag |
|---|---|---|---|---|---|---|---|
| Vodka | 2.3 + 5 − 1.0 = 6.3 → 4,410 | 110 | 2.6% | 110 (2.6%) | 9.31 | 9.31 | — |
| White rum | 1.4 + 6 − 1.0 = 6.4 → 4,800 | 300 | 6.7% | 255 (5.7%) | 40.65 | 34.55 | yes |
| Tequila | 1.5 + 3 − 1.2 = 3.3 → 2,310 | 60 | 2.7% | 60 (2.7%) | 14.52 | 14.52 | — |
| Aperol | 1.2 + 4 − 1.2 = 4.0 → 4,000 | −200 | −4.8% | −200 (−4.8%) | −18.80 | −18.80 | yes |
| Gin | 2.0 + 2 − 1.3 = 2.7 → 1,890 | 120 | 6.8% | 60 (3.4%) | 15.38 | 7.69 | yes |
| **Total** | | | | | **61.06** | | |

Theoretical cost 2,139.74 ILS; actual cost 2,200.80 ILS; difference 61.06 ILS (the total variance value).

## Investigation (one good answer)

| Item | Check 1 | Check 2 | Most likely cause |
|---|---|---|---|
| White rum | recount; check delivery notes (750 ml bottles entered as 750?) | is the Mojito on the POS and mapped to 45 ml? | over-pouring in the free-poured, muddled Mojito, or Mojitos not rung in |
| Aperol | recount; check last week's closing equals this week's opening | jigger check on Spritzes; are any Spritzes rung twice? | opening count too high, or Spritzes made with less than 60 ml |
| Gin | recount | jigger check on Negronis and Martinis | small over-pour; only just over tolerance after the logged Martini |

Vodka and tequila are inside 3% and need no action this week, but keep an eye on them next week.
