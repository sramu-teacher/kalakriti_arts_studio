import { Phone, Mail } from "lucide-react";
import { INSTAGRAM_URL, FACEBOOK_URL, TEL_URL, CONTACT_EMAIL } from "../../data/constants.js";

const ICON_CLASS =
  "flex h-9 w-9 items-center justify-center rounded-full border border-brand-gold-500/50 text-brand-gold-400 transition-colors hover:bg-brand-gold-500 hover:text-brand-green-950";

// lucide-react dropped brand/logo icons — this is a hand-drawn glyph
// matching lucide's stroke style (24x24, currentColor, 2px stroke).
function InstagramIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

// Same reasoning as InstagramIcon above — a hand-drawn "f" flag glyph
// in lucide's stroke style, since no Facebook icon ships in this
// version of lucide-react either.
function FacebookIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 4h-2a3 3 0 0 0-3 3v3H7v3h3v7h3v-7h2.5l.5-3h-3V7a1 1 0 0 1 1-1h2z" />
    </svg>
  );
}

export default function SocialIcons() {
  return (
    <div className="flex gap-3">
      <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={ICON_CLASS}>
        <InstagramIcon />
      </a>
      <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={ICON_CLASS}>
        <FacebookIcon />
      </a>
      <a href={TEL_URL} aria-label="Call us" className={ICON_CLASS}>
        <Phone size={18} />
      </a>
      <a href={`mailto:${CONTACT_EMAIL}`} aria-label="Email" className={ICON_CLASS}>
        <Mail size={18} />
      </a>
    </div>
  );
}
