import { useEffect } from "react";
import { upsertMeta } from "../../utils/seo.js";

const SITE_NAME = "Kalakriti Art Studio";

// Sets the document title and description/OG meta tags for the current
// route. A minimal custom implementation rather than react-helmet-async —
// the page count here is small enough that a dependency isn't worth it.
export default function SEO({ title, description }) {
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
  }, [title, description]);

  return null;
}
