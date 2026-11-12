import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { bagIssueLabel } from "@/lib/bag-types";
import { getBag } from "@/lib/cart";
import { formatPrice, productHref } from "@/lib/products";
import { BagLineControls } from "./bag-line-controls";

export const metadata: Metadata = {
  title: "Shopping bag",
  robots: { index: false },
};

export default function BagPage() {
  return (
    <main className="container-page pb-section">
      <header className="pt-8 pb-8 lg:pt-12 lg:pb-12">
        <h1 className="text-heading-lg">Shopping bag</h1>
      </header>
      <Suspense fallback={<p className="text-body-sm text-ink-muted">Loading your bag…</p>}>
        <BagContents />
      </Suspense>
    </main>
  );
}

async function BagContents() {
  const bag = await getBag();

  if (bag.lines.length === 0) {
    return (
      <div className="divider py-section-sm text-center">
        <p className="text-body text-ink-muted">Your bag is empty.</p>
        <Link href="/new" className="btn btn-primary mt-8">
          Discover new arrivals
        </Link>
      </div>
    );
  }

  const count = `${bag.count} ${bag.count === 1 ? "piece" : "pieces"}`;

  return (
    <div className="grid gap-12 md:grid-cols-12 md:gap-6">
      <section aria-label="Items in your bag" className="md:col-span-7 lg:col-span-8">
        <p className="mb-4 text-caption text-ink-muted">{count}</p>
        <ul className="divider">
          {bag.lines.map((line) => {
            const issue = bagIssueLabel(line);
            return (
              <li key={line.id} className="grid grid-cols-[6rem_1fr] gap-4 border-b border-line py-6 sm:grid-cols-[8rem_1fr] sm:gap-6">
                <Link href={productHref(line)} className="product-media block" tabIndex={-1}>
                  {line.image && (
                    <Image
                      src={line.image.src}
                      alt={line.image.alt}
                      fill
                      sizes="(min-width: 40rem) 8rem, 6rem"
                      className="object-cover"
                    />
                  )}
                </Link>
                <div className="flex min-w-0 flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="font-sans text-body-sm font-medium">
                        <Link href={productHref(line)} className="hover:underline hover:underline-offset-4">
                          {line.name}
                        </Link>
                      </h2>
                      <p className="text-caption text-ink-muted">{line.material}</p>
                      {line.size && <p className="mt-1 text-caption text-ink-muted">Size {line.size}</p>}
                    </div>
                    <p className="shrink-0 text-body-sm tabular-nums">
                      {formatPrice(line.lineTotalCents)}
                    </p>
                  </div>
                  {issue && (
                    <p role="alert" className="text-caption text-sale">
                      {issue}
                    </p>
                  )}
                  <div className="mt-auto">
                    <BagLineControls
                      lineId={line.id}
                      name={line.name}
                      quantity={line.quantity}
                      maxQuantity={line.maxQuantity}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <aside
        aria-labelledby="summary"
        className="md:col-span-5 lg:col-span-4"
      >
        <div className="bg-stone p-gutter md:sticky md:top-[calc(var(--spacing-header)+1.5rem)] lg:top-[calc(var(--spacing-header-lg)+2rem)]">
          <h2 id="summary" className="text-heading-sm">Summary</h2>
          <dl className="mt-6 flex flex-col gap-3 text-body-sm">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd className="tabular-nums">{formatPrice(bag.subtotalCents)}</dd>
            </div>
            <div className="flex justify-between text-ink-muted">
              <dt>Delivery</dt>
              <dd>Calculated at checkout</dd>
            </div>
            <div className="flex justify-between text-ink-muted">
              <dt>Tax</dt>
              <dd>Calculated at checkout</dd>
            </div>
          </dl>
          {bag.canCheckout ? (
            <Link href="/checkout" className="btn btn-primary btn-block mt-8">
              Checkout
            </Link>
          ) : (
            <>
              <span aria-disabled="true" className="btn btn-primary btn-block mt-8 cursor-not-allowed opacity-60">
                Checkout
              </span>
              <p className="mt-3 text-caption text-sale">
                Update the items marked above to continue.
              </p>
            </>
          )}
          <p className="mt-6 text-caption text-ink-muted">
            Complimentary standard delivery. Returns within 30 days.
          </p>
        </div>
      </aside>
    </div>
  );
}
