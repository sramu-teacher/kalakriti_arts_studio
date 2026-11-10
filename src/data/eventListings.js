// Admin-created events (the "Event Listings" tab of the studio's Google
// Sheet, managed from /admin) alongside the two built-in events in
// events.js.
//
// They reach the site two ways:
//   1. Baked in at build time — scripts/fetch-content.mjs writes
//      generated/eventListings.json (and copies each picture into
//      public/event-images/) before `vite build`, so every event gets a
//      prerendered page with the right link preview, and appears without
//      waiting on the Sheet. The deploy reruns when an event is saved
//      and once a day (see .github/workflows/deploy.yml).
//   2. Fetched live by useStudioEvents, so a just-saved event shows up
//      immediately, before the rebuild finishes.
import { EVENTS, getEventBySlug } from "./events.js";
import { dateWindowStatus } from "../utils/dateRange.js";

// import.meta.glob (rather than a plain import) so a fresh checkout that
// hasn't run fetch-content yet still builds/runs — it just has none.
const generated = import.meta.glob("./generated/eventListings.json", { eager: true, import: "default" });
const bakedRaw = Object.values(generated)[0]?.events ?? [];

const splitParagraphs = (text) =>
  String(text || "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
const splitLines = (text) =>
  String(text || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

// Shapes a Sheet row (as returned by Code.gs) like the events in
// events.js, so the same components render both.
export function normalizeListing(raw) {
  return {
    slug: raw.slug,
    name: raw.name,
    tagline: raw.tagline,
    intro: raw.intro,
    description: splitParagraphs(raw.description),
    highlights: splitLines(raw.highlights),
    closing: raw.closing,
    eventDates: raw.eventDates,
    showFrom: raw.showFrom,
    showUntil: raw.showUntil,
    image: raw.hasImage ? `event-images/${raw.slug}.jpg` : undefined,
    whatsappMessage: `Hi! I'd like to know more about ${raw.name} at Kalakriti Art Studio.`,
    isListing: true,
  };
}

export const BAKED_LISTINGS = bakedRaw.map(normalizeListing);

// Built-in events are always on; admin-created ones follow their
// "show on website" window.
export function getEventStatus(event, today = new Date()) {
  if (!event.isListing) return "live";
  return dateWindowStatus(event.showFrom, event.showUntil, today);
}

export function allEvents(listings = BAKED_LISTINGS) {
  return [...EVENTS, ...listings];
}

export function findEvent(slug, listings = BAKED_LISTINGS) {
  return getEventBySlug(slug) || listings.find((event) => event.slug === slug);
}
