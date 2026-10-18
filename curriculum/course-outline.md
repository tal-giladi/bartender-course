# Course outline — Bartending: From Zero to Your First Bar Job in Israel

Planning file, never imported. Binding rules, in order of precedence:
1. `C:\Users\TalGiladi\OneDrive\repos\tals-academy\docs\new-course-instructions.md` (the Academy import contract).
2. This outline.
3. `plan.md` (the original brief; its §0 lists how it maps to the Academy).

Titles and paths: `scripts/manifest.py` is the single source of truth (11 modules, 80 lessons). Never change them.

## 1. Who it is for and what it is

An adult (18+) with no bar experience who wants to be hireable as an entry-level bartender in Israel, studying alone at home over 8–10 weeks, about 6–8 hours a week (≈ 55–65 hours total including practice). It teaches international technique and the IBA classics, plus Israeli law, language and bar conventions.

It is not an accredited qualification and grants no licence or certificate (lesson 01.1 says this plainly; Module 11 repeats it). It cannot replace real shifts: lesson 01.1 lists what home practice cannot teach (real draught foam, a full rush with real guests, working a commercial glasswasher, reading a crowded room), and each practice section repeats the relevant limit in one sentence.

## 2. Principles

- **Learning by doing.** Every lesson ends in a hands-on part: a home drill with water/ice/kitchen equipment, a non-alcoholic mixing experiment, a simulation run with a target, a spreadsheet/calculator exercise, a filmed self-assessment, a label analysis, or a scripted role-play. Each module's last lesson is the module's larger practical piece that uses everything in the module.
- **Alcohol-light practice.** Default to water, ice, sugar syrup, citrus, tea, soda and non-alcoholic spirits. Where real sensory evaluation needs real alcohol (e.g. stirred spirit-forward drinks), say so, make it optional, keep tastings small (sip and spit, ≤ 1 standard drink per session suggested), and never before driving.
- **Current, verified sources.** IBA official specs (https://iba-world.com/cocktails/) are the default spec; when a widely used version differs (e.g. Difford's Guide, classic sources), show it as a variation with its source — never present a disputed spec as universal. Israeli law: official sources only (Nevo/knesset.gov.il/gov.il, Ministry of Health, Ministry of Economy, Israel Police), with statutory requirements kept separate from recommendations and a research date. Prices in ILS: mark as examples "checked YYYY-MM-DD at <source>". VAT: verify the current Israeli rate on gov.il before using it.
- **No invented market claims.** Statements about what is popular in Israel need a source (menus of named bars, industry reports, news with data); otherwise label them "professional judgment".
- **Practical over exhaustive.** Specs, movements, decisions and recoveries a working bartender uses; common mistakes and how to fix them mid-service.
- **Safety and responsibility first.** Glass, knives, ice scoops vs glass in the ice, raw egg, CO2, slippery floors, lifting, allergens, intoxication. No flaming drinks, no fire tricks, no dry ice or liquid nitrogen (warn against them in one line where relevant). No content that encourages heavy drinking.

## 3. Lesson anatomy (fixed — every lesson, this order, these exact `##` headings)

1. `## Why it matters` — a concrete moment behind a bar where this knowledge decides something.
2. `## Core ideas` — the concepts, with `###` sub-sections. Define every term on first use. Hebrew bar terms the first time they appear: English term (Hebrew script, transliteration). Tables for comparisons; mermaid or SVG (`assets/mNN-<name>.svg`) only when it genuinely helps. A `> [!NOTE]` says which details will go out of date (prices, products, laws) and as of when.
3. `## Step by step` — numbered procedures. In cocktail lessons this section holds one `###` recipe card per drink, in exactly the card format of §5.
4. `## Hands-on` — the practical part, with these `###` sub-headings in order: `### What you need` (with a low-cost alternative), `### Time`, `### Steps`, `### What you should see` (expected observations and how to interpret them), `### What this practice cannot teach`, `### Completion checklist` (a `- [ ]` task list the learner ticks themselves; never claims independent verification). Simulation links alone on their own line: `[Simulation: Service rush — Friday night](../../simulations/service-sim/index.html?preset=rush)`. Model answers / reference results in `<details>`.
5. `## Common mistakes` — 3–6 mistakes, how to spot and fix them.
6. `## Key takeaways` — 3–6 bullets.
7. `## Sources` — linked sources (also in the front-matter `sources`).

Right after the H1: one plain intro paragraph (no bold, list, heading or link-only line) — it becomes the summary.
Length 1,000–2,000 words (cocktail lessons may reach 2,500). `minutes` ≈ 10–20 reading; `practice_minutes` honest (20–90).
No knowledge-check or answer section in the markdown — questions live only in the `.quiz.yaml`.

## 4. Practice tools and rules

- **Home practice station** (lesson 01.2): a budget list in ILS (Boston shaker or jar, jigger or medicine cup/measuring spoons, bar spoon or long teaspoon, Hawthorne/fine strainer or tea strainer, peeler, paring knife, cutting board, citrus press, ice trays, a few glasses). Every lesson that needs equipment names a low-cost alternative.
- **Water drills**: measure water into a graduated cylinder / kitchen scale (1 ml water ≈ 1 g) to score accuracy; time movements with a phone stopwatch; film with a phone and compare to a demonstration (link reputable YouTube demonstrations alone on a line — verify the video exists and shows what you claim).
- **Practice log**: `templates/practice-log.md`; worksheets and printable cards in `labs/module-NN/` (markdown + small CSV for spreadsheet work).
- **Raw egg**: use pasteurised egg white or aquafaba; `> [!WARNING]` on salmonella. **Knives and glass**: `> [!CAUTION]` before the first knife/peeler/glass-breaking content.
- **Simulations** (built later by simulation agents; lessons link them with presets from §7).

## 5. Cocktail recipe card (exact format inside `## Step by step`)

```markdown
### Daiquiri

| Ingredient | ml | oz |
|---|---|---|
| White rum | 60 | 2 |
| Fresh lime juice | 20 | ¾ |
| Simple syrup (1:1) | 15 | ½ |

- **Method:** shake hard with ice, double strain.
- **Glass and ice:** chilled cocktail glass (coupe), no ice.
- **Garnish:** lime wheel (optional).
- **Profile and key technique:** …
- **Spec source and variations:** IBA spec (link). Common variations with their source: …
- **Substitutions:** …
- **Home-practice version:** … (water/tea/NA build that trains the same movements and volumes)
- **Alcohol-free analogue:** … (or "none that is faithful", with why)
- **Common mistakes:** …
```

The same data goes, in structured form, into `curriculum/recipe-inbox/module-NN.yaml` (schema below). The main session merges it into `curriculum/recipes.yaml`, then generates `references/recipe-library.md` and `simulations/common/recipes.js` with `scripts/build_recipes.py` (written in the foundations unit).

```yaml
- id: daiquiri            # kebab-case, stable
  name: Daiquiri
  family: sour            # sour | highball | old-fashioned | martini-manhattan | spritz-sparkling | collins-fizz | tiki-punch | savory | coffee | other
  method: shake           # build | stir | shake | blend | throw | swizzle
  glass: coupe
  ice: none               # none | cubes | crushed | large-cube | collins-cubes
  garnish: lime wheel (optional)
  ingredients:            # ml are numbers; dashes/barspoons as unit strings
    - {item: white rum, ml: 60}
    - {item: fresh lime juice, ml: 20}
    - {item: simple syrup 1:1, ml: 15}
  source: {title: "IBA — Daiquiri", url: https://iba-world.com/...}
  lesson: "05.4"
  na_analogue: …          # or null
```

## 6. Final assessment grading model (taught in 11.1, self-scored)

| Component | Weight | Where | Minimum |
|---|---|---|---|
| Written knowledge | 20% | Module 11 quiz (+ the learner's lesson-quiz average in Modules 1–10) | 70% |
| Recipe recall | 25% | 11.2 — `recipe-drill` `preset=exam` (20 random cards, ml exact ±5 ml, method, glass, garnish) | 80% |
| Practical technique | 25% | 11.3 — filmed checklist (measurement accuracy ±5%, stir/shake/strain/build/garnish, station reset), self-scored with a rubric; optional review by a working bartender | 75% |
| Simulated service | 20% | 11.4 — `service-sim` `preset=exam` (accuracy, ticket time, waste) | 70% |
| Costing and operations | 10% | 11.6 — costing + inventory assignment with `costing-calculator` `preset=exam` | 70% |

Pass = weighted total ≥ 80% **and** every component minimum met **and** no safety-critical failure. Safety-critical failures (any one = remediation and retest of that part, whatever the total): serving or recommending alcohol to a possible minor without ID check; continuing to serve a clearly intoxicated guest; ignoring a declared allergy or guessing ingredients; scooping ice with a glass or leaving broken glass in the ice; unsafe knife handling; raw egg without pasteurised/aquafaba alternative or warning. 11.5 (guest scenarios) is pass/fail on these safety items and feeds the written component. 11.7 is the final performance report (`templates/performance-report.md`): scores, strengths, areas to improve, remediation plan. Self-scoring is stated honestly as unverified.

## 7. Modules (focus, practical piece, simulations)

Simulation names are fixed (`simulations/<name>/`). Lesson writers link them with presets from this table; add a new short kebab-case preset only if needed and list it in the report.

| M | Title | Focus | Module practical piece | Simulations (presets) |
|---|---|---|---|---|
| 1 | Bar Foundations and Equipment | Bartender roles (barback, bartender, head bartender, bar manager), terminology, honest scope, the station (well, speed rail, back bar, ice well), tools, glassware, ice, hygiene and reset. Hebrew terms start here. | 01.7 timed station setup + reset drill, scored against a checklist (target times given). | — |
| 2 | Alcohol and Beverage Knowledge | Production and ABV; each major category (production, legal definitions, styles, flagship examples available in Israel, storage, substitutions); arak/ouzo/raki/pisco/cachaça/soju; liqueurs and bitters; vermouth, sherry, port, aperitivo bitters; quick tour of beer/cider/wine/NA (depth in M7); Israeli labelling (Hebrew label terms, %vol, importer sticker). Aroma training with non-alcoholic samples (citrus peels, juniper, herbs, spices, coffee, vanilla). | 02.9 classify a 30-product back bar from label photos/descriptions + identification drill + aroma kit write-up (`labs/module-02/`). | — |
| 3 | Measurement, Dilution and Flavor Science | ml/oz/parts/dash/barspoon conversions, scaling and batch maths; jigger and free-pour accuracy; taste and balance; syrups (1:1, 2:1, Brix by weight), juice yield and freshness; dilution and temperature (shaken ≈ 20–30% dilution, stirred less — verify with sources and the learner's own measurement); carbonation. NA experiments with water, syrup and citrus changing one variable at a time. | 03.7 diagnose 6 deliberately unbalanced NA recipes and fix them, documented in `templates/dilution-worksheet.md`. | recipe-scaler (`convert`, `scale`, `batch`), dilution-lab (`shake`, `stir`, `build`, `temperature`) |
| 4 | Mixing Methods and Technical Skills | Method choice; build, stir, shake (incl. dry/reverse dry shake, egg white/aquafaba), strain (Hawthorne, julep, fine), muddle, layer (density), blend, swizzle, throw; garnish prep (twists, wheels, expressing oils); what needs real ingredients for sensory judgment. | 04.8 filmed technique drills: 10 reps per movement, accuracy and time logged, compared against demonstrations, self-scored with the 11.3 rubric. | dilution-lab (`shake`, `stir`, `throw`) |
| 5 | Classic Cocktails I | 05.1 spec reading, recipe-card memory techniques, spaced repetition; then the 12 required drinks two per lesson (Martini, Manhattan, Old Fashioned, Negroni, Daiquiri, Margarita, Whiskey Sour, Cosmopolitan, Mojito, Moscow Mule, Aperol Spritz, Espresso Martini) with full recipe cards (§5). | 05.8 recipe recall drill (all 12) + a home session making all 12 as home-practice/NA versions, logged. | recipe-drill (`m05`) |
| 6 | Classic Cocktails II and Menu Knowledge | Families as reusable patterns (sour ratio, highball, spirit-forward stirred, spritz/sparkling, collins/fizz, tiki, savory); White Lady, Sidecar, Pisco Sour, French 75, Tom Collins, Paloma, Bloody Mary, Mai Tai; 06.5 adds 6–10 more IBA classics and modern classics (e.g. Gimlet, Boulevardier, Caipirinha, Cuba Libre, Penicillin, Paper Plane, Gin Basil Smash, Hugo Spritz — verify each against IBA/Difford's); substitutions; naming differences worldwide; Israeli menus (arak serves, local spirits and brands) with verified sources vs judgment. | 06.8 build a 12-cocktail menu across families with costing placeholders (finished in M10). | recipe-drill (`m06`, `families`) |
| 7 | Beer, Wine, Sparkling Drinks and Beverage Service | Beer categories, temperatures, glassware, pouring and foam (water cannot reproduce foam — say so); wine basics, major grapes, Israeli regions/wineries (verified); opening still and sparkling safely; storage; NA beer/wine/zero-proof; recommending from taste preferences. | 07.6 recommendation role-play: 10 scripted guests, write recommendations, compare with model answers. | — |
| 8 | Bar Operations and Speed | Opening/closing checklists; mise en place, storage and shelf life (verify with food-safety sources); batching and pre-dilution; stock counts, par levels, FIFO, waste logs, ordering; sequencing orders (glass → ice → ingredients, longest-first, batch rounds); commercial equipment (glasswasher, ice machine, POS, draught system, CO2 cylinders) and safety; call-outs and teamwork. | 08.8 a full rush in the service simulation, with debrief template. | service-sim (`tutorial`, `practice`, `rush`, `stockout`), recipe-scaler (`batch`) |
| 9 | Customer Service, Responsible Service and Israeli Requirements | Greeting, ordering, recommending; complaints and unclear orders; allergens (Israeli labelling rules for allergens — verify); signs of intoxication and refusing safely; Israeli law: minimum age, ID checks, restrictions on sale (hours/places), business licensing, smoking law, Ministry of Health hygiene — statutory vs recommended, research date, official citations; food and workplace safety. | 09.7 the seven scenarios (possible minor, intoxicated guest, unclear/contradictory order, allergy, complaint, unusually strong drink request, alcohol-free request), each in the interactive scenarios sim plus a written response checked against a rubric. | guest-scenarios (`underage`, `intoxicated`, `unclear`, `allergy`, `complaint`, `strong`, `alcohol-free`) |
| 10 | Costing and Menu Design | Cost per serving, bottle yield, spillage/waste allowance; pour cost %, gross margin vs markup, VAT-inclusive menu prices in Israel; standard recipes and inventory reconciliation (variance); menu design and honest descriptions; responsible upselling. Explicit formulas with worked ILS examples. | 10.5 cost and price the 12-drink menu from 06.8 with the calculator; reconcile a week's inventory (`labs/module-10/` CSV). | costing-calculator (`single`, `menu`, `yield`, `variance`) |
| 11 | Final Assessment | The capstone per §6: rules and grading (11.1), recipe recall, practical technique, simulated service, guest scenarios, inventory and costing, final report. Module quiz = written knowledge exam (10 scenario questions spanning the course). | 11.7 final performance report. | recipe-drill (`exam`), service-sim (`exam`), guest-scenarios (`exam`), costing-calculator (`exam`) |

## 8. Simulations (built after the modules that link them)

All follow Academy §7 and `curriculum/SIM-BRIEF.md`. Calculation logic goes in `simulations/common/bar-math.js` (pure functions: unit conversion, scaling, dilution estimate, cost per serving, pour cost, margin, markup, yield, variance), tested with `node --test "scripts/tests/**/*.test.js"`.

| Name | What it does |
|---|---|
| recipe-scaler | Convert ml/oz/parts/dashes; scale a recipe to N drinks; batch with planned dilution; outputs a printable batch card. |
| dilution-lab | Educational model of dilution and temperature by method, ice type and time; the learner predicts, then compares with the model and with their own home measurement. |
| recipe-drill | Randomised recipe recall (ingredients and ml, method, glass, ice, garnish) from `recipes.js`; spaced-repetition practice; `exam` preset = 20 cards, score and report. |
| service-sim | Multi-order bar service: randomised tickets, recipe cards, ingredient stock and stock-outs, conflicting priorities, timer, accuracy, inventory consumption, error log and an end-of-shift debrief with metrics. Fully functional. |
| guest-scenarios | Branching guest conversations for the seven situations; scores safety-critical choices separately; `exam` preset randomises order. |
| costing-calculator | Ingredient package price + size, recipe quantities, unit conversion, cost per serving, total cost, selling price (VAT on/off), pour cost %, gross profit, yield/waste assumptions; menu table; CSV export via `data:` link. Shows every formula. |

## 9. Quizzes

Academy §5: lesson quiz 3–5, module quiz 8–10 scenario questions, 4 options, one correct, positions spread, plausible distractors of similar length, `>-` block scalars, an explanation that teaches. Recipe questions use real near-miss distractors (wrong ml, wrong method, the variation's spec). Calculation questions use distractors from typical mistakes (markup vs margin, VAT forgotten, oz/ml mix-up).

## 10. Shared files (main session only)

`_sidebar.md` (generated by `scripts/manifest.py`), `README.md`, `COURSE-MAP.md`, `glossary.md`, `references/` (incl. `recipe-library.md` generated by `scripts/build_recipes.py` and `hebrew-bar-terms.md`), `templates/`, `labs/common/`, `simulations/common/`, `simulations/README.md` (sim agents may add their rows), `curriculum/recipes.yaml`, `BUILD_PROGRESS.md`, `TODO_FOR_TAL.md`.

Templates (main session writes them in the foundations unit; lessons may link): `templates/practice-log.md`, `templates/tasting-notes.md`, `templates/dilution-worksheet.md`, `templates/station-checklist.md`, `templates/recipe-card.md`, `templates/inventory-count.md`, `templates/service-debrief.md`, `templates/technique-rubric.md`, `templates/performance-report.md`. Need another → `curriculum/template-inbox/<name>.md`.
Hebrew terms: agents add rows to `curriculum/glossary-inbox/module-NN.md` under a `## Hebrew` heading as `- English — עברית (transliteration) — meaning`; main session merges into `references/hebrew-bar-terms.md`.
