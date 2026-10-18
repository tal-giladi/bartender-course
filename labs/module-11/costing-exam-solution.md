# Inventory and costing assignment — worked solution (lesson 11.6)

Open only after you have finished and scored your own answers. Computed with the costing calculator's formulas (`simulations/common/bar-math.js`) and the Module 10 price list (checked 2026-10-18); VAT 18%; target 20%; prices rounded up to 2 ILS. Small differences (±0.01) come from rounding cost per ml to four decimals; the marking tolerances allow for them.

## A. Cost per serving

| Drink | Lines (ILS, ex VAT) | Cost |
|---|---|---|
| Margarita | tequila 50 × 0.2420 ÷ 0.97 = 12.47; Cointreau 20 × 0.1754 ÷ 0.97 = 3.62; lime 15 × 0.0557 ÷ 0.90 = 0.93; salt 0.02 | **17.04** |
| Whiskey Sour | bourbon 45 × 0.1343 ÷ 0.97 = 6.23; lemon 25 × 0.0364 ÷ 0.90 = 1.01; 1:1 syrup 20 × 0.0029 = 0.06; garnish 1.20 | **8.50** |
| Aperol Spritz | Prosecco 90 × 0.0565 ÷ 0.90 = 5.65; Aperol 60 × 0.0940 ÷ 0.97 = 5.81; soda 30 × 0.0042 ÷ 0.95 = 0.13; garnish 0.40 | **11.99** |
| Moscow Mule | vodka 45 × 0.0846 ÷ 0.97 = 3.93; ginger beer: 5.90 ÷ 1.18 = 5.00 ÷ 330 = 0.0152 per ml, 120 × 0.0152 ÷ 0.95 = 1.91; lime 10 × 0.0557 ÷ 0.90 = 0.62; garnish 0.30 | **6.76** |

## B. Prices

| Drink | Cost | cost ÷ 0.20 × 1.18 | Formula price | Menu price | Net | Pour cost | Gross profit |
|---|---|---|---|---|---|---|---|
| Margarita | 17.04 | 100.54 | **102** | 66 | 55.93 | 30.5% | 38.89 |
| Whiskey Sour | 8.50 | 50.15 | **52** | 54 | 45.76 | 18.6% | 37.26 |
| Aperol Spritz | 11.99 | 70.74 | **72** | 52 | 44.07 | 27.2% | 32.08 |
| Moscow Mule | 6.76 | 39.88 | **40** | 48 | 40.68 | 16.6% | 33.92 |

Whiskey Sour at 54: net 54 ÷ 1.18 = 45.76; pour cost 8.50 ÷ 45.76 = **18.6%**; gross profit 45.76 − 8.50 = **37.26 ILS**; margin 37.26 ÷ 45.76 = **81.4%**; markup 37.26 ÷ 8.50 = **438%**. (Common errors: 15.7% if VAT is left in the price; markup and margin swapped.)

## C. Menu-wide check (200 drinks)

- Net sales: (40 × 66 + 30 × 54 + 80 × 52 + 50 × 48) ÷ 1.18 = 10,820 ÷ 1.18 = **9,169.49 ILS**
- Theoretical cost: 40 × 17.04 + 30 × 8.50 + 80 × 11.99 + 50 × 6.76 = 681.60 + 255.00 + 959.20 + 338.00 = **2,233.80 ILS**
- Menu pour cost: 2,233.80 ÷ 9,169.49 = **24.4%** (above the 20% target)
- Average gross profit: (9,169.49 − 2,233.80) ÷ 200 = **34.68 ILS** per drink
- Actual pour cost (after D): (2,233.80 + 57.07) ÷ 9,169.49 = 2,290.87 ÷ 9,169.49 = **25.0%**

## D. Reconciliation

Theoretical ml: tequila 40 × 50 = 2,000; Cointreau 40 × 20 = 800; bourbon 30 × 45 = 1,350; Aperol 80 × 60 = 4,800; vodka 50 × 45 = 2,250.

| Item | Theoretical | Actual | Variance | % | Logged waste | Unexplained | Cost per ml | Value (ILS) | Flag |
|---|---|---|---|---|---|---|---|---|---|
| Tequila | 2,000 | (1.5 + 3 − 1.4) × 700 = 2,170 | 170 | 8.5% | 50 | 120 (6.0%) | 0.2420 | 41.14 | investigate |
| Cointreau | 800 | (1.3 + 1 − 1.2) × 700 = 770 | −30 | −3.8% | 0 | −30 | 0.1754 | −5.26 | investigate (below theoretical) |
| Bourbon | 1,350 | (1.6 + 2 − 1.7) × 700 = 1,330 | −20 | −1.5% | 0 | −20 | 0.1343 | −2.69 | none |
| Aperol | 4,800 | (1.4 + 5 − 1.4) × 1,000 = 5,000 | 200 | 4.2% | 120 | 80 (1.7%) | 0.0940 | 18.80 | explained by waste log |
| Vodka | 2,250 | (2.0 + 3 − 1.7) × 700 = 2,310 | 60 | 2.7% | 0 | 60 | 0.0846 | 5.08 | none |
| **Total** | | | | | | | | **57.07** | |

The Cointreau is used *less* than the POS says. That is not good news: it points to short pours on Margaritas (guests getting a different drink), a miscount, or a Margarita rung up but not made. It deserves a check like any over-use.

## E. Order list

| Item | Par | Closing | Par − closing | Order |
|---|---|---|---|---|
| Tequila | 3 | 1.4 | 1.6 | **2** |
| Cointreau | 2 | 1.2 | 0.8 | **1** |
| Bourbon | 3 | 1.7 | 1.3 | **2** |
| Aperol | 6 | 1.4 | 4.6 | **5** |
| Vodka | 4 | 1.7 | 2.3 | **3** |

## F. Example report (4 / 4)

The menu runs at 24.4% pour cost on a normal week (25.0% after last week's stock count), above our 20% target, with an average gross profit of 34.68 ILS a drink. The Aperol Spritz (80 a week at 27.2%) and the Margarita (30.5%, premium tequila) drive it. Raising the Spritz to 58 ILS (24.4%) alone brings the menu to 23.3%; switching the Margarita to a 100% agave tequila at about 130 ILS incl. VAT (course assumption) brings it to 22.7% and the menu, with both changes, to 21.5%. Stock: tequila 8.5% over (120 ml unexplained) and Cointreau 3.8% under theoretical; Aperol's 4.2% is explained by the two spills. First checks: recount tequila and Cointreau, then compare the Margarita's POS count with the tickets and watch the Margarita pour with a jigger check.
