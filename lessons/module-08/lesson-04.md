---
id: "08.4"
module: 8
minutes: 18
practice_minutes: 70
prerequisites: ["08.2", "01.7"]
objectives:
  - Count bottles by tenths and by weight, and convert a weighed partial bottle to ml.
  - Calculate usage, variance and variance % for a week and say which items to investigate.
  - Set a par level from usage, deliveries and safety stock, and work out an order quantity from par and stock on hand.
  - Keep a waste log and handle a stock-out during service by asking for backup, 86ing or offering a substitute.
volatility: concept
sources:
  - title: "BinWise — How to set par levels for bar inventory"
    url: https://home.binwise.com/blog/setting-par-level-inventory
  - title: "FOODSAFE (British Columbia) — Receiving and Storage Guidelines"
    url: https://www.foodsafe.ca/docs/Receiving_&_Storage_Guidelines.pdf
  - title: "Canada Revenue Agency — Canadian Alcoholometric Laboratory Table 1996"
    url: https://www.canada.ca/en/revenue-agency/services/tax/technical-information/excise-duty/tables-alcoholometry/canadian-alcoholometric-laboratory-table-1996.html
last_verified: "2026-10-17"
---

# 08.4 · Stock counts, FIFO, waste and ordering

A bar's stock is its money sitting on shelves. Counting it, rotating it, recording what is wasted and ordering the right amount are jobs most new bartenders and barbacks share from their first weeks. This lesson shows how to count full and partial bottles, how to compare what was used with what the till says was sold (variance), how to set a par level and work out an order, how to keep a waste log, and what to do when something runs out in the middle of a shift. In the hands-on part you reconcile a week of stock for eight bottles, practise a weigh-count, and run the service simulation's stock-out shift.

## Why it matters

Monday morning count: the white rum is down 210 ml more than the till says was sold. Was it over-pouring, a dropped bottle nobody wrote down, a Daiquiri remade three times, a wrong count last week, or a drink missing from the POS? Without a waste log and a careful count, nobody knows, and the manager starts guessing. On Friday the opposite problem: no Aperol in the storeroom because the order was based on a feeling, and a third of the drinks list is a spritz. Counting and ordering well is how a bar stays stocked without tying cash up in bottles, and how a new bartender shows they can be trusted with the storeroom key.

## Core ideas

### Words

**Inventory** (מלאי, *melai*) is everything the bar holds for sale. A **stock count** (ספירת מלאי, *sfirat melai*) records how much of each item is there at a given moment. Bars count on a fixed schedule, often weekly, at the same time (before opening or after close), in the same order as the shelves are laid out, so nothing is missed or counted twice (professional judgment). The **storeroom** (מחסן, *machsan*) holds the backup stock.

### Counting full and partial bottles

- **Full bottles** are counted as whole numbers, sealed and unopened.
- **Partial bottles by eye:** hold the bottle level at eye height and estimate in **tenths** (0.1 = one tenth full). Quick, and accurate to about a tenth.
- **Partial bottles by weight:** more accurate. Weigh the bottle, subtract the weight of the same bottle empty (bars keep a list of empty weights, or weigh one empty bottle of each product), and divide by the liquid's density:

$$\text{ml in the bottle} = \frac{\text{bottle weight (g)} - \text{empty bottle weight (g)}}{\text{density (g/ml)}}$$

Water is 1.00 g/ml. A 40% ABV spirit is about **0.95 g/ml**: the Canada Revenue Agency's alcoholometric table pairs a density of 0.9460 at 20 °C with 40.61% alcohol by volume. Liqueurs contain sugar and are denser; weigh a known volume once to find their density (professional judgment).

Example: a 700 ml vodka bottle weighs 812 g; the empty bottle weighs 480 g. (812 − 480) ÷ 0.95 = 332 ÷ 0.95 ≈ **349 ml**, half a bottle (0.5).

### Usage, variance and what they mean

The [inventory count template](../../templates/inventory-count.md) uses three formulas, the same ones the course's simulations use:

$$\text{used} = \text{opening count} + \text{received} - \text{closing count}$$

$$\text{variance} = \text{used} - \text{sold per POS}$$

$$\text{variance \%} = \frac{\text{variance}}{\text{sold}} \times 100$$

"Sold per POS" is the ml the till says were sold: number of drinks × ml of that product in each spec.

Example, vodka for one week: opening 1.2 bottles, received 6, closing 2.6. Used = 1.2 + 6 − 2.6 = 4.6 bottles = 3,220 ml. The POS shows 3,150 ml sold. Variance = 3,220 − 3,150 = **70 ml**, or 70 ÷ 3,150 = **2.2%**.

