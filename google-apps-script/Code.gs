/**
 * Kalakriti Art Studio — Apps Script Web App backend.
 *
 * This is a checked-in reference copy for version control. It is NOT
 * built or deployed by the Vite app — it must be pasted into the Apps
 * Script editor bound to the studio's Google Sheet and deployed as a
 * Web App by hand. See README.md in this folder for the exact steps.
 *
 * Actions — all via GET, not POST:
 *   ?action=banners                              -> active + scheduled announcement banners
 *   ?action=register&payload=<json>               -> append a class registration row + email owner
 *   ?action=contact&payload=<json>                -> append a contact enquiry row + email owner
 *   ?action=saveBanner&payload=<json>              -> append a banner row (owner-only, see below)
 *   ?action=updateBanner&payload=<json>            -> edit an existing banner row by rowNumber (owner-only)
 *   ?action=deleteBanner&payload=<json>            -> delete a banner row by rowNumber (owner-only)
 *   ?action=events                                 -> admin-created events that have started (public)
 *   ?action=eventImage&payload={"slug"}            -> an event's picture as base64 (public)
 *   ?action=adminEvents&payload=<json>             -> every event incl. hidden/scheduled (owner-only)
 *   ?action=saveEvent&payload=<json>               -> create an event (owner-only)
 *   ?action=updateEvent&payload=<json>             -> edit an event by slug (owner-only)
 *   ?action=deleteEvent&payload=<json>             -> delete an event by slug (owner-only)
 *   ?action=eventInterest&payload=<json>           -> append an Events row + email owner
 *
 * Why GET for writes too: a Web App response is a 302 redirect to a
 * one-time content URL. Browsers auto-follow that fine for GET, but for
 * POST the fetch spec downgrades the redirect to GET and drops the
 * body — the resulting request 404s against Apps Script's redirect
 * target. GET end-to-end (payload JSON-encoded into a query param)
 * sidesteps this entirely. See the client in src/utils/googleSheets.js.
 *
 * Why every write payload carries a requestId: that same redirect
 * delivery mechanism is independently flaky — it can fail to deliver
 * the response to the client even though the script itself already
 * ran to completion (confirmed via the Executions log: every
 * invocation completes in ~1s regardless of whether the client ever
 * sees a response). That makes it unsafe for the client to blindly
 * retry a write on an unconfirmed response — a "failed" registration
 * might have actually gone through, and retrying would double-write
 * it. Each write payload includes a client-generated requestId; before
 * appending a row, the corresponding handler checks whether that ID is
 * already present in the sheet and short-circuits to a no-op success
 * if so. That makes retries safe, so the client can retry aggressively
 * without risking duplicate rows or duplicate notification emails.
 */

// --- Configuration -----------------------------------------------------

// Only this address may write banners from the /admin page. Update to
// match VITE_ADMIN_EMAIL in the site's .env.
const OWNER_EMAIL = "kalakritiarts.studio@gmail.com";

// The OAuth client the /admin page signs in with (VITE_GOOGLE_CLIENT_ID).
// Owner-only actions verify the caller's Google access token was issued
// to this client for OWNER_EMAIL — see requireOwner_.
const CLIENT_ID = "159783994565-hfanjr441elqt8u1l9580bu9nepsusj4.apps.googleusercontent.com";

// After an event is created/edited/deleted the script asks GitHub to
// rebuild the site, so each event's page and link preview are
// regenerated within a couple of minutes. Needs a GitHub token saved as
// the Script Property GITHUB_TOKEN (see README.md); without one, events
// still show on the site immediately and the daily rebuild catches up.
const GITHUB_REPO = "sramu-teacher/kalakriti_arts_studio";

const REGISTRATION_HEADERS = [
  "Timestamp",
  "Student Name",
  "Age",
  "Parent / Contact Name",
  "Phone",
  "Email",
  "Class",
  "Preferred Schedule",
  "Message",
  "Request ID",
];

const CONTACT_SHEET_NAME = "Contact Enquiries";
const CONTACT_HEADERS = ["Timestamp", "Name", "Email", "Phone", "Subject", "Message", "Request ID"];

