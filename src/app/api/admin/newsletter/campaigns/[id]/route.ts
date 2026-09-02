import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const campaign = await prisma.campaign.findUnique({ where: { id } });
  if (!campaign) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ campaign });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.campaign.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (existing.status === "SENT") {
    return NextResponse.json({ error: "This campaign has already been sent and can't be edited." }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request body." }, { status: 400 });

  const campaign = await prisma.campaign.update({
    where: { id },
    data: {
      ...(typeof body.name === "string" ? { name: body.name } : {}),
      ...(typeof body.subject === "string" ? { subject: body.subject } : {}),
      ...(typeof body.previewText === "string" ? { previewText: body.previewText || null } : {}),
      ...(typeof body.fromName === "string" ? { fromName: body.fromName } : {}),
      ...(typeof body.fromEmail === "string" ? { fromEmail: body.fromEmail } : {}),
      ...(Array.isArray(body.blocks) ? { blocks: body.blocks } : {}),
      ...(body.scheduledAt !== undefined
        ? { scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : null, status: body.scheduledAt ? "SCHEDULED" : "DRAFT" }
        : {}),
    },
  });

  return NextResponse.json({ campaign });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const campaign = await prisma.campaign.findUnique({ where: { id } });
  if (!campaign) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.campaign.delete({ where: { id } });

  await prisma.activityLog.create({
    data: { userId: session.sub, action: "deleted campaign", entity: "Campaign", entityId: id, detail: campaign.name },
  });

  return NextResponse.json({ ok: true });
}
