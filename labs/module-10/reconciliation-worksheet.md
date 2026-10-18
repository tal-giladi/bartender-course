# Inventory reconciliation worksheet (lesson 10.3)

A small bar serving Module 5 drinks, one week. Counts are in bottles (tenths for open bottles); prices are ex VAT from `price-list.csv`. The data is invented for practice. Tolerance: 3%.

## 1. Standard recipes (product ml per drink)

| Drink | Vodka | White rum | Tequila | Aperol | Gin |
|---|---|---|---|---|---|
| Moscow Mule | 45 | | | | |
| Espresso Martini | 50 | | | | |
| Daiquiri | | 60 | | | |
| Mojito | | 45 | | | |
| Margarita | | | 50 | | |
| Aperol Spritz | | | | 60 | |
| Negroni | | | | | 30 |
| Dry Martini | | | | | 60 |

## 2. POS drink counts for the week

| Drink | Sold |
|---|---|
| Moscow Mule | 40 |
| Espresso Martini | 50 |
| Daiquiri | 30 |
| Mojito | 60 |
| Margarita | 45 |
| Aperol Spritz | 70 |
| Negroni | 35 |
| Dry Martini | 12 |

## 3. Counts, deliveries and waste log

| Item | Bottle ml | Opening | Received | Closing | Logged waste (ml) | Reason | Cost per ml (ex VAT) |
|---|---|---|---|---|---|---|---|
| Vodka | 700 | 2.3 | 5 | 1.0 | 0 | | 0.0846 |
| White rum | 750 | 1.4 | 6 | 1.0 | 45 | Daiquiri remade (wrong drink made) | 0.1355 |
| Tequila | 700 | 1.5 | 3 | 1.2 | 0 | | 0.2420 |
| Aperol | 1,000 | 1.2 | 4 | 1.2 | 0 | | 0.0940 |
| Gin | 700 | 2.0 | 2 | 1.3 | 60 | Dry Martini sent back (too warm) | 0.1282 |

## 4. Your reconciliation

| Item | Theoretical ml | Actual ml | Variance ml | Variance % | Unexplained ml | Unexplained % | Variance value (ILS) | Outside 3%? |
|---|---|---|---|---|---|---|---|---|
| Vodka | | | | | | | | |
| White rum | | | | | | | | |
| Tequila | | | | | | | | |
| Aperol | | | | | | | | |
| Gin | | | | | | | | |
| **Total** | | | | | | | | |

Theoretical cost (Σ theoretical ml × cost per ml): ______ Actual cost: ______ Difference: ______

## 5. Investigation

For each flagged item: the first two checks you would run, and the most likely cause.

| Item | Check 1 | Check 2 | Most likely cause |
|---|---|---|---|
| | | | |

Answers: lesson 10.3, Hands-on, "Reference result", and `reconciliation-solution.md`.
