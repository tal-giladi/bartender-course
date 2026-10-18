---
id: "11.2"
module: 11
minutes: 12
practice_minutes: 60
prerequisites: ["05.1", "05.8", "06.5", "06.7", "11.1"]
objectives:
  - Recall 20 randomly drawn course specs from memory, with every ml within ±5 ml, the method, the glass and ice, and the garnish, and score at least 80%.
  - Mark a recall attempt strictly against the course specs and classify every error by type.
  - Plan a remediation and retake from the error pattern when the score is below 80%.
volatility: concept
sources:
  - title: "IBA — Cocktails (official list)"
    url: https://iba-world.com/cocktails/
  - title: "Wikipedia — Testing effect"
    url: https://en.wikipedia.org/wiki/Testing_effect
  - title: "Wikipedia — Spaced repetition"
    url: https://en.wikipedia.org/wiki/Spaced_repetition
last_verified: "2026-10-18"
---

# 11.2 · Recipe recall exam

This is the recipe recall part of the final assessment, worth 25% of your grade. You recall 20 drinks drawn at random from the 30 specs taught in Modules 5 and 6, without notes, and each drink is marked on four things: the ingredients and their ml, the method, the glass and ice, and the garnish. You need 80% to pass this part. You will warm up, sit the exam in the recipe drill simulation, mark it, and turn your errors into a short remediation plan.

## Why it matters

On a busy night a guest orders a Paper Plane and a Sidecar, and the server adds a Pisco Sour for table six. There is no time to look anything up, and the spec book is behind the POS. A bartender who knows the specs builds all three in one pass; one who half-knows them guesses, and a guessed drink is either remade (time and waste) or served wrong (a guest who does not come back). Recall is the base of speed and of consistency, which is why it carries a quarter of the grade.

## Core ideas

### What the exam covers

The draw pool is every spec in the [recipe library](../../references/recipe-library.md): the twelve Module 5 classics ([05.2](../module-05/lesson-02.md) to [05.7](../module-05/lesson-07.md)), the Module 6 drinks ([06.2](../module-06/lesson-02.md) to [06.5](../module-06/lesson-05.md)) and the two arak serves from [06.7](../module-06/lesson-07.md), thirty in all. The specs are the course cards: IBA unless the card says otherwise (checked 2026-10-17).

### How each drink is marked

The standard is the same one you met in [lesson 05.8](../module-05/lesson-08.md):

| Part (per drink) | Point if… |
|---|---|
| Ingredients and ml | every ingredient named and every amount within ±5 ml (dashes, cubes, sprigs, bar spoons and "to top" as the spec says) |
| Method | the right technique and its key step (dissolve sugar, dry shake with egg, top with soda last) |
| Glass and ice | the right glass and the right ice in it, or "no ice" |
| Garnish | the spec garnish, or "none" where the spec has none |

20 drinks × 4 points = 80 points. Score = points ÷ 80 × 100. **Minimum: 80%, which is 64 points.**

Each cell is all or nothing. A Margarita with 50 ml tequila, 20 ml triple sec and 25 ml lime loses the ingredients point, because 25 is 10 ml away from the spec's 15. This is strict on purpose: on a shift, "nearly the spec" tastes different and costs differently.

### The simulation's exam preset

The recipe drill's `exam` preset draws 20 cards without repeats, hides every spec until the end, accepts no hints and marks each card with the four points above. The end screen shows a per-card breakdown, the correct spec for every card and a "copy results" block (seed, date, points, percentage) to paste into your score sheet. Each run has a seed (a number that fixes the random draw); a retake uses a new seed so you meet a new set of cards.

If you cannot use the simulation, the paper version in [labs/module-11/recall-exam-grid.md](../../labs/module-11/recall-exam-grid.md) gives the same exam: someone else draws 20 numbers from the numbered list of 30, you fill in the grid in 30 minutes, then you mark it against the recipe library.

### Why the exam is random

A fixed list lets you memorise the order instead of the drinks. A random draw tests what a shift tests: any drink at any moment. It also uses the testing effect (retrieving something from memory makes it stick better than re-reading it), so even a failed attempt is useful practice, provided you mark it honestly and learn the misses.

> [!NOTE]
> Specs follow the IBA list as recorded in Modules 5 and 6 (checked 2026-10-17). IBA specs change occasionally; if a card in the recipe library is updated, the exam marks against the updated card.

## Step by step

### Before the exam (one week)

1. Run one recall session per day with your flashcards and Leitner boxes ([05.1](../module-05/lesson-01.md)): Module 5 and Module 6 cards together.
2. Two days before, run the drill's family and Module 5 presets once each and note the drinks you miss.
3. The day before, re-read only the cards you missed. Do not cram all thirty.

### Sitting the exam

1. Put the recipe library, your flashcards and your notes away. Close other browser tabs.
2. Open the recipe drill with the `exam` preset; write the seed on your score sheet.
3. For each card, enter every ingredient with ml, the method, the glass and ice, and the garnish. Do not skip a card; a blank scores zero, a guess might score.
4. Finish all 20 cards. Do not restart.
5. Copy the results block into your score sheet.

### Marking and remediation

