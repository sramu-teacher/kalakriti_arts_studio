import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GALLERY_ITEMS } from "../../data/galleryItems.js";

const AUTOPLAY_INTERVAL_MS = 5000;

export default function GalleryCarousel() {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % GALLERY_ITEMS.length);
    }, AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(timerRef.current);
  }, []);

  function goTo(next) {
    clearInterval(timerRef.current);
    setIndex((next + GALLERY_ITEMS.length) % GALLERY_ITEMS.length);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="relative overflow-hidden rounded-2xl bg-brand-cream-100 shadow-lg">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {GALLERY_ITEMS.map((item) => (
            <div key={item.id} className="flex h-80 w-full shrink-0 items-center justify-center sm:h-[28rem]">
              <img
                src={item.image}
                alt={item.title}
                className="h-full w-full object-contain"
                loading={item.id === GALLERY_ITEMS[0].id ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => goTo(index - 1)}
          aria-label="Previous artwork"
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          aria-label="Next artwork"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white hover:bg-black/50"
        >
          <ChevronRight size={22} />
        </button>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white">
          {index + 1} / {GALLERY_ITEMS.length}
        </div>
      </div>

      <p className="mt-4 text-center font-display text-lg text-brand-green-900">
        {GALLERY_ITEMS[index].title}
      </p>
    </div>
  );
}
