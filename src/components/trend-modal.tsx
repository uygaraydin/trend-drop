"use client";

import { useEffect, useCallback } from "react";
import type { Trend } from "@/lib/report-data";

const t = {
  label: "text-[11px] font-mono uppercase tracking-widest text-stone-400",
  body: "text-[13px] leading-relaxed text-stone-500",
  titleSm: "text-[15px] font-medium text-stone-800",
  titleLg: "text-xl font-medium tracking-tight text-stone-900",
  scoreLg: "text-4xl font-light text-stone-800 tabular-nums",
  badge: "px-2 py-0.5 rounded text-[11px] font-mono uppercase tracking-widest",
  subtle: "text-[11px] font-mono text-stone-300",
} as const;

function lcBadge(lc: string) {
  if (lc.includes("Yükselen")) return { label: "Yükselen", cls: `${t.badge} bg-emerald-100 text-emerald-700` };
  if (lc.includes("Zirve")) return { label: "Zirve", cls: `${t.badge} bg-amber-100 text-amber-700` };
  if (lc.includes("Geri")) return { label: "Geri Dönüş", cls: `${t.badge} bg-sky-100 text-sky-700` };
  return { label: lc, cls: `${t.badge} bg-stone-100 text-stone-600` };
}

export function TrendModal({
  trend,
  onClose,
}: {
  trend: Trend | null;
  onClose: () => void;
}) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); },
    [onClose]
  );

  useEffect(() => {
    if (trend) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [trend, handleKeyDown]);

  if (!trend) return null;
  const badge = lcBadge(trend.lifecycle);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-5 bg-black/30 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-xl border border-black/[0.06] bg-white p-8 animate-in zoom-in-95 duration-200 shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-md border border-black/[0.06] bg-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-700 transition-colors text-xs"
        >
          ✕
        </button>

        <div className="flex items-baseline gap-2 mb-1">
          <span className={t.scoreLg}>{trend.score}</span>
          <span className={t.label}>skor</span>
        </div>

        <div className="h-[2px] bg-stone-100 rounded-full mt-2 mb-6">
          <div
            className="h-[2px] rounded-full bg-stone-400 animate-score-fill"
            style={{ width: `${trend.score * 10}%` }}
          />
        </div>

        <h2 className={`${t.titleLg} mb-2`}>{trend.name}</h2>
        <span className={`inline-block mb-6 ${badge.cls}`}>{badge.label}</span>

        {trend.what && (
          <Section title="Nedir">
            <p>{trend.what}</p>
          </Section>
        )}

        {trend.why_now && (
          <Section title="Neden Şimdi">
            <p>{trend.why_now}</p>
          </Section>
        )}

        {trend.how && trend.how.length > 0 && (
          <Section title="Nasıl Giyilir">
            <ul className="flex flex-col gap-1">
              {trend.how.map((h, i) => (
                <li key={i} className="before:content-['→_'] before:text-stone-300">{h}</li>
              ))}
            </ul>
          </Section>
        )}

        {trend.sources && trend.sources.length > 0 && (
          <Section title="Kaynaklar">
            <div className="flex flex-wrap gap-2">
              {trend.sources.map((s, i) => (
                <a
                  key={i}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] font-mono text-stone-400 underline underline-offset-2 hover:text-stone-700 transition-colors"
                >
                  {s.name}
                </a>
              ))}
            </div>
          </Section>
        )}

      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h4 className="text-[11px] font-mono uppercase tracking-widest text-stone-400 mb-2">{title}</h4>
      <div className="text-[13px] leading-relaxed text-stone-500">{children}</div>
    </div>
  );
}
