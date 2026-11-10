import { useEffect, useState } from "react";
import { getEvents } from "../utils/googleSheets.js";
import { BAKED_LISTINGS, normalizeListing, allEvents } from "../data/eventListings.js";

// All events for the public pages: starts from the copy baked in at build
// time (instant, works without the Sheet), then swaps in the live list
// from the Sheet so new edits show immediately. Any failure (no backend
// configured, network) quietly keeps the baked copy. `loaded` is true
// once the live list has arrived or failed, so a page can tell "not
// found" apart from "not fetched yet" for an event created after the
// last build.
export function useStudioEvents() {
  const [listings, setListings] = useState(BAKED_LISTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getEvents()
      .then((data) => {
        if (!cancelled && Array.isArray(data.events)) setListings(data.events.map(normalizeListing));
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { events: allEvents(listings), listings, loaded };
}
