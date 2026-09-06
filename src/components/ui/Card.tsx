import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "glass-card rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.3)]",
        className
      )}
      {...props}
    />
  );
}
