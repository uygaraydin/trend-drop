# Fashion Trend Agent Heartbeat

## Schedule
Daily (every morning). Weekly report: Monday.

## Each Cycle

### 1. Read Context
- Read recent journal entries — any new signals?
- Read `knowledge/STRATEGY.md` — any priority changes?
- Read `knowledge/AUDIENCE.md` — target audience preferences
- Read `MEMORY.md` — proven patterns and anti-patterns
- Check `data/imports/` — any new URL lists or data?

### 2. Assess State
- When was the last scan?
- Is there unanalyzed scan data pending?
- Is it weekly report time?
- Any urgent trend signals?

### 3. Execute Skill
- No scan data or >24 hours old? → **WEB_TREND_SCANNING**
- Scan data exists but unanalyzed? → **TREND_ANALYSIS**
- Analysis ready, no report yet? → **REPORT_GENERATION**
- Report ready, no intelligence yet? → **TREND_INTELLIGENCE**
- Viral signal detected? → **WEB_TREND_SCANNING** (focused) → **TREND_ANALYSIS** → **REPORT_GENERATION** → **TREND_INTELLIGENCE** → fast alert

**Skill execution order (full weekly cycle):**
```
WEB_TREND_SCANNING → scan-data.md
       ↓
TREND_ANALYSIS → analysis.json
       ↓
REPORT_GENERATION → weekly-report.md (reads analysis.json)
       ↓
TREND_INTELLIGENCE → intelligence.json (reads weekly-report.md)
```

### 4. Log to Journal
- What was done this cycle
- Important trends detected
- What should be done next cycle

## Weekly Review (Monday)

### 1. Gather Data
- Collect all scan outputs for the week (from `outputs/`)
- Compare with previous weekly reports

### 2. Score Against Targets

| Metric | Target | This Week | Status |
|--------|--------|-----------|--------|
| New trend count | >10 | | |
| Source diversity | >6 | | |
| Trend accuracy (last week's) | >70% | | |

### 3. Analyze Wins and Misses
- **Wins:** Which sources gave the best signals? Which categories trended?
- **Misses:** Any missed trends? False alarm rate?

### 4. Update Memory
- Add reliable sources to MEMORY.md
- Record failed patterns
- Note seasonal / cyclical patterns

### 5. Log Weekly Summary to Journal
- Number of sources scanned
- Number of trends detected
- Performance against targets
- Strongest trend of the week
- Recommendations for next week

## Monthly Review
- Compare trends across 4 weeks
- Identify seasonal patterns
- Evaluate whether target adjustments are needed
- Score source quality

## Escalation Rules
- Trend detection count below target for 2+ consecutive weeks
- A source is consistently inaccessible (site structure may have changed)
- Playwright MCP connection issues
- Trend accuracy drops below 50%
- A decision requiring strategic guidance arises
