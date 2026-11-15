import { useEffect, useState } from "react";
import { getEvents } from "../utils/googleSheets.js";
import { BAKED_LISTINGS, normalizeListing, allEvents } from "../data/eventListings.js";

// If the backend hasn't answered by then, fall back to the copy baked in
// at build time rather than leave admin-created events missing.
const LIVE_TIMEOUT_MS = 6000;

// Events for the public pages. Two views of the admin-created events:
//
// - `listings`: the baked copy right away, replaced by the live list
//   when it arrives. For an event's own page (the link in ads), which
//   should open instantly; a just-saved event not in the baked copy is
//   found once `loaded` is true.
// - `confirmedListings`: null until the live list arrives (or the
//   timeout/an error falls back to the baked copy). For the Events list,
//   so an event deleted or ended since the last build — which can also
//   linger in the browser's cached copy of the site for up to ~10
//   minutes — never flashes on screen before disappearing.
export function useStudioEvents() {
  const [live, setLive] = useState(null);
  const [fallback, setFallback] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => !cancelled && setFallback(true), LIVE_TIMEOUT_MS);
    getEvents()
      .then((data) => {
        if (!cancelled && Array.isArray(data.events)) setLive(data.events.map(normalizeListing));
        else if (!cancelled) setFallback(true);
      })
      .catch(() => !cancelled && setFallback(true))
      .finally(() => {
        clearTimeout(timer);
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  const listings = live ?? BAKED_LISTINGS;
  const confirmedListings = live ?? (fallback ? BAKED_LISTINGS : null);
  return { events: allEvents(listings), listings, confirmedListings, loaded };
}
