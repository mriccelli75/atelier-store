import Image from "next/image";
import Link from "next/link";
import { hero } from "@/lib/catalog";

// Editorial diptych: two portrait images meet at the centre line on md+,
// with the season title set large across the seam. One image on phones.
export function Hero() {
  const [left, right] = hero.images;

  return (
    <section aria-labelledby="hero-title" className="relative bg-stone">
      <div className="grid h-[calc(100svh-var(--spacing-header))] max-h-[60rem] min-h-[34rem] md:grid-cols-2 lg:h-[calc(100svh-var(--spacing-header-lg))]">
        <div className="relative">
          <Image
            src={left.src}
            alt={left.alt}
            fill
            preload
            sizes="(min-width: 48rem) 50vw, 100vw"
            className="object-cover object-[50%_30%]"
          />
        </div>
        <div className="relative hidden overflow-hidden md:block">
          <Image
            src={right.src}
            alt={right.alt}
            fill
            preload
            sizes="50vw"
            // This photo has a dark film border; scale slightly to crop it out.
            className="scale-110 object-cover object-[50%_30%]"
          />
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-black/60 via-black/25 to-transparent"
      />

      <div className="absolute inset-x-0 bottom-0">
        <div className="container-page flex flex-col items-center pb-10 text-center text-paper motion-safe:animate-rise lg:pb-16">
          <h1 id="hero-title" className="text-display">
            {hero.season}
          </h1>
          <p className="mt-4 max-w-[34ch] text-body text-paper/85 lg:text-lead">
            {hero.description}
          </p>
          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link href="/women/new" className="btn btn-inverse">
              Shop women
            </Link>
            <Link href="/men/new" className="btn btn-inverse">
              Shop men
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
