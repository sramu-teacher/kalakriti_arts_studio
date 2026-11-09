import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import FormField from "../registration/FormField.jsx";
import { submitContact } from "../../utils/googleSheets.js";

const initialForm = {
  name: "",
  phone: "",
  email: "",
  message: "",
};

// Mirrors EventInterestForm, but submits through the existing "contact"
// action rather than a new Apps Script endpoint — enquiries land in the
// "Contact Enquiries" sheet and the owner's email with the piece named
// in the subject, so no Apps Script redeploy is needed.
export default function ArtInterestForm({ piece }) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [error, setError] = useState(null);

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);
    try {
      await submitContact({
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: `Art purchase enquiry: ${piece.title}`,
        message: `Interested in buying: ${piece.title} (${piece.style})\n\n${form.message || "(no message)"}`,
      });
      setStatus("success");
    } catch (err) {
      setError(err.message || "Something went wrong — please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="mx-auto max-w-lg rounded-2xl bg-brand-green-900 p-8 text-center text-brand-cream-100">
        <CheckCircle2 size={48} className="mx-auto text-brand-gold-400" />
        <h2 className="mt-4 font-display text-2xl">Thank You!</h2>
        <p className="mt-2 text-brand-cream-100/85">
          We've received your interest in {piece.title}. We'll reach out shortly with the price and availability.
        </p>
        <Link
          to="/art-for-sale"
          className="mt-6 inline-block rounded-full bg-brand-gold-500 px-6 py-2 text-sm font-semibold text-brand-green-950"
        >
          Back to Art for Sale
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-5 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-center gap-4 rounded-xl bg-brand-cream-100 p-3">
        <img src={piece.image} alt="" className="h-20 w-16 shrink-0 rounded-lg object-cover" />
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-brand-gold-600">You're enquiring about</p>
          <p className="font-display text-lg text-brand-green-900">{piece.title}</p>
        </div>
      </div>

      <FormField
        label="Your Name"
        name="name"
        required
        value={form.name}
        onChange={(e) => updateField("name", e.target.value)}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          label="Phone Number"
          name="phone"
          type="tel"
          required
          value={form.phone}
          onChange={(e) => updateField("phone", e.target.value)}
        />
        <FormField
          label="Email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
        />
      </div>

      <FormField
        label="Message (optional)"
        name="message"
        type="textarea"
        value={form.message}
        onChange={(e) => updateField("message", e.target.value)}
        placeholder="Any questions about the piece, delivery, or a custom version…"
      />

      {status === "error" && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-gold-500 px-6 py-3 text-sm font-semibold text-brand-green-950 transition-transform hover:scale-[1.02] disabled:opacity-60"
      >
        {status === "submitting" && <Loader2 size={16} className="animate-spin" />}
        {status === "submitting" ? "Submitting…" : "Send Interest"}
      </button>
    </form>
  );
}
