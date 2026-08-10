import { FOUNDER_BIO } from "../../data/siteContent.js";

export default function FounderBio() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-8">
      <p className="text-xs uppercase tracking-[0.3em] text-brand-gold-600">Our Story</p>
      <h1 className="mt-2 font-display text-3xl text-brand-green-900 sm:text-4xl">
        Born from a <span className="italic">Dream</span>, Built with Love
      </h1>
      <p className="mt-1 text-sm text-brand-green-800">{FOUNDER_BIO.title}</p>

      <div className="mt-6 space-y-4 text-brand-green-950/90">
        {FOUNDER_BIO.paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <blockquote className="mt-8 border-l-4 border-brand-gold-500 pl-4 font-display text-xl italic text-brand-green-900">
        "{FOUNDER_BIO.quote}"
      </blockquote>
    </section>
  );
}
