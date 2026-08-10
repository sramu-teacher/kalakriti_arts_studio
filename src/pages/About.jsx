import SEO from "../components/shared/SEO.jsx";
import FounderBio from "../components/about/FounderBio.jsx";
import VisionSection from "../components/about/VisionSection.jsx";
import TestimonialQuote from "../components/about/TestimonialQuote.jsx";

export default function About() {
  return (
    <>
      <SEO
        title="Our Story"
        description="Meet Supriya Suresh, founder of Kalakriti Art Studio — artist, interior designer, and art educator building a creative community in Bengaluru."
      />
      <FounderBio />
      <VisionSection />
      <TestimonialQuote />
    </>
  );
}
