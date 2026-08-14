import { useEffect, useState } from "react";
import { Loader2, Megaphone } from "lucide-react";
import { getBanners, saveBanner } from "../../utils/googleSheets.js";
import { isBannerActive } from "../../utils/dateRange.js";

const initialForm = { message: "", startDate: "", endDate: "", active: true, actionLabel: "", actionUrl: "" };

export default function BannerEditor({ ownerEmail }) {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function loadBanners() {
    setLoading(true);
    getBanners()
      .then((data) => setBanners(Array.isArray(data.banners) ? data.banners : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadBanners();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await saveBanner({ ...form, ownerEmail });
      setForm(initialForm);
      loadBanners();
    } catch (err) {
      setError(err.message || "Couldn't save the banner — please try again.");
    } finally {
      setSaving(false);
    }
  }

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 font-display text-xl text-brand-green-900">
          <Megaphone size={20} /> New Announcement
        </h2>

        <label className="block text-sm font-medium text-brand-green-900">
          Message
          <textarea
            required
            rows={3}
            value={form.message}
            onChange={(e) => updateField("message", e.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-green-800/20 px-4 py-2.5 outline-none focus:border-brand-gold-500 focus:ring-2 focus:ring-brand-gold-500/30"
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block text-sm font-medium text-brand-green-900">
            Start Date
            <input
              type="date"
              required
              value={form.startDate}
              onChange={(e) => updateField("startDate", e.target.value)}
              className="mt-1 w-full rounded-lg border border-brand-green-800/20 px-3 py-2 outline-none focus:border-brand-gold-500 focus:ring-2 focus:ring-brand-gold-500/30"
            />
          </label>
          <label className="block text-sm font-medium text-brand-green-900">
            End Date
            <input
              type="date"
              required
              value={form.endDate}
              onChange={(e) => updateField("endDate", e.target.value)}
              className="mt-1 w-full rounded-lg border border-brand-green-800/20 px-3 py-2 outline-none focus:border-brand-gold-500 focus:ring-2 focus:ring-brand-gold-500/30"
            />
          </label>
        </div>

        <label className="flex items-center gap-2 text-sm font-medium text-brand-green-900">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => updateField("active", e.target.checked)}
          />
          Active
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block text-sm font-medium text-brand-green-900">
            Action Label <span className="font-normal text-brand-green-900/50">(optional)</span>
            <input
              type="text"
              placeholder="e.g. Enquire Now"
              value={form.actionLabel}
              onChange={(e) => updateField("actionLabel", e.target.value)}
              className="mt-1 w-full rounded-lg border border-brand-green-800/20 px-3 py-2 outline-none focus:border-brand-gold-500 focus:ring-2 focus:ring-brand-gold-500/30"
            />
          </label>
          <label className="block text-sm font-medium text-brand-green-900">
            Action Link <span className="font-normal text-brand-green-900/50">(optional)</span>
            <input
              type="text"
              placeholder="/contact or https://wa.me/..."
              value={form.actionUrl}
              onChange={(e) => updateField("actionUrl", e.target.value)}
              className="mt-1 w-full rounded-lg border border-brand-green-800/20 px-3 py-2 outline-none focus:border-brand-gold-500 focus:ring-2 focus:ring-brand-gold-500/30"
            />
          </label>
        </div>
        <p className="-mt-2 text-xs text-brand-green-900/50">
          Leave both blank for a message-only banner with just a dismiss button.
        </p>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-gold-500 px-6 py-2.5 text-sm font-semibold text-brand-green-950 disabled:opacity-60"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          {saving ? "Saving…" : "Save Banner"}
        </button>
      </form>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-display text-xl text-brand-green-900">Existing Banners</h2>
        {loading ? (
          <p className="mt-4 text-sm text-brand-green-900/60">Loading…</p>
        ) : banners.length === 0 ? (
          <p className="mt-4 text-sm text-brand-green-900/60">No banners yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {banners.map((banner, index) => (
              <li key={index} className="rounded-lg border border-brand-green-800/10 p-3 text-sm">
                <p className="font-medium text-brand-green-900">{banner.message}</p>
                <p className="mt-1 text-xs text-brand-green-900/60">
                  {banner.startDate} → {banner.endDate} ·{" "}
                  {isBannerActive(banner) ? (
                    <span className="text-green-700">Live now</span>
                  ) : banner.active ? (
                    <span className="text-brand-gold-600">Scheduled / expired</span>
                  ) : (
                    <span className="text-brand-green-900/50">Inactive</span>
                  )}
                </p>
                {banner.actionLabel && banner.actionUrl && (
                  <p className="mt-1 text-xs text-brand-green-900/60">
                    Action: "{banner.actionLabel}" → {banner.actionUrl}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
