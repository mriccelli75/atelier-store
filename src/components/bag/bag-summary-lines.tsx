import Image from "next/image";
import Link from "next/link";
import { formatPrice, productHref } from "@/lib/products";

type SummaryLine = {
  id: number | string;
  slug: string;
  name: string;
  material: string;
  size: string | null;
  quantity: number;
  lineTotalCents: number;
  image: { src: string; alt: string } | null;
};

/** Compact, read-only list of lines (checkout and order summaries). */
export function BagSummaryLines({ lines }: { lines: SummaryLine[] }) {
  return (
    <ul className="flex flex-col gap-4">
      {lines.map((line) => (
        <li key={line.id} className="grid grid-cols-[4rem_1fr_auto] gap-4">
          <div className="product-media">
            {line.image && (
              <Image src={line.image.src} alt={line.image.alt} fill sizes="4rem" className="object-cover" />
            )}
          </div>
          <div className="min-w-0 text-body-sm">
            <Link href={productHref(line)} className="font-medium hover:underline hover:underline-offset-4">
              {line.name}
            </Link>
            <p className="text-caption text-ink-muted">
              {line.material}
              {line.size && ` · Size ${line.size}`}
              {` · Qty ${line.quantity}`}
            </p>
          </div>
          <p className="text-body-sm tabular-nums">{formatPrice(line.lineTotalCents)}</p>
        </li>
      ))}
    </ul>
  );
}
