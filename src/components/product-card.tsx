import Image from "next/image";
import Link from "next/link";
import { formatPrice, productHref, type Product } from "@/lib/products";

type Props = {
  product: Product;
  /** `sizes` hint for next/image; defaults to a 2 → 4 column grid. */
  sizes?: string;
};

export function ProductCard({
  product,
  sizes = "(min-width: 64rem) 25vw, 50vw",
}: Props) {
  const [image] = product.images;
  const soldOut = product.stock.status === "out_of_stock";
  const badge = soldOut ? "Sold out" : product.isNew ? "New" : null;

  return (
    <Link href={productHref(product)} className="group block">
      <div className="product-media">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          className="object-cover"
        />
        {badge && (
          <span className="hairline absolute top-3 left-3 bg-paper px-2 py-1 text-caption">
            {badge}
          </span>
        )}
      </div>
      <div className="mt-3 flex flex-col gap-0.5 pr-2">
        <h3 className="font-sans text-body-sm font-medium group-hover:underline group-hover:underline-offset-4">
          {product.name}
        </h3>
        <p className="text-caption text-ink-muted">{product.material}</p>
        <p className="mt-1 text-body-sm">{formatPrice(product.priceCents)}</p>
      </div>
    </Link>
  );
}
