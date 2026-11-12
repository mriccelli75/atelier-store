// Seed data for the products and categories tables (see ./seed.ts).
// Photography from Unsplash (https://unsplash.com), used under the Unsplash License.

import type { NewCategory, NewProduct, ProductImage } from "./schema";

export type SeedCategory = Omit<NewCategory, "id" | "createdAt" | "updatedAt">;

export type SeedProduct = Omit<
  NewProduct,
  "id" | "categoryId" | "createdAt" | "updatedAt"
> & { categorySlug: string };

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}`;

export const seedCategories: SeedCategory[] = [
  {
    slug: "bags",
    name: "Bags",
    sortOrder: 1,
    imageSrc: unsplash("1603219527847-24c87f552a77"),
    imageAlt: "Dark brown leather briefcase on a wooden stool",
  },
  {
    slug: "shoes",
    name: "Shoes",
    sortOrder: 2,
    imageSrc: unsplash("1614252235316-8c857d38b5f4"),
    imageAlt: "Brown leather lace-up shoes",
  },
  {
    slug: "small-leather-goods",
    name: "Small leather goods",
    sortOrder: 3,
    imageSrc: unsplash("1628483211662-9bcc692c46dc"),
    imageAlt: "Leather card wallet",
  },
  {
    slug: "eyewear",
    name: "Eyewear",
    sortOrder: 4,
    imageSrc: unsplash("1567473810954-507d59716c25"),
    imageAlt: "Gold-framed aviator sunglasses",
  },
];

const photo = (id: string, crop?: { x: number; y: number; zoom: number }) => {
  const base = `https://images.unsplash.com/photo-${id}`;
  if (!crop) return base;
  // Unsplash (imgix) focal-point crop, used for close-up gallery views.
  return `${base}?crop=focalpoint&fp-x=${crop.x}&fp-y=${crop.y}&fp-z=${crop.zoom}`;
};

/** A main shot plus two close-ups cropped from the same photograph. */
function gallery(
  id: string,
  alt: string,
  closeUps: [
    { x: number; y: number; zoom: number; alt: string },
    { x: number; y: number; zoom: number; alt: string },
  ],
): ProductImage[] {
  return [
    { src: photo(id), alt },
    ...closeUps.map(({ alt, ...crop }) => ({ src: photo(id, crop), alt })),
  ];
}

const shoeSizes = (soldOut: string[] = []) =>
  ["39", "40", "41", "42", "43", "44", "45"].map((label) => ({
    label,
    available: !soldOut.includes(label),
  }));

/** Men's EU sizes. */
const mensShoeSizes = (soldOut: string[] = []) =>
  ["40", "41", "42", "43", "44", "45", "46"].map((label) => ({
    label,
    available: !soldOut.includes(label),
  }));

const shoeCare = (cream: string) =>
  `Use a shoe tree between wears. Polish with a ${cream} cream and buff with a soft cloth.`;

const leatherCare =
  "Wipe with a soft dry cloth. Keep away from direct heat and prolonged sunlight, and store in the dust bag provided. Our boutiques recondition Atelier leather free of charge.";

