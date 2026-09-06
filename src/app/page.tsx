"use client";

import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Brain,
  CheckCircle2,
  ChevronDown,
  Code2,
  Flame,
  Github,
  GraduationCap,
  Layers3,
  Linkedin,
  LockKeyhole,
  Play,
  PlayCircle,
  Rocket,
  ShieldCheck,
  Sparkles,
  SplitSquareHorizontal,
  Swords,
  Terminal,
  Timer,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

/* -------------------------------------------------------------------------- */
/* DATA                                                                       */
/* -------------------------------------------------------------------------- */

const FEATURES = [
  {
    icon: SplitSquareHorizontal,
    title: "Gesture-Locked Workspace",
    body: "Keep the lecture and coding environment together. Double-click or double-tap the divider to unlock resizing, then lock it again with a single click.",
    tone: "text-accent-cyan",
    glow: "from-accent-cyan/30",
    number: "01",
  },
  {
    icon: Terminal,
    title: "Real Code Execution",
    body: "Write and execute C++, Python, JavaScript, TypeScript, or Java beside the lecture instead of switching between multiple tools.",
    tone: "text-accent-green",
    glow: "from-accent-green/30",
    number: "02",
  },
  {
    icon: Brain,
    title: "AI Learning Assistant",
    body: "Generate lecture summaries, analyze code, explain concepts, and get context-aware assistance powered by Gemini.",
    tone: "text-accent-violet",
    glow: "from-accent-violet/30",
    number: "03",
  },
  {
    icon: Swords,
    title: "Quiz Arena",
    body: "Turn a lecture into instant multiple-choice questions so you can test whether you actually understood what you watched.",
    tone: "text-accent-coral",
    glow: "from-accent-coral/30",
    number: "04",
  },
  {
    icon: Timer,
    title: "Focus Timer",
    body: "Stay inside the workspace with a built-in focus timer designed to reduce distractions and keep your learning session moving.",
    tone: "text-accent-cyan",
    glow: "from-accent-cyan/30",
    number: "05",
  },
  {
    icon: Flame,
    title: "Learning Streaks",
    body: "Track your consistency with activity history, streaks, progress and a contribution-style learning heatmap.",
    tone: "text-accent-green",
    glow: "from-accent-green/30",
    number: "06",
  },
];

const STEPS = [
  {
    n: "01",
    icon: Play,
    title: "Choose a lecture",
    body: "Load a YouTube lecture directly into the learning workspace.",
  },
  {
    n: "02",
    icon: Code2,
    title: "Code alongside it",
    body: "Pause, experiment, write code and execute it without leaving the lecture.",
  },
  {
    n: "03",
    icon: Sparkles,
    title: "Understand deeper",
    body: "Use AI summaries, debugging, quizzes and progress tracking to reinforce the lesson.",
  },
];

const TECH = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Monaco Editor",
  "PostgreSQL",
  "Prisma",
  "Redis",
  "Gemini AI",
  "Docker",
];

const LEARNING_POINTS = [
  "Lecture-first learning",
  "Hands-on coding",
  "AI-assisted understanding",
  "Instant knowledge checks",
  "Progress & streak tracking",
  "Focused learning sessions",
];

/* -------------------------------------------------------------------------- */
/* MOTION                                                                     */
/* -------------------------------------------------------------------------- */

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const fadeIn = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
};

/* -------------------------------------------------------------------------- */
/* SMALL COMPONENTS                                                           */
/* -------------------------------------------------------------------------- */

