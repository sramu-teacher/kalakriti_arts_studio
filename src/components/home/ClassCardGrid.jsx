import { Link } from "react-router-dom";
import { CLASSES } from "../../data/classes.js";
import ClassCard from "./ClassCard.jsx";

export default function ClassCardGrid({ limit }) {
  const classes = limit ? CLASSES.slice(0, limit) : CLASSES;

  return (
    <section className="bg-brand-cream-100 px-4 py-14 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-brand-gold-600">Classes</p>
          <h2 className="mt-2 font-display text-3xl text-brand-green-900">Find Your Creative Path</h2>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((classInfo) => (
            <ClassCard key={classInfo.slug} classInfo={classInfo} />
          ))}
        </div>

        {limit && (
          <div className="mt-10 text-center">
            <Link
              to="/classes"
              className="inline-block rounded-full border border-brand-green-800 px-6 py-2 text-sm font-semibold text-brand-green-900 hover:bg-brand-green-900 hover:text-brand-cream-100"
            >
              View All Classes
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
