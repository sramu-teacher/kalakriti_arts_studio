import { FOUNDER_TESTIMONIAL, FOUNDER_BIO } from "../../data/siteContent.js";

export default function TestimonialQuote() {
  return (
    <section className="px-4 py-14 sm:px-8">
      <blockquote className="mx-auto max-w-3xl rounded-2xl bg-brand-green-900 p-8 text-center text-brand-cream-100 sm:p-12">
        <p className="font-display text-lg italic leading-relaxed sm:text-xl">"{FOUNDER_TESTIMONIAL}"</p>
        <footer className="mt-6 text-sm uppercase tracking-wide text-brand-gold-400">
          — {FOUNDER_BIO.title}
        </footer>
      </blockquote>
    </section>
  );
}
