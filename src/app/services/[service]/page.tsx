import type { Metadata } from "next";
import { Suspense } from "react";
import { NotFoundView, notFoundMetadata } from "@/components/not-found-view";
import { ServicePage } from "@/components/services/service-page";
import { getService, SERVICES_HREF, services } from "@/lib/services";

export function generateStaticParams() {
  return services.map((service) => ({ service: service.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[service]">): Promise<Metadata> {
  const service = getService((await params).service);
  if (!service) return notFoundMetadata;
  return { title: service.title, description: service.summary };
}

type Params = PageProps<"/services/[service]">["params"];

export default function ServiceRoute({ params }: PageProps<"/services/[service]">) {
  return (
    <Suspense fallback={<ServiceSkeleton />}>
      <ServiceDetails params={params} />
    </Suspense>
  );
}

async function ServiceDetails({ params }: { params: Params }) {
  const service = getService((await params).service);
  if (!service) {
    return (
      <NotFoundView
        title="We can’t find that page"
        description="There’s no service by that name, or the link may be out of date."
        action={{ label: "View all services", href: SERVICES_HREF }}
      />
    );
  }
  return <ServicePage service={service} />;
}

function ServiceSkeleton() {
  return (
    <main aria-busy="true">
      <div className="container-page py-4">
        <div className="h-[1.125rem] w-48 bg-stone" />
      </div>
      <div className="md:container-page grid md:grid-cols-12 md:gap-6">
        <div className="aspect-portrait bg-stone md:col-span-6" />
        <div className="container-page flex flex-col justify-center gap-4 pt-8 pb-section-sm md:col-span-6 md:px-0 md:py-0 md:pl-4 lg:col-span-5 lg:col-start-8 lg:pl-0">
          <div className="h-4 w-32 bg-stone" />
          <div className="h-12 w-3/4 bg-stone" />
          <div className="h-24 w-full max-w-[52ch] bg-stone" />
          <div className="mt-4 h-12 w-56 bg-stone" />
        </div>
      </div>
    </main>
  );
}
