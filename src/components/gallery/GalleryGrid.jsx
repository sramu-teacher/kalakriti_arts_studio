import { GALLERY_ITEMS } from "../../data/galleryItems.js";

export default function GalleryGrid() {
  return (
    <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 sm:px-8 md:grid-cols-3">
      {GALLERY_ITEMS.map((item) => (
        <div key={item.id} className="group relative h-40 overflow-hidden rounded-xl sm:h-56">
          <img
            src={item.image}
            alt={item.subtitle ? `${item.title} — ${item.subtitle}` : item.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
            <p className="text-center text-xs font-medium text-white sm:text-sm">{item.title}</p>
            {item.subtitle && <p className="text-center text-[10px] text-white/75 sm:text-xs">{item.subtitle}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
