function H({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-5 text-sm font-semibold text-white first:mt-0">{children}</h3>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-2">{children}</p>;
}

export function PrivacyPolicyContent() {
  return (
    <div>
      <p className="text-white/40">Last updated: 1 September 2026</p>

      <P>
        AssetFinder Pty Ltd (&ldquo;AssetFinder&rdquo;, &ldquo;we&rdquo;,
        &ldquo;us&rdquo;) provides QR-code asset traceability software for
        fire and building compliance teams. This policy explains what we
        collect, why, and how it&rsquo;s handled.
      </P>

      <H>Information we collect</H>
      <P>
        Account details (name, work email, organisation) when you sign up or
        book a demo; asset records you or your team create in the platform
        (asset tags, inspection history, photos and documents you upload);
        and usage data such as device, browser and log information collected
        automatically when you use the app.
      </P>

      <H>How we use it</H>
      <P>
        To operate and improve the platform, generate compliance reports, sync
        with connected services like Uptick, respond to support requests, and
        send you service updates. We don&rsquo;t sell your data.
      </P>

      <H>Sharing</H>
      <P>
        We share data with sub-processors that host or support the service
        (e.g. cloud infrastructure, email delivery) under contracts that
        require them to protect it, and with third-party integrations you
        explicitly connect, such as Uptick. We disclose data if required by
        law.
      </P>

      <H>Storage &amp; security</H>
      <P>
        Data is stored on infrastructure with encryption in transit and at
        rest. We retain asset and account data for as long as your
        organisation has an active account, plus a reasonable period after
        for legal and audit purposes.
      </P>

      <H>Your rights</H>
      <P>
        Under the Australian Privacy Principles, you can request access to,
        correction of, or deletion of your personal information. Contact us
        at charbel@assetfinder.au and we&rsquo;ll respond within a reasonable
        timeframe.
      </P>

      <H>Cookies</H>
      <P>
        We use essential cookies to keep you signed in and remember basic
        preferences. We don&rsquo;t use third-party advertising cookies.
      </P>

      <H>Contact</H>
      <P>
        Questions about this policy: charbel@assetfinder.au, AssetFinder Pty Ltd,
        Sydney, NSW, Australia.
      </P>
    </div>
  );
}

export function TermsOfServiceContent() {
  return (
    <div>
      <p className="text-white/40">Last updated: 1 September 2026</p>

      <P>
        These terms govern your use of AssetFinder, a QR-code asset
        traceability platform for fire and building compliance. By creating
        an account or using the service, you agree to them.
      </P>

      <H>The service</H>
      <P>
        AssetFinder lets you scan, verify and track building and fire safety
        assets, log inspections and service history, and generate
        audit-ready reports. Features may change as the product evolves.
      </P>

      <H>Accounts</H>
      <P>
        You&rsquo;re responsible for the accuracy of information you provide
        and for activity under your account. Keep your login credentials
        confidential and tell us promptly about any unauthorised access.
      </P>

      <H>Acceptable use</H>
      <P>
        Don&rsquo;t use AssetFinder to store or share unlawful content,
        attempt to disrupt the service, or reverse-engineer the platform.
        Compliance records you create must be accurate to the best of your
        knowledge; the platform is a record-keeping tool, not a substitute
        for qualified inspection.
      </P>

      <H>Your data</H>
      <P>
        You own the asset, inspection and compliance data your organisation
        enters into AssetFinder. We process it to provide the service and
        won&rsquo;t use it for anything else without your consent.
      </P>

      <H>Third-party integrations</H>
      <P>
        Connecting AssetFinder to third-party services such as Uptick is
        optional and governed by that provider&rsquo;s own terms. We
        aren&rsquo;t responsible for third-party service availability.
      </P>

      <H>Liability</H>
      <P>
        AssetFinder is provided &ldquo;as is.&rdquo; To the extent permitted
        by law, we&rsquo;re not liable for indirect or consequential loss
        arising from use of the service. Nothing here limits rights you have
        under the Australian Consumer Law that can&rsquo;t be excluded.
      </P>

      <H>Termination</H>
      <P>
        You can cancel your account at any time. We may suspend or terminate
        accounts that breach these terms, with notice where practical.
      </P>

      <H>Governing law</H>
      <P>These terms are governed by the laws of New South Wales, Australia.</P>

      <H>Changes</H>
      <P>
        We may update these terms from time to time; material changes will be
        notified to account holders.
      </P>
    </div>
  );
}

const sitemapSections = [
  {
    title: "Home",
    links: [
      { label: "Hero", href: "#" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Live asset records" },
      { label: "Built for the people who keep projects safe" },
      { label: "Tools and services" },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "Features" },
      { label: "Integrations" },
      { label: "Security" },
      { label: "Status" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Builders" },
      { label: "Fire contractors" },
      { label: "Certifiers" },
      { label: "Case Studies" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Uptick setup" },
      { label: "Report templates" },
      { label: "Dashboards" },
      { label: "Integrations" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us" },
      { label: "Careers" },
      { label: "News" },
      { label: "Contact" },
    ],
  },
];

export function SitemapContent() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {sitemapSections.map((section) => (
        <div key={section.title}>
          <h3 className="text-sm font-semibold text-white">{section.title}</h3>
          <ul className="mt-2 space-y-1.5">
            {section.links.map((link) => (
              <li key={link.label}>
                {link.href ? (
                  <a href={link.href} className="hover:text-white">
                    {link.label}
                  </a>
                ) : (
                  <span>{link.label}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
