# Module 11 plan — Final Assessment

Planning file, not imported. Written 2026-10-18.

Module practical piece: 11.7 the final performance report (`templates/performance-report.md`), built from the five scored components of 11.2–11.6 plus the 11.5 safety check. The module quiz is the written knowledge exam (10 scenario questions spanning Modules 1–10).

Simulations linked: recipe-drill `exam` (11.2), service-sim `exam` (11.4), guest-scenarios `exam` (11.5), costing-calculator `exam` (11.6). Also `m05`/`families` (11.2 warm-up) and `practice` (11.4 warm-up), which already exist in earlier lessons.

## Grading model (course-outline §6, implemented in 11.1; matches `bar-math.js` `WEIGHTS`, `MINIMUMS`, `finalGrade`)

| Component | Weight | Score source | Minimum |
|---|---|---|---|
| Written knowledge | 20% | 0.50 × Module 11 quiz % + 0.25 × lesson-quiz average (Modules 1–10) % + 0.25 × guest-scenarios exam % (11.5) | 70% |
| Recipe recall | 25% | 11.2 recipe-drill exam: 20 cards × 4 points (ingredients and ml ±5 ml, method, glass and ice, garnish) | 80% |
| Practical technique | 25% | 11.3 technique rubric (out of 20, or 18 without free pour) from the exam evidence sheet | 75% |
| Simulated service | 20% | 11.4 service score = accuracy % − time penalty − waste penalty | 70% |
| Costing and operations | 10% | 11.6 assignment, 40 points (A 8, B 8, C 5, D 10, E 5, F 4) | 70% |

Pass = weighted total ≥ 80.0 (one decimal) **and** every minimum met **and** no safety-critical failure. Safety-critical list exactly as outline §6. A failure means remediation and a retest of that part, whatever the total.

Resolution of an outline ambiguity (decision): the outline says written = "Module 11 quiz (+ lesson-quiz average)" and that 11.5 "feeds the written component". Implemented as the 50/25/25 blend above. The Module 11 quiz itself is also an Academy quiz with the Academy's 70% pass mark.

Exam conditions (all parts): closed book except 11.6 (formulas and price list allowed); one sitting per part; no restarting a simulation run; the first complete run of an exam preset counts. Retakes: after at least one logged remediation session, with a new seed for simulations; the latest attempt under exam conditions counts; every attempt is recorded with its date in `labs/module-11/exam-score-sheet.md`.

## Simulation presets (contracts for the simulation agents)

- **recipe-drill `exam`**: 20 cards drawn without repetition from all drinks in `recipes.js` (the Module 5 and 6 cards plus the arak serves); per card the learner enters every ingredient and ml, method, glass and ice, garnish; 4 points per card as in 05.8 (ml within ±5 ml; dashes, sprigs, cubes as in the spec); no hints, no spec view until the end; score = points ÷ 80 × 100; pass 80%. End screen: per-card breakdown, the spec for every card, a "copy results" block (seed, date, points, %). `&seed=` fixes the draw.
- **service-sim `exam`**: 20 tickets, 1–4 drinks incl. rounds; menu = the 12 Module 5 drinks + White Lady, Sidecar, Pisco Sour, French 75, Tom Collins, Paloma, Bloody Mary, Mai Tai, draught beer, house wine; waves as `rush` (6 in min 0–3, 6 in min 3–10, 8 in min 10–18); one stock-out (seeded choice of lime juice, Aperol or ginger beer) around ticket 8; one correct drink sent back; hints off; same correctness, accuracy, waste and ticket-time rules as 08.5/08.8. Exam score = accuracy % − time penalty − waste penalty, minimum 0, rounded to a whole number; time penalty = (average ticket time − 300 s) ÷ 15 if above 300 s, capped at 20; waste penalty = (waste % − 5) × 2 if above 5%, capped at 20. Show the three metrics, both penalties, the score and a "copy results" block.
- **guest-scenarios `exam`**: as in the Module 9 plan: all seven presets in random order; each 4 decision points × 2 points; exam % = points ÷ 56 × 100; safety-critical choices listed separately; "copy results" block.
- **costing-calculator `exam`**: loads `labs/module-11/costing-exam-brief.md` data (Module 10 `price-list.csv` + ginger beer 330 ml can at 5.90 incl. VAT, 5% waste; four drinks; sales mix; five inventory items; par levels). The learner enters answers for parts A–E; the calculator marks them with the tolerances in the brief (costs ±0.05 ILS for 2 points, ±0.50 for 1; percentages ±0.2 points; prices and order quantities exact) and shows points out of 36 (part F, the report, is self-scored out of 4 and added by the learner). Default seed = the published data (matches `costing-exam-solution.md`); other seeds change sales counts and stock counts for retakes.

## Lessons

| Lesson | Objectives (short) | Prereqs | Hands-on | Sources |
|---|---|---|---|---|
| 11.1 How it works and is graded | compute the weighted total and decide pass; apply minimums and safety rule; plan the exam fortnight | 01.1, 10.5 | score three example candidates; fill the exam plan and score sheet | Davis et al. 2006 (self-assessment); Wikipedia Rubric; bar-math contract |
| 11.2 Recipe recall exam | sit the recall exam to ±5 ml; score; plan remediation | 05.8, 06.8 | warm-up then `exam`; paper back-up grid | IBA; Testing effect; Spaced repetition |
| 11.3 Practical technique exam | film the exam set; convert evidence to rubric; safety check; optional review | 04.8, 01.7 | filmed exam set (home versions) | HSE knives; FDA egg safety; Difford's guides |
| 11.4 Simulated service exam | plan; run `exam`; compute score; debrief | 08.8 | `practice` warm-up, `exam` run, debrief | IBA; Shortest job next; AHA closed loop |
| 11.5 Guest scenarios exam | run `exam`; write responses to three safety scenarios; pass/fail on safety items | 09.7 | sim + written responses with must-do checklist | Penal Law s.193/193A; NSW intoxication; NHS anaphylaxis; MoH pregnancy |
| 11.6 Inventory and costing assignment | cost and price four drinks; menu pour cost; reconcile five bottles in ILS; order list; report | 10.5 | assignment + calculator `exam` | gov.il VAT; Nevo consumer protection; BevSpot; Shufersal |
| 11.7 Final performance report | combine scores, decide result, strengths, remediation plan, honest CV line | 11.1–11.6 | fill the performance report | Davis et al. 2006; BLS bartenders |
