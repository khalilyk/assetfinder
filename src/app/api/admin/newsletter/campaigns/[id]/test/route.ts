import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { renderEmailHtml, type EmailBlock } from "@/lib/email-blocks";
import { getResend } from "@/lib/resend";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const campaign = await prisma.campaign.findUnique({ where: { id } });
  if (!campaign) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await request.json().catch(() => null);
  const testEmail = typeof body?.email === "string" ? body.email.trim() : "";
  if (!testEmail) return NextResponse.json({ error: "Enter an email to send the test to." }, { status: 400 });

  const resend = getResend();
  if (!resend) {
    return NextResponse.json(
      { error: "Email sending isn't configured yet. Add RESEND_API_KEY to enable sending." },
      { status: 400 },
    );
  }

  const origin = new URL(request.url).origin;
  const html = renderEmailHtml({
    blocks: campaign.blocks as unknown as EmailBlock[],
    previewText: campaign.previewText ?? undefined,
    origin,
  });

  try {
    await resend.emails.send({
      from: `${campaign.fromName} <${campaign.fromEmail}>`,
      to: testEmail,
      subject: `[TEST] ${campaign.subject}`,
      html,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send test email." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
