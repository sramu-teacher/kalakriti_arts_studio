// Single source of truth for every route's title/description/preview
// image. Used in two places that must agree:
//   1. Each page's <SEO> component (sets <head> tags in the browser).
//   2. scripts/prerender.mjs at build time, which writes a real HTML
//      file per route with these tags baked in. That gives every URL a
//      200 response on GitHub Pages (instead of going through the
//      404.html redirect) and gives link-preview bots — WhatsApp,
//      Facebook/Instagram, ad-platform crawlers, none of which run JS —
//      the right title and picture for the exact page being shared.
//
// `image` is a path relative to the site root (no leading slash); the
// preview tags turn it into an absolute production URL.
import { CLASSES } from "./classes.js";
import { allEvents, getEventStatus } from "./eventListings.js";
import { ART_FOR_SALE } from "./artForSale.js";

export const PRODUCTION_ORIGIN = "https://kalakritiartstudio.com";
export const SITE_NAME = "Kalakriti Art Studio";
export const DEFAULT_IMAGE = "brand_logo.jpg";

export function fullTitle(title) {
  return title ? `${title} | ${SITE_NAME}` : SITE_NAME;
}

export const PAGE_META = {
  home: {
    path: "/",
    title: "Art Classes in Uttarahalli, Bengaluru",
    description:
      "A creative space for kids and adults in Uttarahalli, Bengaluru to learn, create, and express through art. Explore our classes and workshops.",
  },
  about: {
    path: "/about",
    title: "Our Story",
    description:
      "Meet Supriya Suresh, founder of Kalakriti Art Studio — artist, interior designer, and art educator building a creative community in Bengaluru.",
  },
  classes: {
    path: "/classes",
    title: "Art Classes for Kids, Teens & Adults",
    description:
      "Explore Kalakriti Art Studio's classes for kids, teens, and adults — drawing, painting, mandala art, pottery, and more.",
  },
  catalog: {
    path: "/catalog",
    title: "Full Style Catalog",
    description:
      "Every technique and painting style taught at Kalakriti Art Studio — foundation drawing & painting, traditional Indian painting styles, custom programs, and quick one-hour sessions.",
  },
  events: {
    path: "/events",
    title: "Art Events & Celebrations in Bengaluru",
    description:
      "Host a birthday party, holiday camp, or special celebration at Kalakriti Art Studio in Uttarahalli, Bengaluru — everything taken care of.",
  },
  gallery: {
    path: "/gallery",
    title: "Gallery",
    description:
      "Studio showcase pieces from Kalakriti Art Studio — a glimpse into the artwork and traditional painting styles taught here.",
  },
  artForSale: {
    path: "/art-for-sale",
    title: "Art for Sale",
    description:
      "Hand-painted artwork made at Kalakriti Art Studio, available to buy. Enquire about any piece on WhatsApp or through our interest form.",
    image: "for-sale/pichwai-cow-wall-hanging.jpg",
  },
  contact: {
    path: "/contact",
    title: "Contact Us in Uttarahalli, Bengaluru",
    description:
      "Get in touch with Kalakriti Art Studio in Uttarahalli, Bengaluru — visit us, call, WhatsApp, or send a message.",
  },
  admin: { path: "/admin", title: "Studio Admin", noindex: true },
};

export function classRegisterMeta(cls) {
  return {
    path: `/classes/${cls.slug}/register`,
    title: `Register — ${cls.name}`,
    description: `Register for ${cls.name} at Kalakriti Art Studio. ${cls.description}`,
  };
}

export function eventMeta(event) {
  return {
    path: `/events/${event.slug}`,
    title: event.name,
    description: event.intro,
    image: event.image,
  };
}

export function eventInterestMeta(event) {
  return {
    path: `/events/${event.slug}/interest`,
    title: `I'm Interested — ${event.name}`,
    description: `Let us know you're interested in ${event.name} at Kalakriti Art Studio.`,
    image: event.image,
  };
}

export function artInterestMeta(piece) {
  return {
    path: `/art-for-sale/${piece.id}/interest`,
    title: `I'm Interested — ${piece.title}`,
    description: `Enquire about buying ${piece.title} from Kalakriti Art Studio. ${piece.description}`,
    image: piece.imagePath,
  };
}

// Every concrete URL the site serves, for the prerender step and the
// generated sitemap.
export function getAllRouteMeta() {
  return [
    ...Object.values(PAGE_META),
    ...CLASSES.map(classRegisterMeta),
    // Admin-created events baked in at build time are included; ones
    // past their "show until" date keep a page ("This event has ended")
    // but are kept out of search results and the sitemap.
    ...allEvents()
      .filter((event) => getEventStatus(event) !== "upcoming")
      .flatMap((event) => {
        const noindex = getEventStatus(event) === "ended";
        return [eventMeta(event), eventInterestMeta(event)].map((meta) => ({ ...meta, noindex }));
      }),
    ...ART_FOR_SALE.map(artInterestMeta),
  ];
}
