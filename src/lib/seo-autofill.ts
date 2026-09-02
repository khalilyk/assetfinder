type Section = { id: string; type: string; fields: Record<string, string> };

export interface GeneratedSeo {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  primaryQuestion: string;
  directAnswer: string;
  faqJson: string;
  aiSummary: string;
  keyFacts: string;
  structuredData: string;
}

const AU_DEFAULT_KEYWORDS = [
  "fire safety compliance Australia",
  "AS 1851 inspections",
  "building asset register",
  "QR code asset tracking",
];

function truncate(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trim() + "…";
}

export function generateSeoFromPage(title: string, sections: Section[]): GeneratedSeo {
  const pairs: { heading: string; body: string }[] = [];
  const headings: string[] = [];
  const bodies: string[] = [];

  for (const s of sections) {
    const entries = Object.entries(s.fields).filter(([, v]) => v && v.trim());
    const headingEntry = entries.find(([k]) => /heading|title/i.test(k));
    const bodyEntry =
      entries.find(([k]) => /body|description|text|content|subheading|copy/i.test(k)) ??
      entries.find(([k]) => k !== headingEntry?.[0]);

    const heading = headingEntry?.[1]?.trim() ?? "";
    const body = bodyEntry?.[1]?.trim() ?? "";
    if (heading) headings.push(heading);
    if (body) bodies.push(body);
    if (heading || body) pairs.push({ heading: heading || s.type, body });
  }

  const firstBody = bodies[0] ?? "";
  const allText = [title, ...headings, ...bodies].filter(Boolean).join(" ");

  const metaTitle = truncate(`${title} | AssetFinder`, 60);
  const metaDescription = truncate(
    `${firstBody || allText || title} Built for Australian fire and building compliance teams.`,
    155,
  );

  const derivedKeywords = Array.from(
    new Set((`${title} ${headings.join(" ")}`.toLowerCase().match(/[a-z]{4,}/g) ?? []).slice(0, 8)),
  );
  const keywords = Array.from(new Set([...derivedKeywords, ...AU_DEFAULT_KEYWORDS])).join(", ");

  const primaryQuestion = `What is ${title} and how does it help Australian building owners stay compliant?`;
  const directAnswer =
    truncate(firstBody || allText, 300) ||
    `${title} helps Australian building and fire-safety teams track assets and prove compliance with AS 1851.`;

  const faq = pairs
    .filter((p) => p.body)
    .slice(0, 3)
    .map((p) => ({ question: `What is "${p.heading}"?`, answer: truncate(p.body, 200) }));
  if (faq.length === 0) {
    faq.push({ question: `What is ${title}?`, answer: directAnswer });
  }

  const keyFacts = pairs
    .filter((p) => p.body)
    .slice(0, 4)
    .map((p) => ({ label: p.heading, value: truncate(p.body, 100) }));
  if (keyFacts.length === 0 && firstBody) {
    keyFacts.push({ label: title, value: truncate(firstBody, 100) });
  }

  const aiSummary = truncate(
    `${title}: ${allText || "An AssetFinder page for Australian fire and building compliance teams."} Relevant to Australian fire and building compliance under AS 1851.`,
    500,
  );

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description: metaDescription,
    inLanguage: "en-AU",
    about: { "@type": "Thing", name: "Fire and building asset compliance" },
    audience: { "@type": "Audience", audienceType: "Australian building owners and facility managers" },
  };

  return {
    metaTitle,
    metaDescription,
    keywords,
    primaryQuestion,
    directAnswer,
    faqJson: JSON.stringify(faq, null, 2),
    aiSummary,
    keyFacts: JSON.stringify(keyFacts, null, 2),
    structuredData: JSON.stringify(structuredData, null, 2),
  };
}
