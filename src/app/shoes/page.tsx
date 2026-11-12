import { sectionRoute } from "@/components/listing/section-route";
import { shoesSection } from "@/lib/departments";

const route = sectionRoute(shoesSection);

export const metadata = route.metadata;
export default route.Page;
