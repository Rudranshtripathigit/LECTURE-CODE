import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const YOUTUBE_ID_REGEX =
  /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

const RAW_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

/**
 * Extracts an 11-character YouTube video ID from either a full URL
 * (watch, embed, shorts, youtu.be) or a raw ID string.
 * Returns null when no valid ID can be parsed.
 */
export function extractYouTubeId(input: string): string | null {
  const trimmed = input.trim();
  if (RAW_ID_REGEX.test(trimmed)) return trimmed;

  const match = trimmed.match(YOUTUBE_ID_REGEX);
  return match ? match[1] : null;
}

export function formatHours(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  return `${hours.toFixed(1)}h`;
}

export function getDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}
