import { Palette } from "lucide-react";
import { GALLERY_ITEMS } from "../../data/galleryItems.js";

const THEME_CLASSES = {
  gold: "bg-gradient-to-br from-brand-gold-400 to-brand-gold-600",
  green: "bg-gradient-to-br from-brand-green-700 to-brand-green-900",
  "deep-green": "bg-gradient-to-br from-brand-green-900 to-brand-green-950",
};

export default function GalleryGrid() {
  return (
    <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 sm:px-8 md:grid-cols-3">
      {GALLERY_ITEMS.map((item) => (
        <div
          key={item.id}
          className={`flex h-40 flex-col items-center justify-center gap-2 rounded-xl text-brand-cream-100 sm:h-48 ${
            THEME_CLASSES[item.theme]
          }`}
        >
          <Palette size={28} className="opacity-80" />
          <p className="text-center text-sm font-medium">{item.title}</p>
        </div>
      ))}
    </div>
  );
}
