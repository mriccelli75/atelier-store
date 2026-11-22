import { sectionRoute } from "@/components/listing/section-route";
import { jewellerySection } from "@/lib/departments";

const route = sectionRoute(jewellerySection);

export const metadata = route.metadata;
export default route.Page;
