import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { slugify } from "@/lib/slugify";

const STATUSES = ["LEAD", "QUALIFIED", "DEMO_BOOKED", "CUSTOMER", "CHURNED", "ARCHIVED"] as const;

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const contact = await prisma.crmContact.findUnique({
    where: { id },
    include: {
      activities: { orderBy: { createdAt: "desc" } },
      assets: { orderBy: { createdAt: "desc" } },
      scanLogs: {
        orderBy: { createdAt: "desc" },
        take: 20,
        include: { asset: { select: { name: true, barcode: true } } },
      },
    },
  });
  if (!contact) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ contact });
}

async function uniquePortalSlug(base: string, excludeId: string): Promise<string> {
  const root = slugify(base) || "client";
  let slug = root;
  let suffix = 1;
  while (true) {
    const existing = await prisma.crmContact.findUnique({ where: { portalSlug: slug } });
    if (!existing || existing.id === excludeId) return slug;
    suffix += 1;
    slug = `${root}-${suffix}`;
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request body." }, { status: 400 });

  const existing = await prisma.crmContact.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const statusChanged =
    typeof body.status === "string" && STATUSES.includes(body.status) && body.status !== existing.status;

  let portalSlug: string | undefined;
  if (body.generatePortalSlug === true) {
    portalSlug = await uniquePortalSlug(existing.company || existing.name, id);
  } else if (typeof body.portalSlug === "string") {
    const cleaned = slugify(body.portalSlug);
    if (cleaned) {
      const owner = await prisma.crmContact.findUnique({ where: { portalSlug: cleaned } });
      if (owner && owner.id !== id) {
        return NextResponse.json({ error: "That portal link is already taken." }, { status: 409 });
      }
      portalSlug = cleaned;
    } else {
      portalSlug = "";
    }
  }

  const contact = await prisma.crmContact.update({
    where: { id },
    data: {
      ...(typeof body.name === "string" ? { name: body.name.trim() } : {}),
      ...(typeof body.company === "string" ? { company: body.company || null } : {}),
      ...(typeof body.email === "string" ? { email: body.email || null } : {}),
      ...(typeof body.phone === "string" ? { phone: body.phone || null } : {}),
      ...(typeof body.role === "string" ? { role: body.role || null } : {}),
      ...(typeof body.source === "string" ? { source: body.source || null } : {}),
      ...(typeof body.notes === "string" ? { notes: body.notes || null } : {}),
      ...(Array.isArray(body.tags) ? { tags: body.tags.filter((t: unknown) => typeof t === "string") } : {}),
      ...(statusChanged ? { status: body.status } : {}),
      ...(portalSlug !== undefined ? { portalSlug: portalSlug || null } : {}),
    },
  });

  if (statusChanged) {
    await prisma.crmActivity.create({
      data: {
        contactId: id,
        type: "status_change",
        content: `${existing.status} → ${contact.status}`,
      },
    });
  }

  return NextResponse.json({ contact });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const contact = await prisma.crmContact.findUnique({ where: { id } });
  if (!contact) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.crmContact.delete({ where: { id } });

  await prisma.activityLog.create({
    data: { userId: session.sub, action: "deleted contact", entity: "CrmContact", entityId: id, detail: contact.name },
  });

  return NextResponse.json({ ok: true });
}
