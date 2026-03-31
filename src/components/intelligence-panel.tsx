"use client";

import { useEffect, useCallback } from "react";
import type { Trend } from "@/lib/report-data";

const t = {
  label: "text-[11px] font-mono uppercase tracking-widest text-stone-400",
  body: "text-[13px] leading-relaxed text-stone-500",
  titleSm: "text-[15px] font-medium text-stone-800",
  monoVal: "text-[12px] font-mono text-stone-600",
  badge: "px-2 py-0.5 rounded text-[11px] font-mono uppercase tracking-widest",
} as const;

export function IntelligencePanel({
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

  if (!trend?.intelligence) return null;
  const intel = trend.intelligence;

  const accelLabel = intel.acceleration === "fast" ? "Hızlı" : intel.acceleration === "steady" ? "Sabit" : "Yavaş";
  const accelCls = intel.acceleration === "fast" ? "text-emerald-600" : intel.acceleration === "steady" ? "text-sky-600" : "text-amber-600";

  const horizonLabel = intel.time_horizon.includes("short") ? "Kısa vade" : intel.time_horizon.includes("mid") ? "Orta vade" : "Uzun vade";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-5 bg-black/30 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full sm:max-w-md max-h-[90vh] overflow-y-auto rounded-t-xl sm:rounded-xl border border-black/[0.06] bg-white p-7 shadow-xl animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-md border border-black/[0.06] bg-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-700 transition-colors text-xs"
        >
          ✕
        </button>

        <p className={`${t.label} mb-3`}>Intelligence</p>
        <h3 className={`${t.titleSm} mb-5 pr-8 leading-snug`}>{trend.name}</h3>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <ScoreBar label="Momentum" value={intel.momentum_score} color="bg-stone-700" />
          <ScoreBar label="Güven" value={intel.confidence_score} color="bg-stone-400" />
        </div>

        <div className="flex flex-wrap gap-1.5 mb-5">
          <Tag><span className={accelCls}>{accelLabel}</span></Tag>
          <Tag>{intel.stage}</Tag>
          <Tag>{horizonLabel}</Tag>
          <Tag>{intel.market_impact}</Tag>
        </div>

        <div className="mb-5 rounded-md bg-stone-50 border border-black/[0.06] p-4">
          <p className={`${t.body} italic`}>
            &ldquo;{intel.key_insight}&rdquo;
          </p>
        </div>

        <div className="mb-4">
          <div className="flex items-start gap-2">
            <span className="text-emerald-600 text-xs mt-0.5 shrink-0">→</span>
            <div>
              <span className={`${t.label} text-emerald-600`}>Aksiyon</span>
              <p className={`${t.body} mt-1`}>{intel.action}</p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-start gap-2">
            <span className="text-amber-600 text-xs mt-0.5 shrink-0">!</span>
            <div>
              <span className={`${t.label} text-amber-600`}>Risk</span>
              <p className={`${t.body} mt-1`}>{intel.risk}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className={t.label}>{label}</span>
        <span className={`${t.monoVal} tabular-nums`}>{value}</span>
      </div>
      <div className="h-1 bg-stone-100 rounded-full overflow-hidden">
        <div className={`h-1 rounded-full ${color} animate-score-fill`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className={`${t.badge} bg-stone-100 text-stone-600`}>
      {children}
    </span>
  );
}
