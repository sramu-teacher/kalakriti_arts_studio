import SEO from "../components/shared/SEO.jsx";
import ContactInfo from "../components/contact/ContactInfo.jsx";
import MapEmbed from "../components/contact/MapEmbed.jsx";
import ContactForm from "../components/contact/ContactForm.jsx";

export default function Contact() {
  return (
    <>
      <SEO
        title="Contact Us in Uttarahalli, Bengaluru"
        description="Get in touch with Kalakriti Art Studio in Uttarahalli, Bengaluru — visit us, call, WhatsApp, or send a message."
      />
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