1. Go through the breakdown card by card and log every missed cell in the error log (drink, cell, what you wrote, the spec, error type).
2. Count errors by type. Most learners have one dominant type: ml on sours, garnish on Module 6 drinks, or glass on the stirred drinks.
3. If you scored below 80%: one week of daily recall sessions aimed at your dominant error type and the missed drinks, logged; then a retake with a new seed.

## Hands-on

### What you need

- A device with a browser for the recipe drill simulation.
- The [exam score sheet](../../labs/module-11/exam-score-sheet.md) and the error log at the end of the [paper recall grid](../../labs/module-11/recall-exam-grid.md).
- Your flashcards from [labs/module-05/spec-flashcards.md](../../labs/module-05/spec-flashcards.md) for the warm-up.
- Low-cost alternative: the paper version of the exam, a helper (or a random number app) to draw the drinks, and a pen.

### Time

60 minutes: 15 for a warm-up, 30 for the exam, 15 to mark, log errors and plan.

### Steps

1. **Warm up** (not scored) with one short run of either practice preset. Stop after ten cards.

[Simulation: Recipe drill — Module 5 classics](../../simulations/recipe-drill/index.html?preset=m05)

[Simulation: Recipe drill — cocktail families](../../simulations/recipe-drill/index.html?preset=families)

2. Take a five-minute break. Put everything away.
3. **Sit the exam**: 20 cards, closed book, no restart. Write the seed down first.

[Simulation: Recipe drill — final exam](../../simulations/recipe-drill/index.html?preset=exam)

4. **Record** the points and percentage on the score sheet.
5. **Log every error** by type and name your dominant error type.
6. If you scored below 80%, write a one-week remediation plan (which drinks, how often, which error type) and a retake date. If you passed, still pick your three weakest drinks for the performance report.
7. Optional cross-check: a few days later, sit the paper version with a different draw. If the two scores differ by more than 10 points, trust the lower one and practise.

### What you should see

A learner who did the daily recall sessions of Modules 5 and 6 usually lands between 70% and 90% on a first attempt (professional judgment). The most common misses are the ml of the modifiers (triple sec, syrup, vermouth) rather than the base spirit, the garnish of drinks learned last, and mixing up the IBA spec with a variation you read on a card. If you score below 60%, the problem is usually coverage (some drinks never learned), not detail; go back to the cards for those drinks first.

<details>
<summary>Example marking (four of twenty cards)</summary>

| Drink | Ingredients and ml | Method | Glass and ice | Garnish | Points | Why |
|---|---|---|---|---|---|---|
| Sidecar | cognac 50, triple sec 20, lemon 20 | shake, strain | cocktail glass, no ice | none | 4 | matches the 06.2 card |
| Negroni | gin 30, Campari 30, sweet vermouth 30 | build on ice, stir | old fashioned glass, cubes | lemon twist | 3 | garnish is half an orange slice |
| Margarita | tequila 50, triple sec 20, lime 25 | shake, strain | cocktail glass, no ice | half salt rim | 3 | lime 15 ml, not 25 |
| Paloma | tequila 50, lime 5, pink grapefruit soda 100, salt pinch | build on ice | highball, cubes | lime slice | 4 | matches the 06.3 card |

Check every row against the recipe library yourself; the point is the marking logic, not these four drinks.

</details>

### What this practice cannot teach

Typing a spec is not making it. Recall gets the right numbers into your head; the technique exam (11.3) and the service exam (11.4) test whether your hands and your sequencing turn them into drinks under time pressure.

### Completion checklist

- [ ] I sat the recall exam closed book, in one sitting, without restarting.
- [ ] I recorded the seed, the points and the percentage on my score sheet.
- [ ] I logged every error with its type and named my dominant error type.
- [ ] I scored at least 80%, or I wrote a remediation plan and a retake date.

## Common mistakes

- **Marking "close enough".** 25 ml lime instead of 15 is a different drink. Fix: ±5 ml or no point, every time.
- **Leaving cards blank.** A blank always scores zero. Fix: write your best answer; method and glass often score even when ml are shaky.
- **Learning the variation instead of the spec.** Fix: when a card shows a variation, learn the IBA spec first and the variation as "also seen".
- **Restarting for a better draw.** Fix: first complete run counts; retake later with a new seed.
- **Retaking the next day without practice.** You measure the same gaps again. Fix: a week of targeted recall first.

## Key takeaways

- 20 random drinks from 30 specs, 4 points each: ingredients and ml (±5 ml), method, glass and ice, garnish.
- Minimum 80% (64 of 80 points); recall is 25% of the final grade.
- Closed book, one sitting, first complete run counts; retake with a new seed after targeted practice.
- Log errors by type: the dominant type tells you what to practise.

## Sources

- [IBA — Cocktails (official list)](https://iba-world.com/cocktails/) (the default specs behind the course cards; accessed 2026-10-18)
- [Wikipedia — Testing effect](https://en.wikipedia.org/wiki/Testing_effect) (retrieval practice strengthens long-term memory more than re-reading; accessed 2026-10-18)
- [Wikipedia — Spaced repetition](https://en.wikipedia.org/wiki/Spaced_repetition) (spacing reviews over days, the basis of the one-week plan; accessed 2026-10-18)
