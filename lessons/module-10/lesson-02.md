---
id: "10.2"
module: 10
minutes: 18
practice_minutes: 45
prerequisites: ["10.1"]
objectives:
  - Calculate pour cost %, gross profit, margin and markup for a drink from its cost and its VAT-inclusive menu price.
  - Set a VAT-inclusive menu price from a cost and a target pour cost, rounded up to a chosen step, and check the resulting pour cost.
  - Spot the three common pricing errors (VAT forgotten, markup confused with margin, pour cost on the VAT-inclusive price) and correct them.
  - State what Israeli consumer protection law requires of a menu price.
volatility: implementation
sources:
  - title: "Consumer Protection Law, 5741-1981 (Nevo), sections 1, 17B, 17D, 17E"
    url: https://www.nevo.co.il/law_html/law00/70305.htm
  - title: "Israel Tax Authority — History of VAT rates (gov.il)"
    url: https://www.gov.il/he/pages/vat-history
  - title: "BevSpot — What's the average pour cost in the bar industry? (2016)"
    url: https://bevspot.com/blog/whats-average-pour-cost-bar-industry/
  - title: "Wikipedia — Markup (business)"
    url: https://en.wikipedia.org/wiki/Markup_(business)
  - title: "Free Trade Zone in Eilat Law (Tax Exemptions and Reductions), 5745-1985 (Nevo)"
    url: https://www.nevo.co.il/law_html/law01/009_001.htm
last_verified: "2026-10-18"
---

# 10.2 · Pour cost, margin, markup and menu prices

Once you know what a drink costs, the next questions are what to charge and whether the price is healthy. Bars answer them with a few numbers: pour cost %, gross profit, margin and markup. They sound alike and people mix them up all the time, which is how drinks end up underpriced. This lesson defines each one with a worked Israeli example, shows how VAT fits in (menu prices in Israel must include it), how to set a price from a target, and how to check a price you have been given. In the hands-on part you price drinks, find the errors in a colleague's price list, and check your answers in the costing calculator.

## Why it matters

A colleague writes a new menu: the Old Fashioned costs 8.39 ILS, the target pour cost is 20%, so 8.39 ÷ 0.20 = 42 ILS on the menu. It looks right, but the bar keeps only 35.59 ILS of each 42 after VAT, and the real pour cost is 23.6%. Over a thousand Old Fashioneds a year, that missing 18% is about 6,400 ILS. Another colleague says "we work on 80% margin" and prices a drink at cost × 1.8, which is less than half of what she meant. These are not rare beginner errors; they are the most common pricing mistakes there are, and a bartender who catches them is very useful in a menu meeting.

## Core ideas

### Net price: the price without VAT

In Israel the price on the menu must be the **total price**, including VAT (section below). Out of every menu price, the VAT (18%) goes to the Tax Authority. What the bar keeps is the **net price** (מחיר נטו, *mechir neto*):

$$\text{net price} = \frac{\text{menu price}}{1.18}$$

Daiquiri on the menu at 58 ILS: net price 58 ÷ 1.18 = **49.15 ILS**; the other 8.85 ILS is VAT. Every measure below uses the net price, the same way costs use ex-VAT prices (lesson 10.1).

### Pour cost %

**Pour cost** (in Israel bartenders often say "food cost" or "beverage cost", or עלות משקה, *alut mashke*; professional judgment) is the share of the net price that goes on ingredients:

$$\text{pour cost \%} = \frac{\text{cost per serving}}{\text{net price}} \times 100$$

Daiquiri: 9.66 ÷ 49.15 = **19.7%**. Low pour cost means more of each shekel is left for everything else.

### Gross profit

$$\text{gross profit} = \text{net price} - \text{cost per serving}$$

Daiquiri: 49.15 − 9.66 = **39.49 ILS** per drink (רווח גולמי, *revach golmi*). It is not profit in the pocket: it has to pay wages, rent, municipal tax (arnona), electricity, glass breakage, ice, licences and marketing before anything is left. That is why bars need low pour costs.

