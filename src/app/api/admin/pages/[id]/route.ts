import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const page = await prisma.page.findUnique({ where: { id }, include: { seo: true } });
  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ page });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request body." }, { status: 400 });

  const existing = await prisma.page.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (typeof body.slug === "string") {
    const slug = body.slug.trim().toLowerCase();
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/.test(slug)) {
      return NextResponse.json(
        { error: "Slug must be lowercase, using letters, numbers, hyphens, and slashes only." },
        { status: 400 },
      );
    }
    const slugOwner = await prisma.page.findUnique({ where: { slug } });
    if (slugOwner && slugOwner.id !== id) {
      return NextResponse.json({ error: "A page with that slug already exists." }, { status: 409 });
    }
  }

  const seoInput = body.seo;

  const page = await prisma.page.update({
    where: { id },
    data: {
      ...(typeof body.slug === "string" ? { slug: body.slug.trim().toLowerCase() } : {}),
      ...(typeof body.title === "string" ? { title: body.title.trim() } : {}),
      ...(Array.isArray(body.sections) ? { sections: body.sections } : {}),
      ...(typeof body.published === "boolean" ? { published: body.published } : {}),
      updatedById: session.sub,
      ...(seoInput
        ? {
            seo: {
              upsert: {
                create: seoInput,
                update: seoInput,
              },
            },
          }
        : {}),
    },
    include: { seo: true },
  });

  await prisma.activityLog.create({
    data: { userId: session.sub, action: "updated page", entity: "Page", entityId: page.id, detail: page.title },
  });

  return NextResponse.json({ page });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const page = await prisma.page.findUnique({ where: { id } });
  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.page.delete({ where: { id } });

  await prisma.activityLog.create({
    data: { userId: session.sub, action: "deleted page", entity: "Page", entityId: id, detail: page.title },
  });

  return NextResponse.json({ ok: true });
}
