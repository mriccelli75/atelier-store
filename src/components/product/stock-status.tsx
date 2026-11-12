import { stockLabel, type Product } from "@/lib/products";

const dotColor = {
  in_stock: "bg-success",
  low_stock: "bg-sale",
  out_of_stock: "bg-ink-faint",
} as const;

export function StockStatus({ product }: { product: Product }) {
  return (
    <p className="flex items-center gap-2 text-body-sm">
      <span
        aria-hidden="true"
        className={`size-1.5 rounded-full ${dotColor[product.stock.status]}`}
      />
      {stockLabel(product)}
    </p>
  );
}