const EVENTS_SHEET_NAME = "Events";
const EVENT_HEADERS = [
  "Timestamp",
  "Event",
  "Name",
  "Phone",
  "Email",
  "Preferred Date",
  "Group Size",
  "Message",
  "Request ID",
];

const BANNERS_SHEET_NAME = "Banners";
// Action Label/Action URL were added after Request ID (rather than
// before it) so the one banner row created before this feature existed
// doesn't need to be manually migrated — old rows just read back with
// no action link, which is correct. isDuplicateRequest_ below looks up
// "Request ID" by header name rather than assuming it's the last
// column, so this ordering doesn't break dedup.
const BANNER_HEADERS = [
  "Message",
  "Start Date",
  "End Date",
  "Active",
  "Created At",
  "Request ID",
  "Action Label",
  "Action URL",
];

// Admin-created events. Deliberately NOT the "Events" tab — that one
// already holds "I'm Interested" submissions (EVENTS_SHEET_NAME above).
// Slug is the event's permanent URL (/events/<slug>) and the key for
// edits/deletes; it never changes after creation, so links in ads keep
// working when an event is renamed. Description paragraphs are separated
// by blank lines and Highlights by newlines.
const LISTINGS_SHEET_NAME = "Event Listings";
const LISTING_HEADERS = [
  "Slug",
  "Name",
  "Tagline",
  "Intro",
  "Description",
  "Highlights",
  "Closing",
  "Event Dates",
  "Show From",
  "Show Until",
  "Active",
  "Image File ID",
  "Created At",
  "Updated At",
  "Request ID",
];

// Slugs used by the two events defined in the site's code
// (src/data/events.js) — new events can't take these URLs.
const RESERVED_EVENT_SLUGS = ["special-event-celebrations", "seasonal-holiday-camp"];

// --- Entry points --------------------------------------------------------

function doGet(e) {
  const action = e.parameter.action;
  let payload = {};
  if (e.parameter.payload) {
    try {
      payload = JSON.parse(e.parameter.payload);
    } catch (err) {
      return jsonResponse_({ error: "Invalid JSON payload" }, 400);
    }
  }

  switch (action) {
    case "banners":
      return getActiveBanners_();
    case "register":
      return handleRegistration_(payload);
    case "contact":
      return handleContact_(payload);
    case "eventInterest":
      return handleEventInterest_(payload);
    case "saveBanner":
      return handleSaveBanner_(payload);
    case "updateBanner":
      return handleUpdateBanner_(payload);
    case "deleteBanner":
      return handleDeleteBanner_(payload);
    case "events":
      return getPublicEvents_();
    case "eventImage":
      return getEventImage_(payload);
    case "adminEvents":
      return getAdminEvents_(payload);
    case "saveEvent":
      return handleSaveEvent_(payload);
    case "updateEvent":
      return handleUpdateEvent_(payload);
    case "deleteEvent":
      return handleDeleteEvent_(payload);
    default:
      return jsonResponse_({ error: "unknown action" }, 400);
  }
}

// --- Registration --------------------------------------------------------

function handleRegistration_(body) {
  const required = ["studentName", "phone", "email", "classType"];
  const missing = required.filter((field) => !body[field]);
  if (missing.length > 0) {
    return jsonResponse_({ error: "Missing required fields: " + missing.join(", ") }, 400);
  }

  const sheet = getOrCreateSheet_(body.classType, REGISTRATION_HEADERS);
  if (isDuplicateRequest_(sheet, body.requestId)) {
    return jsonResponse_({ success: true });
  }

  sheet.appendRow([
    new Date(),
    body.studentName,
    body.age || "",
    body.contactName || "",
    body.phone,
    body.email,
    body.classType,
    body.schedule || "",
    body.message || "",
    body.requestId || "",
  ]);

  notifyOwner_(
    "New class registration: " + body.classType,
    "Student: " + body.studentName + "\n" +
      "Age: " + (body.age || "-") + "\n" +
      "Parent/Contact: " + (body.contactName || "-") + "\n" +
      "Phone: " + body.phone + "\n" +
      "Email: " + body.email + "\n" +
      "Class: " + body.classType + "\n" +
      "Preferred schedule: " + (body.schedule || "-") + "\n" +
      "Message: " + (body.message || "-")
  );

  return jsonResponse_({ success: true });
}

