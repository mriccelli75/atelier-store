// Shop sections and the filters each one offers. Department sections (Women,
// Men) list one department's products across several categories; category
// sections (Bags, Shoes, Accessories, Jewellery) list categories across every
// department.
// Products are assigned to a department by `products.department`; unisex
// products show up in every department.

import type { Department } from "@/db/schema";

export type SectionFilter = {
  /** URL segment: /men/<slug> */
  slug: string;
  label: string;
  /** Heading on the listing page. */
  title: string;
  categorySlug?: string;
  /** Narrows to several categories at once, e.g. all jewellery in /women. */
  categorySlugs?: string[];
  /** Narrows a category section to one department (plus unisex). */
  department?: ShopDepartment;
  newOnly?: boolean;
};

/** Jewellery is split into one category per type, as the filters are. */
export const jewelleryCategorySlugs = ["rings", "necklaces", "bracelets", "earrings"];

export type ShopDepartment = Exclude<Department, "unisex">;

export type Section = {
  /** Set for department sections; omitted lists every department. */
  department?: ShopDepartment;
  slug: string;
  label: string;
  description: string;
  /** Categories this section sells; "View all" lists all of them. */
  categorySlugs: string[];
  filters: SectionFilter[];
};

export const menSection: Section = {
  department: "men",
  slug: "men",
  label: "Men",
  description:
    "Shoes built to be resoled, leather goods stitched by hand and jewellery cast in gold and silver, made to last for years of daily wear.",
  categorySlugs: ["shoes", "small-leather-goods", ...jewelleryCategorySlugs],
  filters: [
    { slug: "new", label: "New in", title: "New in men’s", newOnly: true },
    { slug: "shoes", label: "Shoes", title: "Men’s shoes", categorySlug: "shoes" },
    {
      slug: "small-leather-goods",
      label: "Small leather goods",
      title: "Men’s small leather goods",
      categorySlug: "small-leather-goods",
    },
    {
      slug: "jewellery",
      label: "Jewellery",
      title: "Men’s jewellery",
      categorySlugs: jewelleryCategorySlugs,
    },
  ],
};

export const womenSection: Section = {
  department: "women",
  slug: "women",
  label: "Women",
  description:
    "Bags cut from a single hide and stitched by hand, with shoes, eyewear and jewellery to wear alongside them.",
  categorySlugs: ["bags", "shoes", "small-leather-goods", "eyewear", ...jewelleryCategorySlugs],
  filters: [
    { slug: "new", label: "New in", title: "New in women’s", newOnly: true },
    { slug: "bags", label: "Bags", title: "Women’s bags", categorySlug: "bags" },
    { slug: "shoes", label: "Shoes", title: "Women’s shoes", categorySlug: "shoes" },
    {
      slug: "small-leather-goods",
      label: "Small leather goods",
      title: "Women’s small leather goods",
      categorySlug: "small-leather-goods",
    },
    { slug: "eyewear", label: "Eyewear", title: "Women’s eyewear", categorySlug: "eyewear" },
    {
      slug: "jewellery",
      label: "Jewellery",
      title: "Women’s jewellery",
      categorySlugs: jewelleryCategorySlugs,
    },
  ],
};

const departmentFilters = (noun: string): SectionFilter[] => [
  { slug: "new", label: "New in", title: `New in ${noun}`, newOnly: true },
  { slug: "women", label: "Women", title: `Women’s ${noun}`, department: "women" },
  { slug: "men", label: "Men", title: `Men’s ${noun}`, department: "men" },
];

export const bagsSection: Section = {
  slug: "bags",
  label: "Bags",
  description:
    "Totes, satchels and briefcases, each cut from a single hide and saddle-stitched by hand.",
  categorySlugs: ["bags"],
  filters: departmentFilters("bags"),
};

export const shoesSection: Section = {
  slug: "shoes",
  label: "Shoes",
  description:
    "Loafers, derbies and boots on Goodyear-welted soles, built to be resoled rather than replaced.",
  categorySlugs: ["shoes"],
  filters: departmentFilters("shoes"),
};

export const accessoriesSection: Section = {
  slug: "accessories",
  label: "Accessories",
  description:
    "Wallets, card holders and eyewear: the small pieces you reach for every day.",
  categorySlugs: ["small-leather-goods", "eyewear"],
  filters: [
    { slug: "new", label: "New in", title: "New in accessories", newOnly: true },
    {
      slug: "small-leather-goods",
      label: "Small leather goods",
      title: "Small leather goods",
      categorySlug: "small-leather-goods",
    },
    { slug: "eyewear", label: "Eyewear", title: "Eyewear", categorySlug: "eyewear" },
  ],
};

export const jewellerySection: Section = {
  slug: "jewellery",
  label: "Jewellery",
  description:
    "Rings, chains and hoops in 18k gold, gold vermeil and sterling silver, cast and hand-polished in small runs.",
  categorySlugs: jewelleryCategorySlugs,
  filters: [
    { slug: "new", label: "New in", title: "New in jewellery", newOnly: true },
    { slug: "rings", label: "Rings", title: "Rings", categorySlug: "rings" },
    { slug: "necklaces", label: "Necklaces", title: "Necklaces", categorySlug: "necklaces" },
    { slug: "bracelets", label: "Bracelets", title: "Bracelets", categorySlug: "bracelets" },
    { slug: "earrings", label: "Earrings", title: "Earrings", categorySlug: "earrings" },
    { slug: "women", label: "Women", title: "Women’s jewellery", department: "women" },
    { slug: "men", label: "Men", title: "Men’s jewellery", department: "men" },
  ],
};

/** Sections that own a product category, for linking to a category by slug. */
const categorySections = [bagsSection, shoesSection, accessoriesSection, jewellerySection];

export const sectionHref = (section: Section, filter?: SectionFilter) =>
  filter ? `/${section.slug}/${filter.slug}` : `/${section.slug}`;

export function getSectionFilter(section: Section, slug: string) {
  return section.filters.find((filter) => filter.slug === slug);
}

/**
 * Where a product category lives: its own section (/bags), or a filter within
 * one when the section groups several categories (/accessories/eyewear).
 */
export function categoryHref(categorySlug: string) {
  for (const section of categorySections) {
    if (!section.categorySlugs.includes(categorySlug)) continue;
    if (section.categorySlugs.length === 1) return sectionHref(section);
    const filter = section.filters.find((f) => f.categorySlug === categorySlug);
    return sectionHref(section, filter);
  }
  return `/${categorySlug}`;
}
