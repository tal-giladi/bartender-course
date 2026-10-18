---
id: "11.4"
module: 11
minutes: 12
practice_minutes: 60
prerequisites: ["06.5", "08.5", "08.8", "11.1"]
objectives:
  - Plan and run the service simulation's exam shift in one attempt under exam conditions.
  - Calculate the service score from accuracy, average ticket time and waste, and reach at least 70.
  - Debrief the exam run with numbers and name the one change that would gain the most points on a retake.
volatility: concept
sources:
  - title: "IBA — Cocktails (official list)"
    url: https://iba-world.com/cocktails/
  - title: "Wikipedia — Shortest job next"
    url: https://en.wikipedia.org/wiki/Shortest_job_next
  - title: "American Hospital Association — Closed-loop communication (TeamSTEPPS)"
    url: https://www.aha.org/center/project-firstline/teamstepps-video-toolkit/closed-loop-communication
last_verified: "2026-10-18"
---

# 11.4 · Simulated service exam

This is the simulated service part of the final assessment, worth 20% of your grade. You run one exam shift in the service simulation: twenty tickets in three waves from a menu of twenty cocktails plus beer and wine, with rounds, a stock-out and a drink sent back. The simulation measures accuracy, average ticket time and waste, and your service score is your accuracy minus penalties for slow tickets and high waste. You need 70. It is the same model you used in lesson 08.8, with a bigger menu, no hints and no second chances inside the run.

## Why it matters

A trial shift is not a recipe test: it is twenty things arriving at once. The manager watches whether you keep drinks correct when the first wave hits, take the quick wins without letting a table's ticket starve, notice the lime is running out before it does, and remake a sent-back drink without losing the queue. The service exam measures those decisions with numbers, so your report can say "92% accuracy at 290 seconds a ticket" rather than "I think I am quick".

## Core ideas

### The exam shift

| Setting | Exam preset |
|---|---|
| Tickets | 20, with 1–4 drinks each, including rounds of 3–4 of one drink |
| Menu | the twelve Module 5 drinks, plus White Lady, Sidecar, Pisco Sour, French 75, Tom Collins, Paloma, Bloody Mary and Mai Tai, plus draught beer and house wine |
| Arrivals | three waves, as in the rush: 6 tickets in minutes 0–3, 6 in minutes 3–10, 8 in minutes 10–18 |
| Events | one stock-out around ticket 8 (lime juice, Aperol or ginger beer, chosen by the seed); one correct drink sent back by a guest |
| Help | no step hints; recipe cards are not shown during the shift |
| Attempts | the first complete run counts; a retake uses a new seed |

Everything else follows [lesson 08.5](../module-08/lesson-05.md) and [lesson 08.8](../module-08/lesson-08.md): a drink is correct when glass, ice, every ingredient (within ±5 ml), method and garnish match the card and it is not dead (left standing past the 30-second rule); a sent-back drink that was made to spec counts as waste when remade, not as an error.

### The three numbers

- **Accuracy (%)** = correct drinks served ÷ drinks ordered × 100.
- **Average ticket time (s)**, from a ticket's arrival to its serve.
- **Waste (%)** = ml in binned, dead and remade drinks ÷ all ml poured × 100.

The targets are the rush targets: accuracy at least 90%, average ticket time 300 seconds or less, waste 5% or less.

### The service score

Accuracy is the base, because a fast wrong drink is worth nothing. Slow tickets and waste cost points:

$$\text{time penalty} = \frac{\text{average ticket time} - 300}{15} \quad \text{(only above 300 s, at most 20)}$$

$$\text{waste penalty} = (\text{waste \%} - 5) \times 2 \quad \text{(only above 5\%, at most 20)}$$

$$\text{service score} = \text{accuracy} - \text{time penalty} - \text{waste penalty}$$

The score never drops below 0 and is rounded to a whole number. **Minimum: 70.**

Worked example: accuracy 88%, average ticket time 330 s, waste 7%. Time penalty = 30 ÷ 15 = 2. Waste penalty = 2 × 2 = 4. Service score = 88 − 2 − 4 = **82**: passed. Meeting all three targets gives a score equal to your accuracy, so a run at 92%, 287 s and 4% waste scores 92.

Notice what the formula rewards. Each second above 300 costs only one fifteenth of a point, but each incorrect drink in a shift of about 45 drinks costs about two points of accuracy. Sequencing that keeps drinks correct beats rushing.

> [!NOTE]
> The exam preset, the targets and the score formula are this course's educational model (checked 2026-10-18), built on the rules of lesson 08.5; they are not an industry standard. Specs follow the IBA as used in Modules 5 and 6 (checked 2026-10-17).

## Step by step

### Before the run

1. Review the cards of the Module 6 drinks on the exam menu, especially garnish and glass (the usual errors in 08.8).
2. Run one `practice` shift as a warm-up (not scored).
3. Fill in the plan on the [service exam sheet](../../labs/module-11/service-exam-sheet.md): weak drinks, your three sequencing rules, what you will do at the stock-out and at the sent-back drink.
4. Close the recipe library and your notes. Use a laptop or tablet if you can.

### During the run

