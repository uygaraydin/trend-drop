#!/usr/bin/env python3
"""
TrendDrop site builder.
Reads weekly-report.md (and optional alert.md + intelligence.json)
from fashion-trend-agent outputs, writes report.json for Next.js.
"""

import json
import os
import re
import glob as globmod

AGENTS_OUTPUT = os.path.join(os.path.dirname(__file__), "..", "agents", "fashion-trend-agent", "data", "outputs")
SITE_DIR = os.path.dirname(__file__)


def find_file(pattern):
    """Find the most recent file matching pattern in outputs dir."""
    matches = sorted(globmod.glob(os.path.join(AGENTS_OUTPUT, pattern)))
    return matches[-1] if matches else None


def read_file(path):
    if path and os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    return None


def parse_meta(text):
    meta = {}
    m = re.search(r"\*\*Hazırlayan:\*\*\s*(.+)", text)
    if m: meta["author"] = m.group(1).strip()
    m = re.search(r"\*\*Dönem:\*\*\s*(.+)", text)
    if m: meta["period"] = m.group(1).strip()
    m = re.search(r"\*\*Taranan Kaynak:\*\*\s*(.+)", text)
    if m: meta["sources"] = m.group(1).strip()
    m = re.search(r"\*\*Durum:\*\*\s*(.+)", text)
    if m: meta["status"] = m.group(1).strip()
    return meta


def parse_highlights(text):
    highlights = []
    section = re.search(r"## Bu Haftanın Öne Çıkanları\s*\n([\s\S]*?)(?=\n---|\n## )", text)
    if section:
        for m in re.finditer(r"(?:\d+\.\s+|🔥\s+)\*\*(.+?)\*\*\s*—\s*(.+)", section.group(1)):
            highlights.append({"title": m.group(1), "desc": m.group(2)})
    return highlights


def parse_trend_table(text):
    trends_basic = []
    section = re.search(r"## Trend Tablosu[^\n]*\n([\s\S]*?)(?=\n---|\n## )", text)
    if section:
        for m in re.finditer(
            r"\|\s*(\d+)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*\*?\*?([0-9.]+)\*?\*?\s*\|\s*(.+?)\s*\|",
            section.group(1)
        ):
            source_field = m.group(6).strip()
            # source_count can be a number or a comma-separated list of names
            try:
                source_count = int(source_field)
            except ValueError:
                source_count = len([s.strip() for s in source_field.split(",") if s.strip()])
            trends_basic.append({
                "rank": int(m.group(1)),
                "name": m.group(2).strip(),
                "category": m.group(3).strip(),
                "lifecycle": m.group(4).strip(),
                "score": float(m.group(5)),
                "source_count": source_count,
            })
    return trends_basic


def parse_trend_details(text):
    details = {}
    blocks = re.findall(
        r"### (\d+)\.\s+(.+?)(?:\s*—\s*Skor:\s*|\s*\(Skor:\s*)([0-9.]+)\)?\s*\n([\s\S]*?)(?=\n### \d+\.|\n---|\Z)",
        text
    )
    for rank, name, score, body in blocks:
        d = {"rank": int(rank), "name": name.strip().rstrip(")"), "score": float(score)}
        m = re.search(r"- \*\*Ne:\*\*\s*(.+)", body)
        if m: d["what"] = m.group(1).strip()
        m = re.search(r"- \*\*Neden şimdi:\*\*\s*(.+)", body)
        if m: d["why_now"] = m.group(1).strip()

        how = []
        how_section = re.search(r"\*\*Nasıl (?:uygulanır|giyilir):\*\*\s*\n((?:\s*-\s+.+\n?)+)", body)
        if how_section:
            how = [h.strip() for h in re.findall(r"\s*-\s+(.+)", how_section.group(1))
                   if not h.strip().startswith("**Bütçe")
                   and not h.strip().startswith("**Zara")
                   and not h.strip().startswith("**Kaynaklar")]
        d["how"] = how



        sources = []
        for s in re.finditer(r"\[([^\]]+)\]\(([^)]+)\)", body.split("Kaynaklar:")[-1] if "Kaynaklar:" in body else ""):
            sources.append({"name": s.group(1), "url": s.group(2)})
        d["sources"] = sources
        details[int(rank)] = d
    return details


def strip_emoji(text):
    """Remove emoji characters from text."""
    # Remove all characters outside basic multilingual plane + common unicode ranges for Turkish text
    cleaned = re.sub(r'[^\w\s/\-.,()&\'\"àâçéèêëïîôùûüöğışÇĞİŞÜÖ]', '', text, flags=re.UNICODE)
    return re.sub(r'\s+', ' ', cleaned).strip()


