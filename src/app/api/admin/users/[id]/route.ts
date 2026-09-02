import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { slugify } from "@/lib/slugify";
import { hashPassword } from "@/lib/password";

const ROLES = ["SUPER_ADMIN", "ADMIN", "EDITOR"] as const;

const PUBLIC_FIELDS = {
  id: true,
  email: true,
  name: true,
  role: true,
  avatarUrl: true,
  title: true,
  phone: true,
  linkedinUrl: true,
  bio: true,
  cardSlug: true,
  lastLoginAt: true,
} as const;

async function uniqueCardSlug(base: string, excludeId: string): Promise<string> {
  const root = slugify(base) || "team-member";
  let slug = root;
  let suffix = 1;
  while (true) {
    const existing = await prisma.adminUser.findUnique({ where: { cardSlug: slug } });
    if (!existing || existing.id === excludeId) return slug;
    suffix += 1;
    slug = `${root}-${suffix}`;
  }
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const user = await prisma.adminUser.findUnique({ where: { id }, select: PUBLIC_FIELDS });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ user });
}

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
  if (body.resetPassword === true && (isSelf || session.role !== "SUPER_ADMIN")) {
    return NextResponse.json(
      { error: "Only Super Admins can reset another user's password. Use My Account to change your own." },
      { status: 403 },
    );
  }

  const existing = await prisma.adminUser.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let cardSlug: string | undefined;
  if (body.generateCardSlug === true) {
    cardSlug = await uniqueCardSlug(existing.name, id);
  }

  let newPassword: string | undefined;
  let passwordHash: string | undefined;
  if (body.resetPassword === true) {
    newPassword = crypto.randomBytes(12).toString("base64url");
    passwordHash = await hashPassword(newPassword);
  }

  const user = await prisma.adminUser.update({
    where: { id },
    data: {
      ...(typeof body.name === "string" ? { name: body.name.trim() } : {}),
      ...(ROLES.includes(body.role) ? { role: body.role } : {}),
      ...(typeof body.avatarUrl === "string" ? { avatarUrl: body.avatarUrl || null } : {}),
      ...(typeof body.title === "string" ? { title: body.title || null } : {}),
      ...(typeof body.phone === "string" ? { phone: body.phone || null } : {}),
      ...(typeof body.linkedinUrl === "string" ? { linkedinUrl: body.linkedinUrl || null } : {}),
      ...(typeof body.bio === "string" ? { bio: body.bio || null } : {}),
      ...(cardSlug !== undefined ? { cardSlug } : {}),
      ...(passwordHash ? { passwordHash } : {}),
    },
    select: PUBLIC_FIELDS,
  });

  if (newPassword) {
    await prisma.activityLog.create({
      data: { userId: session.sub, action: "reset password for user", entity: "AdminUser", entityId: id, detail: user.email },
    });
  }

  return NextResponse.json({ user, ...(newPassword ? { password: newPassword } : {}) });
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
