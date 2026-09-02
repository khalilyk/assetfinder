import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const TYPES = ["installation", "service", "inspection"] as const;

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const asset = await prisma.asset.findUnique({ where: { id } });
  if (!asset) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await request.json().catch(() => null);
  const type = TYPES.includes(body?.type) ? body.type : "inspection";
  const label = typeof body?.label === "string" ? body.label.trim() : "";
  if (!label) return NextResponse.json({ error: "Label is required." }, { status: 400 });

  const event = await prisma.assetEvent.create({
    data: { assetId: id, type, label },
  });

  if (type === "inspection") {
    await prisma.asset.update({ where: { id }, data: { lastInspectedAt: event.occurredAt } });
  }

  return NextResponse.json({ event }, { status: 201 });
}