// --- Contact enquiries -----------------------------------------------------

function handleContact_(body) {
  const required = ["name", "email", "message"];
  const missing = required.filter((field) => !body[field]);
  if (missing.length > 0) {
    return jsonResponse_({ error: "Missing required fields: " + missing.join(", ") }, 400);
  }

  const sheet = getOrCreateSheet_(CONTACT_SHEET_NAME, CONTACT_HEADERS);
  if (isDuplicateRequest_(sheet, body.requestId)) {
    return jsonResponse_({ success: true });
  }

  sheet.appendRow([
    new Date(),
    body.name,
    body.email,
    body.phone || "",
    body.subject || "General Enquiry",
    body.message,
    body.requestId || "",
  ]);

  notifyOwner_(
    "New contact message: " + (body.subject || "General Enquiry"),
    "From: " + body.name + " <" + body.email + ">\n" +
      "Phone: " + (body.phone || "-") + "\n\n" +
      body.message
  );

  return jsonResponse_({ success: true });
}

// --- Event interest -----------------------------------------------------

function handleEventInterest_(body) {
  const required = ["event", "name", "phone", "email"];
  const missing = required.filter((field) => !body[field]);
  if (missing.length > 0) {
    return jsonResponse_({ error: "Missing required fields: " + missing.join(", ") }, 400);
  }

  const sheet = getOrCreateSheet_(EVENTS_SHEET_NAME, EVENT_HEADERS);
  if (isDuplicateRequest_(sheet, body.requestId)) {
    return jsonResponse_({ success: true });
  }

  sheet.appendRow([
    new Date(),
    body.event,
    body.name,
    body.phone,
    body.email,
    body.preferredDate || "",
    body.groupSize || "",
    body.message || "",
    body.requestId || "",
  ]);

  notifyOwner_(
    "New event interest: " + body.event,
    "Event: " + body.event + "\n" +
      "Name: " + body.name + "\n" +
      "Phone: " + body.phone + "\n" +
      "Email: " + body.email + "\n" +
      "Preferred date: " + (body.preferredDate || "-") + "\n" +
      "Group size: " + (body.groupSize || "-") + "\n" +
      "Message: " + (body.message || "-")
  );

  return jsonResponse_({ success: true });
}

// --- Announcement banners ---------------------------------------------------

function getActiveBanners_() {
  const sheet = getOrCreateSheet_(BANNERS_SHEET_NAME, BANNER_HEADERS);
  const allRows = sheet.getDataRange().getValues();
  const banners = [];
  // Start at 1 to skip the header row (index 0). rowNumber is the
  // actual 1-based sheet row (i + 1) — the admin UI uses this to target
  // a specific row for edit/delete, so it must reflect real sheet
  // position, not just the position within this filtered result.
  for (let i = 1; i < allRows.length; i++) {
    const row = allRows[i];
    if (!row[0]) continue; // skip blank rows
    banners.push({
      rowNumber: i + 1,
      message: row[0],
      startDate: formatDate_(row[1]),
      endDate: formatDate_(row[2]),
      active: row[3] === true || row[3] === "TRUE",
      // row[6]/row[7] are undefined for banners created before the
      // Action Label/Action URL columns existed — "" is correct there
      // (no action link), not a bug.
      actionLabel: row[6] || "",
      actionUrl: row[7] || "",
    });
  }
  return jsonResponse_({ banners: banners });
}

function handleSaveBanner_(body) {
  const denied = requireOwner_(body);
  if (denied) return denied;
  if (!body.message || !body.startDate || !body.endDate) {
    return jsonResponse_({ error: "Missing required fields" }, 400);
  }

  const sheet = getOrCreateSheet_(BANNERS_SHEET_NAME, BANNER_HEADERS);
  if (isDuplicateRequest_(sheet, body.requestId)) {
    return jsonResponse_({ success: true });
  }

  sheet.appendRow([
    body.message,
    body.startDate,
    body.endDate,
    !!body.active,
    new Date(),
    body.requestId || "",
    body.actionLabel || "",
    body.actionUrl || "",
  ]);

  return jsonResponse_({ success: true });
}

