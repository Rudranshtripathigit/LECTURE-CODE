import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redis } from "@/lib/redis";

// ----------------------------------------------------------------------
// GET /api/health
// Lightweight liveness/readiness probe for deployment platforms
// (Docker HEALTHCHECK, load balancers, uptime monitors). Verifies the
// app can actually reach Postgres and Redis, not just that the Node
// process is alive.
// ----------------------------------------------------------------------
export async function GET() {
  const checks: Record<string, "ok" | "error"> = {
    database: "ok",
    redis: "ok",
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
    checks.database = "error";
  }

  try {
    await redis.ping();
  } catch {
    checks.redis = "error";
  }

  const isHealthy = Object.values(checks).every((v) => v === "ok");

  return NextResponse.json(
    { status: isHealthy ? "healthy" : "degraded", checks },
    { status: isHealthy ? 200 : 503 }
  );
}
