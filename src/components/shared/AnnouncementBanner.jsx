import { X } from "lucide-react";
import { useState } from "react";
import { useAnnouncementBanner } from "../../hooks/useAnnouncementBanner.js";

export default function AnnouncementBanner() {
  const banner = useAnnouncementBanner();
  const [dismissed, setDismissed] = useState(false);

  if (!banner || dismissed) return null;

  return (
    <div className="relative bg-brand-gold-500 text-brand-green-950 text-sm text-center px-10 py-2">
      <span>{banner.message}</span>
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
