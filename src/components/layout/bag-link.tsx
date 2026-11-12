import Link from "next/link";
import { BagIcon } from "@/components/icons";
import { getBag } from "@/lib/cart";

const className =
  "relative size-10 inline-flex items-center justify-center text-ink transition-colors hover:text-ink-muted";

/** Header bag link with the live item count. Reads cookies, so render inside <Suspense>. */
export async function BagLink() {
  const { count } = await getBag();
  return (
    <Link
      href="/bag"
      aria-label={`Shopping bag, ${count} ${count === 1 ? "item" : "items"}`}
      className={className}
    >
      <BagIcon />
      {count > 0 && (
        <span
          aria-hidden="true"
          className="absolute top-1.5 right-0.5 flex min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[0.625rem] leading-4 text-paper"
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}

export function BagLinkFallback() {
  return (
    <Link href="/bag" aria-label="Shopping bag" className={className}>
      <BagIcon />
    </Link>
  );
}
