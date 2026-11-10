import { Link } from "react-router-dom";
import { HOME_WELCOME, TAGLINE } from "../../data/siteContent.js";

export default function Hero() {
  return (
    <section className="bg-brand-green-900 px-4 py-16 text-center text-brand-cream-100 sm:px-8 sm:py-24">
      <p className="text-xs uppercase tracking-[0.3em] text-brand-gold-400">{HOME_WELCOME.eyebrow}</p>
      {/* "Kalakriti" uses the logo's own Devanagari-style lettering (cut
          from public/brand_logo.jpg into a transparent gold PNG) — no web
          font matches it. The img alt keeps the heading text "Kalakriti
          Art Studio" for search engines and screen readers. */}
      <h1 className="mx-auto mt-5 max-w-3xl font-display text-4xl leading-tight text-brand-gold-400 sm:text-5xl">
        <img
          src={`${import.meta.env.BASE_URL}kalakriti-wordmark.png`}
          alt="Kalakriti"
          width="847"
          height="123"
          className="mx-auto h-11 w-auto sm:h-16"
        />
        <span className="mt-3 block">Art Studio</span>
      </h1>
      <p className="mt-2 font-display italic text-brand-gold-400/90">"{TAGLINE}"</p>
      <p className="mx-auto mt-6 max-w-2xl text-brand-cream-100/85">{HOME_WELCOME.intro}</p>

      <div className="mx-auto mt-8 flex max-w-xs flex-col items-center gap-4 sm:max-w-none sm:flex-row sm:justify-center">
        <Link
          to="/classes"
          className="w-full rounded-full bg-brand-gold-500 px-7 py-3 text-center text-sm font-semibold text-brand-green-950 transition-transform hover:scale-105 sm:w-60"
        >
          Begin Your Journey
        </Link>
        <Link
          to="/about"
          className="w-full rounded-full border border-brand-cream-100/40 px-7 py-3 text-center text-sm font-semibold text-brand-cream-100 transition-colors hover:border-brand-gold-400 hover:text-brand-gold-400 sm:w-60"
        >
          Our Story →
        </Link>
      </div>

      <div className="mx-auto mt-14 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
        {HOME_WELCOME.stats.map((stat) => (
          <div key={stat.label}>
            <p className="font-display text-2xl text-brand-gold-400 sm:text-3xl">{stat.value}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-brand-cream-100/70">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