function FloatingOrb({
  className = "",
}: {
  className?: string;
}) {
  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
      animate={{
        x: [0, 18, -12, 0],
        y: [0, -18, 14, 0],
        scale: [1, 1.06, 0.96, 1],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

function SectionLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-accent-cyan">
      <span className="h-px w-8 bg-accent-cyan/40" />
      {children}
      <span className="h-px w-8 bg-accent-cyan/40" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function LandingPage() {
  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 25,
    restDelta: 0.001,
  });

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-bg-deep text-slate-100">
      {/* ------------------------------------------------------------------ */}
      {/* SCROLL PROGRESS                                                     */}
      {/* ------------------------------------------------------------------ */}

      <motion.div
        className="fixed left-0 right-0 top-0 z-[100] h-[2px] origin-left bg-gradient-to-r from-accent-cyan via-accent-violet to-accent-coral"
        style={{ scaleX }}
      />

      {/* ------------------------------------------------------------------ */}
      {/* AMBIENT BACKGROUND                                                  */}
      {/* ------------------------------------------------------------------ */}

      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20 overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.07),transparent_35%)]" />

        <FloatingOrb className="left-[6%] top-[10%] h-64 w-64 bg-accent-violet/10" />

        <FloatingOrb className="right-[5%] top-[8%] h-80 w-80 bg-accent-cyan/10" />

        <FloatingOrb className="left-[35%] top-[55%] h-72 w-72 bg-accent-green/5" />

        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage:
              "linear-gradient(to bottom, black 0%, transparent 80%)",
          }}
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* NAVBAR                                                              */}
      {/* ------------------------------------------------------------------ */}

      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-bg-deep/70 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            href="/"
            className="group flex items-center gap-3"
          >
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-accent-cyan/25 bg-accent-cyan/10"
            >
              <Code2 className="h-4 w-4 text-accent-cyan" />

              <span className="absolute inset-0 rounded-xl bg-accent-cyan/10 blur-md" />
            </motion.div>

            <div>
              <div className="text-sm font-bold tracking-[0.18em] text-white">
                LECTURE-CODE
              </div>

              <div className="text-[9px] uppercase tracking-[0.22em] text-slate-500">
                Learn • Code • Improve
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm text-slate-400 md:flex">
            <a
              href="#features"
              className="transition hover:text-white"
            >
              Features
            </a>

            <a
              href="#workflow"
              className="transition hover:text-white"
            >
              How it works
            </a>

            <a
              href="#developer"
              className="transition hover:text-white"
            >
              Developer
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="hidden text-sm text-slate-400 transition hover:text-white sm:block"
            >
              Sign in
            </Link>

            <Link href="/register">
              <Button size="sm">
                Start learning
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative">
        {/* ---------------------------------------------------------------- */}
        {/* HERO                                                              */}
        {/* ---------------------------------------------------------------- */}

        <section className="relative mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-8 sm:pt-24 lg:pb-28 lg:pt-28">
          <div className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr]">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              transition={{ duration: 0.75 }}
            >
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <Badge tone="violet">
                  <Sparkles className="h-3 w-3" />
                  AI-powered learning environment
                </Badge>

                <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-green" />
                  Built for active learning
                </span>
              </div>

              <h1 className="max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
                Stop watching code.
                <br />

                <span className="bg-gradient-to-r from-accent-cyan via-accent-violet to-accent-coral bg-clip-text text-transparent">
                  Start understanding it.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
                <strong className="font-medium text-slate-200">
                  LECTURE-CODE
                </strong>{" "}
                brings lectures, real coding, AI assistance, quizzes and
                learning analytics into one focused workspace—so learning
                becomes something you actively do.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/register">
                  <Button size="lg">
                    Start learning free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <Link href="/login">
                  <Button
                    size="lg"
                    variant="ghost"
                  >
                    <PlayCircle className="h-4 w-4" />
                    Explore workspace
                  </Button>
                </Link>
              </div>

              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent-green" />
                  Email signup
                </span>

                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent-green" />
                  Real compiler
                </span>

                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-accent-green" />
                  AI assistance
                </span>
              </div>
            </motion.div>

            {/* Hero product visual */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.94,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              transition={{
                duration: 0.9,
                delay: 0.15,
              }}
              className="relative"
            >
              <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-r from-accent-cyan/10 via-accent-violet/10 to-accent-coral/10 blur-3xl" />

              <Card className="relative overflow-hidden rounded-[1.5rem] border-white/10 p-2 shadow-[0_30px_100px_-25px_rgba(6,182,212,0.3)]">
                <div className="overflow-hidden rounded-[1.1rem] border border-white/10 bg-black/20">
                  <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.035] px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-accent-coral/70" />
                      <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                      <span className="h-2.5 w-2.5 rounded-full bg-accent-green/70" />
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <span className="hidden sm:block">
                        lecture-code / workspace
                      </span>

                      <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
                    </div>
                  </div>

                  <div className="relative">
                    <img
                      src="/screenshots/workspace-video.png"
                      alt="LECTURE-CODE workspace with lecture video and code editor"
                      className="block w-full"
                    />

                    <div className="absolute inset-x-4 bottom-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/65 px-4 py-3 backdrop-blur-xl">
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <SplitSquareHorizontal className="h-4 w-4 text-accent-cyan" />
                        Interactive split workspace
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-slate-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
                        LIVE
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Floating stat cards */}

              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-5 -left-4 hidden rounded-2xl border border-white/10 bg-bg-card/90 px-4 py-3 shadow-xl backdrop-blur-xl sm:block"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-accent-green/10 p-2">
                    <Flame className="h-4 w-4 text-accent-green" />
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-500">
                      Learning streak
                    </div>

                    <div className="text-sm font-semibold text-white">
                      Keep building 🔥
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{
                  y: [0, 8, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -right-4 top-1/3 hidden rounded-2xl border border-white/10 bg-bg-card/90 px-4 py-3 shadow-xl backdrop-blur-xl lg:block"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-accent-violet/10 p-2">
                    <Sparkles className="h-4 w-4 text-accent-violet" />
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-500">
                      AI assistant
                    </div>

                    <div className="text-sm font-semibold text-white">
                      Context aware
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Hero trust strip */}

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-16 grid grid-cols-2 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] sm:grid-cols-4"
          >
            {[
              ["01", "Lecture", "Watch with context"],
              ["02", "Compiler", "Execute real code"],
              ["03", "AI", "Understand faster"],
              ["04", "Analytics", "Track your growth"],
            ].map(([n, title, body], index) => (
              <div
                key={title}
                className={`px-5 py-5 ${
                  index > 1 ? "border-t sm:border-t-0" : ""
                } ${
                  index % 2 !== 0
                    ? "border-l border-white/[0.06]"
                    : ""
                } ${
                  index === 2
                    ? "sm:border-l"
                    : ""
                }`}
              >
                <div className="text-[10px] font-semibold tracking-[0.2em] text-accent-cyan">
                  {n}
                </div>

                <div className="mt-1 text-sm font-semibold text-white">
                  {title}
                </div>

                <div className="mt-1 text-xs text-slate-500">
                  {body}
                </div>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* PRODUCT PHILOSOPHY                                                */}
        {/* ---------------------------------------------------------------- */}

        <section className="border-y border-white/[0.05] bg-white/[0.012]">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:py-24">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              transition={{ duration: 0.65 }}
            >
              <SectionLabel>The problem</SectionLabel>

              <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Learning shouldn't feel like
                <span className="text-slate-500">
                  {" "}
                  five browser tabs.
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-400">
                A lecture on one screen. Documentation on another. A compiler
                somewhere else. AI in another tab. Notes lost somewhere in the
                middle.
              </p>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
                LECTURE-CODE is designed around one simple idea:
                <span className="font-semibold text-accent-cyan">
                  {" "}
                  reduce context switching and increase active practice.
                </span>
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              transition={{
                duration: 0.65,
                delay: 0.1,
              }}
              className="grid gap-3 sm:grid-cols-2"
            >
              {LEARNING_POINTS.map((point, index) => (
                <Card
                  key={point}
                  className="group relative overflow-hidden p-5"
                >
                  <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-accent-cyan/5 blur-2xl transition group-hover:bg-accent-cyan/10" />

                  <div className="relative flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03]">
                      <CheckCircle2 className="h-4 w-4 text-accent-cyan" />
                    </div>

                    <div>
                      <div className="text-xs text-slate-500">
                        0{index + 1}
                      </div>

                      <div className="mt-1 text-sm font-medium text-white">
                        {point}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* WORKFLOW                                                          */}
        {/* ---------------------------------------------------------------- */}

        <section
          id="workflow"
          className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32"
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center"
          >
              Meet the developer
                    <span className="text-slate-500">
                      {" "}
                      behind LECTURE-CODE.
                    </span>
                  </h2>

                  <p className="mt-6 text-base leading-8 text-slate-400">
                    I’m{" "}
                    <span className="font-semibold text-white">
                      Rudransh Tripathi
                    </span>
                    , a Computer Science Engineering student at PSIT Kanpur,
                    focused on building a strong foundation in Data Structures
                    & Algorithms, full-stack development, AI and software
                    engineering.
                  </p>

                  <p className="mt-5 text-sm leading-8 text-slate-400">
                    I enjoy taking an idea from interface to backend,
                    database, AI integration and deployment—and learning by
                    actually building, breaking, debugging and improving.
                  </p>

                  <div className="mt-7 flex flex-wrap gap-2">
                    {[
                      "C/C++",
                      "DSA",
                      "Full-Stack Development",
                      "AI",
                      "Problem Solving",
                      "System Design",
                    ].map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-[11px] text-slate-400"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <a
                      href="https://www.linkedin.com/in/rudransh-tripathi-3856a1332/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button size="sm">
                        <Linkedin className="h-4 w-4" />
                        LinkedIn
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Button>
                    </a>

                    <a
                      href="https://github.com/Rudranshtripathigit"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Button
                        size="sm"
                        variant="ghost"
                      >
                        <Github className="h-4 w-4" />
                        GitHub
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Button>
                    </a>
                  </div>

            <SectionLabel>How it works</SectionLabel>

            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              One workspace.
              <br />
              <span className="text-slate-500">
                Three simple steps.
              </span>
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-400 sm:text-base">
              Move from consuming a lecture to actively proving that you
              understood it.
            </p>
          </motion.div>

          <div className="relative mt-14 grid gap-5 md:grid-cols-3">
            <div className="pointer-events-none absolute left-[16%] right-[16%] top-12 hidden h-px bg-gradient-to-r from-transparent via-white/10 to-transparent md:block" />

            {STEPS.map((step, index) => {
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.n}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-80px" }}
                  variants={fadeUp}
                  transition={{
                    duration: 0.55,
                    delay: index * 0.1,
                  }}
                >
                  <Card className="group relative h-full p-7">
                    <div className="relative z-10 flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accent-cyan/15 bg-accent-cyan/5">
                        <Icon className="h-5 w-5 text-accent-cyan" />
                      </div>

                      <span className="text-4xl font-bold tracking-tight text-white/[0.06]">
                        {step.n}
                      </span>
                    </div>

                    <h3 className="mt-8 text-lg font-semibold text-white">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-slate-500">
                      {step.body}
                    </p>

                    <div className="mt-7 flex items-center gap-2 text-xs font-medium text-accent-cyan opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      Continue
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* PRODUCT SCREENSHOT                                                */}
        {/* ---------------------------------------------------------------- */}

        <section className="mx-auto max-w-7xl px-5 sm:px-8">
          <motion.div
            initial={{
              opacity: 0,
              y: 35,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              margin: "-80px",
            }}
            transition={{
              duration: 0.75,
            }}
          >
            <Card className="overflow-hidden rounded-[1.5rem] p-2 shadow-[0_35px_100px_-30px_rgba(139,92,246,0.28)]">
              <div className="overflow-hidden rounded-[1.15rem] border border-white/10">
                <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-accent-coral/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-accent-green/70" />
                  </div>

                  <div className="text-[10px] text-slate-500">
                    LECTURE-CODE / COMPILER
                  </div>

                  <div className="hidden items-center gap-2 text-[10px] text-slate-500 sm:flex">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
                    Ready
                  </div>
                </div>

                <img
                  src="/screenshots/workspace-compiler.png"
                  alt="LECTURE-CODE compiler and code editor"
                  className="block w-full"
                />
              </div>
            </Card>
          </motion.div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* FEATURES                                                          */}
        {/* ---------------------------------------------------------------- */}

        <section
          id="features"
          className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32"
        >
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-2xl text-center"
          >
            <SectionLabel>Core capabilities</SectionLabel>

            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
              Everything you need to
              <span className="text-slate-500">
                {" "}
                learn by doing.
              </span>
            </h2>

            <p className="mt-5 text-sm leading-7 text-slate-400 sm:text-base">
              Each feature is designed around the same goal: make the next
              learning action obvious.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(
              (
                {
                  icon: Icon,
                  title,
                  body,
                  tone,
                  glow,
                  number,
                },
                index
              ) => (
                <motion.div
                  key={title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{
                    once: true,
                    margin: "-70px",
                  }}
                  variants={fadeUp}
                  transition={{
                    duration: 0.5,
                    delay: (index % 3) * 0.08,
                  }}
                >
                  <Card className="group relative h-full overflow-hidden p-7">
                    <div
                      aria-hidden
                      className={`pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gradient-to-br ${glow} to-transparent opacity-50 blur-3xl transition-all duration-500 group-hover:scale-125 group-hover:opacity-90`}
                    />

                    <div className="relative z-10 flex items-start justify-between">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.025] ${tone}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <span className="text-xs font-semibold text-white/10">
                        {number}
                      </span>
                    </div>

                    <h3 className="relative z-10 mt-7 text-base font-semibold text-white">
                      {title}
                    </h3>

                    <p className="relative z-10 mt-3 text-sm leading-7 text-slate-500">
                      {body}
                    </p>

                    <div className="relative z-10 mt-7 h-px w-10 bg-white/10 transition-all duration-300 group-hover:w-20 group-hover:bg-accent-cyan/50" />
                  </Card>
                </motion.div>
              )
            )}
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* AI SECTION                                                        */}
        {/* ---------------------------------------------------------------- */}

        <section className="relative overflow-hidden border-y border-white/[0.05] bg-white/[0.012]">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.14),transparent_45%)]"
          />

          <div className="relative mx-auto grid max-w-7xl gap-14 px-5 py-24 sm:px-8 lg:grid-cols-2 lg:items-center lg:py-32">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              transition={{ duration: 0.65 }}
            >
              <SectionLabel>Intelligent learning</SectionLabel>

              <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                AI that helps you
                <br />
                <span className="bg-gradient-to-r from-accent-violet to-accent-cyan bg-clip-text text-transparent">
                  understand—not skip.
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-sm leading-8 text-slate-400 sm:text-base">
                Use AI where it matters: when a concept is unclear, when code
                breaks, when you need a summary, or when you want to test what
                you just learned.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  ["Lecture summaries", "Condense concepts into useful revision material."],
                  ["Code analysis", "Understand bugs, complexity and better approaches."],
                  ["Quiz generation", "Turn the material you watched into active recall."],
                ].map(([title, body]) => (
                  <div
                    key={title}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-accent-violet" />

                    <div>
                      <div className="text-sm font-medium text-white">
                        {title}
                      </div>

                      <div className="mt-1 text-xs leading-6 text-slate-500">
                        {body}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
              }}
              viewport={{
                once: true,
                margin: "-100px",
              }}
              transition={{
                duration: 0.75,
                delay: 0.1,
              }}
              className="relative"
            >
              <div className="absolute -inset-8 rounded-full bg-accent-violet/10 blur-3xl" />

              <Card className="relative overflow-hidden p-6">
                <div className="flex items-center justify-between border-b border-white/[0.07] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-violet/10">
                      <Sparkles className="h-5 w-5 text-accent-violet" />
                    </div>

                    <div>
                      <div className="text-sm font-semibold text-white">
                        AI Learning Assistant
                      </div>

                      <div className="text-[10px] text-slate-500">
                        Powered by Gemini
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-accent-green">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-green" />
                    ONLINE
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4">
                    <div className="mb-2 text-[10px] uppercase tracking-[0.18em] text-slate-600">
                      You
                    </div>

                    <p className="text-sm leading-7 text-slate-300">
                      Explain why this algorithm has O(n log n) time complexity
                      in simple terms.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-accent-violet/10 bg-accent-violet/[0.035] p-4">
                    <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-accent-violet">
                      <Sparkles className="h-3 w-3" />
                      AI
                    </div>

                    <p className="text-sm leading-7 text-slate-300">
                      Think of it as repeatedly dividing the problem into
                      smaller pieces, solving each part, and combining the
                      results efficiently...
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {["Summary", "Analyze", "Quiz"].map((item) => (
                      <div
                        key={item}
                        className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-3 text-center text-xs text-slate-500"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* TECH STACK                                                        */}
        {/* ---------------------------------------------------------------- */}

        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <SectionLabel>Built with modern technology</SectionLabel>

            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              A serious learning product
              <span className="text-slate-500">
                {" "}
                needs a serious stack.
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            transition={{
              duration: 0.7,
              delay: 0.1,
            }}
            className="mt-12 flex flex-wrap justify-center gap-2"
          >
            {TECH.map((item) => (
              <div
                key={item}
                className="rounded-full border border-white/[0.08] bg-white/[0.025] px-4 py-2 text-xs text-slate-400 transition hover:border-accent-cyan/20 hover:text-slate-200"
              >
                {item}
              </div>
            ))}
          </motion.div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* DEVELOPER SECTION                                                 */}
        {/* ---------------------------------------------------------------- */}

        <section
          id="developer"
          className="border-y border-white/[0.05] bg-white/[0.012]"
        >
          <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeUp}
                transition={{ duration: 0.65 }}
              >
                <SectionLabel>The developer</SectionLabel>

                <div className="relative mx-auto max-w-sm lg:mx-0">
                  <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-accent-cyan/10 via-accent-violet/10 to-transparent blur-3xl" />

                  <Card className="relative overflow-hidden p-2">
                    <div className="relative overflow-hidden rounded-[1.1rem] bg-gradient-to-br from-slate-900 to-slate-950">
                      <div className="flex aspect-[4/5] items-end bg-[radial-gradient(circle_at_50%_30%,rgba(6,182,212,0.15),transparent_38%)]">
                        <div className="w-full p-7">
                          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent-cyan/15 bg-accent-cyan/5 px-3 py-1.5 text-[10px] text-accent-cyan">
                            <GraduationCap className="h-3.5 w-3.5" />
                            CSE • Developer
                          </div>

                          <h3 className="text-3xl font-semibold tracking-tight text-white">
                            Rudransh
                            <br />
                            Tripathi
                          </h3>

                          <p className="mt-3 text-xs leading-6 text-slate-500">
                            Building practical software at the intersection
                            of development, problem solving and AI.
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </motion.div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={fadeUp}
                transition={{
                  duration: 0.65,
                  delay: 0.12,
                }}
              >
                <div className="max-w-2xl">
                  <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                  
                  <div className="mt-10 grid gap-3 sm:grid-cols-3">
                    {[
                      {
                        icon: Code2,
                        title: "Build",
                        body: "Turn ideas into products",
                      },
                      {
                        icon: Brain,
                        title: "Learn",
                        body: "Understand the fundamentals",
                      },
                      {
                        icon: Rocket,
                        title: "Ship",
                        body: "Move from code to impact",
                      },
                    ].map((item) => {
                      const Icon = item.icon;

                      return (
                        <Card
                          key={item.title}
                          className="p-4"
                        >
                          <Icon className="h-4 w-4 text-accent-cyan" />

                          <div className="mt-3 text-sm font-semibold text-white">
                            {item.title}
                          </div>

                          <div className="mt-1 text-xs leading-5 text-slate-500">
                            {item.body}
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* SECURITY / ENGINEERING                                            */}
        {/* ---------------------------------------------------------------- */}

        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-28">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: LockKeyhole,
                title: "Session protected",
                body: "Authentication-aware learning routes.",
              },
              {
                icon: ShieldCheck,
                title: "Validated inputs",
                body: "Protected AI request flows.",
              },
              {
                icon: Layers3,
                title: "Scalable foundation",
                body: "Database, cache and API layers.",
              },
              {
                icon: Zap,
                title: "Fast workflow",
                body: "Everything designed around focus.",
              },
            ].map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{
                    once: true,
                    margin: "-60px",
                  }}
                  variants={fadeUp}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.06,
                  }}
                >
                  <Card className="h-full p-5">
                    <Icon className="h-4 w-4 text-accent-cyan" />

                    <h3 className="mt-4 text-sm font-semibold text-white">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-xs leading-6 text-slate-500">
                      {item.body}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* FINAL CTA                                                         */}
        {/* ---------------------------------------------------------------- */}

        <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:pb-24">
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              margin: "-80px",
            }}
            transition={{
              duration: 0.65,
            }}
          >
            <Card className="relative overflow-hidden rounded-[2rem] p-8 text-center sm:p-14 lg:p-20">
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-cyan/15 blur-3xl"
              />

              <div className="relative">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-accent-cyan/20 bg-accent-cyan/5">
                  <Trophy className="h-6 w-6 text-accent-cyan" />
                </div>

                <h2 className="mx-auto mt-7 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                  Don't just finish the lecture.
                  <br />
                  <span className="bg-gradient-to-r from-accent-cyan via-accent-violet to-accent-coral bg-clip-text text-transparent">
                    Build the skill.
                  </span>
                </h2>

                <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-400">
                  Watch. Code. Debug. Practice. Track your progress. Repeat.
                </p>

                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Link href="/register">
                    <Button size="lg">
                      Create your account
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>

                  <Link href="/login">
                    <Button
                      size="lg"
                      variant="ghost"
                    >
                      <PlayCircle className="h-4 w-4" />
                      Enter workspace
                    </Button>
                  </Link>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-[11px] text-slate-600">
                  <span className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5" />
                    Built for focused learners
                  </span>

                  <span className="hidden h-1 w-1 rounded-full bg-slate-700 sm:block" />

                  <span className="flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Secure by design
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        </section>
      </main>

      {/* ------------------------------------------------------------------ */}
      {/* FOOTER                                                              */}
      {/* ------------------------------------------------------------------ */}

      <footer className="border-t border-white/[0.05]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-accent-cyan shadow-[0_0_12px_rgba(6,182,212,0.8)]" />

              <span className="text-xs font-semibold tracking-[0.18em] text-white">
                LECTURE-CODE
              </span>
            </div>

            <p className="mt-2 text-xs text-slate-600">
              Learn by watching less. Build by doing more.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs text-slate-600">
            <span>Built by Rudransh Tripathi</span>

            <Link
              href="/login"
              className="transition hover:text-slate-300"
            >
              Sign in
            </Link>

            <Link
              href="/register"
              className="transition hover:text-slate-300"
            >
              Get started
            </Link>
          </div>
        </div>
      </footer>

      {/* Floating back-to-top hint */}

      <motion.a
        href="#"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          delay: 1.2,
        }}
        className="fixed bottom-5 right-5 z-40 hidden h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-bg-card/80 text-slate-500 backdrop-blur-xl transition hover:text-white md:flex"
        aria-label="Back to top"
      >
        <ChevronDown className="h-4 w-4 rotate-180" />
      </motion.a>
    </div>
  );
}