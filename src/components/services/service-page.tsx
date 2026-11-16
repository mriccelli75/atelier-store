import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ServiceCard } from "@/components/services/service-card";
import { otherServices, SERVICES_HREF, type Service } from "@/lib/services";

/**
 * A client service: image beside the intro and call to action, numbered
 * steps, questions as an accordion, then links to the other services.
 */
export function ServicePage({ service }: { service: Service }) {
  const more = otherServices(service.slug);

  return (
    <main>
      <Breadcrumbs crumbs={[{ label: "Services", href: SERVICES_HREF }, { label: service.title }]} />

      {/* Intro */}
      <section className="md:container-page grid md:grid-cols-12 md:gap-6">
        <div className="relative aspect-portrait overflow-hidden bg-stone md:col-span-6">
          <Image
            src={service.image.src}
            alt={service.image.alt}
            fill
            priority
            sizes="(min-width: 48rem) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="container-page flex flex-col justify-center pt-8 pb-section-sm md:col-span-6 md:px-0 md:py-0 md:pl-4 lg:col-span-5 lg:col-start-8 lg:pl-0">
          <p className="text-eyebrow text-ink-muted">Atelier services</p>
          <h1 className="mt-4 text-heading-lg">{service.title}</h1>
          <div className="mt-6 max-w-[52ch] space-y-4 text-body text-ink-soft lg:text-lead">
            {service.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-8">
            <Link href={service.action.href} className="btn btn-primary">
              {service.action.label}
            </Link>
            <p className="mt-3 text-caption text-ink-muted">{service.action.note}</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section aria-labelledby="how-it-works" className="container-page section">
        <h2 id="how-it-works" className="mb-8 text-heading lg:mb-12">
          How it works
        </h2>
        <ol className="grid gap-x-6 gap-y-10 md:grid-cols-3">
          {service.steps.map((step, i) => (
            <li key={step.title} className="divider pt-5">
              <p className="text-eyebrow text-ink-muted">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-3 text-heading-sm">{step.title}</h3>
              <p className="mt-2 max-w-[40ch] text-body text-ink-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Questions */}
      <section aria-labelledby="questions" className="bg-stone">
        <div className="container-page section grid gap-8 md:grid-cols-12 md:gap-6">
          <h2 id="questions" className="text-heading md:col-span-4">
            Good to know
          </h2>
          <div className="divider md:col-span-8 md:col-start-5 lg:col-span-7 lg:col-start-6">
            {service.questions.map((item) => (
              <details key={item.question} className="group border-b border-line">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-body font-medium [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span
                    aria-hidden="true"
                    className="relative size-3 shrink-0 before:absolute before:inset-x-0 before:top-1/2 before:h-px before:bg-ink after:absolute after:inset-y-0 after:left-1/2 after:w-px after:bg-ink after:transition-transform group-open:after:scale-y-0"
                  />
                </summary>
                <p className="max-w-[60ch] pb-6 text-body text-ink-soft">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* More services */}
      <section aria-labelledby="more-services" className="container-page section">
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 lg:mb-12">
          <h2 id="more-services" className="text-heading">
            More services
          </h2>
          <Link href={SERVICES_HREF} className="link-underline shrink-0 text-body-sm">
            View all services
          </Link>
        </div>
        <ul className="grid grid-cols-2 gap-x-2 gap-y-10 md:gap-x-4">
          {more.map((item) => (
            <li key={item.slug}>
              <ServiceCard service={item} sizes="(min-width: 48rem) 50vw, 50vw" />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
