import Link from "next/link";
import {
  ArrowRight,
  Flame,
  MonitorPlay,
  ShieldCheck,
  SplitSquareHorizontal,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const FEATURES = [
  {
    icon: SplitSquareHorizontal,
    title: "Gesture-locked split view",
    body: "The divider stays locked during normal use — double-tap or double-click to unlock, drag to resize, click away to lock it back in.",
    tone: "text-accent-cyan",
  },
  {
    icon: MonitorPlay,
    title: "Any lecture, one paste",
    body: "Drop in a YouTube URL or video ID and the player updates instantly — no reloads, no lost place in your code.",
    tone: "text-accent-coral",
  },
  {
    icon: Terminal,
    title: "AI that reads the room",
    body: "Ask for a summary, a debugging pass, or a boilerplate example — Gemini answers with the lecture's actual topic in mind.",
    tone: "text-accent-violet",
  },
  {
    icon: Flame,
    title: "A streak worth keeping",
    body: "A 60-day heatmap and daily streak counter turn showing up into a habit you can see.",
    tone: "text-accent-green",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-deep">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5">
          <div className="h-2.5 w-2.5 rounded-full bg-accent-cyan shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
          <span className="text-sm font-semibold tracking-tight text-slate-100">
            LectureCode Pro
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-slate-400 hover:text-slate-200">
            Sign in
          </Link>
          <Link href="/register">
            <Button size="sm">Get started</Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6">
        <section className="grid gap-10 py-16 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-slate-100 sm:text-5xl">
              Watch the lecture.
              <br />
              Write the code.
              <br />
              <span className="text-accent-cyan">Same screen, no context switch.</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-slate-400">
              LectureCode Pro puts a video player and a real compiler side by
              side, then layers on AI summaries, debugging help, and a
              LeetCode-style streak tracker so practice actually sticks.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <Link href="/register">
                <Button size="lg">
                  Start learning free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="ghost">
                  I have an account
                </Button>
              </Link>
            </div>
          </div>

          <Card className="p-3">
            <div className="grid grid-cols-2 gap-2 overflow-hidden rounded-xl">
              <div className="aspect-video rounded-lg bg-gradient-to-br from-accent-coral/20 to-bg-panel flex items-center justify-center">
                <MonitorPlay className="h-8 w-8 text-accent-coral/70" />
              </div>
              <div className="aspect-video rounded-lg bg-gradient-to-br from-accent-cyan/20 to-bg-panel flex items-center justify-center">
                <Terminal className="h-8 w-8 text-accent-cyan/70" />
              </div>
            </div>
            <div className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-white/5 py-2 text-[11px] text-slate-500">
              <SplitSquareHorizontal className="h-3.5 w-3.5" />
              Double-tap the divider to resize
            </div>
          </Card>
        </section>

        <section className="grid gap-4 pb-24 sm:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, body, tone }) => (
            <Card key={title} className="p-6">
              <Icon className={`mb-3 h-5 w-5 ${tone}`} />
              <h3 className="mb-1.5 text-sm font-semibold text-slate-100">{title}</h3>
              <p className="text-sm leading-relaxed text-slate-500">{body}</p>
            </Card>
          ))}
        </section>

        <section className="flex items-center justify-center gap-2 pb-16 text-xs text-slate-600">
          <ShieldCheck className="h-3.5 w-3.5" />
          Rate-limited AI, validated inputs, and session-protected routes by default.
        </section>
      </main>
    </div>
  );
}
