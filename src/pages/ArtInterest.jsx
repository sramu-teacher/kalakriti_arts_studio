import { useParams } from "react-router-dom";
import SEO from "../components/shared/SEO.jsx";
import { artInterestMeta } from "../data/pageMeta.js";
import ArtInterestForm from "../components/artForSale/ArtInterestForm.jsx";
import { getArtForSaleById } from "../data/artForSale.js";
import NotFound from "./NotFound.jsx";

export default function ArtInterest() {
  const { id } = useParams();
  const piece = getArtForSaleById(id);

  if (!piece) return <NotFound />;

  return (
    <>
      <SEO {...artInterestMeta(piece)} />
      <div className="bg-brand-green-900 px-4 py-10 text-center text-brand-cream-100 sm:px-8">
        <p className="text-xs uppercase tracking-[0.3em] text-brand-gold-400">Art for Sale</p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">{piece.title}</h1>
        <p className="mt-2 text-brand-cream-100/80">{piece.style}</p>
      </div>
      <div className="px-4 py-12 sm:px-8">
        <ArtInterestForm piece={piece} />
      </div>
    </>
  );
}
