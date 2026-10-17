---
id: "08.5"
module: 8
minutes: 18
practice_minutes: 70
prerequisites: ["04.2", "05.8"]
objectives:
  - Choose which waiting ticket to make next using oldest-first and the quick-win exception, and show the effect on average ticket time.
  - Sequence the work inside a ticket so every drink finishes within 30 seconds of the others, with bubbles and garnish last.
  - Build a round of identical drinks in passes and calculate the time saved with the service simulation's time table.
  - Complete the service simulation's practice shift with at least 90% accuracy, an average ticket time of 150 seconds or less and waste of 5% or less.
volatility: concept
sources:
  - title: "IBA — Cocktails (official list)"
    url: https://iba-world.com/cocktails/
  - title: "Wikipedia — Shortest job next"
    url: https://en.wikipedia.org/wiki/Shortest_job_next
last_verified: "2026-10-17"
---

# 08.5 · Speed: sequencing orders and building rounds

Fast bartenders rarely move their hands faster than anyone else. They are fast because they choose the right ticket next, line up a round before they touch a bottle, pick each bottle up once, start the slow drinks first and finish every drink in the order at the same moment. This lesson turns that into rules you can practise: how to order the queue, how to sequence the work inside a ticket, how to build rounds in passes, and how the course's service simulation times you. In the hands-on part you solve sequencing problems on paper, run the simulation's tutorial and practice shifts, and time a home round two ways.

## Why it matters

Three tickets print at once: four Mojitos for a table, two draught beers at the bar, and a Negroni, a Daiquiri and an Espresso Martini. A bartender who works strictly in printed order makes the beer drinkers wait five minutes for 20 seconds of work. One who makes each drink start to finish lets the Negroni sit melting on its ice while the Espresso Martini is shaken, so the first drink served is already watery. One who works well pours the beers in 20 seconds, lines up three glasses, finishes all three drinks together and moves on, and every guest waits less. Ticket time is the number managers watch on a busy night, and it is mostly decided by sequence, not by speed.

## Core ideas

### Tickets and ticket time

A **ticket** (in Israeli bars usually "bon", בון, from the kitchen; professional judgment) is one order printed or sent from the POS, from a server or from your own bar guests. **Ticket time** is from the moment the ticket arrives to the moment all its drinks are served. **Average ticket time** across a shift is the main speed measure in this course and in the service simulation.

### Which ticket next: oldest first, with one exception

1. **Oldest first.** Tickets are made in the order they arrive. It is fair, and guests notice when someone who came later is served first.
2. **Quick-win exception.** A ticket that takes about 30 seconds or less (beer, a glass of wine, a simple highball) may go before an older, longer ticket, when it cuts the waiting of one guest a lot and delays the other only a little. This is the logic of "shortest job first" from computing and queue theory: short jobs first lowers the average wait.
3. **Never skip the same ticket twice**, and never let a skip make an older ticket's drinks wait. Queue theory has a name for what happens otherwise: "starvation", where a long job waits for ever because short ones keep arriving. Fairness still matters (professional judgment).
4. **Follow house priorities.** Some venues put server tickets for food tables first, or VIP areas; the shift manager tells you at the briefing.
5. **Acknowledge everyone.** Eye contact and "with you in one minute" make a wait feel shorter (Module 9).

Example with the simulation's times (table below): ticket A (Negroni, Daiquiri, Espresso Martini) takes 83 seconds of work; ticket B (two draught beers) takes 23 seconds. Both are waiting now.

| Order | A served at | B served at | Average ticket time |
|---|---|---|---|
| A then B | 83 s | 106 s | 94.5 s |
| B then A | 106 s | 23 s | 64.5 s |

Ticket A waits 23 seconds longer, ticket B 83 seconds less, and the average falls by 30 seconds.

### Inside a ticket: "ingredients wait, ice does not"

Liquid in an empty tin or mixing glass can wait for minutes. The moment ice touches it, the clock starts: it dilutes and warms or, in a highball, goes flat. So the rule is to do everything that can wait first, and everything with ice, bubbles or foam last, so all drinks finish together:

1. **Read the whole ticket** and say it back if it came by voice (lesson 08.7).
2. **Glasses out**, all at once, in the order you will serve them. You see the whole ticket in front of you.
3. **Pours in passes**: everything into tins, mixing glasses and glasses without ice, one bottle at a time across all drinks that use it ([lesson 04.2](../module-04/lesson-02.md)).
4. **Slowest ice step first**: stirred drinks (about 20–45 seconds), then shaken (about 10–15 seconds), then built drinks get their ice.
5. **Shake two tins at once** and stir two glasses at once when you can.
6. **Bubbles and garnish last**: top with soda, tonic, ginger beer or sparkling wine just before serving.
7. **Check against the ticket, serve together.**

