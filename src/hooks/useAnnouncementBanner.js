import { useEffect, useState } from "react";
import { getBanners } from "../utils/googleSheets.js";
import { isBannerActive } from "../utils/dateRange.js";

// Fetches the Banners tab once per page load and returns the first
// active banner, if any. Silently returns null on any failure (missing
// config, network error) so a banner outage never breaks the site.
export function useAnnouncementBanner() {
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getBanners()
      .then((data) => {
        if (cancelled) return;
        const banners = Array.isArray(data.banners) ? data.banners : [];
        const active = banners.find((b) => isBannerActive(b));
        setBanner(active || null);
      })
      .catch(() => {
        if (!cancelled) setBanner(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return banner;
}
