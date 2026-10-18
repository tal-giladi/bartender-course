---
id: "10.3"
module: 10
minutes: 18
practice_minutes: 60
prerequisites: ["08.4", "10.1"]
objectives:
  - Write a standard recipe for a drink with spec, method, glass, garnish, allergens, cost per serving, menu price and pour cost.
  - Turn POS drink counts into theoretical usage per bottle using the standard recipes.
  - Reconcile a week of stock for five items in ml, %, unexplained ml and ILS, and flag items outside a 3% tolerance.
  - Explain the gap between theoretical and actual pour cost and list the checks to run, in order, before suspecting theft.
volatility: concept
sources:
  - title: "BevSpot — What's the average pour cost in the bar industry? (2016)"
    url: https://bevspot.com/blog/whats-average-pour-cost-bar-industry/
  - title: "IBA — Cocktails (official list)"
    url: https://iba-world.com/cocktails/
  - title: "Consumer Protection Law, 5741-1981 (Nevo), section 2 (misleading)"
    url: https://www.nevo.co.il/law_html/law00/70305.htm
last_verified: "2026-10-18"
---

# 10.3 · Standard recipes and inventory reconciliation

A cost per serving is only true if every bartender makes the drink the same way. That is the job of the standard recipe: one written version of each drink that the whole team follows, with its cost and price on the same page. The standard recipes also tell you how much should have left each bottle for what the till sold, and comparing that with the stock count is inventory reconciliation. You met counts, usage and variance in lesson 08.4; here you turn drink sales into expected usage, put a shekel value on the variance, and see how it moves the bar's pour cost. In the hands-on part you write a standard recipe for one of your menu drinks and reconcile a week of stock for five bottles.

## Why it matters

Two bartenders make the same Mojito: one pours 45 ml of rum with a jigger, the other free-pours "about 50" and often 60. Same price, different drink, different cost, and on Monday the rum count is 300 ml short. Without a standard recipe the manager cannot tell whether the bar is over-pouring, wasting, ringing drinks into the wrong POS button or losing stock. With one, the numbers tell the story, and a bartender who reconciles stock carefully saves the team from a week of suspicion.

## Core ideas

### The standard recipe

A **standard recipe** (מתכון סטנדרטי, *matkon standarti*; bartenders often say "the spec", ספק, *spek*; professional judgment) is the bar's single official version of a drink. It is more than a recipe card for memorising ([templates/recipe-card.md](../../templates/recipe-card.md)): it is the reference for the guest, the manager and the accountant. It holds:

| Field | Why |
|---|---|
| Name and version date | everyone makes the current version; old versions are kept for costing history |
| Ingredients in ml (and pieces), with the product or brand | cost and stock depend on the exact product and amount |
| Method, glass, ice, garnish | the guest gets the same drink every time |
| Volume in the glass (approximately) | a quick check on the pour and the dilution |
| Allergens and dietary notes | the answer must be on paper, not from memory (Module 9) |
| Cost per serving, menu price, pour cost, gross profit | the drink's economics in one place |
| Spec source | IBA, a named variation or "house spec" ([lesson 06.8](../module-06/lesson-08.md)) |
| Photo of the finished drink (optional) | the look to match |

The course template is [labs/module-10/standard-recipe-template.md](../../labs/module-10/standard-recipe-template.md). Measure with a jigger ([lesson 03.2](../module-03/lesson-02.md)): free-pouring drifts, and a standard recipe is only as good as the pour behind it. The menu description must match the standard recipe too: Israel's Consumer Protection Law forbids misleading a consumer about a product's components, quantity or producer (section 2), so if the menu says a named brand, that is what goes in the glass (lesson 10.4).

### From drinks sold to theoretical usage

The POS (קופה, *kupa*) counts drinks, not ml. The standard recipe turns one into the other. **Theoretical usage** (also "ideal usage" or "sold per POS ml", the name used in lesson 08.4) of a product is:

$$\text{theoretical usage (ml)} = \sum (\text{drinks sold} \times \text{ml of that product in the drink})$$

Example: a week's POS shows 30 Daiquiris (60 ml white rum each) and 60 Mojitos (45 ml white rum each). Theoretical rum usage = 30 × 60 + 60 × 45 = 1,800 + 2,700 = **4,500 ml**. If two drinks share a product (gin in a Negroni and a Martini), add both.

### Reconciliation, step by step

The formulas are the ones from [lesson 08.4](../module-08/lesson-04.md), now with money:

$$\text{actual usage} = \text{opening} + \text{received} - \text{closing}$$

$$\text{variance} = \text{actual usage} - \text{theoretical usage} \qquad \text{variance \%} = \frac{\text{variance}}{\text{theoretical usage}} \times 100$$

$$\text{unexplained} = \text{variance} - \text{logged waste} \qquad \text{variance value (ILS)} = \text{variance (ml)} \times \text{cost per ml}$$

Rum example: opening 1.4 bottles, received 6, closing 1.0, all 750 ml. Actual usage = 6.4 bottles = 4,800 ml. Variance = 4,800 − 4,500 = **300 ml** (6.7%). The waste log shows one remade Daiquiri (45 ml of rum), so unexplained = 255 ml (5.7%). At 0.1355 ILS per ml ex VAT, the variance is worth **40.65 ILS** this week, 34.55 of it unexplained. That is about two thirds of a bottle, every week, if nothing changes.

