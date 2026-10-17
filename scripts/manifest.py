"""Canonical lesson manifest: module titles, stages and lesson titles.
Single source of truth for _sidebar.md, lesson ids and H1s. Run `py scripts/manifest.py` to regenerate _sidebar.md.
Paths are stable ids: never rename, reorder or remove a lesson once published; add new lessons at the end of a module."""
from pathlib import Path

STAGES = {
    1: "Stage 1 — Foundations",
    5: "Stage 2 — Cocktails and beverages",
    8: "Stage 3 — Working the bar",
    11: "Stage 4 — Final assessment",
}

MODULES = [
    ("Bar Foundations and Equipment", [
        "What a bartender does and how this course trains you",
        "The bar station and your home practice station",
        "Measuring, mixing and straining tools",
        "Prep and garnish tools: juicers, peelers and knives",
        "Glassware and when to use each glass",
        "Ice: types, handling and why it matters",
        "Hygiene, setup and reset: the timed station drill"]),
    ("Alcohol and Beverage Knowledge", [
        "How alcohol is made: fermentation, distillation, maturation and ABV",
        "Vodka and gin",
        "Rum, tequila and mezcal",
        "Whisky and brandy",
        "Arak and other regional spirits",
        "Liqueurs and bitters",
        "Vermouth, fortified wines and aperitifs",
        "Beer, cider, wine and alcohol-free drinks at a glance",
        "Labels, storage and substitutions: classify a back bar"]),
    ("Measurement, Dilution and Flavor Science", [
        "Units, ratios and scaling a recipe",
        "Measuring and pouring accurately",
        "Taste and balance: sweet, sour, bitter, salt and aroma",
        "Syrups and juices: making, measuring and storing",
        "Dilution and temperature: what ice really does",
        "Carbonation and how to keep it",
        "Diagnose and fix unbalanced drinks"]),
    ("Mixing Methods and Technical Skills", [
        "Choosing the method: build, stir, shake or blend",
        "Building drinks and highballs",
        "Stirring",
        "Shaking, dry shakes and egg white",
        "Straining, muddling and layering",
        "Blending, swizzling and throwing",
        "Garnishes: preparation and presentation",
        "Technique drills: film, time and fix your movements"]),
    ("Classic Cocktails I", [
        "How to read, learn and remember a cocktail spec",
        "Martini and Manhattan",
        "Old Fashioned and Negroni",
        "Daiquiri and Margarita",
        "Whiskey Sour and Cosmopolitan",
        "Mojito and Moscow Mule",
        "Aperol Spritz and Espresso Martini",
        "Recipe recall and a twelve-drink practice session"]),
    ("Classic Cocktails II and Menu Knowledge", [
        "Cocktail families: the patterns behind the recipes",
        "White Lady, Sidecar and Pisco Sour",
        "French 75, Tom Collins and Paloma",
        "Bloody Mary and Mai Tai",
        "More classics and modern classics",
        "Substitutions, adaptations and naming around the world",
        "Israeli bar menus: what is verified and what is judgment",
        "Build a twelve-cocktail menu"]),
    ("Beer, Wine, Sparkling Drinks and Beverage Service", [
        "Beer styles, temperatures and glassware",
        "Pouring beer: draught, bottle and can",
        "Wine basics: major grapes, styles and Israeli wine",
        "Opening and serving wine and sparkling wine",
        "Alcohol-free beer, wine and drinks",
        "Recommend a drink: customer role-play"]),
    ("Bar Operations and Speed", [
        "Opening and closing the bar",
        "Mise en place: prep, storage and shelf life",
        "Batching and pre-dilution",
        "Stock counts, FIFO, waste and ordering",
        "Speed: sequencing orders and building rounds",
        "Commercial bar equipment and safety",
        "Communication and teamwork on shift",
        "The service simulation: a full rush"]),
    ("Customer Service, Responsible Service and Israeli Requirements", [
        "Greeting guests, taking orders and recommending",
        "Complaints, substitutions and unclear orders",
        "Allergens and ingredient questions",
        "Responsible service: intoxication and refusing service",
        "Israeli law: age verification, alcohol sale and licensing",
        "Food safety and workplace safety",
        "Guest scenarios: seven situations, practised"]),
    ("Costing and Menu Design", [
        "Cost per serving, bottle yield and waste",
        "Pour cost, margin, markup and menu prices",
        "Standard recipes and inventory reconciliation",
        "Menu design and writing descriptions",
        "Costing project: price your menu"]),
    ("Final Assessment", [
        "How the final assessment works and is graded",
        "Recipe recall exam",
        "Practical technique exam",
        "Simulated service exam",
        "Guest scenarios exam",
        "Inventory and costing assignment",
        "Your final performance report"]),
]


def lessons():
    """Yield (module_no, lesson_no, global_no, id, title, path)."""
    g = 0
    for m, (_, ls) in enumerate(MODULES, 1):
        for l, t in enumerate(ls, 1):
            g += 1
            yield m, l, g, f"{m:02d}.{l}", t, f"lessons/module-{m:02d}/lesson-{l:02d}.md"


def sidebar():
    out = ["- [Home](/)", "- [Course map](COURSE-MAP.md)", "- [Recipe library](references/recipe-library.md)",
           "- [Hebrew at the bar](references/hebrew-bar-terms.md)", "- [Glossary](glossary.md)",
           "- [Templates](templates/README.md)", "- [Simulations](simulations/README.md)",
           "- [References](references/README.md)", "- [Research log](references/research-log.md)", ""]
    all_ls = list(lessons())
    for m, (title, _) in enumerate(MODULES, 1):
        if m in STAGES:
            out += ["", f"- {STAGES[m]}"]
        out.append(f"- **Module {m} — {title}**")
        for mm, l, g, lid, t, p in all_ls:
            if mm == m:
                out.append(f"  - [{g:02d} · {t}]({p})")
        out.append(f"  - [Module {m} quiz](assessments/module-{m:02d}-quiz.md)")
    return "\n".join(out).replace("\n\n\n", "\n\n") + "\n"


if __name__ == "__main__":
    root = Path(__file__).resolve().parent.parent
    (root / "_sidebar.md").write_text(sidebar(), encoding="utf-8", newline="\n")
    print(f"{len(list(lessons()))} lessons, {len(MODULES)} modules")
