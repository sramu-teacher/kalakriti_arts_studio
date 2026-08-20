import SEO from "../components/shared/SEO.jsx";
import AdminLogin from "../components/admin/AdminLogin.jsx";
import BannerEditor from "../components/admin/BannerEditor.jsx";
import { useGoogleAuth } from "../hooks/useGoogleAuth.js";

const OWNER_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

// Unlike the rest of the site, this route is gated — but only this one
// route. The router still renders it for anyone; the gating happens here.
export default function Admin() {
  const { profile, error, signingIn, signIn, signOut } = useGoogleAuth();

  return (
    <>
      <SEO title="Studio Admin" noindex />
      <div className="px-4 py-14 sm:px-8">
        {!profile ? (
          <AdminLogin onSignIn={signIn} signingIn={signingIn} error={error} />
        ) : profile.email !== OWNER_EMAIL ? (
          <div className="mx-auto max-w-sm rounded-2xl bg-white p-8 text-center shadow-sm">
            <h1 className="font-display text-xl text-brand-green-900">Not Authorized</h1>
            <p className="mt-2 text-sm text-brand-green-900/70">
              {profile.email} isn't allowed to manage this studio's announcements.
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
            <div className="mx-auto mb-6 flex max-w-4xl items-center justify-between">
              <h1 className="font-display text-xl text-brand-green-900">Studio Admin</h1>
              <div className="flex items-center gap-4 text-sm">
                <p className="text-brand-green-900/70">{profile.email}</p>
                <button type="button" onClick={signOut} className="font-semibold text-brand-gold-600 hover:underline">
                  Sign out
                </button>
              </div>
            </div>
            <BannerEditor ownerEmail={profile.email} />
          </>
        )}
      </div>
    </>
  );
}