### Theoretical and actual pour cost

The money view adds up across all products:

$$\text{theoretical cost} = \sum \text{theoretical usage} \times \text{cost per ml} \qquad \text{actual cost} = \sum \text{actual usage} \times \text{cost per ml}$$

$$\text{theoretical pour cost} = \frac{\text{theoretical cost}}{\text{net sales}} \qquad \text{actual pour cost} = \frac{\text{actual cost}}{\text{net sales}}$$

**Net sales** are the week's sales without VAT (the POS report shows them). Theoretical pour cost is what the menu prices promise; actual pour cost is what really happened. Example: net sales 20,000 ILS, theoretical cost 4,000 ILS (20.0%), variance value 300 ILS: actual cost 4,300 ILS, actual pour cost **21.5%**. The gap (1.5 points) is the variance, in the language the owner reads. Many bars treat a gap of up to about one or two points as normal and investigate above that (professional judgment; each bar sets its own tolerance, as in lesson 08.4).

### What causes a variance, and what to check first

Most variances are not theft. Check in this order, cheapest first (professional judgment):

1. **Counting errors.** Recount the item; check last week's closing equals this week's opening.
2. **Deliveries.** Was every delivery note entered, and in the right size (700 vs 750 ml, 1 l)?
3. **POS buttons.** Is every drink on the POS, and mapped to the right standard recipe? A missing button means drinks were poured but never "sold". A drink rung under the wrong button moves the variance from one bottle to another (one item positive, another negative).
4. **Spec changes.** Did the house spec change (50 ml instead of 60 ml) without updating the standard recipe?
5. **Waste logging.** Spills, remakes, sent-back drinks and staff drinks that were not written down.
6. **Pouring.** Jigger checks on shift: pour into a measured cylinder or a scale (1 ml water ≈ 1 g) and compare.
7. **Free drinks not rung in, and theft.** Only after the rest. Accusing someone on the basis of a counting mistake damages the team.

A **negative** variance (less left the bottle than was sold) usually means under-pouring, a drink rung in twice or under the wrong button, or a count that was too high at opening; it is investigated the same way.

> [!NOTE]
> The formulas match the course's costing calculator and lesson 08.4. Tolerances and the order of checks are professional judgment; the counts and sales in this lesson are invented for practice. BevSpot's 2016 data (overall bar pour cost about 18–24%) gives context only. Checked 2026-10-18.

## Step by step

### Write a standard recipe

1. Start from the drink's spec (IBA, a named variation or your house spec) and write every ingredient in ml, with the product you actually pour.
2. Add method, glass, ice, garnish and the approximate volume in the glass.
3. List allergens from the labels of the products you use (Module 9).
4. Cost it (lesson 10.1), price it (lesson 10.2) and write cost, price, pour cost and gross profit.
5. Date it. When anything changes (product, ml, price), make a new version and re-cost.

### Reconcile a week

1. Count opening and closing stock (lesson 08.4); add received from delivery notes.
2. Export the POS drink counts for the week.
3. For each product: theoretical usage = drinks sold × ml per drink, summed over every drink that uses it.
4. Actual usage, variance ml and %, unexplained after the waste log.
5. Variance value in ILS = variance ml × cost per ml (ex VAT).
6. Flag every item outside tolerance (the course uses 3%); run the checks above in order; write what you found.
7. Add up theoretical and actual cost and compare actual with theoretical pour cost.

## Hands-on

### What you need

- The template [labs/module-10/standard-recipe-template.md](../../labs/module-10/standard-recipe-template.md), your 06.8 menu ([labs/module-06/menu-builder.csv](../../labs/module-06/menu-builder.csv)) and the [price list](../../labs/module-10/price-list.csv).
- The worksheet [labs/module-10/reconciliation-worksheet.md](../../labs/module-10/reconciliation-worksheet.md) and a spreadsheet or calculator.
- For the jigger check: a jigger, a kitchen scale (1 g steps) or a measuring cylinder, water, a phone timer.
- A device with a browser for the costing calculator.
- Low-cost alternative: medicine cup instead of a jigger; paper instead of a spreadsheet.

### Time

60 minutes: 15 for the standard recipe, 30 for the reconciliation, 10 for the jigger check, 5 for the calculator.

### Steps

