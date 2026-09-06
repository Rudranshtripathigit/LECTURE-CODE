"use client";

import { useEffect, useState } from "react";
import { Code2, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";

interface CodeExampleModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoTitle: string;
}

const EXAMPLE_LANGUAGES = ["cpp", "python"] as const;

export function CodeExampleModal({
  isOpen,
  onClose,
  videoTitle,
}: CodeExampleModalProps) {
  const [activeLang, setActiveLang] = useState<(typeof EXAMPLE_LANGUAGES)[number]>(
    "cpp"
  );
  const [examples, setExamples] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !videoTitle) return;

    let cancelled = false;
    async function fetchExamples() {
      setIsLoading(true);
      setError(null);
      try {
        const results = await Promise.all(
          EXAMPLE_LANGUAGES.map(async (lang) => {
            const res = await fetch("/api/ai/analyze", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                language: lang,
                mode: "explain",
                prompt: `Write a standard, minimal ${lang} boilerplate implementation demonstrating the core data structure or algorithm from this lecture: "${videoTitle}". Return only the code in a single fenced code block plus a one-sentence caption above it.`,
              }),
            });
            if (!res.ok) throw new Error("Failed to generate example.");
            const data = await res.json();
            return [lang, data.result as string] as const;
          })
        );
        if (!cancelled) {
          setExamples(Object.fromEntries(results));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Something went wrong.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchExamples();
    return () => {
      cancelled = true;
    };
  }, [isOpen, videoTitle]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Code Example"
      icon={<Code2 className="h-5 w-5 text-accent-violet" />}
      widthClassName="max-w-3xl"
    >
      <div className="mb-4 flex gap-2">
        {EXAMPLE_LANGUAGES.map((lang) => (
          <button
            key={lang}
            onClick={() => setActiveLang(lang)}
            className="focus-ring rounded-lg"
          >
            <Badge tone={activeLang === lang ? "violet" : "neutral"}>
              {lang === "cpp" ? "C++" : "Python"}
            </Badge>
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center gap-2 py-12 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          Generating boilerplate...
        </div>
      )}

      {error && !isLoading && (
        <p className="rounded-lg border border-accent-coral/30 bg-accent-coral/10 p-3 text-sm text-accent-coral">
          {error}
        </p>
      )}

      {!isLoading && !error && examples[activeLang] && (
        <pre className="max-h-96 overflow-auto rounded-xl bg-black/40 p-4 font-mono text-xs leading-relaxed text-slate-200 whitespace-pre-wrap">
          {examples[activeLang]}
        </pre>
      )}
    </Modal>
  );
}
