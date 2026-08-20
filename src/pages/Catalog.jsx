import { Link } from "react-router-dom";
import SEO from "../components/shared/SEO.jsx";
import CatalogCategorySection from "../components/catalog/CatalogCategorySection.jsx";
import { CATALOG } from "../data/catalog.js";

export default function Catalog() {
  return (
    <>
      <SEO
        title="Full Style Catalog"
        description="Every technique and painting style taught at Kalakriti Art Studio — foundation drawing & painting, traditional Indian painting styles, custom programs, and quick one-hour sessions."
      />
      <div className="bg-brand-green-900 px-4 py-12 text-center text-brand-cream-100 sm:px-8">
        <p className="text-xs uppercase tracking-[0.3em] text-brand-gold-400">Our Menu of Styles</p>
        <h1 className="mt-2 font-display text-4xl">From First Sketch to Signature Piece</h1>
        <p className="mx-auto mt-3 max-w-xl text-brand-cream-100/85">
          The full range of what we teach, browsable by category. Not sure where to start? Our{" "}
          <Link to="/classes" className="font-semibold text-brand-gold-400 hover:underline">
            5 core classes
          </Link>{" "}
          are a great first step, and this list shows the wider range of styles you can grow into.
        </p>
        <nav aria-label="Jump to a style category" className="mx-auto mt-6 flex max-w-xl flex-wrap justify-center gap-2">
          {CATALOG.map((category) => (
            <a
              key={category.slug}
              href={`#${category.slug}`}
              className="rounded-full border border-brand-cream-100/30 px-4 py-1.5 text-sm text-brand-cream-100/85 hover:border-brand-gold-400 hover:text-brand-gold-400"
            >
              {category.menuLabel}
            </a>
          ))}
        </nav>
      </div>

      <div className="space-y-10 px-4 py-14 sm:px-8">
        {CATALOG.map((category) => (
          <CatalogCategorySection key={category.slug} category={category} />
        ))}
      </div>

      <div className="bg-brand-green-900 px-4 py-14 text-center text-brand-cream-100 sm:px-8">
        <p className="text-brand-cream-100/85">
          Planning a birthday, holiday camp, or other celebration instead?
        </p>
        <Link to="/events" className="mt-2 inline-block font-semibold text-brand-gold-400 hover:underline">
          See our studio events →
        </Link>
        <p className="mx-auto mt-8 max-w-md text-sm text-brand-cream-100/70">
          We also run a small in-studio Art Store for materials & supplies — drop by and browse,
          or ask us what's in stock.
        </p>
      </div>
    </>
  );
}
