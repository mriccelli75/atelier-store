import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { ProductGallery } from "@/components/product/product-gallery";
import { PurchasePanel } from "@/components/product/purchase-panel";
import { StockStatus } from "@/components/product/stock-status";
import {
  getProduct,
  getProductSlugs,
  getRelatedProducts,
} from "@/db/queries";
import { categoryHref, formatPrice } from "@/lib/products";

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: `${product.name} in ${product.material.toLowerCase()}`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const category = product.category.name;
  const related = await getRelatedProducts(product.slug);

  const sections = [
    {
      title: "Details",
      body: (
        <ul className="list-disc space-y-1 pl-5 marker:text-ink-faint">
          {product.details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      ),
    },
    { title: "Care", body: <p>{product.care}</p> },
    {
      title: "Delivery and returns",
      body: (
        <p>
          Complimentary standard delivery in 2–4 business days. Return unworn
          pieces within 30 days by post or in any boutique.
        </p>
      ),
    },
  ];

  return (
    <main>
      <nav aria-label="Breadcrumb" className="container-page py-4">
        <ol className="flex flex-wrap gap-x-2 text-caption text-ink-muted">
          <li>
            <Link href="/" className="hover:text-ink">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={categoryHref(product.category.slug)} className="hover:text-ink">
              {category}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-ink">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="md:container-page grid md:grid-cols-12 md:gap-6">
        <div className="md:col-span-7">
          <ProductGallery images={product.images} />
        </div>

        <div className="container-page md:col-span-5 md:px-0">
          <div className="pt-8 pb-section-sm md:sticky md:top-[calc(var(--spacing-header)+1.5rem)] md:pt-0 lg:top-[calc(var(--spacing-header-lg)+2rem)] lg:pl-8 xl:pl-14">
            <Link
              href={categoryHref(product.category.slug)}
              className="text-body-sm text-ink-muted hover:text-ink"
            >
              {category}
            </Link>
            <h1 className="mt-2 text-heading">{product.name}</h1>
            <p className="mt-1 text-body-sm text-ink-muted">{product.material}</p>

            <div className="mt-6 flex items-baseline justify-between gap-4">
              <p className="text-lead">{formatPrice(product.priceCents)}</p>
              <StockStatus product={product} />
            </div>

            <div className="mt-8">
              <PurchasePanel
                slug={product.slug}
                name={product.name}
                sizes={product.sizes}
                stock={product.stock}
              />
            </div>

            <p className="mt-6 max-w-[60ch] text-body text-ink-soft">
              {product.description}
            </p>

            <div className="mt-8 divider">
              {sections.map((section) => (
                <details key={section.title} className="group border-b border-line">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-body-sm font-medium [&::-webkit-details-marker]:hidden">
                    {section.title}
                    <span
                      aria-hidden="true"
                      className="relative size-3 before:absolute before:inset-x-0 before:top-1/2 before:h-px before:bg-ink after:absolute after:inset-y-0 after:left-1/2 after:w-px after:bg-ink after:transition-transform group-open:after:scale-y-0"
                    />
                  </summary>
                  <div className="pb-5 text-body-sm text-ink-soft">{section.body}</div>
                </details>
              ))}
            </div>

            <p className="mt-6 text-body-sm text-ink-muted">
              Questions about fit or materials?{" "}
              <Link href="/appointments" className="link-underline text-ink">
                Book an appointment with a stylist
              </Link>
            </p>
          </div>
        </div>
      </div>

      <section aria-labelledby="related" className="divider container-page section">
        <h2 id="related" className="mb-8 text-heading lg:mb-12">
          You may also like
        </h2>
        <ul className="grid grid-cols-2 gap-x-2 gap-y-10 md:gap-x-4 lg:grid-cols-4">
          {related.map((item) => (
            <li key={item.slug}>
              <ProductCard product={item} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
