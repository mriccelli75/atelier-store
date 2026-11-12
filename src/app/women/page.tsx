import { sectionRoute } from "@/components/listing/section-route";
import { womenSection } from "@/lib/departments";

const route = sectionRoute(womenSection);

export const metadata = route.metadata;
export default route.Page;
