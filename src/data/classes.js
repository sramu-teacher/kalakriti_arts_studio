// Placeholder class catalog — pending the owner's confirmed list, age
// groups, and pricing (see plan Open Item #1). Informed by the art forms
// mentioned in the founder's bio. Edit this file only; components read
// from here so the catalog stays a single source of truth.
export const CLASSES = [
  {
    slug: "little-picassos",
    name: "Little Picassos",
    ageGroup: "Ages 4–10 · Beginners",
    theme: "gold",
    description:
      "A playful introduction to colors, shapes, and imagination for young artists.",
    schedules: ["Weekday afternoons", "Saturday mornings"],
  },
  {
    slug: "teen-art-lab",
    name: "Teen Art Lab",
    ageGroup: "Ages 11–17 · All levels",
    theme: "green",
    description:
      "Explore mixed media, portraits, and expressive art forms in a vibrant space.",
    schedules: ["Weekday evenings", "Sunday mornings"],
  },
  {
    slug: "mandala-zen-art",
    name: "Mandala & Zen Art",
    ageGroup: "Adults · All levels",
    theme: "gold",
    description: "Find calm and focus through the meditative beauty of mandala art.",
    schedules: ["Weekday evenings", "Weekend batches"],
  },
  {
    slug: "watercolour-mastery",
    name: "Watercolour Mastery",
    ageGroup: "All ages · Intermediate",
    theme: "green",
    description:
      "Delicate washes, gradients, and landscapes — capture the world in watercolour.",
    schedules: ["Weekend batches"],
  },
  {
    slug: "clay-pottery",
    name: "Clay & Pottery",
    ageGroup: "Ages 8+ · All levels",
    theme: "gold",
    description: "Shape, sculpt, and fire — bring earthy creations to life with your hands.",
    schedules: ["Weekend batches"],
  },
  {
    slug: "calligraphy-lettering",
    name: "Calligraphy & Lettering",
    ageGroup: "Adults · All levels",
    theme: "green",
    description:
      "The art of beautiful writing — traditional scripts and modern lettering styles.",
    schedules: ["Weekday evenings"],
  },
];

export function getClassBySlug(slug) {
  return CLASSES.find((cls) => cls.slug === slug);
}
