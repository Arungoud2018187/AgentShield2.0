import { useEffect, useState } from "react";
import { Cpu, ShieldCheck, Activity, RefreshCw, Layers } from "lucide-react";
import { getSecurityAgents } from "../../api/securityApi";

export default function AgentMonitoring() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAgents = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getSecurityAgents();
      setAgents(data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load pipeline agent telemetry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAgents();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Agent Monitoring
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Real-time pipeline diagnostics, telemetry throughput, and detection rates for active AgentShield agents.
          </p>
        </div>
        <button
          onClick={loadAgents}
          className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-medium text-slate-300 transition hover:border-violet-500 hover:text-white"
        >
          <RefreshCw size={14} /> Refresh Agents
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
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {agents.map((agent, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl transition hover:border-violet-500/40"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-950/60 text-violet-400 border border-violet-800/40">
                    <Cpu size={24} />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{agent.agent}</h3>
                    <p className="text-xs text-slate-400">{agent.type || "AI Defense Stage"}</p>
                  </div>
                </div>
                <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                  {agent.status}
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-800 pt-4">
                <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/60">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Requests Inspected
                  </p>
                  <p className="mt-1 text-2xl font-black text-white">{agent.requests_processed}</p>
                </div>

                <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/60">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Threats Detected
                  </p>
                  <p className="mt-1 text-2xl font-black text-red-400">{agent.threats_detected}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
