# Instructor notes — 10.1 Cost per serving, bottle yield and waste

- **Objective:** ex-VAT unit costs, cost per serving with waste allowances, servings per bottle, produce yield → cost per ml. All numbers match `simulations/common/bar-math.js` (`priceExVat`, `costPerMl`, `yieldCostPerMl`, `costPerServing` dividing by 1 − waste, `usableMl`, `servingsPerBottle`).
- **Calculator contract:** preset `single` = the Daiquiri table (rum 750 ml 119.90 incl., 60 ml, 3%; lime 6.90 per 350 g, 300 ml/kg, 20 ml, 10%; 1:1 syrup 5.50 per kg sugar → 1,626 ml, 15 ml) → 9.66 ILS. Preset `yield` = bottles 700/750 ml, pours 30/45/60, waste 0–10%, plus produce price per kg and yield.
- **Likely confusion:** why ex VAT. Explain once with the VAT report: the bar pays the Tax Authority VAT on sales minus VAT on purchases, so purchase VAT is not a cost. Small exempt dealers are a different case, not taught here.
- **Misconception:** "take 18% off". Show 100 → 118 → × 0.82 = 96.76, not 100.
- **Expected hands-on result:** worksheet within ± 0.02 of the solution; lemon yield roughly 250–400 ml/kg.
- **Extension:** cost the Daiquiri with the IBA spec (2 bar spoons superfine sugar, about 10 g) and show the difference is under 0.05 ILS.
- **Prices:** Shufersal online regular prices checked 2026-10-18, retail incl. VAT; assumptions are marked in `price-list.csv`. Refresh before each cohort if used live.