1. **Standard recipe.** Pick one drink from your 06.8 menu. Fill in the template completely, including the cost (lesson 10.1), a price at your target (lesson 10.2) and the allergens.
2. **Theoretical usage.** On the worksheet, turn the week's POS drink counts into theoretical ml for each of the five bottles.
3. **Reconcile.** Calculate actual usage, variance in ml and %, unexplained ml after the waste log, and the variance value in ILS. Flag items outside 3%.
4. **Investigate on paper.** For each flagged item, write the first two checks you would run and the most likely cause, using the list in this lesson.
5. **Jigger check.** Free-pour "30 ml" of water ten times without looking at a jigger, weighing each pour. Then pour ten times with the jigger. Calculate the average error each way with the formula from [lesson 03.2](../module-03/lesson-02.md), and work out what the free-pour error would do to a 0.1355 ILS per ml rum over 100 drinks.
6. **Check in the calculator.** Load the variance preset (the worksheet's five items) and compare.

[Simulation: Costing calculator — inventory variance](../../simulations/costing-calculator/index.html?preset=variance)

7. Log the results in your [practice log](../../templates/practice-log.md) and keep the standard recipe for lesson 10.5.

### What you should see

Theoretical usage is quick once the drinks are lined up by product; the commonest slip is forgetting that one bottle feeds two drinks. In the reconciliation, three of the five items are outside 3%: one positive variance that the waste log only partly explains, one positive that the log explains down to just above tolerance, and one negative that points to a counting or POS problem rather than over-pouring. In the jigger check, free pours of beginners commonly miss by 10–20% while jigger pours land within about 5% (professional judgment; your numbers are what count). A 10% over-pour of 30 ml rum costs about 0.41 ILS per drink, 41 ILS per 100 drinks.

<details>
<summary>Reference result (worksheet)</summary>

| Item | Theoretical ml | Actual ml | Variance ml | % | Logged waste | Unexplained ml (%) | Variance ILS | Flag |
|---|---|---|---|---|---|---|---|---|
| Vodka (700) | 4,300 | 4,410 | 110 | 2.6% | 0 | 110 (2.6%) | 9.31 | — |
| White rum (750) | 4,500 | 4,800 | 300 | 6.7% | 45 | 255 (5.7%) | 40.65 | yes |
| Tequila (700) | 2,250 | 2,310 | 60 | 2.7% | 0 | 60 (2.7%) | 14.52 | — |
| Aperol (1,000) | 4,200 | 4,000 | −200 | −4.8% | 0 | −200 (−4.8%) | −18.80 | yes |
| Gin (700) | 1,770 | 1,890 | 120 | 6.8% | 60 | 60 (3.4%) | 15.38 | yes |

Theoretical cost 2,139.74 ILS; actual 2,200.80 ILS; variance value 61.06 ILS. Likely causes: rum, over-pouring Mojitos (free-poured, muddled drink) or Mojitos missing from the POS; Aperol, a too-high opening count or Spritzes made with less Aperol than the spec (recount first, then watch the pour); gin, just over tolerance after the logged Martini: recount, then a jigger check.

</details>

### What this practice cannot teach

A worksheet gives you clean POS data and honest counts. In a real bar, a reconciliation also means talking to colleagues about their pouring and their mistakes, fairly and without accusing anyone. You learn that only on the job, usually from a good manager.

### Completion checklist

- [ ] I wrote a complete standard recipe, with cost, price, pour cost and allergens, for one drink of my menu.
- [ ] I converted POS drink counts into theoretical usage for five products.
- [ ] I reconciled the five items in ml, %, unexplained ml and ILS and flagged those outside 3%.
- [ ] I wrote the first checks and likely causes for each flagged item.
- [ ] I compared free pours with jigger pours and worked out the cost of the error.

## Common mistakes

- **No date or version on the standard recipe.** Cost and stock are calculated on an old spec. Fix: date every version and re-cost on every change.
- **Forgetting shared products.** Gin used in a Negroni and a Martini gets only one drink's usage. Fix: list every drink that uses each product before you add.
- **Reporting ml only.** "Rum 300 ml over" does not tell the owner how much it matters. Fix: add the ILS value and the effect on pour cost.
- **Ignoring negative variances.** "We used less, great." A negative variance means the count, the POS or the pour is wrong. Fix: investigate it like a positive one.
- **Jumping to theft.** Most variances are counts, deliveries, POS buttons, spec changes or unlogged waste. Fix: run the checks in order and recount before reporting.
- **A menu that promises a brand the bar does not pour.** Misleading under the Consumer Protection Law and a costing error. Fix: the standard recipe and the menu name the same product.

## Key takeaways

- A standard recipe is the one official version of a drink: spec in ml with the product, method, glass, garnish, allergens, cost, price and pour cost, dated.
- Theoretical usage = drinks sold × ml per drink, summed over every drink that uses the product.
- Variance = actual − theoretical; unexplained = variance − logged waste; value = variance ml × cost per ml.
- Actual pour cost minus theoretical pour cost shows the variance in the owner's language.
- Check counts, deliveries, POS buttons, spec changes, waste logging and pouring before suspecting theft.

## Sources

- [BevSpot — What's the average pour cost in the bar industry?](https://bevspot.com/blog/whats-average-pour-cost-bar-industry/) (context for overall bar pour cost, about 18–24%; industry source, 2016; accessed 2026-10-18)
- [IBA — Cocktails (official list)](https://iba-world.com/cocktails/) (the specs behind the standard recipes in the worksheet, as used in Modules 5 and 6; accessed 2026-10-18)
- [Consumer Protection Law, 5741-1981 (Nevo)](https://www.nevo.co.il/law_html/law00/70305.htm) (section 2: misleading a consumer about components, quantity, producer or name is prohibited; statutory; accessed 2026-10-18)
