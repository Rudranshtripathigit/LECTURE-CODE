"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Timer as TimerIcon, Coffee, Brain } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

// ----------------------------------------------------------------------
// FEATURE: Focus Timer (Pomodoro-style)
// A simple work/break countdown that lives in the workspace so students
// have a built-in reason not to tab away. Completed work sessions are
// logged to /api/user/progress as study minutes, feeding the same
// streak + total-hours numbers shown on the dashboard.
// ----------------------------------------------------------------------

const WORK_MINUTES = 25;
const BREAK_MINUTES = 5;

type Mode = "work" | "break";

interface FocusTimerProps {
  videoId: string;
  videoTitle: string;
}

export function FocusTimer({ videoId, videoTitle }: FocusTimerProps) {
  const [mode, setMode] = useState<Mode>("work");
  const [secondsLeft, setSecondsLeft] = useState(WORK_MINUTES * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSeconds = (mode === "work" ? WORK_MINUTES : BREAK_MINUTES) * 60;
  const progress = 1 - secondsLeft / totalSeconds;

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          handleSessionComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, mode]);

  async function handleSessionComplete() {
    setIsRunning(false);

    if (mode === "work") {
      setCompletedSessions((c) => c + 1);
      // Log the completed focus block as study time, tied to whatever
      // lecture is currently loaded (falls back to a generic label).
      fetch("/api/user/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId: videoId || "focus-session",
          videoTitle: videoTitle || "Focus session",
          checklists: {},
          minutesWatched: WORK_MINUTES,
        }),
      }).catch(() => {
        /* Non-blocking: a failed log shouldn't interrupt the timer UX. */
      });

      setMode("break");
      setSecondsLeft(BREAK_MINUTES * 60);
    } else {
      setMode("work");
      setSecondsLeft(WORK_MINUTES * 60);
    }
  }

  function handleReset() {
    setIsRunning(false);
    setMode("work");
    setSecondsLeft(WORK_MINUTES * 60);
  }

  const minutes = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");

  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 p-6">
      <Badge tone={mode === "work" ? "cyan" : "green"} className="text-xs">
        {mode === "work" ? (
          <>
            <Brain className="h-3 w-3" /> Focus block
          </>
        ) : (
          <>
            <Coffee className="h-3 w-3" /> Break time
          </>
        )}
      </Badge>

      <div className="relative flex h-56 w-56 items-center justify-center">
        <svg width="224" height="224" viewBox="0 0 224 224" className="-rotate-90">
          <circle
            cx="112"
            cy="112"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="10"
          />
          <circle
            cx="112"
            cy="112"
            r={radius}
            fill="none"
            stroke={mode === "work" ? "#06b6d4" : "#10b981"}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className={cn(
              "transition-[stroke-dashoffset] duration-1000 ease-linear",
              isRunning && mode === "work" && "drop-shadow-[0_0_10px_rgba(6,182,212,0.6)]",
              isRunning && mode === "break" && "drop-shadow-[0_0_10px_rgba(16,185,129,0.6)]"
            )}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="font-mono text-4xl font-semibold text-slate-100">
            {minutes}:{seconds}
          </span>
          <span className="mt-1 text-[11px] text-slate-500">
            {mode === "work" ? "stay focused" : "stretch, hydrate, breathe"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          size="lg"
          variant={mode === "work" ? "primary" : "secondary"}
          onClick={() => setIsRunning((r) => !r)}
        >
          {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isRunning ? "Pause" : "Start"}
        </Button>
        <Button size="lg" variant="ghost" onClick={handleReset} aria-label="Reset timer">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-slate-500">
        <TimerIcon className="h-3.5 w-3.5" />
        {completedSessions} focus {completedSessions === 1 ? "block" : "blocks"} completed today
      </div>
    </div>
  );
}
