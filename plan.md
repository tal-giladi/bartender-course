# Build a Complete Self-Study Bartending Course

> [!IMPORTANT]
> Every agent working on this course must first read the Academy's binding build rules: `C:\Users\TalGiladi\OneDrive\repos\tals-academy\docs\new-course-instructions.md`. When this plan disagrees with that file, that file wins. The resolved structure is in `curriculum/course-outline.md`; build state and resume steps are in `BUILD_PROGRESS.md`.

## 0. How this plan maps to the Academy (decisions, 2026-10-17)

This plan was written for a stand-alone course website. The course is instead imported into Tal's Academy, which already provides navigation, progress tracking, lesson completion, quiz scoring, retakes, search and the responsive learner UI. So:

- **No website, app, database or build step.** Sections 7, 8 and the app parts of 10–12 are replaced by plain markdown + YAML in the Academy repo layout. "Progress tracking", "search", "resume learning" and "quiz feedback/retakes" come from the Academy.
- **Every graded question is single-answer multiple choice** in `.quiz.yaml` (Academy §5). Multiple-answer, true/false, ordering, numeric entry, free text and recipe reconstruction from section 6 become: (a) MCQ with plausible distractors, (b) recall drills inside the `recipe-drill` simulation, or (c) practical/written tasks in lessons with model answers and self-evaluation rubrics in `<details>` (not graded).
- **Knowledge-check questions and answers (section 5 items 11–12) live only in the `.quiz.yaml`**, never in the lesson markdown.
- **Calculators and the service simulation are Academy simulations** (`simulations/<name>/`, plain HTML + vanilla JS, Academy §7). Calculation functions live in `simulations/common/bar-math.js` and are unit-tested with `node --test scripts/tests/`.
- **Searchable cocktail reference** = `references/recipe-library.md` (generated from `curriculum/recipes.yaml`), listed at the top of `_sidebar.md`; the Academy's search covers it.
- **Final assessment becomes its own Module 11** so the capstone parts are lessons and the written knowledge test is the module quiz. Module 10 keeps costing and menu design. The grading model (20/25/25/20/10, 80% overall, minimums, safety-critical rule) is defined in `curriculum/course-outline.md` §6 and taught in lesson 11.1; it is self-scored with a rubric, while the Academy's own quiz pass mark stays 70%.
- **Language:** English. Hebrew bar terms are taught as Hebrew script + transliteration + meaning, inside English text.
- **Audience is 18+.** Practice is done mostly with water, ice and non-alcoholic ingredients; tasting real alcohol is optional, in small amounts, never before driving.

## Role

Act as an instructional designer, professional bartender, curriculum developer, and senior software engineer. Build a complete, high-quality online bartending course from end to end.

Your task is to create the actual educational product: complete lessons, exercises, recipes, practical experiments, simulations, assessments, answer keys, and learning materials. Do not stop at a syllabus, a proposal, placeholder lessons, or a landing page.

Work directly in the existing repository. Inspect its structure, conventions, and current implementation before making changes. Preserve existing functionality unless a change is necessary.

## 1. Course objective

Create a comprehensive self-study bartending course primarily designed for someone who wants to become employable as an entry-level bartender in Israel.

The course must also teach internationally recognized bartending techniques, classic cocktails, beverage knowledge, and professional standards.

The learner should be able to complete the course independently, without enrolling in a bartending school or working in a bar during the course.

Where a skill normally requires a commercial bar, substitute the in-person activity with one or more of:

- A practical experiment at home.

- A repeatable drill using inexpensive household equipment.

- A written or interactive simulation.

- A video-based observation exercise.

- A spreadsheet or calculator exercise.

- A role-play with scripted customer scenarios.

- A virtual service simulation involving multiple orders.

- An optional real-world validation exercise when simulation is insufficient.

Clearly explain what each substitute can and cannot teach.

The course is educational, not an officially accredited Israeli qualification. Never claim that completion grants a government license or recognized professional certification unless independently verified.

## 2. Course size and learning targets

Build a course with approximately 50–70 hours of learning and practice, suitable for completion over 8–10 weeks.

Use this as a planning target, not a reason to omit important material.

