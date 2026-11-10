// Finished pieces the studio has available to buy, supplied by the owner
// (Drive folder "Art_For_Sale"). The source files only had ID filenames,
// so titles/styles below are best-guess descriptions from looking at each
// photo — the studio can correct them here. No pricing, consistent with
// the rest of the site: buyers enquire per piece over WhatsApp or the
// "I'm Interested" form (same pattern as the Events page).
//
// Paths use BASE_URL for the GitHub Pages subpath deploy — see the note
// in galleryItems.js.
const base = import.meta.env.BASE_URL;

export const ART_FOR_SALE = [
  {
    id: "pichwai-cow-wall-hanging",
    title: "Pichwai Cow & Lotus Wall Hangings",
    style: "Hand-painted wood · Pichwai style",
    description: "A pair of hanging cows under lotus strands, finished with pearl beads and brass bells.",
    imagePath: "for-sale/pichwai-cow-wall-hanging.jpg",
    image: `${base}for-sale/pichwai-cow-wall-hanging.jpg`,
  },
  {
    id: "lotus-kamadhenu-wall-hanging",
    title: "Kamadhenu Lotus Wall Hanging",
    style: "Hand-painted wood · Pichwai style",
    description: "A decorated cow on a pink-and-yellow lotus medallion, with a pearl and brass bell drop.",
    imagePath: "for-sale/lotus-kamadhenu-wall-hanging.jpg",
    image: `${base}for-sale/lotus-kamadhenu-wall-hanging.jpg`,
  },
  {
    id: "lotus-elephant-wall-hanging",
    title: "Lotus & Elephant Wall Hangings",
    style: "Hand-painted wood · Rajasthani style",
    description: "A pair of three-lotus strands ending in caparisoned elephants and brass bells.",
    imagePath: "for-sale/lotus-elephant-wall-hanging.jpg",
    image: `${base}for-sale/lotus-elephant-wall-hanging.jpg`,
  },
  {
    id: "fish-pair-wall-hanging",
    title: "Festive Fish Wall Hangings",
    style: "Hand-painted wood · Madhubani-inspired",
    description: "A pair of double-fish strands in red, orange and yellow, with pearl beads and brass bells.",
    imagePath: "for-sale/fish-pair-wall-hanging.jpg",
    image: `${base}for-sale/fish-pair-wall-hanging.jpg`,
  },
];

export function getArtForSaleById(id) {
  return ART_FOR_SALE.find((piece) => piece.id === id);
}
