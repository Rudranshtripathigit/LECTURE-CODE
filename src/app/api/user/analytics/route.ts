import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDateKey } from "@/lib/utils";

// ----------------------------------------------------------------------
// GET /api/user/analytics
// Returns the authenticated user's profile stats plus a 60-day daily
// streak heatmap payload (date -> activity count) for ActivityHeatmap.tsx.
// ----------------------------------------------------------------------
const HEATMAP_WINDOW_DAYS = 60;

export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const since = new Date();
    since.setDate(since.getDate() - HEATMAP_WINDOW_DAYS);
    since.setHours(0, 0, 0, 0);

    const [profile, streaks] = await Promise.all([
      prisma.profile.upsert({
        where: { userId },
        create: { userId },
        update: {},
      }),
      prisma.dailyStreak.findMany({
        where: { userId, date: { gte: since } },
        orderBy: { date: "asc" },
      }),
    ]);

    // Build a dense day -> count map so the client never has to fill gaps.
    const heatmap: Record<string, number> = {};
    for (let i = 0; i <= HEATMAP_WINDOW_DAYS; i++) {
      const d = new Date(since);
      d.setDate(d.getDate() + i);
      heatmap[getDateKey(d)] = 0;
    }
    for (const entry of streaks) {
      heatmap[getDateKey(entry.date)] = entry.count;
    }

    return NextResponse.json({
      profile: {
        currentStreak: profile.currentStreak,
        longestStreak: profile.longestStreak,
        totalHours: profile.totalHours,
        problemsSolved: profile.problemsSolved,
      },
      heatmap,
    });
  } catch (err) {
    console.error("[api/user/analytics] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch analytics." },
      { status: 500 }
    );
  }
}
