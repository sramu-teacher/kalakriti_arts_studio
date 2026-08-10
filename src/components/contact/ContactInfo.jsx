import { MapPin, Phone, Mail, Clock } from "lucide-react";
import {
  ADDRESS_LINES,
  PHONE_DISPLAY,
  CONTACT_EMAIL,
  STUDIO_HOURS,
  MAPS_LINK,
} from "../../data/constants.js";
import SocialIcons from "../shared/SocialIcons.jsx";

const ROW_CLASS = "flex items-start gap-3";
const ICON_WRAP =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-gold-500/15 text-brand-gold-400";

export default function ContactInfo() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-brand-gold-400">Get in Touch</p>
        <h1 className="mt-2 font-display text-2xl text-brand-cream-100">
          Visit Us at Kalakriti Art Studio
        </h1>
        <p className="mt-2 text-brand-cream-100/80">
          We'd love to show you around! Drop by for a free demo class, or reach out and we'll
          get back to you quickly.
        </p>
      </div>

      <div className={ROW_CLASS}>
        <div className={ICON_WRAP}>
          <MapPin size={18} />
        </div>
        <address className="not-italic text-brand-cream-100/85">
          <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-brand-gold-400">
            {ADDRESS_LINES.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </a>
        </address>
      </div>

      <div className={ROW_CLASS}>
        <div className={ICON_WRAP}>
          <Phone size={18} />
        </div>
        <p className="text-brand-cream-100/85">{PHONE_DISPLAY} (Phone / WhatsApp)</p>
      </div>

      <div className={ROW_CLASS}>
        <div className={ICON_WRAP}>
          <Mail size={18} />
        </div>
        <p className="text-brand-cream-100/85">{CONTACT_EMAIL}</p>
      </div>

      <div className={ROW_CLASS}>
        <div className={ICON_WRAP}>
          <Clock size={18} />
        </div>
        <div className="text-brand-cream-100/85">
          {STUDIO_HOURS.map((entry) => (
            <p key={entry.days}>
              {entry.days} · {entry.hours}
            </p>
          ))}
        </div>
      </div>

      <SocialIcons />
    </div>
  );
}
