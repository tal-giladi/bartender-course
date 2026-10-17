# Inventory worksheet — solution (lesson 08.4)

Calculated with the course's `bar-math.js` functions (`usage`, `variance`, `variancePercent`, `orderQuantity`).

| Item | Used (bottles) | Used (ml) | Variance (ml) | Variance % | Unexplained (ml) | Unexplained % | Outside ±3%? | Order |
|---|---|---|---|---|---|---|---|---|
| Vodka | 4.6 | 3,220 | 70 | 2.2% | 25 | 0.8% | no | 5 |
| Gin | 4.1 | 2,870 | 70 | 2.5% | 70 | 2.5% | no | 5 |
| White rum | 3.7 | 2,590 | 210 | 8.8% | 150 | 6.3% | **yes** | 5 |
| Tequila | 2.7 | 1,890 | −10 | −0.5% | −10 | −0.5% | no | 3 |
| Aperol | 3.2 | 2,240 | 80 | 3.7% | 20 | 0.9% | no (explained by the log) | 3 |
| Campari | 0.8 | 560 | −40 | −6.7% | −40 | −6.7% | **yes** | 1 |
| Sweet vermouth | 1.2 | 900 | 60 | 7.1% | −15 | −1.8% | no (explained by the log) | 2 |
| Coffee liqueur | 1.0 | 700 | 40 | 6.1% | 40 | 6.1% | **yes** | 2 |

Order check (par − closing, rounded up): vodka 7 − 2.6 = 4.4 → 5; gin 6 − 1.9 = 4.1 → 5; rum 5 − 0.8 = 4.2 → 5; tequila 4 − 1.6 = 2.4 → 3; Aperol 4 − 1.4 = 2.6 → 3; Campari 2 − 1.3 = 0.7 → 1; vermouth 3 − 1.8 = 1.2 → 2; coffee liqueur 2 − 0.9 = 1.1 → 2.

## Items outside tolerance

| Item | Likely causes | Check first |
|---|---|---|
| White rum (+150 ml unexplained) | Over-pouring in Mojitos and Daiquiris (free-pouring in a rush); unlogged remakes; a rum drink missing from the POS buttons | Recount the open bottles; then check the POS for rum drinks sold under another button; watch pours with a jigger check |
| Campari (−40 ml) | Negronis rung in but made short (under-pouring); a Negroni rung in twice; last week's closing count too high | Recount and check last week's sheet; look for a duplicate ticket; check that the Negroni jigger is the 30 ml side |
| Coffee liqueur (+40 ml) | Espresso Martinis remade for foam and not logged; staff drinks; a spill | Ask the team about remakes this week; remind everyone to log; recount |

Aperol and vermouth were above 3% before the waste log and inside it afterwards: that is exactly what the log is for. Variance is a question to investigate, never proof of theft.
