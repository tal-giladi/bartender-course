---
id: "10.5"
module: 10
minutes: 15
practice_minutes: 120
prerequisites: ["06.8", "10.1", "10.2", "10.3", "10.4"]
objectives:
  - Cost every drink on your 06.8 menu, including the alcohol-free drinks, from a dated price list, and check the totals in the costing calculator.
  - Set final VAT-inclusive menu prices from a target pour cost, adjusted for the market and gross profit, and justify every adjustment in one line.
  - Calculate the menu-wide (sales-weighted) theoretical pour cost from a week's sales mix.
  - Reconcile a week's inventory for the menu in ml and ILS and state the gap between theoretical and actual pour cost.
volatility: implementation
sources:
  - title: "Israel Tax Authority — History of VAT rates (gov.il)"
    url: https://www.gov.il/he/pages/vat-history
  - title: "Consumer Protection Law, 5741-1981 (Nevo), sections 2 and 17D"
    url: https://www.nevo.co.il/law_html/law00/70305.htm
  - title: "BevSpot — What's the average pour cost in the bar industry? (2016)"
    url: https://bevspot.com/blog/whats-average-pour-cost-bar-industry/
  - title: "Shufersal online (retail prices used as examples)"
    url: https://www.shufersal.co.il/online/he/
last_verified: "2026-10-18"
---

# 10.5 · Costing project: price your menu

This is the module's practical piece. You take the twelve-cocktail menu you built in lesson 06.8, with its alcohol-free drinks, and finish the two columns you left empty: cost per serving and menu price. You cost every drink from a dated price list, set prices from a target and then adjust them with judgment, calculate what the whole menu's pour cost will be for a realistic week of sales, and reconcile a week of stock for the same menu in shekels. The result is a costing pack you could hand to a bar manager, and it is also practice for the costing part of the final assessment in Module 11.

## Why it matters

When a bar launches a new menu, someone has to answer three questions before the first guest sees it: what does each drink cost us, what do we charge, and will the menu as a whole make money at the mix of drinks guests actually order? A month later the owner asks a fourth: did the stock disappear the way the menu said it would? A bartender who can answer all four, with numbers and reasons, is doing a job usually given to a head bartender or a bar manager.

## Core ideas

### What you hand in

| Part | Content | Tool |
|---|---|---|
| 1. Price list | every product your menu uses, with package, price incl. and ex VAT, waste allowance, cost per unit, source and date | `price-list.csv` (extend or replace with your own prices) |
| 2. Costing | one costing per drink, every line, total cost per serving | `menu-costing.csv` and the costing calculator |
| 3. Prices | formula price at your target, final price, real pour cost, gross profit, one-line reason for every change | spreadsheet |
| 4. Menu-wide check | sales-weighted theoretical pour cost and average gross profit for a week's sales mix | spreadsheet or calculator |
| 5. Reconciliation | a week of stock for ten bottles: variance ml, %, unexplained, ILS; actual vs theoretical pour cost | `inventory-week-menu.csv` |
| 6. Short report | five to ten lines: the menu's pour cost, its weakest drink, the biggest variance and what you would do | the brief |

### From the formula price to the final price

Pricing every drink at exactly 20% gives a list no guest would read: in the course's example menu the Mai Tai comes out at 98 ILS and the Virgin Mary at 18. Bars therefore set the formula price first, then adjust (all professional judgment, with a written reason):

- **Price bands.** Drinks of one style usually sit within a few shekels of each other, so guests choose by taste, not by price.
- **Expensive ingredients.** A drink with a premium spirit may run a higher pour cost if its gross profit in shekels is still healthy (lesson 10.2).
- **Cheap drinks.** A drink with a very low cost can be priced above its formula price, in line with its section.
- **Alcohol-free drinks.** Priced so they are a real choice, not an afterthought; their pour cost is usually low because they cost little.
- **The market.** Compare with the menus you surveyed in [lesson 06.7](../module-06/lesson-07.md).

### The menu-wide pour cost

Individual pour costs do not tell you what the menu will do; the **sales mix** does. For a week's sales:

$$\text{net sales} = \sum (\text{drinks sold} \times \text{net price}) \qquad \text{theoretical cost} = \sum (\text{drinks sold} \times \text{cost per serving})$$

$$\text{menu pour cost} = \frac{\text{theoretical cost}}{\text{net sales}} \qquad \text{average gross profit} = \frac{\sum (\text{drinks sold} \times \text{gross profit})}{\text{drinks sold}}$$

If the menu pour cost is above target, the drinks that sell most and run the highest pour cost are where to act first.

### The course example, costed

The example menu from [the 06.8 solution](../../labs/module-06/twelve-cocktail-menu-solution.md) (Haifa neighbourhood bar), costed with the course price list (Shufersal online regular prices and marked assumptions, incl. VAT, checked 2026-10-18; VAT 18%), target 20%, rounded up to 2 ILS:

