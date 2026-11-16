// Client services: the homepage services band, /services and /services/[service].
// Photos are stand-ins borrowed from product photography; swap in service shots.
// Policies here (turnaround, pricing, eligibility) are customer promises:
// confirm them with the business before changing.

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}`;

export type ServiceStep = { title: string; body: string };
export type ServiceQuestion = { question: string; answer: string };

export type Service = {
  slug: string;
  title: string;
  /** One line for cards. */
  summary: string;
  /** Card link label. */
  cta: string;
  image: { src: string; alt: string };
  /** Opening paragraphs on the service page. */
  intro: string[];
  steps: ServiceStep[];
  questions: ServiceQuestion[];
  /** Main call to action on the service page. */
  action: { label: string; href: string; note: string };
};

export const SERVICES_HREF = "/services";
export const serviceHref = (slug: string) => `${SERVICES_HREF}/${slug}`;

export const servicesIntro = {
  title: "Atelier services",
  description: "Ways we look after you and your pieces, in boutique and online.",
};

const contactAction = (label: string, note: string) => ({ label, href: "/contact", note });

export const services: Service[] = [
  {
    slug: "appointments",
    title: "Book an appointment",
    summary: "Try pieces on with a stylist in a boutique or over a video call.",
    cta: "Book now",
    image: {
      src: unsplash("1777987601447-266e128de448"),
      alt: "Pair of cognac leather penny loafers on a black stool",
    },
    intro: [
      "Spend an hour with one of our stylists, in a private room at the boutique or over a video call. Tell us what you’re looking for and we’ll have pieces ready in your size before you arrive.",
      "Appointments are complimentary, and there’s no obligation to buy.",
    ],
    steps: [
      {
        title: "Tell us what you need",
        body: "Choose a boutique or video call, a time, and what you’d like to see: a gift, a new bag, shoes for an occasion.",
      },
      {
        title: "We prepare a selection",
        body: "Your stylist confirms by email and sets aside pieces in your sizes, including ones not yet online.",
      },
      {
        title: "Try, take your time",
        body: "Try everything on with your stylist. Buy in the room, or have pieces held for 48 hours while you decide.",
      },
    ],
    questions: [
      {
        question: "How long is an appointment?",
        answer: "About an hour. Let us know if you need longer, for example for a wedding or a full wardrobe.",
      },
      {
        question: "How does a video appointment work?",
        answer: "Your stylist shows pieces on camera, up close and worn, and answers questions about fit and materials. Anything you choose is delivered with complimentary shipping.",
      },
      {
        question: "Can I bring someone with me?",
        answer: "Of course. Tell us when you book so we can prepare the room.",
      },
      {
        question: "How do I change or cancel?",
        answer: "Reply to your confirmation email at any time. There’s no charge for changes.",
      },
    ],
    action: contactAction(
      "Request an appointment",
      "A stylist will reply within one business day to confirm a time.",
    ),
  },
  {
    slug: "personalisation",
    title: "Personalisation",
    summary: "Add your initials to bags and small leather goods, hot-stamped by hand.",
    cta: "Discover personalisation",
    image: {
      src: unsplash("1512414947060-048d53abb081"),
      alt: "Oxblood leather card sleeve with white stitching on grey concrete",
    },
    intro: [
      "Make a piece yours, or a gift theirs. Our leatherworkers hot-stamp up to three initials by hand, using heated brass type set one letter at a time.",
      "Choose a blind stamp pressed into the leather, or gold or silver foil.",
    ],
    steps: [
      {
        title: "Choose your piece",
        body: "Bags, wallets, card holders and other small leather goods can be personalised. Ask in boutique or contact us when you order online.",
      },
      {
        title: "Choose initials and finish",
        body: "Up to three letters, with or without full stops, in blind, gold or silver. We send a proof of the placement to approve.",
      },
      {
        title: "Stamped in the workshop",
        body: "Each letter is set and pressed by hand. Your piece ships within 5 business days of approving the proof.",
      },
    ],
    questions: [
      {
        question: "Is there a charge?",
        answer: "Personalisation is complimentary on any full-price leather piece.",
      },
      {
        question: "Which letters and symbols can I use?",
        answer: "A–Z, plus full stops between letters. One style of capitals is used for every piece, sized to suit it.",
      },
      {
        question: "Can personalised pieces be returned?",
        answer: "Because they’re made for you, personalised pieces can’t be returned or exchanged unless they arrive faulty.",
      },
      {
        question: "Can I personalise something I already own?",
        answer: "Yes, if it’s an Atelier leather piece in good condition. Bring it to a boutique and we’ll look at the surface first.",
      },
    ],
    action: contactAction(
      "Start personalising",
      "Tell us the piece and the initials; we’ll reply with a proof.",
    ),
  },
  {
    slug: "repairs",
    title: "Repairs and care",
    summary: "Bring any Atelier piece back to be restitched, re-edged or reconditioned.",
    cta: "Learn about repairs",
    image: {
      src: unsplash("1552422554-0d5af0c79fc6"),
      alt: "Pair of black cap-toe oxford shoes on a worn wooden floor",
    },
    intro: [
      "We repair what we make. The same workshop that cut your piece can restitch a seam, repaint worn edges, replace hardware or resole shoes, so it lasts as long as you want to carry it.",
      "Reconditioning (cleaning, feeding and polishing the leather) is free for the life of the piece.",
    ],
    steps: [
      {
        title: "Bring it in or send it",
        body: "Drop your piece at any boutique, or contact us for a prepaid label to send it by post.",
      },
      {
        title: "Assessment and quote",
        body: "Our leatherworkers inspect it and send you a quote within 5 business days. Nothing is done until you approve.",
      },
      {
        title: "Repaired and returned",
        body: "Most repairs take 3 to 6 weeks. We’ll return it to you, or to the boutique for collection.",
      },
    ],
    questions: [
      {
        question: "What can you repair?",
        answer: "Stitching, edge paint, linings, handles, straps, zips and hardware on bags and small leather goods, and soles and heels on shoes.",
      },
      {
        question: "What does it cost?",
        answer: "Reconditioning is free. Repairs are quoted individually, and faults in materials or workmanship are fixed free of charge.",
      },
      {
        question: "Will it look the same afterwards?",
        answer: "We repair to the original design, using the same leathers and thread where we still have them. Leather that has darkened with wear won’t be made new again, and we think that’s the point.",
      },
      {
        question: "Do you repair pieces from other brands?",
        answer: "No. We only work on Atelier pieces, so we can match materials and construction exactly.",
      },
    ],
    action: contactAction(
      "Request a repair",
      "Send us a few photos and we’ll tell you what we can do.",
    ),
  },
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}

/** The rest of the services, for "More services" links. */
export function otherServices(slug: string) {
  return services.filter((service) => service.slug !== slug);
}

/** Delivery promises shown under the homepage services band. */
export const servicePromises = [
  {
    title: "Complimentary delivery",
    body: "Free standard shipping on every order, packed in our signature box.",
  },
  {
    title: "30-day returns",
    body: "Return unworn pieces within 30 days by post or in any boutique.",
  },
];
