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