### Margin and markup: same money, different base

**Margin** (gross margin) is gross profit as a share of the **price**. **Markup** is gross profit as a share of the **cost**:

$$\text{margin} = \frac{\text{net price} - \text{cost}}{\text{net price}} \qquad \text{markup} = \frac{\text{net price} - \text{cost}}{\text{cost}}$$

Daiquiri: margin 39.49 ÷ 49.15 = **80.3%**; markup 39.49 ÷ 9.66 = **409%**. The same 39.49 ILS is 80% of the price and four times the cost. Margin is always 100% minus pour cost. The table shows how they move together:

| Pour cost | Margin | Markup | Net price = cost × |
|---|---|---|---|
| 15% | 85% | 567% | 6.67 |
| 20% | 80% | 400% | 5.00 |
| 25% | 75% | 300% | 4.00 |
| 30% | 70% | 233% | 3.33 |

So "80% margin" means "net price = cost × 5", not "cost × 1.8". Cost × 1.8 is an 80% **markup**, a margin of only 44%.

### What pour cost to aim for

There is no legal or official target. BevSpot, a US bar-inventory software company, reported from its customers' data (2016) that typical bars run an overall pour cost of about 18–24%, with a median just above 20%; by category the medians were about 15% for spirits, 24% for beer and 28% for wine. It is one vendor's US data, not an Israeli survey, and craft cocktail bars with expensive ingredients often run higher. This course uses **20%** as a starting target for cocktails (professional judgment); each bar sets its own from its rent, wages and prices around it.

### Setting a price from a target

$$\text{net price} = \frac{\text{cost}}{\text{target pour cost}} \qquad \text{menu price} = \text{net price} \times 1.18, \text{ rounded up}$$

Daiquiri at a 20% target: 9.66 ÷ 0.20 = 48.30 net; × 1.18 = 56.99; rounded up to the next 2 ILS = **58 ILS**. Rounding up keeps the pour cost at or below target: 58 gives 19.7%. The course rounds to 2 ILS because menus look cleaner in whole numbers (professional judgment); the costing calculator lets you choose the step.

### Percent is not everything

A formula is a starting point, not the final price. Two checks before anything goes on the menu:

1. **The market.** At a 20% target the Paloma made with a premium tequila comes out at 82 ILS, far above most cocktails on a neighbourhood menu. Compare with the menus you surveyed in [lesson 06.7](../module-06/lesson-07.md).
2. **Shekels, not only percent.** Price the Paloma at 66 ILS instead: pour cost 24.5%, gross profit 42.23 ILS. The Bloody Mary at 40 ILS has a lovely 19.2% pour cost but earns only 27.40 ILS. A guest who orders the Paloma leaves the bar more money even though its percentage looks "worse". Lesson 10.5 uses both numbers to set a whole menu.

### The three classic errors

| Error | What happens | Daiquiri example (cost 9.66) |
|---|---|---|
| VAT forgotten | price = cost ÷ target, put on the menu as is | 48 ILS on the menu → net 40.68, real pour cost 23.7% |
| Markup confused with margin | "80% margin" priced as cost × 1.8 | 17.39 net, 20.52 on the menu, a giveaway |
| Pour cost on the menu price | 9.66 ÷ 58 = 16.7% reported | looks 3 points better than the real 19.7% |

### What Israeli law says about menu prices

Israel's Consumer Protection Law, 5741-1981, defines the **total price** (המחיר הכולל, *ha-mechir ha-kolel*) as the price including all taxes the business collects, VAT among them, and any other payment attached to the purchase that the consumer has no practical way to refuse (section 1, statutory). A business may not publish or quote a price to a consumer unless it is the total price only, in Israeli currency only (section 17D, statutory). Goods offered for sale must show their total price clearly (section 17B). In practice for a bar:

- Menu prices include VAT; "+ VAT" on a consumer menu is not allowed.
- A charge the guest cannot refuse (for example a compulsory service charge) must be inside the menu price, not added on the bill. A voluntary tip is not part of the price.
- When the VAT rate changes, a business has seven days to update displayed prices, provided it posts a prominent notice that prices do not yet include the change (section 17E, statutory).
- In Eilat, special tax rules apply to many local sales (Free Trade Zone in Eilat Law, 1985). If you work there, ask the bar's accountant how prices and costs are handled; this course does not cover it.

> [!NOTE]
> Law and VAT checked 2026-10-18: Consumer Protection Law on Nevo (sections 1, 17B, 17D, 17E); VAT 18% since 1 January 2025 on gov.il. The 20% target and the 2 ILS rounding step are professional judgment; the pour-cost benchmarks are BevSpot's 2016 US customer data. Laws and rates change; check again before relying on them.

## Step by step

### Check a price you have been given

1. Net price = menu price ÷ 1.18.
2. Pour cost % = cost ÷ net price × 100.
3. Gross profit = net price − cost.
4. Compare the pour cost with the bar's target and the gross profit with similar drinks.

### Set a new price

1. Cost the drink (lesson 10.1).
2. Net price = cost ÷ target pour cost (as a fraction: 20% = 0.20).
3. Menu price = net price × 1.18; round **up** to the bar's step (1, 2 or 5 ILS).
4. Recalculate the real pour cost at the rounded price.
5. Compare with the market and with the gross profit of nearby drinks; adjust, and write down why.
6. Re-cost and re-check whenever a supplier price changes.

## Hands-on

### What you need

- The worksheet [labs/module-10/pricing-worksheet.md](../../labs/module-10/pricing-worksheet.md) and your worksheet results from lesson 10.1.
- A calculator or spreadsheet, and a device with a browser for the costing calculator.
- Optional: your Israeli menu survey from [lesson 06.7](../module-06/lesson-07.md) for the market check.
- Low-cost alternative: paper and a phone calculator.

### Time

45 minutes: 25 for the worksheet, 10 for the calculator, 10 for the market check.

### Steps

1. **Check four prices.** For each drink on the worksheet calculate net price, pour cost %, gross profit, margin and markup.
2. **Set three prices** from a cost and a target, rounded up to 2 ILS, and recalculate the real pour cost.
3. **Find the errors.** The worksheet has a colleague's price list with three mistakes. Name each mistake and correct the price.
4. **Supplier price rise.** Tequila goes from 199.90 to 229.90 ILS incl. VAT. Re-cost the Paloma and decide what to do with its 66 ILS price.
5. **Check in the calculator.** In the one-drink preset switch VAT off and on, change the target from 20% to 25% and the rounding step from 1 to 5 ILS, and watch price, pour cost and gross profit change.

[Simulation: Costing calculator — one drink](../../simulations/costing-calculator/index.html?preset=single)

6. **Market check.** Compare the prices you set with two real menus from your survey. Note where your formula price is far from the market and what you would do.

### What you should see

The four checks show that the same pour cost can come with very different gross profits. The error list usually takes a minute per line once you know the three patterns. The tequila rise pushes the Paloma's pour cost from 24.5% to 27.8% at the same price; a bar might accept it for a few weeks, raise the price, or change the tequila, and the right choice depends on the market and the bar's style (professional judgment). In the calculator, turning VAT off shows exactly the 18% gap of the first classic error.

<details>
<summary>Reference result (worksheet)</summary>

