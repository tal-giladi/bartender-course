---
id: "08.3"
module: 8
minutes: 17
practice_minutes: 70
prerequisites: ["03.1", "03.5", "05.2"]
objectives:
  - Choose between a pre-mix (no water) and a pre-diluted batch for a given drink and service, and say what must stay out of any batch.
  - Calculate the water, total volume, serving size and ABV of a batch for N drinks with a planned dilution.
  - Decide whether a batch can be kept in the freezer by comparing its ABV after dilution with the freezing point of ethanol and water.
  - Write a batch label that tells another bartender exactly how to serve it.
volatility: concept
sources:
  - title: "Cooking Issues (Dave Arnold) — Cocktail Science in General, Part 2 of 2 (2010)"
    url: https://cookingissues.com/2010/09/08/cocktail-science-in-generalpart-2-of-2/
  - title: "Punch — A guide to batching freezer Martinis and Negronis (2024)"
    url: https://punchdrink.com/articles/guide-batch-freezer-martini-negroni/
  - title: "The Engineering ToolBox — Ethanol freeze-protected water solutions"
    url: https://engineeringtoolbox.com/ethanol-water-d_989.html
  - title: "Cooking Issues (Dave Arnold) — Fresh Lime Juice: WTF? (2010)"
    url: https://cookingissues.com/2010/10/01/fresh-lime-juice-wtf/
last_verified: "2026-10-17"
---

# 08.3 · Batching and pre-dilution

A batch is a drink mixed ahead of time, so that at service you pour one measure instead of three or four. Lesson 03.1 gave you the maths and lesson 03.5 the dilution numbers; this lesson turns them into bar practice. You will learn the two main kinds of batch (a pre-mix that is still shaken or stirred to order, and a pre-diluted batch that already contains its water), what must never go into a batch, how much water to plan, why some batches can live in the freezer and others cannot, and how to label a batch so anyone can serve it. In the hands-on part you work through a batch worksheet, check it in the recipe scaler, and make two alcohol-free batches to compare with drinks made to order.

## Why it matters

A wedding books 120 drinks in the first hour: a Manhattan and a Daiquiri. Made one by one, that is two bartenders stirring and shaking non-stop for an hour while the queue grows. Batched well, the Manhattans are poured from a cold bottle in seconds and every Daiquiri is a single pour plus a shake. Batched badly, the Manhattans are hot and harsh because nobody added water, or thin because someone added water and then stirred them on ice anyway, and the Daiquiri batch was pressed the day before and tastes flat. Batching is where good bars buy speed, and where a single maths or storage mistake ruins 60 drinks at once.

## Core ideas

### Two kinds of batch

| | Pre-mix | Pre-diluted batch |
|---|---|---|
| What is in the bottle | All the ingredients that keep, no water | All the ingredients **plus the water** that ice would have added |
| At service | Measure one serving, shake or stir it on ice as usual | Pour one serving straight into a chilled glass; no ice mixing |
| Water to add | **None**: the ice adds it | Batch volume × planned dilution |
| Typical drinks | Sours for events, Negronis on the rocks, house specs with many ingredients | Stirred, spirit-forward drinks: Manhattan, Martini, Old Fashioned styles |
| Stored | Fridge (cool, dark) or as the ingredients require | Fridge, or freezer if the ABV allows (below) |

The commonest batch mistake is mixing these up: adding water to a pre-mix that is then shaken (the drink gets water twice and is thin), or forgetting the water in a pre-diluted batch (the drink is warm, small and harsh). The rule from [lesson 03.1](../module-03/lesson-01.md) still holds: **add batch water only when servings will not be mixed on ice.**

### What stays out of the batch

- **Anything carbonated**: soda, tonic, ginger beer, sparkling wine. Bubbles escape as soon as the bottle is opened and mixed ([lesson 03.6](../module-03/lesson-06.md)); add them to each glass at service.
- **Egg white and aquafaba**: shake them to order, for texture and for food safety.
- **Muddled herbs and fruit**: they turn brown and bitter; muddle to order.
- **Fresh citrus for more than a few hours**: in Dave Arnold's blind test most tasters preferred lime juice about 4 hours old to juice pressed minutes before, but by the next day it tastes dull to most bartenders ([lesson 03.4](../module-03/lesson-04.md)). Add citrus on the day of service, or keep it separate and add it per drink.

