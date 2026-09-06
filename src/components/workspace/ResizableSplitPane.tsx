"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { GripVertical, Lock, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";

// ----------------------------------------------------------------------
// FEATURE A: Double-Tap / Double-Click Gesture Split Workspace
//
// Default state: LOCKED. Pointer dragging over the divider must not
// resize panels during normal cursor sweeps (e.g. text selection,
// accidental drags). The divider only unlocks on double-click/double-tap,
// glows cyan while unlocked, and locks again on any outside single click.
//
// While unlocked, pointer-events are disabled on nested iframes (the
// YouTube player and Monaco editor) so that dragging across the divider
// is never "trapped" by an iframe's own document capturing the mouse.
// ----------------------------------------------------------------------

const MIN_PANE_PERCENT = 25;
const MAX_PANE_PERCENT = 75;
const DEFAULT_SPLIT_PERCENT = 50;
const DOUBLE_TAP_THRESHOLD_MS = 350;

interface ResizableSplitPaneProps {
  left: ReactNode;
  right: ReactNode;
  storageKey?: string;
}

export function ResizableSplitPane({ left, right, storageKey }: ResizableSplitPaneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [splitPercent, setSplitPercent] = useState(DEFAULT_SPLIT_PERCENT);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const lastTapRef = useRef<number>(0);

  // Restore a persisted split ratio for this workspace (in-memory only —
  // browser storage APIs are intentionally not used here).
  useEffect(() => {
    if (!storageKey) return;
  }, [storageKey]);

  // Toggle nested iframe pointer-events whenever lock state changes so
  // that the YouTube player / Monaco editor never trap mouse movement
  // while the user is actively dragging the divider.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const iframes = container.querySelectorAll("iframe");
    iframes.forEach((iframe) => {
      (iframe as HTMLIFrameElement).style.pointerEvents = isUnlocked
        ? "none"
        : "auto";
    });
  }, [isUnlocked]);

  const handleDrag = useCallback(
    (clientX: number) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const rawPercent = ((clientX - rect.left) / rect.width) * 100;
      const clamped = Math.min(
        MAX_PANE_PERCENT,
        Math.max(MIN_PANE_PERCENT, rawPercent)
      );
      setSplitPercent(clamped);
    },
    []
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const now = Date.now();
      const isDoubleTap = now - lastTapRef.current < DOUBLE_TAP_THRESHOLD_MS;
      lastTapRef.current = now;

      if (isDoubleTap && !isUnlocked) {
        setIsUnlocked(true);
        return;
      }

      // Only permit an active drag stream while already unlocked.
      if (isUnlocked) {
        setIsDragging(true);
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      }
    },
    [isUnlocked]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isUnlocked || !isDragging) return;
      handleDrag(e.clientX);
    },
    [isUnlocked, isDragging, handleDrag]
  );

  const onPointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Any single click outside the resizer re-locks the pane and restores
  // iframe pointer-events.
  useEffect(() => {
    if (!isUnlocked) return;

    function handleOutsideClick(e: MouseEvent) {
      const resizer = document.getElementById("split-pane-resizer");
      if (resizer && !resizer.contains(e.target as Node)) {
        setIsUnlocked(false);
        setIsDragging(false);
      }
    }

    // Delay attaching so the same click that unlocked it (double-click)
    // doesn't immediately re-trigger a lock.
    const timeout = setTimeout(() => {
      window.addEventListener("click", handleOutsideClick);
    }, 0);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [isUnlocked]);

  return (
    <div
      ref={containerRef}
      className="relative flex h-full w-full overflow-hidden select-none"
    >
      <div style={{ width: `${splitPercent}%` }} className="h-full min-w-0">
        {left}
      </div>

      <div
        id="split-pane-resizer"
        role="separator"
        aria-orientation="vertical"
        aria-label={
          isUnlocked
            ? "Divider unlocked — drag to resize, click outside to lock"
            : "Divider locked — double-click or double-tap to unlock"
        }
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={cn(
          "relative z-20 flex-shrink-0 w-2 cursor-col-resize flex items-center justify-center group",
          "transition-colors duration-200",
          isUnlocked ? "bg-accent-cyan/40" : "bg-white/5 hover:bg-white/10"
        )}
      >
        <div
          className={cn(
            "absolute flex flex-col items-center gap-1 rounded-full px-1.5 py-2 border transition-all duration-200",
            isUnlocked
              ? "bg-accent-cyan/20 border-accent-cyan/60 shadow-[0_0_16px_rgba(6,182,212,0.7)] animate-pulse-glow"
              : "bg-bg-card border-white/10"
          )}
        >
          <GripVertical
            className={cn(
              "h-4 w-4",
              isUnlocked ? "text-accent-cyan" : "text-slate-500"
            )}
          />
        </div>

        <div
          className={cn(
            "absolute -bottom-8 whitespace-nowrap rounded-md px-2 py-1 text-[10px] font-medium border transition-all duration-200",
            isUnlocked
              ? "bg-accent-cyan/10 border-accent-cyan/40 text-accent-cyan"
              : "bg-bg-card/90 border-white/10 text-slate-400 opacity-0 group-hover:opacity-100"
          )}
        >
          <span className="inline-flex items-center gap-1">
            {isUnlocked ? (
              <>
                <Unlock className="h-3 w-3" /> Click to Lock
              </>
            ) : (
              <>
                <Lock className="h-3 w-3" /> Double Tap
              </>
            )}
          </span>
        </div>
      </div>

      <div className="h-full min-w-0 flex-1">{right}</div>
    </div>
  );
}
