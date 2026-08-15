export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "917022474888";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const PHONE_DISPLAY = "+91 70224 74888";
export const INSTAGRAM_URL = "https://www.instagram.com/kalakrtiartstudio";
export const FACEBOOK_URL = "https://www.facebook.com/share/1NyeWoZ91Z/";
export const CONTACT_EMAIL = "kalakritiarts.studio@gmail.com";

export const ADDRESS_LINES = ["Kalakriti Art Studio", "Balaji Layout, Near Nano Hospital", "Uttarahalli, Bengaluru 560061"];

// Business name + locality, used for the embedded map query (MapEmbed.jsx)
// — Google's embed geocoder resolves a named business far more reliably
// than parsing the raw street address text, which was landing on the
// wrong spot.
export const BUSINESS_MAP_QUERY = "Kalakriti Art Studio, Uttarahalli, Bengaluru";

// Official Google Business Profile link — used for the clickable
// "get directions" link (not embeddable directly as an iframe src).
export const MAPS_LINK = "https://share.google/y0m70sjCjPtVEQbQq";

export const STUDIO_HOURS = [
  { days: "Mon – Sat", hours: "10:00 AM – 7:00 PM" },
  { days: "Sun", hours: "10:00 AM – 5:00 PM" },
];

export const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "Our Story", path: "/about" },
  { label: "Classes", path: "/classes" },
  { label: "Events", path: "/events" },
  { label: "Gallery", path: "/gallery" },
  { label: "Contact", path: "/contact" },
];
