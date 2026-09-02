import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { EMAIL_TEMPLATES } from "@/lib/email-templates";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const campaigns = await prisma.campaign.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      subject: true,
      status: true,
      scheduledAt: true,
      sentAt: true,
      recipientCount: true,
      openCount: true,
      clickCount: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ campaigns });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  if (!name) return NextResponse.json({ error: "Name is required." }, { status: 400 });

  const template = EMAIL_TEMPLATES.find((t) => t.key === body?.template) ?? EMAIL_TEMPLATES[0];

  const campaign = await prisma.campaign.create({
    data: {
      name,
      subject: name,
      blocks: template.blocks(),
      createdById: session.sub,
    },
  });

  await prisma.activityLog.create({
    data: { userId: session.sub, action: "created campaign", entity: "Campaign", entityId: campaign.id, detail: campaign.name },
  });

  return NextResponse.json({ campaign }, { status: 201 });
}