### Rounds: identical drinks in passes

A **round** (in Israel often "sivuv", סיבוב; professional judgment) is several drinks for one group. With identical drinks, passes and double-shaking save the most time. With the simulation's times and four tins on the station, four Daiquiris take:

| Method | Steps | Time |
|---|---|---|
| Drink by drink | 4 × (glass 2 + three pours 12 + shake 12 + strain 3) + serve 3 | 119 s |
| Passes, two tins per shake | glasses 8 + rum 10 + lime 10 + sugar 10 + two double shakes 24 + strains 12 + serve 3 | 77 s |

Same four drinks, 42 seconds saved, and they finish within a few seconds of each other.

### How the service simulation times you

The course's service simulation is an **educational model**: it does not measure your hands, it counts the time each action would take at a working pace, so that sequencing decisions show up in the numbers. Every action adds a fixed number of seconds to the shift clock:

| Action | Shift seconds |
|---|---|
| Take a glass | 2 per glass |
| Ice a glass (with the scoop) | 3 per glass |
| Pour an ingredient with the jigger | 4 for the first pour from a bottle; 2 for each next pour from the same bottle in a row |
| Top with soda, tonic, ginger beer, cola or sparkling wine | 3 |
| Muddle | 8 |
| Shake (one or two tins at once) | 12 |
| Stir in a mixing glass (one or two at once) | 20 |
| Stir a built drink in its glass | 5 |
| Strain | 3 per drink |
| Garnish | 4 per drink |
| Pour a draught beer | 8 |
| Pour a glass of wine | 6 |
| Rinse a tin or mixing glass before reusing it | 3 |
| Bin a drink | 2 |
| Serve the ticket (all its drinks together) | 3 |
| Ask the barback for something | 3 (a bottle arrives 60 s later; fresh juice 120 s later) |
| Fetch it yourself from the storeroom | 45 |
| Squeeze a new bottle of juice yourself | 90 |
| Tell the server a drink is 86'd and offer a substitute | 3 |

The station has four tins and two mixing glasses. The rules:

- **Ticket time** runs from the ticket's arrival to "serve".
- A drink is **finished** when its last step is done. A finished drink that waits more than **30 seconds** before its ticket is served is **dead** (warm, watery or flat).
- A drink is **correct** when the glass, ice, every ingredient (within ±5 ml of the card), method and garnish match the recipe card and it is not dead.
- **Accuracy %** = correct drinks served ÷ drinks ordered × 100.
- **Waste %** = ml of product in binned, dead and remade drinks ÷ all ml poured × 100.
- The shift ends when the last ticket is served.

Recipe cards in the simulation are the course's specs from Modules 5 and 6. These times are rough working-pace estimates for practice, not industry standards (professional judgment); a real bartender's times vary with the bar layout and the drink.

> [!NOTE]
> The sequencing rules and action times are professional judgment; the queue example uses the simulation's own times. Specs follow the IBA list as used in Modules 5 and 6 (checked 2026-10-17).

## Step by step

### When tickets are waiting

1. Look at every waiting ticket and its age.
2. Take the oldest, unless a ticket of about 30 seconds or less can go first without making the oldest wait long, and it has not already been skipped.
3. Acknowledge anyone you are not serving yet.

### Making one ticket

1. Read the ticket; check every drink is on the menu and in stock.
2. Glasses out, in serving order.
3. Pours in passes, without ice, cheapest and non-alcoholic ingredients first where the order does not matter, so a mistake wastes less (professional judgment).
4. Ice: stirred first, then shaken, then built drinks.
5. Double up shakes and stirs.
6. Strain, top bubbles, garnish.
7. Check against the ticket; serve all together; reset what you used.

## Hands-on

### What you need

- The worksheet [labs/module-08/ticket-sequencing.md](../../labs/module-08/ticket-sequencing.md).
- A device with a browser for the simulation.
- For the home round: four glasses or cups, a shaker (or two jars), a jigger, cold water, lemon or lime juice, 1:1 syrup, ice, a strainer, a phone stopwatch, your [practice log](../../templates/practice-log.md) and the [service debrief](../../templates/service-debrief.md).
- Low-cost alternative: jars with lids as tins; a tea strainer.

### Time

70 minutes: 15 for the worksheet, 10 for the tutorial shift, 20 for the practice shift and debrief, 20 for the home round, 5 to log.

