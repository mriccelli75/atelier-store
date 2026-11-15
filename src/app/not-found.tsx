import { NotFoundView } from "@/components/not-found-view";

export default function NotFound() {
  return (
    <NotFoundView
      title="We can’t find that page"
      description="The piece may have sold out for good, or the link may be out of date. Try the new collection instead."
    />
  );
}
