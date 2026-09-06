"use client";

import { useEffect, useState } from "react";
import { BookMarked, Clock, Layers, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import type { LectureSummaryResult } from "@/app/api/ai/summary/route";

interface LectureSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoTitle: string;
  videoId: string;
}

export function LectureSummaryModal({
  isOpen,
  onClose,
  videoTitle,
  videoId,
}: LectureSummaryModalProps) {
  const [summary, setSummary] = useState<LectureSummaryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !videoTitle) return;

    let cancelled = false;
    async function fetchSummary() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/ai/summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ videoTitle, videoId }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? "Failed to generate summary.");
        }
        const data = await res.json();
        if (!cancelled) setSummary(data.summary);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Something went wrong.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchSummary();
    return () => {
      cancelled = true;
    };
  }, [isOpen, videoTitle, videoId]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Lecture Summary"
      icon={<BookMarked className="h-5 w-5 text-accent-cyan" />}
    >
      {isLoading && (
        <div className="flex items-center justify-center gap-2 py-12 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          Summarizing lecture content...
        </div>
      )}

      {error && !isLoading && (
        <p className="rounded-lg border border-accent-coral/30 bg-accent-coral/10 p-3 text-sm text-accent-coral">
          {error}
        </p>
      )}

      {summary && !isLoading && (
        <div className="space-y-6">
          <section>
            <h3 className="mb-2 text-sm font-semibold text-slate-300">
              Key Takeaways
            </h3>
            <ul className="space-y-2">
              {summary.keyTakeaways.map((point, i) => (
                <li
                  key={i}
                  className="flex gap-2 rounded-lg bg-white/5 p-3 text-sm text-slate-200"
                >
                  <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent-cyan" />
                  {point}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-300">
              <Layers className="h-4 w-4 text-accent-violet" />
              Architectural Rules
            </h3>
            <ul className="space-y-2">
              {summary.architecturalRules.map((rule, i) => (
                <li
                  key={i}
                  className="rounded-lg border border-accent-violet/20 bg-accent-violet/5 p-3 text-sm text-slate-200"
                >
                  {rule}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-300">
              <Clock className="h-4 w-4 text-accent-green" />
              Complexity
            </h3>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge tone="green">Time: {summary.complexity.time}</Badge>
              <Badge tone="green">Space: {summary.complexity.space}</Badge>
            </div>
            <p className="text-sm text-slate-400">{summary.complexity.notes}</p>
          </section>
        </div>
      )}
    </Modal>
  );
}
