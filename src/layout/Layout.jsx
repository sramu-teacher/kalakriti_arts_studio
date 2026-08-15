import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Breadcrumbs from "./Breadcrumbs.jsx";
import Footer from "./Footer.jsx";
import AnnouncementBanner from "../components/shared/AnnouncementBanner.jsx";
import WhatsAppFab from "../components/shared/WhatsAppFab.jsx";

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-brand-cream-50">
      {/* Banner + header stick together as one unit — previously only
          the header was sticky, so the banner (rendered above it in
          the DOM) scrolled out of view the instant a user scrolled at
          all, making it effectively invisible in practice. */}
      <div className="sticky top-0 z-30">
        <AnnouncementBanner />
        <Header />
      </div>
      <Breadcrumbs />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}
