---
id: "11.6"
module: 11
minutes: 12
practice_minutes: 100
prerequisites: ["08.4", "10.1", "10.2", "10.3", "10.5", "11.1"]
objectives:
  - Cost four drinks from a dated, ex-VAT price list and set their formula prices at a 20% target, including VAT and rounding.
  - Calculate a menu's sales-weighted pour cost, average gross profit and actual pour cost after a stock count.
  - Reconcile five bottles in ml, percent and ILS, flag them correctly (including usage below theoretical) and write the order from par levels.
  - Score at least 70% on the assignment and write a short, numbered report with an action and checks.
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

# 11.6 · Inventory and costing assignment

This is the costing and operations part of the final assessment, worth 10% of your grade. A small bar sells four cocktails, and the owner wants five answers: what each drink costs, what it should cost on the menu, what the menu earns in a normal week, where last week's stock went, and what to order. You work from the Module 10 price list and a short stock file, open book, in 90 minutes, then mark yourself with exact tolerances and check your answers in the costing calculator's exam preset. You need 70%. Everything uses the formulas from [Module 10](../module-10/lesson-05.md); nothing here is new except the data.

## Why it matters

New bartenders rarely set prices, but they are often asked to count stock, explain a gap, or say why a drink "feels expensive to make". A bartender who can say "the Spritz runs at 27% because it sells 80 a week at 52 shekels; at 58 it would be 24%" is the one the manager trusts with the closing count, the order and, later, the menu. This assignment checks that the Module 10 numbers are yours, not the worked example's.

## Core ideas

### What the assignment contains

| Part | Task | Points |
|---|---|---|
| A | cost per serving for four drinks (Margarita, Whiskey Sour, Aperol Spritz, Moscow Mule) | 8 |
| B | formula prices at 20%; pour cost, gross profit, margin and markup for one drink at its menu price | 8 |
| C | net sales, theoretical cost, menu pour cost, average gross profit and actual pour cost for a week | 5 |
| D | reconciliation of five bottles: actual ml, variance ml and %, unexplained ml, value in ILS, flag | 10 |
| E | order list from par levels | 5 |
| F | a five-to-eight-line report to the owner | 4 |

Total 40 points. Score = points ÷ 40 × 100. **Minimum 70% (28 points).** The brief, the answer sheet and the marking rules are in [costing-exam-brief.md](../../labs/module-11/costing-exam-brief.md); the stock data is in `costing-exam-inventory.csv`; the prices are the Module 10 [price list](../../labs/module-10/price-list.csv) plus one extra product (ginger beer) given in the brief.

### The formulas you will need

All are from [10.1](../module-10/lesson-01.md), [10.2](../module-10/lesson-02.md), [10.3](../module-10/lesson-03.md) and [10.5](../module-10/lesson-05.md), with VAT at 18% (Israel Tax Authority, in force since 1 January 2025, checked 2026-10-18):

- Cost per ml = price incl. VAT ÷ 1.18 ÷ ml. Line cost = quantity × cost per unit ÷ (1 − waste allowance).
- Formula price = cost ÷ 0.20 × 1.18, rounded **up** to the next 2 ILS.
- Net price = menu price ÷ 1.18. Pour cost = cost ÷ net. Margin = gross profit ÷ net. Markup = gross profit ÷ cost.
- Menu pour cost = Σ(sold × cost) ÷ Σ(sold × net price).
- Variance = actual ml − theoretical ml; unexplained = variance − logged waste; value = variance ml × cost per ml.
- Actual pour cost = (theoretical cost + total variance value) ÷ net sales.
- Order = par − closing count, rounded up to whole bottles.

### Two things this assignment checks on purpose

**Variance can be negative.** One bottle in the data is used *less* than the POS says it should be. That is a flag too: it can mean short pours (guests getting a weaker drink than the menu promises, which also raises the question of honest descriptions under the Consumer Protection Law, [lesson 10.4](../module-10/lesson-04.md)), a miscount, or drinks rung up and never made.

**Waste explains some variance, not all.** A variance above tolerance that the waste log fully or mostly explains is "explained by the waste log": write it down, fix the cause of the waste, but do not treat it as missing stock. The 3% tolerance is a course convention, set by the bar, not by law (lesson 10.3).

### The costing calculator's exam preset

The exam preset loads this exact assignment (the price list, the ginger beer, the four specs, the sales and the stock file). You enter your answers for parts A–E; it marks them with the same tolerances as the brief and shows points out of 36, with the correct value for every answer you missed. You add part F yourself. A retake uses a new seed, which changes the sales counts and stock counts so you cannot reuse your answers.

> [!NOTE]
> Prices are examples: Shufersal online regular retail prices incl. VAT and marked course assumptions, checked 2026-10-18; bars buy at trade prices, usually lower. VAT 18% (gov.il, checked 2026-10-18). Sales, counts and garnish costs are invented for practice. The 20% target and the 3% tolerance are course conventions (professional judgment); BevSpot reports typical overall pour costs of 18–24% for US bars.

## Step by step

1. **Read the brief once** and copy the answer sheet into a spreadsheet or onto paper. Set a 90-minute timer.
2. **Part A.** For each drink, look up every product's cost per unit in the price list (use the cost column, or calculate it from the incl.-VAT price), divide by (1 − waste), add garnish. Check one drink twice.
3. **Part B.** Formula prices: cost ÷ 0.20 × 1.18, round up to 2. For the Whiskey Sour at 54: net, pour cost, gross profit, margin, markup.
4. **Part C.** Net sales and theoretical cost from the sales mix; menu pour cost; average gross profit.
5. **Part D.** Theoretical ml from the specs and sales; actual ml from the counts; variance, %, unexplained, value; flag each item.
6. **Part C, last line.** Actual pour cost with the total variance value.
7. **Part E.** Order quantities from par and closing counts.
8. **Part F.** Write the report: pour cost vs target and the drinks behind it; one priced action and its effect; the flags; two checks in order.
9. **Stop the timer.** Enter parts A–E in the calculator's exam preset, or mark them by hand with the brief's tolerances. Score part F with its four criteria.
10. **Only then** compare with the solution file and record the score.

