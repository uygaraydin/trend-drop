# Skill: Trend Analysis

## Purpose
Analyze scan data to validate, classify, and transform trends into actionable insights.

## Serves Goals
- Trend detection (validated trends)
- Accuracy (cross-source validation)

## Inputs
- Latest scan output: `outputs/YYYY-MM-DD_fashion-trend_scan-data.md`
- Previous scan outputs (for comparison)
- `MEMORY.md` — historical trend patterns
- `knowledge/AUDIENCE.md` — target audience preferences

## Process

1. **Data Collection** — Read latest scan output and compare with previous weeks

2. **Cross-Source Validation**
   - Count how many distinct sources each trend appears in
   - Classify as Strong (3+), Medium (2), Weak (1)
   - Move weak signals to "watch list", exclude from report

3. **Trend Classification** — For each validated trend:
   - **Trend name:** Short, descriptive (e.g. "Oversized Blazer Comeback")
   - **Category:** Tops / Bottoms / Outerwear / Accessories / Footwear / Color / Fabric
   - **Lifecycle:** Rising / Peak / Declining / Niche
   - **Target segment:** Which audience segment does it serve?
   - **Styling suggestions:** What to pair it with?
   - **Sources:** Sites where it was spotted, with links

4. **Seasonal Context** — Relate to current season:
   - Expected for this season?
   - Early signal (next season)?
   - Off-season surprise?

5. **Historical Comparison**
   - Was this trend detected before?
   - Growing, shrinking, or stable?
   - Does it match patterns in MEMORY.md?

6. **Audience Fit**
   - Compare against `knowledge/AUDIENCE.md`
   - Does this trend fit the target audience's budget?
   - Compatible with their style?
   - Assign applicability score (1–10)

7. **Calculate Trend Score**
   - Signal strength (x3): number of sources
   - Novelty (x2): how fresh/new
   - Audience fit (x2): how suitable for target audience
   - Seasonal fit (x1): is the timing right
   - **Total score** = weighted average (1–10)

8. **Ranking** — Sort trends by score, identify top 10

## Outputs
- `data/outputs/YYYY-MM-DD/YYYY-MM-DD_fashion-trend_analysis.json` — Structured analysis data
- Strong trends → written to journal
- Confirmed patterns → MEMORY.md updated

### Output Format

```json
{
  "date": "YYYY-MM-DD",
  "trends": [
    {
      "rank": 1,
      "name": "Trend Name",
      "category": "Tops / Bottoms / Outerwear / Accessories / Footwear",
      "lifecycle": "Yükselen / Zirve / Geri Dönüş / Niş",
      "score": 8.5,
      "source_count": 4,
      "what": "Short description of the trend",
      "why_now": "Why it's popular right now",
      "how": ["Styling suggestion 1", "Styling suggestion 2"],
      "sources": ["Source 1", "Source 2"]
    }
  ],
  "colors": [
    {
      "name": "Color Name",
      "status": "Yükselen / Zirve / Stabil / İzlemede",
      "where": "Where to wear",
      "combo": "Best color combinations"
    }
  ],
  "watch_list": [
    {
      "name": "Unvalidated trend",
      "source": "Single source",
      "reason": "Why worth watching"
    }
  ]
}
```

## Quality Bar
- Each trend supported by at least 2 sources
- Lifecycle assessment completed
- Audience fit score assigned
- Comparison with previous weeks done
- Score calculation is transparent

## Tools
- Previous output files (file read)
- MEMORY.md (pattern matching)

## Integration
- **WEB_TREND_SCANNING** → input to this skill
- This skill → **REPORT_GENERATION** input (analysis.json → weekly-report.md)
- **REPORT_GENERATION** → **TREND_INTELLIGENCE** input (weekly-report.md → intelligence.json)
- Confirmed patterns → MEMORY.md update
