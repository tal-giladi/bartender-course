# Module 09 plan — Customer Service, Responsible Service and Israeli Requirements

Planning file, not imported. Written 2026-10-18. Legal research date for 09.5 and 09.6: 2026-10-18.

Module practical piece: 09.7 the seven guest scenarios (possible minor, intoxicated guest, unclear order, allergy, complaint, unusually strong drink request, alcohol-free request), each run in the `guest-scenarios` simulation and answered in writing, scored with the scenario rubric. Files: `labs/module-09/scenario-response-sheet.md`, `labs/module-09/scenario-rubric.md`, `labs/module-09/scenario-model-answers-solution.md`.
Simulations linked: guest-scenarios `complaint`, `unclear` (09.2), `allergy` (09.3), `intoxicated`, `strong` (09.4), `underage` (09.5), all seven incl. `alcohol-free` (09.7). `exam` is Module 11's.

## Legal map used across the module (checked 2026-10-18)

| Rule | Type | Source |
|---|---|---|
| No sale/serving of alcohol to a minor (under 18); 6 months' imprisonment | statutory | Penal Law 1977 s. 193A(a1), (b) (Nevo, updated to 2 July 2026) |
| Seller may ask for an ID document showing age | statutory (a power, not a duty) | Penal Law s. 193A(c) |
| If a minor was served, the seller is presumed to have known, unless they prove the minor showed an ID saying they are adult | statutory | Penal Law s. 193A(c1) (added 2010) |
| Sign about minors must be displayed; missing sign = breach of licence condition | statutory | Penal Law s. 193A(d)–(e) |
| No supply of alcohol to a drunk person, or encouraging them to drink, by owner or worker of an alcohol-selling business; 6 months | statutory | Penal Law s. 193(c) |
| Night ban 23:00–06:00 on sale/serving/supply; exempt: First Schedule businesses (restaurants, cafés, bars serving for drinking on premises, hotels, venues, event halls) for drinking on premises; wine in large stores 23:00–02:00 on Thursdays/pre-holiday with ≥ 300 ILS other goods | statutory | Licensing of Businesses Law 1968 s. 2(a1), First Schedule (Nevo, updated to 21 July 2026) |
| "Intoxicating drink" = 2% ABV or more | statutory | Licensing of Businesses Law s. 2(b) |
| Police officer (rav-pakad+) may close a business up to 15 days on suspicion of a s. 193A offence (after a written warning in the previous 2 years); 30 days on repeat | statutory | Licensing of Businesses Law s. 23(a1)–(a2) |
| Pub/bar = licence item 4.8; restaurant serving alcohol = item 4.2 | statutory (licensing order) | uniform specifications on gov.il |
| Item 4.8 police conditions: no under-18 employed selling alcohol; sign over entrances with set wording; "a person who wants to drink must show ID"; CCTV incl. over the bar; max-occupancy sign; plastic cups at outdoor/temporary events | licence condition | Israel Police uniform specification item 4.8 (gov.il PDF, undated copy) |
| Item 4.2 MoH chapter: chilled food ≤ 5 °C, frozen ≤ −18 °C, hot ≥ 65 °C; temperature records ≥ 3 months; no work with infectious disease or open wounds; hand washing; trained food workers | licence condition (MoH) | uniform specification 4.2א (gov.il PDF) |
| Smoking banned in bars, pubs, clubs, restaurants; separate fully enclosed ventilated smoking room ≤ 1/4 of public area allowed; outdoor smoking area rules; holder must post signs, no ashtrays, supervise, ask smokers to stop | statutory | Prevention of Smoking in Public Places Law 1983 s. 1, 2, 2A, 2B, Schedule item 11 (Nevo, updated to 8 Dec 2023) |
| Allergen labelling (EU 1169/2011 adopted under Food Law s. 3A): packaged food must highlight 14 allergens; requirement for non-prepacked food deferred to 1 Jan 2032 | statutory / official guidance | MoH allergen guide v2, 29 June 2025 |
| Employer must train workers about risks and keep a training log; from 16 Oct 2026 face-to-face in a language the worker understands (online only with safety officer approval) | statutory | Work Supervision (Information and Training) Regulations 1999, amendment 2026 (KT 12471, 14 July 2026) |
| Signs of intoxication, refusing, monitoring | official guidance (Australia) + professional judgment | Liquor & Gaming NSW pages |
| Alcohol poisoning, anaphylaxis first aid | official guidance (UK NHS) | NHS pages |
| Pregnancy: no alcohol | official guidance | Israel MoH (as in 07.5) |
| People planning to drive should avoid alcohol | official guidance | gov.il "alcohol definitions" page |

