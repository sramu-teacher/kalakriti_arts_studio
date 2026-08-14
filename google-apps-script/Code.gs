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

// The Web App is deployed "Anyone can execute" (required for anonymous
// registration/contact requests), so it cannot cryptographically verify
// an OAuth bearer token. This checks the owner's email as sent by the
// client after Google sign-in on /admin — a "trust the client + shared
// knowledge" model, not real server-side auth. Acceptable for a single-
// admin CMS where the worst case is a bogus banner row, not a data or
// privacy issue. See plan Section 3 for the full rationale.
function handleSaveBanner_(body) {
  if (body.ownerEmail !== OWNER_EMAIL) {
    return jsonResponse_({ error: "Not authorized" }, 403);
  }
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
  if (body.ownerEmail !== OWNER_EMAIL) {
    return jsonResponse_({ error: "Not authorized" }, 403);
  }
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
  if (body.ownerEmail !== OWNER_EMAIL) {
    return jsonResponse_({ error: "Not authorized" }, 403);
  }
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
