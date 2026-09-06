"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
}

const VARIANT_STYLES: Record<Variant, string> = {
  primary:
    "bg-accent-cyan/90 text-bg-deep hover:bg-accent-cyan shadow-[0_0_20px_-4px_rgba(6,182,212,0.6)]",
  secondary:
    "bg-accent-violet/90 text-white hover:bg-accent-violet shadow-[0_0_20px_-4px_rgba(139,92,246,0.55)]",
  ghost:
    "bg-white/5 text-slate-200 hover:bg-white/10 border border-white/10",
  danger:
    "bg-accent-coral/90 text-white hover:bg-accent-coral shadow-[0_0_20px_-4px_rgba(244,63,94,0.55)]",
};

const SIZE_STYLES: Record<Size, string> = {
  sm: "text-xs px-3 py-1.5 gap-1.5 rounded-lg",
  md: "text-sm px-4 py-2 gap-2 rounded-xl",
  lg: "text-base px-6 py-3 gap-2.5 rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", isLoading, disabled, children, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-150",
          "focus-ring disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]",
          VARIANT_STYLES[variant],
          SIZE_STYLES[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
