import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ScanPortalClient } from "./ScanPortalClient";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const client = await prisma.crmContact.findUnique({
    where: { portalSlug: slug },
    select: { name: true, company: true },
  });

  if (!client) {
    return { title: "Asset Search | AssetFinder" };
  }

  const clientName = client.company || client.name;
  const title = `${clientName} Asset Search | AssetFinder`;
  const description = `Scan or search a barcode to pull up the live compliance record for ${clientName}'s fire and building assets — verified inspections, service history, and status at a glance.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [{ url: "/af-header.png" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/af-header.png"],
    },
  };
}

export default function ScanPortalPage({ params }: Props) {
  return <ScanPortalClient params={params} />;
}