By the end, a successful learner should be able to:

1. Identify common bar tools, glassware, spirits, liqueurs, mixers, wines, and beer styles.

2. Measure ingredients accurately and scale recipes.

3. Explain the effects of dilution, temperature, ice, sweetness, acidity, bitterness, and carbonation.

4. Prepare common classic cocktails using documented specifications.

5. Apply appropriate mixing, shaking, stirring, straining, building, and garnish techniques.

6. Recommend beverages based on customer preferences.

7. Handle orders, substitutions, complaints, and simulated busy-service situations.

8. Prepare and maintain a workstation, manage stock, minimize waste, and follow cleaning procedures.

9. Calculate ingredient costs, pour cost, yields, and basic menu prices.

10. Understand responsible alcohol service, age verification, and relevant Israeli legal requirements.

11. Demonstrate their knowledge through a structured final assessment.

Prioritize practical competence over memorization alone.

## 3. Curriculum

Create complete content for all ten modules below.

### Module 1: Bar foundations and equipment — 4 hours

Teach:

- Bartender responsibilities and terminology.

- Bar stations and workstation organization.

- Jiggers, shakers, strainers, bar spoons, muddlers, juicers, peelers, knives, and other tools.

- Glassware types and appropriate uses.

- Ice types and their practical implications.

- Hygiene, preparation, and workstation reset procedures.

Practical work:

- Assemble a low-cost home workstation.

- Identify equipment from images or descriptions.

- Practice accurate water measurements.

- Complete a timed station-setup exercise.

### Module 2: Alcohol and beverage knowledge — 6 hours

Teach:

- Vodka, gin, rum, tequila, mezcal, whisky, brandy, and other major spirits.

- Liqueurs, bitters, vermouth, fortified wine, and aperitifs.

- Beer styles, cider, wine, sparkling wine, and non-alcoholic alternatives.

- ABV, fermentation, distillation, maturation, ingredients, labeling, and storage.

- Product substitutions and differences between categories.

- Israeli and international beverage terminology.

Practical work:

- Analyze product labels.

- Classify beverage products.

- Compare aromas using herbs, spices, citrus peels, and other non-alcoholic samples.

- Complete a beverage identification quiz.

### Module 3: Measurement, dilution, and flavor science — 6 hours

Teach:

- Metric measurements, milliliters, fluid ounces, ratios, and recipe scaling.

- Accurate measurement and pouring.

- Sweetness, acidity, bitterness, aroma, texture, salinity, and balance.

- Dilution, temperature, ice melt, and carbonation.

- How ingredient changes affect the final drink.

Practical work:

- Make controlled non-alcoholic mixtures using water, sugar syrup, and citrus juice.

- Change one variable at a time and document the result.

- Measure ingredient quantities and dilution.

- Diagnose deliberately unbalanced recipes.

Include a recipe scaling calculator and a dilution experiment worksheet.

### Module 4: Mixing methods and technical skills — 6 hours

Teach:

- Building, shaking, stirring, straining, muddling, layering, and blending.

- Choosing the appropriate method for each drink.

- Ice selection, chilling, aeration, dilution, and texture.

- Garnish preparation and presentation.

- Technique errors and troubleshooting.

Practical work:

- Use water and ice to practice repeatable movements.

- Time repetitions and record measurement accuracy.

- Practice pouring, straining, and workstation cleanup.

- Compare technique demonstrations with the learner's own recorded attempts.

Explain which skills require actual ingredients for reliable sensory evaluation.

### Module 5: Classic cocktails I — 8 hours

Teach the following drinks:

- Martini

- Old Fashioned

- Negroni

- Manhattan

- Daiquiri

- Margarita

- Mojito

- Whiskey Sour

- Moscow Mule

- Cosmopolitan

- Aperol Spritz

- Espresso Martini

For every cocktail, provide:

- Standardized ingredient quantities in milliliters.

- Alternative units when useful.

- Ingredients and substitutions.

- Preparation method, step by step.

- Appropriate glassware, ice, and garnish.

- Flavor profile and key technique.

- Common mistakes and troubleshooting.

- A home-practice version.

