# Inventory worksheet (lesson 08.4)

Data: `inventory-week.csv`, one invented week at a small cocktail bar (practice numbers, not real data). Bar tolerance for this exercise: ±3% unexplained variance.

Formulas (same as `templates/inventory-count.md` and the course's simulations):

- used (bottles) = opening + received − closing; used (ml) = used bottles × bottle ml
- variance (ml) = used − sold per POS; variance % = variance ÷ sold × 100
- unexplained variance = variance − logged waste
- order = par − closing count, rounded up to whole bottles (0 if negative)

| Item | Used (bottles) | Used (ml) | Variance (ml) | Variance % | Unexplained (ml) | Unexplained % | Outside ±3%? | Order |
|---|---|---|---|---|---|---|---|---|
| Vodka | | | | | | | | |
| Gin | | | | | | | | |
| White rum | | | | | | | | |
| Tequila | | | | | | | | |
| Aperol | | | | | | | | |
| Campari | | | | | | | | |
| Sweet vermouth | | | | | | | | |
| Coffee liqueur | | | | | | | | |

## For each item outside tolerance

| Item | Two likely causes | What I check first |
|---|---|---|
| | | |
| | | |
| | | |

## Weigh-count

Empty bottle weight: ______ g. Density of water 1.00 g/ml.

| Run | Eye estimate (tenths) | Scale (g) | Scale → ml | Jug (ml) |
|---|---|---|---|---|
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

Check: `inventory-worksheet-solution.md`.
