// Thin client for the Google Apps Script Web App that backs
// registrations, contact enquiries, and announcement banners — see
// google-apps-script/Code.gs for the server-side contract.
const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

function ensureConfigured() {
  if (!APPS_SCRIPT_URL) {
    throw new Error(
      "Google Apps Script isn't configured — set VITE_APPS_SCRIPT_URL in .env"
    );
  }
}

// Apps Script Web Apps don't handle a CORS preflight (OPTIONS) request,
// so the POST body must use a "simple request" content type
// (text/plain) to avoid the browser sending one. The script parses
// e.postData.contents as JSON server-side regardless of this header.
async function postAction(action, payload) {
  ensureConfigured();
  const res = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action, ...payload }),
  });
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

async function getAction(action, params = {}) {
  ensureConfigured();
  const url = new URL(APPS_SCRIPT_URL);
  url.searchParams.set("action", action);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  const res = await fetch(url.toString());
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export function submitRegistration(payload) {
  return postAction("register", payload);
}

export function submitContact(payload) {
  return postAction("contact", payload);
}

export function getBanners() {
  return getAction("banners");
}

export function saveBanner(payload) {
  return postAction("saveBanner", payload);
}
