# Skill: Web Trend Scanning

## Purpose
Scan fashion websites, social platforms, and blogs using Playwright MCP to collect real-time clothing trend signals.

## Serves Goals
- Trend detection (discover new trends)
- Coverage (multi-source scanning)
- Speed (rapid detection)

## Inputs
- `knowledge/AUDIENCE.md` — target audience preferences and segments
- `MEMORY.md` — trusted source list, historical patterns
- `data/imports/urls.md` — manually added URLs (if any)
- Previous scan outputs (for comparison during re-scans)

## Process

### Source Scanning (via Playwright MCP)

### Tier 1 — Every scan (Gen Z fast fashion)
   - Zara → https://www.zara.com/tr/tr/kadin-yeni-gelenler-l1180.html (Playwright MCP access confirmed)
   - Bershka → https://www.bershka.com/tr/yeni-gelenler-c1010378020.html
   - Pull&Bear → https://www.pullandbear.com/tr/kadin/yenilikler-n6420.html
   - Stradivarius → https://www.stradivarius.com/tr/kadin/yenilikler-c1390551.html
   - H&M → https://www2.hm.com/tr_tr/kadin/yeni-urunler/goruntule-tumu.html
   - Shein → https://tr.shein.com/New-in-Trends-sc-00654187.html

### Tier 2 — 2–3x per week (mainstream + streetwear)
   - Mango → https://shop.mango.com/tr/kadin/yeni-gelenler
   - ASOS → https://www.asos.com/women/new-in/cat/?cid=2623
   - Nike → https://www.nike.com/tr/w/yeni-cikislar-3n82y (streetwear/sneaker)
   - Trendyol → https://www.trendyol.com/butik/liste/2/kadin (Turkish market pulse)
   - Koton → https://www.koton.com/tr/kadin/yeni-gelenler/ (Turkish fast fashion)

### Tier 3 — Weekly (trend guides + social media)
   - Who What Wear → https://www.whowhatwear.com/fashion/trends/ (richest trend articles)
   - Hypebeast → https://hypebeast.com/fashion (streetwear trends)
   - Highsnobiety → https://www.highsnobiety.com/fashion/ (Gen Z streetwear)
   - Pinterest → search "gen z fashion trends 2026"
   - TikTok → trending fashion hashtags (#outfitinspo, #fitcheck, #ootd, #fashiontok)
   - Google Trends → fashion-related search terms

### Tier 4 — Monthly (luxury reference + runway)
   - Vogue → https://www.vogue.com/fashion (direction-setting)
   - Elle → https://www.elle.com/fashion/ (mainstream trend)
   - Tagwalk → https://www.tagwalk.com (runway trends)

### Tier 5 — Every scan (genel web araması)
   Sabit sitelere ek olarak, her taramada aşağıdaki aramaları yap:
   - "fashion trends 2026 spring summer"
   - "gen z fashion trends this week"
   - "streetwear trends 2026"
   - "color trends fashion 2026"
   - "fabric trends 2026"

   Bu aramalar sabit sitelerde olmayan sinyalleri yakalar — yeni bloglar, editöryel içerikler, sosyal medya analizleri. Sonuçlardan ilk 5-10 bağlantıyı aç ve tara.

### Fallback Strategy
   - If a site returns 403/timeout → use WebSearch to find editor articles analyzing that site
   - If inaccessible for 2+ consecutive scans → note in MEMORY.md, demote from tier
   - Playwright MCP is primary, WebFetch is fallback

### For Each Source:
1. Open and render page via Playwright
2. Identify featured products/content:
   - Product names and descriptions
   - Color palettes
   - Fabric/material information
   - Style categories (casual, formal, streetwear, etc.)
   - Price ranges (if available)
3. Note recurring elements (appearing across multiple sources = strong signal)
4. Take screenshots when needed (visual reference)

### Data Compilation:
5. Merge data from all sources
6. Categorize each trend signal:
   - **Category:** Tops / Bottoms / Outerwear / Accessories / Footwear
   - **Style:** Casual / Streetwear / Formal / Athleisure / Boho / Minimalist
   - **Signal strength:** Strong (3+ sources) / Medium (2 sources) / Weak (1 source)
   - **Novelty:** New trend / Continuing / Comeback

## Outputs
- `data/outputs/YYYY-MM-DD/YYYY-MM-DD_fashion-trend_scan-data.json` — Raw scan data, categorized

## Quality Bar
- At least 6 different sources scanned
- Each signal backed by source link
- Signal strength rating applied
- Scan date and time recorded
- Inaccessible sources noted

## Tools
- **Playwright MCP** — web browsing, page reading, screenshots
- **WebSearch** — genel internet araması (Tier 5 + fallback)
- **WebFetch** — sayfa içeriği çekme (fallback)

## Integration
- Output → feeds into **TREND_ANALYSIS**
- Strong signals → can be written directly to journal (for other agents to see)
