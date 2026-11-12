// Bag types, safe for client components.
import type { ProductImage, ProductSize } from "@/db/schema";

export type BagLineIssue = "sold_out" | "size_unavailable" | "insufficient_stock";

export type BagLine = {
  id: number;
  slug: string;
  name: string;
  material: string;
  image: ProductImage | null;
  size: string | null;
  sizes: ProductSize[] | null;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
  /** Total stock for the product (shared across sizes). */
  stockQuantity: number;
  /** Most this line can be raised to, given stock and the other lines of the same product. */
  maxQuantity: number;
  issue: BagLineIssue | null;
};

export type Bag = {
  id: string | null;
  lines: BagLine[];
  count: number;
  subtotalCents: number;
  /** False when any line has an issue that blocks checkout. */
  canCheckout: boolean;
};

export const EMPTY_BAG: Bag = {
  id: null,
  lines: [],
  count: 0,
  subtotalCents: 0,
  canCheckout: false,
};

export function bagIssueLabel(line: Pick<BagLine, "issue" | "stockQuantity">) {
  switch (line.issue) {
    case "sold_out":
      return "Sold out. Remove it to continue.";
    case "size_unavailable":
      return "This size is no longer available.";
    case "insufficient_stock":
      return line.stockQuantity === 1
        ? "Only 1 left. Reduce the quantity to continue."
        : `Only ${line.stockQuantity} left. Reduce the quantity to continue.`;
    default:
      return null;
  }
}
