import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Sparkles,
  Shield,
  ShieldAlert,
  Send,
  Loader2,
  RefreshCw,
  Terminal,
  Activity,
  AlertOctagon,
  Bot,
  User,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { askSecurityCopilot, getCopilotQuickPrompts } from "../../api/copilotApi";
import { getSecurityDashboard, getSecurityLogs } from "../../api/securityApi";

export default function SecurityCopilot() {
  const [searchParams] = useSearchParams();
  const initialEventId = searchParams.get("eventId");
  const initialIncidentId = searchParams.get("incidentId");

  const [targetEventId, setTargetEventId] = useState(initialEventId);
  const [targetIncidentId, setTargetIncidentId] = useState(initialIncidentId);

  const [messages, setMessages] = useState([
    {
      id: "initial-greeting",
      role: "assistant",
      content:
        "🛡️ **AgentShield Security Copilot Ready.**\n\nI am connected to your live PostgreSQL security telemetry. I can investigate specific blocked prompts, explain attack vectors (jailbreaks, prompt injections), triage incidents, and provide tactical mitigation steps.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [quickPrompts, setQuickPrompts] = useState([]);
  const [telemetry, setTelemetry] = useState(null);
  const [recentEvents, setRecentEvents] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    // Load quick investigation prompts
    getCopilotQuickPrompts()
      .then((data) => setQuickPrompts(data || []))
      .catch((err) => console.error(err));

    // Load live telemetry for the side context panel
    Promise.all([getSecurityDashboard(), getSecurityLogs()])
      .then(([dash, logs]) => {
        setTelemetry(dash);
        setRecentEvents(logs || []);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (queryText = inputPrompt) => {
    const text = queryText.trim();
    if (!text || loading) return;

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      targetEventId,
      targetIncidentId,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt("");
    setLoading(true);

    try {
      const data = await askSecurityCopilot(
        text,
        targetEventId ? parseInt(targetEventId) : null,
        targetIncidentId ? parseInt(targetIncidentId) : null
      );

      const aiMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.response || "No response received from Security Copilot.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        telemetryContext: data.telemetry_context,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      const detail = err?.response?.data?.detail || "Security Copilot encountered an error communicating with the AI service.";
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `⚠️ **Investigation Error**: ${detail}`,
          isError: true,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-12 h-[calc(100vh-130px)]">
      {/* Main Copilot Chat Console */}
      <div className="flex flex-col rounded-2xl border border-violet-900/40 bg-[#090e21] shadow-2xl backdrop-blur-xl lg:col-span-8 overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-violet-950/80 bg-slate-950/60 px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 shadow-md shadow-violet-600/30">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">AgentShield Security Copilot</h2>
                <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[10px] font-bold text-violet-300">
                  SOC Tier-2 Intelligence
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Powered by OpenRouter • Contextual Telemetry Active
              </p>
            </div>
          </div>

          {(targetEventId || targetIncidentId) && (
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-red-500/20 border border-red-500/30 px-2 py-1 text-[11px] font-mono text-red-300">
                {targetEventId ? `Event #${targetEventId}` : `Incident #${targetIncidentId}`}
              </span>
              <button
                onClick={() => {
                  setTargetEventId(null);
                  setTargetIncidentId(null);
                }}
                className="text-[11px] text-slate-400 hover:text-white underline"
              >
                Clear Context
              </button>
            </div>
          )}
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m) => {
            const isUser = m.role === "user";
            return (
              <div
                key={m.id}
                className={`flex gap-3.5 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-600/20 border border-violet-500/30 text-violet-400">
                    <Bot size={16} />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                    isUser
                      ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/20"
                      : m.isError
                      ? "bg-red-950/30 border border-red-500/30 text-red-300"
                      : "bg-slate-900/90 border border-slate-800 text-slate-200 shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-white/10 text-[10px]">
                    <span className="font-semibold uppercase tracking-wider opacity-80">
                      {isUser ? "Analyst Query" : "Security Copilot"}
                    </span>
                    <span className="opacity-60">{m.timestamp}</span>
                  </div>

                  <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>

                  {m.telemetryContext && (
                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                      <span className="font-semibold text-violet-300">Context:</span>
                      <span>{m.telemetryContext.total_events} Total Events</span>
                      <span>•</span>
                      <span>{m.telemetryContext.total_prompts} Total Prompts</span>
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-300 text-xs font-bold">
                    <User size={16} />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-3 text-slate-400 text-xs py-2">
              <Loader2 size={16} className="animate-spin text-violet-400" />
              <span>Security Copilot analyzing telemetry and formulating assessment...</span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        <div className="border-t border-violet-950/80 bg-slate-950/60 p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask Copilot: 'Explain why prompt #2 was blocked' or 'Summarize threat vectors'..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              disabled={loading}
              className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-xs text-white outline-none focus:border-violet-500 placeholder:text-slate-500"
            />
            <button
              type="submit"
              disabled={loading || !inputPrompt.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-600/30 transition hover:opacity-95 disabled:opacity-40"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Right Telemetry & Quick Action Sidebar */}
      <div className="flex flex-col gap-5 lg:col-span-4 overflow-y-auto">
        {/* Quick Investigation Prompts */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-3 text-white font-bold text-sm">
            <Sparkles size={16} className="text-violet-400" />
            <span>Investigative Queries</span>
          </div>

          <div className="space-y-2">
            {quickPrompts.map((qp) => (
              <button
                key={qp.id}
                onClick={() => handleSend(qp.prompt)}
                disabled={loading}
                className="w-full text-left rounded-xl border border-slate-800 bg-slate-950/60 p-2.5 text-xs text-slate-300 transition hover:border-violet-500/50 hover:bg-violet-950/20 hover:text-white"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">{qp.title}</span>
                  <ArrowRight size={12} className="text-violet-400" />
                </div>
                <p className="mt-1 text-[11px] text-slate-500 line-clamp-1">{qp.prompt}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Live Threat Telemetry Snapshot */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3 text-white font-bold text-sm">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-cyan-400" />
              <span>Real-Time Telemetry Context</span>
            </div>
            <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
              Live
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl bg-slate-950 p-3 border border-slate-800/80">
              <p className="text-slate-500 text-[10px] uppercase font-semibold">Total Requests</p>
              <p className="mt-1 text-xl font-bold text-white">{telemetry?.total_requests ?? 0}</p>
            </div>
            <div className="rounded-xl bg-slate-950 p-3 border border-slate-800/80">
              <p className="text-slate-500 text-[10px] uppercase font-semibold">Blocked Violations</p>
              <p className="mt-1 text-xl font-bold text-red-400">{telemetry?.blocked_prompts ?? 0}</p>
            </div>
          </div>

          {/* Quick Event Selector */}
          <div className="mt-4 pt-3 border-t border-slate-800">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Investigate Recent Violations
            </p>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {recentEvents.slice(0, 4).map((evt) => (
                <button
                  key={evt.id}
                  onClick={() => {
                    setTargetEventId(evt.id);
                    handleSend(`Investigate security event #${evt.id}: ${evt.event} - ${evt.description}`);
                  }}
                  className="w-full text-left rounded-lg p-2 bg-slate-950 hover:bg-violet-950/30 border border-slate-800 text-[11px] transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-violet-300 font-bold">#{evt.id} {evt.event}</span>
                    <span className="text-[9px] text-red-400 font-bold">{evt.severity}</span>
                  </div>
                  <p className="text-slate-400 truncate text-[10px] mt-0.5">{evt.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
