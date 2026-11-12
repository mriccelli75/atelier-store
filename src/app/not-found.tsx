import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container-prose section flex flex-col items-center text-center">
      <h1 className="text-heading-lg">We can’t find that page</h1>
      <p className="mt-4 max-w-[44ch] text-body text-ink-muted">
        The piece may have sold out for good, or the link may be out of date.
        Try the new collection instead.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/new" className="btn btn-primary">
          Shop new arrivals
        </Link>
        <Link href="/" className="btn btn-secondary">
          Go to the homepage
        </Link>
      </div>
    </main>
  );
}
