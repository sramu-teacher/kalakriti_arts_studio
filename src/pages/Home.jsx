import SEO from "../components/shared/SEO.jsx";
import Hero from "../components/home/Hero.jsx";
import WelcomeSection from "../components/home/WelcomeSection.jsx";
import ClassCardGrid from "../components/home/ClassCardGrid.jsx";
import TestimonialsCarousel from "../components/home/TestimonialsCarousel.jsx";

export default function Home() {
  return (
    <>
      <SEO
        title="Art Classes in Uttarahalli, Bengaluru"
        description="A creative space for kids and adults in Uttarahalli, Bengaluru to learn, create, and express through art. Explore our classes and workshops."
      />
      <Hero />
      <WelcomeSection />
      <ClassCardGrid limit={3} />
      <TestimonialsCarousel />
    </>
  );
}
