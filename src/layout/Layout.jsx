import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Breadcrumbs from "./Breadcrumbs.jsx";
import Footer from "./Footer.jsx";
import AnnouncementBanner from "../components/shared/AnnouncementBanner.jsx";
import WhatsAppFab from "../components/shared/WhatsAppFab.jsx";

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-brand-cream-50">
      <AnnouncementBanner />
      <Header />
      <Breadcrumbs />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFab />
    </div>
  );
}
