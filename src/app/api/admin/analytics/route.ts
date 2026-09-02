import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const ALLOWED_RANGES = [7, 30, 90] as const;

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const daysParam = Number(searchParams.get("days"));
  const days = ALLOWED_RANGES.includes(daysParam as (typeof ALLOWED_RANGES)[number]) ? daysParam : 30;

  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const whereRange = { createdAt: { gte: since } };

  const [totalViews, topPages, topReferrers, deviceBreakdown, dailySeriesRaw, uniqueSessionsRaw] = await Promise.all([
    prisma.pageView.count({ where: whereRange }),
    prisma.pageView.groupBy({
      by: ["path"],
      where: whereRange,
      _count: { path: true },
      orderBy: { _count: { path: "desc" } },
      take: 10,
    }),
    prisma.pageView.groupBy({
      by: ["referrer"],
      where: { ...whereRange, referrer: { not: null } },
      _count: { referrer: true },
      orderBy: { _count: { referrer: "desc" } },
      take: 8,
    }),
    prisma.pageView.groupBy({
      by: ["device"],
      where: whereRange,
      _count: { device: true },
    }),
    prisma.$queryRaw<{ day: Date; count: bigint }[]>(Prisma.sql`
      SELECT date_trunc('day', "createdAt") AS day, COUNT(*) AS count
      FROM page_views
      WHERE "createdAt" >= ${since}
      GROUP BY day
      ORDER BY day ASC
    `),
    prisma.$queryRaw<{ count: bigint }[]>(Prisma.sql`
      SELECT COUNT(DISTINCT "sessionId") AS count
      FROM page_views
      WHERE "createdAt" >= ${since} AND "sessionId" IS NOT NULL
    `),
  ]);

  return NextResponse.json({
    days,
    totalViews,
    uniqueSessions: Number(uniqueSessionsRaw[0]?.count ?? 0),
    topPages: topPages.map((p) => ({ path: p.path, count: p._count.path })),
    topReferrers: topReferrers.map((r) => ({ referrer: r.referrer, count: r._count.referrer })),
    deviceBreakdown: deviceBreakdown.map((d) => ({ device: d.device ?? "unknown", count: d._count.device })),
    dailySeries: dailySeriesRaw.map((d) => ({ day: d.day, count: Number(d.count) })),
  });
}
