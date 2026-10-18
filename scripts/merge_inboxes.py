"""Regenerate glossary.md, references/hebrew-bar-terms.md and references/research-log.md from the module inboxes.
Usage: py scripts/merge_inboxes.py   (idempotent: rebuilds the three pages from curriculum/*-inbox/ every time)"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GLOSS = re.compile(r"^- \*\*(.+?)\*\* — (.+?)\s*\((lessons/module-\d\d/lesson-\d\d\.md)\)\s*$")
HEB = re.compile(r"^- (.+?) — (.+?)(?: — (.+?))?(?:\s*\((lessons/module-\d\d/lesson-\d\d\.md)\))?\s*$")


def lesson_id(path):
    m = re.search(r"module-(\d\d)/lesson-(\d\d)", path)
    return f"{m.group(1)}.{int(m.group(2))}"


def write(rel, text):
    (ROOT / rel).write_text(text, encoding="utf-8", newline="\n")


def main():
    gloss, heb, notes, rows, seen = {}, [], [], [], set()
    for f in sorted((ROOT / "curriculum/glossary-inbox").glob("module-*.md")):
        mod = f.stem.split("-")[1]
        in_heb = False
        for line in f.read_text(encoding="utf-8").splitlines():
            if line.startswith("## Hebrew"):
                in_heb = True; continue
            if in_heb:
                m = HEB.match(line)
                if m:
                    eng, he, meaning, path = m.groups()
                    key = (eng.strip().lower(), he.strip())
                    if key not in seen:
                        seen.add(key)
                        heb.append((eng.strip(), he.strip(), (meaning or "").strip(), path or f"lessons/module-{mod}/"))
                continue
            m = GLOSS.match(line)
            if m:
                term, d, path = m.groups()
                gloss.setdefault(term.strip().lower(), (term.strip(), d.strip(), path))
    out = ["# Glossary", "",
           "Bar terms used in this course, A–Z, with the lesson where each is introduced. Hebrew equivalents are on [Hebrew at the bar](references/hebrew-bar-terms.md).", ""]
    letter = None
    for k in sorted(gloss, key=lambda s: re.sub(r"[^a-z0-9]", "", s)):
        term, d, path = gloss[k]
        first = re.sub(r"[^A-Za-z0-9]", "", term)[:1].upper() or "#"
        if first.isdigit(): first = "0–9"
        if first != letter:
            letter = first; out += ["", f"## {letter}", ""]
        out.append(f"- **{term}** — {d} ([{lesson_id(path)}]({path}))")
    write("glossary.md", "\n".join(out).replace("\n\n\n", "\n\n") + "\n")

    out = ["# Hebrew at the bar", "",
           "Hebrew words you will hear behind an Israeli bar: English term, Hebrew script, transliteration and meaning. Usage reflects common Israeli bar and kitchen usage (professional judgment, checked October 2026), not official terminology, unless the lesson cites a source.", "",
           "| English | Hebrew (transliteration) | Meaning | Lesson |", "|---|---|---|---|"]
    for eng, he, meaning, path in heb:
        link = f"[{lesson_id(path)}](../{path})" if path.endswith(".md") else f"Module {int(path.split('-')[1][:2])}"
        out.append(f"| {eng} | {he} | {meaning} | {link} |".replace("\n", " "))
    write("references/hebrew-bar-terms.md", "\n".join(out) + "\n")

    out = ["# Research log", "",
           "Sources checked while writing the course: what each supports, when it was checked and in which lessons. Labels: statutory, official guidance, industry source, professional judgment.", "",
           "| Source | URL | Date accessed | Claim supported | Lesson(s) |", "|---|---|---|---|---|"]
    for f in sorted((ROOT / "curriculum/research-inbox").glob("module-*.md")):
        for line in f.read_text(encoding="utf-8").splitlines():
            if line.startswith("|") and not line.startswith(("| Source", "|---", "| ---")) and line not in rows:
                rows.append(line.replace("<", "&lt;").replace(">", "&gt;"))
    write("references/research-log.md", "\n".join(out + rows) + "\n")
    print(f"glossary {len(gloss)}, hebrew {len(heb)}, research rows {len(rows)}")


if __name__ == "__main__":
    main()
