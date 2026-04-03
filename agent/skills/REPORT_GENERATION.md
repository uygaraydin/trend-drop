# Skill: Report Generation

## Purpose
Transform analyzed trend data into a readable, actionable weekly trend report.

## Serves Goals
- All goals (reporting is the output of all KPIs)

## Inputs
- `outputs/YYYY-MM-DD_fashion-trend_analysis.json` (TREND_ANALYSIS output)
- `knowledge/AUDIENCE.md` — determines report language and tone
- `knowledge/BRAND.md` — brand voice
- `MEMORY.md` — learnings from past reports

## Process

1. **Gather Analysis Data**
   - Read all analysis outputs for the week
   - Sort top 10 trends by score

2. **Build Report Structure:**

   ### Weekly Trend Report Format:

   ```
   # Weekly Fashion Trend Report — [Date]

   ## This Week's Highlights
   <!-- Top 3 trends, 1–2 sentence summary -->

   ## Trend Table
   | # | Trend | Category | Lifecycle | Score | Sources |

   ## Detailed Trend Analyses
   ### 1. [Trend Name]
   - What: Short description
   - Why now: Why it's popular right now
   - Who: Target segment
   - How to wear: Styling suggestions
   - Sources: Links

   ## Color Trends
   <!-- This week's standout colors -->

   ## Fabric / Material Trends
   <!-- Standout materials -->

   ## Watch List
   <!-- Unvalidated signals worth monitoring -->

   ## Week-over-Week Comparison
   - New entries
   - Rising trends
   - Declining trends

   ## Next Week Expectations
   ```

3. **Content Writing**
   - Write in target audience's language (reference AUDIENCE.md)
   - Jargon-free, clear
   - Concrete "what to wear" suggestion for each trend
   - Include links and sources

4. **Quality Check**
   - All trends sourced?
   - Any duplication?
   - Language consistent?
   - Format correct?

5. **Write to File**

## Outputs
- `data/outputs/YYYY-MM-DD/YYYY-MM-DD_fashion-trend_weekly-report.md` — Weekly report
- If urgent trend detected: `data/outputs/YYYY-MM-DD/YYYY-MM-DD_fashion-trend_alert.md` — Instant alert

## Quality Bar
- At least 5 validated trends included
- Each trend has source links
- Styling suggestions are concrete and actionable
- Week-over-week comparison done
- Reading time should not exceed 5–7 minutes
- Watch list is up to date

## Tools
- File read/write
- MEMORY.md reference

## Report Language
- All reports MUST be written in Turkish
- Use the mixed Turkish-English style described in `knowledge/AUDIENCE.md`
- Trend names can include English terms where natural (e.g. "Layering", "Poet-Core")

## Integration
- **TREND_ANALYSIS** → `analysis.json` → input to this skill
- This skill → `weekly-report.md` → input to **TREND_INTELLIGENCE**
- Report → can be shared after human approval
- Key findings → written to journal
