import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Bell,
  MessageSquare,
  AlertTriangle,
  Activity,
  ArrowRight,
  CheckCircle2,
  Lock,
  Sparkles,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getEmployeeDashboard } from "../../api/employeeApi";

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getEmployeeDashboard();
      setData(res);
    } catch (err) {
      console.error(err);
      setError("Unable to sync live telemetry from AgentShield.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = [
    {
      title: "AI Requests",
      value: loading ? "..." : (data?.stats?.ai_requests ?? 0),
      label: "Safe Verified Queries",
      icon: MessageSquare,
      color: "from-emerald-500 to-teal-600",
      textColor: "text-emerald-400",
      action: () => navigate("/employee/chat"),
    },
    {
      title: "Unread Notifications",
      value: loading ? "..." : (data?.stats?.unread_notifications ?? 0),
      label: `${data?.stats?.total_notifications ?? 0} Total Alerts`,
      icon: Bell,
      color: "from-violet-500 to-indigo-600",
      textColor: "text-violet-400",
      action: () => navigate("/employee/notifications"),
    },
    {
      title: "Reported Incidents",
      value: loading ? "..." : (data?.stats?.incidents ?? 0),
      label: "User Security Reports",
      icon: AlertTriangle,
      color: "from-amber-500 to-orange-600",
      textColor: "text-amber-400",
      action: () => navigate("/employee/report-incident"),
    },
    {
      title: "Security Violations",
      value: loading ? "..." : (data?.stats?.security_alerts ?? 0),
      label: "Blocked Policy Attempts",
      icon: Shield,
      color: "from-cyan-500 to-blue-600",
      textColor: "text-cyan-400",
      action: null,
    },
  ];

  const tips = [
    "Never paste raw internal API keys, passwords, or customer PII into AI prompts.",
    "Verify generated code or sensitive documentation before deploying to production.",
    "If the AI outputs abnormal or policy-violating instructions, report it immediately.",
    "Ensure your AgentShield session remains authenticated using corporate credentials.",
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40 p-8 backdrop-blur-xl">
        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              <ShieldCheck size={14} /> AgentShield Protected Workspace
            </div>
            <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
              Welcome back, {user?.full_name || "Employee"}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Department: <strong className="text-emerald-300">{user?.department || "General"}</strong> • Employee ID: <strong className="text-emerald-300">{user?.employee_id || "EMP"}</strong>
              <br />
              All your AI conversations are protected by AgentShield's active 3-tier guardrails.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={loadData}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-700 disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
            </button>
            <button
              onClick={() => navigate("/employee/chat")}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:brightness-110"
            >
              <Sparkles size={16} /> Open AI Assistant
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {/* Dynamic Stats Grid */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              onClick={item.action ? item.action : undefined}
              className={`group rounded-2xl border border-slate-800 bg-slate-900/90 p-6 transition-all duration-200 hover:border-slate-700 ${
                item.action ? "cursor-pointer hover:shadow-lg hover:shadow-slate-950/40" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r ${item.color} shadow-md`}
                >
                  <Icon className="text-white" size={22} />
                </div>
                {item.action && (
                  <span className="text-xs text-slate-500 transition group-hover:text-emerald-400 group-hover:translate-x-0.5">
                    <ArrowRight size={16} />
                  </span>
                )}
              </div>

              <h3 className="mt-4 text-xs font-medium uppercase tracking-wider text-slate-400">
                {item.title}
              </h3>
              <p className="mt-1 text-3xl font-black tracking-tight text-white">
                {item.value}
              </p>
              <p className="mt-1 text-xs text-slate-400">{item.label}</p>
            </div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid gap-8 xl:grid-cols-3">
        {/* Left Column: Assistant Launcher + Live Prompts */}
        <div className="space-y-8 xl:col-span-2">
          {/* Quick Chat Launcher */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Enterprise AI Assistant
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Powered by OpenRouter with automated real-time jailbreak & prompt injection filters.
                </p>
              </div>
              <button
                onClick={() => navigate("/employee/chat")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-500/20 transition hover:brightness-110"
              >
                <span>New Conversation</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* Recent User Prompts / Activity */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="text-emerald-400" size={20} />
                <h2 className="text-lg font-bold text-white">
                  Your Recent AI Interactions
                </h2>
              </div>
              <span className="text-xs text-slate-400">Logged to Database</span>
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading recent activities...</div>
            ) : data?.recent_prompts && data.recent_prompts.length > 0 ? (
              <div className="space-y-3">
                {data.recent_prompts.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/60 p-3.5 transition hover:border-slate-700"
                  >
                    <div className="min-w-0 flex-1 pr-4">
                      <p className="truncate text-sm font-medium text-white">
                        "{item.prompt}"
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {item.created_at ? new Date(item.created_at).toLocaleString() : "Recently"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
                      <CheckCircle2 size={13} />
                      <span>{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center">
                <p className="text-sm text-slate-400">No AI requests logged yet for your account.</p>
                <button
                  onClick={() => navigate("/employee/chat")}
                  className="mt-3 text-xs font-semibold text-emerald-400 hover:underline"
                >
                  Start your first conversation with AgentShield AI →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Security Guardrail Status & Tips */}
        <div className="space-y-8">
          {/* Active Guardrails Status */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
            <div className="mb-4 flex items-center gap-3">
              <ShieldCheck className="text-emerald-400" size={20} />
              <h2 className="text-lg font-bold text-white">
                Active Guardrails
              </h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">1</span>
                <div>
                  <h4 className="text-xs font-semibold text-white">Jailbreak Detection</h4>
                  <p className="text-[11px] text-slate-400">Neutralizes system prompt bypass attempts.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-500/20 text-teal-400 text-xs font-bold">2</span>
                <div>
                  <h4 className="text-xs font-semibold text-white">Prompt Injection Agent</h4>
                  <p className="text-[11px] text-slate-400">Prevents indirect malicious instructions.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold">3</span>
                <div>
                  <h4 className="text-xs font-semibold text-white">Output Validation Agent</h4>
                  <p className="text-[11px] text-slate-400">Validates model responses for enterprise safety.</p>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-3 text-center">
              <span className="text-xs text-slate-400">AI Provider: </span>
              <strong className="text-xs text-white">OpenRouter (Active)</strong>
            </div>
          </div>

          {/* Security Best Practices */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
            <div className="mb-4 flex items-center gap-3">
              <Lock className="text-cyan-400" size={20} />
              <h2 className="text-lg font-bold text-white">
                Security Best Practices
              </h2>
            </div>

            <div className="space-y-3">
              {tips.map((tip, index) => (
                <div
                  key={index}
                  className="flex gap-2.5 rounded-xl bg-slate-800/50 p-3 text-xs text-slate-300"
                >
                  <span className="text-emerald-400">•</span>
                  <p>{tip}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate("/employee/report-incident")}
              className="mt-4 w-full rounded-xl border border-amber-500/30 bg-amber-500/10 py-2 text-xs font-semibold text-amber-300 transition hover:bg-amber-500/20"
            >
              Report Security Concern
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}