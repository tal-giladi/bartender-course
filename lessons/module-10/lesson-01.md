---
id: "10.1"
module: 10
minutes: 18
practice_minutes: 60
prerequisites: ["03.1", "03.4", "08.4"]
objectives:
  - Convert a VAT-inclusive purchase price into an ex-VAT cost per ml, per ml of juice or per piece.
  - Calculate the cost per serving of a cocktail from its spec, including a waste allowance for each ingredient, within 0.05 ILS of the costing calculator.
  - Work out how many servings a 700 ml or 750 ml bottle gives at a given pour and waste allowance.
  - Measure your own citrus yield and turn it into a cost per ml of juice.
volatility: implementation
sources:
  - title: "Israel Tax Authority — History of VAT rates (gov.il)"
    url: https://www.gov.il/he/pages/vat-history
  - title: "Israel Tax Authority — Know your rights and duties 2018, p. 213: periodic VAT report (input VAT)"
    url: https://www.gov.il/files/taxes/KnowYourRights2018/files/basic-html/page213.html
  - title: "Shufersal online (retail prices used as examples)"
    url: https://www.shufersal.co.il/online/he/
last_verified: "2026-10-18"
---

# 10.1 · Cost per serving, bottle yield and waste

Every drink you pour has a price tag the guest never sees: what the bar paid for the rum, the lime, the sugar and the garnish that went into it. This lesson teaches you to calculate that number, the cost per serving, from a price list and a spec. You will learn to take VAT out of a purchase price, turn a bottle into a cost per ml, turn a bag of limes into a cost per ml of juice, add a fair allowance for waste, and count how many servings a bottle really gives. In the hands-on part you cost four drinks by hand, measure and cost your own lemon juice, and check your numbers in the costing calculator.

## Why it matters

The manager hands you a new drink for the summer menu: "Tell me what it costs us and what we should charge by tomorrow." One bartender guesses "about ten shekels". Another opens the price list, writes the spec in ml, and comes back with 9.66 ILS per serving, the line that costs the most, and a suggestion to save a shekel without changing the taste. The second one is the person who gets asked to help build the next menu. Costing is also how a bar notices that a supplier raised the price of tequila by 15%, or that the "cheap" drink on the menu is actually the most expensive one to make.

## Core ideas

### Words you need

- **Cost** (עלות, *alut*): what the bar pays for something, before it is sold.
- **Cost per serving** (also "drink cost" or "recipe cost"): the total cost of every ingredient and garnish in one drink.
- **Costing** (תמחיר, *tamchir*): working out cost per serving. **Pricing** (תמחור, *tamchur*) is setting the menu price from it (lesson 10.2).
- **Package**: the unit the bar buys: a 700 ml bottle, a 1 kg bag of lemons, a bunch of mint.
- **Yield** (תפוקה, *tfuka*): the usable amount you get from a package: juice from fruit, servings from a bottle.
- **Waste allowance** (or spillage allowance): a planned percentage of each package that will never reach a guest's glass: drips, the last few ml in a bottle, juice thrown away at close, wilted mint.

### Step 1: take VAT out of the purchase price

