import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const STATUSES = ["LEAD", "QUALIFIED", "DEMO_BOOKED", "CUSTOMER", "CHURNED", "ARCHIVED"] as const;

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const contacts = await prisma.crmContact.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ contacts });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  const status = STATUSES.includes(body?.status) ? body.status : "LEAD";

  const contact = await prisma.crmContact.create({
    data: {
      name,
      company: typeof body?.company === "string" ? body.company : null,
      email: typeof body?.email === "string" ? body.email : null,
      phone: typeof body?.phone === "string" ? body.phone : null,
      role: typeof body?.role === "string" ? body.role : null,
      status,
      source: typeof body?.source === "string" ? body.source : null,
      notes: typeof body?.notes === "string" ? body.notes : null,
      tags: Array.isArray(body?.tags) ? body.tags.filter((t: unknown) => typeof t === "string") : [],
    },
  });

  await prisma.activityLog.create({
    data: { userId: session.sub, action: "created contact", entity: "CrmContact", entityId: contact.id, detail: contact.name },
  });

  return NextResponse.json({ contact }, { status: 201 });
}
