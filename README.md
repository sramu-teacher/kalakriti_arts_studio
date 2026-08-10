# Kalakriti Art Studio

Website for Kalakriti Art Studio, an art school in Uttarahalli, Bengaluru.
React + Vite + Tailwind CSS 4, deployed as a static site to GitHub Pages.
Registrations, contact enquiries, and announcement banners are handled by
a Google Apps Script Web App writing into a Google Sheet — there is no
application server or database.

## ⚠️ Currently in preview mode

This repo is temporarily configured for a **design/content preview** at
`https://sramu-teacher.github.io/kalakriti_arts_studio/` rather than the
real `kalakritiartstudio.com` domain — it's meant to be shown to the
studio owner for feedback before going live. Three things reflect that
and need reverting when the real domain is ready:

1. **`vite.config.js`** has `base: "/kalakriti_arts_studio/"` set, for a
   GitHub Pages *project* page instead of a custom-domain root deploy.
   Remove it once serving from the real domain.
2. **`public/CNAME` doesn't exist** — it's sitting at `CNAME.production.txt`
   in the repo root instead. Move it back to `public/CNAME` when DNS is
   pointed at Pages (see the Custom domain section below), otherwise
   GitHub Pages will try to redirect to a domain that isn't wired up yet.
3. **`index.html`** has `<meta name="robots" content="noindex, nofollow">`
   and **`public/robots.txt`** disallows everything — both keep the
   preview out of search results. Remove the meta tag and restore the
   commented-out block in `robots.txt` for the production launch.
4. `public/404.html` and the redirect script in `index.html` implement
   the standard GitHub Pages SPA-routing workaround (a project-page
   static host has no fallback for client-side routes like `/gallery`
   on direct load/refresh). Both become unnecessary on a custom-domain
   root deploy with proper server-side SPA fallback configured (or can
   stay — they're a no-op if a request never reaches them), but
   `public/404.html`'s `segmentCount` is tied to the `/kalakriti_arts_studio/`
   path depth and needs updating if `base` changes.

Registration, contact, the announcement banner, and `/admin` all show a
graceful "not configured" state in this preview since no Apps Script or
Google OAuth Client ID is wired up yet — that's expected, not a bug.

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

### Custom domain (kalakritiartstudio.com, purchased on GoDaddy)

1. In the repo's GitHub Pages settings, add `kalakritiartstudio.com` as
   the custom domain (this repo already ships `public/CNAME` with that
   value, so it should be picked up automatically once Pages is enabled).
2. In GoDaddy's DNS panel for the domain, add:
   - Four `A` records for `@` pointing at GitHub Pages' IPs
     (`185.199.108.153`, `.109.153`, `.110.153`, `.111.153`), **or**
   - A `CNAME` record for `www` pointing at `<org>.github.io` if serving
     from the `www` subdomain instead.
3. Wait for DNS propagation, then enable "Enforce HTTPS" in the GitHub
   Pages settings once GitHub has issued a certificate.

This DNS step is a one-time action taken in the GoDaddy dashboard — it's
not something this repository or its CI can do.

## Content still pending from the studio owner

See the "Open Items" section of the build plan for the full list — in
short: final class catalog/pricing, final logo/brand colors, real
studio/gallery photography, the Google Sheet to write into, the owner's
Google account email, and a Google Cloud OAuth Client ID. The site runs
today with placeholders for all of these so development isn't blocked
on them.
