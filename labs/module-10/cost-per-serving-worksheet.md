# Cost per serving worksheet (lesson 10.1)

Use `price-list.csv` (prices incl. VAT, ex VAT, waste allowance and cost per unit). Keep four decimals until the end; round line costs and totals to 2 decimals. Formulas:

- price ex VAT = price incl. VAT ÷ 1.18
- cost per ml = package price ex VAT ÷ package ml (produce: price per kg ex VAT ÷ ml of juice per kg)
- line cost = quantity × cost per unit ÷ (1 − waste allowance)
- cost per serving = sum of line costs + garnish and other

## Part A — check the price list

| Item | Price incl. VAT | Your ex-VAT price | Package | Your cost per unit |
|---|---|---|---|---|
| Campari | 105.90 | | 700 ml | |
| Sweet vermouth | 64.90 | | 750 ml | |
| Lemons (yield 300 ml/kg) | 12.90 per kg | | 1 kg | per ml of juice: |

## Part B — cost three drinks

Garnish and other (ex VAT, course assumptions): orange slice 0.40; celery stick 0.50; Bloody Mary seasoning (Worcestershire, Tabasco, celery salt, pepper) 0.50.

### Negroni (IBA, lesson 05.3): gin 30 ml, Campari 30 ml, sweet vermouth 30 ml, half orange slice

| Line | Quantity | Cost per unit | Waste | Line cost |
|---|---|---|---|---|
| Gin | 30 ml | | 3% | |
| Campari | 30 ml | | 3% | |
| Sweet vermouth | 30 ml | | 3% | |
| Orange slice | 1 | 0.40 | — | 0.40 |
| **Total** | | | | |

### Bloody Mary (IBA, lesson 06.4): vodka 45 ml, tomato juice 90 ml, lemon juice 15 ml, seasoning, celery stick

| Line | Quantity | Cost per unit | Waste | Line cost |
|---|---|---|---|---|
| Vodka | 45 ml | | 3% | |
| Tomato juice | 90 ml | | 5% | |
| Lemon juice | 15 ml | | 10% | |
| Seasoning | 1 | 0.50 | — | 0.50 |
| Celery stick | 1 | 0.50 | — | 0.50 |
| **Total** | | | | |

### Arak and grapefruit (Saveur, lesson 06.7): arak 60 ml, fresh grapefruit juice 120 ml, 1 basil leaf

| Line | Quantity | Cost per unit | Waste | Line cost |
|---|---|---|---|---|
| Arak | 60 ml | | 3% | |
| Grapefruit juice (yield 400 ml/kg) | 120 ml | | 10% | |
| Basil leaf | 1 | | 20% | |
| **Total** | | | | |

## Part C — servings per bottle

servings = bottle ml × (1 − waste) ÷ pour, rounded down.

1. 700 ml gin, 45 ml pour, 3% waste:
2. 700 ml vodka, 30 ml pour, 3% waste:
3. 750 ml white rum, 60 ml pour, 3% waste:
4. 1,000 ml Aperol, 60 ml pour, 3% waste:

## Part D — your own lemon juice

| Fruit weight (g) | Price paid (incl. VAT) | Price per kg ex VAT | Juice (ml) | Yield (ml per kg) | Cost per ml of juice |
|---|---|---|---|---|---|
| | | | | | |

Answers: `cost-per-serving-solution.md`.
