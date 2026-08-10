import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import FormField from "../registration/FormField.jsx";
import { submitContact } from "../../utils/googleSheets.js";

const SUBJECTS = ["General Enquiry", "Class Timings", "Group / Sibling Discount", "Other"];

const initialForm = { name: "", email: "", phone: "", subject: SUBJECTS[0], message: "" };

export default function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("submitting");
    setError(null);
    try {
      await submitContact(form);
      setStatus("success");
      setForm(initialForm);
    } catch (err) {
      setError(err.message || "Something went wrong — please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <CheckCircle2 size={40} className="mx-auto text-brand-gold-500" />
        <h3 className="mt-3 font-display text-xl text-brand-green-900">Message Sent</h3>
        <p className="mt-2 text-brand-green-900/75">
          Thanks for reaching out — we'll get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm font-semibold text-brand-gold-600 hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
      <h2 className="font-display text-xl text-brand-green-900">Send Us a Message</h2>

      <FormField label="Your Name" name="name" required value={form.name} onChange={(e) => updateField("name", e.target.value)} />

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          label="Email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
        />
        <FormField
          label="Phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={(e) => updateField("phone", e.target.value)}
        />
      </div>

      <FormField label="Subject" name="subject">
        <select
          name="subject"
          id="subject"
          value={form.subject}
          onChange={(e) => updateField("subject", e.target.value)}
          className="mt-1 w-full rounded-lg border border-brand-green-800/20 bg-white px-4 py-2.5 text-brand-green-950 outline-none focus:border-brand-gold-500 focus:ring-2 focus:ring-brand-gold-500/30"
        >
          {SUBJECTS.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        label="Message"
        name="message"
        type="textarea"
        required
        value={form.message}
        onChange={(e) => updateField("message", e.target.value)}
        placeholder="Tell us how we can help…"
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
        {status === "submitting" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
