"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import allData from "@/lib/report.json";
import type { Trend } from "@/lib/report-data";
import { Brain, ChevronDown } from "lucide-react";
import { TrendModal } from "@/components/trend-modal";
import { IntelligencePanel } from "@/components/intelligence-panel";

const R = allData as unknown as {
  weeks: Record<string, any>;
  available_weeks: string[];
  latest: string;
};

const COLOR_HEX: Record<string, string> = {
  "Ekru / Krem": "#f5f0e1",
  "Beyaz": "#f8f8f8",
  "Açık Mavi": "#a8cce8",
  "Taba / Toprak Rengi": "#b07840",
  "Taba / Toprak": "#b07840",
  "Pembe": "#e8a0b0",
  "Kırmızı / Mercan": "#d95050",
  "Lacivert": "#1e3a5f",
  "Siyah": "#2a2a2a",
  "Bej": "#d9c9a8",
  "Krem": "#f5f0e1",
  "Ekru": "#ece6d0",
  "Domates Kırmızısı": "#c94040",
  "Buz Mavisi": "#6ba3d6",
  "Pastel Pembe": "#dba0a0",
  "Tereyağı Sarısı": "#c8b840",
  "Limon Yeşili": "#6faa6f",
  "Çikolata Kahve": "#7a5230",
  "Mor Tonları": "#8a72b8",
};

/* ── Typography helpers ── */
const t = {
  label: "text-[11px] font-mono uppercase tracking-widest text-stone-400",
  body: "text-[13px] leading-relaxed text-stone-500",
  titleSm: "text-[15px] font-medium text-stone-800",
  titleLg: "text-xl font-medium tracking-tight text-stone-900",
  scoreSm: "text-2xl font-light text-stone-800 tabular-nums",
  monoVal: "text-[12px] font-mono text-stone-600",
  subtle: "text-[11px] font-mono text-stone-300",
  badge: "px-2 py-0.5 rounded text-[11px] font-mono uppercase tracking-widest",
} as const;

function lcBadge(lc: string) {
  if (lc.includes("Yükselen")) return { label: "Yükselen", cls: `${t.badge} bg-emerald-100 text-emerald-700` };
  if (lc.includes("Zirve")) return { label: "Zirve", cls: `${t.badge} bg-amber-100 text-amber-700` };
  if (lc.includes("Geri")) return { label: "Geri Dönüş", cls: `${t.badge} bg-sky-100 text-sky-700` };
  return { label: lc, cls: `${t.badge} bg-stone-100 text-stone-600` };
}

function getWeekLabel(weekKey: string) {
  const week = (R.weeks as any)[weekKey];
  return week?.week_label || weekKey;
}

const FILTERS = ["Tümü", "Yükselen", "Zirve", "Geri Dönüş"];

