import { sectionRoute } from "@/components/listing/section-route";
import { accessoriesSection } from "@/lib/departments";

const route = sectionRoute(accessoriesSection);

export const metadata = route.metadata;
export default route.Page;
