export type BlockType =
  | "heading"
  | "text"
  | "image"
  | "hero"
  | "button"
  | "buttons"
  | "cta"
  | "band"
  | "columns"
  | "divider"
  | "spacer"
  | "social";

export type EmailBlock = {
  id: string;
  type: BlockType;
  fields: Record<string, string>;
};

export const BLOCK_LABELS: Record<BlockType, string> = {
  heading: "Heading",
  text: "Text",
  image: "Image",
  hero: "Hero Banner",
  button: "Button",
  buttons: "Two Buttons",
  cta: "Call to Action Banner",
  band: "Colored Band",
  columns: "Two Columns",
  divider: "Divider",
  spacer: "Spacer",
  social: "Social Links",
};

export const BLOCK_FIELDS: Record<BlockType, { key: string; label: string; type: "text" | "textarea" | "url" | "color" }[]> = {
  heading: [
    { key: "text", label: "Heading", type: "text" },
    { key: "align", label: "Align (left/center/right)", type: "text" },
  ],
  text: [{ key: "body", label: "Body", type: "textarea" }],
  image: [
    { key: "url", label: "Image URL", type: "url" },
    { key: "alt", label: "Alt Text", type: "text" },
    { key: "link", label: "Link URL (optional)", type: "url" },
  ],
  hero: [
    { key: "image", label: "Background Image URL", type: "url" },
    { key: "title", label: "Title", type: "text" },
    { key: "subtitle", label: "Subtitle", type: "text" },
  ],
  button: [
    { key: "label", label: "Button Text", type: "text" },
    { key: "url", label: "Button URL", type: "url" },
    { key: "align", label: "Align (left/center/right)", type: "text" },
  ],
  buttons: [
    { key: "label1", label: "Button 1 Text", type: "text" },
    { key: "url1", label: "Button 1 URL", type: "url" },
    { key: "label2", label: "Button 2 Text", type: "text" },
    { key: "url2", label: "Button 2 URL", type: "url" },
  ],
  cta: [
    { key: "heading", label: "Heading", type: "text" },
    { key: "body", label: "Body", type: "textarea" },
    { key: "label", label: "Button Text", type: "text" },
    { key: "url", label: "Button URL", type: "url" },
  ],
  band: [
    { key: "text", label: "Text", type: "textarea" },
    { key: "bgColor", label: "Background Color", type: "color" },
  ],
  columns: [
    { key: "heading1", label: "Column 1 Heading", type: "text" },
    { key: "body1", label: "Column 1 Body", type: "textarea" },
    { key: "heading2", label: "Column 2 Heading", type: "text" },
    { key: "body2", label: "Column 2 Body", type: "textarea" },
  ],
  divider: [],
  spacer: [{ key: "height", label: "Height (px)", type: "text" }],
  social: [
    { key: "linkedin", label: "LinkedIn URL", type: "url" },
    { key: "twitter", label: "Twitter / X URL", type: "url" },
  ],
};

const BRAND_LIME = "#c8e600";
const BRAND_DARK = "#0b0e12";

