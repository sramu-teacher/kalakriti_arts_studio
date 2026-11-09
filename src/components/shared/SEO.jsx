import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { upsertMeta, upsertLink } from "../../utils/seo.js";

const SITE_NAME = "Kalakriti Art Studio";
// Canonical always points at the production domain, regardless of which
// host this is running on (e.g. localhost) — same convention as
// robots.txt/sitemap.xml.
const PRODUCTION_ORIGIN = "https://kalakritiartstudio.com";

// Sets the document title and description/OG meta tags for the current
// route. A minimal custom implementation rather than react-helmet-async —
// the page count here is small enough that a dependency isn't worth it.
export default function SEO({ title, description, noindex = false }) {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
    if (description) {
      upsertMeta({ name: "description", content: description });
      upsertMeta({ property: "og:description", content: description });
    }
    upsertMeta({ property: "og:title", content: document.title });
    upsertMeta({ property: "og:site_name", content: SITE_NAME });
    upsertMeta({ property: "og:type", content: "website" });
    upsertMeta({
      property: "og:image",
      content: `${window.location.origin}${import.meta.env.BASE_URL}brand_logo.jpg`,
    });
    upsertMeta({ property: "og:url", content: `${PRODUCTION_ORIGIN}${pathname}` });
    upsertLink("canonical", `${PRODUCTION_ORIGIN}${pathname}`);
    // Keeps the admin login and 404 page out of search results. Removed
    // again on every other route — this is a client-side app, so without
    // that a visit to /admin would leave noindex on every page after it.
    if (noindex) {
      upsertMeta({ name: "robots", content: "noindex, nofollow" });
    } else {
      document.head.querySelector('meta[name="robots"]')?.remove();
    }
  }, [title, description, noindex, pathname]);

  return null;
}
