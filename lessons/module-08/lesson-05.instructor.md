# Instructor notes — 08.5 Speed: sequencing orders and building rounds

- **Objective:** queue order (oldest first + one quick win per ticket), "ingredients wait, ice does not", passes and double-shaking, and the service simulation's time model.
- **This lesson is the simulation's contract.** The action-time table, the 30-second dead-drink rule, the correctness definition (glass, ice, ingredients ±5 ml, method, garnish, not dead), accuracy % and waste % formulas, the station (4 tins, 2 mixing glasses) and the `tutorial` and `practice` presets (5 tickets / 6 drinks / next on serve / 100%, ≤ 90 s, 0%; 12 tickets / Module 5 menu / every 75 s / ≥ 90%, ≤ 150 s, ≤ 5%) must match `simulations/service-sim`.
- **Likely confusion:** a "quick win" is not "smallest ticket always first". One skip per ticket, and only when the skipped ticket's drinks are not left waiting.
- **Misconception:** "speed is moving faster". The worksheet shows the same actions in a better order save 30–40%.
- **Expected hands-on result:** practice shift run 1 around 80–90% and 150–200 s; run 2 meets targets. Home round 30–40% faster than drink by drink.
- **Extension:** ask the learner to design the fastest order for a 4-drink ticket with one of each method (build, stir, shake, muddle) and prove it with the table.
- **Link forward:** 08.7 adds call-outs and barback requests; 08.8 runs the `rush` preset.
