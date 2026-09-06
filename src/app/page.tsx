"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Flame,
  ShieldCheck,
  SplitSquareHorizontal,
  Terminal,
  Sparkles,
  Timer,
  Swords,
  Github,
  Chrome,
  PlayCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const FEATURES = [
  {
    icon: SplitSquareHorizontal,
    title: "Gesture-locked split view",
    body: "The divider stays locked during normal use — double-tap or double-click to unlock, drag to resize, click away to lock it back in.",
    tone: "text-accent-cyan",
    glow: "from-accent-cyan/20",
  },
  {
    icon: Terminal,
    title: "Real compiler, not a toy",
    body: "Write C++, Python, JavaScript, TypeScript, or Java and actually run it — real compilation, real output, right next to the lecture.",
    tone: "text-accent-green",
    glow: "from-accent-green/20",
  },
  {
    icon: Sparkles,
    title: "AI that reads the room",
    body: "Ask for a summary, a debugging pass, or a boilerplate example — Gemini answers with the lecture's actual topic in mind.",
    tone: "text-accent-violet",
    glow: "from-accent-violet/20",
  },
  {
    icon: Swords,
    title: "Quiz Arena",
    body: "Instantly generated multiple-choice questions from whatever you just watched — because reading isn't the same as retaining.",
    tone: "text-accent-coral",
    glow: "from-accent-coral/20",
  },
  {
    icon: Timer,
    title: "Built-in focus timer",
    body: "A Pomodoro-style timer lives right in the workspace, so there's less reason to open a new tab and lose your place.",
    tone: "text-accent-cyan",
    glow: "from-accent-cyan/20",
  },
  {
    icon: Flame,
    title: "A streak worth keeping",
    body: "A 60-day heatmap and daily streak counter turn showing up into a habit you can see.",
    tone: "text-accent-green",
    glow: "from-accent-green/20",
  },
];

