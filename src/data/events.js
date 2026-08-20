// Studio-hosted events the owner wants to promote and take bookings
// for. Structured the same way as data/classes.js — a single source of
// truth components read from, so adding a new event is just a new
// entry here, no code changes needed.
export const EVENTS = [
  {
    slug: "special-event-celebrations",
    name: "Special Event Celebrations",
    tagline: "Make Any Celebration a Masterpiece",
    intro:
      "Skip the usual bounce castle. Give any celebration a creative centrepiece people will actually remember — birthdays especially, but honestly, any excuse works.",
    description: [
      "At Kalakriti, celebrations aren't just marked — they're created. Gather your favorite people, pick up a brush, and turn cake-and-candles into cake-and-canvases. Every guest gets their own canvas, a full palette, and the freedom to make something entirely their own — no rules, no \"right way,\" just colour, laughter, and a little bit of magic.",
      "Birthdays are where this started, and they're still our favourite — but the same idea works beautifully for anniversaries, achievement celebrations, festive get-togethers, or just wanting an excuse to gather the people you love and make something together.",
      "Whether it's a handful of best friends, a big joyful family gathering, or a room full of tiny artists in party hats, we set the stage — art materials, easels, aprons, and festive decor, all taken care of. You bring the occasion, we'll bring the paint.",
      "And when it winds down, nobody goes home empty-handed. Every guest takes home their own artwork — a one-of-a-kind keepsake that says \"I was here, and I made something beautiful\" far longer than a party favour bag ever could.",
    ],
    highlights: [
      "All art materials & supplies provided",
      "Easels, aprons & festive setup included",
      "Guided by our art instructors — no experience needed",
      "Every guest takes home their own artwork",
      "Great for birthdays, anniversaries, achievements, or any excuse to create together",
    ],
    closing: "Ready to plan a celebration that becomes a story? Let's start sketching the details.",
    whatsappMessage: "Hi! I'd like to know more about hosting a Special Event Celebration at Kalakriti Art Studio.",
  },
  {
    slug: "seasonal-holiday-camp",
    name: "Seasonal Holiday Camp",
    tagline: "A Creative Escape This Holiday",
    intro:
      "School's out — and instead of another screen-filled week, give them days full of colour, clay, and new things to be proud of.",
    description: [
      "Our seasonal camps run during school holidays and turn a few days into a real creative journey — a different theme and technique each day, building toward a small collection of finished pieces by the end of the week, not just one.",
      "Kids work alongside others their age in a relaxed, encouraging space, trying things they might never pick up at home — clay, resin, mural painting, mixed media — guided by instructors who genuinely enjoy watching them figure it out.",
      "Every day ends with something to take home, so the holiday doesn't just pass by — it leaves a small pile of proof that it was well spent.",
    ],
    highlights: [
      "Multi-day themed camp, run during school holidays",
      "A new technique or project each day",
      "All materials included",
      "Small groups, all skill levels welcome",
      "A take-home piece from every session",
    ],
    closing: "Ready to book their spot for the next holiday camp?",
    whatsappMessage: "Hi! I'd like to know more about your upcoming Seasonal Holiday Camp at Kalakriti Art Studio.",
  },
];

export function getEventBySlug(slug) {
  return EVENTS.find((event) => event.slug === slug);
}
