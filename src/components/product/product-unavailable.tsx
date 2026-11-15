import { NotFoundView } from "@/components/not-found-view";

/** Shown by /products/[slug] when the slug doesn't match a product. */
export function ProductUnavailable() {
  return (
    <NotFoundView
      title="This piece is no longer available"
      description="It may have sold out for good, or the link may be out of date. The new collection is a good place to start."
    />
  );
}
