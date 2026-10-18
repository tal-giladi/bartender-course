# Costing project — example solution (lesson 10.5)

The course example menu from `labs/module-06/twelve-cocktail-menu-solution.md` (neighbourhood cocktail bar, Haifa), costed and priced. Compare your reasoning, not your numbers: your drinks, prices and yields will differ. All numbers are computed with the costing calculator's formulas (`simulations/common/bar-math.js`). Prices: `price-list.csv` (Shufersal online regular retail prices incl. VAT and course assumptions, checked 2026-10-18); VAT 18%; target pour cost 20%; prices rounded up to 2 ILS.

## 1. Costings

Garnish and other (ex VAT, course assumptions): candied ginger 0.50; lime slice or wedge 0.30; lemon slice 0.30; maraschino cherry 0.80; orange slice 0.40; sugar cube 0.05; Mai Tai garnish (pineapple, mint, lime peel) 1.00; celery stick 0.50; Bloody Mary seasoning 0.50; espresso shot 1.50; 3 coffee beans 0.10; pinch of salt 0.02. Specs: the course cards (IBA unless stated); the Daiquiri uses 15 ml 1:1 syrup instead of 2 bar spoons of sugar (06.8 house spec); the Old Fashioned counts 3 dashes of bitters (2.4 ml); the grapefruit-basil soda counts 100 ml of soda.

| # | Drink | Lines (ILS, ex VAT) | Cost per serving |
|---|---|---|---|
| 1 | Daiquiri | White rum 60 ml 8.38; Limes 20 ml 1.24; 1:1 syrup 15 ml 0.04 | **9.66** |
| 2 | Gin Basil Smash | London dry gin 60 ml 7.93; Lemons 22.5 ml 0.91; 1:1 syrup 22.5 ml 0.06; Basil 10 0.84 | **9.74** |
| 3 | Penicillin | Blended Scotch 60 ml 7.86; Lemons 22.5 ml 0.91; Honey syrup 2:1 22.5 ml 0.63; Fresh ginger 3 0.30; Islay single malt 7.5 ml 2.81; garnish and other 0.50 | **13.01** |
| 4 | Paloma | Tequila 100% agave 50 ml 12.47; Limes 5 ml 0.31; Pink grapefruit soda 100 ml 0.62; garnish and other 0.30 | **13.70** |
| 5 | Arak and grapefruit | Arak 60 ml 4.86; White grapefruit 120 ml 2.23; Basil 1 0.08 | **7.18** |
| 6 | Tom Collins | Old Tom gin 45 ml 8.42; Lemons 30 ml 1.21; 1:1 syrup 15 ml 0.04; Soda water 60 ml 0.26; garnish and other 1.10 | **11.04** |
| 7 | Negroni | London dry gin 30 ml 3.97; Campari 30 ml 3.97; Sweet vermouth 30 ml 2.27; garnish and other 0.40 | **10.60** |
| 8 | Old Fashioned | Bourbon 45 ml 6.23; Angostura bitters 2.4 ml 0.92; garnish and other 1.25 | **8.39** |
| 9 | Hugo Spritz | Mint 8 1.04; Elderflower liqueur 40 ml 7.49; Soda water 60 ml 0.26; Prosecco 60 ml 3.77; garnish and other 0.30 | **12.86** |
| 10 | Mai Tai | Amber Jamaican rum 30 ml 4.87; Martinique rum 30 ml 5.99; Orange curaçao 15 ml 1.68; Orgeat syrup 15 ml 1.12; Limes 30 ml 1.86; 1:1 syrup 7.5 ml 0.02; garnish and other 1.00 | **16.54** |
| 11 | Bloody Mary | Vodka 45 ml 3.93; Tomato juice 90 ml 0.96; Lemons 15 ml 0.61; garnish and other 1.00 | **6.50** |
| 12 | Espresso Martini | Vodka 50 ml 4.36; Coffee liqueur 30 ml 3.56; 1:1 syrup 10 ml 0.03; garnish and other 1.60 | **9.55** |
| 13 | Virgin Mary (alcohol-free) | Tomato juice 120 ml 1.28; Lemons 15 ml 0.61; garnish and other 1.00 | **2.89** |
| 14 | Grapefruit-basil soda (alcohol-free) | White grapefruit 60 ml 1.12; Limes 10 ml 0.62; 1:1 syrup 10 ml 0.03; Basil 3 0.25; Soda water 100 ml 0.44; garnish and other 0.02 | **2.47** |

Notes: the base spirit is the largest line in every cocktail; the Paloma's premium tequila is 91% of its cost; the Mai Tai's two rums are two thirds of its cost.

## 2. Prices

