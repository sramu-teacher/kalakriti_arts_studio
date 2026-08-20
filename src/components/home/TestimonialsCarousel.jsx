import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { TESTIMONIALS } from "../../data/testimonials.js";
import { MAPS_LINK } from "../../data/constants.js";

const AUTOPLAY_INTERVAL_MS = 6000;

export default function TestimonialsCarousel() {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(timerRef.current);
  }, []);

  function goTo(next) {
    clearInterval(timerRef.current);
    setIndex((next + TESTIMONIALS.length) % TESTIMONIALS.length);
  }

  const current = TESTIMONIALS[index];

  return (
    <section className="bg-brand-green-900 px-4 py-14 text-brand-cream-100 sm:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-brand-gold-400">Testimonials</p>
        <h2 className="mt-2 font-display text-3xl">Loved by Our Students & Parents</h2>

        <div className="relative mt-10">
          {/* Fixed height + flex layout keeps stars/name pinned at the same
              position on every card regardless of quote length, so the
              carousel doesn't visibly resize as it rotates. */}
          <div className="flex h-80 flex-col rounded-2xl bg-brand-cream-50 p-8 text-brand-green-900 shadow-lg sm:p-10">
            <div className="flex justify-center gap-1 text-brand-gold-500">
              {Array.from({ length: current.rating }).map((_, i) => (
                <Star key={i} size={18} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <div className="flex flex-1 items-center justify-center">
              <p className="line-clamp-6 text-brand-green-900/90">"{current.quote}"</p>
            </div>
            <div>
              <p className="font-display text-lg text-brand-green-900">{current.name}</p>
              {current.badge && <p className="text-xs text-brand-green-900/60">{current.badge}</p>}
            </div>
          </div>

          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Previous review"
            className="absolute left-0 top-1/2 -translate-x-4 -translate-y-1/2 rounded-full bg-brand-cream-50 p-2 text-brand-green-900 shadow-xl transition-shadow hover:bg-brand-gold-400 hover:shadow-2xl sm:-translate-x-5"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Next review"
            className="absolute right-0 top-1/2 -translate-x-full translate-x-4 -translate-y-1/2 rounded-full bg-brand-cream-50 p-2 text-brand-green-900 shadow-xl transition-shadow hover:bg-brand-gold-400 hover:shadow-2xl sm:translate-x-5"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="mt-6 flex justify-center gap-2">
          {TESTIMONIALS.map((t, i) => (
            <button
              key={t.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show review ${i + 1}`}
              className={`h-2 w-2 rounded-full transition-colors ${
                i === index ? "bg-brand-gold-400" : "bg-brand-cream-100/40"
              }`}
            />
          ))}
        </div>

        <a
          href={MAPS_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block text-sm font-medium text-brand-gold-400 underline-offset-4 hover:underline"
        >
          Read more reviews on Google →
        </a>
      </div>
    </section>
  );
}
