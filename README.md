# Kalakriti Art Studio

Website for Kalakriti Art Studio, an art school in Uttarahalli, Bengaluru.
React + Vite + Tailwind CSS 4, deployed as a static site to GitHub Pages.
Registrations, contact enquiries, and announcement banners are handled by
a Google Apps Script Web App writing into a Google Sheet — there is no
application server or database.

## Local development

```
npm install
cp .env.example .env   # fill in the values below
npm run dev
```

| Variable | What it's for |
|---|---|
| `VITE_APPS_SCRIPT_URL` | The deployed Apps Script `/exec` URL — see `google-apps-script/README.md`. |
| `VITE_GOOGLE_CLIENT_ID` | OAuth Client ID for Google sign-in on `/admin` (Google Cloud Console). |
| `VITE_ADMIN_EMAIL` | The only Google account allowed to manage announcement banners. |
| `VITE_WHATSAPP_NUMBER` | WhatsApp number the floating button links to. |

Until these are set, the site runs fine except the registration form,
contact form, announcement banner, and `/admin` page, which need
`VITE_APPS_SCRIPT_URL` (and `/admin` additionally needs the Google
sign-in variables).

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the
site and deploys it to GitHub Pages. The four env vars above must be set
as repository secrets (Settings → Secrets and variables → Actions) for
the build to have them.

### Custom domain (kalakritiartstudio.com, registered on GoDaddy)

The site is served from the root of `https://kalakritiartstudio.com`.
`public/CNAME` tells GitHub Pages the domain; there is no Vite `base`
override. `public/404.html` + the inline script in `index.html` are the
standard GitHub Pages SPA-routing workaround (Pages has no fallback for
client-side routes like `/gallery` on a direct load or refresh) — keep
both, with `segmentCount = 0` in `404.html` for the root deploy.

DNS lives in GoDaddy and is a one-time manual step, not something this
repo or CI can do:

1. (Recommended) Verify the domain for the GitHub account (profile
   Settings → Pages → Add a domain) via the TXT record GitHub provides,
   so no one else can claim it on Pages.
2. Disconnect any GoDaddy Website Builder site / domain forwarding, then
   delete the existing `@` A **and AAAA** records.
3. Add, for `@`:
   - `A` → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `AAAA` → `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
4. Add `CNAME` `www` → `sramu-teacher.github.io`.
5. In the repo's Settings → Pages, set the custom domain to
   `kalakritiartstudio.com`; once the DNS check passes and the
   certificate is issued, enable **Enforce HTTPS**.
6. In Google Cloud Console → Credentials → the `/admin` OAuth client,
   add `https://kalakritiartstudio.com` and
   `https://www.kalakritiartstudio.com` to Authorized JavaScript origins.

## Content still pending from the studio owner

See the "Open Items" section of the build plan for the full list — in
short: final class catalog/pricing, final logo/brand colors, real
studio/gallery photography, the Google Sheet to write into, the owner's
Google account email, and a Google Cloud OAuth Client ID. The site runs
today with placeholders for all of these so development isn't blocked
on them.
