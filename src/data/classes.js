// The studio's 5 established, real classes — confirmed by the owner as
// the ones to keep front-and-centre (Calligraphy & Lettering dropped,
// it was never actually offered). Edit this file only; components read
// from here so the catalog stays a single source of truth.
//
// `techniques` is a short taste of the specific styles each class
// draws on, pulled from the owner's full style catalogue (see
// data/catalog.js) — not a promise that ONLY these are covered, just
// enough to show real depth without turning every technique into its
// own bookable class.
export const CLASSES = [
  {
    slug: "little-picassos",
    name: "Little Picassos",
    ageGroup: "Ages 4–10 · Beginners",
    theme: "gold",
    description:
      "Every great artist started with a scribble. This is where your little one gets to make their first real marks — big shapes, bold colour, zero pressure. We follow their curiosity more than a strict syllabus, so every class feels like play, even while real skills are quietly taking root.",
    techniques: ["Basic Drawing", "Poster Painting", "Mandala Art", "Fabric Painting"],
    schedules: ["Weekday afternoons", "Saturday mornings"],
  },
  {
    slug: "teen-art-lab",
    name: "Teen Art Lab",
    ageGroup: "Ages 11–17 · All levels",
    theme: "green",
    description:
      "A space for teens to actually say something through their art — not just copy a reference. We move between sketching, shading, and bolder mixed-media work, building real technical control while leaving room for their own style to show up on the page.",
    techniques: ["Portrait Sketching", "Charcoal Shading", "Acrylic Painting", "Multi-Panel Painting"],
    schedules: ["Weekday evenings", "Sunday mornings"],
  },
  {
    slug: "mandala-zen-art",
    name: "Mandala & Zen Art",
    ageGroup: "Adults · All levels",
    theme: "gold",
    description:
      "Slow, repetitive, deeply calming — mandala work is as much about the hour you spend making it as the piece you take home. No drawing background needed, just a willingness to let your mind quiet down while your hand finds its rhythm.",
    techniques: ["Mandala Art", "Kalamkari Art", "Pattachitra"],
    schedules: ["Weekday evenings", "Weekend batches"],
  },
  {
    slug: "watercolour-mastery",
    name: "Watercolour Mastery",
    ageGroup: "All ages · Intermediate",
    theme: "green",
    description:
      "Watercolour rewards patience and punishes hesitation — which is exactly what makes it so satisfying once it clicks. We work through washes, layering, and control, building toward landscapes and studies that actually look like the vision in your head.",
    techniques: ["Watercolour Painting", "Texture & Knife Painting"],
    schedules: ["Weekend batches"],
  },
  {
    slug: "clay-pottery",
    name: "Clay & Pottery",
    ageGroup: "Ages 8+ · All levels",
    theme: "gold",
    description:
      "There's something a screen can never give you — the actual weight and give of wet clay in your hands. From first shapes to finished, fired pieces, this class is hands-on in the most literal sense, and every session ends with something real to show for it.",
    techniques: ["Pottery Basics", "Pottery Sessions", "Clay Modelling"],
    schedules: ["Weekend batches"],
  },
];

export function getClassBySlug(slug) {
  return CLASSES.find((cls) => cls.slug === slug);
}
