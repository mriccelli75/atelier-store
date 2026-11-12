// Editorial homepage content. Products and categories come from the database
// (see @/db/queries); this file only picks products by slug.
// Photography from Unsplash (https://unsplash.com), used under the Unsplash License.

import {
  accessoriesSection,
  bagsSection,
  menSection,
  sectionHref,
  shoesSection,
  womenSection,
  type Section,
} from "./departments";

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}`;

export type Collection = {
  id: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  image: { src: string; alt: string };
};

export const hero = {
  season: "Autumn–Winter 2026",
  description:
    "Soft tailoring in wool and suede, and leather made to be carried every day.",
  images: [
    {
      src: unsplash("1788999423198-d53358fa9ae0"),
      alt: "Model in a brown wool suit holding a small dark handbag against a copper wall",
    },
    {
      src: unsplash("1789163468152-db98c0ad041d"),
      alt: "Model in a tan coat carrying a brown leather bag on a hillside",
    },
  ],
};

export const newArrivalSlugs = [
  "top-handle-cognac",
  "bar-loafer-tan",
  "buckled-satchel-grey",
  "cat-eye-tortoise",
];

export const cognacEdit = {
  title: "The cognac edit",
  description:
    "Vegetable-tanned leather that darkens and softens the longer you carry it.",
  href: "/collections/cognac",
  image: {
    src: unsplash("1637759292654-a12cb2be085e"),
    alt: "Close view of the grain and stitching on a cognac leather bag",
  },
  productSlugs: [
    "doctor-bag-cognac",
    "double-monk-brown",
    "open-tote-tan",
    "shoulder-bag-cognac",
  ],
};

export const tailoring: Collection[] = [
  {
    id: "women-tailoring",
    title: "Women’s tailoring",
    description: "Wide-shouldered jackets and fluid trousers in wool twill.",
    href: sectionHref(womenSection),
    cta: "Shop women",
    image: {
      src: unsplash("1629511565591-a1d494ad6c58"),
      alt: "Woman in a navy double-breasted suit seated against a teal wall",
    },
  },
  {
    id: "men-tailoring",
    title: "Men’s tailoring",
    description: "Unstructured suits cut from brushed wool and cotton.",
    href: "/men",
    cta: "Shop men",
    image: {
      src: unsplash("1754485115876-9221149ccc19"),
      alt: "Man in a blue suit standing among palm leaves",
    },
  },
];

export const craft = {
  title: "Made by hand, in small runs",
  body: [
    "Every bag starts as a paper pattern traced onto a single hide. Our leatherworkers cut, skive and saddle-stitch each piece by hand, so no two finish exactly alike.",
    "We repair what we make. Bring any Atelier piece back to a boutique and we’ll restitch, re-edge or recondition it.",
  ],
  href: "/craft",
  cta: "Read about our workshop",
  images: [
    {
      src: unsplash("1787005241178-c9006ea9610b"),
      alt: "Leatherworker tracing a paper pattern onto brown leather",
    },
    {
      src: unsplash("1496180317060-d2026272f138"),
      alt: "Waxed thread and a steel ruler on cut leather",
    },
  ],
};

export const services = [
  {
    title: "Complimentary delivery",
    body: "Free standard shipping on every order, packed in our signature box.",
  },
  {
    title: "30-day returns",
    body: "Return unworn pieces within 30 days by post or in any boutique.",
  },
  {
    title: "Book an appointment",
    body: "Try pieces on with a stylist in store or over a video call.",
  },
];

export type NavItem = {
  label: string;
  href: string;
  /** Shown on a second panel of the menu drawer. */
  children?: { label: string; href: string }[];
};

/** A shop section's menu item, with its filters on a second panel. */
const sectionNavItem = (section: Section): NavItem => ({
  label: section.label,
  href: sectionHref(section),
  children: [
    { label: "View all", href: sectionHref(section) },
    ...section.filters.map((filter) => ({
      label: filter.label,
      href: sectionHref(section, filter),
    })),
  ],
});

export const navigation: NavItem[] = [
  { label: "New in", href: "/new" },
  sectionNavItem(womenSection),
  sectionNavItem(menSection),
  sectionNavItem(bagsSection),
  sectionNavItem(shoesSection),
  sectionNavItem(accessoriesSection),
];
