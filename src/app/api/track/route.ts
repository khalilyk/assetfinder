import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function decodeCityHeader(value: string | null): string | null {
  if (!value) return null;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function deviceFromUserAgent(ua: string): string {
  if (/tablet|ipad/i.test(ua)) return "tablet";
  if (/mobile|android|iphone/i.test(ua)) return "mobile";
  return "desktop";
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const path = typeof body?.path === "string" ? body.path.slice(0, 300) : "";
  if (!path || path.startsWith("/admin")) {
    return NextResponse.json({ ok: true });
  }

  const userAgent = request.headers.get("user-agent") ?? "";
  const referrer = typeof body?.referrer === "string" ? body.referrer.slice(0, 300) : null;
  const sessionId = typeof body?.sessionId === "string" ? body.sessionId.slice(0, 100) : null;

  await prisma.pageView
    .create({
      data: {
        path,
        referrer: referrer || null,
        country: request.headers.get("x-vercel-ip-country"),
        city: decodeCityHeader(request.headers.get("x-vercel-ip-city")),
        device: deviceFromUserAgent(userAgent),
        userAgent: userAgent.slice(0, 300),
        sessionId,
      },
    })
    .catch(() => {});

  return NextResponse.json({ ok: true });
}
