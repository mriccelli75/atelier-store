import { desc, eq } from "drizzle-orm";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { Suspense } from "react";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { auth } from "@/lib/auth";
import { formatPrice } from "@/lib/products";
import { AuthForm, SignOutButton } from "./auth-form";

export const metadata: Metadata = {
  title: "Account",
  robots: { index: false },
};

const STATUS_LABEL = {
  pending: "Awaiting payment",
  paid: "Confirmed",
  fulfilled: "Shipped",
  cancelled: "Cancelled",
  refunded: "Refunded",
} as const;

export default function AccountPage() {
  return (
    <main className="container-page pb-section">
      <header className="pt-8 pb-8 lg:pt-12 lg:pb-12">
        <h1 className="text-heading-lg">Account</h1>
      </header>
      <Suspense fallback={<p className="text-body-sm text-ink-muted">Loading…</p>}>
        <AccountContents />
      </Suspense>
    </main>
  );
}

async function AccountContents() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return (
      <div className="max-w-md">
        <AuthForm />
      </div>
    );
  }

  const history = await db.query.orders.findMany({
    where: eq(orders.userId, session.user.id),
    orderBy: desc(orders.createdAt),
    with: { items: true },
  });
  const placed = history.filter((order) => order.status !== "pending" && order.status !== "cancelled");

  return (
    <div className="grid gap-12 md:grid-cols-12 md:gap-6">
      <section aria-labelledby="profile" className="md:col-span-4">
        <h2 id="profile" className="text-heading-sm">
          {session.user.name}
        </h2>
        <p className="mt-1 text-body-sm text-ink-muted">{session.user.email}</p>
        <div className="mt-6">
          <SignOutButton />
        </div>
      </section>

      <section aria-labelledby="orders" className="md:col-span-8">
        <h2 id="orders" className="text-heading-sm">
          Orders
        </h2>
        {placed.length === 0 ? (
          <p className="mt-6 text-body-sm text-ink-muted">You haven&rsquo;t placed any orders yet.</p>
        ) : (
          <ul className="mt-6 divider">
            {placed.map((order) => (
              <li key={order.id} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-line py-5 text-body-sm">
                <div>
                  <p className="font-medium">{order.number}</p>
                  <p className="text-caption text-ink-muted">
                    {order.createdAt.toLocaleDateString("en-US", { dateStyle: "medium" })} ·{" "}
                    {order.items.reduce((n, item) => n + item.quantity, 0)} pieces
                  </p>
                </div>
                <p className="text-ink-muted">{STATUS_LABEL[order.status]}</p>
                <p className="tabular-nums">{formatPrice(order.totalCents)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
