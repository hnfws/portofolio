import { useCallback, useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  CalendarDays,
  Pencil,
  Plus,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { supabase } from "../../supabase";
import { PORTFOLIO_ROLES } from "../../utils/portfolio";

const EMPTY_FORM = {
  category: "work",
  role: "developer",
  organization: "",
  position: "",
  description: "",
  start_date: "",
  end_date: "",
  is_current: false,
};

const FIELD_CLASS =
  "w-full rounded-xl border border-white/10 bg-[#0d0d22] px-4 py-2.5 text-sm text-gray-200 outline-none transition-all placeholder:text-gray-600 focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20";

function Field({ label, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium uppercase tracking-wider text-indigo-300/70">
        {label}
      </span>
      {children}
    </label>
  );
}

function ExperienceForm({ initial, saving, onCancel, onSubmit }) {
  const [form, setForm] = useState(() => ({
    ...EMPTY_FORM,
    ...initial,
    start_date: initial?.start_date || "",
    end_date: initial?.end_date || "",
  }));
  const update = (key) => (event) => {
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    setForm((current) => ({ ...current, [key]: value }));
  };

  return (
    <form
      className="space-y-4 p-5 sm:p-6"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit({
          ...form,
          end_date: form.is_current ? null : form.end_date || null,
        });
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Entry type">
          <select
            className={FIELD_CLASS}
            value={form.category}
            onChange={update("category")}
          >
            <option value="work">Work experience</option>
            <option value="organization">Organization</option>
          </select>
        </Field>
        <Field label="Portfolio role">
          <select
            className={FIELD_CLASS}
            value={form.role}
            onChange={update("role")}
          >
            <option value="developer">
              {PORTFOLIO_ROLES.developer.label}
            </option>
            <option value="illustrator">
              {PORTFOLIO_ROLES.illustrator.label}
            </option>
            <option value="both">Show in both portfolios</option>
          </select>
        </Field>
        <Field label="Company / organization">
          <input
            className={FIELD_CLASS}
            value={form.organization}
            onChange={update("organization")}
            placeholder="Company, community, or organization"
            required
          />
        </Field>
        <Field label="Position / role">
          <input
            className={FIELD_CLASS}
            value={form.position}
            onChange={update("position")}
            placeholder="e.g. Full-Stack Developer"
            required
          />
        </Field>
        <Field label="Start date">
          <input
            className={FIELD_CLASS}
            type="date"
            value={form.start_date}
            onChange={update("start_date")}
            required
          />
        </Field>
        <Field label="End date">
          <input
            className={FIELD_CLASS}
            type="date"
            value={form.end_date}
            onChange={update("end_date")}
            disabled={form.is_current}
            required={!form.is_current}
          />
        </Field>
        <label className="flex items-center gap-2 text-sm text-gray-300 sm:col-span-2">
          <input
            type="checkbox"
            checked={form.is_current}
            onChange={update("is_current")}
            className="h-4 w-4 accent-indigo-500"
          />
          This is my current position
        </label>
        <Field label="Description">
          <textarea
            className={`${FIELD_CLASS} resize-y`}
            value={form.description}
            onChange={update("description")}
            placeholder="Responsibilities, achievements, or contributions"
            rows={4}
          />
        </Field>
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-white/10 px-4 py-2 text-sm text-gray-400 transition-colors hover:text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving..." : initial ? "Save changes" : "Add entry"}
        </button>
      </div>
    </form>
  );
}

export default function Experiences() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [error, setError] = useState("");

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from("experiences")
      .select("*")
      .order("start_date", { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
    } else {
      setError("");
      setEntries(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
    setError("");
  };

  const saveEntry = async (form) => {
    setSaving(true);
    setError("");
    const result = editing
      ? await supabase.from("experiences").update(form).eq("id", editing.id)
      : await supabase.from("experiences").insert(form);

    if (result.error) {
      setError(`Could not save entry: ${result.error.message}`);
    } else {
      closeForm();
      await fetchEntries();
      window.dispatchEvent(new Event("portfolioDataUpdated"));
    }
    setSaving(false);
  };

  const deleteEntry = async (id) => {
    if (!window.confirm("Delete this experience entry?")) return;
    const { error: deleteError } = await supabase
      .from("experiences")
      .delete()
      .eq("id", id);

    if (deleteError) {
      setError(`Could not delete entry: ${deleteError.message}`);
      return;
    }
    await fetchEntries();
    window.dispatchEvent(new Event("portfolioDataUpdated"));
  };

  const openNewForm = () => {
    setEditing(null);
    setError("");
    setFormOpen(true);
  };

  const openEditForm = (entry) => {
    setEditing(entry);
    setError("");
    setFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-[#030014] text-indigo-400">
              <BriefcaseBusiness className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold text-white sm:text-2xl">
              Experience & Organizations
            </h1>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {loading ? "Loading..." : `${entries.length} entries`}
          </p>
        </div>
        <button
          type="button"
          onClick={openNewForm}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add entry
        </button>
      </header>

      {error && (
        <p
          className="rounded-xl border border-red-400/20 bg-red-400/5 p-3 text-sm text-red-200"
          role="alert"
        >
          {error}
        </p>
      )}

      {formOpen && (
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <h2 className="text-sm font-semibold text-white">
              {editing ? "Edit entry" : "New entry"}
            </h2>
            <button
              type="button"
              onClick={closeForm}
              className="text-gray-500 transition-colors hover:text-white"
              aria-label="Close form"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <ExperienceForm
            initial={editing}
            saving={saving}
            onCancel={closeForm}
            onSubmit={saveEntry}
          />
        </section>
      )}

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center text-sm text-gray-500">
          Loading entries...
        </div>
      ) : entries.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
          <CalendarDays className="mx-auto mb-3 h-8 w-8 text-gray-600" />
          <p className="text-sm text-gray-400">No experience entries yet.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {entries.map((entry) => (
            <article
              key={entry.id}
              className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5"
            >
              <div className="flex min-w-0 items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-300">
                  {entry.category === "organization" ? (
                    <Users className="h-4 w-4" />
                  ) : (
                    <BriefcaseBusiness className="h-4 w-4" />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wider text-purple-300">
                    {entry.category} · {PORTFOLIO_ROLES[entry.role]?.shortLabel || "Both"}
                  </p>
                  <h2 className="mt-1 font-semibold text-white">
                    {entry.position}
                  </h2>
                  <p className="text-sm text-gray-400">{entry.organization}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {entry.start_date} –{" "}
                    {entry.is_current ? "Present" : entry.end_date}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => openEditForm(entry)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/25 px-3 py-1.5 text-xs text-indigo-300 transition-colors hover:bg-indigo-500/10"
                >
                  <Pencil className="h-3 w-3" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteEntry(entry.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 px-3 py-1.5 text-xs text-red-300 transition-colors hover:bg-red-500/10"
                >
                  <Trash2 className="h-3 w-3" /> Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
