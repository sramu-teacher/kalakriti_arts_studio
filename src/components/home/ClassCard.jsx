import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const THEME_CLASSES = {
  gold: "bg-brand-gold-500 text-brand-green-950",
  green: "bg-brand-green-800 text-brand-cream-100",
};

export default function ClassCard({ classInfo }) {
  const theme = THEME_CLASSES[classInfo.theme] || THEME_CLASSES.green;

  return (
    <div className={`flex flex-col rounded-2xl p-6 shadow-sm ${theme}`}>
      <p className="text-xs uppercase tracking-wide opacity-70">{classInfo.ageGroup}</p>
      <h3 className="mt-2 font-display text-xl">{classInfo.name}</h3>
      <p className="mt-2 flex-1 text-sm opacity-90">{classInfo.description}</p>
      <Link
        to={`/classes/${classInfo.slug}/register`}
        className="mt-5 inline-flex items-center gap-1 self-start rounded-full bg-black/10 px-4 py-2 text-sm font-semibold transition-transform hover:scale-105"
      >
        Enroll <ArrowRight size={16} />
      </Link>
    </div>
  );
}
