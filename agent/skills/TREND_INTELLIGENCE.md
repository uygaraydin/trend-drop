# Skill: Trend Intelligence

## Purpose
Transform validated trends into decision-ready intelligence by evaluating momentum, acceleration, impact, and action.

## Serves Goals
- Improve decision quality
- Add predictive layer to trends
- Increase product value (intelligence layer)

## Inputs
- `outputs/YYYY-MM-DD_fashion-trend_weekly-report.md` (REPORT_GENERATION output — must exist before this skill runs)
- Previous weekly reports (if available, for trajectory comparison)
- `MEMORY.md` — historical trend patterns

## Process

1. **Read Trends**
   - Extract validated trends from weekly-report.md
   - Only include trends with 2+ sources
   - Discard anything from the watch list (unvalidated signals)

2. **Compare With Past (if available)**
   - Check if the trend appeared in previous reports
   - Determine trajectory: new, growing, or stable
   - Note any trends that dropped off since last report

3. **Evaluate Each Trend Using Rules**

   Apply these rules per trend:

   - **Acceleration:**
     - Appears in MORE sources than before → `fast`
     - Stable source count across weeks → `steady`
     - Fewer sources than before → `slowing`

   - **Stage:**
     - First appearance → `emerging`
     - 2+ consecutive weeks, growing → `accelerating`
     - Stable for 3+ weeks → `mainstream`
     - Declining source count → `declining`

   - **Market Impact:**
     - Present in both retail (Zara, H&M, Mango) AND editorial → `growing` or `mainstream`
     - Only in Pinterest/TikTok/social → `niche`
     - Only in runway/editorial → `aspirational`

   - **Momentum Score (0–100):**
     Based on:
     - Number of sources (weight: 3x)
     - Recency of signals (weight: 2x)
     - Cross-platform presence (weight: 2x)
     - Retail validation (weight: 1x)

   - **Confidence Score (0–100):**
     - 3+ sources → high (70–90)
     - 2 sources → medium (50–70)
     - Adjust up if retail-validated, adjust down if social-only

4. **Generate Intelligence Fields**

   For each trend, produce:

   - **name** — MUST use key `"name"` (not `"trend"`), must match the trend name exactly from the report
   - **momentum_score** — 0–100
   - **acceleration** — fast / steady / slowing
   - **stage** — emerging / accelerating / mainstream / declining
   - **time_horizon** — short (this month) / mid (this season) / long (next season)
   - **market_impact** — niche / growing / mainstream / aspirational
   - **confidence_score** — 0–100
   - **key_insight** — 1 sentence, specific and non-generic
   - **action** — clear and specific recommendation
   - **risk** — why this trend may fail or fade

5. **Generate Output File**

   Create: `outputs/YYYY-MM-DD_fashion-trend_intelligence.json`

   Format:

   ```json
   [
     {
       "name": "",
       "momentum_score": 0,
       "acceleration": "",
       "stage": "",
       "time_horizon": "",
       "market_impact": "",
       "confidence_score": 0,
       "key_insight": "",
       "action": "",
       "risk": ""
     }
   ]
   ```

## Outputs
- `data/outputs/YYYY-MM-DD/YYYY-MM-DD_fashion-trend_intelligence.json`

## Quality Bar
- Only validated trends (2+ sources)
- Clear, decisive output — no hedging or vague language
- No generic statements (e.g. "this trend is popular")
- Each field must provide standalone value
- JSON must be clean, parseable, and usable by downstream systems
- key_insight must be specific to the trend, not copy-paste filler
- action must be concrete enough to act on without further research

## Tools
- File read/write
- Previous output files (for comparison)
- MEMORY.md reference

## Integration
- **REPORT_GENERATION** → `weekly-report.md` → input to this skill
- This skill → `intelligence.json` → consumed by web UI (via build.py → report.json)
- This is the LAST skill in the chain: scan → analysis → report → intelligence
- Patterns confirmed across multiple weeks → MEMORY.md update

## Post-Skill: Auto Deploy
After writing the intelligence.json file, run the deploy script to update the live site:
```bash
bash /Users/uygaraydin/Desktop/Agents/site-next/deploy.sh
```
This rebuilds report.json, commits, pushes to GitHub, and Vercel auto-deploys.
