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

## Known limitation: banner-write authorization

The Web App is deployed "Anyone can execute," so it cannot
cryptographically verify who's calling it — there's no way for a public
Apps Script endpoint to validate an OAuth bearer token from the browser.
The `/admin` page's `saveBanner` request instead sends the signed-in
owner's Google account email in the request body, and the script checks
it against `OWNER_EMAIL` before writing. This is "trust the client, but
require the right shared knowledge," not real server-side auth. That's
an intentional, reviewed trade-off for v1: the worst case if someone
crafted a request around it is a bogus banner row, not a data or privacy
leak — not worth the complexity of a token-verification flow for a
single-admin CMS.