- A non-alcoholic analogue where feasible.

- A recall exercise and knowledge questions.

- Recipe provenance or a reliable reference.

Document meaningful variations rather than presenting disputed specifications as universal facts.

### Module 6: Classic cocktails II and menu knowledge — 6 hours

Teach:

- White Lady

- Sidecar

- French 75

- Tom Collins

- Paloma

- Bloody Mary

- Mai Tai

- Pisco Sour

- Additional internationally relevant classics and contemporary cocktails.

Organize drinks by cocktail family and technique so that learners understand reusable patterns instead of memorizing isolated recipes.

Include:

- Sour, highball, stirred spirit-forward, sparkling, and other relevant families.

- Recipe substitution and adaptation.

- Israeli bar-menu conventions and customer preferences, based on reliable evidence.

- International differences in naming and recipe specifications.

- A menu-building exercise involving at least 12 cocktails.

Do not invent claims about the popularity of a drink in Israel. Distinguish verified market information from professional judgment.

### Module 7: Beer, wine, sparkling drinks, and beverage service — 4 hours

Teach:

- Beer categories, serving temperatures, pouring, foam, and glassware.

- Wine basics and major grape varieties.

- Sparkling wine and carbonation.

- Storage, opening, serving, and presentation.

- Non-alcoholic beer, wine alternatives, and other alcohol-free drinks.

- Beverage recommendations based on taste preferences.

Practical work:

- Practice pouring water into different glasses.

- Analyze product labels and serving recommendations.

- Complete simulated customer recommendation exercises.

Explain that water cannot reproduce real beer foam behavior or carbonation.

### Module 8: Bar operations and speed — 6 hours

Teach:

- Mise en place, opening and closing procedures.

- Garnish preparation, ingredient storage, and shelf life.

- Batching, preparation planning, and service efficiency.

- Stock counts, inventory, FIFO, waste, and replenishment.

- Order prioritization and handling multiple drinks.

- Commercial bar equipment and safety.

- Communication and teamwork during service.

Build a multi-order service simulation with:

- Randomized incoming orders.

- Recipe cards.

- Ingredient availability.

- Conflicting preparation priorities.

- Timing and accuracy metrics.

- Inventory consumption.

- Error tracking and a debrief.

The simulation must be functional, not a static mockup.

### Module 9: Customer service, responsible service, and Israeli requirements — 4 hours

Teach:

- Greeting customers and taking accurate orders.

- Clarifying preferences and recommending drinks.

- Handling complaints and substitutions.

- Allergy and ingredient questions.

- Responsible alcohol service and recognizing possible intoxication.

- Refusing service safely and professionally.

- Hygiene, contamination prevention, and workplace safety.

- Age verification and relevant Israeli alcohol-sale requirements.

Research applicable Israeli legislation and authoritative government guidance. Cite official sources, distinguish statutory requirements from recommendations, and record the research date. Do not invent legal obligations or rely solely on outdated articles.

Include scenario-based exercises for:

- A customer who may be underage.

- A customer displaying signs of intoxication.

- An unclear or contradictory order.

- A reported allergy.

- A complaint about a drink.

- A request for an unusually strong drink.

- A customer requesting an alcohol-free alternative.

Teach safe, professional responses rather than encouraging alcohol consumption.

### Module 10: Costing, menu design, and final assessment — 6–10 hours

Teach:

- Ingredient cost per serving.

- Bottle yield and waste.

- Pour cost percentage.

- Gross margin versus markup.

- Menu pricing and recipe standardization.

- Inventory reconciliation.

- Menu design and clear descriptions.

- Responsible recommendations and customer communication.

Build a functional costing calculator that supports:

- Ingredient package prices and quantities.

- Recipe quantities per drink.

- Unit conversion.

- Ingredient cost per serving.

- Total recipe cost.

- Selling price.

- Pour cost percentage.

- Gross profit per serving.

- Yield and waste assumptions.

Use explicit formulas and explain them to beginners.

The capstone must include:

- A written knowledge test.

- Randomized cocktail recipe recall.

- A practical technique checklist.

- A simulated service involving multiple orders.

- Customer-service scenarios.

