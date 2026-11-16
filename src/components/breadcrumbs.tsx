import Link from "next/link";

export type Crumb = { label: string; href?: string };

/** "Home / …" trail. Pass the crumbs after Home; the last one is the current page. */
export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  const trail: Crumb[] = [{ label: "Home", href: "/" }, ...crumbs];

  return (
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
  );
}