A **positive** variance means more left the bottle than was sold: over-pouring, spills, breakage, remakes, free drinks that were not rung in, a drink missing from the POS, or theft. A **negative** variance means less left the bottle than was sold: under-pouring, a drink rung in twice, or a counting mistake. Each bar sets its own **tolerance**, often a few percent; it is a management choice, not a law. Anything outside it is investigated, starting with a recount.

### The waste log

A **waste log** (in Israeli bars often "פחת", *pachat*, the business word for shrinkage and waste) records every ml that leaves a bottle without being sold: item, amount, reason (spill, broken bottle, remake, sent back, staff error, expired prep), time and initials. Logged waste is **explained** variance. In the vodka example, a spilled Moscow Mule (45 ml) was logged, so only 25 ml (0.8%) is unexplained. Writing down your own mistakes feels bad; not writing them down makes the whole team look like over-pourers or thieves.

### FIFO in the storeroom

When a delivery arrives, check it against the order (item, amount, dates, damage) before signing, then put new stock **behind** the old so the oldest is used first (FOODSAFE). Write the delivery date on cases. Rotation matters most for anything with a date: juices, mixers, beer, cream, vermouth.

### Par levels and ordering

A **par level** is the amount of an item to hold after each delivery, enough to last until the next delivery with a margin. BinWise, a bar-inventory software company, gives this formula:

$$\text{par} = \frac{\text{usage per period} + \text{safety stock}}{\text{deliveries per period}}$$

**Safety stock** covers a busier week or a late delivery; about 25% of usage is a common starting point in industry guides, adjusted item by item. Then:

$$\text{order quantity} = \text{par} - \text{on hand, rounded up to whole bottles}$$

Example: the bar uses about 5 bottles of vodka a week and gets one delivery a week. Par = (5 + 1.25) ÷ 1 = 6.25, rounded up to **7 bottles**. At the count there are 2.6 bottles: 7 − 2.6 = 4.4, so order **5**. Review pars when the menu or the season changes: a summer spritz menu needs a higher Aperol par than the winter one.

### When something runs out during service

Stock-outs happen even in good bars. In order of preference:

1. **Before it runs out:** check levels during every reset; when a bottle or juice is down to the last few servings, ask the barback for the backup **now** (lesson 08.7 covers how to ask).
2. **It ran out, backup exists:** ask the barback, or fetch it yourself if nobody can; tell waiting guests it will be a minute.
3. **No backup:** the item is **86'd** (finished for the night). Tell the servers and the shift manager at once so nobody sells it, and offer the guest an honest alternative you can make. Never quietly change a spec (a Margarita without lime is not a Margarita).

> [!NOTE]
> The par formula and the 25% safety stock are from an industry source (BinWise); density from the Canada Revenue Agency table; all checked 2026-10-17. Tolerance levels, count schedules and the examples' numbers are professional judgment or invented for practice.

## Step by step

### Do a stock count

1. Count at the agreed time, before anything is poured or after everything is closed.
2. Work shelf by shelf in a fixed order: back bar, speed rails, fridges, storeroom.
3. Full bottles as whole numbers; open bottles in tenths, or weigh them.
4. Write the count straight onto the sheet; do not count from memory.
5. Add the week's deliveries (from the signed delivery notes) and the POS sales in ml.
6. Calculate used, variance and variance %; subtract logged waste to see what is unexplained.
7. Recount anything outside tolerance before reporting it.

### Write the order

1. For each item: order = par − on hand, rounded up to whole bottles (zero if on hand is above par).
2. Add known extras (an event, a new menu drink).
3. Group the list by supplier and delivery day.
4. When the delivery comes: check against the order, sign, rotate stock (new behind old), file the note.

## Hands-on

### What you need

- [labs/module-08/inventory-week.csv](../../labs/module-08/inventory-week.csv) (eight bottles, one week, plus a waste log) and the worksheet [labs/module-08/inventory-worksheet.md](../../labs/module-08/inventory-worksheet.md); a spreadsheet or calculator.
- The [inventory count template](../../templates/inventory-count.md).
- For the weigh-count: an empty 700 ml or 750 ml glass bottle, water, a kitchen scale (1 g steps), a measuring jug.
- Low-cost alternative: any glass bottle with a known volume; a jug instead of the bottle for the "true" volume.

### Time

70 minutes: 30 for the reconciliation, 15 for the weigh-count, 25 for the simulation shift and notes.

### Steps

1. **Reconcile the week.** For each item calculate used (bottles and ml), variance in ml and %, unexplained variance after the waste log, and the order quantity. Mark every item outside a 3% tolerance.
2. For each marked item write the two most likely causes and what you would check first.
3. **Weigh-count.** Weigh the empty bottle. Pour in an amount of water you do not look at (ask someone, or pour without watching). Estimate the level in tenths by eye. Then weigh and calculate ml with density 1.00. Finally pour it into the jug to read the true volume. Repeat three times.
4. **Stock-out shift.** Run the simulation below.