- An inventory and costing assignment.

- A final performance report with strengths and areas for improvement.

Use a proposed grading model:

- Written knowledge: 20%.

- Recipe recall: 25%.

- Practical technique: 25%.

- Simulated service: 20%.

- Costing and operations: 10%.

Set an overall passing threshold of 80%, with separate minimum thresholds for safety and practical competence. Define the thresholds explicitly. Safety-critical failures must require remediation and retesting regardless of the total score.

## 4. Research and source quality

Research the course using reliable and current sources.

Prioritize:

1. Official Israeli government and legal sources for local law.

2. The International Bartenders Association for its published cocktail specifications and professional references.

3. Reputable educational references for spirits, wine, beer, and food safety.

4. Professional demonstrations for techniques.

5. Credible industry sources for operational practices and Israeli market context.

Use these as starting points:

- IBA cocktails: https://iba-world.com/cocktails/

- IBA Academy: https://iba-world.com/iba/academy/

Verify that each external URL works and that the cited material actually supports the associated claim. Do not fabricate references, quotations, statistics, qualifications, or course accreditation.

For recipes, record the source and identify meaningful differences between recognized versions.

For time-sensitive law or market claims, record the date checked and provide a source link.

Keep external source content separate from your own instructional explanations. Do not copy entire articles or reproduce copyrighted course material.

## 5. Lesson authoring standard

Every lesson must contain actual educational content and follow a consistent structure:

1. Title and estimated duration.

2. Prerequisites, if any.

3. Learning objectives.

4. Explanation of the concepts in clear language.

5. Detailed procedures, examples, and tables where useful.

6. Visuals or diagrams when they genuinely help.

7. A home experiment or simulation.

8. Equipment and ingredient requirements, including a low-cost alternative.

9. Expected observations and interpretation.

10. Common mistakes and troubleshooting.

11. Knowledge-check questions.

12. Answers and explanations.

13. A practical completion checklist.

14. References and further learning.

Adjust the structure when a particular lesson does not need every item, but never substitute empty headings or generic filler for real content.

Explain technical terms when first introduced. Assume the learner has no prior bartending experience.

Use metric units as the default, with imperial conversions when useful. Write the course in clear English, while teaching relevant Hebrew terms used in Israeli bars. Do not translate standard international cocktail names unnecessarily.

## 6. Practice and assessment engine

Implement a reusable question and exercise system.

Support:

- Multiple-choice questions.

- Multiple-answer questions where appropriate.

- True/false questions.

- Recipe reconstruction.

- Ordering procedural steps.

- Numerical calculations.

- Scenario-based decisions.

- Free-text responses with model answers and self-evaluation rubrics.

- Practical tasks that the learner completes offline and marks as complete.

Requirements:

- Store correct answers and explanations.

- Randomize questions where appropriate.

- Give feedback after submission.

- Allow retakes.

- Track attempts and scores.

- Provide module completion criteria.

- Avoid claiming that self-reported physical practice has been independently verified.

- Do not expose answer keys before submission when the exercise is intended to assess recall.

Create enough original questions to provide meaningful assessment throughout the course. Aim for at least 8–12 questions per module, plus the final examination.

Do not pad the question bank with trivial rewordings of the same question.

## 7. Course website and learning experience

First inspect the repository and use its existing stack, architecture, and conventions. Do not replace the technology stack unnecessarily.

If the repository is only a course-content repository without an existing application, create a clean, maintainable course website using the stack already specified by the project or its existing documentation.

The learner experience must include:

- Course overview and syllabus.

- Module and lesson navigation.

- Readable lesson pages.

- Progress tracking.

- Lesson completion.

- Quizzes and explanations.

- Practical experiment checklists.

- Search across lessons and recipes.

- A searchable cocktail reference.

- Recipe scaling and costing calculators.

- A multi-order service simulation.

- Final assessment and results.

- References and source links.

- Responsive desktop and mobile layouts.

- Accessible controls and readable typography.

Make it possible to resume learning without losing progress, using the project's existing persistence mechanism. If none exists, implement a simple local persistence solution appropriate to the architecture and document its limitations.

