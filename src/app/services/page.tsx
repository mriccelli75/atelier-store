import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ServiceCardRow } from "@/components/services/service-card";
import { services, servicesIntro } from "@/lib/services";

export const metadata: Metadata = {
  title: "Services",
  description: servicesIntro.description,
};

export default function ServicesPage() {
  return (
    <main>
      <Breadcrumbs crumbs={[{ label: "Services" }]} />
      <header className="container-page pt-6 pb-10 text-center lg:pt-10 lg:pb-14">
        <h1 className="text-heading-lg">{servicesIntro.title}</h1>
        <p className="mx-auto mt-3 max-w-[48ch] text-body text-ink-muted">
          {servicesIntro.description}
        </p>
      </header>
      <div className="pb-section">
        <ServiceCardRow items={services} headingLevel="h2" />
      </div>
    </main>
  );
}
