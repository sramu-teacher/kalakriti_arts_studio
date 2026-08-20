import { Link } from "react-router-dom";
import { NAV_LINKS, ADDRESS_LINES, PHONE_DISPLAY, TEL_URL, CONTACT_EMAIL } from "../data/constants.js";
import { CLASSES } from "../data/classes.js";
import SocialIcons from "../components/shared/SocialIcons.jsx";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-green-950 text-brand-cream-100">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-8 md:grid-cols-4">
        <div>
          <img
            src={`${import.meta.env.BASE_URL}brand_logo.jpg`}
            alt="Kalakriti Art Studio"
            className="h-auto w-full max-w-[220px] rounded-sm"
          />
          <div className="mt-4">
            <SocialIcons />
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-gold-400">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.path}>
                <Link to={link.path} className="text-brand-cream-100/80 hover:text-brand-gold-400">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-gold-400">Classes</h3>
          <ul className="space-y-2 text-sm">
            {CLASSES.slice(0, 5).map((cls) => (
              <li key={cls.slug}>
                <Link to={`/classes/${cls.slug}/register`} className="text-brand-cream-100/80 hover:text-brand-gold-400">
                  {cls.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-gold-400">Visit Us</h3>
          <address className="space-y-1 text-sm not-italic text-brand-cream-100/80">
            {ADDRESS_LINES.map((line) => (
              <p key={line}>{line}</p>
            ))}
            <p className="pt-2">
              <a href={TEL_URL} className="hover:text-brand-gold-400">
                {PHONE_DISPLAY}
              </a>
            </p>
            <p>{CONTACT_EMAIL}</p>
          </address>
        </div>
      </div>

      <div className="border-t border-brand-cream-100/10 px-4 py-4 text-center text-xs text-brand-cream-100/60 sm:px-8">
        © {year} Kalakriti Art Studio. All rights reserved.
      </div>
    </footer>
  );
}
