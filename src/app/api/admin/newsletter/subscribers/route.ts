import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const subscribers = await prisma.subscriber.findMany({ orderBy: { createdAt: "desc" } });

  return NextResponse.json({ subscribers });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email) return NextResponse.json({ error: "Email is required." }, { status: 400 });

  const existing = await prisma.subscriber.findUnique({ where: { email } });
  if (existing) {
    if (existing.status === "UNSUBSCRIBED") {
      const resub = await prisma.subscriber.update({ where: { email }, data: { status: "SUBSCRIBED" } });
      return NextResponse.json({ subscriber: resub });
    }
    return NextResponse.json({ error: "That email is already subscribed." }, { status: 409 });
  }

  const subscriber = await prisma.subscriber.create({
    data: { email, name: typeof body?.name === "string" ? body.name : null, source: "admin" },
  });

  return NextResponse.json({ subscriber }, { status: 201 });
}
