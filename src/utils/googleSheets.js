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

// Every call — including writes — goes through GET with the payload
// JSON-encoded into a query param, not POST with a body. Apps Script
// Web App responses are a 302 redirect to a one-time content URL; a
// browser fetch() auto-follows that fine for GET, but for POST it
// downgrades to GET per the fetch spec (dropping the body) and the
// resulting request 404s against Apps Script's redirect target. GET
// end-to-end sidesteps the whole problem. Payloads here are small
// form submissions, well within URL length limits.
async function request(action, payload) {
  ensureConfigured();
  const url = new URL(APPS_SCRIPT_URL);
  url.searchParams.set("action", action);
  if (payload) url.searchParams.set("payload", JSON.stringify(payload));

  const res = await fetch(url.toString());
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    // Apps Script's content-delivery redirect is independently flaky —
    // it can serve an HTML error page even though the script itself
    // already ran to completion (confirmed via the Executions log:
    // every invocation completes in ~1s regardless of whether the
    // client ever sees a response). Signal this distinctly so the
    // retry wrapper below knows it's safe to retry (every write
    // payload carries a requestId the server dedups on).
    throw new UnconfirmedError();
  }
  if (!res.ok || data.error) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

class UnconfirmedError extends Error {
  constructor() {
    super("unconfirmed");
    this.name = "UnconfirmedError";
  }
}

// Retries only on UnconfirmedError (Apps Script's flaky response
// delivery), never on a real application error (e.g. missing fields) —
// retrying those wouldn't help. Safe to retry writes here because every
// write payload includes a requestId that Code.gs dedups on, so a
// request that actually succeeded on a "failed" attempt won't be
// double-applied when retried.
async function requestWithRetry(action, payload, attempts = 3, delayMs = 600) {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await request(action, payload);
    } catch (err) {
      if (!(err instanceof UnconfirmedError)) throw err;
      if (attempt === attempts) {
        throw new Error(
          "We couldn't confirm this went through after a few tries, though it may still have succeeded on Google's side. " +
            "Please check for a confirmation email in a minute, or reach us on WhatsApp if you don't see one."
        );
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
    }
  }
}

function newRequestId() {
  return crypto.randomUUID();
}

export function submitRegistration(payload) {
  return requestWithRetry("register", { ...payload, requestId: newRequestId() });
}

export function submitContact(payload) {
  return requestWithRetry("contact", { ...payload, requestId: newRequestId() });
}

export function submitEventInterest(payload) {
  return requestWithRetry("eventInterest", { ...payload, requestId: newRequestId() });
}

export function saveBanner(payload) {
  return requestWithRetry("saveBanner", { ...payload, requestId: newRequestId() });
}

// Safe to retry — editing the same row with the same values twice does
// no harm (see the comment on handleUpdateBanner_ in Code.gs).
export function updateBanner(payload) {
  return requestWithRetry("updateBanner", payload);
}

// Deliberately a single attempt, not requestWithRetry — deleting shifts
// every later row up by one, so retrying with the same rowNumber after
// an unconfirmed-but-actually-successful delete could remove the wrong
// banner. BannerEditor re-fetches the list after every delete attempt
// (success or failure) so displayed rowNumbers are never stale.
export function deleteBanner(payload) {
  return request("deleteBanner", payload);
}

export function getBanners() {
  return requestWithRetry("banners");
}
