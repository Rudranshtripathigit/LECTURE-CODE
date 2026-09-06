import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDateKey } from "@/lib/utils";

// ----------------------------------------------------------------------
// POST /api/user/progress
// Upserts a LectureProgress record for the current video, updates the
// day's DailyStreak count, and recalculates the user's current/longest
// streak + total study hours in Profile.
// ----------------------------------------------------------------------

const ProgressRequestSchema = z.object({
  videoId: z.string().min(1).max(50),
  videoTitle: z.string().min(1).max(200),
  completed: z.boolean().optional(),
  checklists: z.record(z.boolean()).default({}),
  minutesWatched: z.number().min(0).max(600).default(0),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    const body = await req.json().catch(() => null);
    const parsed = ProgressRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { videoId, videoTitle, completed, checklists, minutesWatched } =
      parsed.data;

    const progress = await prisma.lectureProgress.upsert({
      where: { userId_videoId: { userId, videoId } },
      create: {
        userId,
        videoId,
        videoTitle,
        completed: completed ?? false,
        checklists,
      },
      update: {
        videoTitle,
        ...(completed !== undefined && { completed }),
        checklists,
        lastWatchedAt: new Date(),
      },
    });

    // --- Update today's DailyStreak row ---
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.dailyStreak.upsert({
      where: { userId_date: { userId, date: today } },
      create: { userId, date: today, count: 1 },
      update: { count: { increment: 1 } },
    });

    // --- Recompute current & longest streak from the DailyStreak table ---
    const allStreaks = await prisma.dailyStreak.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      select: { date: true },
    });

    let currentStreak = 0;
    let cursor = new Date(today);
    const streakDates = new Set(allStreaks.map((s) => getDateKey(s.date)));
    while (streakDates.has(getDateKey(cursor))) {
      currentStreak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    let longestStreak = 0;
    let running = 0;
    let prevDate: Date | null = null;
    const sortedAsc = [...allStreaks].sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
    for (const { date } of sortedAsc) {
      if (prevDate) {
        const dayDiff = Math.round(
          (date.getTime() - prevDate.getTime()) / 86_400_000
        );
        running = dayDiff === 1 ? running + 1 : 1;
      } else {
        running = 1;
      }
      longestStreak = Math.max(longestStreak, running);
      prevDate = date;
    }

    const existingProfile = await prisma.profile.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });

    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: {
        currentStreak,
        longestStreak: Math.max(longestStreak, existingProfile.longestStreak),
        totalHours: { increment: minutesWatched / 60 },
      },
    });

    return NextResponse.json({ progress, profile: updatedProfile });
  } catch (err) {
    console.error("[api/user/progress] error:", err);
    return NextResponse.json(
      { error: "Failed to update progress." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const videoId = req.nextUrl.searchParams.get("videoId");
    if (!videoId) {
      return NextResponse.json({ error: "videoId is required" }, { status: 400 });
    }

    const progress = await prisma.lectureProgress.findUnique({
      where: { userId_videoId: { userId: session.user.id, videoId } },
    });

    return NextResponse.json({ progress });
  } catch (err) {
    console.error("[api/user/progress GET] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch progress." },
      { status: 500 }
    );
  }
}