// Edits are naturally idempotent — re-applying the same values to the
// same row is harmless no matter how many times it happens — so unlike
// creates/deletes this doesn't need requestId dedup, and the client is
// free to retry it safely on an unconfirmed response.
function handleUpdateBanner_(body) {
  const denied = requireOwner_(body);
  if (denied) return denied;
  const row = Number(body.rowNumber);
  if (!row || !body.message || !body.startDate || !body.endDate) {
    return jsonResponse_({ error: "Missing required fields" }, 400);
  }

  const sheet = getOrCreateSheet_(BANNERS_SHEET_NAME, BANNER_HEADERS);
  if (row < 2 || row > sheet.getLastRow()) {
    return jsonResponse_({ error: "Banner not found — the list may be out of date, refresh and try again" }, 404);
  }

  // Targeted per-column writes (by header name, not a full-row
  // overwrite) so Created At / Request ID are left untouched — an edit
  // doesn't change when or how the banner was originally created.
  setCell_(sheet, row, "Message", body.message);
  setCell_(sheet, row, "Start Date", body.startDate);
  setCell_(sheet, row, "End Date", body.endDate);
  setCell_(sheet, row, "Active", !!body.active);
  setCell_(sheet, row, "Action Label", body.actionLabel || "");
  setCell_(sheet, row, "Action URL", body.actionUrl || "");

  return jsonResponse_({ success: true });
}

// Deliberately NOT retried client-side, unlike every other write here.
// Deleting shifts every row below it up by one, so a stale rowNumber
// from a retried/duplicate delete attempt could remove the wrong
// banner entirely. The client does a single attempt and always
// re-fetches the list afterward (success or failure) so rowNumbers
// shown in the admin UI are never stale for the next action.
function handleDeleteBanner_(body) {
  const denied = requireOwner_(body);
  if (denied) return denied;
  const row = Number(body.rowNumber);
  if (!row) {
    return jsonResponse_({ error: "Missing rowNumber" }, 400);
  }

  const sheet = getOrCreateSheet_(BANNERS_SHEET_NAME, BANNER_HEADERS);
  if (row < 2 || row > sheet.getLastRow()) {
    return jsonResponse_({ error: "Banner not found — the list may be out of date, refresh and try again" }, 404);
  }

  sheet.deleteRow(row);
  return jsonResponse_({ success: true });
}

// --- Owner authorization -------------------------------------------------

// The Web App has to be deployed "Anyone can execute" so visitors can
// submit forms anonymously, so owner-only actions can't rely on Apps
// Script's own sign-in. Instead the /admin page sends the Google access
// token it got at sign-in, and this asks Google who it belongs to: it
// must be unexpired, issued to this site's OAuth client (so a token from
// some other app can't be replayed here), and belong to OWNER_EMAIL.
// Verified tokens are cached briefly so a burst of admin actions doesn't
// re-check every time. Returns null when allowed, else an error response.
function requireOwner_(body) {
  const token = body && body.accessToken;
  if (!token) {
    return jsonResponse_({ error: "Please sign in again — your session is missing." }, 401);
  }
  const cache = CacheService.getScriptCache();
  const cacheKey = "owner:" + Utilities.base64EncodeWebSafe(
    Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, token)
  );
  if (cache.get(cacheKey)) return null;

  const res = UrlFetchApp.fetch(
    "https://oauth2.googleapis.com/tokeninfo?access_token=" + encodeURIComponent(token),
    { muteHttpExceptions: true }
  );
  if (res.getResponseCode() !== 200) {
    return jsonResponse_({ error: "Your sign-in has expired — please sign out and sign in again." }, 401);
  }
  const info = JSON.parse(res.getContentText());
  const issuedToThisSite = info.aud === CLIENT_ID || info.azp === CLIENT_ID;
  const isOwner = info.email === OWNER_EMAIL && String(info.email_verified) === "true";
  if (!issuedToThisSite || !isOwner) {
    return jsonResponse_({ error: "Not authorized" }, 403);
  }
  const ttl = Math.min(Number(info.expires_in) || 0, 300);
  if (ttl > 0) cache.put(cacheKey, "1", ttl);
  return null;
}

