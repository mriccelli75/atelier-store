import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BagSummaryLines } from "@/components/bag/bag-summary-lines";
import { getOrderBySession } from "@/lib/orders";
import { formatPrice } from "@/lib/products";
import { getStripe } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false },
};

export default function CheckoutCompletePage({
  searchParams,
}: PageProps<"/checkout/complete">) {
  return (
    <main className="container-prose pt-12 pb-section text-center lg:pt-20">
      <Suspense fallback={<p className="text-body-sm text-ink-muted">Confirming your order…</p>}>
        <Confirmation searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function Confirmation({
  searchParams,
}: Pick<PageProps<"/checkout/complete">, "searchParams">) {
  const { session_id } = await searchParams;
  const sessionId = typeof session_id === "string" ? session_id : null;

  const session = sessionId
    ? await getStripe().checkout.sessions.retrieve(sessionId).catch(() => null)
    : null;

  if (!session || session.status !== "complete") {
    return (
      <>
        <h1 className="text-heading-lg">Payment not completed</h1>
        <p className="mx-auto mt-4 max-w-[48ch] text-body text-ink-muted">
          Your order hasn&rsquo;t been placed and you haven&rsquo;t been charged. Your bag is
          saved.
        </p>
        <Link href="/checkout" className="btn btn-primary mt-8">
          Return to checkout
        </Link>
      </>
    );
  }

  const order = await getOrderBySession(session.id);
  const email = session.customer_details?.email;

  return (
    <>
      <p className="text-eyebrow text-ink-muted">Thank you</p>
      <h1 className="mt-4 text-heading-lg">Your order is confirmed</h1>
      <p className="mx-auto mt-4 max-w-[48ch] text-body text-ink-muted">
        {order && <>Order {order.number}. </>}
        {email ? <>A confirmation will be sent to {email}.</> : null}
      </p>

      {order && (
        <div className="mt-12 text-left">
          <BagSummaryLines
            lines={order.items.map((item) => ({
              id: item.id,
              slug: item.slug,
              name: item.name,
              material: item.material,
              size: item.size,
              quantity: item.quantity,
              lineTotalCents: item.unitPriceCents * item.quantity,
              image: item.imageSrc ? { src: item.imageSrc, alt: item.imageAlt ?? "" } : null,
            }))}
          />
          <dl className="mt-6 flex flex-col gap-2 border-t border-line pt-4 text-body-sm">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd className="tabular-nums">{formatPrice(session.amount_subtotal ?? 0)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Delivery</dt>
              <dd className="tabular-nums">
                {session.total_details?.amount_shipping
                  ? formatPrice(session.total_details.amount_shipping)
                  : "Complimentary"}
              </dd>
            </div>
            {!!session.total_details?.amount_tax && (
              <div className="flex justify-between">
                <dt>Tax</dt>
                <dd className="tabular-nums">{formatPrice(session.total_details.amount_tax)}</dd>
              </div>
            )}
            <div className="flex justify-between font-medium">
              <dt>Total</dt>
              <dd className="tabular-nums">{formatPrice(session.amount_total ?? 0)}</dd>
            </div>
          </dl>
        </div>
      )}

      <Link href="/new" className="btn btn-secondary mt-12">
        Continue shopping
      </Link>
    </>
  );
}
