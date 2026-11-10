import SEO from "../components/shared/SEO.jsx";
import { PAGE_META } from "../data/pageMeta.js";
import Hero from "../components/home/Hero.jsx";
import WelcomeSection from "../components/home/WelcomeSection.jsx";
import ClassCardGrid from "../components/home/ClassCardGrid.jsx";
import TestimonialsCarousel from "../components/home/TestimonialsCarousel.jsx";

export default function Home() {
  return (
    <>
      <SEO {...PAGE_META.home} />
      <Hero />
      <WelcomeSection />
      <ClassCardGrid limit={3} />
      <TestimonialsCarousel />
    </>
  );
}