// --- Event listings ----------------------------------------------------

function readListings_() {
  const sheet = getOrCreateSheet_(LISTINGS_SHEET_NAME, LISTING_HEADERS);
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const col = (name) => headers.indexOf(name);
  const events = [];
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const slug = row[col("Slug")];
    if (!slug) continue;
    events.push({
      rowNumber: i + 1,
      slug: String(slug),
      name: String(row[col("Name")] || ""),
      tagline: String(row[col("Tagline")] || ""),
      intro: String(row[col("Intro")] || ""),
      description: String(row[col("Description")] || ""),
      highlights: String(row[col("Highlights")] || ""),
      closing: String(row[col("Closing")] || ""),
      eventDates: String(row[col("Event Dates")] || ""),
      showFrom: formatDate_(row[col("Show From")]),
      showUntil: formatDate_(row[col("Show Until")]),
      active: row[col("Active")] === true || row[col("Active")] === "TRUE",
      imageFileId: String(row[col("Image File ID")] || ""),
    });
  }
  return { sheet: sheet, events: events };
}

function todayString_() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd");
}

function toPublicEvent_(event) {
  return {
    slug: event.slug,
    name: event.name,
    tagline: event.tagline,
    intro: event.intro,
    description: event.description,
    highlights: event.highlights,
    closing: event.closing,
    eventDates: event.eventDates,
    showFrom: event.showFrom,
    showUntil: event.showUntil,
    hasImage: !!event.imageFileId,
  };
}

// Public: active events whose "show from" date has arrived — including
// ones whose "show until" has passed, so their links can show a "This
// event has ended" page instead of a 404. Events scheduled for the
// future stay private until their start date.
function getPublicEvents_() {
  const today = todayString_();
  const events = readListings_().events
    .filter((e) => e.active && e.showFrom && e.showFrom <= today)
    .map(toPublicEvent_);
  return jsonResponse_({ events: events, today: today });
}

function getAdminEvents_(body) {
  const denied = requireOwner_(body);
  if (denied) return denied;
  const events = readListings_().events.map((e) => {
    const out = toPublicEvent_(e);
    out.active = e.active;
    return out;
  });
  return jsonResponse_({ events: events, today: todayString_() });
}

// Serves an event's picture (stored in the owner's Drive) as base64 so
// the site build can copy it into the site, and /admin can preview it.
// Looked up by event slug — never by raw file ID — so this can't be used
// to read arbitrary files from the owner's Drive. Future-scheduled
// events' pictures are served too: they're only reachable by guessing a
// slug, and the admin preview needs them.
function getEventImage_(body) {
  const slug = body && body.slug;
  const event = readListings_().events.filter((e) => e.slug === slug)[0];
  if (!event || !event.imageFileId) {
    return jsonResponse_({ error: "No image for this event" }, 404);
  }
  const blob = DriveApp.getFileById(event.imageFileId).getBlob();
  return jsonResponse_({
    contentType: blob.getContentType(),
    data: Utilities.base64Encode(blob.getBytes()),
  });
}

function slugify_(text) {
  return String(text)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/g, "") || "event";
}

function uniqueSlug_(base, existing) {
  const taken = existing.map((e) => e.slug).concat(RESERVED_EVENT_SLUGS);
  let slug = base;
  for (let n = 2; taken.indexOf(slug) !== -1; n++) slug = base + "-" + n;
  return slug;
}

function validateEvent_(body) {
  const required = ["name", "intro", "eventDates", "showFrom", "showUntil"];
  const missing = required.filter((field) => !body[field]);
  if (missing.length > 0) return "Missing required fields: " + missing.join(", ");
  if (body.showUntil < body.showFrom) return "\"Show until\" must be on or after \"Show from\".";
  return null;
}

