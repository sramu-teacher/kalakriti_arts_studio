import SEO from "../components/shared/SEO.jsx";
import ClassCardGrid from "../components/home/ClassCardGrid.jsx";

export default function Classes() {
  return (
    <>
      <SEO
        title="Classes"
        description="Explore Kalakriti Art Studio's classes and workshops for kids, teens, and adults — drawing, painting, mandala art, pottery, and more."
      />
      <div className="bg-brand-green-900 px-4 py-12 text-center text-brand-cream-100 sm:px-8">
        <p className="text-xs uppercase tracking-[0.3em] text-brand-gold-400">Enroll Today</p>
        <h1 className="mt-2 font-display text-4xl">Our Classes</h1>
        <p className="mx-auto mt-3 max-w-xl text-brand-cream-100/85">
          Seats fill quickly — register now to secure your spot in the upcoming batch. Free
          demo class before you commit, no prior experience needed for most classes.
        </p>
      </div>
      <ClassCardGrid />
    </>
  );
}
