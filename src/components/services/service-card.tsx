import Image from "next/image";
import Link from "next/link";
import { serviceHref, type Service } from "@/lib/services";

/** Portrait image, title, one line and a text link. Used on the homepage and /services. */
export function ServiceCard({
  service,
  sizes = "(min-width: 48rem) 33vw, 80vw",
  headingLevel: Heading = "h3",
}: {
  service: Service;
  sizes?: string;
  headingLevel?: "h2" | "h3";
}) {
  return (
    <Link href={serviceHref(service.slug)} className="group block">
      <div className="relative aspect-portrait overflow-hidden bg-stone">
        <Image
          src={service.image.src}
          alt={service.image.alt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        />
      </div>
      <div className="mt-5 text-center">
        <Heading className="text-heading-sm">{service.title}</Heading>
        <p className="mx-auto mt-2 max-w-[34ch] text-body-sm text-ink-muted">{service.summary}</p>
        <span className="text-eyebrow link-underline mt-4 inline-block">{service.cta}</span>
      </div>
    </Link>
  );
}

/** Three cards: side-scrolling with snap on phones, a 3-column grid from md. */
export function ServiceCardRow({
  items,
  headingLevel,
}: {
  items: Service[];
  headingLevel?: "h2" | "h3";
}) {
  return (
    <ul className="container-page flex snap-x snap-mandatory scroll-px-gutter gap-2 overflow-x-auto [scrollbar-width:none] md:grid md:grid-cols-3 md:gap-4 md:overflow-visible [&::-webkit-scrollbar]:hidden">
      {items.map((service) => (
        <li key={service.slug} className="w-[80%] shrink-0 snap-start xs:w-[62%] md:w-auto">
          <ServiceCard service={service} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}