Israel charges **VAT** (value added tax, מע"מ, *ma'am*) at **18%**, in force since 1 January 2025 (Israel Tax Authority, checked 2026-10-18). Shop and supplier prices for consumers include it. A bar that is a VAT-registered business (עוסק מורשה, *osek murshe*) reports the VAT it collected on sales minus the VAT it paid on purchases, and pays only the difference (Tax Authority guidance on the periodic VAT report). So the VAT on a bottle is not a real cost for the bar, and every costing in this course uses **ex-VAT** prices:

$$\text{price ex VAT} = \frac{\text{price incl. VAT}}{1 + 0.18} = \frac{\text{price incl. VAT}}{1.18}$$

Example: a 750 ml bottle of white rum at 119.90 ILS incl. VAT costs the bar 119.90 ÷ 1.18 = **101.61 ILS** ex VAT. Supplier invoices to businesses usually show the ex-VAT price and the VAT on separate lines; then you can use the ex-VAT line directly.

A common mistake is to subtract 18% (119.90 × 0.82 = 98.32). That is wrong: VAT was added on top of the ex-VAT price, so you divide by 1.18.

### Step 2: cost per ml

$$\text{cost per ml} = \frac{\text{package price (ex VAT)}}{\text{package size (ml)}}$$

Rum: 101.61 ÷ 750 = **0.1355 ILS per ml**. Keep four decimal places while you calculate and round only the final answer to 2 decimals (agorot); rounding early adds up to real errors across a menu.

### Step 3: produce, by yield

Fruit is bought by weight but used by volume of juice. You need your **yield**: ml of juice per kg of fruit. You measured yours in [lesson 03.4](../module-03/lesson-04.md) (the reference result there was about 30 ml per 100 g of lemons, which is 300 ml per kg). Then:

$$\text{cost per ml of juice} = \frac{\text{price per kg (ex VAT)}}{\text{ml of juice per kg}}$$

Example: limes at 6.90 ILS for a 350 g pack is 6.90 ÷ 0.35 = 19.71 ILS per kg incl. VAT, or 19.71 ÷ 1.18 = 16.71 ex VAT. At 300 ml per kg: 16.71 ÷ 300 = **0.0557 ILS per ml** of juice. A bar with a machine juicer gets more juice from the same fruit, so its juice is cheaper per ml; measure, do not copy someone else's yield.

Herbs and garnishes are counted in pieces: a 50 g pack of basil with about 100 usable leaves at 6.69 ILS ex VAT is 0.067 ILS per leaf. Count a few packs yourself; leaf counts vary a lot.

Home-made syrups are costed from their ingredients. 1 kg of sugar plus 1 kg of water makes about 1,626 ml of 1:1 syrup (density about 1.23 g/ml, lesson 03.4). At 5.50 ILS per kg of sugar (4.66 ex VAT), that is 0.0029 ILS per ml: almost nothing. Labour and energy are real costs too, but bars normally keep them out of the drink cost and cover them in the price (professional judgment).

### Step 4: the waste allowance

Not every ml you buy reaches a glass. The course uses these starting allowances (professional judgment; a bar sets its own from its waste log, [lesson 08.4](../module-08/lesson-04.md)):

| Ingredient type | Waste allowance | Why |
|---|---|---|
| Spirits, liqueurs, vermouth, bottled syrups | 3% | drips, the last ml in the bottle, occasional spill |
| Sparkling wine | 10% | an open bottle goes flat |
| Mixers (soda, tonic, juice in bottles) | 5% | flat or expired leftovers |
| Fresh citrus juice | 10% | juice left at close is thrown away |
| Herbs | 20% | wilted and damaged leaves |
| Sugar or honey syrup made in house | 0% | cheap and made to need |

The allowance is added by dividing, because you must buy more than you serve:

$$\text{line cost} = \frac{\text{ml in the spec} \times \text{cost per ml}}{1 - \text{waste allowance}}$$

Rum, 60 ml at 3%: 60 × 0.1355 = 8.13; 8.13 ÷ 0.97 = **8.38 ILS**. With a 3% allowance you pay for about 103 ml for every 100 ml served. (Multiplying by 1.03 gives almost the same answer; the course's calculator divides, so use division and your numbers will match.)

### Step 5: add up the lines

$$\text{cost per serving} = \sum \text{line costs} + \text{garnish and other}$$

The Σ sign just means "add them all up".

### Bottle yield: servings per bottle

$$\text{usable ml} = \text{bottle ml} \times (1 - \text{waste allowance})$$

$$\text{servings per bottle} = \text{usable ml} \div \text{pour, rounded down}$$

A 700 ml bottle with 3% waste has 700 × 0.97 = 679 usable ml: **15** servings of 45 ml or **22** of 30 ml. A 750 ml bottle of rum at 60 ml gives 727.5 ÷ 60 = 12.1, so **12**. You round down because a bar cannot sell 0.1 of a drink. Servings per bottle is what a manager means by "bottle yield", and it is the quickest check on a costing: 101.61 ILS ÷ 12 servings ≈ 8.47 ILS per serving, close to the 8.38 above.

### What prices to use

> [!NOTE]
> The prices in this module are retail shelf prices from Shufersal online (regular prices, not promotions), checked 2026-10-18, used only as examples; items not found there are marked "course assumption" in the price list. Bars buy from importers and distributors at trade prices, usually lower and often with volume discounts (professional judgment). Prices change; in a real bar always use the latest supplier invoice. The VAT rate (18%) was checked on gov.il on 2026-10-18.

## Step by step

### Cost one drink

1. Write the spec in ml (convert dashes at 0.8 ml and bar spoons at 5 ml, [lesson 03.1](../module-03/lesson-01.md)). If the bar uses a house spec, cost the house spec.
2. For each ingredient, find the package price and divide by 1.18 if it includes VAT.
3. Work out the cost per ml (bottle), per ml of juice (produce, with your yield) or per piece (herbs, garnish).
4. Multiply by the quantity in the spec; divide by (1 − waste allowance).
5. Add a line for garnish and anything else in the glass (salt rim, coffee beans, a straw if the bar counts it).
6. Add all lines. Round the total to 2 decimals.
7. Sanity check: is the biggest line the base spirit? Does servings per bottle give a similar spirit cost?

### Worked example: Daiquiri (house spec from the 06.8 menu)

The IBA Daiquiri uses 2 bar spoons of superfine sugar; the example menu in [lesson 06.8](../module-06/lesson-08.md) uses 15 ml of 1:1 syrup instead, so that is what we cost.

| Ingredient | Package and price incl. VAT | Ex VAT | Cost per unit | Spec | Waste | Line cost |
|---|---|---|---|---|---|---|
| White rum | 750 ml, 119.90 | 101.61 | 0.1355 per ml | 60 ml | 3% | 8.38 |
| Fresh lime juice | 350 g limes, 6.90; yield 300 ml/kg | 5.85 | 0.0557 per ml | 20 ml | 10% | 1.24 |
| 1:1 syrup | 1 kg sugar, 5.50 → 1,626 ml | 4.66 | 0.0029 per ml | 15 ml | 0% | 0.04 |
| **Cost per serving** | | | | | | **9.66 ILS** |

The rum is 87% of the cost. A cheaper rum changes the cost a lot; squeezing the limes more carefully changes it very little.

## Hands-on

### What you need

- The price list [labs/module-10/price-list.csv](../../labs/module-10/price-list.csv) and the worksheet [labs/module-10/cost-per-serving-worksheet.md](../../labs/module-10/cost-per-serving-worksheet.md); a calculator or spreadsheet (Excel, Google Sheets or LibreOffice).
- For the yield test: 3–4 lemons (or limes), a kitchen scale, a citrus press or fork, a tea strainer, a measuring jug or jigger, and the receipt or shelf price of the fruit.
- A device with a browser for the costing calculator.
- Low-cost alternative: a phone calculator and paper; any citrus you have at home.

### Time

60 minutes: 25 for the worksheet, 20 for the yield test, 15 for the calculator.

### Steps

1. **Read the price list.** Open the CSV. For three lines, check the ex-VAT price yourself (price incl. VAT ÷ 1.18) and the cost per ml.
2. **Cost three drinks by hand** on the worksheet: Negroni, Bloody Mary, and Arak and grapefruit (specs from lessons [05.3](../module-05/lesson-03.md), [06.4](../module-06/lesson-04.md) and [06.7](../module-06/lesson-07.md); garnish costs are given on the worksheet). Use the waste allowances in the price list.
3. **Servings per bottle.** Answer the worksheet's four bottle-yield questions.
4. **Your own lemon juice.** Write down the price you paid per kg (or per piece and the weight). Weigh the fruit, juice it, strain it and measure the ml. Calculate your yield in ml per kg, then your cost per ml of juice ex VAT. Compare with the price list's 0.0364 ILS per ml for lemons.
5. **Check in the calculator.** Load the Daiquiri preset, confirm 9.66 ILS, then replace the lime line with your own yield and price and see how much the cost moves.

[Simulation: Costing calculator — one drink](../../simulations/costing-calculator/index.html?preset=single)

6. **Bottle yield.** In the yield preset, change the pour (30, 45, 60 ml) and the waste allowance (0%, 3%, 10%) for a 700 ml bottle and note how servings change.

[Simulation: Costing calculator — bottle and produce yield](../../simulations/costing-calculator/index.html?preset=yield)

7. Record your results and your yield in your [practice log](../../templates/practice-log.md).

### What you should see

Your hand calculations should match the reference within a few agorot; bigger differences almost always come from forgetting to remove VAT, dividing by 0.82 or multiplying by 0.82 instead of dividing by 1.18, or rounding the cost per ml too early. Your lemon yield will probably land somewhere around 250–400 ml per kg, depending on the fruit, its temperature and your press (professional judgment); every 50 ml/kg changes the juice cost by about 15%, but because juice is a small part of most drinks, the cost per serving moves only by agorot. In the yield preset, going from 0% to 10% waste on a 700 ml bottle at 45 ml drops the servings from 15 to 14; at 30 ml, from 23 to 21.

<details>
<summary>Reference result (worksheet)</summary>

- Negroni: gin 30 ml 3.97 + Campari 30 ml 3.97 + sweet vermouth 30 ml 2.27 + orange slice 0.40 = **10.60 ILS**.
- Bloody Mary: vodka 45 ml 3.93 + tomato juice 90 ml 0.96 + lemon juice 15 ml 0.61 + celery stick 0.50 + seasoning 0.50 = **6.50 ILS**.
- Arak and grapefruit: arak 60 ml 4.86 + grapefruit juice 120 ml 2.23 + 1 basil leaf 0.08 = **7.18 ILS**.
- Bottle yield: 700 ml at 45 ml, 3% waste → 15; 700 ml at 30 ml, 3% → 22; 750 ml at 60 ml, 3% → 12; 1,000 ml Aperol at 60 ml, 3% → 16.
- Example lemon test: 4 lemons, 520 g, 158 ml juice → 304 ml per kg; at 12.90 ILS per kg incl. VAT → 10.93 ex VAT ÷ 304 = 0.0360 ILS per ml.

</details>

### What this practice cannot teach

A worksheet uses tidy prices; a real bar has supplier discounts, deposits on kegs, price rises in the middle of the month and products that are sometimes swapped by the distributor. Your yield test uses a hand press, not a bar's machine juicer. You learn the real numbers from the bar's invoices and its own prep.

### Completion checklist

- [ ] I converted at least three VAT-inclusive prices to ex-VAT cost per ml.
- [ ] I costed the Negroni, the Bloody Mary and the Arak and grapefruit by hand and compared them with the reference.
- [ ] I answered the four servings-per-bottle questions.
- [ ] I measured my own lemon yield and calculated my cost per ml of juice.
- [ ] I reproduced the Daiquiri's 9.66 ILS in the costing calculator and tried my own yield.

## Common mistakes

- **Costing with VAT-inclusive prices.** Every cost comes out 18% too high, and pour costs look worse than they are. Fix: divide every consumer price by 1.18 first, or use the ex-VAT line of the invoice.
- **Taking 18% off instead of dividing by 1.18.** 119.90 × 0.82 = 98.32, not 101.61. Fix: VAT was added on top, so divide.
- **Costing the IBA spec when the bar pours a house spec.** The numbers then describe a drink nobody makes. Fix: cost exactly what the bar's standard recipe says ([lesson 10.3](lesson-03.md)).
- **Forgetting the small lines.** Bitters, garnish, a salt rim and a float of expensive whisky add up: in the Penicillin the 7.5 ml Islay float costs 2.81 ILS, more than the lemon, honey and ginger together. Fix: cost every line, even if it looks tiny.
- **No waste allowance.** The costing says 9.40 but the stock disappears as if each drink cost 9.70. Fix: use the bar's allowances, or the course defaults until there is a waste log.
- **Using someone else's yield.** A book figure can be far from your fruit. Fix: measure yield once a season with your own juicer.

## Key takeaways

- Remove VAT first: price ex VAT = price incl. VAT ÷ 1.18 (Israel, 18% since 1 January 2025).
- Cost per ml = package price ÷ package ml; for produce, price per kg ÷ ml of juice per kg.
- Line cost = ml × cost per ml ÷ (1 − waste allowance); cost per serving = all lines + garnish.
- Servings per bottle = bottle ml × (1 − waste) ÷ pour, rounded down.
- The base spirit is usually most of the cost; small lines like floats and garnish still count.

## Sources

- [Israel Tax Authority — History of VAT rates](https://www.gov.il/he/pages/vat-history) (VAT rose to 18% on 1.1.2025; page updated 26.12.2024; official; accessed 2026-10-18)
- [Israel Tax Authority — Know your rights and duties 2018, p. 213](https://www.gov.il/files/taxes/KnowYourRights2018/files/basic-html/page213.html) (a licensed dealer's periodic report: VAT on sales minus VAT on inputs is paid or refunded; official guidance; accessed 2026-10-18)
- [Shufersal online](https://www.shufersal.co.il/online/he/) (retail shelf prices incl. VAT used as examples in the price list; regular prices, checked 2026-10-18)
