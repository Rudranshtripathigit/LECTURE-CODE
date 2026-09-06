import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "cyan" | "violet" | "green" | "coral" | "neutral";

const TONE_STYLES: Record<Tone, string> = {
  cyan: "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/30",
  violet: "bg-accent-violet/10 text-accent-violet border-accent-violet/30",
  green: "bg-accent-green/10 text-accent-green border-accent-green/30",
  coral: "bg-accent-coral/10 text-accent-coral border-accent-coral/30",
  neutral: "bg-white/5 text-slate-300 border-white/10",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium",
        TONE_STYLES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