| Drink | Cost | Price at 20% | Final price | Pour cost | Gross profit | Reason for the change |
|---|---|---|---|---|---|---|
| Daiquiri | 9.66 | 58 | 58 | 19.7% | 39.49 | — (sets the sours' band) |
| Gin Basil Smash | 9.74 | 58 | 58 | 19.8% | 39.41 | — |
| Penicillin | 13.01 | 78 | 68 | 22.6% | 44.62 | top of the sours' band; Islay float is expensive |
| Mai Tai | 16.54 | 98 | 72 | 27.1% | 44.47 | market ceiling; still a high gross profit |
| Paloma | 13.70 | 82 | 66 | 24.5% | 42.23 | premium tequila; long drinks band |
| Tom Collins | 11.04 | 66 | 58 | 22.5% | 38.11 | long drinks band |
| Hugo Spritz | 12.86 | 76 | 58 | 26.2% | 36.30 | spritz band; watch it (elderflower liqueur cost) |
| Arak and grapefruit | 7.18 | 44 | 44 | 19.2% | 30.11 | — (local serve, kept accessible) |
| Old Fashioned | 8.39 | 50 | 56 | 17.7% | 39.06 | stirred band |
| Negroni | 10.60 | 64 | 62 | 20.2% | 41.94 | stirred band |
| Bloody Mary | 6.50 | 40 | 48 | 16.0% | 34.18 | brunch band; cheap to make |
| Espresso Martini | 9.55 | 58 | 58 | 19.4% | 39.60 | — |
| Virgin Mary (0%) | 2.89 | 18 | 26 | 13.1% | 19.14 | alcohol-free band |
| Grapefruit-basil soda (0%) | 2.47 | 16 | 26 | 11.2% | 19.56 | alcohol-free band |

For one week's sales of 630 drinks (the mix in `pos-sales-week.csv`), net sales are 30,025.42 ILS, theoretical cost 6,325.89 ILS, so the **menu pour cost is 21.1%** and the average gross profit 37.62 ILS per drink: slightly above the 20% target, inside the 18–24% range BevSpot reports for typical bars. The Hugo Spritz (65 sold, 26.2%) is the first drink to look at: raising it to 62 ILS alone brings the menu pour cost to 20.9%, and a better elderflower liqueur price would lower it further.

The week's stock count for ten bottles shows a total variance worth 168.90 ILS (tequila 12.0% and white rum 7.1% over the POS, bourbon 8.9% with a logged spill), so the **actual pour cost is 21.6%**, 0.56 points above theoretical. The details are in the solution file.

> [!NOTE]
> Prices are examples: Shufersal online retail prices (regular, not promotional, incl. VAT) and course assumptions, checked 2026-10-18; bars pay trade prices. VAT 18% (gov.il, 2026-10-18). The 20% target, price bands and reasons are professional judgment. Sales and counts are invented for practice. If you use your own prices, write the shop and the date next to each one.

## Step by step

1. **Gather your menu.** Open your 06.8 `menu-builder.csv` and brief. Write every drink's spec in ml (house spec where you changed the IBA one) into `menu-costing.csv`, one row per ingredient.
2. **Build the price list.** Use `price-list.csv`; add or replace products you use (with source and date). Use your own lemon yield from lesson 10.1.
3. **Cost every drink.** Line cost = quantity × cost per unit ÷ (1 − waste); add garnish; total. Check two drinks by hand and the rest in the calculator's menu preset.
4. **Formula prices.** For each drink: cost ÷ target × 1.18, rounded up to your step.
5. **Final prices.** Adjust into price bands by section, check the market, keep the alcohol-free drinks attractive. Write one reason for every change.
6. **Fill the 06.8 columns.** Enter cost per serving and menu price in your own copy of `menu-builder.csv`.
7. **Menu-wide check.** Use the sales mix in `pos-sales-week.csv` (or your own estimate for your bar) and calculate net sales, theoretical cost, menu pour cost and average gross profit. If above target, decide what to change.
8. **Reconcile the week.** With `inventory-week-menu.csv`: actual usage, variance ml and %, unexplained after waste, value in ILS; flag items over 3%; add the variance value to the theoretical cost and calculate actual pour cost.
9. **Write the report** in the brief and score yourself with its rubric.

## Hands-on

### What you need

- Your 06.8 menu: [labs/module-06/menu-builder.csv](../../labs/module-06/menu-builder.csv) (your filled copy) and [menu brief](../../labs/module-06/menu-brief.md).
- From [labs/module-10/](../../labs/module-10/): `costing-project-brief.md` (steps, report and rubric), `price-list.csv`, `menu-costing.csv`, `pos-sales-week.csv`, `inventory-week-menu.csv`.
- Your standard recipe from lesson 10.3, your descriptions from lesson 10.4, your lemon yield from lesson 10.1.
- A spreadsheet (Excel, Google Sheets or LibreOffice) and a device with a browser for the costing calculator.
- Low-cost alternative: paper, a calculator and the calculator page on a phone.

### Time

120 minutes: 15 to gather specs and prices, 40 to cost fourteen drinks, 20 to set prices, 15 for the menu-wide check, 20 for the reconciliation, 10 for the report and rubric.

### Steps

1. Follow steps 1–7 of "Step by step" above for your own menu. Cost at least two drinks fully by hand before using the calculator for the rest.

[Simulation: Costing calculator — whole menu](../../simulations/costing-calculator/index.html?preset=menu)

2. In the calculator, enter your drinks (or start from the preset, which loads the course example menu and price list), set VAT on, your target and rounding step, enter the sales mix and export the menu table as CSV.
3. Reconcile `inventory-week-menu.csv` (step 8). The theoretical ml column comes from `pos-sales-week.csv` and the course example's standard recipes; check two of them yourself (for example gin: Gin Basil Smash and Negroni).
4. Write the report in the brief: menu pour cost, average gross profit, your weakest drink and what you would do, the biggest variance and your first two checks.
5. Score yourself with the rubric. Only then compare with [costing-project-solution.md](../../labs/module-10/costing-project-solution.md).
6. Log the session in your [practice log](../../templates/practice-log.md).

### What you should see

Your first formula prices will spread widely, from under 20 ILS for alcohol-free drinks to near 100 for a drink with two premium rums; after setting bands, most cocktails sit within about 15 ILS of each other and a few run above 25% pour cost on purpose. A menu-wide pour cost between about 18% and 24% is a reasonable result for this exercise (professional judgment, in line with BevSpot's typical range); if yours is far outside, the cause is usually one high-selling drink with a high pour cost, or a price list still including VAT. The reconciliation for the example week flags three bottles (tequila, white rum and bourbon) and leaves the rest inside tolerance.

<details>
<summary>Reference result (course example menu)</summary>

Menu pour cost 21.1% for 630 drinks (net sales 30,025.42 ILS, theoretical cost 6,325.89 ILS), average gross profit 37.62 ILS. Reconciliation: variance value 168.90 ILS (tequila 270 ml, 12.0%, 65.34 ILS; white rum 300 ml, 7.1%, 240 ml unexplained; bourbon 160 ml, 8.9%, 115 ml unexplained; sweet vermouth 4.2% fully explained by the discarded bottle). Actual pour cost 21.6%. Weakest drink: Hugo Spritz (26.2%, 65 sold). Full working: `costing-project-solution.md`.

</details>

### What this practice cannot teach

Real prices come from a bar's suppliers, with discounts, promotions and deposits, and real sales mixes change with the season and the crowd. A menu is proved only after a month of real sales and a real stock count. This project gives you the method and the language to take part when that happens.

### Completion checklist

- [ ] I built a dated price list for every product on my menu.
- [ ] I costed every drink, including the alcohol-free ones, and checked at least two by hand.
- [ ] I set final prices with a written reason for every change from the formula price.
- [ ] I filled the cost and price columns of my 06.8 menu.
- [ ] I calculated the menu-wide pour cost and average gross profit for a week's sales mix.
- [ ] I reconciled the week's inventory in ml and ILS and calculated actual pour cost.
- [ ] I wrote the short report and scored myself with the rubric.

## Common mistakes

- **Costing with VAT-inclusive prices, or pricing without adding VAT.** Every number is 18% off. Fix: costs ex VAT, menu prices incl. VAT, percentages on net prices.
- **Pricing straight from the formula.** The menu is unreadable and some drinks are unsellable. Fix: price bands by section, market check, written reasons.
- **Judging the menu by the average of the pour costs.** Ten drinks at 20% and one at 30% is not 21% if the 30% drink sells the most. Fix: weight by the sales mix.
- **Ignoring the alcohol-free drinks.** Priced too low they look like an afterthought; left uncosted they hide real costs. Fix: cost and price them like the rest.
- **A reconciliation with no money value.** Fix: variance ml × cost per ml, and actual vs theoretical pour cost.
- **Prices without a date and source.** Next month nobody knows why the Paloma costs what it costs. Fix: date and source every price.

## Key takeaways

- Cost every drink from a dated, ex-VAT price list, line by line, with waste allowances.
- Set the formula price (cost ÷ target × 1.18, rounded up), then adjust into bands with a written reason.
- The menu pour cost depends on the sales mix: theoretical cost ÷ net sales for a realistic week.
- Reconciliation adds the variance value to the theoretical cost to show the actual pour cost.
- A costing pack (price list, costings, prices, menu-wide check, reconciliation, report) is what a bar manager needs to launch a menu.

## Sources

- [Israel Tax Authority — History of VAT rates](https://www.gov.il/he/pages/vat-history) (VAT 18% since 1.1.2025; official; accessed 2026-10-18)
- [Consumer Protection Law, 5741-1981 (Nevo)](https://www.nevo.co.il/law_html/law00/70305.htm) (section 17D: menu prices are the total price in ILS; section 2: descriptions must not mislead; statutory; accessed 2026-10-18)
- [BevSpot — What's the average pour cost in the bar industry?](https://bevspot.com/blog/whats-average-pour-cost-bar-industry/) (typical overall pour cost 18–24%, median just above 20%; industry source, 2016; accessed 2026-10-18)
- [Shufersal online](https://www.shufersal.co.il/online/he/) (retail prices incl. VAT used as examples in the price list; regular prices, checked 2026-10-18)