export default function Home() {
  const [selectedWeek, setSelectedWeek] = useState(R.latest);
  const [filter, setFilter] = useState("Tümü");
  const [selectedTrend, setSelectedTrend] = useState<Trend | null>(null);
  const [intelTrend, setIntelTrend] = useState<Trend | null>(null);
  const [weekDropdownOpen, setWeekDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setWeekDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const week = R.weeks[selectedWeek];

  const filtered = useMemo(() => {
    if (!week) return [];
    return week.trends.filter((tr: Trend) => {
      if (filter === "Tümü") return true;
      if (filter === "Geri Dönüş") return tr.lifecycle.includes("Geri");
      return tr.lifecycle.includes(filter);
    });
  }, [week, filter]);

  if (!week) return null;

  return (
    <div className="min-h-screen bg-[#f5f3ef]">
      {/* Nav */}
      <nav className="sticky top-0 z-40 flex items-center justify-between px-8 md:px-12 py-4 border-b border-black/[0.06] backdrop-blur-xl bg-[#f5f3ef]/85">
        <span className={t.titleSm}>TrendDrop</span>
        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-md bg-white border border-black/[0.06] ${t.label}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          aktif
        </span>
      </nav>

      {/* Week Selector */}
      <div className="border-b border-black/[0.06] px-8 md:px-12 py-3 flex items-center gap-3">
        <span className={`${t.label} shrink-0`}>Hafta</span>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setWeekDropdownOpen(!weekDropdownOpen)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-white border border-black/[0.06] ${t.monoVal} hover:border-black/[0.12] transition-all`}
          >
            {getWeekLabel(selectedWeek)}
            <ChevronDown size={13} className={`text-stone-400 transition-transform ${weekDropdownOpen ? "rotate-180" : ""}`} />
          </button>
          {weekDropdownOpen && (
            <div className="absolute top-full left-0 mt-1.5 min-w-[220px] bg-white border border-black/[0.08] rounded-lg shadow-lg py-1 z-50">
              {R.available_weeks.map((w) => (
                <button
                  key={w}
                  onClick={() => { setSelectedWeek(w); setFilter("Tümü"); setWeekDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 ${t.monoVal} transition-colors ${
                    selectedWeek === w
                      ? "bg-stone-900 text-white"
                      : "text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  {getWeekLabel(w)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hero */}
      <section className="max-w-[1200px] mx-auto px-8 md:px-12 pt-16 pb-10">
        <p className={`${t.label} mb-3`}>{week.meta.period}</p>
        <h1 className="text-[clamp(32px,4.5vw,52px)] font-light tracking-tight leading-[1.1] text-stone-900 mb-4">
          Bu Haftanın Trendleri
        </h1>
        <p className={`${t.body} max-w-lg`}>en yüksek skor {week.top_score}</p>
      </section>

      {/* Highlights */}
      {week.highlights.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-8 md:px-12 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {week.highlights.map((hi: { title: string; desc: string }, i: number) => (
              <div key={i} className={`rounded-lg border border-black/[0.06] bg-white p-5 ${t.body}`}>
                <span className="text-stone-800 font-medium">{hi.title}</span>
                <span className="text-stone-300 mx-1.5">—</span>
                {hi.desc}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Filters + Grid */}
      <section className="max-w-[1200px] mx-auto px-8 md:px-12 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-1">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3.5 py-1.5 rounded-md ${t.monoVal} transition-all ${
                  filter === f
                    ? "bg-stone-900 text-white font-medium"
                    : "text-stone-400 hover:text-stone-700 hover:bg-stone-200/60"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <span className={t.subtle}>{filtered.length} sonuç</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((tr: Trend) => {
            const badge = lcBadge(tr.lifecycle);
            return (
              <div
                key={tr.rank}
                onClick={() => setSelectedTrend(tr)}
                className="group rounded-lg border border-black/[0.06] bg-white p-6 cursor-pointer transition-all hover:shadow-[0_2px_16px_rgba(0,0,0,0.06)] hover:border-black/[0.1]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className={t.scoreSm}>{tr.score}</span>
                    <span className={t.label}>skor</span>
                  </div>
                  <span className={t.subtle}>#{tr.rank}</span>
                </div>

                <h3 className={`${t.titleSm} leading-snug mb-1`}>{tr.name}</h3>
                <p className={`${t.label} mb-3`}>{tr.category}</p>
                <p className={`${t.body} line-clamp-2 mb-4`}>{tr.what || ""}</p>

                <div className="h-[2px] bg-stone-100 rounded-full mb-4">
                  <div
                    className="h-[2px] rounded-full bg-stone-400 animate-score-fill"
                    style={{ width: `${tr.score * 10}%` }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={badge.cls}>{badge.label}</span>
                    <span className={t.subtle}>{tr.source_count}k</span>
                  </div>
                  {tr.intelligence && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setIntelTrend(tr); }}
                      className="w-8 h-8 rounded-full bg-stone-900 text-white hover:bg-stone-700 transition-colors flex items-center justify-center shadow-sm"
                      title="Intelligence"
                    >
                      <Brain size={15} strokeWidth={1.8} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Color Trends */}
      <section className="max-w-[1200px] mx-auto px-8 md:px-12 pb-16">
        <h2 className={`${t.label} mb-5`}>Renk Trendleri</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {week.colors.map((c: any, i: number) => {
            const hex = COLOR_HEX[c.name] || "#888";
            return (
              <div key={i} className="rounded-lg border border-black/[0.06] bg-white p-4">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-3.5 h-3.5 rounded-full" style={{ background: hex }} />
                  <span className={t.titleSm}>{c.name}</span>
                  <span className={t.label}>{c.status}</span>
                </div>
                <p className={`${t.body} text-[11px]`}>{c.where}</p>
                <p className={`${t.subtle} mt-1`}>{c.combo}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Fabric Trends */}
      {week.fabrics && week.fabrics.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-8 md:px-12 pb-16">
          <h2 className={`${t.label} mb-5`}>Kumaş Trendleri</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {week.fabrics.map((f: any, i: number) => (
              <div key={i} className="rounded-lg border border-black/[0.06] bg-white p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className={t.titleSm}>{f.name}</span>
                  <span className={t.label}>{f.direction}</span>
                </div>
                <p className={`${t.body} text-[11px]`}>{f.usage}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Next Week */}
      {week.next_week && week.next_week.length > 0 && (
        <section className="max-w-[1200px] mx-auto px-8 md:px-12 pb-16">
          <h2 className={`${t.label} mb-5`}>Gelecek Hafta</h2>
          <div className="flex flex-col gap-2">
            {week.next_week.map((item: any, i: number) => (
              <div key={i} className={`rounded-lg border border-black/[0.06] bg-white p-5 ${t.body}`}>
                {item.title ? `${item.title} — ${item.desc}` : item.desc}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-black/[0.06] py-8 text-center">
        <span className={t.subtle}>TrendDrop</span>
      </footer>

      <TrendModal trend={selectedTrend} onClose={() => setSelectedTrend(null)} />
      <IntelligencePanel trend={intelTrend} onClose={() => setIntelTrend(null)} />
    </div>
  );
}
