import { Link } from "react-router-dom";
import { MessageCircle, ArrowRight, Calendar } from "lucide-react";
import { WHATSAPP_URL } from "../../data/constants.js";

export default function ClassSection({ classInfo }) {
  const whatsappMessage = `Hi! I'd like to know more about ${classInfo.name} at Kalakriti Art Studio.`;

  return (
    <section
      id={classInfo.slug}
      className="mx-auto max-w-4xl scroll-mt-32 rounded-3xl bg-white p-6 shadow-sm sm:p-10"
    >
      <p className="text-xs uppercase tracking-[0.3em] text-brand-gold-600">{classInfo.ageGroup}</p>
      <h2 className="mt-2 font-display text-3xl text-brand-green-900 sm:text-4xl">{classInfo.name}</h2>

      <p className="mt-6 text-brand-green-950/85">{classInfo.description}</p>

      <ul className="mt-6 flex flex-wrap gap-2">
        {classInfo.techniques.map((technique) => (
          <li key={technique} className="rounded-full bg-brand-cream-100 px-4 py-1.5 text-sm text-brand-green-900">
            {technique}
          </li>
        ))}
      </ul>

      {classInfo.schedules?.length > 0 && (
        <p className="mt-6 flex items-center gap-2 text-sm text-brand-green-900/70">
          <Calendar size={16} />
          {classInfo.schedules.join(" · ")}
        </p>
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
          to={`/classes/${classInfo.slug}/register`}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-gold-500 px-6 py-3 text-sm font-semibold text-brand-green-950 transition-transform hover:scale-[1.02] sm:w-auto"
        >
          Enquire Now <ArrowRight size={16} />
        </Link>
      </div>

      <p className="mt-6 text-sm text-brand-green-900/70">
        Curious about a specific style like Tanjore or Warli?{" "}
        <Link to="/catalog" className="font-semibold text-brand-gold-600 hover:underline">
          Browse our Full Style Catalog →
        </Link>
      </p>
    </section>
  );
}
