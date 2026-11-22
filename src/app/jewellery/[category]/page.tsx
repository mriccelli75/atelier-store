import { sectionFilterRoute } from "@/components/listing/section-route";
import { jewellerySection } from "@/lib/departments";

const route = sectionFilterRoute(jewellerySection);

export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