### Steps

1. **Worksheet.** Solve the five sequencing problems with the simulation's time table. Check them against the solution.
2. **Tutorial shift.** Learn the controls.

[Simulation: Service shift — tutorial](../../simulations/service-sim/index.html?preset=tutorial)

The `tutorial` shift has 5 tickets of 1–2 drinks from six drinks: Daiquiri, Margarita, Negroni, Moscow Mule, Cuba Libre and Aperol Spritz. The next ticket arrives only when you serve the last one, and hints show the next step in the order glass → ice → ingredients → method → garnish → serve. **Targets:** 100% accuracy, average ticket time 90 seconds or less, 0% waste.

3. **Practice shift.** Now tickets overlap.

[Simulation: Service shift — practice](../../simulations/service-sim/index.html?preset=practice)

The `practice` shift has 12 tickets of 1–3 drinks from the twelve Module 5 drinks, arriving one every 75 seconds whether you are ready or not. **Targets:** accuracy at least 90%, average ticket time 150 seconds or less, waste 5% or less. Use the rules of this lesson: oldest first with quick wins, passes, slowest ice step first, bubbles and garnish last. Fill in the service debrief.

4. **Home round, two ways.** Make four home-practice Daiquiris (60 ml cold water, 20 ml citrus, 15 ml syrup each), timed. First drink by drink: glass, pours, shake, strain, then the next. Then as a round: four glasses out, pour each ingredient across all four, shake two at a time (two jars if you have them), strain all, serve. In each run, put two of the tins on the scale before the ice goes in (target 95 g) to check the pours.
5. Log both times and the pour accuracy.

### What you should see

The worksheet answers are in the solution. In the tutorial most learners reach 100% on the second run; the usual slip is a wrong garnish or forgetting the ice in a built drink. In the practice shift, a first run often lands at 80–90% accuracy and 150–200 seconds, mostly lost to drinks that die while another drink is shaken, and to bottles picked up several times. A second run with passes and "ice last" usually meets the targets. At home, the round usually takes 30–40% less time than drink by drink, with pours as accurate as before (professional judgment); if the round is slower, you are probably searching for tools: fix the station layout from lesson 01.2.

<details>
<summary>Reference result</summary>

Practice shift, run 1: 83% accuracy (two dead drinks, one Moscow Mule without lime), 171 s average, 4% waste. Run 2: 92%, 138 s, 2%. Home round: drink by drink 3:05, round 2:02; pours 94–97 g against 95 g target.

</details>

### What this practice cannot teach

The simulation counts time but not your hands, the noise, guests shouting orders or a server leaning over the bar; the home round trains your hands but not the pressure. Real speed comes when both meet on real shifts.

### Completion checklist

- [ ] I solved the sequencing worksheet and checked it.
- [ ] I completed the tutorial shift at its targets.
- [ ] I ran the practice shift until I met its targets (≥ 90%, ≤ 150 s, ≤ 5%) and filled in a service debrief.
- [ ] I timed a home round drink by drink and in passes and logged both.

## Common mistakes

- **Strict printed order for everything.** Quick tickets wait behind long ones. Fix: use the quick-win exception, once per ticket.
- **One drink start to finish.** The first drink dies while you make the others. Fix: glasses out, pours in passes, ice last.
- **Ice into glasses first, then pours.** Built drinks melt while you shake. Fix: ice the glasses just before they are filled.
- **Topping bubbles early.** Flat highballs and spritzes. Fix: bubbles are the last pour before garnish.
- **Picking the same bottle up three times.** Fix: one bottle, all the drinks that need it, then put it back.

## Key takeaways

- Oldest ticket first; a quick ticket of about 30 seconds may go first, but never skip the same ticket twice.
- Ingredients wait, ice does not: pour first, add ice late, slowest ice step first, bubbles and garnish last.
- Build rounds in passes and shake or stir two at once: four Daiquiris in 77 instead of 119 seconds in the simulation.
- The service simulation counts fixed action times; a finished drink waiting more than 30 seconds is dead.
- Practice targets: at least 90% accuracy, 150 seconds or less average ticket time, 5% or less waste.

## Sources

- [IBA — Cocktails (official list)](https://iba-world.com/cocktails/) (specs used for the simulation's recipe cards, as in Modules 5 and 6; accessed 2026-10-17)
- [Wikipedia — Shortest job next](https://en.wikipedia.org/wiki/Shortest_job_next) (shortest job first minimises average waiting time; long jobs can starve if short ones keep arriving; accessed 2026-10-17)
