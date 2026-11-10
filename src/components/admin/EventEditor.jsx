import { useEffect, useRef, useState } from "react";
import { CalendarPlus, Copy, ExternalLink, ImagePlus, Loader2, Megaphone, Pencil, Trash2, X } from "lucide-react";
import { getAdminEvents, saveEvent, updateEvent, deleteEvent, getEventImage } from "../../utils/googleSheets.js";
import { resizeImage, uploadEventImage } from "../../utils/driveUpload.js";
import { dateWindowStatus } from "../../utils/dateRange.js";

const initialForm = {
  name: "",
  tagline: "",
  eventDates: "",
  showFrom: "",
  showUntil: "",
  intro: "",
  description: "",
  highlights: "",
  closing: "",
  active: true,
};

const INPUT =
  "mt-1 w-full rounded-lg border border-brand-green-800/20 px-3 py-2 font-normal outline-none focus:border-brand-gold-500 focus:ring-2 focus:ring-brand-gold-500/30";
const LABEL = "block text-sm font-medium text-brand-green-900";
const HINT = "font-normal text-brand-green-900/50";

// Mirrors slugify_ in Code.gs, just to preview the link before saving —
// the server picks the final one (adding -2 etc. if it's taken).
function previewSlug(name) {
  return (
    name
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60)
      .replace(/-+$/g, "") || "event"
  );
}

function siteUrl(path) {
  return `${window.location.origin}${import.meta.env.BASE_URL.replace(/\/$/, "")}${path}`;
}

const STATUS_LABEL = {
  hidden: { text: "Hidden", className: "bg-brand-green-900/10 text-brand-green-900/70" },
  upcoming: { text: "Scheduled", className: "bg-brand-gold-500/15 text-brand-gold-600" },
  live: { text: "On the website", className: "bg-green-100 text-green-800" },
  ended: { text: "Ended", className: "bg-brand-green-900/10 text-brand-green-900/70" },
};

function statusOf(event) {
  return event.active ? dateWindowStatus(event.showFrom, event.showUntil) : "hidden";
}

