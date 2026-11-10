import { useRef, useState } from "react";
import SEO from "../components/shared/SEO.jsx";
import { PAGE_META } from "../data/pageMeta.js";
import AdminLogin from "../components/admin/AdminLogin.jsx";
import BannerEditor from "../components/admin/BannerEditor.jsx";
import EventEditor from "../components/admin/EventEditor.jsx";
import { useGoogleAuth } from "../hooks/useGoogleAuth.js";

const OWNER_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
const TABS = [
  { id: "events", label: "Events" },
  { id: "banners", label: "Banners" },
];

// Unlike the rest of the site, this route is gated — but only this one
// route. The router still renders it for anyone; the gating happens here
// (and every write is re-checked server-side, see requireOwner_ in Code.gs).
export default function Admin() {
  const { profile, error, signingIn, signIn, signOut } = useGoogleAuth();
  const [tab, setTab] = useState("events");
  const [bannerPrefill, setBannerPrefill] = useState(null);
  const tabRefs = useRef({});

  function selectTab(id) {
    setTab(id);
    tabRefs.current[id]?.focus();
  }

  // Arrow keys move between tabs (WAI-ARIA tabs pattern).
  function handleTabKey(e) {
    const index = TABS.findIndex((t) => t.id === tab);
    if (e.key === "ArrowRight") selectTab(TABS[(index + 1) % TABS.length].id);
    else if (e.key === "ArrowLeft") selectTab(TABS[(index - 1 + TABS.length) % TABS.length].id);
  }

  function createBannerForEvent(prefill) {
    setBannerPrefill({ ...prefill }); // new object each time so the same event can be re-used
    setTab("banners");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <SEO {...PAGE_META.admin} />
      <div className="px-4 py-14 sm:px-8">
        {!profile ? (
          <AdminLogin onSignIn={signIn} signingIn={signingIn} error={error} />
        ) : profile.email !== OWNER_EMAIL ? (
          <div className="mx-auto max-w-sm rounded-2xl bg-white p-8 text-center shadow-sm">
            <h1 className="font-display text-xl text-brand-green-900">Not Authorized</h1>
            <p className="mt-2 text-sm text-brand-green-900/70">
              {profile.email} isn't allowed to manage this studio's website.
            </p>
            <button
              type="button"
              onClick={signOut}
              className="mt-4 text-sm font-semibold text-brand-gold-600 hover:underline"
            >
              Sign out and try another account
            </button>
          </div>
        ) : (
          <>
            <div className="mx-auto mb-6 flex max-w-5xl flex-wrap items-center justify-between gap-3">
              <h1 className="font-display text-xl text-brand-green-900">Studio Admin</h1>
              <div className="flex items-center gap-4 text-sm">
                <p className="text-brand-green-900/70">{profile.email}</p>
                <button type="button" onClick={signOut} className="font-semibold text-brand-gold-600 hover:underline">
                  Sign out
                </button>
              </div>
            </div>

            <div role="tablist" aria-label="Admin sections" className="mx-auto mb-6 flex max-w-5xl gap-2" onKeyDown={handleTabKey}>
              {TABS.map((t) => (
                <button
                  key={t.id}
                  ref={(el) => (tabRefs.current[t.id] = el)}
                  type="button"
                  role="tab"
                  id={`tab-${t.id}`}
                  aria-selected={tab === t.id}
                  aria-controls={`panel-${t.id}`}
                  tabIndex={tab === t.id ? 0 : -1}
                  onClick={() => setTab(t.id)}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                    tab === t.id
                      ? "bg-brand-green-900 text-brand-cream-100"
                      : "bg-white text-brand-green-900 hover:bg-brand-green-900/10"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div role="tabpanel" id="panel-events" aria-labelledby="tab-events" hidden={tab !== "events"}>
              <EventEditor onCreateBanner={createBannerForEvent} />
            </div>
            <div role="tabpanel" id="panel-banners" aria-labelledby="tab-banners" hidden={tab !== "banners"}>
              <BannerEditor prefill={bannerPrefill} />
            </div>
          </>
        )}
      </div>
    </>
  );
}
