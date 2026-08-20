// Creates or updates a <meta> tag by name/property, since React doesn't
// manage <head> tags outside the root — used by components/shared/SEO.jsx.
export function upsertMeta({ name, property, content }) {
  const attr = name ? "name" : "property";
  const key = name || property;
  let tag = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

// Creates or updates a <link rel="..."> tag — used by SEO.jsx for the
// per-route canonical URL (points search engines at the production
// domain for whichever route is currently rendered, even though this
// is deployed from a github.io preview URL right now).
export function upsertLink(rel, href) {
  let tag = document.head.querySelector(`link[rel="${rel}"]`);
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", rel);
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
}

// Injects (or replaces) a page-scoped <script type="application/ld+json">
// block, keyed by id so a page can safely own its own structured data
// without clobbering another page's. Pages using this should remove it
// on unmount (see removeJsonLd) so stale schema doesn't linger after
// navigating away.
export function upsertJsonLd(id, data) {
  let tag = document.getElementById(id);
  if (!tag) {
    tag = document.createElement("script");
    tag.type = "application/ld+json";
    tag.id = id;
    document.head.appendChild(tag);
  }
  tag.textContent = JSON.stringify(data);
}

export function removeJsonLd(id) {
  document.getElementById(id)?.remove();
}
