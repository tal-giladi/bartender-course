#!/bin/sh
# Usage: sh scripts/commit_module.sh NN "Module title" NEXT   (main session only)
set -e
N=$1; T=$2; NEXT=$3
cd "$(dirname "$0")/.."
py scripts/check.py "$((10#$N))" | tail -1
git add lessons/module-$N assessments/module-$N-quiz.* curriculum/module-$N-plan.md curriculum/status/module-$N.log
for p in labs/module-$N curriculum/glossary-inbox/module-$N.md curriculum/research-inbox/module-$N.md curriculum/recipe-inbox/module-$N.yaml curriculum/template-inbox; do [ -e "$p" ] && git add "$p"; done
ls assets/m$N-* >/dev/null 2>&1 && git add assets/m$N-*
sed -i "s/^- \[ \] M$N\$/- [x] M$N/" BUILD_PROGRESS.md
if [ -n "$NEXT" ]; then sed -i "s/^- agent: M$N\$/- agent: M$NEXT/" BUILD_PROGRESS.md; echo "- M$N done; M$NEXT spawned." >> BUILD_PROGRESS.md
else sed -i "/^- agent: M$N\$/d" BUILD_PROGRESS.md; echo "- M$N done." >> BUILD_PROGRESS.md; fi
git add BUILD_PROGRESS.md
git commit -qm "Module $((10#$N)): $T

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push -q
echo "pushed M$N"