| Drink | Cost | Price at 20% | Final price | Net | Pour cost | Gross profit | Reason |
|---|---|---|---|---|---|---|---|
| Daiquiri | 9.66 | 58 | 58 | 49.15 | 19.7% | 39.49 | sets the sours' band |
| Gin Basil Smash | 9.74 | 58 | 58 | 49.15 | 19.8% | 39.41 | — |
| Penicillin | 13.01 | 78 | 68 | 57.63 | 22.6% | 44.62 | top of the sours' band |
| Mai Tai | 16.54 | 98 | 72 | 61.02 | 27.1% | 44.47 | market ceiling; high gross profit |
| Paloma | 13.70 | 82 | 66 | 55.93 | 24.5% | 42.23 | premium tequila; long band |
| Tom Collins | 11.04 | 66 | 58 | 49.15 | 22.5% | 38.11 | long band |
| Hugo Spritz | 12.86 | 76 | 58 | 49.15 | 26.2% | 36.30 | spritz band; review next month |
| Arak and grapefruit | 7.18 | 44 | 44 | 37.29 | 19.2% | 30.11 | local serve, kept accessible |
| Old Fashioned | 8.39 | 50 | 56 | 47.46 | 17.7% | 39.06 | stirred band |
| Negroni | 10.60 | 64 | 62 | 52.54 | 20.2% | 41.94 | stirred band |
| Bloody Mary | 6.50 | 40 | 48 | 40.68 | 16.0% | 34.18 | brunch band |
| Espresso Martini | 9.55 | 58 | 58 | 49.15 | 19.4% | 39.60 | — |
| Virgin Mary (0%) | 2.89 | 18 | 26 | 22.03 | 13.1% | 19.14 | alcohol-free band |
| Grapefruit-basil soda (0%) | 2.47 | 16 | 26 | 22.03 | 11.2% | 19.56 | alcohol-free band |

## 3. Menu-wide check (week in `pos-sales-week.csv`, 630 drinks)

- Net sales: 30,025.42 ILS (35,430 ILS incl. VAT)
- Theoretical cost: 6,325.50 ILS
- Menu pour cost: 6,325.50 ÷ 30,025.42 = **21.1%**
- Average gross profit: 23,699.92 ÷ 630 = **37.62 ILS** per drink
- Action: the Hugo Spritz sells 65 a week at 26.2%. At 62 ILS the menu pour cost falls to 20.9%; a lower elderflower liqueur price would lower it further. The Mai Tai (27.1%) sells only 25 and earns 44.47 ILS a glass: keep.

## 4. Reconciliation (`inventory-week-menu.csv`, tolerance 3%)

| Item | Theoretical ml | Actual ml | Variance ml | % | Logged waste | Unexplained ml | Cost per ml | Variance ILS | Flag |
|---|---|---|---|---|---|---|---|---|---|
| Gin (700) | 5,100 | 5,180 | 80 | 1.6% | 0 | 80 | 0.1282 | 10.26 | — |
| White rum (750) | 4,200 | 4,500 | 300 | 7.1% | 60 | 240 | 0.1355 | 40.64 | yes |
| Vodka (700) | 4,650 | 4,620 | −30 | −0.6% | 0 | −30 | 0.0846 | −2.54 | — |
| Tequila (700) | 2,250 | 2,520 | 270 | 12.0% | 0 | 270 | 0.2420 | 65.34 | yes |
| Arak (700) | 4,800 | 4,900 | 100 | 2.1% | 0 | 100 | 0.0786 | 7.86 | — |
| Campari (700) | 1,800 | 1,820 | 20 | 1.1% | 0 | 20 | 0.1282 | 2.56 | — |
| Sweet vermouth (750) | 1,800 | 1,875 | 75 | 4.2% | 75 | 0 | 0.0733 | 5.50 | explained |
| Elderflower (700) | 2,600 | 2,660 | 60 | 2.3% | 0 | 60 | 0.1816 | 10.90 | — |
| Bourbon (700) | 1,800 | 1,960 | 160 | 8.9% | 45 | 115 | 0.1343 | 21.48 | yes |
| Coffee liqueur (700) | 2,250 | 2,310 | 60 | 2.7% | 0 | 60 | 0.1150 | 6.90 | — |
| **Total** | | | | | | | | **168.90** | |

Theoretical check, gin: 55 Gin Basil Smash × 60 + 60 Negroni × 30 = 3,300 + 1,800 = 5,100 ml. Vodka: 20 Bloody Mary × 45 + 75 Espresso Martini × 50 = 900 + 3,750 = 4,650 ml.

Actual cost = 6,325.50 + 168.90 = 6,494.40 ILS (the other ingredients were not counted and are assumed at theoretical). Actual pour cost = 6,494.40 ÷ 30,025.42 = **21.6%**, 0.56 points above theoretical.

## 5. Example report

Menu pour cost 21.1% on a typical week, average gross profit 37.62 ILS; actual 21.6% after the stock count. Weakest drink: Hugo Spritz (26.2%, high sales) — raise to 62 or find a cheaper elderflower liqueur. Biggest variance: tequila, 270 ml (12.0%, 65 ILS) with nothing in the waste log; first checks: recount and check the Paloma POS button, then jigger checks on the Paloma (long drink, easy to over-pour). Rum 7.1% (240 ml unexplained): check whether every Daiquiri remake was logged, then the pour. Bourbon 8.9% with a logged spill: recount, then jigger check on the Old Fashioned. Vermouth is fully explained by the discarded bottle: date opened vermouth and keep it in the fridge (lesson 08.2). Rubric self-score: 19/20.
