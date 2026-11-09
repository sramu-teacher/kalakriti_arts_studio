import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "./layout/Layout.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Classes from "./pages/Classes.jsx";
import ClassRegister from "./pages/ClassRegister.jsx";
import Catalog from "./pages/Catalog.jsx";
import Events from "./pages/Events.jsx";
import EventInterest from "./pages/EventInterest.jsx";
import Gallery from "./pages/Gallery.jsx";
import ArtForSale from "./pages/ArtForSale.jsx";
import ArtInterest from "./pages/ArtInterest.jsx";
import Contact from "./pages/Contact.jsx";
import Admin from "./pages/Admin.jsx";
import NotFound from "./pages/NotFound.jsx";

// Client-side routing doesn't reset scroll position the way full page
// loads do — this restores that expected browser behavior on
// navigation. A hash (e.g. /catalog#foundation-classes, used by the
// Classes/Catalog quick-jump nav) scrolls to that section on load
// instead of forcing scroll-to-top, so a direct/shared link to a
// specific section lands correctly.
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/classes/:slug/register" element={<ClassRegister />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:slug/interest" element={<EventInterest />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/art-for-sale" element={<ArtForSale />} />
          <Route path="/art-for-sale/:id/interest" element={<ArtInterest />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
