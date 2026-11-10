import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { NAV_LINKS } from "../data/constants.js";
import { getArtForSaleById } from "../data/artForSale.js";
import { findEvent } from "../data/eventListings.js";

// Builds a simple breadcrumb trail from the current path using the same
// labels as the main nav — good enough for this site's flat route depth
// (no nested category pages beyond /classes/:slug/register).
function labelFor(segment, pathname) {
  const navMatch = NAV_LINKS.find((link) => link.path === pathname);
  if (navMatch) return navMatch.label;
  if (segment === "register") return "Register";
  if (segment === "interest") return "I'm Interested";
  return segment
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.map((segment, index) => {
    const path = "/" + segments.slice(0, index + 1).join("/");
    // Art pieces have no page of their own (/art-for-sale/:id) — show
    // the real title and point the crumb back at the listing instead.
    const piece = segments[0] === "art-for-sale" && index === 1 && getArtForSaleById(segment);
    if (piece) return { path: "/art-for-sale", label: piece.title };
    const event = segments[0] === "events" && index === 1 && findEvent(segment);
    if (event) return { path, label: event.name };
    return { path, label: labelFor(segment, path) };
  });

  return (
    <nav aria-label="Breadcrumb" className="bg-brand-cream-100 px-4 py-2 sm:px-8">
      <ol className="mx-auto flex max-w-6xl flex-wrap items-center gap-1 text-sm text-brand-green-800">
        <li>
          <Link to="/" className="hover:text-brand-gold-600">
            Home
          </Link>
        </li>
        {crumbs.map((crumb, index) => (
          <li key={index} className="flex items-center gap-1">
            <ChevronRight size={14} className="text-brand-green-700/60" />
            {index === crumbs.length - 1 ? (
              <span aria-current="page" className="font-medium text-brand-green-950">
                {crumb.label}
              </span>
            ) : (
              <Link to={crumb.path} className="hover:text-brand-gold-600">
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