[Simulation: Service shift — stock-outs](../../simulations/service-sim/index.html?preset=stockout)

The `stockout` shift has 15 tickets of 1–3 drinks, one about every 70 seconds, from the twelve Module 5 drinks. The lime juice starts at 300 ml and runs out around ticket 6; the open Aperol bottle starts at 200 ml and runs out around ticket 11, with a backup in the storeroom. When stock runs low you choose: ask the barback (3 seconds of your time; a bottle arrives 60 seconds later, a new bottle of juice 120 seconds later), fetch it yourself from the storeroom (45 seconds), squeeze juice yourself (90 seconds), or 86 the drink and offer a substitute you can make (3 seconds). Serving a drink with a missing ingredient or a quietly changed spec counts as an incorrect drink. After the last ticket you count six items and enter an order for each (par − on hand, rounded up). **Targets:** accuracy at least 90%, average ticket time at most 180 seconds, waste at most 5%, no drink served with a missing or unapproved ingredient, and all six order quantities correct.

5. Fill in the [service debrief](../../templates/service-debrief.md) and note when you first noticed each item running low.

### What you should see

Three items stand out after the waste log: white rum (+6.3% unexplained), Campari (−6.7%) and coffee liqueur (+6.1%). The solution explains likely causes. Your by-eye estimates are usually within one tenth of the weighed amount, and the weighed amount within about 5–10 ml of the jug; a bigger gap means a wrong empty weight or a tilted bottle. In the simulation, learners who ask the barback at the first low-stock warning usually keep ticket times well under target; those who wait until the bottle is empty lose 45–90 seconds and their next tickets back up.

<details>
<summary>Reference result (weigh-count)</summary>

Empty bottle 480 g. Run 1: eye 0.4, scale 772 g → 292 ml, jug 290 ml. Run 2: eye 0.7, scale 965 g → 485 ml, jug 480 ml. Run 3: eye 0.2, scale 611 g → 131 ml, jug 130 ml. Eye estimates were within a tenth (70 ml); the scale within 5 ml.

</details>

### What this practice cannot teach

A real count is done in a cold storeroom with hundreds of products, interruptions and a manager waiting for the numbers, and real variance has real people behind it; you practise the method and the arithmetic, and you learn the venue's own sheet, tolerance and suppliers on the job.

### Completion checklist

- [ ] I calculated used, variance, variance %, unexplained variance and order quantity for all eight items.
- [ ] I marked the items outside tolerance and wrote likely causes for each.
- [ ] I did three weigh-counts and compared eye, scale and jug.
- [ ] I ran the stock-out shift and filled in the service debrief, including the order list result.

## Common mistakes

- **Counting in a different order every week.** Bottles are missed or counted twice. Fix: follow the shelf order on the sheet.
- **Not logging waste.** Every spill becomes "unexplained". Fix: log it when it happens, with amount and reason.
- **Ordering to par instead of up to par.** Ordering 7 when par is 7 and you still have 2.6 overstocks. Fix: order = par − on hand.
- **Putting new stock in front.** Old bottles and mixers go out of date at the back. Fix: new behind old, dates on cases.
- **Waiting for the bottle to run dry.** The stock-out then costs a minute in the middle of a ticket. Fix: check levels at every reset and ask for backup early.

## Key takeaways

- Count in a fixed order; partial bottles by tenths or, more accurately, by weight: (gross − empty) ÷ density, about 0.95 g/ml for 40% spirits.
- Used = opening + received − closing; variance = used − sold; variance % = variance ÷ sold × 100.
- The waste log turns unexplained variance into explained waste; log your own mistakes.
- Par = (usage + safety stock) ÷ deliveries per period; order = par − on hand, rounded up.
- When stock runs low, ask early; when it is gone, 86 it, tell the team and offer an honest alternative.

## Sources

- [BinWise — How to set par levels for bar inventory](https://home.binwise.com/blog/setting-par-level-inventory) (par = (average usage + safety stock) ÷ deliveries per period; safety stock about 25% of usage; order up to par, not par itself; review regularly; industry source, accessed 2026-10-17)
- [FOODSAFE (British Columbia) — Receiving and Storage Guidelines](https://www.foodsafe.ca/docs/Receiving_&_Storage_Guidelines.pdf) (check deliveries; FIFO: old stock to the front, new behind; rotate by code date; accessed 2026-10-17)
- [Canada Revenue Agency — Canadian Alcoholometric Laboratory Table 1996](https://www.canada.ca/en/revenue-agency/services/tax/technical-information/excise-duty/tables-alcoholometry/canadian-alcoholometric-laboratory-table-1996.html) (density in air 0.9460 at 20 °C corresponds to 40.61% by volume; official guidance, accessed 2026-10-17)
