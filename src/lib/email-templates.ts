import type { BlockType, EmailBlock } from "./email-blocks";

function id() {
  return Math.random().toString(36).slice(2, 10);
}

function block(type: BlockType, fields: Record<string, string>): EmailBlock {
  return { id: id(), type, fields };
}

export type EmailTemplate = {
  key: string;
  label: string;
  description: string;
  blocks: () => EmailBlock[];
};

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    key: "blank",
    label: "Blank",
    description: "Start from an empty canvas.",
    blocks: () => [],
  },
  {
    key: "announcement",
    label: "Announcement",
    description: "A single hero moment for product news or updates.",
    blocks: () => [
      block("hero", { image: "/af-header.png", title: "Something new from AssetFinder", subtitle: "Here's what's changed" }),
      block("heading", { text: "Big news", align: "left" }),
      block("text", { body: "Write a short, clear summary of what's new and why it matters to your customers." }),
      block("button", { label: "Learn more", url: "https://", align: "left" }),
      block("divider", {}),
      block("social", { linkedin: "", twitter: "" }),
    ],
  },
  {
    key: "digest",
    label: "Newsletter Digest",
    description: "A roundup with two columns and a closing CTA.",
    blocks: () => [
      block("heading", { text: "This month at AssetFinder", align: "left" }),
      block("text", { body: "A quick roundup of what's happened this month." }),
      block("columns", {
        heading1: "Compliance tip",
        body1: "Share a short best-practice tip.",
        heading2: "Customer spotlight",
        body2: "Highlight a customer win.",
      }),
      block("divider", {}),
      block("cta", {
        heading: "Ready to see it in action?",
        body: "Book a 15-minute walkthrough with our team.",
        label: "Book a demo",
        url: "https://",
      }),
    ],
  },
  {
    key: "product-update",
    label: "Product Update",
    description: "Feature highlight with a strong call to action.",
    blocks: () => [
      block("band", { text: "NEW FEATURE", bgColor: "#c8e600" }),
      block("heading", { text: "Introducing …", align: "left" }),
      block("image", { url: "/af-demo.png", alt: "Product screenshot", link: "" }),
      block("text", { body: "Describe the feature and the problem it solves." }),
      block("buttons", { label1: "Try it now", url1: "https://", label2: "Read the docs", url2: "https://" }),
    ],
  },
];
