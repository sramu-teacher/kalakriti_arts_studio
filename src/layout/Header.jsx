import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "../data/constants.js";
import MobileNav from "./MobileNav.jsx";

const desktopLinkClass = ({ isActive }) =>
  `text-sm font-medium tracking-wide transition-colors ${
    isActive ? "text-brand-gold-400" : "text-brand-cream-100 hover:text-brand-gold-400"
  }`;

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-brand-green-900 text-brand-cream-100 shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-8">
        <Link to="/" onClick={() => setOpen(false)}>
          <img
            src={`${import.meta.env.BASE_URL}brand_logo.jpg`}
            alt="Kalakriti Art Studio"
            className="h-12 w-auto rounded-sm sm:h-14"
          />
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.path} to={link.path} end={link.path === "/"} className={desktopLinkClass}>
              {link.label}
            </NavLink>
          ))}
          <Link
            to="/classes"
            className="rounded-full bg-brand-gold-500 px-5 py-2 text-sm font-semibold text-brand-green-950 transition-transform hover:scale-105"
          >
            Register Now
          </Link>
        </nav>

        <button
          type="button"
          className="p-2 text-brand-cream-100 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && <MobileNav onNavigate={() => setOpen(false)} />}
    </header>
  );
}
