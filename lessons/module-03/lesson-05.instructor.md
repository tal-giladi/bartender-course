# Instructor notes — 03.5 Dilution and temperature

- **Objective:** learner explains chill = melt, measures dilution % by weight, compares shake/stir/build, and computes ABV after dilution.
- **Likely confusion:** dilution % divided by the final weight instead of the starting weight. bar-math `dilutionPercent(before, after)` uses the starting weight.
- **Misconception:** "25% dilution for everything" and "freezer ice dilutes less". Arnold rejects a single figure (sour ≈ 63%, Manhattan ≈ 50% water added); colder ice changes little because melting dominates (80 vs 0.5 cal/g).
- **Expected hands-on result (non-alcoholic, room-temperature start):** shake 15 s ≈ 20–30%, near 0 °C; stir 45 s ≈ 10–20%, 2–6 °C; build 2 min ≈ 10–15%. Shake plateaus quickly. Learners should see NA mixes dilute less than cocktails would.
- **Model caveat:** the dilution-lab model (`dilutionFraction` in bar-math.js) is a regression on alcoholic drinks. At 0% ABV its stir plateau (6%) is below what learners will measure when starting at room temperature (chilling 110 g from 21 °C to 0 °C needs roughly 25 g of melt). Its shaken plateau for a ~25% ABV sour (~75%) is above Arnold's 2010 measured 63%. The lesson presents ranges and tells learners to trust their scale at 0% ABV.
- **Extension:** repeat shake 15 s with ice that has sat in a bowl for 10 minutes (wet) vs straight from the freezer (dry) and compare dilution.
