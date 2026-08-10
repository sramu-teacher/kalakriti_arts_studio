import { NavLink } from "react-router-dom";
import { NAV_LINKS } from "../data/constants.js";

const linkClass = ({ isActive }) =>
  `block rounded-md px-4 py-3 text-base font-medium ${
    isActive ? "bg-brand-green-800 text-brand-gold-400" : "text-brand-cream-100 hover:bg-brand-green-800/60"
  }`;

export default function MobileNav({ onNavigate }) {
  return (
    <nav id="mobile-nav" className="border-t border-brand-green-800 bg-brand-green-900 md:hidden">
      <ul className="flex flex-col gap-1 px-2 py-3">
        {NAV_LINKS.map((link) => (
          <li key={link.path}>
            <NavLink to={link.path} end={link.path === "/"} className={linkClass} onClick={onNavigate}>
              {link.label}
            </NavLink>
          </li>
        ))}
        <li>
          <NavLink
            to="/classes"
            onClick={onNavigate}
            className="mt-2 block rounded-md bg-brand-gold-500 px-4 py-3 text-center text-base font-semibold text-brand-green-950"
          >
            Register Now
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
