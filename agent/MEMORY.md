# Memory: Fashion Trend Agent

Agent-local learnings. Updated during weekly reviews and when patterns are confirmed.

## What Works
- Who What Wear multi-trend articles are the richest data source
- Cross-source validation (3+ sources) provides reliable trend detection
- Scanning 6+ sources in parallel via WebSearch is efficient

## What Doesn't Work
- zara.com direct access via Playwright MCP is SUCCESSFUL (March 29, 2026) — 403 issue resolved
- WebFetch on JS-heavy fashion sites doesn't return full product lists — summary articles work better

## Patterns Noticed
- Quiet luxury → maximalism transition started late 2025, peaking in spring 2026
- Denim silhouette cycle: skinny → wide-leg → bootcut/cigarette (we are here now)
- Pinterest Predicts forecasts overlap 80%+ with actual store collections

## Trend Signals
- Red is transitioning from streetwear to mainstream (monitor)
- Lace detail as a "surprise piece" is on the rise — could peak summer 2026
- Poet-core / academia aesthetic growing rapidly (Pinterest +175%)
- Fringe detail strong at Zara, still weak at other sources — early signal

## Source Reliability
- **Reliable:** Who What Wear (comprehensive, fast), Pinterest Predicts (high accuracy), Google Trends (data-driven)
- **Good:** Complex/Hypebeast (streetwear-focused), Marie Claire (mainstream)
- **Medium:** TikTok (noisy but catches viral trends early)
- **Access issues:** H&M.com (direct access blocked — needs Playwright testing)

## Process Improvements
- Fashion editor articles > direct store sites (richer trend analysis)
- First scan needs 8+ sources; weekly refreshes need only 5–6 source updates

## Last Updated
- 2026-03-29 (first scan — baseline)