function handleSaveEvent_(body) {
  const denied = requireOwner_(body);
  if (denied) return denied;
  const invalid = validateEvent_(body);
  if (invalid) return jsonResponse_({ error: invalid }, 400);

  const listings = readListings_();
  if (isDuplicateRequest_(listings.sheet, body.requestId)) {
    const existing = listings.events.filter((e) => e.name === body.name).pop();
    return jsonResponse_({ success: true, slug: existing ? existing.slug : "" });
  }

  const slug = uniqueSlug_(slugify_(body.name), listings.events);
  const now = new Date();
  const values = {
    "Slug": slug,
    "Name": body.name,
    "Tagline": body.tagline || "",
    "Intro": body.intro,
    "Description": body.description || "",
    "Highlights": body.highlights || "",
    "Closing": body.closing || "",
    "Event Dates": body.eventDates,
    "Show From": body.showFrom,
    "Show Until": body.showUntil,
    "Active": body.active !== false,
    "Image File ID": body.imageFileId || "",
    "Created At": now,
    "Updated At": now,
    "Request ID": body.requestId || "",
  };
  appendByHeader_(listings.sheet, values);

  triggerSiteRebuild_();
  return jsonResponse_({ success: true, slug: slug });
}

// Edits target the row by slug (not row number), so they're idempotent
// and safe to retry, and can't hit the wrong row if rows have shifted.
function handleUpdateEvent_(body) {
  const denied = requireOwner_(body);
  if (denied) return denied;
  const invalid = validateEvent_(body);
  if (invalid) return jsonResponse_({ error: invalid }, 400);

  const listings = readListings_();
  const event = listings.events.filter((e) => e.slug === body.slug)[0];
  if (!event) return jsonResponse_({ error: "Event not found — refresh and try again" }, 404);

  const sheet = listings.sheet;
  const row = event.rowNumber;
  setCell_(sheet, row, "Name", body.name);
  setCell_(sheet, row, "Tagline", body.tagline || "");
  setCell_(sheet, row, "Intro", body.intro);
  setCell_(sheet, row, "Description", body.description || "");
  setCell_(sheet, row, "Highlights", body.highlights || "");
  setCell_(sheet, row, "Closing", body.closing || "");
  setCell_(sheet, row, "Event Dates", body.eventDates);
  setCell_(sheet, row, "Show From", body.showFrom);
  setCell_(sheet, row, "Show Until", body.showUntil);
  setCell_(sheet, row, "Active", body.active !== false);
  // imageFileId: undefined = keep the current picture, "" = remove it.
  if (body.imageFileId !== undefined && body.imageFileId !== event.imageFileId) {
    setCell_(sheet, row, "Image File ID", body.imageFileId);
    trashDriveFile_(event.imageFileId);
  }
  setCell_(sheet, row, "Updated At", new Date());

  triggerSiteRebuild_();
  return jsonResponse_({ success: true, slug: event.slug });
}

// By slug, so a retried delete is a harmless no-op rather than removing
// whichever row moved into the old position.
function handleDeleteEvent_(body) {
  const denied = requireOwner_(body);
  if (denied) return denied;
  const listings = readListings_();
  const event = listings.events.filter((e) => e.slug === body.slug)[0];
  if (!event) return jsonResponse_({ success: true });
  listings.sheet.deleteRow(event.rowNumber);
  trashDriveFile_(event.imageFileId);
  triggerSiteRebuild_();
  return jsonResponse_({ success: true });
}

function trashDriveFile_(fileId) {
  if (!fileId) return;
  try {
    DriveApp.getFileById(fileId).setTrashed(true);
  } catch (err) {
    // Already gone or not accessible — nothing to clean up.
  }
}

function appendByHeader_(sheet, valuesByHeader) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  sheet.appendRow(headers.map((h) => (h in valuesByHeader ? valuesByHeader[h] : "")));
}

