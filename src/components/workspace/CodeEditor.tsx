"use client";

import Editor, { type OnMount } from "@monaco-editor/react";
import { useRef } from "react";
import { Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface CodeEditorProps {
  code: string;
  language: string;
  onCodeChange: (value: string) => void;
  onLanguageChange: (language: string) => void;
  onAnalyze: () => void;
  isAnalyzing?: boolean;
}

const LANGUAGES = [
  { value: "cpp", label: "C++" },
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "java", label: "Java" },
];

export function CodeEditor({
  code,
  language,
  onCodeChange,
  onLanguageChange,
  onAnalyze,
  isAnalyzing,
}: CodeEditorProps) {
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  const handleMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-white/5 p-3">
        <select
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="rounded-lg border border-white/10 bg-bg-card/60 px-2.5 py-1.5 text-xs text-slate-200 focus-ring"
        >
          {LANGUAGES.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
        <Button
          size="sm"
          variant="secondary"
          onClick={onAnalyze}
          isLoading={isAnalyzing}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Analyze with AI
        </Button>
      </div>
      <div className="flex-1">
        <Editor
          value={code}
          language={language}
          theme="vs-dark"
          onChange={(value) => onCodeChange(value ?? "")}
          onMount={handleMount}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            fontFamily: "var(--font-mono)",
            padding: { top: 16 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
          }}
        />
      </div>
    </div>
  );
}
