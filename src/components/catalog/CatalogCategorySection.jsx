import { Link } from "react-router-dom";
import { MessageCircle, ArrowRight } from "lucide-react";
import { WHATSAPP_URL } from "../../data/constants.js";

export default function CatalogCategorySection({ category }) {
  const whatsappMessage = `Hi! I'd like to know more about ${category.name} at Kalakriti Art Studio.`;

  return (
    <section
      id={category.slug}
      className="mx-auto max-w-4xl scroll-mt-32 rounded-3xl bg-white p-6 shadow-sm sm:p-10"
    >
      <p className="text-xs uppercase tracking-[0.3em] text-brand-gold-600">{category.menuLabel}</p>
      <h2 className="mt-2 font-display text-3xl text-brand-green-900 sm:text-4xl">{category.name}</h2>
      <p className="mt-2 font-display text-lg italic text-brand-gold-600">{category.tagline}</p>

      <p className="mt-6 text-brand-green-950/85">{category.description}</p>

      <ul className="mt-6 flex flex-wrap gap-2">
        {category.items.map((item) => (
          <li key={item} className="rounded-full bg-brand-cream-100 px-4 py-1.5 text-sm text-brand-green-900">
            {item}
          </li>
        ))}
      </ul>

      {category.highlights && (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {category.highlights.map((highlight) => (
            <div key={highlight.title} className="rounded-xl bg-brand-green-900 p-4 text-brand-cream-100">
              <p className="font-display text-base text-brand-gold-400">{highlight.title}</p>
              <p className="mt-1 text-sm text-brand-cream-100/80">{highlight.body}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <a
          href={`${WHATSAPP_URL}?text=${encodeURIComponent(whatsappMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] sm:w-auto"
        >
          <MessageCircle size={18} />
          Chat on WhatsApp
        </a>
        <Link
          to="/contact"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-gold-500 px-6 py-3 text-sm font-semibold text-brand-green-950 transition-transform hover:scale-[1.02] sm:w-auto"
        >
          Contact the Studio <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}