Not found / not claimed: a personal licence or certificate for bartenders in Israel; a national closing time for bars (hours come from licence conditions and municipal bylaws); a statutory list of acceptable ID documents; a statutory duty to give allergen information for unpackaged drinks before 2032.

## The guest-scenarios contract (canonical in 09.7; for the simulation agent)

Each preset is one branching conversation with 4 decision points; each point has 3 choices scored 2 (safe and professional), 1 (safe but weak) or 0 (poor); some 0-choices are also flagged **safety-critical**. Score % = points ÷ 8 × 100. A scenario passes with ≥ 70% (6 of 8) **and** no safety-critical choice. After each scenario: the path taken, the model path, and why. `exam` (Module 11) = all seven in random order, safety-critical failures listed separately.

| Preset | Situation | Safety-critical choices |
|---|---|---|
| `underage` | Young-looking guest orders two beers; friend vouches; first "ID" is a photo on a phone | serving without seeing a physical ID that shows 18+; serving the friend's second beer to the young guest |
| `intoxicated` | Regular guest, slurring, swaying, asks for another round and shots for the table | serving any alcohol to him; letting him drive; leaving him alone if he becomes unwell |
| `unclear` | "A Martini, not too strong, sweet but dry, vodka or whatever" | none (scored on clarifying and check-back) |
| `allergy` | Guest with a tree-nut allergy orders a Mai Tai | guessing; serving orgeat; using an unwashed shaker after orgeat |
| `complaint` | Margarita sent back as "too sour" | none (scored on listen, apologise, solve, thank) |
| `strong` | Sober guest asks for "the strongest thing you have, triple everything" | pouring above house spec; encouraging fast or heavy drinking; serving if signs of intoxication appear |
| `alcohol-free` | Guest says she is pregnant and wants "something festive without alcohol" | serving a drink with alcohol (incl. bitters, a 0.5% beer) without telling her |

## Lessons

| Lesson | Objectives (short) | Prereqs | Hands-on | Sources to verify |
|---|---|---|---|---|
| 09.1 Greeting, orders, recommending | greet within seconds; take and check back an order with modifiers; ask two questions and offer two options; close the tab correctly | 07.6, 08.7 | greeting + order-taking drill, 10 recorded orders, scored | professional judgment; AHA check-back (08.7); 07.6 routine |
| 09.2 Complaints, substitutions, unclear orders | LAST model; remake vs replace; honest substitution; clarify contradictory orders | 09.1, 06.6 | 8 written cases + sim `complaint`, `unclear` | professional judgment |
| 09.3 Allergens | 14 allergens; Israeli labelling status; hidden bar allergens; cross-contact; never guess; anaphylaxis response | 09.1, 06.4, 06.6 | allergen matrix for 20 drinks + label check; sim `allergy` | EU 1169/2011 Annex II; MoH allergen guide 2025; NHS anaphylaxis |
| 09.4 Responsible service | signs of intoxication; pacing and water; refusal script; strong-drink requests; drivers; alcohol poisoning; Penal Law 193(c) | 09.1, 03.1 | observation cards + filmed refusal practice; sim `intoxicated`, `strong` | Penal Law s. 193 (Nevo); NSW L&G; NHS alcohol poisoning; gov.il alcohol definitions |
| 09.5 Israeli law | minors and ID; presumption; signs; 23:00 rule; licence items; police closure; smoking law; workers under 18; statutory vs licence vs guidance | 09.4 | 12-case legal worksheet + ID-check drill with fictional cards; sim `underage` | Nevo Penal Law, Licensing Law, Smoking Law; police spec 4.8; State Comptroller 2016; Knesset Sefer HaHukim 2238 |
| 09.6 Food and workplace safety | MoH licence conditions; cross-contamination; illness and wounds; training regs; incident reporting | 01.7, 08.6, 09.3 | home-station self-audit + incident report | uniform spec 4.2א; KT 12471 |
| 09.7 Seven scenarios | run all seven presets; written responses; rubric; reflection | 09.1–09.6, 07.5 | module practical | contract above |
