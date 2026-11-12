import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { BagSummaryLines } from "@/components/bag/bag-summary-lines";
import { getBag } from "@/lib/cart";
import { formatPrice } from "@/lib/products";
import { CheckoutForm } from "./checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <main className="container-page pb-section">
      <header className="flex items-baseline justify-between gap-4 pt-8 pb-8 lg:pt-12 lg:pb-12">
        <h1 className="text-heading-lg">Checkout</h1>
        <Link href="/bag" className="link-underline text-body-sm text-ink-muted hover:text-ink">
          Edit bag
        </Link>
      </header>
      <Suspense fallback={<p className="text-body-sm text-ink-muted">Loading checkout…</p>}>
        <Checkout />
      </Suspense>
    </main>
  );
}

async function Checkout() {
  const bag = await getBag();
  if (bag.lines.length === 0 || !bag.canCheckout) redirect("/bag");

  return (
    <div className="grid gap-10 md:grid-cols-12 md:gap-6">
      <aside aria-labelledby="order-summary" className="md:order-2 md:col-span-5 lg:col-span-4">
        <div className="bg-stone p-gutter md:sticky md:top-[calc(var(--spacing-header)+1.5rem)] lg:top-[calc(var(--spacing-header-lg)+2rem)]">
          <h2 id="order-summary" className="text-heading-sm">
            Your order
          </h2>
          <div className="mt-6">
            <BagSummaryLines lines={bag.lines} />
          </div>
          <dl className="mt-6 flex justify-between border-t border-line-strong pt-4 text-body-sm">
            <dt>Subtotal</dt>
            <dd className="tabular-nums">{formatPrice(bag.subtotalCents)}</dd>
          </dl>
          <p className="mt-2 text-caption text-ink-muted">
            Delivery and tax are shown in the payment form.
          </p>
        </div>
      </aside>
      <section aria-label="Payment" className="md:order-1 md:col-span-7 lg:col-span-8">
        <CheckoutForm />
      </section>
    </div>
  );
}
