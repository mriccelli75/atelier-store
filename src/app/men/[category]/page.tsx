import { sectionFilterRoute } from "@/components/listing/section-route";
import { menSection } from "@/lib/departments";

const route = sectionFilterRoute(menSection);

export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
