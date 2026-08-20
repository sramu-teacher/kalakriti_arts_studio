// The studio's full style catalogue, from the owner's menu-style
// graphic — four broad categories covering the complete range of
// techniques taught. This is deliberately separate from the 5
// flagship classes in data/classes.js (which stay as the primary,
// individually bookable offerings) — the Catalog page is a browsing
// aid, cross-linked from Classes, not a replacement for it. menuLabel
// keeps the playful menu framing (Starters/Main Course/A La
// Carte/Desserts) as a stylistic eyebrow; `name` is the plain heading.
// No pricing, per the owner's instruction.
export const CATALOG = [
  {
    slug: "foundation-classes",
    menuLabel: "Our Starters",
    name: "Art Foundation Classes",
    tagline: "Build your artistic skills, step by step",
    description:
      "The building blocks every artist starts with — drawing, shading, and painting fundamentals taught patiently, one skill at a time.",
    items: [
      "Basic Drawing",
      "Portrait Sketching",
      "Pencil Shading",
      "Charcoal Shading",
      "Soft Pastels & Oil Pastels",
      "Colour Pencil Shading",
      "Watercolour Painting",
      "Acrylic Painting",
      "Poster Painting",
      "Fabric Painting",
      "Mandala Art",
      "Pottery Basics",
    ],
  },
  {
    slug: "signature-painting",
    menuLabel: "Main Course",
    name: "Signature Painting Experience",
    tagline: "Create your own complete artwork, start to finish",
    description:
      "Our full-course offering — guided, immersive sessions in India's great traditional painting styles and rich mixed-media techniques, ending with a finished piece that's entirely yours.",
    items: [
      "Kerala Mural",
      "Pichwai Painting",
      "Madhubani Painting",
      "Gond Art & Warli Art",
      "Kalamkari Art",
      "Pattachitra",
      "Ganjifa Painting",
      "Oil & Glass Painting",
      "Tanjore Painting",
      "Texture & Knife Painting",
      "Lippan Art",
      "Multi-Panel Painting",
    ],
  },
  {
    slug: "custom-programs",
    menuLabel: "A La Carte",
    name: "Art Classes for Everyone",
    tagline: "Customised individual classes, tailored to you",
    description:
      "Not everyone wants the same thing from art — some come to learn, some to unwind, some to celebrate together. These programs are shaped around you.",
    items: ["Kids Art Programs", "Adult Hobby Art Classes", "Stress Relief Art Sessions", "Custom Group Workshops"],
    highlights: [
      { title: "Expert Guidance", body: "Learn from a passionate, experienced artist." },
      { title: "Quality Materials", body: "All materials provided." },
      { title: "Creative Community", body: "Connect, share, and grow together." },
    ],
  },
  {
    slug: "quick-sessions",
    menuLabel: "Art Desserts",
    name: "Creative One-Hour Sessions",
    tagline: "Fun, relaxing & beginner friendly",
    description:
      "Short, satisfying, no-experience-needed sessions — perfect for a quick creative fix, a fun outing, or a one-of-a-kind gift you make yourself.",
    items: [
      "Canvas Painting",
      "Tote Bag & Pouch Painting",
      "Premarked Board Painting",
      "Pottery Sessions",
      "Mosaic Art",
      "Decoupage Art",
      "Pot Painting",
      "Clay Modelling",
      "Fluid & Resin Art",
      "Refrigerator Magnet Making",
    ],
  },
];

export function getCatalogCategoryBySlug(slug) {
  return CATALOG.find((category) => category.slug === slug);
}
