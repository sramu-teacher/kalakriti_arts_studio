import { getAccessToken } from "./googleAuth.js";

// Event pictures are uploaded from /admin straight into the owner's
// Google Drive with the signed-in owner's token (drive.file scope — this
// app can only see files it created). The Apps Script backend can't take
// the upload itself: it only accepts GET requests (see the note in
// googleSheets.js), far too small for an image. The saved event row
// stores just the Drive file ID; the site build copies the picture into
// the site (scripts/fetch-content.mjs).

const MAX_WIDTH = 1600;
const JPEG_QUALITY = 0.85;

// Shrinks a phone photo to a web-friendly JPEG (max 1600px wide), which
// also makes it a good size for WhatsApp/Facebook link previews.
export async function resizeImage(file) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_WIDTH / bitmap.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Couldn't process that image."))), "image/jpeg", JPEG_QUALITY)
  );
}

// Uploads a JPEG blob to Drive and returns its file ID.
export async function uploadEventImage(blob, eventName) {
  const metadata = {
    name: `Kalakriti event — ${eventName || "untitled"}.jpg`,
    mimeType: "image/jpeg",
    description: "Event picture uploaded from kalakritiartstudio.com/admin. Used on the website — don't delete.",
  };
  const form = new FormData();
  form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
  form.append("file", blob);

  const res = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id", {
    method: "POST",
    headers: { Authorization: `Bearer ${getAccessToken()}` },
    body: form,
  });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({}));
    const reason = detail?.error?.message || `status ${res.status}`;
    throw new Error(`Couldn't upload the picture to Google Drive (${reason}). You can save the event without one and add it later.`);
  }
  const { id } = await res.json();
  return id;
}
