// Whether a banner should currently be shown: active flag set, and
// today falls within [startDate, endDate] inclusive. Missing dates on
// either end mean "no bound" on that side.
export function isBannerActive(banner, today = new Date()) {
  if (!banner.active) return false;
  const day = stripTime(today);
  if (banner.startDate && day < parseDateOnly(banner.startDate)) return false;
  if (banner.endDate && day > parseDateOnly(banner.endDate)) return false;
  return true;
}

function stripTime(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

// Parses a "YYYY-MM-DD" string as a local calendar date. The native
// `new Date("YYYY-MM-DD")` parses it as UTC midnight, which shifts the
// effective day backward by one once compared against a local-midnight
// "today" in any negative-UTC-offset timezone (e.g. a start date of
// Aug 13 would read as still-Aug-12 for a US-based visitor). The
// start/end dates an owner picks mean "this calendar date," not a
// specific UTC instant, so parse them as local components directly.
function parseDateOnly(dateStr) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).getTime();
}
