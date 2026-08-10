// Whether a banner should currently be shown: active flag set, and
// today falls within [startDate, endDate] inclusive. Missing dates on
// either end mean "no bound" on that side.
export function isBannerActive(banner, today = new Date()) {
  if (!banner.active) return false;
  const day = stripTime(today);
  if (banner.startDate && day < stripTime(new Date(banner.startDate))) return false;
  if (banner.endDate && day > stripTime(new Date(banner.endDate))) return false;
  return true;
}

function stripTime(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}