- Daiquiri, cost 9.66, menu 58: net 49.15, pour cost 19.7%, gross profit 39.49, margin 80.3%, markup 409%.
- Tom Collins, cost 11.04, menu 56: net 47.46, pour cost 23.3%, gross profit 36.42, margin 76.7%, markup 330%.
- Negroni, cost 10.60, target 20%: 10.60 ÷ 0.20 = 53.00; × 1.18 = 62.54; rounded up **64**; real pour cost 19.5%.
- Espresso Martini, cost 9.55, target 22%: 9.55 ÷ 0.22 = 43.41; × 1.18 = 51.22; rounded up **52**; real pour cost 21.7%.
- Errors: the Old Fashioned at 42 forgot VAT (should be 50 at 20%); the "80% margin" Bloody Mary at 12 ILS used cost × 1.8, an 80% markup (should be 40); the 16.7% Daiquiri was calculated on the menu price (real 19.7%).
- Paloma after the tequila rise: tequila line 14.35, total cost 15.58; at 66 ILS pour cost 27.8%, gross profit 40.36.

</details>

### What this practice cannot teach

Real pricing is also about the guests who walk in, the bar next door, the owner's plans and what the till shows a month later. Formulas give you a defendable starting number; experience in a real bar shows you which prices guests accept.

### Completion checklist

- [ ] I calculated net price, pour cost, gross profit, margin and markup for four drinks.
- [ ] I set three VAT-inclusive prices from a target and rechecked the real pour cost.
- [ ] I found and corrected the three errors in the colleague's price list.
- [ ] I re-costed the Paloma after a supplier price rise and wrote what I would do.
- [ ] I tried VAT, target and rounding changes in the costing calculator.

## Common mistakes

- **Dividing by the target and stopping.** The menu price is 18% short. Fix: always multiply by 1.18 after dividing by the target.
- **Mixing up margin and markup.** Fix: margin is out of the price, markup is out of the cost; 20% pour cost = 80% margin = 400% markup.
- **Calculating pour cost on the menu price.** The bar looks more profitable than it is. Fix: divide by the net price.
- **Rounding down.** 56.99 becomes 56 and the drink drifts above target. Fix: round up, then check.
- **Pricing by formula only.** A premium drink lands far above the market, or a cheap drink earns too few shekels. Fix: check the market and the gross profit in shekels.
- **"+ VAT" or a hidden compulsory charge on a consumer menu.** Not allowed under the Consumer Protection Law. Fix: one total price, including VAT and any compulsory charge.

## Key takeaways

- Net price = menu price ÷ 1.18; every percentage uses the net price.
- Pour cost % = cost ÷ net price; margin = 100% − pour cost; markup = gross profit ÷ cost.
- Price from a target: cost ÷ target × 1.18, rounded up; then check the real pour cost.
- Look at gross profit in shekels as well as pour cost in percent, and at the market.
- Israeli menu prices must be the total price, in shekels, including VAT and any charge the guest cannot refuse.

## Sources

- [Consumer Protection Law, 5741-1981 (Nevo)](https://www.nevo.co.il/law_html/law00/70305.htm) (section 1 definition of total price incl. VAT and non-waivable payments; 17B total price on goods; 17D only the total price in ILS may be published or quoted; 17E seven days after a tax change; statutory; accessed 2026-10-18)
- [Israel Tax Authority — History of VAT rates](https://www.gov.il/he/pages/vat-history) (18% since 1.1.2025; official; accessed 2026-10-18)
- [BevSpot — What's the average pour cost in the bar industry?](https://bevspot.com/blog/whats-average-pour-cost-bar-industry/) (S. Ngo, 2016: overall typical 18–24%, median just above 20%; spirits 15%, beer 24%, wine 28%; industry source, US customer data; accessed 2026-10-18)
- [Wikipedia — Markup (business)](https://en.wikipedia.org/wiki/Markup_(business)) (markup on cost; margin = markup ÷ (1 + markup); accessed 2026-10-18)
- [Free Trade Zone in Eilat Law (Tax Exemptions and Reductions), 5745-1985 (Nevo)](https://www.nevo.co.il/law_html/law01/009_001.htm) (special VAT treatment for many sales in Eilat; statutory; accessed 2026-10-18)
