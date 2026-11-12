import { sectionFilterRoute } from "@/components/listing/section-route";
import { bagsSection } from "@/lib/departments";

const route = sectionFilterRoute(bagsSection);

export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
