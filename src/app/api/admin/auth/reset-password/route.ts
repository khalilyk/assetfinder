import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyResetToken } from "@/lib/session";
import { hashPassword } from "@/lib/password";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const token = typeof body?.token === "string" ? body.token : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!token) return NextResponse.json({ error: "Missing reset token." }, { status: 400 });
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const userId = await verifyResetToken(token);
  if (!userId) {
    return NextResponse.json({ error: "This reset link is invalid or has expired." }, { status: 400 });
  }

  const user = await prisma.adminUser.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "This reset link is invalid or has expired." }, { status: 400 });

  const passwordHash = await hashPassword(password);
  await prisma.adminUser.update({ where: { id: userId }, data: { passwordHash } });

  await prisma.activityLog.create({
    data: { userId, action: "reset own password via email link" },
  });

  return NextResponse.json({ ok: true });
}
