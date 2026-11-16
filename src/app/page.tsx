import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/home/hero";
import { ProductCard } from "@/components/product-card";
import { ServiceCardRow } from "@/components/services/service-card";
import { getCategories, getProducts } from "@/db/queries";
import {
  cognacEdit,
  craft,
  newArrivalSlugs,
  tailoring,
} from "@/lib/catalog";
import { categoryHref } from "@/lib/products";
import { servicePromises, services, servicesIntro } from "@/lib/services";

function SectionHeading({
  id,
  title,
  href,
  linkLabel,
}: {
  id: string;
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 lg:mb-12">
      <h2 id={id} className="text-heading">
        {title}
      </h2>
      {href && linkLabel && (
        <Link href={href} className="link-underline shrink-0 text-body-sm">
          {linkLabel}
        </Link>
      )}
    </div>
  );
}

export default async function Home() {
  const [newArrivals, cognacProducts, categories] = await Promise.all([
    getProducts(newArrivalSlugs),
    getProducts(cognacEdit.productSlugs),
    getCategories(),
  ]);

  return (
    <main>
      <Hero />

      {/* New arrivals */}
      <section aria-labelledby="new-arrivals" className="section container-page">
        <SectionHeading
          id="new-arrivals"
          title="New this season"
          href="/new"
          linkLabel="View all new arrivals"
        />
        <ul className="grid grid-cols-2 gap-x-2 gap-y-10 md:gap-x-4 lg:grid-cols-4">
          {newArrivals.map((product) => (
            <li key={product.slug}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </section>

      {/* Tailoring: edge-to-edge editorial pair */}
      <section aria-labelledby="tailoring" className="container-wide">
        <h2 id="tailoring" className="sr-only">
          Tailoring
        </h2>
        <div className="grid gap-px md:grid-cols-2">
          {tailoring.map((collection) => (
            <Link key={collection.id} href={collection.href} className="group block">
              <div className="relative aspect-portrait overflow-hidden bg-stone">
                <Image
                  src={collection.image.src}
                  alt={collection.image.alt}
                  fill
                  sizes="(min-width: 48rem) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
              </div>
              <div className="container-page mt-5 pb-2 md:px-6 lg:px-10">
                <h3 className="text-heading-sm">{collection.title}</h3>
                <p className="mt-1 text-body-sm text-ink-muted">
                  {collection.description}
                </p>
                <span className="link-underline mt-3 inline-block text-body-sm">
                  {collection.cta}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured collection: one large image beside a 2 × 2 product set */}
      <section aria-labelledby="cognac-edit" className="section container-page">
        <div className="grid gap-10 md:grid-cols-2 md:gap-6">
          <div className="md:sticky md:top-[calc(var(--spacing-header)+1.5rem)] md:self-start lg:top-[calc(var(--spacing-header-lg)+1.5rem)]">
            <div className="relative aspect-portrait overflow-hidden bg-stone">
              <Image
                src={cognacEdit.image.src}
                alt={cognacEdit.image.alt}
                fill
                sizes="(min-width: 48rem) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col md:pl-4 lg:pl-10 xl:pl-16">
            <h2 id="cognac-edit" className="text-heading-lg">
              {cognacEdit.title}
            </h2>
            <p className="mt-4 max-w-[38ch] text-body text-ink-muted lg:text-lead">
              {cognacEdit.description}
            </p>
            <Link href={cognacEdit.href} className="btn btn-secondary mt-8 self-start">
              Shop the edit
            </Link>
            <ul className="mt-10 grid grid-cols-2 gap-x-2 gap-y-10 md:gap-x-4 lg:mt-12">
              {cognacProducts.map((product) => (
                <li key={product.slug}>
                  <ProductCard
                    product={product}
                    sizes="(min-width: 48rem) 24vw, 50vw"
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Shop by category */}
      <section aria-labelledby="categories" className="container-page pb-section">
        <SectionHeading id="categories" title="Shop by category" />
        <ul className="grid grid-cols-2 gap-x-2 gap-y-8 md:grid-cols-4 md:gap-x-4">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link href={categoryHref(category.slug)} className="group block">
                <div className="relative aspect-square overflow-hidden bg-stone">
                  {category.image && (
                    <Image
                      src={category.image.src}
                      alt=""
                      fill
                      sizes="(min-width: 48rem) 25vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  )}
                </div>
                <h3 className="mt-3 text-heading-sm group-hover:underline group-hover:decoration-1 group-hover:underline-offset-4">
                  {category.name}
                </h3>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Craft story */}
      <section aria-labelledby="craft" className="bg-stone">
        <div className="container-page section grid items-center gap-12 md:grid-cols-12 md:gap-6">
          <div className="relative md:col-span-6 md:col-start-1">
            <div className="relative aspect-portrait w-[82%] overflow-hidden">
              <Image
                src={craft.images[0].src}
                alt={craft.images[0].alt}
                fill
                sizes="(min-width: 48rem) 40vw, 82vw"
                className="object-cover"
              />
            </div>
            <div className="absolute right-0 bottom-[-8%] aspect-square w-[42%] overflow-hidden border-8 border-stone">
              <Image
                src={craft.images[1].src}
                alt={craft.images[1].alt}
                fill
                sizes="(min-width: 48rem) 20vw, 42vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="mt-8 md:col-span-6 md:col-start-7 md:mt-0 md:pl-4 lg:col-span-5 lg:col-start-8 lg:pl-0">
            <h2 id="craft" className="text-heading-lg">
              {craft.title}
            </h2>
            <div className="mt-6 max-w-[60ch] space-y-4 text-body text-ink-soft">
              {craft.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <Link href={craft.href} className="link-underline mt-8 inline-block text-body-sm">
              {craft.cta}
            </Link>
          </div>
        </div>
      </section>

      {/* Services: image-led cards (swipe on phones), then delivery promises */}
      <section aria-labelledby="services" className="section">
        <div className="container-page mb-8 text-center lg:mb-12">
          <h2 id="services" className="text-heading">
            {servicesIntro.title}
          </h2>
          <p className="mx-auto mt-3 max-w-[44ch] text-body text-ink-muted">
            {servicesIntro.description}
          </p>
        </div>

        <ServiceCardRow items={services} />

        <ul className="container-page mt-section-sm grid gap-6 sm:grid-cols-2">
          {servicePromises.map((promise) => (
            <li key={promise.title} className="divider pt-5 text-center">
              <h3 className="text-eyebrow">{promise.title}</h3>
              <p className="mx-auto mt-2 max-w-[40ch] text-body-sm text-ink-muted">
                {promise.body}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
