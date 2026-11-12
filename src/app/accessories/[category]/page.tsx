import { sectionFilterRoute } from "@/components/listing/section-route";
import { accessoriesSection } from "@/lib/departments";

const route = sectionFilterRoute(accessoriesSection);

export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
