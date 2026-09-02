import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const ROLES = ["SUPER_ADMIN", "ADMIN", "EDITOR"] as const;

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request body." }, { status: 400 });

  const isSelf = id === session.sub;
  if (!isSelf && session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Only Super Admins can edit other users." }, { status: 403 });
  }
  if (typeof body.role === "string" && session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Only Super Admins can change roles." }, { status: 403 });
  }

  const existing = await prisma.adminUser.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const user = await prisma.adminUser.update({
    where: { id },
    data: {
      ...(typeof body.name === "string" ? { name: body.name.trim() } : {}),
      ...(ROLES.includes(body.role) ? { role: body.role } : {}),
    },
  });

  return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Only Super Admins can remove users." }, { status: 403 });
  }

  const { id } = await params;
  if (id === session.sub) {
    return NextResponse.json({ error: "You cannot remove your own account." }, { status: 400 });
  }

  const user = await prisma.adminUser.findUnique({ where: { id } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.adminUser.delete({ where: { id } });

  await prisma.activityLog.create({
    data: { userId: session.sub, action: "removed user", entity: "AdminUser", entityId: id, detail: user.email },
  });

  return NextResponse.json({ ok: true });
}
