import { ADDRESS_LINES } from "../../data/constants.js";

// Plain Google Maps embed URL keyed off the address — no API key
// required for this basic form. See plan Open Item #9.
const query = encodeURIComponent(ADDRESS_LINES.join(", "));
const EMBED_SRC = `https://www.google.com/maps?q=${query}&output=embed`;

export default function MapEmbed() {
  return (
    <div className="overflow-hidden rounded-2xl border border-brand-cream-100/15">
      <iframe
        title="Kalakriti Art Studio location"
        src={EMBED_SRC}
        width="100%"
        height="280"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
