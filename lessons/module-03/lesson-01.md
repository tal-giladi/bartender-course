---
id: "03.1"
module: 3
minutes: 16
practice_minutes: 45
prerequisites: ["01.3"]
objectives:
  - Convert recipe amounts between ml, oz, cl, dashes and barspoons using this course's values (1 oz = 29.57 ml, bar 30 ml, barspoon 5 ml, dash 0.8 ml).
  - Turn a recipe written in parts into ml for any total volume.
  - Scale a recipe up or down for a number of drinks and check the total volume.
  - Calculate the water to add to a batch for a planned dilution, and the volume of one serving.
volatility: concept
sources:
  - title: "Wikipedia — Fluid ounce"
    url: https://en.wikipedia.org/wiki/Fluid_ounce
  - title: "International Bartenders Association — Cocktails"
    url: https://iba-world.com/cocktails/
  - title: "Cooking Issues (Dave Arnold) — Cocktail Science in General, Part 2 of 2"
    url: https://cookingissues.com/2010/09/08/cocktail-science-in-generalpart-2-of-2/
last_verified: "2026-10-17"
---

# 03.1 · Units, ratios and scaling a recipe

Recipes reach you in millilitres, ounces, centilitres, "parts" and dashes, and you will often need one drink, then eight, then a two-litre batch for an event. This lesson turns all of those into one language, millilitres, and shows the three calculations a bartender does most: converting units, turning parts into millilitres, and scaling a recipe, including how much water to add when you batch a drink ahead of time. In the hands-on part you work through a scaling worksheet and make a four-serve non-alcoholic batch, then check that the jug holds what your maths said.

## Why it matters

A private event books 40 stirred drinks for 20:00 and the manager asks you to batch them at 17:00. You multiply the recipe by 40, bottle it, chill it, and at 20:00 every drink is hot and harsh. You forgot the water that stirring would have added: for 40 drinks of about 90 ml at 40% dilution, that is almost 1.5 litres of water missing, and it is exactly the difference between a drink and a mistake. Another day, an American guest shows you a recipe in ounces and you pour 1½ "something" into a jigger marked in ml. Unit and scaling errors are silent: the drink still looks right, it just tastes wrong, and you do not find out until the guest does.

## Core ideas

### One working unit: the millilitre

This course works in millilitres (ml) and gives ounces (oz) where useful. You met the units in [lesson 01.3](../module-01/lesson-03.md); here they are as conversion rules you can calculate with.

| Unit | In ml (this course) | Note |
|---|---|---|
| 1 US fluid ounce (oz) | 29.57 exact, **30 bar convention** | UK imperial ounce is 28.41 ml |
| 1 centilitre (cl) | 10 | 4.5 cl = 45 ml |
| 1 barspoon | 5 | approximate; same as a teaspoon |
| 1 dash | 0.8 | approximate; one quick shake of a bitters bottle |
| 1 tablespoon | 15 | kitchen measure |

The bar convention (1 oz ≈ 30 ml) is what metric bars use when they convert an ounce recipe. The exact figure, 29.57 ml, matters only when you compare against an exact ounce measure; behind the bar, 1½ oz is 45 ml and ¾ oz is 22.5 ml (written 20 or 25 ml in some metric specs).

To convert:

$$\text{ml} = \text{oz} \times 30 \qquad \text{oz} = \text{ml} \div 30 \text{ (round to the nearest } \tfrac14\text{ oz)}$$

### Ratios and parts

A **ratio** (יחס, *yachas*) compares amounts: "2 : 1" means twice as much of the first as of the second. A recipe in **parts** gives only the ratio, so it works at any size. "2 parts base, ¾ part sour, ¾ part sweet" can be a single drink or a jug.

To turn parts into ml for a chosen total volume:

$$\text{ml of one ingredient} = \text{total ml} \times \frac{\text{its parts}}{\text{sum of all parts}}$$

Example: 2 : ¾ : ¾ adds up to 3.5 parts. For a 105 ml drink, one part is 105 ÷ 3.5 = 30 ml, so the drink is 60 ml, 22.5 ml and 22.5 ml. A shortcut when parts are given in ounce-like numbers: multiply each by 30.

### Scaling

To **scale** a recipe, multiply every ingredient by the same number of drinks, N. Scaling keeps the ratio, so the balance stays the same. Then add up the scaled amounts: the total tells you what container you need.

