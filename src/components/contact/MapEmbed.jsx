import { BUSINESS_MAP_QUERY } from "../../data/constants.js";

// Keyed off the business name + locality rather than the raw street
// address — Google's embed geocoder resolves a named, listed business
// far more reliably than parsing address text (confirmed the business
// is uniquely findable this way via its Knowledge Graph entry). No API
// key required for this basic embed form.
const query = encodeURIComponent(BUSINESS_MAP_QUERY);
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
