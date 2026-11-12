import { sectionRoute } from "@/components/listing/section-route";
import { bagsSection } from "@/lib/departments";

const route = sectionRoute(bagsSection);

export const metadata = route.metadata;
export default route.Page;
