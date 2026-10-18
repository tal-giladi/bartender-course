# Instructor notes — 10.3 Standard recipes and inventory reconciliation

- **Objective:** standard recipe with cost and allergens; POS counts → theoretical usage; variance in ml, %, unexplained and ILS; theoretical vs actual pour cost; ordered checks before suspecting theft.
- **Calculator contract:** preset `variance` loads the worksheet's five items (vodka 700, rum 750, tequila 700, Aperol 1,000, gin 700; counts, received, theoretical ml 4,300 / 4,500 / 2,250 / 4,200 / 1,770, waste 0/45/0/0/60, cost per ml 0.0846 / 0.1355 / 0.2420 / 0.0940 / 0.1282). Expected: variance 110 / 300 / 60 / −200 / 120 ml; total value 61.06 ILS. Formulas: `usage`, `variance`, `variancePercent` (÷ theoretical, i.e. "sold" in 08.4).
- **Builds on 08.4:** same formulas; new here are depletion from drink counts, ILS value, and pour-cost gap.
- **Likely confusion:** "sold per POS" in 08.4 = theoretical usage here. Say so explicitly.
- **Misconception:** "negative variance is good". It is an error signal.
- **Expected hands-on result:** rum, Aperol and gin flagged; free pours of beginners usually off by 10–20%, jigger within about 5% (professional judgment).
- **Template:** `labs/module-10/standard-recipe-template.md`; a copy is proposed for `templates/` via `curriculum/template-inbox/standard-recipe.md`.
- **Extension:** give the learner a POS report where the Mojito button is missing for two days and ask them to find it from the variance pattern.
