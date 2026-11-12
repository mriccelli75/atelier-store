import { sectionFilterRoute } from "@/components/listing/section-route";
import { shoesSection } from "@/lib/departments";

const route = sectionFilterRoute(shoesSection);

export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