def parse_colors(text):
    colors = []
    section = re.search(r"## Renk Trendleri[^\n]*\n([\s\S]*?)(?=\n---|\n## )", text)
    if section:
        for m in re.finditer(
            r"\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|",
            section.group(1)
        ):
            name = strip_emoji(m.group(1).strip())
            if not name or name.startswith("Renk") or name.startswith("---") or name.startswith("#"):
                continue
            colors.append({
                "name": name,
                "status": m.group(2).strip(),
                "where": m.group(3).strip(),
                "combo": m.group(4).strip(),
            })
    return colors


def parse_fabrics(text):
    fabrics = []
    # Handle both table format and bullet list format
    section = re.search(r"## Kumaş / (?:Materyal|Malzeme|Mal\w+) Trendleri[^\n]*\n([\s\S]*?)(?=\n---|\n## )", text)
    if not section:
        return fabrics
    body = section.group(1)
    # Try table format first: | Materyal | Trend Yönü | Kullanım |
    for m in re.finditer(r"\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|", body):
        name = strip_emoji(m.group(1).strip())
        if not name or name.startswith("Materyal") or name.startswith("Mat") or name.startswith("---"):
            continue
        fabrics.append({
            "name": name,
            "direction": strip_emoji(m.group(2).strip()),
            "usage": m.group(3).strip(),
        })
    # Fallback: bullet list format: - **Yükselen:** Keten, Saten, ...
    if not fabrics:
        for m in re.finditer(r"- \*\*(.+?):\*\*\s*(.+)", body):
            direction = m.group(1).strip()
            items = [i.strip() for i in m.group(2).split(",") if i.strip()]
            for item in items:
                # Strip parenthetical notes
                clean = re.sub(r"\s*\([^)]*\)", "", item).strip()
                fabrics.append({"name": clean, "direction": direction, "usage": item})
    return fabrics


def parse_next_week(text):
    items = []
    section = re.search(r"## Gelecek Hafta Beklenti[^\n]*\n([\s\S]*?)(?=\n---|\n## |\Z)", text)
    if not section:
        return items
    for m in re.finditer(r"(?:\d+\.\s+|\-\s+)(.+)", section.group(1)):
        line = m.group(1).strip()
        # Try to split on bold title: **Title** — desc
        bold = re.match(r"\*\*(.+?)\*\*\s*(?:—|–|-)\s*(.+)", line)
        if bold:
            items.append({"title": bold.group(1).strip(), "desc": bold.group(2).strip()})
        else:
            # Strip any leftover markdown bold
            clean = re.sub(r"\*\*(.+?)\*\*", r"\1", line)
            items.append({"title": "", "desc": clean})
    return items


def parse_alert(text):
    if not text:
        return None
    alert = {}
    m = re.search(r"#\s+(.+)", text)
    if m: alert["title"] = m.group(1).strip()
    m = re.search(r"\*\*Neden:\*\*\s*(.+)", text)
    if m: alert["reason"] = m.group(1).strip()
    m = re.search(r"\[([^\]]+)\]\(([^)]+)\)", text)
    if m:
        alert["source_name"] = m.group(1)
        alert["source_url"] = m.group(2)
    return alert if alert else None


def build_week(report_path, alert_path, intel_path):
    """Build a single week's data from its files."""
    report_text = read_file(report_path)
    if not report_text:
        return None

    alert_text = read_file(alert_path)

    intelligence = {}
    if intel_path and os.path.exists(intel_path):
        with open(intel_path, "r", encoding="utf-8") as f:
            intel_list = json.load(f)
        for item in intel_list:
            key = item.get("name") or item.get("trend") or ""
            intelligence[key] = item

    meta = parse_meta(report_text)
    highlights = parse_highlights(report_text)
    trends_basic = parse_trend_table(report_text)
    details = parse_trend_details(report_text)
    colors = parse_colors(report_text)
    fabrics = parse_fabrics(report_text)
    next_week = parse_next_week(report_text)
    alert = parse_alert(alert_text)

    def find_intel(name, intelligence):
        """Match trend name to intelligence entry, allowing partial matches."""
        if name in intelligence:
            return intelligence[name]
        # Try: intel key starts with trend name or vice versa
        for key, val in intelligence.items():
            if key.startswith(name) or name.startswith(key):
                return val
        # Try: all words of trend name appear in intel key
        name_words = set(name.lower().split())
        for key, val in intelligence.items():
            key_words = set(key.lower().split())
            if name_words.issubset(key_words) or key_words.issubset(name_words):
                return val
        return {}

    trends = []
    for t in trends_basic:
        d = details.get(t["rank"], {})
        table_name = t["name"]
        merged = {**t, **d}
        merged["name"] = table_name  # keep short table name for display
        intel = find_intel(merged["name"], intelligence)
        if intel:
            merged["intelligence"] = intel
        trends.append(merged)

    return {
        "meta": meta,
        "highlights": highlights,
        "trends": trends,
        "colors": colors,
        "fabrics": fabrics,
        "next_week": next_week,
        "alert": alert,
        "has_intelligence": len(intelligence) > 0,
        "trend_count": len(trends),
        "top_score": max((t["score"] for t in trends), default=0),
        "report_file": os.path.basename(report_path) if report_path else "",
    }


