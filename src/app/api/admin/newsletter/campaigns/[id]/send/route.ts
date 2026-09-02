import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { renderEmailHtml, type EmailBlock } from "@/lib/email-blocks";
import { getResend, chunk, BATCH_SIZE } from "@/lib/resend";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const campaign = await prisma.campaign.findUnique({ where: { id } });
  if (!campaign) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (campaign.status === "SENT") {
    return NextResponse.json({ error: "This campaign has already been sent." }, { status: 400 });
  }
  if (!campaign.subject.trim()) {
    return NextResponse.json({ error: "Add a subject line before sending." }, { status: 400 });
  }

  const resend = getResend();
  if (!resend) {
    return NextResponse.json(
      { error: "Email sending isn't configured yet. Add RESEND_API_KEY to enable sending." },
      { status: 400 },
    );
  }

  const subscribers = await prisma.subscriber.findMany({
    where: { status: "SUBSCRIBED" },
    select: { email: true, unsubscribeToken: true },
  });

  if (subscribers.length === 0) {
    return NextResponse.json({ error: "There are no subscribed recipients to send to." }, { status: 400 });
  }

  const origin = new URL(request.url).origin;
  const blocks = campaign.blocks as unknown as EmailBlock[];
  const batches = chunk(subscribers, BATCH_SIZE);

  await prisma.campaign.update({ where: { id }, data: { status: "SENDING" } });

  try {
    for (const batch of batches) {
      await resend.batch.send(
        batch.map((s) => ({
          from: `${campaign.fromName} <${campaign.fromEmail}>`,
          to: s.email,
          subject: campaign.subject,
          html: renderEmailHtml({
            blocks,
            previewText: campaign.previewText ?? undefined,
            unsubscribeUrl: `${origin}/api/newsletter/unsubscribe/${s.unsubscribeToken}`,
            origin,
          }),
        })),
      );
    }
  } catch (error) {
    await prisma.campaign.update({ where: { id }, data: { status: "DRAFT" } });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to send campaign." },
      { status: 502 },
    );
  }

  const sent = await prisma.campaign.update({
    where: { id },
    data: { status: "SENT", sentAt: new Date(), recipientCount: subscribers.length },
  });

  await prisma.activityLog.create({
    data: {
      userId: session.sub,
      action: "sent campaign",
      entity: "Campaign",
      entityId: id,
      detail: `${campaign.name} — ${subscribers.length} recipients`,
    },
  });

  return NextResponse.json({ campaign: sent });
}
