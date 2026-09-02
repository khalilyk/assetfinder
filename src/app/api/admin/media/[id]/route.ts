import { NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request body." }, { status: 400 });

  const existing = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const asset = await prisma.mediaAsset.update({
    where: { id },
    data: {
      ...(typeof body.alt === "string" ? { alt: body.alt } : {}),
      ...(typeof body.folder === "string" ? { folder: body.folder || null } : {}),
    },
  });

  return NextResponse.json({ asset });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const asset = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!asset) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await del(asset.url).catch(() => {});
  await prisma.mediaAsset.delete({ where: { id } });

  await prisma.activityLog.create({
    data: { userId: session.sub, action: "deleted media", entity: "MediaAsset", entityId: id, detail: asset.filename },
  });

  return NextResponse.json({ ok: true });
}