export default function EventEditor({ onCreateBanner }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [editingSlug, setEditingSlug] = useState(null); // null = creating
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [deletingSlug, setDeletingSlug] = useState(null);
  const [copiedSlug, setCopiedSlug] = useState(null);
  // Picture: a newly chosen file (uploaded on save), the current one's
  // preview when editing, or a request to remove it.
  const [newImage, setNewImage] = useState(null); // { blob, url }
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const formRef = useRef(null);

  function loadEvents() {
    setLoading(true);
    setListError(null);
    return getAdminEvents()
      .then((data) => setEvents(Array.isArray(data.events) ? data.events : []))
      .catch((err) => setListError(err.message || "Couldn't load events."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => () => newImage && URL.revokeObjectURL(newImage.url), [newImage]);

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function resetForm() {
    setForm(initialForm);
    setEditingSlug(null);
    setError(null);
    setNewImage(null);
    setCurrentImageUrl(null);
    setRemoveImage(false);
  }

  function startEdit(event) {
    resetForm();
    setEditingSlug(event.slug);
    setForm({
      name: event.name,
      tagline: event.tagline,
      eventDates: event.eventDates,
      showFrom: event.showFrom,
      showUntil: event.showUntil,
      intro: event.intro,
      description: event.description,
      highlights: event.highlights,
      closing: event.closing,
      active: event.active,
    });
    if (event.hasImage) {
      getEventImage(event.slug)
        .then((img) => img.data && setCurrentImageUrl(`data:${img.contentType};base64,${img.data}`))
        .catch(() => {});
    }
    setNotice(null);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleImageChosen(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError(null);
    try {
      const blob = await resizeImage(file);
      setNewImage({ blob, url: URL.createObjectURL(blob) });
      setRemoveImage(false);
    } catch {
      setError("Couldn't read that picture — try a JPEG or PNG.");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.showUntil < form.showFrom) {
      setError('"Show until" must be on or after "Show from".');
      return;
    }
    setSaving(true);
    setError(null);
    setNotice(null);
    try {
      const payload = { ...form };
      if (newImage) payload.imageFileId = await uploadEventImage(newImage.blob, form.name);
      else if (removeImage) payload.imageFileId = "";

      const result = editingSlug
        ? await updateEvent({ ...payload, slug: editingSlug })
        : await saveEvent(payload);
      const slug = result.slug || editingSlug;
      const status = form.active ? dateWindowStatus(form.showFrom, form.showUntil) : "hidden";
      setNotice({
        slug,
        text:
          status === "live"
            ? "Saved — it's on the Events page now. Its link preview (WhatsApp/Facebook) updates in a few minutes."
            : status === "upcoming"
              ? `Saved — it will appear on the website on ${form.showFrom}.`
              : status === "ended"
                ? "Saved — its \"show until\" date has passed, so its link shows \"This event has ended\"."
                : "Saved as hidden — it won't appear on the website until you tick \"Show on website\".",
      });
      resetForm();
      loadEvents();
    } catch (err) {
      setError(err.message || "Couldn't save the event — please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(event) {
    if (!window.confirm(`Delete "${event.name}"?\n\nIts link will stop working. Any banner pointing to it should be deleted too.`)) return;
    setDeletingSlug(event.slug);
    setListError(null);
    try {
      await deleteEvent(event.slug);
      if (editingSlug === event.slug) resetForm();
    } catch (err) {
      setListError(err.message || "Couldn't delete the event — please try again.");
    } finally {
      setDeletingSlug(null);
      loadEvents();
    }
  }

  async function copyLink(event) {
    try {
      await navigator.clipboard.writeText(siteUrl(`/events/${event.slug}`));
      setCopiedSlug(event.slug);
      setTimeout(() => setCopiedSlug(null), 2500);
    } catch {
      window.prompt("Copy this link:", siteUrl(`/events/${event.slug}`));
    }
  }

  const imagePreview = newImage?.url || (!removeImage && currentImageUrl);
  const hasExistingImage = editingSlug && events.find((e) => e.slug === editingSlug)?.hasImage && !removeImage;

  return (
    <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[3fr_2fr]">
      <form ref={formRef} onSubmit={handleSubmit} className="scroll-mt-6 space-y-4 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-xl text-brand-green-900">
            <CalendarPlus size={20} aria-hidden="true" /> {editingSlug ? "Edit Event" : "New Event"}
          </h2>
          {editingSlug && (
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center gap-1 text-xs font-semibold text-brand-green-900/60 hover:text-brand-green-900"
            >
              <X size={14} aria-hidden="true" /> Cancel
            </button>
          )}
        </div>

        <label className={LABEL}>
          Event name *
          <input required value={form.name} onChange={(e) => updateField("name", e.target.value)} className={INPUT} placeholder="e.g. Diwali Diya Painting Workshop" />
        </label>
        {form.name && (
          <p className="-mt-2 break-all text-xs text-brand-green-900/60">
            Link: {editingSlug ? siteUrl(`/events/${editingSlug}`) : `${siteUrl("/events/")}${previewSlug(form.name)}`}
            {editingSlug && " (stays the same when you rename it)"}
          </p>
        )}

        <label className={LABEL}>
          Tagline <span className={HINT}>(optional)</span>
          <input value={form.tagline} onChange={(e) => updateField("tagline", e.target.value)} className={INPUT} placeholder="e.g. Light up the festival with colour" />
        </label>

        <label className={LABEL}>
          When is it? *
          <input required value={form.eventDates} onChange={(e) => updateField("eventDates", e.target.value)} className={INPUT} placeholder="e.g. Sat 25 Oct, 10 am – 1 pm" />
        </label>

        <fieldset className="rounded-xl border border-brand-green-800/15 p-4">
          <legend className="px-1 text-sm font-medium text-brand-green-900">Show on the website *</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className={LABEL}>
              From
              <input type="date" required value={form.showFrom} onChange={(e) => updateField("showFrom", e.target.value)} className={INPUT} />
            </label>
            <label className={LABEL}>
              Until
              <input type="date" required value={form.showUntil} onChange={(e) => updateField("showUntil", e.target.value)} className={INPUT} />
            </label>
          </div>
          <p className="mt-2 text-xs text-brand-green-900/60">
            Usually until the last day people can sign up. After that its link shows "This event has ended".
          </p>
        </fieldset>

        <label className={LABEL}>
          Short introduction *
          <textarea required rows={2} value={form.intro} onChange={(e) => updateField("intro", e.target.value)} className={INPUT} placeholder="One or two sentences — also used in link previews." />
        </label>

        <label className={LABEL}>
          More details <span className={HINT}>(optional — leave a blank line between paragraphs)</span>
          <textarea rows={5} value={form.description} onChange={(e) => updateField("description", e.target.value)} className={INPUT} />
        </label>

        <label className={LABEL}>
          Highlights <span className={HINT}>(optional — one per line)</span>
          <textarea rows={4} value={form.highlights} onChange={(e) => updateField("highlights", e.target.value)} className={INPUT} placeholder={"All materials provided\nAges 8 and up\nTake home your own diya"} />
        </label>

        <label className={LABEL}>
          Closing line <span className={HINT}>(optional)</span>
          <input value={form.closing} onChange={(e) => updateField("closing", e.target.value)} className={INPUT} placeholder="e.g. Seats are limited — book yours today!" />
        </label>

        <div className="rounded-xl border border-brand-green-800/15 p-4">
          <p className="text-sm font-medium text-brand-green-900">
            Picture <span className={HINT}>(optional — shown on the page and in WhatsApp/Facebook previews)</span>
          </p>
          {imagePreview && <img src={imagePreview} alt="Event picture preview" className="mt-3 max-h-48 rounded-lg object-cover" />}
          {hasExistingImage && !imagePreview && <p className="mt-2 text-xs text-brand-green-900/60">Loading current picture…</p>}
          <div className="mt-3 flex flex-wrap gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-brand-green-900/30 px-4 py-2 text-sm font-semibold text-brand-green-900 focus-within:outline focus-within:outline-2 focus-within:outline-brand-gold-500 hover:bg-brand-green-900/5">
              <ImagePlus size={16} aria-hidden="true" />
              {imagePreview || hasExistingImage ? "Change picture" : "Add picture"}
              <input type="file" accept="image/*" onChange={handleImageChosen} className="sr-only" />
            </label>
            {(imagePreview || hasExistingImage) && (
              <button
                type="button"
                onClick={() => {
                  setNewImage(null);
                  setRemoveImage(true);
                }}
                className="text-sm font-semibold text-red-700 hover:underline"
              >
                Remove picture
              </button>
            )}
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm font-medium text-brand-green-900">
          <input type="checkbox" checked={form.active} onChange={(e) => updateField("active", e.target.checked)} />
          Show on website <span className={HINT}>(untick to hide it without deleting)</span>
        </label>

        {error && (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-gold-500 px-6 py-2.5 text-sm font-semibold text-brand-green-950 disabled:opacity-60"
        >
          {saving && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
          {saving ? "Saving…" : editingSlug ? "Update Event" : "Save Event"}
        </button>
      </form>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-display text-xl text-brand-green-900">Your Events</h2>
        <div role="status" aria-live="polite">
          {copiedSlug && <p className="sr-only">Link copied</p>}
          {notice && (
            <div className="mt-3 rounded-lg bg-green-50 p-3 text-sm text-green-900">
              <p>{notice.text}</p>
              {notice.slug && (
                <p className="mt-1 break-all text-xs">
                  Link: <a className="underline" href={siteUrl(`/events/${notice.slug}`)} target="_blank" rel="noopener noreferrer">{siteUrl(`/events/${notice.slug}`)}</a>
                </p>
              )}
            </div>
          )}
        </div>
        {listError && (
          <p role="alert" className="mt-2 text-sm text-red-700">
            {listError}
          </p>
        )}
        {loading ? (
          <p className="mt-4 text-sm text-brand-green-900/60">Loading…</p>
        ) : events.length === 0 ? (
          <p className="mt-4 text-sm text-brand-green-900/60">
            No events yet. The two built-in events (Special Event Celebrations, Seasonal Holiday Camp) always show on the Events page.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {[...events]
              .sort((a, b) => (b.showFrom || "").localeCompare(a.showFrom || ""))
              .map((event) => {
                const status = STATUS_LABEL[statusOf(event)];
                return (
                  <li
                    key={event.slug}
                    className={`rounded-lg border p-3 text-sm ${editingSlug === event.slug ? "border-brand-gold-500 bg-brand-gold-500/5" : "border-brand-green-800/10"}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-brand-green-900">{event.name}</p>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${status.className}`}>{status.text}</span>
                    </div>
                    <p className="mt-1 text-xs text-brand-green-900/60">{event.eventDates}</p>
                    <p className="text-xs text-brand-green-900/60">
                      On website {event.showFrom} → {event.showUntil}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <IconButton label={`Edit ${event.name}`} onClick={() => startEdit(event)} icon={Pencil} text="Edit" />
                      <IconButton
                        label={`Create banner for ${event.name}`}
                        onClick={() =>
                          onCreateBanner({
                            message: [event.name, event.eventDates].filter(Boolean).join(" — "),
                            startDate: event.showFrom,
                            endDate: event.showUntil,
                            active: true,
                            actionLabel: "Learn more",
                            actionUrl: `/events/${event.slug}`,
                          })
                        }
                        icon={Megaphone}
                        text="Create banner"
                      />
                      <IconButton
                        label={`Copy link to ${event.name}`}
                        onClick={() => copyLink(event)}
                        icon={Copy}
                        text={copiedSlug === event.slug ? "Copied!" : "Copy link"}
                      />
                      <a
                        href={siteUrl(`/events/${event.slug}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View ${event.name} on the website (opens in a new tab)`}
                        className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold text-brand-green-900/70 hover:bg-brand-green-900/10 hover:text-brand-green-900"
                      >
                        <ExternalLink size={13} aria-hidden="true" /> View
                      </a>
                      <IconButton
                        label={`Delete ${event.name}`}
                        onClick={() => handleDelete(event)}
                        icon={deletingSlug === event.slug ? Loader2 : Trash2}
                        text="Delete"
                        danger
                        disabled={deletingSlug === event.slug}
                      />
                    </div>
                  </li>
                );
              })}
          </ul>
        )}
      </div>
    </div>
  );
}

function IconButton({ label, onClick, icon: Icon, text, danger = false, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold disabled:opacity-50 ${
        danger ? "text-red-700/80 hover:bg-red-50 hover:text-red-800" : "text-brand-green-900/70 hover:bg-brand-green-900/10 hover:text-brand-green-900"
      }`}
    >
      <Icon size={13} aria-hidden="true" className={disabled ? "animate-spin" : ""} /> {text}
    </button>
  );
}
