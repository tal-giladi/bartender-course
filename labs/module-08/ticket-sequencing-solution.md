# Ticket sequencing — solution (lesson 08.5)

All times use the service simulation's table from lesson 08.5.

## 1. Which ticket first?

a) 4 Moscow Mules in passes: glasses 8 + ice 12 + vodka 4+2+2+2 = 10 + lime 10 + top 4 × 3 = 12 + garnish 16 + serve 3 = **71 s**. One glass of wine: glass 2 + wine 6 + serve 3 = **11 s**.
b) A then B: 71 and 82 s → average 76.5 s. B then A: 11 and 82 s → average 46.5 s. **B first** (quick win): ticket A waits 11 s longer, the average falls by 30 s.

## 2. Order of work

1. Pour the Manhattan ingredients into the mixing glass (no ice yet).
2. Pour the Margarita ingredients into a tin.
3. Ice and stir the Manhattan (slowest ice step first), strain it.
4. Shake the Margarita, strain it.
5. Ice the spritz glass, pour Aperol and Prosecco, top with soda (bubbles last).
6. Garnish all three, serve together.

Time: glasses 6 + Manhattan pours 12 + Margarita pours 12 + stir 20 + shake 12 + strains 6 + ice 3 + spritz pours 8 + top 3 + garnish 8 + serve 3 = **93 s**. Building the spritz first would leave it on its ice, losing fizz, for over a minute.

## 3. Rounds

Drink by drink: 4 × (glass 2 + ice 3 + rum 4 + lime 4 + top 3 + garnish 4) + serve 3 = **83 s**. Passes: glasses 8 + ice 12 + rum 10 + lime 10 + top 12 + garnish 16 + serve 3 = **71 s**. Saved: **12 s**. Built rounds save less than shaken rounds (77 vs 119 s for four Daiquiris) because there is no shake to double up; the saving is all in picking each bottle up once.

## 4. Dead drink

The Mojito is finished, then the Daiquiri takes 2 + 12 + 12 + 3 = 29 s and serving 3 s more: the Mojito waits about 32 s and is **dead**. Better: pour the Daiquiri into its tin first; build the Mojito (lime, sugar, muddle, rum); shake and strain the Daiquiri; then ice and top the Mojito, garnish both and serve. Both finish within seconds of each other.

## 5. Three tickets

T2 is a quick win (2 beers: glasses 4 + beers 16 + serve 3 = 23 s) and has not been skipped before: make it first. Then T1, then T3.

| Ticket | Work | Served at |
|---|---|---|
| T2: 2 beers | 23 s | 23 s |
| T1: 2 Negronis | glasses 4 + ice 6 + gin 6 + Campari 6 + vermouth 6 + stir 10 + garnish 8 + serve 3 = 49 s | 72 s |
| T3: 3 Espresso Martinis | glasses 6 + four ingredients in passes 32 + two shakes 24 + strains 9 + garnish 12 + serve 3 = 86 s | 158 s |

Average 84.3 s. Strict arrival order (T1, T2, T3) gives 49, 72 and 158 s: average 93 s. In T3, strain the first two drinks, shake the third, then garnish all three so the first two do not wait more than 30 s after their last step.
