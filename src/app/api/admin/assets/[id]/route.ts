import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const STATUSES = ["COMPLIANT", "DUE_SOON", "OVERDUE", "UNKNOWN"] as const;

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.asset.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request body." }, { status: 400 });

  const statusChanged = STATUSES.includes(body.status) && body.status !== existing.status;

  const asset = await prisma.asset.update({
    where: { id },
    data: {
      ...(typeof body.name === "string" ? { name: body.name.trim() } : {}),
      ...(typeof body.type === "string" ? { type: body.type.trim() } : {}),
      ...(typeof body.location === "string" ? { location: body.location || null } : {}),
      ...(typeof body.notes === "string" ? { notes: body.notes || null } : {}),
      ...(STATUSES.includes(body.status) ? { status: body.status } : {}),
      ...("installedAt" in body ? { installedAt: body.installedAt ? new Date(body.installedAt) : null } : {}),
      ...("lastInspectedAt" in body
        ? { lastInspectedAt: body.lastInspectedAt ? new Date(body.lastInspectedAt) : null }
        : {}),
      ...("nextDueAt" in body ? { nextDueAt: body.nextDueAt ? new Date(body.nextDueAt) : null } : {}),
    },
  });

  if (statusChanged) {
    await prisma.assetEvent.create({
      data: { assetId: id, type: "status_change", label: `${existing.status} → ${asset.status}` },
    });
  }

  return NextResponse.json({ asset });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const asset = await prisma.asset.findUnique({ where: { id } });
  if (!asset) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.asset.delete({ where: { id } });

  await prisma.activityLog.create({
    data: { userId: session.sub, action: "removed asset", entity: "Asset", entityId: id, detail: asset.name },
  });

  return NextResponse.json({ ok: true });
}
