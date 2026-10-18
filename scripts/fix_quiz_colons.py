"""Quote list items in .quiz.yaml files that YAML would parse as a mapping (unquoted 'Text: more text').
Usage: py scripts/fix_quiz_colons.py   (idempotent)"""
import json, re
from pathlib import Path
import yaml

ROOT = Path(__file__).resolve().parent.parent
ITEM = re.compile(r"^(\s*)- (?![>|\"'])(.+)$")

for p in sorted(list(ROOT.glob("lessons/*/*.quiz.yaml")) + list(ROOT.glob("assessments/*.quiz.yaml"))):
    lines = p.read_text(encoding="utf-8").split("\n")
    changed = 0
    for i, line in enumerate(lines):
        m = ITEM.match(line)
        if not m or m.group(2).startswith(("id:", "{", "[")):
            continue
        try:
            val = yaml.safe_load(m.group(2))
        except yaml.YAMLError:
            val = None
        if isinstance(val, dict) or val is None:
            lines[i] = f"{m.group(1)}- {json.dumps(m.group(2), ensure_ascii=False)}"
            changed += 1
    if changed:
        p.write_text("\n".join(lines), encoding="utf-8", newline="\n")
        print(p.relative_to(ROOT), changed)
