# Module 08 plan — Bar Operations and Speed

Planning file, not imported. Written 2026-10-17.

Module practical piece: 08.8 a full rush in the service simulation (`service-sim`, preset `rush`), after a `practice` warm-up, with the [service debrief](../templates/service-debrief.md) filled in and a second run that changes one thing. Files: `labs/module-08/rush-run-sheet.md`, `labs/module-08/rush-debrief-example-solution.md`.
Simulations linked: service-sim `tutorial` and `practice` (08.5), `stockout` (08.4, 08.8 optional), `rush` (08.8); recipe-scaler `batch` (08.3).
Numbers follow `simulations/common/bar-math.js`: `batch()` (water = undiluted batch × planned dilution), `usage()`, `variance()`, `variancePercent()`, `orderQuantity()` (ceil of par − on hand), dash 0.8 ml, bar spoon 5 ml.

## The service-sim contract (canonical in 08.5 and 08.8; repeated here for the simulation agent)

Shift clock in seconds; every action adds a fixed time (08.5 table): glass 2 s per glass; ice 3 s per glass; pour 4 s for the first pour from a bottle and 2 s for each next pour from the same bottle in a row; top (soda, tonic, ginger beer, cola, sparkling) 3 s; muddle 8 s; shake 12 s (one or two tins at once); stir 20 s (one or two mixing glasses at once); stir a built drink in its glass 5 s; strain 3 s per drink; garnish 4 s per drink; draught beer 8 s; glass of wine 6 s; rinse a tin or mixing glass before reuse 3 s; bin a drink 2 s; serve a ticket (all its drinks together) 3 s; ask the barback 3 s (bottle arrives 60 s later, fresh juice 120 s later); fetch from the storeroom yourself 45 s; squeeze a new bottle of juice yourself 90 s; tell the server a drink is 86'd and offer a substitute 3 s.
Rules: ticket time = arrival to serve. A finished drink (last step done) that waits more than 30 s before its ticket is served is "dead" (warm, watery or flat). A drink is correct when glass, ice, every ingredient (within ±5 ml of the card), method and garnish match the card and it is not dead. Accuracy % = correct drinks served ÷ drinks ordered × 100. Waste % = ml of product in binned, dead and remade drinks ÷ all ml poured × 100. Shift ends when the last ticket is served.

| Preset | Tickets | Drinks/ticket | Menu | Arrivals | Events | Targets (accuracy / avg ticket time / waste) |
|---|---|---|---|---|---|---|
| tutorial | 5 | 1–2 | Daiquiri, Margarita, Negroni, Moscow Mule, Cuba Libre, Aperol Spritz | next ticket when you serve the last; step hints on | — | 100% / ≤ 90 s / 0% |
| practice | 12 | 1–3 | the 12 Module 5 drinks | one every 75 s | — | ≥ 90% / ≤ 150 s / ≤ 5% |
| rush | 20 | 1–4, incl. rounds of 3–4 of one drink | 12 Module 5 drinks + Tom Collins, Paloma, Cuba Libre, French 75 + draught beer + house wine | waves: 6 tickets in min 0–3, 6 in min 3–10, 8 in min 10–18 | a server's table ticket and bar guests arrive together; one guest sends a drink back (remake) | ≥ 90% / ≤ 300 s / ≤ 5% |
| stockout | 15 | 1–3 | the 12 Module 5 drinks | one every 70 s | lime juice starts at 300 ml and runs out around ticket 6; open Aperol at 200 ml runs out around ticket 11 (backup in storeroom); end-of-shift count of 6 items with par levels, order = par − on hand rounded up to whole bottles | ≥ 90% / ≤ 180 s / ≤ 5%; no drink served with a missing or unapproved ingredient; order list 6/6 |

| Lesson | Objectives (short) | Prereqs | Hands-on | Sources to verify |
|---|---|---|---|---|
| 08.1 Opening and closing | run a bar opening and close in order; temperature checks (≤ 5 °C fridges); stock pull to par; handover | 01.7, 03.4 | write a bar-scale opening/closing checklist; timed home opening and close with temperature log | CDC cut fruit 2 h; FOODSAFE BC storage (0–4 °C, FIFO); FDA Food Code 2026 release |
| 08.2 Mise en place | build a prep list from a forecast; store and label; shelf-life table split into official vs judgment | 08.1, 03.4, 04.7 | prep list from `prep-forecast.csv`; prep a mini mise en place and check it after 2 h | CDC cut fruit; FDA date marking 7 days ≤ 5 °C (via state/FDA guidance); vermouth producers via Tasting Table / Spruce; FOODSAFE |
| 08.3 Batching and pre-dilution | choose no-water vs pre-diluted batch; calculate water and serving; storage temperature vs freezing point; label | 03.1, 03.5, 05.2 | batch worksheet; NA pre-mix vs pre-diluted batch at home; recipe-scaler batch | Arnold (03.1/03.5); Punch freezer batch (McPherson 20–25%, −12 to −10 °C); Engineering ToolBox freezing points |
| 08.4 Stock counts, FIFO, waste, ordering | count by tenths and by weight; usage/variance; par and order quantity; waste log | 08.2, 01.7 | inventory week CSV; weigh-count a bottle; stockout sim | Binwise par formula; FOODSAFE FIFO; Canada alcoholometric table (density ≈ 0.95) |
| 08.5 Speed: sequencing | order of work glass→ice→pours→method→garnish→serve; longest first, fizz last; passes; quick wins | 04.2, 05.8 | ticket-sequencing worksheet; tutorial and practice sim runs; timed home round | professional judgment; sim model |
| 08.6 Commercial equipment and safety | glasswasher, ice machine, soda gun, POS, draught and CO2; manual handling | 01.6, 01.7, 03.6 | equipment hazard walk worksheet; daily-check card | FDA Food Code 4-501.112 82 °C rinse (via state text); Manitowoc 6-month cleaning (Parts Town); Coca-Cola bar gun guide; BA Draught Beer Quality Manual 2019 (lines 14 days, CO2); WorkSafe Victoria; Ontario kegs |
| 08.7 Communication and teamwork | call-outs; check-back; 86; handover; barback requests | 01.1, 08.5 | call-out and check-back drill with partner or recording | AHA/AHRQ closed-loop communication |
| 08.8 Full rush | open, prep, run practice + rush, debrief, rerun | 08.1–08.7 | module practical | service-sim presets |
