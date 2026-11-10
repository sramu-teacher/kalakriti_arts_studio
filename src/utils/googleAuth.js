// Minimal Google Identity Services sign-in for the /admin route only —
// identifies the signed-in owner so Admin.jsx can gate the editors, and
// provides the access token that owner-only Apps Script actions verify
// server-side (see requireOwner_ in google-apps-script/Code.gs).
// drive.file lets /admin upload event pictures straight into the owner's
// Drive (utils/driveUpload.js); it only grants access to files this app
// creates, not the rest of the owner's Drive.
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const SCOPE = "email profile https://www.googleapis.com/auth/drive.file";

let gisLoaded = null;
let tokenClient = null;
let accessToken = null;
let pendingTokenRequest = null;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve();
      } else {
        existing.addEventListener("load", () => resolve());
      }
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

function ensureConfigured() {
  if (!CLIENT_ID) {
    throw new Error(
      "Google sign-in isn't configured — set VITE_GOOGLE_CLIENT_ID in .env"
    );
  }
}

async function ensureGis() {
  if (!gisLoaded) {
    gisLoaded = loadScript("https://accounts.google.com/gsi/client");
  }
  await gisLoaded;
}

// De-dupes concurrent token requests onto one in-flight promise, so two
// callers in the same tick (e.g. a mount effect and a click handler)
// can't each independently pop an interactive consent screen.
function requestToken(promptMode) {
  if (pendingTokenRequest) return pendingTokenRequest;
  pendingTokenRequest = new Promise((resolve, reject) => {
    ensureGis()
      .then(() => {
        if (!tokenClient) {
          tokenClient = window.google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPE,
            callback: () => {},
          });
        }
        tokenClient.callback = (resp) => {
          pendingTokenRequest = null;
          if (resp.error) {
            reject(new Error(resp.error));
            return;
          }
          accessToken = resp.access_token;
          resolve(accessToken);
        };
        tokenClient.requestAccessToken({ prompt: promptMode });
      })
      .catch((err) => {
        pendingTokenRequest = null;
        reject(err);
      });
  });
  return pendingTokenRequest;
}

export function requestInteractiveSignIn() {
  ensureConfigured();
  accessToken = null;
  return requestToken("consent");
}

export function getAccessToken() {
  if (!accessToken) throw new Error("Please sign in again.");
  return accessToken;
}

export async function getUserProfile() {
  if (!accessToken) throw new Error("Not signed in");
  const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error("Couldn't fetch profile");
  return res.json();
}

export function signOut() {
  if (accessToken && window.google?.accounts?.oauth2) {
    window.google.accounts.oauth2.revoke(accessToken, () => {});
  }
  accessToken = null;
}
