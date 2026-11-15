import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  title: string;
  description: ReactNode;
  /** Main way back in; defaults to new arrivals. */
  action?: { label: string; href: string };
};

/**
 * Not-found message used by app/not-found.tsx and by dynamic routes whose
 * param doesn't match anything.
 *
 * Dynamic routes render this directly (with `robots: { index: false }` from
 * generateMetadata) instead of calling notFound(). With Cache Components,
 * notFound() in an unknown param's request-time render sends an empty
 * `__next_error__` document that only shows this UI once JavaScript runs.
 */
export function NotFoundView({
  title,
  description,
  action = { label: "Shop new arrivals", href: "/new" },
}: Props) {
  return (
    <main className="container-prose section flex flex-col items-center text-center">
      <h1 className="text-heading-lg">{title}</h1>
      <p className="mt-4 max-w-[44ch] text-body text-ink-muted">{description}</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href={action.href} className="btn btn-primary">
          {action.label}
        </Link>
        <Link href="/" className="btn btn-secondary">
          Go to the homepage
        </Link>
      </div>
    </main>
  );
}

/** Metadata for a NotFoundView rendered by a dynamic route. */
export const notFoundMetadata = {
  title: "Page not found",
  robots: { index: false },
};
