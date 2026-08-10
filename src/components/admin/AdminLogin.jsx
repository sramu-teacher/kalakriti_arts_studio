import { LogIn } from "lucide-react";

export default function AdminLogin({ onSignIn, signingIn, error }) {
  return (
    <div className="mx-auto max-w-sm rounded-2xl bg-white p-8 text-center shadow-sm">
      <h1 className="font-display text-2xl text-brand-green-900">Studio Admin</h1>
      <p className="mt-2 text-sm text-brand-green-900/70">
        Sign in with the studio's Google account to manage announcement banners.
      </p>
      <button
        type="button"
        onClick={onSignIn}
        disabled={signingIn}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-green-900 px-6 py-2.5 text-sm font-semibold text-brand-cream-100 disabled:opacity-60"
      >
        <LogIn size={16} />
        {signingIn ? "Signing in…" : "Sign in with Google"}
      </button>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </div>
  );
}
