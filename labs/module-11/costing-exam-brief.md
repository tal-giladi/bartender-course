# Inventory and costing assignment — brief and answer sheet (lesson 11.6)

The costing and operations part of the final assessment (10% of the grade, minimum 70%). Open book: you may use the formulas below, the Module 10 lessons and the price list, a calculator and a spreadsheet. Do not open `costing-exam-solution.md` until you have finished and scored parts A–E. Time: 90 minutes.

## The situation

A small bar in Tel Aviv sells four cocktails. The owner asks you to check the costs and prices, say what the menu earns in a normal week, reconcile last week's stock for five bottles and write the order. Prices: `../module-10/price-list.csv` (Shufersal online regular retail prices and course assumptions, incl. VAT, checked 2026-10-18), plus one extra product below. VAT 18%. Target pour cost 20%. Menu prices are rounded up to the next 2 ILS. Sales and counts are invented for practice.

Extra product (course assumption): ginger beer, 330 ml can, 5.90 ILS incl. VAT, waste allowance 5%.

### Specs (course cards, IBA) and garnish costs (ex VAT, course assumptions)

| Drink | Lines | Garnish and other |
|---|---|---|
| Margarita | tequila 50 ml, Cointreau 20 ml, lime juice 15 ml | half salt rim 0.02 |
| Whiskey Sour | bourbon 45 ml, lemon juice 25 ml, 1:1 syrup 20 ml (egg white not used) | orange slice and cherry 1.20 |
| Aperol Spritz | Prosecco 90 ml, Aperol 60 ml, soda water 30 ml (the "splash") | orange slice 0.40 |
| Moscow Mule | vodka 45 ml, ginger beer 120 ml, lime juice 10 ml | lime slice 0.30 |

### Current menu prices (incl. VAT) and a normal week's sales

| Drink | Menu price (ILS) | Sold per week |
|---|---|---|
| Margarita | 66 | 40 |
| Whiskey Sour | 54 | 30 |
| Aperol Spritz | 52 | 80 |
| Moscow Mule | 48 | 50 |

Last week's sales were exactly this normal week. Stock data: `costing-exam-inventory.csv` (counts in bottles, tenths for open bottles; par levels; logged waste). Tolerance for variance: ±3%.

### Formulas (same as Module 10 and the costing calculator)

- Price ex VAT = price incl. VAT ÷ 1.18. Cost per ml = price ex VAT ÷ ml (juice: price ex VAT per kg ÷ juice ml per kg).
- Line cost = quantity × cost per unit ÷ (1 − waste allowance). Cost per serving = sum of lines + garnish.
- Formula price = cost ÷ target × 1.18, rounded up to the next 2 ILS.
- Net price = menu price ÷ 1.18. Pour cost = cost ÷ net price. Gross profit = net price − cost. Margin = gross profit ÷ net price. Markup = gross profit ÷ cost.
- Menu pour cost = Σ(sold × cost) ÷ Σ(sold × net price). Average gross profit = Σ(sold × gross profit) ÷ drinks sold.
- Theoretical ml = Σ(drinks sold × ml per drink). Actual ml = (opening + received − closing) × bottle ml. Variance = actual − theoretical; variance % = variance ÷ theoretical × 100; unexplained = variance − logged waste; variance value = variance ml × cost per ml.
- Actual cost = theoretical cost + total variance value (other ingredients assumed at theoretical). Actual pour cost = actual cost ÷ net sales.
- Order quantity = par − closing count, rounded up to whole bottles (0 if negative).

## Answer sheet

### A. Cost per serving (8 points: 2 per drink)

| Drink | Line costs (ILS) | Cost per serving (ILS) |
|---|---|---|
| Margarita | | |
| Whiskey Sour | | |
| Aperol Spritz | | |
| Moscow Mule | | |

### B. Prices (8 points)

| Drink | Formula price at 20% (1 point each) |
|---|---|
| Margarita | |
| Whiskey Sour | |
| Aperol Spritz | |
| Moscow Mule | |

Whiskey Sour at its menu price of 54 ILS (1 point each): pour cost ____ % · gross profit ____ ILS · margin ____ % · markup ____ %

### C. Menu-wide check (5 points: 1 each)

Net sales ____ ILS · theoretical cost ____ ILS · menu pour cost ____ % · average gross profit ____ ILS per drink · actual pour cost (after part D) ____ %

### D. Reconciliation (10 points: 2 per item)

| Item | Theoretical ml | Actual ml | Variance ml | Variance % | Unexplained ml | Variance value (ILS) | Flag: none / investigate / explained by waste log |
|---|---|---|---|---|---|---|---|
| Tequila | | | | | | | |
| Cointreau | | | | | | | |
| Bourbon | | | | | | | |
| Aperol | | | | | | | |
| Vodka | | | | | | | |
| **Total** | | | | | | | |

### E. Order list (5 points: 1 per item)

| Item | Par | Closing | Order (bottles) |
|---|---|---|---|
| Tequila | | | |
| Cointreau | | | |
| Bourbon | | | |
| Aperol | | | |
| Vodka | | | |

### F. Report to the owner (4 points, 5–8 lines)

Write: the menu pour cost against the 20% target and which drinks drive it; one action with a number (a new price or a cheaper product) and its effect; the flagged stock items, including any usage below theoretical; your first two checks, in order.

## Marking

| Part | Full points if | Partial |
|---|---|---|
| A | each cost within ±0.05 ILS of the solution: 2 | within ±0.50: 1 |
| B | formula prices exact; pour cost and margin within ±0.2 points; gross profit within ±0.05 ILS; markup within ±1 point | — |
| C | money within ±1.00 ILS, percentages within ±0.2 points, average gross profit within ±0.05 ILS | — |
| D | per item: actual, variance ml and % correct (1); unexplained, value within ±0.05 ILS and flag correct (1) | — |
| E | each order quantity exact | — |
| F | 1 point each: pour cost vs target with the two driving drinks named; one action with a number and its effect; flags named, including the negative variance; two checks in a sensible order (recount before blaming people) | — |

The costing calculator's exam preset marks parts A–E (36 points) with these tolerances; you add part F (4 points) yourself.

Score: ____ / 40 = ____ %. Minimum 70% (28 points). Self-scored and unverified; if you can, show your report to a bar manager.
