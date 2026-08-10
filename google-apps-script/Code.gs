/**
 * Kalakriti Art Studio — Apps Script Web App backend.
 *
 * This is a checked-in reference copy for version control. It is NOT
 * built or deployed by the Vite app — it must be pasted into the Apps
 * Script editor bound to the studio's Google Sheet and deployed as a
 * Web App by hand. See README.md in this folder for the exact steps.
 *
 * Actions:
 *   GET  ?action=banners             -> active + scheduled announcement banners
 *   POST {action:"register", ...}    -> append a class registration row + email owner
 *   POST {action:"contact", ...}     -> append a contact enquiry row + email owner
 *   POST {action:"saveBanner", ...}  -> append a banner row (owner-only, see below)
 */

// --- Configuration -----------------------------------------------------

// Only this address may write banners from the /admin page. Update to
// match VITE_ADMIN_EMAIL in the site's .env.
const OWNER_EMAIL = "owner@example.com";

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
];

const CONTACT_SHEET_NAME = "Contact Enquiries";
const CONTACT_HEADERS = ["Timestamp", "Name", "Email", "Phone", "Subject", "Message"];

const BANNERS_SHEET_NAME = "Banners";
const BANNER_HEADERS = ["Message", "Start Date", "End Date", "Active", "Created At"];

// --- Entry points --------------------------------------------------------

function doGet(e) {
  const action = e.parameter.action;
  if (action === "banners") return getActiveBanners_();
  return jsonResponse_({ error: "unknown action" }, 400);
}

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonResponse_({ error: "Invalid JSON body" }, 400);
  }

  switch (body.action) {
    case "register":
      return handleRegistration_(body);
    case "contact":
      return handleContact_(body);
    case "saveBanner":
      return handleSaveBanner_(body);
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
  sheet.appendRow([
    new Date(),
    body.name,
    body.email,
    body.phone || "",
    body.subject || "General Enquiry",
    body.message,
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
// registration/contact POSTs), so it cannot cryptographically verify an
// OAuth bearer token. This checks the owner's email as sent by the
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
  sheet.appendRow([body.message, body.startDate, body.endDate, !!body.active, new Date()]);

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
