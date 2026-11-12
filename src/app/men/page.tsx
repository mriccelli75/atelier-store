import { sectionRoute } from "@/components/listing/section-route";
import { menSection } from "@/lib/departments";

const route = sectionRoute(menSection);

export const metadata = route.metadata;
export default route.Page;
