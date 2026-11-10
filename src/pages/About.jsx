import SEO from "../components/shared/SEO.jsx";
import { PAGE_META } from "../data/pageMeta.js";
import FounderBio from "../components/about/FounderBio.jsx";
import VisionSection from "../components/about/VisionSection.jsx";
import TestimonialQuote from "../components/about/TestimonialQuote.jsx";

export default function About() {
  return (
    <>
      <SEO {...PAGE_META.about} />
      <FounderBio />
      <VisionSection />
      <TestimonialQuote />
    </>
  );
}
