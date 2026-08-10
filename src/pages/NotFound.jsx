import { Link } from "react-router-dom";
import SEO from "../components/shared/SEO.jsx";

export default function NotFound() {
  return (
    <>
      <SEO title="Page Not Found" />
      <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
        <h1 className="font-display text-4xl text-brand-green-900">404</h1>
        <p className="mt-2 text-brand-green-900/75">We couldn't find that page.</p>
        <Link to="/" className="mt-6 rounded-full bg-brand-gold-500 px-6 py-2 text-sm font-semibold text-brand-green-950">
          Back to Home
        </Link>
      </div>
    </>
  );
}
