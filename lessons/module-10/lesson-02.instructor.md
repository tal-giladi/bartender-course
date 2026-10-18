# Instructor notes — 10.2 Pour cost, margin, markup and menu prices

- **Objective:** net price, pour cost %, gross profit, margin, markup, price from a target (÷ target × 1.18, round up), the three classic errors, and the Israeli total-price rule.
- **Calculator contract:** `pourCost(cost, net)`, `margin`, `markup`, `grossProfit`, `priceExVat`, `priceForPourCost(cost, target, 0.18, roundTo)` in `bar-math.js`; course examples round to 2 ILS. The `single` preset must let the learner toggle VAT, change the target and the rounding step.
- **Likely confusion:** margin vs markup. Use the table (20% pour cost = 80% margin = 400% markup = net × 5) and make learners say each aloud for one drink.
- **Misconception:** "lowest pour cost = best drink". Quiz q4 and Part A show gross profit in shekels.
- **Law:** sections 1, 17B, 17D, 17E of the Consumer Protection Law (Nevo, checked 2026-10-18). Service-charge statement follows directly from the statutory definition of total price; it is not legal advice. Eilat is mentioned only as "ask the accountant".
- **Expected hands-on result:** solutions in `labs/module-10/pricing-solution.md`; Paloma after the tequila rise 15.58 ILS, 27.8% at 66.
- **Extension:** ask the learner to find the price at which the Paloma's gross profit equals the Daiquiri's at 58 (39.49 + 15.58 = 55.07 net → 64.98 → 66 ILS).