Do not add authentication, payments, a database server, or external services unless the repository or project requirements call for them.

Do not build decorative controls that do nothing. All visible interactions must work.

## 8. Content and application architecture

Separate course content from application components.

Use a consistent, maintainable schema for:

- Modules.

- Lessons.

- Recipes.

- Questions and answer explanations.

- Practical experiments.

- Simulations.

- References.

- Completion criteria.

Use stable IDs and explicit relationships between lessons, recipes, exercises, and assessments.

Keep calculations in testable functions. Keep educational content in reusable structured files or the repository's established content system.

Provide:

- A complete course index.

- A recipe index.

- A reference list.

- A clear content-authoring convention.

- A validation script that detects missing lesson sections, broken internal references, missing answer explanations, and invalid recipe quantities.

If a content-management system is not already present, do not introduce one merely for convenience.

## 9. Visual and instructional design

Use a professional, contemporary bar-training aesthetic. Prioritize clarity and usability over decorative effects.

Use:

- Consistent headings and lesson structure.

- Tables for recipes and comparisons.

- Numbered procedures for techniques.

- Diagrams for equipment, workflow, and drink families.

- Images where they explain real techniques or ingredients.

- Clear visual distinctions between theory, practice, assessment, and reference material.

Use genuine, relevant assets and correctly attributed sources. Do not fabricate screenshots of real bars, claim a generated image documents an actual technique, or use decorative imagery as a substitute for detailed instructions.

## 10. Testing and quality assurance

Implement and run appropriate checks for the existing stack.

At minimum:

- Build or compile the application.

- Run linting and type checking where configured.

- Run automated tests.

- Test progress persistence.

- Test quiz scoring and answer feedback.

- Test recipe scaling and costing calculations.

- Test the service simulation and its scoring.

- Validate content structure and internal references.

- Check responsive behavior and basic accessibility.

- Check that navigation and all visible controls function.

- Check external links where feasible.

Fix the problems discovered rather than merely listing them.

Do not claim a test passed unless you actually ran it. Report tests that could not be run and why.

## 11. Execution strategy

Work autonomously and carry the project through to a usable result.

Follow this sequence:

1. Inspect the repository, existing files, tooling, and conventions.

2. Identify the current application architecture and determine the smallest suitable implementation plan.

3. Research and verify authoritative references, particularly Israeli legal requirements.

4. Define the content schema and course navigation.

5. Author all ten modules and their lessons.

6. Create the recipe library and practical exercises.

7. Implement the quiz and assessment system.

8. Implement the costing calculator and multi-order simulation.

9. Integrate progress tracking and the learner interface.

10. Add references, visual assets, and accessibility improvements.

11. Run tests, fix issues, and validate course completeness.

12. Update documentation with setup instructions, architecture, content-authoring instructions, and known limitations.

Do not stop after the plan or after implementing the website shell. Continue until the complete course is authored and integrated.

If the available context or execution budget is limited, divide the work into manageable stages and persist the plan and completed work in repository files. Continue from those files rather than restarting or replacing completed work.

Do not ask me to approve routine implementation choices. Make reasonable decisions consistent with the repository and document consequential assumptions.

## 12. Definition of done

The project is complete only when:

- All ten modules contain substantive, usable lessons.

- All required cocktail recipes are documented with quantities, methods, and references.

- Every module has practical home exercises and meaningful assessments.

- The course has a functional searchable recipe library.

- The calculators produce correct results and have tests.

- The multi-order service simulation is functional.

- Progress and assessment results persist as designed.

- The final exam and grading rules are implemented.

- Israeli legal content has authoritative citations and a research date.

- No major sections remain as placeholders, TODOs, or generic instructions to add content later.

- The application builds and the available automated tests pass, or remaining failures are explicitly documented.

- The README explains how to run, test, and maintain the finished project.

## Final report

When finished, provide:

1. What was built.

2. The course modules and major features implemented.

3. Important architectural decisions.

4. Commands to run and test the application.

5. Tests actually executed and their results.

6. Any remaining limitations or tasks that genuinely require human or in-person validation.

Begin by inspecting the repository, then implement the complete course end to end.

