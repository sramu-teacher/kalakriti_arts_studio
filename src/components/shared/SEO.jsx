import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { upsertMeta, upsertLink } from "../../utils/seo.js";
import { PRODUCTION_ORIGIN, SITE_NAME, DEFAULT_IMAGE, fullTitle } from "../../data/pageMeta.js";

// Sets the document title and description/OG/Twitter tags for the
// current route. Pages pass an entry from data/pageMeta.js; the same
// values are baked into the prerendered HTML at build time (see
// scripts/prerender.mjs), so this mainly keeps <head> correct during
// client-side navigation. Canonical/OG URLs always point at the
// production domain, whichever host this is running on.
export default function SEO({ title, description, image, noindex = false }) {
  const { pathname } = useLocation();

  useEffect(() => {
    const pageTitle = fullTitle(title);
    const imageUrl = `${PRODUCTION_ORIGIN}/${image || DEFAULT_IMAGE}`;
    document.title = pageTitle;
    if (description) {
      upsertMeta({ name: "description", content: description });
      upsertMeta({ property: "og:description", content: description });
      upsertMeta({ name: "twitter:description", content: description });
    }
    upsertMeta({ property: "og:title", content: pageTitle });
    upsertMeta({ name: "twitter:title", content: pageTitle });
    upsertMeta({ property: "og:site_name", content: SITE_NAME });
    upsertMeta({ property: "og:type", content: "website" });
    upsertMeta({ property: "og:image", content: imageUrl });
    upsertMeta({ name: "twitter:image", content: imageUrl });
    upsertMeta({ property: "og:url", content: `${PRODUCTION_ORIGIN}${pathname}` });
    upsertLink("canonical", `${PRODUCTION_ORIGIN}${pathname}`);
    // Keeps the admin login and 404 page out of search results. The tag
    // this adds is marked so it can be removed again on every other
    // route — this is a client-side app, so otherwise a visit to /admin
    // would leave noindex on every page after it. A robots tag already in
    // index.html (none in production) is left alone.
    const routeRobots = document.head.querySelector("meta[data-route-robots]");
    if (noindex && !document.head.querySelector('meta[name="robots"]')) {
      const tag = document.createElement("meta");
      tag.setAttribute("name", "robots");
      tag.setAttribute("content", "noindex, nofollow");
      tag.setAttribute("data-route-robots", "");
      document.head.appendChild(tag);
    } else if (!noindex && routeRobots) {
      routeRobots.remove();
    }
  }, [title, description, image, noindex, pathname]);

  return null;
}