1. Write the seed down when the shift opens.
2. Take tickets oldest first, with quick wins (beer, wine, highballs) taken once each.
3. Build rounds in passes; ice late; bubbles and garnish last.
4. At the first low-stock warning, ask the barback at once (3 seconds) rather than fetching yourself later (45 seconds).
5. When a drink is sent back, remake it immediately, then return to the queue.
6. Finish the shift, whatever happens. Do not restart.

### After the run

1. Copy the end screen's numbers into the exam sheet and calculate your score (the simulation shows it too; check that they match).
2. Fill in the [service debrief](../../templates/service-debrief.md): incorrect drinks and why, slowest tickets and why, waste, stock.
3. Name the one change that would gain the most points on a retake.

## Hands-on

### What you need

- A laptop or tablet with a browser (a phone works but is harder in a rush).
- The [service exam sheet](../../labs/module-11/service-exam-sheet.md), the [service debrief](../../templates/service-debrief.md) and your [exam score sheet](../../labs/module-11/exam-score-sheet.md).
- Low-cost alternative: any device with a browser; the sheets on paper.

### Time

60 minutes: 10 to plan, 10 for the warm-up, 20 for the exam shift, 20 to score and debrief.

### Steps

1. Plan on the exam sheet.
2. Warm up with one practice shift.

[Simulation: Service shift — practice](../../simulations/service-sim/index.html?preset=practice)

3. Take a short break, close your notes, then run the exam shift once, to the end.

[Simulation: Service shift — final exam](../../simulations/service-sim/index.html?preset=exam)

4. Record accuracy, average ticket time and waste; calculate both penalties and your service score.
5. Debrief with the service debrief template.
6. If your score is below 70: two `rush` runs from [lesson 08.8](../module-08/lesson-08.md), each aimed at your biggest cause, with a debrief each; then retake the exam with a new seed.

### What you should see

After the 08.8 rush runs, a first exam run often lands at 85–92% accuracy and 280–340 seconds per ticket, for a score in the high 70s to low 90s (professional judgment). The bigger menu makes recall errors on Module 6 drinks (a French 75 in the wrong glass, a Pisco Sour without bitters on the foam) more common than in the rush, and the stock-out costs time if you notice it late. A score below 70 nearly always comes from accuracy below 80%, not from the penalties.

<details>
<summary>Example result and debrief</summary>

Seed 4127. 20 / 20 tickets, 44 drinks ordered, 39 correct: accuracy 88.6%. Average ticket time 338 s: time penalty 2.5. Waste 6.5%: waste penalty 3. Service score 88.6 − 2.5 − 3 = 83.1, recorded as **83**: passed.

Incorrect drinks: two dead Mojitos in wave 1 (built before the shaken drinks on the same ticket), a White Lady with 20 ml triple sec instead of 30, a Mai Tai with the wrong garnish, a Paloma in a rocks glass. Slowest ticket: a round of four French 75s that waited behind a long ticket. Stock-out: lime juice, noticed one ticket late (fetched myself, 45 s). One change for a retake: shaken drinks first, built and topped drinks last, on every ticket of three or more.

</details>

### What this practice cannot teach

The simulation counts clicks, not hands; it cannot reproduce noise, a sticky floor or a guest leaning over the bar. It trains the decisions so that, on a real shift, your attention is free for the guests.

### Completion checklist

- [ ] I planned the run and warmed up with a practice shift.
- [ ] I ran the exam shift once, to the end, without notes or restarts.
- [ ] I calculated the penalties and my service score and recorded them.
- [ ] I debriefed the run with numbers and named one change.
- [ ] I scored at least 70, or I wrote a remediation plan and a retake date.

## Common mistakes

- **Restarting after a bad first wave.** Fix: finish; recovery is part of the exam, and the first complete run counts.
- **Chasing speed.** Fix: remember the formula: one wrong drink costs more than 30 slow seconds.
- **Reviewing recipes during the run.** Fix: review before, close everything during.
- **Noticing the stock-out late.** Fix: glance at levels after every ticket; ask the barback at the first warning.
- **Debriefing feelings.** Fix: numbers first, then causes, then one change.

## Key takeaways

- One exam shift: 20 tickets, three waves, a 20-cocktail menu plus beer and wine, a stock-out and a sent-back drink, no hints.
- Service score = accuracy − time penalty (above 300 s, ÷ 15) − waste penalty (above 5%, × 2); minimum 70.
- Service is 20% of the final grade.
- Correct drinks matter most; speed comes from sequence, not from rushing.

## Sources

- [IBA — Cocktails (official list)](https://iba-world.com/cocktails/) (specs behind the simulation's recipe cards, as in Modules 5 and 6; accessed 2026-10-18)
- [Wikipedia — Shortest job next](https://en.wikipedia.org/wiki/Shortest_job_next) (taking short jobs first lowers average waiting but can starve long jobs, the reason quick wins are taken once each; accessed 2026-10-18)
- [American Hospital Association — Closed-loop communication](https://www.aha.org/center/project-firstline/teamstepps-video-toolkit/closed-loop-communication) (check-back used for barback requests in the simulation; accessed 2026-10-18)
