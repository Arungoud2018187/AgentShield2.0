import { useEffect, useState } from "react";
import { FileText, Clock, User, Shield, RefreshCw } from "lucide-react";
import api from "../../api/axios";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLogs = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/dashboard/audit-logs");
      setLogs(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load audit logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Audit Trail
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Immutable log of administrative, governance, and security actions from PostgreSQL.
          </p>
        </div>
        <button
          onClick={fetchLogs}
          className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-medium text-slate-300 transition hover:border-cyan-500 hover:text-white"
        >
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
        </div>
      ) : logs.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-12 text-center text-slate-400">
          <Shield size={40} className="mx-auto mb-3 text-slate-600" />
          <p className="text-base font-semibold text-white">No Audit Records Yet</p>
          <p className="mt-1 text-xs text-slate-500">
            Administrative actions such as user creation, role changes, and system modifications will be logged here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl backdrop-blur-xl">
          <table className="w-full text-left">
            <thead className="border-b border-slate-800 bg-slate-950/70 text-xs uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Initiator</th>
                <th className="px-6 py-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              {logs.map((log) => (
                <tr key={log.id} className="transition hover:bg-slate-800/40">
                  <td className="whitespace-nowrap px-6 py-4 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} className="text-slate-500" />
                      {log.created_at ? new Date(log.created_at).toLocaleString() : "Recently"}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs font-semibold text-cyan-400">
                    <span className="rounded-md border border-cyan-500/20 bg-cyan-500/10 px-2 py-1">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-slate-300">
                        {log.user_name?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">{log.user_name}</p>
                        <p className="text-[11px] text-slate-500">{log.user_email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-300">
                    {log.details || "No additional metadata recorded"}
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