### How much water to plan

There is no single number, and good sources disagree because they serve at different temperatures:

- **Stirred to order on ice:** Arnold measured a Manhattan gaining water equal to about **50%** of its starting volume; the course's dilution model gives about 49% for a 45-second stir at Manhattan strength ([lesson 03.5](../module-03/lesson-05.md)). That is the most water a pre-diluted stirred drink would ever need.
- **Freezer batches:** bartender Iain McPherson, quoted by Punch, adds **20–25%** of the batch volume as water and keeps his freezer at about −12 to −10 °C. A drink served that cold tastes less harsh, so it needs less water.
- **Fridge batches** (about 4 °C) sit between the two. This course starts at **40%**, the example from lesson 03.1, and adjusts by tasting (professional judgment).

Whatever you choose, taste one serving of the finished batch at serving temperature next to a drink stirred to order, and adjust in small steps (about 5% of the batch volume at a time; professional judgment). Write the final number on the label.

### The batch maths

From lesson 03.1, with every ingredient in ml (dashes × 0.8 ml, bar spoons × 5 ml):

$$\text{undiluted batch} = N \times \text{one drink's ml}$$

$$\text{water} = \text{undiluted batch} \times \text{planned dilution}$$

$$\text{one serving} = \frac{\text{undiluted batch} + \text{water}}{N}$$

$$\text{ABV after} = \frac{\text{ABV before}}{1 + \text{dilution}}$$

These are the same formulas the recipe scaler's `batch` preset uses.

### Fridge or freezer?

Alcohol lowers the temperature at which a mix freezes. The Engineering ToolBox gives these approximate freezing points for ethanol in water:

| ABV | 10% | 20% | 30% | 40% |
|---|---|---|---|---|
| Freezes at about | −4 °C | −9 °C | −15 °C | −23 °C |

A home freezer runs at about −18 °C. A pre-diluted batch below about 30–35% ABV can turn to slush or freeze there, and a glass bottle full of freezing liquid can crack. So: work out the ABV after dilution. In a −18 °C freezer keep only batches that stay above about 35% ABV after dilution (a Martini-style batch made with a strong gin); keep weaker ones (Manhattan and Negroni styles once diluted) in the fridge, or in a freezer set warmer, as McPherson does. Leave about 10% headspace in every bottle.

### The batch label

A batch label says more than a prep label, because someone else will serve from it:

- name, and "batch × N",
- **water included: yes/no, how many ml (planned dilution %)**,
- ABV after dilution,
- serving instruction: "pour 100 ml into a chilled coupe, garnish, do not stir" or "shake 95 ml with ice, double strain",
- date and time made, initials, and discard date if it contains juice.

> [!NOTE]
> Dilution figures are from Dave Arnold (2010), Punch (2024) and this course's model; freezing points from the Engineering ToolBox; all checked 2026-10-17. Spirit and vermouth ABVs in the examples are typical label values, assumed for the maths: use the ABV on your own bottles.

## Step by step

### Worked example 1: a pre-diluted Manhattan for 20, served from the fridge

IBA Manhattan ([lesson 05.2](../module-05/lesson-02.md)): 50 ml rye, 20 ml sweet vermouth, 1 dash Angostura. Planned dilution 40%. Assumed ABVs: rye 40%, vermouth 16%, Angostura 44.7%.

1. Scale: rye 50 × 20 = **1,000 ml**; vermouth 20 × 20 = **400 ml**; Angostura 20 dashes × 0.8 = **16 ml**.
2. Undiluted batch: 1,000 + 400 + 16 = **1,416 ml**.
3. Water: 1,416 × 0.40 = **566 ml**. Total: 1,416 + 566 = **1,982 ml**.
4. One serving: 1,982 ÷ 20 ≈ **99 ml**; pour 100 ml with your jiggers into a chilled coupe.
5. ABV: alcohol = 1,000 × 0.40 + 400 × 0.16 + 16 × 0.447 ≈ 471 ml, so 471 ÷ 1,416 ≈ 33% before; 33% ÷ 1.40 ≈ **24%** after.
6. Storage: 24% freezes at about −11 °C (between −9 °C at 20% and −15 °C at 30%), so a −18 °C freezer would turn it to slush. **Fridge.**
7. Container: 1,982 ml plus 10% headspace needs about 2.2 L: three 750 ml bottles.
8. Label: "Manhattan batch × 20. Water included: 566 ml (40%). ABV 24%. Pour 100 ml into a chilled coupe, cherry, do not stir. Made Thu 15:00, initials."

### Worked example 2: a Daiquiri pre-mix for 30, shaken to order

The IBA Daiquiri with the syrup swap from [lesson 05.4](../module-05/lesson-04.md): 60 ml white rum, 20 ml lime, 15 ml 1:1 syrup in place of 2 bar spoons of sugar.

1. The day before: rum 60 × 30 = 1,800 ml + syrup 15 × 30 = 450 ml = **2,250 ml** pre-mix. It keeps well because it has no juice. No water: every serving is shaken on ice.
2. On the day, within a few hours of service: press 20 × 30 = **600 ml** lime and add it to the pre-mix (or keep it separate and add 20 ml per drink).
3. One serving: 2,850 ÷ 30 = **95 ml**, shaken with ice and double strained.
4. Label: "Daiquiri pre-mix × 30 + lime. NO water: shake 95 ml with ice. Lime added Sat 17:00, discard at close."

### Make and check any batch

1. Write the single spec in ml; convert dashes and bar spoons.
2. Decide: pre-mix or pre-diluted? What stays out (bubbles, egg, herbs, citrus beyond the day)?
3. Multiply by N; add up; plan water only for a pre-diluted batch.
4. Check the container size (+10%) and, for the freezer, the ABV after dilution.
5. Measure into a clean jug, largest volumes first, then the small strong ones (bitters) with care; mix well.
6. Bottle, label fully, chill.
7. Taste one chilled serving against a drink made to order; adjust water in small steps and update the label.

## Hands-on

### What you need

- The worksheet [labs/module-08/batch-worksheet.md](../../labs/module-08/batch-worksheet.md) and a calculator.
- For the batches: cold strong black tea (brewed 4 minutes, cooled), 2 lemons, 1:1 syrup, red grape juice, a jigger, a measuring jug, two clean bottles or jars with lids, a shaker, a mixing glass or jar and bar spoon, ice, labels and a marker, your [practice log](../../templates/practice-log.md).
- Low-cost alternative: one jar per batch and a kitchen measuring jug; a jam jar as shaker.

### Time

70 minutes: 25 for the worksheet and the simulation, 30 to make and taste the two batches (plus a 2-hour chill), 15 to compare and log.

### Steps

1. **Worksheet.** Solve the five problems. Check problems 1–3 in the recipe scaler and compare its batch card with your numbers.

[Simulation: Recipe scaler — batch with dilution](../../simulations/recipe-scaler/index.html?preset=batch)

2. **Batch A, pre-mix for 6 (no water).** The Whiskey Sour home-practice spec from [lesson 05.5](../module-05/lesson-05.md) without the aquafaba (egg white and aquafaba stay out of batches): 45 ml cold black tea, 25 ml lemon, 20 ml 1:1 syrup. Measure 270 ml tea, 150 ml lemon and 120 ml syrup into a jar (540 ml), label it, and chill it for 2 hours.
3. **Batch B, pre-diluted for 4.** A stirred-style mix: 60 ml cold tea, 20 ml red grape juice, 5 ml syrup per serving (85 ml). Use the stirring dilution you measured in lesson 03.5 at 0% ABV, or 15% if you have no number: 340 ml base + 51 ml water = 391 ml. Label it with "water included" and chill for 2 hours.
4. After 2 hours, shake 90 ml of batch A on ice and strain. Make one Whiskey Sour practice drink fresh to the same spec. Taste both blind (someone else hands them to you).
5. Pour about 98 ml of batch B straight into a chilled glass. Stir one fresh serving (85 ml) on ice for 45 seconds and strain. Compare volume, temperature (a thermometer if you have one) and taste.
6. Log the results and what you would change on the labels.

### What you should see

Worksheet answers are in the solution file; the recipe scaler should match your batch card to the millilitre. Batch A shaken to order is usually hard to tell from the fresh drink; the lemon is a couple of hours old, which Arnold's tasters even preferred. Batch B poured from the fridge sits at about 4 °C, so it is noticeably less cold than the stirred serving (around 0 °C), but the volume and dilution are close. A pre-diluted batch can only be as cold as where you store it: that is the reason freezer batches use less water.

<details>
<summary>Reference result</summary>

Blind test A: picked the batch correctly once in two tries, "same balance, batch slightly less sharp". Batch B: 98 ml at 5 °C from the fridge versus 97 ml at 1 °C freshly stirred; batch "softer, a little sweeter, not watery".

</details>

### What this practice cannot teach

Tea and grape juice show you the maths, the order and the effect of temperature; they cannot show how a spirit-forward batch tastes when it is a little too strong or too thin, which you learn by tasting real batches against the house spec at work.

### Completion checklist

- [ ] I solved the five batch problems and checked three in the recipe scaler.
- [ ] I made a pre-mix and a pre-diluted batch with full labels.
- [ ] I compared each batch with a drink made to order and wrote down the difference.
- [ ] I can explain which batch gets water and which does not.

## Common mistakes

- **Water twice.** Water added to a batch that is then shaken or stirred on ice. Fix: label every batch "water included: yes/no".
- **No water at all in a pre-diluted batch.** Small, warm, harsh drinks. Fix: plan the water and check one serving's volume.
- **Batching the bubbles or the egg.** Flat drinks and a food-safety risk. Fix: add carbonated tops and shake egg white or aquafaba to order.
- **A Manhattan batch in a −18 °C freezer.** At about 24% ABV it slushes or freezes and can crack the bottle. Fix: fridge, or check ABV against the freezing table first.
- **Rounding before scaling.** Rounding 0.8 ml dashes to 1 ml turns 20 dashes into 20 ml instead of 16. Fix: scale exact numbers and round only the final batch amounts.

## Key takeaways

- A pre-mix gets no water and is shaken or stirred to order; a pre-diluted batch carries its water and is poured straight.
- Keep carbonation, egg white, muddled herbs and day-old citrus out of batches.
- Water = undiluted batch × planned dilution: about 50% is what stirring adds; fridge batches start near 40%, freezer batches 20–25%.
- ABV after = ABV before ÷ (1 + dilution); below about 30% ABV a batch may freeze in a −18 °C freezer.
- Label water, ABV, serving instruction, time and initials, and taste one serving before service.

## Sources

- [Cooking Issues — Cocktail Science in General, Part 2 of 2](https://cookingissues.com/2010/09/08/cocktail-science-in-generalpart-2-of-2/) (no single ideal dilution; stirred Manhattan about 50% water added; accessed 2026-10-17)
- [Punch — A guide to batching freezer Martinis and Negronis](https://punchdrink.com/articles/guide-batch-freezer-martini-negroni/) (Iain McPherson: add 20–25% of batch volume as water, freezer at about 10–14 °F; William Elliott's per-serving water amounts; 2024, accessed 2026-10-17)
- [The Engineering ToolBox — Ethanol freeze-protected water solutions](https://engineeringtoolbox.com/ethanol-water-d_989.html) (freezing points: 10% −4 °C, 20% −9 °C, 30% −15 °C, 40% −23 °C by volume; accessed 2026-10-17)
- [Cooking Issues — Fresh Lime Juice: WTF?](https://cookingissues.com/2010/10/01/fresh-lime-juice-wtf/) (blind tasters preferred lime juice about 4 hours old; accessed 2026-10-17)
