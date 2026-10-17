# Build progress (for resuming after a crash)

Goal: build the whole course described in `plan.md` and `curriculum/course-outline.md` (11 modules, 80 lessons, 6 simulations) so it imports into Tal's Academy with 0 problems.
Binding rules: `C:\Users\TalGiladi\OneDrive\repos\tals-academy\docs\new-course-instructions.md`.

Max 2 writing agents at a time. Each module agent follows `curriculum/AGENT-BRIEF.md`; simulation agents follow `curriculum/SIM-BRIEF.md`.

Resume: read this file + `curriculum/status/*.log`; respawn unfinished modules with "Write module NN per curriculum/AGENT-BRIEF.md" (the agent skips done lessons). Commit + push after every finished module (`sh scripts/commit_module.sh NN "Title" NEXT`).
Validate: `py scripts/check.py [NN]`, then `cd C:/Users/TalGiladi/OneDrive/repos/tals-academy && npm run check-course -- ../course-creator/bartender-course`.
Titles/paths: `scripts/manifest.py` (regenerates `_sidebar.md`).

## Preparation (done 2026-10-17)
- [x] plan.md points to the Academy instructions; §0 maps the brief to the Academy
- [x] scripts/manifest.py (80 lessons), scripts/check.py, scripts/commit_module.sh
- [x] curriculum/course-outline.md, AGENT-BRIEF.md, SIM-BRIEF.md, course-details.md
- [x] GitHub repo public: tal-giladi/bartender-course

## Foundations (main session, before the first module agent)
- [x] `_sidebar.md` (py scripts/manifest.py), README.md, COURSE-MAP.md
- [x] glossary.md stub, references/README.md, references/hebrew-bar-terms.md stub, references/recipe-library.md stub
- [x] templates/ (the nine in outline §10) + templates/README.md
- [x] simulations/README.md, simulations/common/ stubs (sim.css, sim.js, bar-math.js)
- [x] curriculum/recipes.yaml (empty list) + scripts/build_recipes.py
- [x] commit + push

## Modules
- [x] M01
- [x] M02
- [x] M03
- [x] M04
- [ ] M05
- [ ] M06
- [ ] M07
- [ ] M08
- [ ] M09
- [ ] M10
- [ ] M11

## Simulations (after the modules that link them)
- [ ] recipe-scaler (M3, M8)
- [ ] dilution-lab (M3, M4)
- [ ] recipe-drill (M5, M6, M11)
- [ ] service-sim (M8, M11)
- [ ] guest-scenarios (M9, M11)
- [ ] costing-calculator (M10, M11)
- [ ] `node --test scripts/tests/` passes

## After modules
- [ ] merge inboxes: glossary-inbox → glossary.md + hebrew-bar-terms.md; research-inbox → references/research-log.md; recipe-inbox → curriculum/recipes.yaml → `py scripts/build_recipes.py`; template-inbox → templates/
- [ ] projects/ briefs if any (capstone lives in Module 11)
- [ ] final QA: `py scripts/check.py` clean, `npm run check-course` 0 problems, external links checked, git clean, TODO_FOR_TAL.md ready

## Decisions
- Final assessment is Module 11 (plan §0); Module 10 = costing and menu design.
- Lesson sections: Why it matters · Core ideas · Step by step · Hands-on · Common mistakes · Key takeaways · Sources.
- Recipes: IBA spec is default; variations shown with sources; single data source `curriculum/recipes.yaml`.
- Dilution model in bar-math.js refit to Arnold anchors (shaken sour ~63%, stirred Manhattan ~50%, water ~20–25%); outline "20–30%" applies only to near-0% ABV mixes.

## Open questions
- none

## Now working
- agent: M05
- agent: M06
- M01 done; M03 spawned.
- M02 done; M04 spawned.
- M03 done; M05 spawned.
- M04 done; M06 spawned.
