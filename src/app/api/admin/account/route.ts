import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { hashPassword, verifyPassword } from "@/lib/password";

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request body." }, { status: 400 });

  if (typeof body.name === "string") {
    const name = body.name.trim();
    if (!name) return NextResponse.json({ error: "Name can't be empty." }, { status: 400 });

    await prisma.adminUser.update({ where: { id: session.sub }, data: { name } });
    return NextResponse.json({ ok: true });
  }

  if (typeof body.currentPassword === "string" && typeof body.newPassword === "string") {
    if (body.newPassword.length < 8) {
      return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 });
    }

    const user = await prisma.adminUser.findUnique({ where: { id: session.sub } });
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const valid = await verifyPassword(body.currentPassword, user.passwordHash);
    if (!valid) return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });

    const passwordHash = await hashPassword(body.newPassword);
    await prisma.adminUser.update({ where: { id: session.sub }, data: { passwordHash } });

    await prisma.activityLog.create({
      data: { userId: session.sub, action: "changed password" },
    });

    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
}