## Hands-on

### What you need

- From [labs/module-11/](../../labs/module-11/): `costing-exam-brief.md`, `costing-exam-inventory.csv`, and afterwards `costing-exam-solution.md`.
- From [labs/module-10/](../../labs/module-10/): `price-list.csv`.
- A spreadsheet (Excel, Google Sheets or LibreOffice) and a browser for the costing calculator.
- Optional: the [inventory count](../../templates/inventory-count.md) template for part D and E, and your [exam score sheet](../../labs/module-11/exam-score-sheet.md).
- Low-cost alternative: paper, a pocket calculator and the calculator page on a phone.

### Time

100 minutes: 90 for the assignment, 10 to mark, compare and record.

### Steps

1. Complete parts A–F as in "Step by step", open book, in 90 minutes.
2. Mark parts A–E in the costing calculator's exam preset.

[Simulation: Costing calculator — final assignment](../../simulations/costing-calculator/index.html?preset=exam)

3. Score part F yourself with the four criteria in the brief.
4. Add up: points ÷ 40 × 100. Record the score on your exam score sheet.
5. Compare with [costing-exam-solution.md](../../labs/module-11/costing-exam-solution.md). For every point lost, write which formula or step went wrong.
6. If you scored below 70%: redo the matching Module 10 worksheet ([cost per serving](../../labs/module-10/cost-per-serving-worksheet.md), [pricing](../../labs/module-10/pricing-worksheet.md) or [reconciliation](../../labs/module-10/reconciliation-worksheet.md)), then retake with a new seed in the calculator.

### What you should see

The four costs land between about 6.50 and 17.50 ILS; the Margarita is the most expensive because of the premium tequila. The formula prices are far from the menu prices for two drinks, and the menu as a whole runs above the 20% target. The reconciliation flags two bottles for investigation, one of them under theoretical, and shows one variance that the waste log explains. If your menu pour cost comes out near 20.7% instead of 24.4%, you probably left VAT in the menu prices; if your costs are 18% too high, you left VAT in the purchase prices.

<details>
<summary>Key numbers to check against</summary>

Costs 17.04, 8.50, 11.99, 6.76. Formula prices 102, 52, 72, 40. Whiskey Sour at 54: 18.6%, 37.26 ILS, margin 81.4%, markup 438%. Net sales 9,169.49 ILS; theoretical cost 2,233.80 ILS; menu pour cost 24.4%; average gross profit 34.68 ILS; actual pour cost 25.0%. Variance value total 57.07 ILS. Orders 2, 1, 2, 5, 3. Full working in the solution file.

</details>

### What this practice cannot teach

Real stock counts involve sticky shelves, half-hidden bottles and a POS with buttons nobody uses correctly; real prices come with discounts and deposits. The assignment checks the method; the first real closing count with a manager checks the rest.

### Completion checklist

- [ ] I finished parts A–F in 90 minutes without opening the solution.
- [ ] I marked parts A–E with the stated tolerances (in the calculator or by hand) and scored part F honestly.
- [ ] I wrote down the cause of every point I lost.
- [ ] I scored at least 70%, or I redid the matching Module 10 worksheet and set a retake date.
- [ ] I recorded the score on my exam score sheet.

## Common mistakes

- **VAT in the wrong place.** Costs must be ex VAT, menu prices incl. VAT, percentages on net prices. Fix: write "ex" or "incl." next to every number.
- **Rounding the formula price down or to the nearest.** Fix: always round up to the next 2 ILS.
- **Margin and markup swapped.** Fix: margin divides by the price, markup by the cost.
- **Averaging the four pour costs.** Fix: weight by sales; the Spritz sells twice as many as the Margarita.
- **Ignoring a negative variance.** Fix: flag anything beyond ±3%, in either direction.
- **Ordering "par minus closing" without rounding up.** You cannot order 1.6 bottles. Fix: round up to whole bottles.

## Key takeaways

- Six parts, 40 points, minimum 70%; costing and operations is 10% of the final grade.
- The same Module 10 formulas: ex-VAT costs with waste allowances, formula price rounded up, pour cost on net price, sales-weighted menu pour cost.
- Reconciliation in ml, %, unexplained and ILS; flag variances in both directions; waste can explain a variance.
- The order list is par minus closing, rounded up.
- A good report gives numbers, one priced action and checks in order.

## Sources

- [Israel Tax Authority — History of VAT rates](https://www.gov.il/he/pages/vat-history) (VAT 18% since 1.1.2025; official; accessed 2026-10-18 via Module 10's research)
- [Consumer Protection Law, 5741-1981 (Nevo)](https://www.nevo.co.il/law_html/law00/70305.htm) (section 17D: menu prices are total prices in ILS; section 2: descriptions must not mislead; statutory; accessed 2026-10-18)
- [BevSpot — What's the average pour cost in the bar industry?](https://bevspot.com/blog/whats-average-pour-cost-bar-industry/) (typical overall pour cost 18–24%; industry source, 2016; accessed 2026-10-18)
- [Shufersal online](https://www.shufersal.co.il/online/he/) (retail prices incl. VAT behind the Module 10 price list; regular prices, checked 2026-10-18)
