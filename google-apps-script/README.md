# Google Apps Script deployment

`Code.gs` in this folder is the backend for registrations, contact
enquiries, and announcement banners. It is **not** built or deployed by
the Vite app — it's a bound script that lives inside a Google Sheet and
must be deployed by hand, once, by whoever owns that Sheet.

## One-time setup

1. **Create the Google Sheet** (if it doesn't already exist) — any name is
   fine. This is where all registrations, contact enquiries, and
   announcement banners will live, each in their own tab. The script
   creates tabs automatically the first time they're needed; it does
   **not** create the spreadsheet itself.
2. Open the Sheet → **Extensions → Apps Script**.
3. Delete the placeholder `Code.gs` content and paste in this folder's
   `Code.gs`.
4. Edit the `OWNER_EMAIL` constant near the top to the studio owner's
   Google account email — this must exactly match `VITE_ADMIN_EMAIL` in
   the site's `.env`.
5. **Deploy → New deployment**:
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**

   (Anonymous visitors submitting the registration/contact forms is the
   whole point — this deployment setting is required, not a mistake.)
6. Copy the resulting `/exec` URL and set it as `VITE_APPS_SCRIPT_URL` in
   the site's `.env` (locally) and as a GitHub Actions secret (for
   production builds).
7. The first time a registration/contact/banner request comes in for a
   new class or tab, the script creates that tab with a bold header row
   automatically.

## Redeploying after editing `Code.gs`

If you edit the script later, use **Deploy → Manage deployments → Edit →
New version** rather than creating a brand-new deployment — this keeps
the same `/exec` URL. Creating a new deployment instead issues a new
URL, which means updating `VITE_APPS_SCRIPT_URL` everywhere it's set.

## Admin-created events (added Nov 2026)

`/admin` can create events that appear on the site's Events page, each
with its own shareable page. These need a few extra one-time settings
beyond the setup above:

1. **Google Cloud project** (the one holding the `/admin` OAuth client,
   project number `159783994565`):
   - **APIs & Services → Library → Google Drive API → Enable.** Event
     pictures are uploaded from `/admin` straight into the owner's Drive.
   - **Google Auth Platform → Data Access → Add or remove scopes**: add
     `.../auth/drive.file` ("See, edit, create, and delete only the
     specific Google Drive files you use with this app"). It's a
     non-sensitive scope, so no Google review is needed.
2. **GitHub token** so saving an event can trigger a site rebuild (which
   regenerates that event's page and link preview):
   - GitHub → Settings → Developer settings → Personal access tokens →
     **Fine-grained tokens → Generate new token**.
   - Repository access: **Only select repositories** →
     `kalakriti_arts_studio`.
   - Permissions → Repository permissions → **Contents: Read and write**
     (required for the "repository dispatch" event). Nothing else.
   - Pick an expiry (e.g. 1 year) and note it — when it expires, saves
     still work but rebuilds fall back to the daily schedule.
3. **Apps Script editor → Project Settings (gear) → Script Properties →
   Add script property**: name `GITHUB_TOKEN`, value = the token. It's
   stored with the script, not in the code.
4. Paste the updated `Code.gs` and redeploy as a **new version** (see
   above). Google will ask to re-authorize: the script now also needs
   "Connect to an external service" (to verify sign-ins with Google and
   to call GitHub) and Google Drive (to serve event pictures).

Events live in an **Event Listings** tab (created automatically). The
existing **Events** tab is unrelated: it holds "I'm Interested" form
submissions.

## Admin authorization

The Web App is deployed "Anyone can execute" (anonymous form submissions
need that), so Apps Script's own sign-in can't protect owner-only
actions. Instead `/admin` sends the Google access token it received at
sign-in, and `requireOwner_` in `Code.gs` asks Google's tokeninfo
endpoint who it belongs to: it must be unexpired, issued to this site's
OAuth client (`CLIENT_ID`), and belong to `OWNER_EMAIL`. Every banner and
event write goes through this check.

(Before Nov 2026 the script only compared an email address sent by the
browser, which anyone could fake. The site still sends that email
alongside the token so it keeps working against an older deployed copy
of the script, but the current script ignores it.)
