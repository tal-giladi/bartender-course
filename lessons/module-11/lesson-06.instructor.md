# Instructor notes — 11.6 Inventory and costing assignment

- **Objective:** apply Module 10 formulas to new data: four costings, formula prices, one drink's pour cost/GP/margin/markup, menu-wide and actual pour cost, five-bottle reconciliation with flags, order list, report. 40 points, minimum 70%.
- **Files:** `labs/module-11/costing-exam-brief.md` (data, answer sheet, marking tolerances), `costing-exam-inventory.csv`, `costing-exam-solution.md`; prices from `labs/module-10/price-list.csv` + ginger beer 330 ml at 5.90 incl. VAT, 5% waste (course assumption).
- **Calculator contract (`costing-calculator?preset=exam`):** loads exactly this data; learner enters A–E answers; marks with the brief's tolerances (A: ±0.05 → 2, ±0.50 → 1; B: prices exact, % ±0.2 points, GP ±0.05, markup ±1 point; C: money ±1.00, % ±0.2, avg GP ±0.05; D: two points per item; E exact); shows points /36 and correct values; "copy results" block. Default seed reproduces the solution (costs 17.04/8.50/11.99/6.76; formula prices 102/52/72/40; net sales 9,169.49; theoretical 2,233.80; menu 24.4%; avg GP 34.68; variance value 57.07; actual 25.0%; orders 2/1/2/5/3). Other seeds vary sales counts and stock counts only.
- **Likely confusion:** negative variance (Cointreau) treated as good news (quiz q3); Aperol flagged though explained by waste.
- **Misconception:** VAT handling (q2): the most common source of 15–18% errors.
- **Expected result:** most learners who completed 10.5 score 30–38 / 40 (professional judgment); lost points are usually rounding (formula price rounded down) and the flags.
- **Extension:** ask for a re-price of the whole menu at a 22% target and the resulting menu pour cost.
