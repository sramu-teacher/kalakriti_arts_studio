// Pre-build step (runs before `vite build`, see package.json): pulls the
// admin-created events from the Apps Script backend and bakes them into
// the build —
//   src/data/generated/eventListings.json  (read by src/data/eventListings.js)
//   public/event-images/<slug>.jpg         (each event's picture)
// so every event gets a prerendered page with its own link preview
// (scripts/prerender.mjs). Both outputs are gitignored.
//
// With no VITE_APPS_SCRIPT_URL (e.g. a fresh local checkout) it writes an
// empty list. If the backend is configured but can't be reached, the
// build FAILS on purpose: deploying with an empty list would take every
// event page offline, whereas a failed deploy leaves the live site as
// it was.
import fs from "node:fs/promises";
import path from "node:path";
import { loadEnv } from "vite";

const env = { ...loadEnv("production", process.cwd(), "VITE_"), ...process.env };
const APPS_SCRIPT_URL = env.VITE_APPS_SCRIPT_URL;
const outFile = path.resolve("src/data/generated/eventListings.json");
const imageDir = path.resolve("public/event-images");

async function call(action, payload, attempts = 4) {
  const url = new URL(APPS_SCRIPT_URL);
  url.searchParams.set("action", action);
  if (payload) url.searchParams.set("payload", JSON.stringify(payload));
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const res = await fetch(url);
      const text = await res.text();
      // Apps Script sometimes answers with an HTML error page even though
      // the script ran (see src/utils/googleSheets.js) — retry those.
      return JSON.parse(text);
    } catch (err) {
      lastError = err;
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }
  throw new Error(`fetch-content: "${action}" failed after ${attempts} tries: ${lastError?.message}`);
}

await fs.mkdir(path.dirname(outFile), { recursive: true });
await fs.rm(imageDir, { recursive: true, force: true });

let events = [];
if (!APPS_SCRIPT_URL) {
  console.warn("fetch-content: VITE_APPS_SCRIPT_URL not set — building without admin-created events.");
} else {
  const data = await call("events");
  if (data.error === "unknown action") {
    // Backend not yet updated to a version with events — not a failure.
    console.warn("fetch-content: the deployed Apps Script has no events support yet — building without them.");
  } else if (data.error || !Array.isArray(data.events)) {
    throw new Error(`fetch-content: unexpected response: ${JSON.stringify(data).slice(0, 200)}`);
  } else {
    events = data.events;
  }

  for (const event of events.filter((e) => e.hasImage)) {
    try {
      const image = await call("eventImage", { slug: event.slug });
      if (!image.data) throw new Error(image.error || "no data");
      await fs.mkdir(imageDir, { recursive: true });
      await fs.writeFile(path.join(imageDir, `${event.slug}.jpg`), Buffer.from(image.data, "base64"));
    } catch (err) {
      // A missing picture shouldn't block publishing the event itself.
      console.warn(`fetch-content: couldn't fetch the picture for "${event.slug}" (${err.message}) — building without it.`);
      event.hasImage = false;
    }
  }
}

await fs.writeFile(outFile, JSON.stringify({ events, fetchedAt: new Date().toISOString() }, null, 2) + "\n");
console.log(`fetch-content: ${events.length} admin-created event(s), ${events.filter((e) => e.hasImage).length} picture(s)`);
