"use client";

import { useTransition } from "react";
import { removeFromBag, updateBagQuantity } from "./actions";

type Props = { lineId: number; name: string; quantity: number; maxQuantity: number };

export function BagLineControls({ lineId, name, quantity, maxQuantity }: Props) {
  const [pending, startTransition] = useTransition();
  const step = (next: number) =>
    startTransition(() => updateBagQuantity(lineId, next));

  const stepper =
    "inline-flex size-9 items-center justify-center text-body transition-colors hover:bg-stone disabled:cursor-not-allowed disabled:text-ink-faint disabled:hover:bg-transparent";

  return (
    <div className="flex items-center justify-between gap-4" aria-busy={pending}>
      <div className="hairline inline-flex items-center" role="group" aria-label={`Quantity of ${name}`}>
        <button
          type="button"
          className={stepper}
          aria-label={`Decrease quantity of ${name}`}
          disabled={pending || quantity <= 1}
          onClick={() => step(quantity - 1)}
        >
          −
        </button>
        <output aria-live="polite" className="w-8 text-center text-body-sm tabular-nums">
          {quantity}
        </output>
        <button
          type="button"
          className={stepper}
          aria-label={`Increase quantity of ${name}`}
          disabled={pending || quantity >= maxQuantity}
          onClick={() => step(quantity + 1)}
        >
          +
        </button>
      </div>
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => removeFromBag(lineId))}
        className="link-underline text-caption text-ink-muted hover:text-ink"
      >
        Remove<span className="sr-only"> {name}</span>
      </button>
    </div>
  );
}
