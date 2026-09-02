import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const existing = await prisma.subscriber.findUnique({ where: { email } });
  if (existing) {
    if (existing.status === "UNSUBSCRIBED") {
      await prisma.subscriber.update({ where: { email }, data: { status: "SUBSCRIBED" } });
    }
    return NextResponse.json({ ok: true });
  }

  await prisma.subscriber.create({
    data: { email, name: typeof body?.name === "string" ? body.name : null, source: "website" },
  });

  return NextResponse.json({ ok: true });
}
