"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Flame, Trophy, Clock3, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ActivityHeatmap } from "@/components/analytics/ActivityHeatmap";
import { formatHours } from "@/lib/utils";

interface AnalyticsResponse {
  profile: {
    currentStreak: number;
    longestStreak: number;
    totalHours: number;
    problemsSolved: number;
  };
  heatmap: Record<string, number>;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/user/analytics");
        if (!res.ok) throw new Error("Failed to load analytics.");
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Error loading data.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = [
    {
      label: "Current Streak",
      value: data ? `${data.profile.currentStreak}d` : "—",
      icon: Flame,
      tone: "text-accent-coral",
    },
    {
      label: "Longest Streak",
      value: data ? `${data.profile.longestStreak}d` : "—",
      icon: Trophy,
      tone: "text-accent-violet",
    },
    {
      label: "Total Study Time",
      value: data ? formatHours(data.profile.totalHours) : "—",
      icon: Clock3,
      tone: "text-accent-cyan",
    },
    {
      label: "Problems Solved",
      value: data ? data.profile.problemsSolved : "—",
      icon: CheckCircle,
      tone: "text-accent-green",
    },
  ];

  return (
    <div className="min-h-screen bg-bg-deep px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-100">
              Welcome back, {session?.user?.name?.split(" ")[0] ?? "learner"}
            </h1>
            <p className="text-sm text-slate-500">Here's your learning activity at a glance.</p>
          </div>
          <Link href="/workspace">
            <Button>Open Workspace</Button>
          </Link>
        </div>

        {error && (
          <p className="mb-6 rounded-lg border border-accent-coral/30 bg-accent-coral/10 p-3 text-sm text-accent-coral">
            {error}
          </p>
        )}

        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map(({ label, value, icon: Icon, tone }) => (
            <Card key={label} className="p-4">
              <Icon className={`mb-2 h-5 w-5 ${tone}`} />
              <div className="text-xl font-semibold text-slate-100">
                {isLoading ? "…" : value}
              </div>
              <div className="text-xs text-slate-500">{label}</div>
            </Card>
          ))}
        </div>

        <Card className="p-5">
          <h2 className="mb-4 text-sm font-semibold text-slate-300">Activity Heatmap</h2>
          {isLoading ? (
            <div className="h-24 animate-pulse rounded-lg bg-white/5" />
          ) : data ? (
            <ActivityHeatmap heatmap={data.heatmap} />
          ) : null}
        </Card>
      </div>
    </div>
  );
}
