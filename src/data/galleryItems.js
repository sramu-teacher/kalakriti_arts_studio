// Real studio artwork photography, supplied by the owner (Drive folder
// "Paintings_By_Studio"). Titles below are best-guess descriptions from
// looking at each photo. Several were corrected by the studio after
// review — kept as a `subtitle` below the original guess (rather than
// replacing it outright) per the owner's preference for a
// heading/subheading presentation.
//
// Paths are prefixed with BASE_URL (not hardcoded "/gallery/...") since
// this currently deploys under a GitHub Pages subpath
// (/kalakriti_arts_studio/) — see the same fix applied to the logo in
// Header.jsx/Footer.jsx. BASE_URL is "/" locally and in a future
// custom-domain root deploy, so this works unchanged either way.
const base = import.meta.env.BASE_URL;

export const GALLERY_ITEMS = [
  { id: 1, title: "Clay Floral Relief on Wood", subtitle: "Russian Sculpture Art", image: `${base}gallery/clay-floral-relief.jpg` },
  { id: 2, title: "Mysore Painting — Hamsa Bird", subtitle: "Kinnala North Karnataka form of Art", image: `${base}gallery/mysore-hamsa-plate.jpg` },
  { id: 3, title: "Lord Ganesha, Kerala Mural Style", image: `${base}gallery/ganesha-kerala-mural.jpg` },
  { id: 4, title: "Lantern-Lit Wooden Veranda", subtitle: "Acrylic Knife Painting", image: `${base}gallery/rustic-porch-painting.jpg` },
  { id: 5, title: "Ardhanarishvara, Kerala Mural Style", image: `${base}gallery/ardhanarishvara-mural.jpg` },
  { id: 6, title: "Dream Journey Capture, Mixed Media", image: `${base}gallery/mixed-media-dream-journey.jpg` },
  { id: 7, title: "Ocean Sunset, Multi-Panel Canvas", image: `${base}gallery/ocean-sunset-panels.jpg` },
  { id: 8, title: "Serene Buddha with Bodhi Leaves", subtitle: "Modern Abstract Art", image: `${base}gallery/buddha-bodhi-leaves.jpg` },
  { id: 9, title: "Traditional Tanjore Painting", image: `${base}gallery/tanjore-deity.jpg` },
  { id: 10, title: "Blue Buddha & Lotus Pond", subtitle: "Acrylic Textured Painting", image: `${base}gallery/blue-buddha-lotus-pond.jpg` },
  { id: 11, title: "Sacred Om Gesso Relief Panel", subtitle: "Kinnala North Karnataka form of Art", image: `${base}gallery/om-gesso-relief.jpg` },
  { id: 12, title: "Gandaberunda Miniature Painting", subtitle: "Ganjifa Painting", image: `${base}gallery/gandaberunda-miniature.jpg` },
  { id: 13, title: "Pichwai-Style Wall Disc Collection", subtitle: "Rajasthani Pichwai Painting Collections", image: `${base}gallery/pichwai-disc-collection.jpg` },
  { id: 14, title: "Feather Ballerina Keepsake", image: `${base}gallery/feather-ballerina-keepsake.jpg` },
  { id: 15, title: "Twin Swans in Blue", image: `${base}gallery/twin-swans-painting.jpg` },
  { id: 16, title: "A Young Artist & Her Feather Ballerina", image: `${base}gallery/young-artist-feather-ballerina.jpg` },
  { id: 17, title: "Little Hands, Big Creativity", image: `${base}gallery/little-hands-big-creativity.jpg` },
  { id: 18, title: "Creative Time Together", image: `${base}gallery/creative-time-together.jpg` },
  { id: 19, title: "Sketching Together", image: `${base}gallery/sketching-together.jpg` },
  { id: 20, title: "Hand-Painted Tote Bags", image: `${base}gallery/hand-painted-tote-bags.jpg` },
  { id: 21, title: "Madhubani-Style Wall Clock", subtitle: "Gond Art Wall Clock", image: `${base}gallery/madhubani-style-wall-clock.jpg` },
  { id: 22, title: "Art That Can Come Out in Real", image: `${base}gallery/art-that-can-come-out-in-real.jpg` },
];
