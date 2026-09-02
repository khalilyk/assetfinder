import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const pages = await prisma.page.findMany({
    orderBy: { updatedAt: "desc" },
    select: { id: true, slug: true, title: true, published: true, updatedAt: true },
  });

  return NextResponse.json({ pages });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const slug = typeof body?.slug === "string" ? body.slug.trim().toLowerCase() : "";
  const title = typeof body?.title === "string" ? body.title.trim() : "";

  if (!slug || !title) {
    return NextResponse.json({ error: "Slug and title are required." }, { status: 400 });
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/.test(slug)) {
    return NextResponse.json(
      { error: "Slug must be lowercase, using letters, numbers, hyphens, and slashes only." },
      { status: 400 },
    );
  }

  const existing = await prisma.page.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "A page with that slug already exists." }, { status: 409 });
  }

  const page = await prisma.page.create({
    data: { slug, title, sections: [], published: false, updatedById: session.sub },
  });

  await prisma.activityLog.create({
    data: { userId: session.sub, action: "created page", entity: "Page", entityId: page.id, detail: page.title },
  });

  return NextResponse.json({ page }, { status: 201 });
}
