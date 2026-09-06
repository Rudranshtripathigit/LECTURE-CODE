"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, RefreshCw, Swords, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { QuizQuestion } from "@/app/api/ai/quiz/route";

interface QuizArenaProps {
  videoTitle: string;
}

export function QuizArena({ videoTitle }: QuizArenaProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadQuiz() {
    if (!videoTitle) {
      setError("Load a lecture video first so the quiz can match its topic.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedOptionId(null);
    setScore(0);
    try {
      const res = await fetch("/api/ai/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoTitle, numQuestions: 5 }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to generate quiz.");
      }
      const data = await res.json();
      setQuestions(data.questions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  const currentQuestion = questions[currentIndex];
  const isAnswered = selectedOptionId !== null;
  const isLastQuestion = currentIndex === questions.length - 1;
  const isFinished = questions.length > 0 && currentIndex >= questions.length;

  async function handleSelect(optionId: string) {
    if (isAnswered || !currentQuestion) return;
    setSelectedOptionId(optionId);
    const isCorrect = optionId === currentQuestion.correctOptionId;
    if (isCorrect) setScore((s) => s + 1);

    fetch("/api/ai/quiz", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: currentQuestion.id, isCorrect }),
    }).catch(() => {
      /* Non-blocking: analytics recording failures shouldn't disrupt the quiz UX. */
    });
  }

  function handleNext() {
    setSelectedOptionId(null);
    setCurrentIndex((i) => i + 1);
  }

  return (
    <div className="flex h-full flex-col p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <Swords className="h-4 w-4 text-accent-coral" />
          Quiz Arena
        </h3>
        <Button size="sm" variant="ghost" onClick={loadQuiz} isLoading={isLoading}>
          <RefreshCw className="h-3.5 w-3.5" />
          {questions.length > 0 ? "Regenerate" : "Start Quiz"}
        </Button>
      </div>

      {error && (
        <p className="mb-4 rounded-lg border border-accent-coral/30 bg-accent-coral/10 p-3 text-sm text-accent-coral">
          {error}
        </p>
      )}

      {isLoading && (
        <div className="flex flex-1 items-center justify-center gap-2 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          Building your practice questions...
        </div>
      )}

      {!isLoading && questions.length === 0 && !error && (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-sm text-slate-500">
          <Swords className="h-8 w-8 text-slate-700" />
          Start a quiz generated from the current lecture topic.
        </div>
      )}

      {isFinished && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <Badge tone="green">
            Score: {score} / {questions.length}
          </Badge>
          <p className="text-sm text-slate-400">Nice work — run it again for new questions.</p>
        </div>
      )}

      {currentQuestion && !isFinished && (
        <div className="flex-1 space-y-4 overflow-y-auto">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <Badge tone="cyan">Score: {score}</Badge>
          </div>
          <p className="text-sm font-medium text-slate-100">{currentQuestion.prompt}</p>
          <div className="space-y-2">
            {currentQuestion.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              const isCorrectOption = opt.id === currentQuestion.correctOptionId;
              const showState = isAnswered && (isSelected || isCorrectOption);
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelect(opt.id)}
                  disabled={isAnswered}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl border p-3 text-left text-sm transition-colors focus-ring",
                    !isAnswered && "border-white/10 bg-white/5 hover:bg-white/10 text-slate-200",
                    showState && isCorrectOption && "border-accent-green/40 bg-accent-green/10 text-accent-green",
                    showState && isSelected && !isCorrectOption && "border-accent-coral/40 bg-accent-coral/10 text-accent-coral"
                  )}
                >
                  {opt.text}
                  {showState && isCorrectOption && <CheckCircle2 className="h-4 w-4 flex-shrink-0" />}
                  {showState && isSelected && !isCorrectOption && <XCircle className="h-4 w-4 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
          {isAnswered && (
            <div className="rounded-lg bg-white/5 p-3 text-xs text-slate-400">
              {currentQuestion.explanation}
            </div>
          )}
          {isAnswered && (
            <Button size="sm" onClick={handleNext} className="w-full">
              {isLastQuestion ? "See Results" : "Next Question"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
