"use client";

import { useMemo, useState } from "react";
import { cn, getDateKey } from "@/lib/utils";

// ----------------------------------------------------------------------
// FEATURE E: LeetCode-Style Analytics & Profile Building
// Renders a 60-day contribution grid (dark green -> neon green levels)
// from a { "YYYY-MM-DD": count } heatmap payload fetched from
// /api/user/analytics.
// ----------------------------------------------------------------------

interface ActivityHeatmapProps {
  heatmap: Record<string, number>;
}

const LEVEL_COLORS = [
  "bg-white/5", // 0 activity
  "bg-emerald-950", // level 1
  "bg-emerald-800", // level 2
  "bg-emerald-600", // level 3
  "bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]", // level 4 (neon)
];

function levelForCount(count: number): number {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 6) return 3;
  return 4;
}

export function ActivityHeatmap({ heatmap }: ActivityHeatmapProps) {
  const [hovered, setHovered] = useState<{ date: string; count: number } | null>(
    null
  );

  const days = useMemo(() => {
    const entries = Object.entries(heatmap).sort(([a], [b]) => (a < b ? -1 : 1));
    return entries.map(([date, count]) => ({ date, count }));
  }, [heatmap]);

  // Group into week columns (7-day chunks) for the grid layout.
  const weeks = useMemo(() => {
    const chunks: { date: string; count: number }[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      chunks.push(days.slice(i, i + 7));
    }
    return chunks;
  }, [days]);

  const todayKey = getDateKey(new Date());

  return (
    <div className="relative">
      <div className="flex gap-1 overflow-x-auto pb-2">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map(({ date, count }) => (
              <button
                key={date}
                type="button"
                onMouseEnter={() => setHovered({ date, count })}
                onMouseLeave={() => setHovered(null)}
                aria-label={`${count} activities on ${date}`}
                className={cn(
                  "h-3 w-3 rounded-sm transition-transform hover:scale-125 focus-ring",
                  LEVEL_COLORS[levelForCount(count)],
                  date === todayKey && "ring-1 ring-accent-cyan"
                )}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
        <span>60-day activity</span>
        <div className="flex items-center gap-1">
          <span>Less</span>
          {LEVEL_COLORS.map((color, i) => (
            <span key={i} className={cn("h-2.5 w-2.5 rounded-sm", color)} />
          ))}
          <span>More</span>
        </div>
      </div>

      {hovered && (
        <div className="absolute -top-8 left-0 rounded-md border border-white/10 bg-bg-card px-2 py-1 text-[11px] text-slate-200 shadow-lg">
          {hovered.count} {hovered.count === 1 ? "activity" : "activities"} · {hovered.date}
        </div>
      )}
    </div>
  );
}