// Asks GitHub Actions to rebuild and redeploy the site (the deploy
// workflow listens for this "content-updated" event). Failures are
// logged, never surfaced: the event is already saved and visible, and
// the daily scheduled rebuild will pick it up regardless.
function triggerSiteRebuild_() {
  const token = PropertiesService.getScriptProperties().getProperty("GITHUB_TOKEN");
  if (!token) return;
  try {
    const res = UrlFetchApp.fetch("https://api.github.com/repos/" + GITHUB_REPO + "/dispatches", {
      method: "post",
      contentType: "application/json",
      headers: { Authorization: "Bearer " + token, Accept: "application/vnd.github+json" },
      payload: JSON.stringify({ event_type: "content-updated" }),
      muteHttpExceptions: true,
    });
    if (res.getResponseCode() >= 300) {
      console.warn("Site rebuild request failed: " + res.getResponseCode() + " " + res.getContentText());
    }
  } catch (err) {
    console.warn("Site rebuild request failed: " + err);
  }
}

// --- Helpers ---------------------------------------------------------------

function getOrCreateSheet_(name, headers) {
  const spreadsheet = SpreadsheetApp.getActive();
  let sheet = spreadsheet.getSheetByName(name);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(name);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
  } else {
    ensureHeaders_(sheet, headers);
  }
  ensureWrap_(sheet, headers.length);
  return sheet;
}

// Applies default word-wrap across the whole sheet (not just currently
// filled rows) so it stays wrapped as new rows get appended later —
// runs on every access, but setWrap is cheap and idempotent.
function ensureWrap_(sheet, columnCount) {
  sheet.getRange(1, 1, sheet.getMaxRows(), columnCount).setWrap(true);
}

// Backfills any header text missing from an already-existing sheet
// (e.g. Action Label/Action URL were added to BANNER_HEADERS after the
// Banners tab already existed — appendRow-based writes were already
// landing data in those trailing columns positionally, but the header
// row itself never got the label text, so findColumn_-based lookups
// like updateBanner's found nothing there). Runs on every access so
// future schema additions self-heal without a manual sheet edit.
function ensureHeaders_(sheet, headers) {
  const lastCol = sheet.getLastColumn();
  const existing = lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];
  const missing = headers.filter((h) => existing.indexOf(h) === -1);
  if (missing.length === 0) return;
  const startCol = lastCol + 1;
  const range = sheet.getRange(1, startCol, 1, missing.length);
  range.setValues([missing]);
  range.setFontWeight("bold");
}

// No requestId on the payload (an older client, or a call that
// genuinely doesn't need dedup) just means dedup is skipped — never
// treated as a false match.
function isDuplicateRequest_(sheet, requestId) {
  if (!requestId) return false;
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return false; // header row only, nothing to compare
  const idColumn = findColumn_(sheet, "Request ID");
  if (!idColumn) return false;
  const ids = sheet.getRange(2, idColumn, lastRow - 1, 1).getValues();
  return ids.some((row) => row[0] === requestId);
}

// 1-based column index for a header, or null if not found — looked up
// by name rather than assumed position, since Banners has columns
// (Action Label/URL) added after Request ID for backward compatibility
// with the row created before that feature existed.
function findColumn_(sheet, headerName) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const index = headers.indexOf(headerName);
  return index === -1 ? null : index + 1;
}

// No-op if the header doesn't exist on this sheet (shouldn't happen
// given getOrCreateSheet_ always writes the full header set, but keeps
// this safe rather than throwing on an unexpected sheet shape).
function setCell_(sheet, row, headerName, value) {
  const col = findColumn_(sheet, headerName);
  if (col) sheet.getRange(row, col).setValue(value);
}

function notifyOwner_(subject, body) {
  MailApp.sendEmail(OWNER_EMAIL, "Kalakriti Art Studio — " + subject, body);
}

function formatDate_(value) {
  if (!value) return "";
  if (Object.prototype.toString.call(value) === "[object Date]") {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), "yyyy-MM-dd");
  }
  return String(value);
}

function jsonResponse_(data, status) {
  // Apps Script's ContentService doesn't let you set a custom HTTP
  // status code on the response — status is informational here and
  // primarily conveyed to the client via the presence of `error`.
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
}
