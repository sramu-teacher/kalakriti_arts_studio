import SEO from "../components/shared/SEO.jsx";
import GalleryCarousel from "../components/gallery/GalleryCarousel.jsx";
import GalleryGrid from "../components/gallery/GalleryGrid.jsx";

export default function Gallery() {
  return (
    <>
      <SEO
        title="Gallery"
        description="A glimpse into the beautiful artwork created by students at Kalakriti Art Studio."
      />
      <div className="px-4 pt-12 text-center sm:px-8">
        <p className="text-xs uppercase tracking-[0.3em] text-brand-gold-600">Gallery</p>
        <h1 className="mt-2 font-display text-3xl text-brand-green-900 sm:text-4xl">
          Stories <span className="italic">Painted</span> by Our Students
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-brand-green-900/75">
          A glimpse into the beautiful work created right here at Kalakriti.
        </p>
      </div>

      <div className="px-4 py-10 sm:px-8">
        <GalleryCarousel />
      </div>

      <div className="pb-14">
        <GalleryGrid />
      </div>
    </>
  );
}
