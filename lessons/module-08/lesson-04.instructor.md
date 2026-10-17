# Instructor notes — 08.4 Stock counts, FIFO, waste and ordering

- **Objective:** count by tenths and by weight; usage, variance, variance %, unexplained variance after the waste log; par (BinWise formula) and order = ceil(par − on hand); stock-outs handled in order: ask early, fetch, 86 and offer an alternative.
- **Likely confusion:** sign of variance. Positive = more used than sold (over-pour, spills, remakes, missing POS item); negative = less used than sold (under-pour, double ring, count error).
- **Misconception:** "variance means theft". Most variance is pouring, unlogged waste and count errors; the solution file says so explicitly.
- **Expected hands-on result:** items outside ±3% after the log: white rum (+6.3%), Campari (−6.7%), coffee liqueur (+6.1%); orders 5, 5, 5, 3, 3, 1, 2, 2. Weigh-count within about 5–10 ml of the jug.
- **Simulation:** `service-sim?preset=stockout` — 15 tickets every ~70 s, lime juice 300 ml at start (out around ticket 6), Aperol 200 ml (out around ticket 11, backup in storeroom), end count of 6 items. Targets: ≥ 90% accuracy, ≤ 180 s average ticket time, ≤ 5% waste, no unapproved substitutions, order list 6/6.
- **Extension:** give the learner next month's menu with a spritz special and ask them to recalculate the Aperol par.
- **Link forward:** Module 10 reconciles a week's inventory in money (cost of variance).
