import { VISION_SECTION, STUDIO_VALUES } from "../../data/siteContent.js";

export default function VisionSection() {
  return (
    <section className="bg-brand-green-900 px-4 py-16 text-brand-cream-100 sm:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-xs uppercase tracking-[0.3em] text-brand-gold-400">{VISION_SECTION.heading}</h2>
        <p className="mt-4 font-display text-lg italic leading-relaxed text-brand-cream-100/90 sm:text-xl">
          {VISION_SECTION.intro}
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-3">
        {VISION_SECTION.pillars.map((pillar) => (
          <div key={pillar.title} className="rounded-xl border border-brand-cream-100/15 bg-brand-green-800/50 p-6">
            <h3 className="font-display text-lg text-brand-gold-400">{pillar.title}</h3>
            <p className="mt-2 text-sm text-brand-cream-100/80">{pillar.body}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-2">
        {STUDIO_VALUES.map((value) => (
          <div key={value.title} className="rounded-xl bg-brand-cream-50 p-5 text-left text-brand-green-950">
            <h3 className="font-semibold">{value.title}</h3>
            <p className="mt-1 text-sm text-brand-green-950/80">{value.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
