import { X, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAnnouncementBanner } from "../../hooks/useAnnouncementBanner.js";

const ACTION_CLASS =
  "inline-flex items-center gap-1 font-semibold underline underline-offset-2 hover:no-underline";

export default function AnnouncementBanner() {
  const banner = useAnnouncementBanner();
  const [dismissed, setDismissed] = useState(false);

  if (!banner || dismissed) return null;

  const hasAction = banner.actionLabel && banner.actionUrl;
  const isExternal = hasAction && /^https?:\/\//.test(banner.actionUrl);

  return (
    <div className="relative flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-brand-gold-500 px-10 py-2 text-center text-sm text-brand-green-950">
      <span>{banner.message}</span>

      {hasAction &&
        (isExternal ? (
          <a href={banner.actionUrl} target="_blank" rel="noopener noreferrer" className={ACTION_CLASS}>
            {banner.actionLabel} <ArrowRight size={14} />
          </a>
        ) : (
          <Link to={banner.actionUrl} className={ACTION_CLASS}>
            {banner.actionLabel} <ArrowRight size={14} />
          </Link>
        ))}

      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss announcement"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:opacity-70"
      >
        <X size={16} />
      </button>
    </div>
  );
}
