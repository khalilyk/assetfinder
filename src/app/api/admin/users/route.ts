import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { hashPassword } from "@/lib/password";

const ROLES = ["SUPER_ADMIN", "ADMIN", "EDITOR"] as const;

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const users = await prisma.adminUser.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, email: true, name: true, role: true, lastLoginAt: true, createdAt: true },
  });

  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Only Super Admins can add users." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const role = ROLES.includes(body?.role) ? body.role : "EDITOR";

  if (!email || !name) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "A user with that email already exists." }, { status: 409 });
  }

  const password = crypto.randomBytes(12).toString("base64url");
  const passwordHash = await hashPassword(password);

  const user = await prisma.adminUser.create({
    data: { email, name, role, passwordHash },
  });

  await prisma.activityLog.create({
    data: { userId: session.sub, action: "created user", entity: "AdminUser", entityId: user.id, detail: user.email },
  });

  return NextResponse.json(
    { user: { id: user.id, email: user.email, name: user.name, role: user.role }, password },
    { status: 201 },
  );
}