function esc(value: string | undefined): string {
  if (!value) return "";
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function paras(text: string | undefined): string {
  if (!text) return "";
  return text
    .split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 16px;">${esc(p).replace(/\n/g, "<br/>")}</p>`)
    .join("");
}

function row(inner: string, padding = "24px 32px"): string {
  return `<tr><td style="padding:${padding};">${inner}</td></tr>`;
}

function renderBlock(block: EmailBlock): string {
  const f = block.fields;
  switch (block.type) {
    case "heading":
      return row(
        `<h2 style="margin:0;font-size:22px;line-height:1.3;color:${BRAND_DARK};text-align:${f.align || "left"};font-family:Arial,sans-serif;">${esc(f.text)}</h2>`,
      );
    case "text":
      return row(`<div style="font-size:15px;line-height:1.6;color:#374151;font-family:Arial,sans-serif;">${paras(f.body)}</div>`);
    case "image":
      return row(
        f.link
          ? `<a href="${esc(f.link)}"><img src="${esc(f.url)}" alt="${esc(f.alt)}" style="width:100%;max-width:536px;display:block;border-radius:8px;" /></a>`
          : `<img src="${esc(f.url)}" alt="${esc(f.alt)}" style="width:100%;max-width:536px;display:block;border-radius:8px;" />`,
        "0 32px",
      );
    case "hero":
      return `<tr><td style="padding:0;"><div style="background:${BRAND_DARK} url('${esc(f.image)}') center/cover no-repeat;padding:64px 32px;text-align:center;"><h1 style="margin:0 0 8px;color:#fff;font-size:28px;font-family:Arial,sans-serif;">${esc(f.title)}</h1><p style="margin:0;color:rgba(255,255,255,0.7);font-size:15px;font-family:Arial,sans-serif;">${esc(f.subtitle)}</p></div></td></tr>`;
    case "button":
      return row(
        `<table role="presentation" align="${f.align === "left" ? "left" : f.align === "right" ? "right" : "center"}"><tr><td style="border-radius:999px;background:${BRAND_LIME};"><a href="${esc(f.url)}" style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:bold;color:${BRAND_DARK};text-decoration:none;font-family:Arial,sans-serif;">${esc(f.label)}</a></td></tr></table>`,
      );
    case "buttons":
      return row(
        `<table role="presentation" align="center"><tr>
          <td style="border-radius:999px;background:${BRAND_LIME};padding-right:8px;"><a href="${esc(f.url1)}" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:bold;color:${BRAND_DARK};text-decoration:none;font-family:Arial,sans-serif;">${esc(f.label1)}</a></td>
          <td style="border-radius:999px;border:1px solid #d1d5db;"><a href="${esc(f.url2)}" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:bold;color:#374151;text-decoration:none;font-family:Arial,sans-serif;">${esc(f.label2)}</a></td>
        </tr></table>`,
      );
    case "cta":
      return row(
        `<div style="background:${BRAND_DARK};border-radius:12px;padding:32px;text-align:center;">
          <h3 style="margin:0 0 8px;color:#fff;font-size:20px;font-family:Arial,sans-serif;">${esc(f.heading)}</h3>
          <p style="margin:0 0 20px;color:rgba(255,255,255,0.6);font-size:14px;font-family:Arial,sans-serif;">${esc(f.body)}</p>
          <table role="presentation" align="center"><tr><td style="border-radius:999px;background:${BRAND_LIME};"><a href="${esc(f.url)}" style="display:inline-block;padding:12px 28px;font-size:14px;font-weight:bold;color:${BRAND_DARK};text-decoration:none;font-family:Arial,sans-serif;">${esc(f.label)}</a></td></tr></table>
        </div>`,
      );
    case "band":
      return `<tr><td style="padding:20px 32px;background:${esc(f.bgColor) || BRAND_LIME};text-align:center;"><p style="margin:0;font-size:14px;font-weight:bold;color:${BRAND_DARK};font-family:Arial,sans-serif;">${esc(f.text)}</p></td></tr>`;
    case "columns":
      return row(
        `<table role="presentation" width="100%"><tr>
          <td width="50%" style="vertical-align:top;padding-right:16px;font-family:Arial,sans-serif;">
            <h4 style="margin:0 0 8px;font-size:15px;color:${BRAND_DARK};">${esc(f.heading1)}</h4>
            <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.5;">${esc(f.body1)}</p>
          </td>
          <td width="50%" style="vertical-align:top;padding-left:16px;font-family:Arial,sans-serif;">
            <h4 style="margin:0 0 8px;font-size:15px;color:${BRAND_DARK};">${esc(f.heading2)}</h4>
            <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.5;">${esc(f.body2)}</p>
          </td>
        </tr></table>`,
      );
    case "divider":
      return `<tr><td style="padding:0 32px;"><hr style="border:none;border-top:1px solid #e5e7eb;margin:0;" /></td></tr>`;
    case "spacer":
      return `<tr><td style="height:${parseInt(f.height || "24", 10)}px;line-height:${parseInt(f.height || "24", 10)}px;font-size:0;">&nbsp;</td></tr>`;
    case "social":
      return row(
        `<table role="presentation" align="center"><tr>
          ${f.linkedin ? `<td style="padding:0 8px;"><a href="${esc(f.linkedin)}" style="color:#6b7280;font-size:13px;font-family:Arial,sans-serif;text-decoration:none;">LinkedIn</a></td>` : ""}
          ${f.twitter ? `<td style="padding:0 8px;"><a href="${esc(f.twitter)}" style="color:#6b7280;font-size:13px;font-family:Arial,sans-serif;text-decoration:none;">X / Twitter</a></td>` : ""}
        </tr></table>`,
      );
    default:
      return "";
  }
}

export function renderEmailHtml(options: {
  blocks: EmailBlock[];
  previewText?: string;
  unsubscribeUrl?: string;
  origin: string;
}): string {
  const { blocks, previewText, unsubscribeUrl, origin } = options;
  const body = blocks.map(renderBlock).join("\n");

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>AssetFinder</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f9;">
${previewText ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(previewText)}</div>` : ""}
<table role="presentation" width="100%" style="background:#f4f6f9;padding:32px 16px;">
<tr><td align="center">
<table role="presentation" width="600" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;">
<tr><td style="padding:24px 32px 0;">
<img src="${esc(origin)}/assetfinder-logo.png" alt="AssetFinder" style="height:24px;" />
</td></tr>
${body}
<tr><td style="padding:24px 32px;border-top:1px solid #e5e7eb;text-align:center;">
<p style="margin:0;font-size:12px;color:#9ca3af;font-family:Arial,sans-serif;">
You're receiving this because you subscribed to AssetFinder updates.
${unsubscribeUrl ? ` <a href="${esc(unsubscribeUrl)}" style="color:#9ca3af;">Unsubscribe</a>` : ""}
</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

export function blockSummary(block: EmailBlock): string {
  const f = block.fields;
  switch (block.type) {
    case "heading":
      return f.text || "(empty heading)";
    case "text":
      return (f.body || "(empty text)").slice(0, 60);
    case "button":
      return f.label || "(button)";
    case "cta":
      return f.heading || "(call to action)";
    case "hero":
      return f.title || "(hero banner)";
    default:
      return BLOCK_LABELS[block.type];
  }
}
