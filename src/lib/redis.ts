import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// ----------------------------------------------------------------------
// Upstash Redis client
// Works unmodified against the local Docker Compose stack (which runs
// serverless-redis-http as a REST shim in front of real Redis) or a
// hosted Upstash database — only the URL/token differ.
// ----------------------------------------------------------------------
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!redisUrl || !redisToken) {
  console.warn(
    "[redis] UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are not set. " +
      "AI rate limiting will fail closed until these are configured — " +
      "see docker-compose.yml for a local Redis you can point at."
  );
}

export const redis = new Redis({
  url: redisUrl ?? "http://localhost:8079",
  token: redisToken ?? "local_dev_token",
});

// ----------------------------------------------------------------------
// Sliding-window rate limiter: 10 requests per 60 seconds.
// Applied to all /api/ai/* routes, keyed by authenticated user id
// (falling back to request IP for unauthenticated callers).
// ----------------------------------------------------------------------
export const aiRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "60 s"),
  analytics: true,
  prefix: "lecturecode:ratelimit:ai",
});

/**
 * Resolve a stable rate-limit key for a given request.
 * Prefers the authenticated user id; falls back to a forwarded IP address.
 */
export function resolveRateLimitKey(
  userId: string | null | undefined,
  ip: string | null | undefined
): string {
  if (userId) return `user:${userId}`;
  return `ip:${ip ?? "unknown"}`;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export async function checkAiRateLimit(key: string): Promise<RateLimitResult> {
  const { success, limit, remaining, reset } = await aiRateLimiter.limit(key);
  return { success, limit, remaining, reset };
}