export const seedProducts: SeedProduct[] = [
  {
    slug: "top-handle-cognac",
    name: "Top-handle bag",
    categorySlug: "bags",
    department: "women",
    material: "Cognac calfskin",
    priceCents: 245000,
    description:
      "A structured day bag with a rolled top handle and buckled front straps. It holds a laptop up to 13 inches, and the detachable shoulder strap lets you carry it hands-free.",
    details: [
      "Full-grain cognac calfskin",
      "Palladium-finish hardware",
      "Detachable, adjustable shoulder strap",
      "Interior zip pocket and two slip pockets",
      "W 34 × H 24 × D 13 cm",
      "Made in Italy",
    ],
    care: leatherCare,
    images: gallery(
      "1691480150204-66dd1eb77391",
      "Structured cognac leather bag with a rounded top handle",
      [
        { x: 0.5, y: 0.28, zoom: 2.4, alt: "Close-up of the rolled leather top handle" },
        { x: 0.68, y: 0.55, zoom: 2.2, alt: "Close-up of a buckled front strap and stitching" },
      ],
    ),
    stockQuantity: 10,
    isNew: true,
  },
  {
    slug: "buckled-satchel-grey",
    name: "Buckled satchel",
    categorySlug: "bags",
    department: "women",
    material: "Grey grained leather",
    priceCents: 195000,
    description:
      "A soft-structured satchel with twin buckles and a top carry handle, sized for a tablet and the day’s essentials.",
    details: [
      "Pebble-grain calfskin",
      "Gold-finish buckles",
      "Adjustable shoulder strap",
      "Cotton twill lining",
      "W 30 × H 22 × D 10 cm",
      "Made in Italy",
    ],
    care: leatherCare,
    images: gallery(
      "1605733513597-a8f8341084e6",
      "Grey leather satchel with two gold buckles",
      [
        { x: 0.5, y: 0.3, zoom: 2.4, alt: "Close-up of the grey leather carry handle" },
        { x: 0.42, y: 0.58, zoom: 2.6, alt: "Close-up of a gold buckle on grained leather" },
      ],
    ),
    stockQuantity: 2,
    isNew: true,
  },
  {
    slug: "doctor-bag-cognac",
    name: "Doctor bag",
    categorySlug: "bags",
    department: "women",
    material: "Cognac calfskin",
    priceCents: 289000,
    description:
      "Our largest top-handle bag, with a wide frame opening and buckled side straps. Roomy enough for an overnight stay.",
    details: [
      "Full-grain cognac calfskin",
      "Antique brass hardware",
      "Protective metal feet",
      "Detachable shoulder strap",
      "W 40 × H 28 × D 18 cm",
      "Made in Italy",
    ],
    care: leatherCare,
    images: gallery(
      "1691480250099-a63081ecfcb8",
      "Cognac leather doctor bag with buckled straps",
      [
        { x: 0.5, y: 0.25, zoom: 2.4, alt: "Close-up of the twin top handles" },
        { x: 0.45, y: 0.6, zoom: 2.4, alt: "Close-up of the buckled straps and brass rivets" },
      ],
    ),
    stockQuantity: 10,
  },
  {
    slug: "open-tote-tan",
    name: "Open tote",
    categorySlug: "bags",
    department: "women",
    material: "Waxed tan leather",
    priceCents: 138000,
    description:
      "An unlined tote in waxed leather that marks and mellows with use. A single magnetic snap keeps it closed.",
    details: [
      "Waxed vegetable-tanned leather",
      "Unlined, with an interior slip pocket",
      "Magnetic snap closure",
      "Handle drop 24 cm",
      "W 36 × H 38 × D 12 cm",
      "Made in Spain",
    ],
    care: leatherCare,
    images: gallery(
      "1624687943971-e86af76d57de",
      "Tan leather tote bag hanging on a white wall",
      [
        { x: 0.5, y: 0.2, zoom: 2.6, alt: "Close-up of the handle stitching" },
        { x: 0.5, y: 0.65, zoom: 2.2, alt: "Close-up of the waxed leather surface" },
      ],
    ),
    stockQuantity: 0,
  },
  {
    slug: "shoulder-bag-cognac",
    name: "Shoulder bag",
    categorySlug: "bags",
    department: "women",
    material: "Pebbled cognac leather",
    priceCents: 169000,
    description:
      "A slouchy shoulder bag with a rolled black handle and a single interior compartment.",
    details: [
      "Pebbled calfskin",
      "Rolled leather handle with gold-finish fitting",
      "Zip closure",
      "Microsuede lining",
      "W 32 × H 26 × D 11 cm",
      "Made in Italy",
    ],
    care: leatherCare,
    images: gallery(
      "1746880223690-359948154c53",
      "Pebbled cognac leather bag with a black rolled handle",
      [
        { x: 0.62, y: 0.45, zoom: 2.2, alt: "Close-up of the handle fitting" },
        { x: 0.4, y: 0.75, zoom: 2.2, alt: "Close-up of the pebbled leather grain" },
      ],
    ),
    stockQuantity: 10,
  },
  {
    slug: "barrel-bag-black",
    name: "Barrel bag",
    categorySlug: "bags",
    department: "women",
    material: "Black grained leather",
    priceCents: 159000,
    description:
      "A compact barrel shape with buckled handles and a full-length zip. Carry it by hand or across the body.",
    details: [
      "Grained calfskin",
      "Gold-finish buckles",
      "Detachable crossbody strap",
      "W 28 × H 18 × D 16 cm",
      "Made in Italy",
    ],
    care: leatherCare,
    images: gallery(
      "1705909237050-7a7625b47fac",
      "Black leather barrel bag on a yellow background",
      [
        { x: 0.5, y: 0.3, zoom: 2.4, alt: "Close-up of the buckled handles" },
        { x: 0.5, y: 0.65, zoom: 2.2, alt: "Close-up of the black leather grain" },
      ],
    ),
    stockQuantity: 10,
  },
  {
    slug: "briefcase-dark-brown",
    name: "Two-buckle briefcase",
    categorySlug: "bags",
    department: "unisex",
    material: "Dark brown bridle leather",
    priceCents: 215000,
    description:
      "A classic flap briefcase in bridle leather, with contrast stitching and two buckled closures.",
    details: [
      "English bridle leather",
      "Fits a 15-inch laptop",
      "Two interior compartments",
      "W 40 × H 29 × D 9 cm",
      "Made in England",
    ],
    care: leatherCare,
    images: gallery(
      "1603219527847-24c87f552a77",
      "Dark brown leather briefcase on a wooden stool",
      [
        { x: 0.5, y: 0.3, zoom: 2.4, alt: "Close-up of the carry handle" },
        { x: 0.6, y: 0.48, zoom: 2.6, alt: "Close-up of a buckle and contrast stitching" },
      ],
    ),
    stockQuantity: 1,
  },
  {
    slug: "bar-loafer-tan",
    name: "Bar loafer",
    categorySlug: "shoes",
    department: "women",
    material: "Tan calfskin",
    priceCents: 89000,
    description:
      "A soft, unlined loafer with a metal bar across the vamp and a stacked leather heel.",
    details: [
      "Burnished calfskin upper",
      "Leather lining and sole",
      "Gold-finish metal bar",
      "Heel height 2 cm",
      "Made in Italy",
    ],
    care: "Use a shoe tree between wears. Polish with a neutral cream and buff with a soft cloth.",
    images: gallery(
      "1616406432452-07bc5938759d",
      "Pair of tan leather loafers with a metal bar across the vamp",
      [
        { x: 0.6, y: 0.5, zoom: 2.4, alt: "Close-up of the metal bar on the vamp" },
        { x: 0.75, y: 0.7, zoom: 2.2, alt: "Close-up of the heel and welt stitching" },
      ],
    ),
    stockQuantity: 10,
    sizes: shoeSizes(["39", "45"]),
    isNew: true,
  },
  {
    slug: "double-monk-brown",
    name: "Double-monk shoe",
    categorySlug: "shoes",
    department: "men",
    material: "Burnished brown leather",
    priceCents: 115000,
    description:
      "A Goodyear-welted double-monk with hand-burnished toes, built to be resoled.",
    details: [
      "Calfskin upper, hand-burnished",
      "Goodyear-welted leather sole",
      "Two-buckle strap closure",
      "Made in Portugal",
    ],
    care: "Use a shoe tree between wears. Polish with a brown cream and buff with a soft cloth.",
    images: gallery(
      "1533867617858-e7b97e060509",
      "Brown double-monk-strap shoes on a dark floor",
      [
        { x: 0.55, y: 0.55, zoom: 2.6, alt: "Close-up of the buckled straps" },
        { x: 0.35, y: 0.6, zoom: 2.4, alt: "Close-up of the burnished toe" },
      ],
    ),
    stockQuantity: 3,
    sizes: shoeSizes(["39", "40", "44", "45"]),
  },
  {
    slug: "derby-black",
    name: "Plain-toe derby",
    categorySlug: "shoes",
    department: "men",
    material: "Black calfskin",
    priceCents: 79000,
    description:
      "A clean, plain-toe derby with an open lacing system and a lightweight rubber sole.",
    details: [
      "Polished calfskin upper",
      "Leather lining",
      "Rubber sole",
      "Made in Portugal",
    ],
    care: "Use a shoe tree between wears. Polish with a black cream and buff with a soft cloth.",
    images: gallery(
      "1668069226492-508742b03147",
      "Black leather derby shoes on a stone surface",
      [
        { x: 0.55, y: 0.5, zoom: 2.4, alt: "Close-up of the laces and eyelets" },
        { x: 0.35, y: 0.65, zoom: 2.2, alt: "Close-up of the polished toe" },
      ],
    ),
    stockQuantity: 0,
    sizes: shoeSizes(["39", "40", "41", "42", "43", "44", "45"]),
  },
  {
    slug: "cat-eye-tortoise",
    name: "Cat-eye sunglasses",
    categorySlug: "eyewear",
    department: "women",
    material: "Tortoiseshell acetate",
    priceCents: 42000,
    description:
      "Hand-polished acetate frames with a lifted cat-eye line and gradient lenses.",
    details: [
      "Italian acetate frame",
      "Gradient lenses, 100% UV protection",
      "Five-barrel hinges",
      "Includes leather case",
      "Made in Italy",
    ],
    care: "Clean lenses with the cloth provided. Store in the case when not in use.",
    images: gallery(
      "1559070081-648fb00b2ed1",
      "Two pairs of tortoiseshell sunglasses on a yellow block",
      [
        { x: 0.55, y: 0.35, zoom: 2.4, alt: "Close-up of the tortoiseshell frame" },
        { x: 0.4, y: 0.6, zoom: 2.4, alt: "Close-up of the lens and hinge" },
      ],
    ),
    stockQuantity: 10,
    isNew: true,
  },
  {
    slug: "aviator-gold",
    name: "Aviator sunglasses",
    categorySlug: "eyewear",
    department: "unisex",
    material: "Gold-finish metal",
    priceCents: 46000,
    description:
      "A slim metal aviator with adjustable nose pads and smoke-grey lenses.",
    details: [
      "Gold-finish titanium frame",
      "Smoke-grey lenses, 100% UV protection",
      "Adjustable nose pads",
      "Includes leather case",
      "Made in Japan",
    ],
    care: "Clean lenses with the cloth provided. Store in the case when not in use.",
    images: gallery(
      "1567473810954-507d59716c25",
      "Gold-framed aviator sunglasses on a light surface",
      [
        { x: 0.5, y: 0.45, zoom: 2.4, alt: "Close-up of the bridge and nose pads" },
        { x: 0.3, y: 0.5, zoom: 2.4, alt: "Close-up of the smoke-grey lens" },
      ],
    ),
    stockQuantity: 10,
  },
  {
    slug: "card-wallet-cognac",
    name: "Card wallet",
    categorySlug: "small-leather-goods",
    department: "unisex",
    material: "Cognac calfskin",
    priceCents: 34000,
    description:
      "A slim, hand-stitched card wallet with four card slots and a central pocket for notes.",
    details: [
      "Vegetable-tanned calfskin",
      "Saddle-stitched by hand",
      "Four card slots and a central pocket",
      "W 10.5 × H 7.5 cm",
      "Made in Italy",
    ],
    care: leatherCare,
    images: gallery(
      "1628483211662-9bcc692c46dc",
      "Hand-stitched cognac leather card wallet beside leatherworking tools",
      [
        { x: 0.45, y: 0.45, zoom: 2.4, alt: "Close-up of the saddle stitching" },
        { x: 0.6, y: 0.6, zoom: 2.4, alt: "Close-up of the wallet edge" },
      ],
    ),
    stockQuantity: 10,
  },
  // ---- Men ----
  {
    slug: "chelsea-boot-brown",
    name: "Chelsea boot",
    categorySlug: "shoes",
    department: "men",
    material: "Burnished brown calfskin",
    priceCents: 98000,
    description:
      "A slim Chelsea boot with elasticated side panels and a hand-burnished toe. It's built on a Blake-stitched leather sole that's easy to resole.",
    details: [
      "Calfskin upper, hand-burnished",
      "Elasticated side gussets and a rear pull tab",
      "Blake-stitched leather sole with a rubber heel insert",
      "Made in Italy",
    ],
    care: shoeCare("brown"),
    images: gallery(
      "1777987601677-3059be0e1388",
      "Pair of polished brown leather Chelsea boots against a grey background",
      [
        { x: 0.45, y: 0.6, zoom: 2.4, alt: "Close-up of the burnished toe" },
        { x: 0.55, y: 0.35, zoom: 2.4, alt: "Close-up of the elastic side panel and pull tab" },
      ],
    ),
    stockQuantity: 10,
    sizes: mensShoeSizes(["46"]),
    isNew: true,
  },
  {
    slug: "suede-chelsea-tobacco",
    name: "Suede Chelsea boot",
    categorySlug: "shoes",
    department: "men",
    material: "Tobacco suede",
    priceCents: 89000,
    description:
      "A relaxed Chelsea boot in soft tobacco suede on a natural crepe sole that cushions every step.",
    details: [
      "Water-resistant suede upper",
      "Leather lining",
      "Natural crepe sole, stitched to the upper",
      "Made in Portugal",
    ],
    care: "Brush with a suede brush after each wear. Protect with a suede spray before first use, and let it dry naturally if it gets wet.",
    images: gallery(
      "1608629601270-a0007becead3",
      "Pair of tobacco suede Chelsea boots with crepe soles on a blue-grey background",
      [
        { x: 0.25, y: 0.35, zoom: 2.4, alt: "Close-up of the elastic gusset and pull tab" },
        { x: 0.55, y: 0.8, zoom: 2.4, alt: "Close-up of the crepe sole and welt stitching" },
      ],
    ),
    stockQuantity: 2,
    sizes: mensShoeSizes(["40", "41", "45", "46"]),
    isNew: true,
  },
  {
    slug: "penny-loafer-cognac",
    name: "Penny loafer",
    categorySlug: "shoes",
    department: "men",
    material: "Cognac calfskin",
    priceCents: 82000,
    description:
      "A classic penny loafer with a hand-sewn moc toe and a saddle strap, on a Goodyear-welted leather sole.",
    details: [
      "Hand-sewn calfskin upper",
      "Goodyear-welted leather sole",
      "Leather lining",
      "Made in Portugal",
    ],
    care: shoeCare("cognac"),
    images: gallery(
      "1777987601447-266e128de448",
      "Pair of cognac leather penny loafers on a black stool",
      [
        { x: 0.42, y: 0.42, zoom: 2.4, alt: "Close-up of the saddle strap" },
        { x: 0.6, y: 0.6, zoom: 2.4, alt: "Close-up of the moc-toe stitching" },
      ],
    ),
    stockQuantity: 10,
    sizes: mensShoeSizes(),
    isNew: true,
  },
  {
    slug: "cap-toe-oxford-black",
    name: "Cap-toe oxford",
    categorySlug: "shoes",
    department: "men",
    material: "Black calfskin",
    priceCents: 105000,
    description:
      "A closed-lace oxford with a straight toe cap. Formal enough for black tie and sturdy enough for every day.",
    details: [
      "Polished calfskin upper",
      "Goodyear-welted leather sole",
      "Waxed cotton laces",
      "Made in England",
    ],
    care: shoeCare("black"),
    images: gallery(
      "1552422554-0d5af0c79fc6",
      "Pair of black cap-toe oxford shoes on a worn wooden floor",
      [
        { x: 0.3, y: 0.3, zoom: 2.4, alt: "Close-up of the toe cap seam" },
        { x: 0.55, y: 0.38, zoom: 2.6, alt: "Close-up of the closed lacing" },
      ],
    ),
    stockQuantity: 10,
    sizes: mensShoeSizes(["40"]),
  },
  {
    slug: "pebble-derby-tan",
    name: "Pebble-grain derby",
    categorySlug: "shoes",
    department: "men",
    material: "Tan pebbled leather",
    priceCents: 76000,
    description:
      "An open-laced derby in pebbled leather, which hides scuffs and softens quickly. A lightweight rubber sole keeps it comfortable all day.",
    details: [
      "Pebble-grain calfskin upper",
      "Leather lining",
      "Stitched rubber sole",
      "Made in Portugal",
    ],
    care: shoeCare("tan"),
    images: gallery(
      "1563434649554-58f91d22ec2c",
      "Close view of a pair of tan pebble-grain leather derby shoes",
      [
        { x: 0.55, y: 0.45, zoom: 2.2, alt: "Close-up of the pebbled leather grain" },
        { x: 0.85, y: 0.75, zoom: 2.4, alt: "Close-up of the laces and eyelets" },
      ],
    ),
    stockQuantity: 0,
    sizes: mensShoeSizes(["40", "41", "42", "43", "44", "45", "46"]),
  },
  {
    slug: "court-sneaker-white",
    name: "Leather court sneaker",
    categorySlug: "shoes",
    department: "men",
    material: "White calfskin",
    priceCents: 59000,
    description:
      "A low-profile court sneaker in soft white calfskin, with a padded collar lined in olive suede.",
    details: [
      "Calfskin upper",
      "Suede-lined collar",
      "Stitched rubber cupsole",
      "Made in Italy",
    ],
    care: "Wipe with a damp cloth and a little mild soap. Use a shoe tree to keep the toe from creasing.",
    images: gallery(
      "1780824947013-dc7e01284025",
      "White leather court sneaker with an olive-lined collar in raking sunlight",
      [
        { x: 0.45, y: 0.4, zoom: 2.4, alt: "Close-up of the laces and stitched quarter" },
        { x: 0.7, y: 0.2, zoom: 2.4, alt: "Close-up of the padded collar" },
      ],
    ),
    stockQuantity: 10,
    sizes: mensShoeSizes(["44"]),
    isNew: true,
  },
  {
    slug: "travel-wallet-brown",
    name: "Travel wallet",
    categorySlug: "small-leather-goods",
    department: "men",
    material: "Brown bridle leather",
    priceCents: 52000,
    description:
      "A hand-stitched travel wallet that holds a passport, boarding passes, cards and foreign currency, closed with a snap tab.",
    details: [
      "English bridle leather, saddle-stitched by hand",
      "Passport sleeve, four card slots and a full-length pocket",
      "Brass snap closure",
      "W 12 × H 20 cm",
      "Made in England",
    ],
    care: leatherCare,
    images: gallery(
      "1586695262913-8eb27f881b18",
      "Brown leather travel wallet with a snap tab resting on a wooden chair",
      [
        { x: 0.45, y: 0.45, zoom: 2.4, alt: "Close-up of the brass snap tab" },
        { x: 0.6, y: 0.35, zoom: 2.6, alt: "Close-up of the saddle stitching" },
      ],
    ),
    stockQuantity: 10,
    isNew: true,
  },
  {
    slug: "bifold-wallet-black",
    name: "Bifold wallet",
    categorySlug: "small-leather-goods",
    department: "men",
    material: "Black pebbled leather",
    priceCents: 45000,
    description:
      "A slim bifold in pebbled black leather, edge-stitched in red, with six card slots and a full-length note pocket.",
    details: [
      "Pebble-grain calfskin",
      "Contrast red edge stitching",
      "Six card slots and a note pocket",
      "W 11 × H 9 cm",
      "Made in Italy",
    ],
    care: leatherCare,
    images: gallery(
      "1629958513881-a086d21383cd",
      "Black pebbled leather wallet with red stitching on tan cotton",
      [
        { x: 0.5, y: 0.35, zoom: 2.4, alt: "Close-up of the pebbled leather grain" },
        { x: 0.8, y: 0.65, zoom: 2.6, alt: "Close-up of the red edge stitching" },
      ],
    ),
    stockQuantity: 3,
  },
  {
    slug: "card-sleeve-oxblood",
    name: "Card sleeve",
    categorySlug: "small-leather-goods",
    department: "men",
    material: "Oxblood calfskin",
    priceCents: 24000,
    description:
      "A single-pocket card sleeve in oxblood leather, stitched by hand. It holds up to six cards and slips into a shirt pocket.",
    details: [
      "Vegetable-tanned calfskin",
      "Saddle-stitched by hand",
      "Holds up to six cards",
      "W 10 × H 7 cm",
      "Made in Spain",
    ],
    care: leatherCare,
    images: gallery(
      "1512414947060-048d53abb081",
      "Oxblood leather card sleeve with white stitching on grey concrete",
      [
        { x: 0.5, y: 0.5, zoom: 2.6, alt: "Close-up of the burnished leather" },
        { x: 0.68, y: 0.45, zoom: 2.8, alt: "Close-up of the hand stitching" },
      ],
    ),
    stockQuantity: 10,
  },
];
