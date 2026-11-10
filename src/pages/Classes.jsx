import { useEffect } from "react";
import SEO from "../components/shared/SEO.jsx";
import { PAGE_META } from "../data/pageMeta.js";
import ClassSection from "../components/classes/ClassSection.jsx";
import { CLASSES } from "../data/classes.js";
import { upsertJsonLd, removeJsonLd } from "../utils/seo.js";

const JSON_LD_ID = "classes-jsonld";

export default function Classes() {
  useEffect(() => {
    upsertJsonLd(JSON_LD_ID, {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: CLASSES.map((classInfo, index) => ({
        "@type": "Course",
        position: index + 1,
        name: classInfo.name,
        description: classInfo.description,
        provider: {
          "@type": "Organization",
          name: "Kalakriti Art Studio",
          sameAs: "https://kalakritiartstudio.com/",
        },
      })),
    });
    return () => removeJsonLd(JSON_LD_ID);
  }, []);

  return (
    <>
      <SEO {...PAGE_META.classes} />
      <div className="bg-brand-green-900 px-4 py-12 text-center text-brand-cream-100 sm:px-8">
        <p className="text-xs uppercase tracking-[0.3em] text-brand-gold-400">Enquire Today</p>
        <h1 className="mt-2 font-display text-4xl">Our Classes</h1>
        <p className="mx-auto mt-3 max-w-xl text-brand-cream-100/85">
          Free demo class before you commit, no prior experience needed for most classes. Have a
          browse, then reach out — we'll help you find the right fit.
        </p>
      </div>

      <div className="space-y-10 px-4 py-14 sm:px-8">
        {CLASSES.map((classInfo) => (
          <ClassSection key={classInfo.slug} classInfo={classInfo} />
        ))}
      </div>
    </>
  );
}
