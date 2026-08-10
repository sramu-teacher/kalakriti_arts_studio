import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Palette } from "lucide-react";
import { GALLERY_ITEMS } from "../../data/galleryItems.js";

const THEME_CLASSES = {
  gold: "bg-gradient-to-br from-brand-gold-400 to-brand-gold-600",
  green: "bg-gradient-to-br from-brand-green-700 to-brand-green-900",
  "deep-green": "bg-gradient-to-br from-brand-green-900 to-brand-green-950",
};

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
    <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl shadow-lg">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {GALLERY_ITEMS.map((item) => (
          <div
            key={item.id}
            className={`flex h-72 w-full shrink-0 flex-col items-center justify-center gap-3 text-brand-cream-100 sm:h-96 ${
              THEME_CLASSES[item.theme]
            }`}
          >
            <Palette size={48} className="opacity-80" />
            <p className="font-display text-xl">{item.title}</p>
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

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
        {GALLERY_ITEMS.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 w-2 rounded-full transition-all ${
              i === index ? "w-6 bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