const STEPS = [
  { n: "01", title: "Paste a lecture", body: "Any YouTube URL or video ID loads instantly — no reload, no losing your place." },
  { n: "02", title: "Code beside it", body: "Split the screen, write real code in Monaco, and run it against a live compiler." },
  { n: "03", title: "Lock it in", body: "Summarize, quiz yourself, and let the streak tracker keep you honest tomorrow." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-bg-deep">
      {/* Ambient background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(600px circle at 15% 8%, rgba(139,92,246,0.16), transparent 60%), radial-gradient(700px circle at 90% 0%, rgba(6,182,212,0.16), transparent 55%), radial-gradient(500px circle at 50% 100%, rgba(16,185,129,0.10), transparent 55%)",
        }}
      />

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
        {/* ---------------- Hero ---------------- */}
        <section className="grid gap-10 py-16 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.5 }}>
            <Badge tone="violet" className="mb-5">
              <Sparkles className="h-3 w-3" /> Now with a real live compiler
            </Badge>
            <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-slate-100 sm:text-6xl">
              Watch the lecture.
              <br />
              Write the code.
              <br />
              <span className="bg-gradient-to-r from-accent-cyan via-accent-violet to-accent-coral bg-clip-text text-transparent">
                Same screen, zero context switch.
              </span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-slate-400">
              LectureCode Pro puts a video player and a real compiler side by
              side, then layers on AI summaries, instant quizzes, and a
              LeetCode-style streak tracker so practice actually sticks.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/register">
                <Button size="lg">
                  Start learning free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="ghost">
                  <PlayCircle className="h-4 w-4" />
                  I have an account
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-xs text-slate-600">
              Sign up with email in 30 seconds — no credit card, no verification email.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <Card className="overflow-hidden p-2 shadow-[0_20px_60px_-15px_rgba(6,182,212,0.25)]">
              <div className="relative overflow-hidden rounded-xl border border-white/10">
                {/* Fake browser chrome so the screenshot reads as a live app, not a raw capture */}
                <div className="flex items-center gap-1.5 bg-bg-card/80 px-3 py-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-accent-coral/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-accent-green/70" />
                  <span className="ml-2 text-[10px] text-slate-500">
                    localhost:3000/workspace
                  </span>
                </div>
                {/* Real product screenshots — swap the files in /public/screenshots
                    to update these whenever the UI changes. */}
                <img
                  src="/screenshots/workspace-video.png"
                  alt="LectureCode Pro workspace: lecture video playing beside the code editor"
                  className="w-full"
                />
              </div>
              <div className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-white/5 py-2 text-[11px] text-slate-500">
                <SplitSquareHorizontal className="h-3.5 w-3.5" />
                Double-tap the divider to resize
              </div>
            </Card>
          </motion.div>
        </section>

        {/* ---------------- Real product screenshot: compiler + console ---------------- */}
        <section className="pb-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-hidden p-2 shadow-[0_20px_60px_-15px_rgba(139,92,246,0.2)]">
              <div className="relative overflow-hidden rounded-xl border border-white/10">
                <div className="flex items-center gap-1.5 bg-bg-card/80 px-3 py-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-accent-coral/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-accent-green/70" />
                  <span className="ml-2 text-[10px] text-slate-500">
                    localhost:3000/workspace — Compiler tab
                  </span>
                </div>
                <img
                  src="/screenshots/workspace-compiler.png"
                  alt="LectureCode Pro's live Monaco code editor with Run and Analyze with AI"
                  className="w-full"
                />
              </div>
            </Card>
          </motion.div>
        </section>

        {/* ---------------- How it works ---------------- */}
        <section className="py-16">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4 }}
            className="mb-10 text-center text-2xl font-semibold text-slate-100"
          >
            Three steps, zero friction
          </motion.h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="h-full p-6">
                  <span className="text-3xl font-bold text-white/10">{step.n}</span>
                  <h3 className="mt-2 mb-1.5 text-sm font-semibold text-slate-100">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-500">{step.body}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ---------------- Features ---------------- */}
        <section className="py-16">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4 }}
            className="mb-10 text-center text-2xl font-semibold text-slate-100"
          >
            Everything a self-taught coder actually needs
          </motion.h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, body, tone, glow }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
              >
                <Card className="group relative h-full overflow-hidden p-6 transition-transform duration-200 hover:-translate-y-1">
                  <div
                    className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${glow} to-transparent opacity-60 blur-2xl transition-opacity duration-300 group-hover:opacity-100`}
                  />
                  <Icon className={`mb-3 h-5 w-5 ${tone}`} />
                  <h3 className="mb-1.5 text-sm font-semibold text-slate-100">{title}</h3>
                  <p className="text-sm leading-relaxed text-slate-500">{body}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ---------------- CTA ---------------- */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4 }}
          className="my-16"
        >
          <Card className="relative overflow-hidden p-10 text-center sm:p-14">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(400px circle at 50% -10%, rgba(6,182,212,0.18), transparent 60%)",
              }}
            />
            <h2 className="text-2xl font-semibold text-slate-100 sm:text-3xl">
              Your streak starts the moment you sign up.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-slate-400">
              No OAuth apps to configure, no card required — just a name,
              an email, and a password.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link href="/register">
                <Button size="lg">
                  Create your account
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="ghost" disabled>
                <Github className="h-4 w-4" /> GitHub sign-in (optional)
              </Button>
              <Button size="lg" variant="ghost" disabled>
                <Chrome className="h-4 w-4" /> Google sign-in (optional)
              </Button>
            </div>
          </Card>
        </motion.section>

        <section className="flex items-center justify-center gap-2 pb-16 text-xs text-slate-600">
          <ShieldCheck className="h-3.5 w-3.5" />
          Rate-limited AI, validated inputs, and session-protected routes by default.
        </section>
      </main>
    </div>
  );
}
