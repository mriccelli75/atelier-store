import Image from "next/image";
import type { ProductImage } from "@/lib/products";

/**
 * Phones: a swipeable row of full-width images (the next one peeks in).
 * md+ (beside the product panel): the first image full width, the rest stacked two to a row, so the
 * whole gallery scrolls past the sticky product panel.
 */
export function ProductGallery({ images }: { images: ProductImage[] }) {
  const [first, ...rest] = images;

  return (
    <>
      {/* Phone */}
      <ul
        aria-label="Product images"
        className="flex snap-x snap-mandatory gap-1 overflow-x-auto [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden"
      >
        {images.map((image, i) => (
          <li
            key={image.src}
            className="product-media w-[88%] shrink-0 snap-start sm:w-[60%]"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              preload={i === 0}
              sizes="(min-width: 40rem) 60vw, 88vw"
              className="object-cover"
            />
          </li>
        ))}
      </ul>

      {/* Tablet / desktop */}
      <div className="hidden grid-cols-2 gap-1 md:grid">
        <div className="product-media col-span-2">
          <Image
            src={first.src}
            alt={first.alt}
            fill
            preload
            sizes="58vw"
            className="object-cover"
          />
        </div>
        {rest.map((image) => (
          <div key={image.src} className="product-media">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="29vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </>
  );
}