def week_label(monday_str):
    """Generate a human-readable week label from a Monday date string."""
    from datetime import datetime, timedelta
    monday = datetime.strptime(monday_str, "%Y-%m-%d")
    sunday = monday + timedelta(days=6)
    months_tr = ["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"]
    return f"{monday.day} {months_tr[monday.month - 1]} – {sunday.day} {months_tr[sunday.month - 1]} {monday.year}"


def main():
    from datetime import datetime, timedelta

    # Scan weekly subdirectories (named by Monday date) in outputs dir
    weeks = {}

    # Support both flat files and weekly subdirectories
    week_dirs = []
    for entry in sorted(os.listdir(AGENTS_OUTPUT)):
        full = os.path.join(AGENTS_OUTPUT, entry)
        if os.path.isdir(full) and re.match(r"\d{4}-\d{2}-\d{2}", entry):
            week_dirs.append((entry, full))

    # Fallback: if no subdirectories, scan flat files (backward compat)
    if not week_dirs:
        all_reports = sorted(globmod.glob(os.path.join(AGENTS_OUTPUT, "*weekly-report*")))
        for rp in all_reports:
            basename = os.path.basename(rp)
            date_match = re.match(r"(\d{4}-\d{2}-\d{2})", basename)
            if not date_match:
                continue
            date_key = date_match.group(1)
            # Compute week Monday
            d = datetime.strptime(date_key, "%Y-%m-%d")
            monday = d - timedelta(days=d.weekday())
            monday_key = monday.strftime("%Y-%m-%d")

            alert_candidates = sorted(globmod.glob(os.path.join(AGENTS_OUTPUT, f"{date_key}*alert*")))
            intel_candidates = sorted(globmod.glob(os.path.join(AGENTS_OUTPUT, f"{date_key}*intelligence*")))
            alert_path = alert_candidates[-1] if alert_candidates else None
            intel_path = intel_candidates[-1] if intel_candidates else None

            data = build_week(rp, alert_path, intel_path)
            if data:
                data["week_label"] = week_label(monday_key)
                weeks[monday_key] = data
    else:
        for monday_key, week_path in week_dirs:
            # Find files inside the week directory
            reports = sorted(globmod.glob(os.path.join(week_path, "*weekly-report*")))
            if not reports:
                continue
            report_path = reports[-1]  # latest report in this week

            alert_candidates = sorted(globmod.glob(os.path.join(week_path, "*alert*")))
            intel_candidates = sorted(globmod.glob(os.path.join(week_path, "*intelligence*")))
            alert_path = alert_candidates[-1] if alert_candidates else None
            intel_path = intel_candidates[-1] if intel_candidates else None

            data = build_week(report_path, alert_path, intel_path)
            if data:
                data["week_label"] = week_label(monday_key)
                weeks[monday_key] = data

    if not weeks:
        print("Error: No weekly reports found!")
        return

    # Write combined JSON
    sorted_keys = sorted(weeks.keys(), reverse=True)
    output = {
        "weeks": weeks,
        "available_weeks": sorted_keys,
        "latest": sorted_keys[0],
    }

    json_path = os.path.join(SITE_DIR, "src", "lib", "report.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"  report.json updated")
    print(f"     Weeks  : {len(weeks)}")
    for k in sorted_keys:
        w = weeks[k]
        intel = "yes" if w["has_intelligence"] else "no"
        print(f"       {k} ({w['week_label']}) — {w['trend_count']} trends, intel: {intel}")


if __name__ == "__main__":
    main()
