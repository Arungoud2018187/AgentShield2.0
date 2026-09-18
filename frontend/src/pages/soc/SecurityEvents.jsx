import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert, Search, Filter, Clock, Sparkles, RefreshCw, AlertCircle } from "lucide-react";
import { getSecurityLogs } from "../../api/securityApi";

export default function SecurityEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [error, setError] = useState("");

  const loadEvents = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getSecurityLogs();
      setEvents(data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load security events stream.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const filtered = events.filter((e) => {
    const matchesSearch =
      (e.description || "").toLowerCase().includes(search.toLowerCase()) ||
      (e.event || "").toLowerCase().includes(search.toLowerCase()) ||
      (e.employee_id || "").toLowerCase().includes(search.toLowerCase()) ||
      (e.user_email || "").toLowerCase().includes(search.toLowerCase());

    const matchesSeverity =
      severityFilter === "ALL" || (e.severity || "").toUpperCase() === severityFilter.toUpperCase();

    return matchesSearch && matchesSeverity;
  });

  const investigateWithCopilot = (eventId) => {
    navigate(`/soc/security-copilot?eventId=${eventId}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Security Event Telemetry
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Real-time audit of quarantined prompt injections, jailbreak bypasses, and pipeline violations.
          </p>
        </div>
        <button
          onClick={loadEvents}
          className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-medium text-slate-300 transition hover:border-violet-500 hover:text-white self-start sm:self-auto"
        >
          <RefreshCw size={14} /> Refresh Logs
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Filter Controls */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl backdrop-blur-xl sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by event type, prompt snippet, or user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-4 text-xs text-white outline-none focus:border-violet-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={15} className="text-slate-400" />
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white outline-none focus:border-violet-500"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Events Table */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-12 text-center text-slate-400">
          <AlertCircle size={36} className="mx-auto mb-2 text-slate-600" />
          <p className="text-sm font-semibold text-white">No Matching Security Events</p>
          <p className="mt-1 text-xs text-slate-500">
            Try adjusting your search criteria or severity filter.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl backdrop-blur-xl">
          <table className="w-full text-left">
            <thead className="border-b border-slate-800 bg-slate-950/70 text-xs uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-5 py-3.5">Time</th>
                <th className="px-5 py-3.5">Severity</th>
                <th className="px-5 py-3.5">Threat Classification</th>
                <th className="px-5 py-3.5">Incident Details</th>
                <th className="px-5 py-3.5">Identified User</th>
                <th className="px-5 py-3.5 text-right">Investigation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {filtered.map((item) => (
                <tr key={item.id} className="transition hover:bg-slate-800/40">
                  <td className="whitespace-nowrap px-5 py-4 text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Clock size={13} className="text-slate-500" />
                      {item.timestamp ? new Date(item.timestamp).toLocaleString() : "Recently"}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded px-2.5 py-0.5 text-[10px] font-bold ${
                        item.severity === "CRITICAL"
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : item.severity === "HIGH"
                          ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {item.severity}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono font-bold text-white">
                    {item.event}
                  </td>
                  <td className="px-5 py-4 text-slate-300 max-w-md">
                    <p className="line-clamp-2">{item.description}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-white">{item.user_name || "Unknown"}</p>
                    <p className="font-mono text-[11px] text-cyan-300">
                      {item.employee_id || `User #${item.user_id}`}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => investigateWithCopilot(item.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-violet-500/30 bg-violet-950/40 px-3 py-1.5 text-xs font-medium text-violet-300 transition hover:border-violet-500 hover:bg-violet-900/60"
                    >
                      <Sparkles size={12} className="text-violet-400" /> Investigate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
