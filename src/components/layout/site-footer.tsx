import Link from "next/link";
import { NewsletterForm } from "./newsletter-form";

const columns = [
  {
    title: "Client services",
    links: [
      { label: "Contact us", href: "/contact" },
      { label: "Shipping", href: "/help/shipping" },
      { label: "Returns and exchanges", href: "/help/returns" },
      { label: "Repairs", href: "/help/repairs" },
    ],
  },
  {
    title: "The house",
    links: [
      { label: "Our workshop", href: "/craft" },
      { label: "Boutiques", href: "/boutiques" },
      { label: "Careers", href: "/careers" },
      { label: "Sustainability", href: "/sustainability" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", href: "/legal/privacy" },
      { label: "Terms of sale", href: "/legal/terms" },
      { label: "Accessibility", href: "/legal/accessibility" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="divider mt-auto">
      <div className="container-page grid gap-12 py-section-sm lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div className="max-w-md">
          <h2 className="text-heading-sm">Letters from the workshop</h2>
          <p className="mt-3 text-body-sm text-ink-muted">
            New collections, boutique events and care advice, about once a month.
          </p>
          <div className="mt-6">
            <NewsletterForm />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-sans text-body-sm font-medium">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-body-sm text-ink-muted transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="divider">
        <div className="container-page flex flex-col gap-2 py-6 text-caption text-ink-muted sm:flex-row sm:justify-between">
          <p>© 2026 Atelier</p>
          <p>United States, USD $</p>
        </div>
      </div>
    </footer>
  );
}
