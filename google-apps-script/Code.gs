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

// Request ID is always the last column — isDuplicateRequest_ relies on that.
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

const BANNERS_SHEET_NAME = "Banners";
const BANNER_HEADERS = ["Message", "Start Date", "End Date", "Active", "Created At", "Request ID"];

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
    case "saveBanner":
      return handleSaveBanner_(payload);
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

// --- Announcement banners ---------------------------------------------------

function getActiveBanners_() {
  const sheet = getOrCreateSheet_(BANNERS_SHEET_NAME, BANNER_HEADERS);
  const rows = sheet.getDataRange().getValues().slice(1); // drop header row
  const banners = rows
    .filter((row) => row[0]) // skip blank rows
    .map((row) => ({
      message: row[0],
      startDate: formatDate_(row[1]),
      endDate: formatDate_(row[2]),
      active: row[3] === true || row[3] === "TRUE",
    }));
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

  sheet.appendRow([body.message, body.startDate, body.endDate, !!body.active, new Date(), body.requestId || ""]);

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
  }
  return sheet;
}

// Request ID is always the last column (see the *_HEADERS arrays above).
// No requestId on the payload (an older client, or a call that
// genuinely doesn't need dedup) just means dedup is skipped — never
// treated as a false match.
function isDuplicateRequest_(sheet, requestId) {
  if (!requestId) return false;
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return false; // header row only, nothing to compare
  const idColumn = sheet.getLastColumn();
  const ids = sheet.getRange(2, idColumn, lastRow - 1, 1).getValues();
  return ids.some((row) => row[0] === requestId);
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
