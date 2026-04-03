#!/bin/bash
set -e

cd "$(dirname "$0")"

echo "→ build.py çalıştırılıyor..."
python3 build.py

echo "→ Değişiklikler kontrol ediliyor..."
if git diff --quiet src/lib/report.json agent/data/outputs/ 2>/dev/null; then
  echo "✓ Değişiklik yok, deploy gerekmiyor."
  exit 0
fi

echo "→ Git commit & push..."
git add src/lib/report.json agent/data/outputs/
git commit -m "weekly update: $(date +%Y-%m-%d)"
git push

echo "✓ Deploy tetiklendi. Vercel otomatik build edecek."
