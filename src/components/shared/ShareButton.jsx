import { useEffect, useRef, useState } from "react";
import { Share2 } from "lucide-react";

// Shares a link to one of the site's pages. Uses the device's native
// share sheet where available (phones: WhatsApp, Instagram, etc.), and
// otherwise copies the link to the clipboard. The result is announced
// through a polite live region so screen-reader users hear "Link copied"
// without focus moving. `path` is a route path like "/events/foo".
export default function ShareButton({ path, title, className = "" }) {
  const [status, setStatus] = useState("");
  const timer = useRef(null);
  const url = `${window.location.origin}${import.meta.env.BASE_URL.replace(/\/$/, "")}${path}`;

  useEffect(() => () => clearTimeout(timer.current), []);

  function announce(message, persist = false) {
    setStatus(message);
    clearTimeout(timer.current);
    if (!persist) timer.current = setTimeout(() => setStatus(""), 3000);
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (err) {
        if (err?.name === "AbortError") return; // user closed the share sheet
        // anything else: fall through to copying
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      announce("Link copied!");
    } catch {
      announce(`Copy this link: ${url}`, true);
    }
  }

  return (
    <div className={`flex flex-col items-center gap-1 sm:items-start ${className}`}>
      <button
        type="button"
        onClick={handleShare}
        aria-label={`Share ${title}`}
        className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-brand-green-900 px-6 py-2.5 text-sm font-semibold text-brand-green-900 transition-colors hover:bg-brand-green-900 hover:text-brand-cream-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold-500 sm:w-auto"
      >
        <Share2 size={16} aria-hidden="true" />
        Share
      </button>
      <p role="status" aria-live="polite" className="min-h-[1.25rem] break-all text-xs text-brand-green-800">
        {status}
      </p>
    </div>
  );
}
