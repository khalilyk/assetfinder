import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const subscriber = await prisma.subscriber.findUnique({ where: { id } });
  if (!subscriber) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.subscriber.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
