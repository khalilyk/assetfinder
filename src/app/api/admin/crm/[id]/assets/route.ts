import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const STATUSES = ["COMPLIANT", "DUE_SOON", "OVERDUE", "UNKNOWN"] as const;

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const client = await prisma.crmContact.findUnique({ where: { id } });
  if (!client) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await request.json().catch(() => null);
  const barcode = typeof body?.barcode === "string" ? body.barcode.trim() : "";
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const type = typeof body?.type === "string" ? body.type.trim() : "";

  if (!barcode || !name || !type) {
    return NextResponse.json({ error: "Barcode, name, and type are required." }, { status: 400 });
  }

  const existing = await prisma.asset.findUnique({ where: { barcode } });
  if (existing) {
    return NextResponse.json({ error: "An asset with that barcode already exists." }, { status: 409 });
  }

  const status = STATUSES.includes(body?.status) ? body.status : "UNKNOWN";

  const asset = await prisma.asset.create({
    data: {
      barcode,
      name,
      type,
      location: typeof body?.location === "string" ? body.location : null,
      status,
      installedAt: body?.installedAt ? new Date(body.installedAt) : null,
      lastInspectedAt: body?.lastInspectedAt ? new Date(body.lastInspectedAt) : null,
      nextDueAt: body?.nextDueAt ? new Date(body.nextDueAt) : null,
      notes: typeof body?.notes === "string" ? body.notes : null,
      clientId: id,
    },
  });

  if (asset.installedAt) {
    await prisma.assetEvent.create({
      data: { assetId: asset.id, type: "installation", label: "Installation recorded", occurredAt: asset.installedAt },
    });
  }

  await prisma.activityLog.create({
    data: { userId: session.sub, action: "added asset", entity: "Asset", entityId: asset.id, detail: asset.name },
  });

  return NextResponse.json({ asset }, { status: 201 });
}
