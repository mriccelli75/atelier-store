import { sectionFilterRoute } from "@/components/listing/section-route";
import { womenSection } from "@/lib/departments";

const route = sectionFilterRoute(womenSection);

export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
