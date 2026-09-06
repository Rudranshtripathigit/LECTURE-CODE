"use client";

import { useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import { BookMarked, Code2, Swords, Loader2 } from "lucide-react";
import { ResizableSplitPane } from "@/components/workspace/ResizableSplitPane";
import { VideoPlayer } from "@/components/workspace/VideoPlayer";
import { CodeEditor } from "@/components/workspace/CodeEditor";
import { LectureSummaryModal } from "@/components/workspace/LectureSummaryModal";
import { CodeExampleModal } from "@/components/workspace/CodeExampleModal";
import { QuizArena } from "@/components/workspace/QuizArena";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

type RightTab = "code" | "quiz";

const DEFAULT_CODE: Record<string, string> = {
  cpp: `#include <iostream>
using namespace std;

int main() {
    // Start coding here
    cout << "Hello, LectureCode Pro!" << endl;
    return 0;
}
`,
  python: `def main():
    # Start coding here
    print("Hello, LectureCode Pro!")

if __name__ == "__main__":
    main()
`,
  javascript: `function main() {
  // Start coding here
  console.log("Hello, LectureCode Pro!");
}

main();
`,
  typescript: `function main(): void {
  // Start coding here
  console.log("Hello, LectureCode Pro!");
}

main();
`,
  java: `public class Main {
    public static void main(String[] args) {
        // Start coding here
        System.out.println("Hello, LectureCode Pro!");
    }
}
`,
};

export default function WorkspacePage() {
  const { data: session } = useSession();
  const [videoId, setVideoId] = useState("rfscVS0vtbw");
  const [videoTitle, setVideoTitle] = useState("Learn Python - Full Course for Beginners");
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(DEFAULT_CODE.python);
  const [rightTab, setRightTab] = useState<RightTab>("code");

  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isExampleOpen, setIsExampleOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const handleVideoChange = useCallback((id: string) => {
    setVideoId(id);
  }, []);

  const handleLanguageChange = useCallback((lang: string) => {
    setLanguage(lang);
    setCode(DEFAULT_CODE[lang] ?? "");
  }, []);

  async function handleAnalyze() {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language,
          mode: "debug",
          prompt: "Review this code for bugs and suggest fixes.",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Analysis failed.");
      setAnalysisResult(data.result);
    } catch (err) {
      setAnalysisResult(
        err instanceof Error ? `Error: ${err.message}` : "Something went wrong."
      );
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <div className="flex h-screen flex-col bg-bg-deep">
      <header className="flex items-center justify-between border-b border-white/5 glass-panel px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-accent-cyan shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          <span className="text-sm font-semibold text-slate-100">LectureCode Pro</span>
          <Badge tone="neutral" className="hidden sm:inline-flex">
            {session?.user?.name ?? "Guest session"}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" onClick={() => setIsSummaryOpen(true)}>
            <BookMarked className="h-3.5 w-3.5 text-accent-cyan" />
            Lecture Summary
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setIsExampleOpen(true)}>
            <Code2 className="h-3.5 w-3.5 text-accent-violet" />
            Code Example
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <ResizableSplitPane
          left={<VideoPlayer videoId={videoId} onVideoChange={handleVideoChange} />}
          right={
            <div className="flex h-full flex-col">
              <div className="flex border-b border-white/5">
                <button
                  onClick={() => setRightTab("code")}
                  className={`flex-1 py-2.5 text-xs font-medium transition-colors focus-ring ${
                    rightTab === "code"
                      ? "border-b-2 border-accent-cyan text-accent-cyan"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  Compiler
                </button>
                <button
                  onClick={() => setRightTab("quiz")}
                  className={`flex-1 py-2.5 text-xs font-medium transition-colors focus-ring ${
                    rightTab === "quiz"
                      ? "border-b-2 border-accent-coral text-accent-coral"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <span className="inline-flex items-center gap-1">
                    <Swords className="h-3 w-3" /> Quiz Arena
                  </span>
                </button>
              </div>

              <div className="flex-1 overflow-hidden">
                {rightTab === "code" ? (
                  <div className="flex h-full flex-col">
                    <div className="flex-1 min-h-0">
                      <CodeEditor
                        code={code}
                        language={language}
                        onCodeChange={setCode}
                        onLanguageChange={handleLanguageChange}
                        onAnalyze={handleAnalyze}
                        isAnalyzing={isAnalyzing}
                      />
                    </div>
                    {(isAnalyzing || analysisResult) && (
                      <div className="max-h-48 overflow-y-auto border-t border-white/5 bg-bg-panel/80 p-3">
                        {isAnalyzing ? (
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Analyzing your code...
                          </div>
                        ) : (
                          <pre className="whitespace-pre-wrap text-xs leading-relaxed text-slate-300">
                            {analysisResult}
                          </pre>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <QuizArena videoTitle={videoTitle} />
                )}
              </div>
            </div>
          }
        />
      </main>

      <LectureSummaryModal
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        videoTitle={videoTitle}
        videoId={videoId}
      />
      <CodeExampleModal
        isOpen={isExampleOpen}
        onClose={() => setIsExampleOpen(false)}
        videoTitle={videoTitle}
      />
    </div>
  );
}
