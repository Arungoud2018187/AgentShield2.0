import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Activity,
  Cpu,
  Sparkles,
  AlertTriangle,
  Clock,
  ArrowRight,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { getSecurityDashboard, getSecurityAgents, getSecurityLogs } from "../../api/securityApi";

export default function SocDashboard() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [agents, setAgents] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [dashData, agentData, logData] = await Promise.all([
        getSecurityDashboard(),
        getSecurityAgents(),
        getSecurityLogs(),
      ]);
      setDashboard(dashData);
      setAgents(agentData);
      setLogs(logData);
    } catch (err) {
      console.error(err);
      setError("Failed to load real-time SOC security telemetry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
          <p className="text-sm font-semibold text-slate-300">Streaming SOC Telemetry...</p>
        </div>
      </div>
    );
  }

  const threatLevel = dashboard?.threat_level || "Low";
  const threatBadgeColor =
    threatLevel === "Critical"
      ? "bg-red-500/20 text-red-400 border-red-500/30"
      : threatLevel === "High"
      ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
      : threatLevel === "Medium"
      ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
      : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";

  return (
    <div className="space-y-8">
      {/* SOC Hero Header */}
      <div className="rounded-2xl border border-violet-900/40 bg-gradient-to-r from-violet-950/40 via-slate-900 to-cyan-950/30 p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 shadow-xl shadow-violet-600/30">
              <ShieldAlert size={32} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-white sm:text-3xl">
                  SOC Threat Intelligence & Operations
                </h1>
                <span className={`rounded-full border px-3 py-0.5 text-xs font-bold uppercase tracking-wider ${threatBadgeColor}`}>
                  {threatLevel} Threat Level
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-400">
                Live AI Security Defense • PostgreSQL Telemetry • OpenRouter Inference Engine
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={loadData}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-medium text-slate-300 transition hover:border-violet-500 hover:text-white"
            >
              <RefreshCw size={14} /> Refresh Stream
            </button>
            <button
              onClick={() => navigate("/soc/security-copilot")}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-violet-600/30 transition hover:scale-105"
            >
              <Sparkles size={14} /> Launch Security Copilot
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Requests</span>
            <Activity size={18} className="text-cyan-400" />
          </div>
          <p className="mt-3 text-3xl font-black text-white">{dashboard?.total_requests ?? 0}</p>
          <p className="mt-1 text-xs text-slate-500">Processed by AgentShield pipeline</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Blocked Threats</span>
            <ShieldAlert size={18} className="text-red-400" />
          </div>
          <p className="mt-3 text-3xl font-black text-red-400">{dashboard?.blocked_prompts ?? 0}</p>
          <p className="mt-1 text-xs text-slate-500">Policy violations quarantined</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Online Defense Agents</span>
            <Cpu size={18} className="text-emerald-400" />
          </div>
          <p className="mt-3 text-3xl font-black text-emerald-400">{dashboard?.online_agents ?? 3}</p>
          <p className="mt-1 text-xs text-slate-500">Jailbreak, Injection, Output Validator</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Users</span>
            <ShieldCheck size={18} className="text-violet-400" />
          </div>
          <p className="mt-3 text-3xl font-black text-violet-400">{dashboard?.active_users ?? 0}</p>
          <p className="mt-1 text-xs text-slate-500">Authorized platform identities</p>
        </div>
      </div>

      {/* Grid: Agent Pipeline Status & Recent Security Events */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Active Agents Status */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Active Defense Pipeline</h2>
            <button
              onClick={() => navigate("/soc/agents")}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              Agent Details <ArrowRight size={13} />
            </button>
          </div>

          <div className="space-y-3">
            {agents.map((agent, index) => (
              <div
                key={index}
                className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 transition hover:border-violet-500/40"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-950/60 text-violet-400 border border-violet-800/40">
                      <Cpu size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{agent.agent}</h3>
                      <p className="text-[11px] text-slate-400">{agent.type || "Pipeline Guardrail"}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                    {agent.status}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-800/60 pt-2 text-xs">
                  <div>
                    <span className="text-slate-500">Scanned: </span>
                    <span className="font-semibold text-white">{agent.requests_processed}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500">Threats: </span>
                    <span className="font-semibold text-red-400">{agent.threats_detected}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Security Violations Stream */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Recent Security Violations</h2>
            <button
              onClick={() => navigate("/soc/events")}
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              All Events ({logs.length}) <ArrowRight size={13} />
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl backdrop-blur-xl">
            {logs.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <ShieldCheck size={36} className="mx-auto mb-2 text-emerald-400" />
                <p className="text-sm font-medium text-white">No Policy Violations Detected</p>
                <p className="mt-1 text-xs text-slate-500">
                  All employee AI prompts have verified safely through the defense pipeline.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-800 max-h-[460px] overflow-y-auto">
                {logs.slice(0, 6).map((item) => (
                  <div key={item.id} className="p-4 transition hover:bg-slate-800/40">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                              item.severity === "CRITICAL"
                                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                : item.severity === "HIGH"
                                ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                                : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            }`}
                          >
                            {item.severity}
                          </span>
                          <h4 className="text-xs font-mono font-bold text-white">{item.event}</h4>
                        </div>
                        <p className="mt-1 text-xs text-slate-300 line-clamp-2">{item.description}</p>
                      </div>

                      <div className="shrink-0 text-right">
                        <span className="flex items-center gap-1 text-[11px] text-slate-400">
                          <Clock size={12} />
                          {item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : "Just now"}
                        </span>
                        <p className="mt-1 text-[11px] text-slate-500">
                          User: <span className="font-mono text-cyan-300">{item.employee_id || item.user_id}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
