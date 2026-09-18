import { useEffect, useState } from "react";
import { AlertOctagon, Clock, User, CheckCircle2, RefreshCw, ShieldAlert, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getIncidents } from "../../api/incidentApi";

export default function Incidents() {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadIncidents = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getIncidents();
      setIncidents(data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load incidents list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const investigateWithCopilot = (incidentId) => {
    navigate(`/soc/security-copilot?incidentId=${incidentId}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Incident Triage & Management
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Security incidents submitted by employees and flagged by automated defense triggers.
          </p>
        </div>
        <button
          onClick={loadIncidents}
          className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-medium text-slate-300 transition hover:border-violet-500 hover:text-white"
        >
          <RefreshCw size={14} /> Refresh Incidents
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
        </div>
      ) : incidents.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-12 text-center text-slate-400">
          <CheckCircle2 size={40} className="mx-auto mb-3 text-emerald-400" />
          <p className="text-base font-semibold text-white">No Open Incidents</p>
          <p className="mt-1 text-xs text-slate-500">
            There are currently no unresolved employee-reported or automated security incidents.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {incidents.map((inc) => (
            <div
              key={inc.id}
              className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl transition hover:border-violet-500/40 md:flex-row md:items-center"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                  <AlertOctagon size={20} />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-base font-bold text-white">{inc.title}</h3>
                    <span
                      className={`rounded px-2.5 py-0.5 text-[10px] font-bold ${
                        inc.severity === "Critical"
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : inc.severity === "High"
                          ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {inc.severity}
                    </span>
                    <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-medium text-slate-300">
                      Status: {inc.status || "Open"}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed max-w-3xl">
                    {inc.description}
                  </p>
                  <p className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
                    <Clock size={12} />
                    Reported on {inc.created_at ? new Date(inc.created_at).toLocaleString() : "Recently"}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <button
                  onClick={() => investigateWithCopilot(inc.id)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-violet-600/30 transition hover:opacity-95"
                >
                  <Sparkles size={14} /> Investigate Incident
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
