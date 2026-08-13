import { useState } from "react";
import { Loader2 } from "lucide-react";
import FormField from "./FormField.jsx";
import ConfirmationMessage from "./ConfirmationMessage.jsx";
import { submitRegistration } from "../../utils/googleSheets.js";
import { CLASSES } from "../../data/classes.js";

const initialForm = {
  studentName: "",
  age: "",
  contactName: "",
  phone: "",
  email: "",
  classType: "",
  schedule: "",
  message: "",
};

export default function RegistrationForm({ classInfo }) {
  const [form, setForm] = useState({ ...initialForm, classType: classInfo?.slug || "" });
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [error, setError] = useState(null);

  const selectedClass = CLASSES.find((cls) => cls.slug === form.classType) || classInfo;

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("submitting");
    setError(null);
    try {
      // form.classType holds the URL slug (used to look up selectedClass
      // above) — swap in the human-readable name here so the Sheet tab
      // Code.gs creates reads "Little Picassos", not "little-picassos".
      await submitRegistration({ ...form, classType: selectedClass?.name || form.classType });
      setStatus("success");
    } catch (err) {
      setError(err.message || "Something went wrong — please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return <ConfirmationMessage classInfo={selectedClass} />;
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-xl space-y-5 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField
          label="Student Name"
          name="studentName"
          required
          value={form.studentName}
          onChange={(e) => updateField("studentName", e.target.value)}
        />
        <FormField
          label="Age"
          name="age"
          type="number"
          min="3"
          max="99"
          required
          value={form.age}
          onChange={(e) => updateField("age", e.target.value)}
        />
      </div>

      <FormField
        label="Parent / Contact Name"
        name="contactName"
        value={form.contactName}
        onChange={(e) => updateField("contactName", e.target.value)}
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

      <FormField label="Select Class" name="classType" required>
        <select
          name="classType"
          id="classType"
          required
          value={form.classType}
          onChange={(e) => updateField("classType", e.target.value)}
          className="mt-1 w-full rounded-lg border border-brand-green-800/20 bg-white px-4 py-2.5 text-brand-green-950 outline-none focus:border-brand-gold-500 focus:ring-2 focus:ring-brand-gold-500/30"
        >
          <option value="" disabled>
            Choose a class…
          </option>
          {CLASSES.map((cls) => (
            <option key={cls.slug} value={cls.slug}>
              {cls.name}
            </option>
          ))}
        </select>
      </FormField>

      {selectedClass?.schedules?.length > 0 && (
        <FormField label="Preferred Schedule" name="schedule">
          <select
            name="schedule"
            id="schedule"
            value={form.schedule}
            onChange={(e) => updateField("schedule", e.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-green-800/20 bg-white px-4 py-2.5 text-brand-green-950 outline-none focus:border-brand-gold-500 focus:ring-2 focus:ring-brand-gold-500/30"
          >
            <option value="">Select timing preference…</option>
            {selectedClass.schedules.map((schedule) => (
              <option key={schedule} value={schedule}>
                {schedule}
              </option>
            ))}
          </select>
        </FormField>
      )}

      <FormField
        label="Message (optional)"
        name="message"
        type="textarea"
        value={form.message}
        onChange={(e) => updateField("message", e.target.value)}
        placeholder="Any specific queries or requests…"
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
        {status === "submitting" ? "Submitting…" : "Send Registration"}
      </button>
    </form>
  );
}
