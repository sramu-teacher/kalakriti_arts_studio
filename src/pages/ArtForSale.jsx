import { Link } from "react-router-dom";
import { MessageCircle, ArrowRight } from "lucide-react";
import SEO from "../components/shared/SEO.jsx";
import { ART_FOR_SALE } from "../data/artForSale.js";
import { WHATSAPP_URL, CONTACT_EMAIL, PHONE_DISPLAY } from "../data/constants.js";

function ArtForSaleCard({ piece }) {
  const whatsappMessage = `Hi! I'm interested in buying "${piece.title}" from Kalakriti Art Studio. Could you share the price and availability?`;

  return (
    <article className="flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm">
      <div className="aspect-[4/5] overflow-hidden bg-brand-cream-100">
        <img
          src={piece.image}
          alt={`${piece.title} — ${piece.style}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-gold-600">{piece.style}</p>
        <h2 className="mt-2 font-display text-2xl text-brand-green-900">{piece.title}</h2>
        <p className="mt-2 flex-1 text-sm text-brand-green-950/80">{piece.description}</p>

        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:justify-center">
          <a
            href={`${WHATSAPP_URL}?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] lg:w-auto"
          >
            <MessageCircle size={18} />
            Chat on WhatsApp
          </a>
          <Link
            to={`/art-for-sale/${piece.id}/interest`}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-gold-500 px-6 py-3 text-sm font-semibold text-brand-green-950 transition-transform hover:scale-[1.02] lg:w-auto"
          >
            I'm Interested <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function ArtForSale() {
  return (
    <>
      <SEO
        title="Art for Sale"
        description="Hand-painted artwork made at Kalakriti Art Studio, available to buy. Enquire about any piece on WhatsApp or by email."
      />
      <div className="bg-brand-green-900 px-4 py-12 text-center text-brand-cream-100 sm:px-8">
        <p className="text-xs uppercase tracking-[0.3em] text-brand-gold-400">Art for Sale</p>
        <h1 className="mt-2 font-display text-4xl">Take a Piece of the Studio Home</h1>
        <p className="mx-auto mt-3 max-w-xl text-brand-cream-100/85">
          Hand-painted pieces made at Kalakriti Art Studio, available to buy. See something you
          love? Chat with us on WhatsApp or tap I'm Interested on any piece, and we'll get back to you with the price and availability.
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-14 sm:grid-cols-2 sm:px-8">
        {ART_FOR_SALE.map((piece) => (
          <ArtForSaleCard key={piece.id} piece={piece} />
        ))}
      </div>

      <div className="bg-brand-green-900 px-4 py-14 text-center text-brand-cream-100 sm:px-8">
        <p className="font-display text-2xl">Looking for something specific?</p>
        <p className="mx-auto mt-2 max-w-md text-brand-cream-100/80">
          We also take custom orders. Message us on WhatsApp at {PHONE_DISPLAY}, email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand-gold-400 hover:underline">
            {CONTACT_EMAIL}
          </a>
          , or{" "}
          <Link to="/contact" className="font-semibold text-brand-gold-400 hover:underline">
            visit the studio
          </Link>
          .
        </p>
      </div>
    </>
  );
}
