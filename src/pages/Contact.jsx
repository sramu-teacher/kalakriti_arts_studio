import SEO from "../components/shared/SEO.jsx";
import { PAGE_META } from "../data/pageMeta.js";
import ContactInfo from "../components/contact/ContactInfo.jsx";
import MapEmbed from "../components/contact/MapEmbed.jsx";
import ContactForm from "../components/contact/ContactForm.jsx";

export default function Contact() {
  return (
    <>
      <SEO {...PAGE_META.contact} />
      <div className="bg-brand-green-900 px-4 py-14 sm:px-8">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
          <div className="space-y-8">
            <ContactInfo />
            <MapEmbed />
          </div>
          <ContactForm />
        </div>
      </div>
    </>
  );
}
