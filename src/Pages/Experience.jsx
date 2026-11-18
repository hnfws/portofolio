import { useEffect, useState } from "react";
import { BriefcaseBusiness, CalendarDays, Users } from "lucide-react";
import { supabase } from "../supabase";
import { PORTFOLIO_ROLES } from "../utils/portfolio";

const formatDate = (value) => {
  if (!value) return "Present";
  return new Date(`${value}T00:00:00`).toLocaleDateString("id-ID", {
    month: "short",
    year: "numeric",
  });
};

export default function Experience({ role }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchEntries = async () => {
      const { data, error: fetchError } = await supabase
        .from("experiences")
        .select("*")
        .order("start_date", { ascending: false });

      if (!active) return;
      if (fetchError) {
        console.error("Error fetching experience entries:", fetchError);
        setError("Pengalaman belum bisa dimuat. Coba muat ulang halaman.");
        setEntries([]);
      } else {
        setEntries(data || []);
      }
      setLoading(false);
    };

    fetchEntries();
    return () => {
      active = false;
    };
  }, []);

  const visibleEntries = entries.filter(
    (entry) => entry.role === "both" || entry.role === role,
  );

  return (
    <section
      className="mx-auto mt-16 w-[90%] max-w-7xl px-1 sm:px-0"
      id="Experience"
      aria-labelledby="experience-heading"
    >
      <div className="mb-8 text-center" data-aos="fade-up">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-indigo-300">
          The journey so far
        </p>
        <h2
          id="experience-heading"
          className="mt-2 text-3xl font-bold text-white sm:text-4xl"
        >
          Experience & Organizations
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-400 sm:text-base">
          Work and communities that have shaped my path as a{" "}
          {PORTFOLIO_ROLES[role].label.toLowerCase()}.
        </p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-sm text-slate-400">
          Loading experience...
        </div>
      ) : error ? (
        <div
          className="rounded-2xl border border-red-400/20 bg-red-400/5 p-8 text-center text-sm text-red-200"
          role="alert"
        >
          {error}
        </div>
      ) : visibleEntries.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-sm text-slate-400">
          Experience and organization history will appear here soon.
        </div>
      ) : (
        <div className="relative mx-auto max-w-4xl space-y-4 before:absolute before:bottom-6 before:left-[19px] before:top-6 before:w-px before:bg-gradient-to-b before:from-indigo-400/60 before:to-purple-500/10 sm:before:left-6">
          {visibleEntries.map((entry) => {
            const Icon =
              entry.category === "organization" ? Users : BriefcaseBusiness;

            return (
              <article
                className="relative rounded-2xl border border-white/10 bg-[#0b0a1c]/80 p-5 pl-12 transition-colors hover:border-indigo-400/25 sm:p-6 sm:pl-16"
                key={entry.id}
                data-aos="fade-up"
              >
                <span className="absolute left-[8px] top-6 flex h-6 w-6 items-center justify-center rounded-full border border-indigo-400/30 bg-[#100e27] text-indigo-300 sm:left-3">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-purple-300">
                      {entry.category === "organization"
                        ? "Organization"
                        : "Work"}
                    </span>
                    <h3 className="mt-1 text-lg font-semibold text-white sm:text-xl">
                      {entry.position}
                    </h3>
                    <p className="mt-1 text-sm text-indigo-200">
                      {entry.organization}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1.5 text-xs text-slate-400">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <span>
                      {formatDate(entry.start_date)} –{" "}
                      {entry.is_current ? "Present" : formatDate(entry.end_date)}
                    </span>
                  </div>
                </div>
                {entry.description && (
                  <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-400">
                    {entry.description}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