Two cautions:

- **Small, strong ingredients** (bitters, salt solution, very bitter liqueurs) are where a tiny error shows. Scale them exactly, then taste the batch before service and adjust in small steps (professional judgment).
- **Rounding** is fine for one drink and costly for a batch. Round the final batch amounts, not the single-drink amounts before multiplying.

### Batching and planned dilution

A **batch** (באץ', *batch*) is a quantity of a drink mixed ahead of time. When you shake or stir a drink with ice, the ice melts and adds water; this water is called **dilution** (דילול, *dilul*) and lesson 03.5 measures it. If you will pour a batch straight from a cold bottle without stirring it on ice, the water has to go into the bottle instead:

$$\text{water} = \text{undiluted batch volume} \times \text{planned dilution}$$

$$\text{one serving} = \frac{\text{undiluted batch} + \text{water}}{N}$$

Planned dilution is written as a fraction or percentage of the undiluted volume (0.40 = 40%). There is no single correct figure. Dave Arnold, who measured cocktails in a lab, rejects the often-quoted "25% for every drink"; his own stirred Manhattan-style batch added water equal to about half its starting volume. Lesson 03.5 gives the ranges and has you measure your own; this lesson uses **40%** as an example only.

If the batch will still be stirred or shaken on ice per serving, do **not** add the water: the ice will add it.

> [!NOTE]
> Unit values here are fixed definitions and course conventions (checked 2026-10-17). They are the same values the course calculators use, so your hand calculations and the simulations will agree.

## Step by step

### Convert an ounce recipe to ml

1. Read the unit at the top of the recipe before anything else.
2. Multiply each ounce amount by 30: 1½ oz → 45 ml, ¾ oz → 22.5 ml, ½ oz → 15 ml.
3. Convert dashes and barspoons: 2 dashes → 1.6 ml, 1 barspoon → 5 ml.
4. Write the ml recipe on a card; never pour from the ounce version "in your head".

### Turn parts into ml

1. Add up the parts.
2. Divide your target total volume by that sum: this is the ml in one part.
3. Multiply each ingredient's parts by the ml in one part.
4. Check: the ingredients must add up to the target total.

### Scale and batch

1. Write the single-drink recipe in ml, including dashes as ml.
2. Multiply each line by N, the number of drinks.
3. Add the scaled lines: this is the undiluted batch volume.
4. Decide: will each serving be stirred or shaken on ice? If yes, stop here.
5. If not, multiply the undiluted volume by the planned dilution to get the water, add it, and divide the total by N for the serving size.
6. Choose a container at least 10% larger than the total, label it with name, date, time and your initials, and chill it.

### Worked example

A stirred drink: 60 ml spirit, 30 ml vermouth, 2 dashes bitters. Batch for 10, served from the fridge without ice, planned dilution 40%.

| Line | One drink | × 10 |
|---|---|---|
| Spirit | 60 ml | 600 ml |
| Vermouth | 30 ml | 300 ml |
| Bitters (2 dashes × 0.8) | 1.6 ml | 16 ml |
| Undiluted total | 91.6 ml | 916 ml |
| Water (916 × 0.40) | — | 366 ml |
| Batch total | — | 1,282 ml |
| One serving | — | about 128 ml |

The batch does not fit in a 1-litre bottle: plan a 1.5-litre container before you start pouring.

## Hands-on

### What you need

- The worksheet [labs/module-03/scaling-worksheet.md](../../labs/module-03/scaling-worksheet.md) (spreadsheet version: [labs/module-03/scaling-sheet.csv](../../labs/module-03/scaling-sheet.csv)) and a calculator.
- For the batch: a jigger, a 500 ml (or larger) measuring jug, a lemon or two, cold black tea (brewed 4 minutes, cooled), sugar, warm tap water, a clean jar or bottle.
- Your practice log ([template](../../templates/practice-log.md)).
- Low-cost alternative: a tablespoon (15 ml) instead of a jigger, and any jug with ml marks.

### Time

45 minutes: 20 for the worksheet, 20 to make and check the batch, 5 to log.

### Steps

1. Do the 10 worksheet problems without looking at the solution. Show each calculation.
2. Check them against [the solution](../../labs/module-03/scaling-worksheet-solution.md). Redo any you got wrong and write down the mistake (unit, rounding, forgot dashes, forgot water).
3. Quick syrup for today: shake 100 g sugar with 100 g warm tap water in a closed jar until clear (lesson 03.4 teaches syrups properly).
4. The practice sour base, one serve: 60 ml cold tea, 22.5 ml lemon juice, 22.5 ml syrup. Scale it to 4 serves on paper and write the expected total.
5. Measure each scaled ingredient with the jigger into the jug. Count your jigger pours as you go.
6. Read the jug at eye level. Compare with your expected total.
7. Run the same recipe through the simulation below and compare its batch card with your paper version.
8. Keep the base in the fridge, labelled; you can use it in lesson 03.3. Log the session.

[Simulation: Recipe scaler — convert units](../../simulations/recipe-scaler/index.html?preset=convert)

[Simulation: Recipe scaler — scale a recipe](../../simulations/recipe-scaler/index.html?preset=scale)

[Simulation: Recipe scaler — batch with dilution](../../simulations/recipe-scaler/index.html?preset=batch)

### What you should see

The 4-serve batch should be 240 ml tea + 90 ml lemon + 90 ml syrup = 420 ml. A kitchen jug is only accurate to about ±10 ml, so a reading of 410–430 ml means your measuring and maths agree. A bigger gap usually means a miscounted jigger pour (one 22.5 ml pour too many or too few) or under-filled pours from [lesson 01.3](../module-01/lesson-03.md). Syrup is thicker than water and clings to the jigger, so a slow tip shows up here more than in the water drill.

<details>
<summary>Reference result</summary>

Worksheet: 9 or 10 of 10 correct after checking, with the typical first-time slips being forgetting the dashes in a batch total and adding batch water to a drink that will be shaken anyway. Batch: expected 420 ml; a careful learner reads 415–425 ml on a jug with 10 ml marks.

</details>

### What this practice cannot teach

At a bar, batches are made in litres from spirits, poured into labelled bottles, and checked by taste against the house spec; your tea batch trains the maths and the measuring, not the taste of a spirit-forward batch.

### Completion checklist

- [ ] I did all 10 worksheet problems and corrected every mistake.
- [ ] I can convert ½, ¾, 1, 1½ and 2 oz to ml, and 2 dashes and 1 barspoon to ml, without notes.
- [ ] I scaled the practice sour to 4 serves and my jug reading was within 10 ml of my calculation.
- [ ] I can explain when a batch needs water added and when it does not.
- [ ] The session is in my practice log.

## Common mistakes

- **Reading the number, not the unit.** "1½" poured as ml, or "45" read as oz. Fix: say the unit aloud before the first pour; write converted cards in ml only.
- **Forgetting dashes in a batch.** Two dashes is nothing in one drink and 16 ml in ten. Fix: convert dashes to ml before scaling.
- **Rounding too early.** Rounding 22.5 ml up to 25 ml, then multiplying by 40, adds 100 ml of one ingredient. Fix: round the scaled amounts at the end.
- **Adding water twice.** Water added to a batch that is then shaken on ice gives a thin drink. Fix: add batch water only when servings are poured without ice-mixing.
- **No container plan.** A batch that overflows its bottle wastes product and time. Fix: add up the total first, pick a container 10% bigger.
- **Unlabelled batches.** Nobody knows what is in the bottle or when it was made. Fix: label name, date, time and initials (as in [lesson 01.7](../module-01/lesson-07.md)).

## Key takeaways

- Work in ml: oz × 30, cl × 10, barspoon 5 ml, dash 0.8 ml.
- Parts give the ratio; ml per part = total ÷ sum of parts.
- Scaling multiplies every line by N and keeps the balance; check the total.
- Batch water = undiluted volume × planned dilution, only for drinks served without ice-mixing.
- Round at the end, convert dashes first, and label every batch.

## Sources

- [Wikipedia — Fluid ounce](https://en.wikipedia.org/wiki/Fluid_ounce) (US fl oz = 29.5735 ml; imperial 28.41 ml; accessed 2026-10-17)
- [International Bartenders Association — Cocktails](https://iba-world.com/cocktails/) (current specs are written in ml; checked 2026-10-17)
- [Cooking Issues — Cocktail Science in General, Part 2 of 2](https://cookingissues.com/2010/09/08/cocktail-science-in-generalpart-2-of-2/) (Dave Arnold: no single ideal dilution; batch water worked out by weighing; Manhattan batch about 50% water; accessed 2026-10-17)
