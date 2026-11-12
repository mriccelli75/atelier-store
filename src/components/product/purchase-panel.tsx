"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { addToBag, type AddToBagState } from "@/app/bag/actions";
import type { Product } from "@/lib/products";

type Props = Pick<Product, "slug" | "name" | "sizes" | "stock">;

// Back-in-stock notifications are still front-end only.
export function PurchasePanel({ slug, name, sizes, stock }: Props) {
  const soldOut = stock.status === "out_of_stock";
  const [size, setSize] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [state, formAction, pending] = useActionState<AddToBagState, FormData>(
    addToBag,
    { status: "idle" },
  );
  // Hide the last result once the shopper changes size.
  const [shownState, setShownState] = useState<AddToBagState | null>(null);
  const result = state === shownState ? null : state;
  const [notifyEmail, setNotifyEmail] = useState<string | null>(null);

  if (soldOut) {
    return notifyEmail ? (
      <p role="status" className="text-body-sm text-success">
        We’ll email {notifyEmail} when the {name.toLowerCase()} is back in stock.
      </p>
    ) : (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const email = new FormData(e.currentTarget).get("email");
          setNotifyEmail(String(email));
        }}
        className="flex flex-col gap-4"
      >
        <p className="text-body-sm text-ink-muted">
          This piece is sold out. Leave your email and we’ll tell you when it’s back.
        </p>
        <label>
          <span className="sr-only">Email address</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="Email address"
            className="input-field"
          />
        </label>
        <button type="submit" className="btn btn-secondary btn-block">
          Notify me
        </button>
      </form>
    );
  }

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (sizes && !size) {
          e.preventDefault();
          setError("Select a size to add this to your bag.");
        }
      }}
      className="flex flex-col gap-6"
    >
      <input type="hidden" name="slug" value={slug} />
      {sizes && (
        <fieldset>
          <legend className="mb-3 flex w-full justify-between text-body-sm">
            <span>Size (EU)</span>
            {size && <span className="text-ink-muted">Selected: {size}</span>}
          </legend>
          <div className="grid grid-cols-7 gap-1">
            {sizes.map((option) => (
              <label key={option.label} className="relative">
                <input
                  type="radio"
                  name="size"
                  value={option.label}
                  disabled={!option.available}
                  checked={size === option.label}
                  onChange={() => {
                    setSize(option.label);
                    setError(null);
                    setShownState(state);
                  }}
                  className="peer sr-only"
                />
                <span className="hairline flex h-11 cursor-pointer items-center justify-center text-body-sm transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink peer-disabled:cursor-not-allowed peer-disabled:text-ink-faint peer-disabled:line-through hover:border-ink peer-disabled:hover:border-line">
                  {option.label}
                </span>
                {!option.available && (
                  <span className="sr-only">, sold out</span>
                )}
              </label>
            ))}
          </div>
          {error && (
            <p role="alert" className="mt-3 text-body-sm text-sale">
              {error}
            </p>
          )}
        </fieldset>
      )}

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={pending}
          aria-disabled={pending}
          className="btn btn-primary btn-block disabled:opacity-60"
        >
          {pending ? "Adding…" : result?.status === "added" ? "Added to bag" : "Add to bag"}
        </button>
        <p
          role="status"
          className={`min-h-5 text-body-sm ${result?.status === "error" ? "text-sale" : "text-success"}`}
        >
          {result?.status === "added" && (
            <>
              {result.message}{" "}
              <Link href="/bag" className="link-underline text-ink">
                View bag
              </Link>
            </>
          )}
          {result?.status === "error" && result.message}
        </p>
      </div>
    </form>
  );
}
