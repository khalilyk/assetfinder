import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createResetToken } from "@/lib/session";
import { getResend } from "@/lib/resend";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

  // Always respond the same way regardless of whether the email exists,
  // so this endpoint can't be used to enumerate admin accounts.
  const genericResponse = NextResponse.json({
    ok: true,
    message: "If an account exists for that email, a reset link has been sent.",
  });

  if (!email) return genericResponse;

  const user = await prisma.adminUser.findUnique({ where: { email } });
  if (!user) return genericResponse;

  const resend = getResend();
  if (!resend) return genericResponse;

  const token = await createResetToken(user.id);
  const origin = new URL(request.url).origin;
  const resetUrl = `${origin}/admin/reset-password?token=${token}`;

  try {
    await resend.emails.send({
      from: "AssetFinder <hello@assetfinder.au>",
      to: user.email,
      subject: "Reset your AssetFinder admin password",
      html: `<p>Hi ${user.name.split(" ")[0]},</p><p>Click the link below to reset your AssetFinder admin password. This link expires in 1 hour.</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>If you didn't request this, you can safely ignore this email.</p>`,
    });
  } catch {
    // Swallow send errors — still return the generic response.
  }

  return genericResponse;
}
