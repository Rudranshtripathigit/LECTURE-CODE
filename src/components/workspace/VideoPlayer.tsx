"use client";

import { useState, type FormEvent } from "react";
import { Search, Youtube } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { extractYouTubeId } from "@/lib/utils";

// ----------------------------------------------------------------------
// FEATURE B: Universal Video Search & Dynamic Loading
// Accepts full YouTube URLs (watch/embed/shorts/youtu.be) or raw
// 11-character video IDs. Extraction happens client-side via RegEx in
// lib/utils.ts, and the active player updates without a full page reload.
// ----------------------------------------------------------------------

interface VideoPlayerProps {
  videoId: string;
  onVideoChange: (videoId: string) => void;
}

export function VideoPlayer({ videoId, onVideoChange }: VideoPlayerProps) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const id = extractYouTubeId(inputValue);
    if (!id) {
      setError("Enter a valid YouTube URL or 11-character video ID.");
      return;
    }
    setError(null);
    onVideoChange(id);
    setInputValue("");
  }

  return (
    <div className="flex h-full flex-col">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-b border-white/5 p-3"
      >
        <Youtube className="h-5 w-5 flex-shrink-0 text-accent-coral" />
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Paste a YouTube URL or video ID..."
          className="h-9"
        />
        <Button type="submit" size="sm" variant="ghost" aria-label="Load video">
          <Search className="h-4 w-4" />
        </Button>
      </form>
      {error && (
        <p className="px-3 pt-2 text-xs text-accent-coral" role="alert">
          {error}
        </p>
      )}
      <div className="relative flex-1 bg-black">
        {videoId ? (
          <iframe
            key={videoId}
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube.com/embed/${videoId}?rel=0`}
            title="LectureCode Pro video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            Paste a lecture link above to begin
          </div>
        )}
      </div>
    </div>
  );
}
