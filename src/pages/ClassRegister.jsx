import { useParams } from "react-router-dom";
import SEO from "../components/shared/SEO.jsx";
import { classRegisterMeta } from "../data/pageMeta.js";
import RegistrationForm from "../components/registration/RegistrationForm.jsx";
import { getClassBySlug } from "../data/classes.js";
import NotFound from "./NotFound.jsx";

export default function ClassRegister() {
  const { slug } = useParams();
  const classInfo = getClassBySlug(slug);

  if (!classInfo) return <NotFound />;

  return (
    <>
      <SEO {...classRegisterMeta(classInfo)} />
      <div className="bg-brand-green-900 px-4 py-10 text-center text-brand-cream-100 sm:px-8">
        <p className="text-xs uppercase tracking-[0.3em] text-brand-gold-400">Enroll Today</p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">{classInfo.name}</h1>
        <p className="mt-2 text-brand-cream-100/80">{classInfo.ageGroup}</p>
      </div>
      <div className="px-4 py-12 sm:px-8">
        <RegistrationForm classInfo={classInfo} />
      </div>
    </>
  );
}
