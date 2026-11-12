import Link from "next/link";
import type { ReactNode } from "react";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/products";

export type Crumb = { label: string; href?: string };
export type ListingTab = { label: string; href: string; active: boolean };

type Props = {
  /** Trail after "Home"; the last crumb is the current page. */
  breadcrumbs: Crumb[];
  /** Small uppercase line above the title, e.g. the season. */
  eyebrow?: string;
  title: string;
  description: string;
  /** Accessible name for the tab bar, e.g. "Men categories". */
  tabsLabel: string;
  tabs: ListingTab[];
  products: Product[];
  /** Shown in place of the grid when there are no products. */
  empty: ReactNode;
};

/**
 * Shared product-listing page: breadcrumb, centred title, sticky filter tabs
 * with a piece count, and the product grid. Used by shop sections (/men) and
 * new arrivals (/new).
 */
export function ListingLayout({
  breadcrumbs,
  eyebrow,
  title,
  description,
  tabsLabel,
  tabs,
  products,
  empty,
}: Props) {
  const count = `${products.length} ${products.length === 1 ? "piece" : "pieces"}`;
  const trail: Crumb[] = [{ label: "Home", href: "/" }, ...breadcrumbs];

  return (
    <main>
      <nav aria-label="Breadcrumb" className="container-page py-4">
        <ol className="flex flex-wrap gap-x-2 text-caption text-ink-muted">
          {trail.map((crumb, i) => {
            const current = i === trail.length - 1;
            return (
              <li key={crumb.label} className="flex gap-x-2">
                {i > 0 && <span aria-hidden="true">/</span>}
                {current || !crumb.href ? (
                  <span aria-current={current ? "page" : undefined} className="text-ink">
                    {crumb.label}
                  </span>
                ) : (
                  <Link href={crumb.href} className="hover:text-ink">
                    {crumb.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <header className="container-page pt-6 pb-8 text-center lg:pt-10 lg:pb-12">
        {eyebrow && <p className="text-eyebrow mb-4 text-ink-muted">{eyebrow}</p>}
        <h1 className="text-heading-lg">{title}</h1>
        <p className="mx-auto mt-3 max-w-[48ch] text-body text-ink-muted">{description}</p>
      </header>

      <div className="container-page sticky top-[var(--spacing-header)] z-10 bg-paper lg:top-[var(--spacing-header-lg)]">
        <div className="flex items-center justify-between gap-6 border-b border-line">
          <nav aria-label={tabsLabel} className="-mb-px min-w-0">
            <ul className="flex gap-6 overflow-x-auto [scrollbar-width:none] sm:gap-8 [&::-webkit-scrollbar]:hidden">
              {tabs.map((tab) => (
                <li key={tab.href} className="shrink-0">
                  <Link
                    href={tab.href}
                    aria-current={tab.active ? "page" : undefined}
                    className={`text-eyebrow block border-b py-4 transition-colors ${
                      tab.active
                        ? "border-ink text-ink"
                        : "border-transparent text-ink-muted hover:text-ink"
                    }`}
                  >
                    {tab.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="hidden shrink-0 text-caption text-ink-muted sm:block">{count}</p>
        </div>
      </div>

      <section aria-label="Products" className="container-page pt-8 pb-section lg:pt-12">
        <p className="mb-6 text-caption text-ink-muted sm:hidden">{count}</p>
        {products.length > 0 ? (
          <ul className="product-grid">
            {products.map((product) => (
              <li key={product.slug}>
                <ProductCard
                  product={product}
                  sizes="(min-width: 80rem) 25vw, (min-width: 48rem) 33vw, 50vw"
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-section-sm text-center">{empty}</div>
        )}
      </section>
    </main>
  );
}
