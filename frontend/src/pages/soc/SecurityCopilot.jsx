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
  FolderOpen,
  FileText,
  UploadCloud,
  X,
  FileCode,
} from "lucide-react";
import { askSecurityCopilot, getCopilotQuickPrompts } from "../../api/copilotApi";
import { getSecurityDashboard, getSecurityLogs } from "../../api/securityApi";
import { getIncident } from "../../api/incidentApi";
import MarkdownRenderer from "../../components/common/MarkdownRenderer";

export default function SecurityCopilot() {
  const [searchParams] = useSearchParams();
  const initialEventId = searchParams.get("eventId");
  const initialIncidentId = searchParams.get("incidentId");

  const [targetEventId, setTargetEventId] = useState(initialEventId);
  const [targetIncidentId, setTargetIncidentId] = useState(initialIncidentId);
  const [loadedIncident, setLoadedIncident] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: "initial-greeting",
      role: "assistant",
      content:
        "🛡️ **AgentShield Security Copilot Ready.**\n\nI am connected to your live PostgreSQL security telemetry. I can investigate employee-submitted incident files, analyze attack vectors (jailbreaks, prompt injections), correlate telemetry, and provide tactical containment steps.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [quickPrompts, setQuickPrompts] = useState([]);
  const [telemetry, setTelemetry] = useState(null);
  const [recentEvents, setRecentEvents] = useState([]);
  const bottomRef = useRef(null);

  // Load target incident if provided in URL
  useEffect(() => {
    if (initialIncidentId) {
      getIncident(initialIncidentId)
        .then((inc) => {
          setLoadedIncident(inc);
          setTargetIncidentId(initialIncidentId);
        })
        .catch((err) => console.error("Error loading incident:", err));
    }
  }, [initialIncidentId]);

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

  const handleFileSelected = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const rawText = e.target.result;
      let parsed = null;
      try {
        parsed = JSON.parse(rawText);
      } catch {
        parsed = null;
      }

      const fileInfo = {
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
        rawText: rawText,
        parsed: parsed,
      };

      setUploadedFile(fileInfo);

      if (parsed?.incident?.id) {
        setTargetIncidentId(parsed.incident.id);
        if (parsed.incident.title) {
          setLoadedIncident({
            id: parsed.incident.id,
            title: parsed.incident.title,
            severity: parsed.incident.severity,
            status: parsed.incident.status,
            reporter_name: parsed.reporter?.full_name,
            reporter_employee_id: parsed.reporter?.employee_id,
            reporter_department: parsed.reporter?.department,
            description: parsed.incident.description,
          });
        }
      }

      // Auto-initiate Copilot investigation
      const incTitle = parsed?.incident?.title || parsed?.title || file.name;
      const repName = parsed?.reporter?.full_name || parsed?.reporter_name || "Employee";
      const severity = parsed?.incident?.severity || parsed?.severity || "Medium";

      const autoQuery = `Analyze the uploaded security incident file '${file.name}' (${incTitle}). Reported by ${repName}, Severity: ${severity}. Provide attack vector classification, telemetry correlation, and tactical containment steps.`;

      handleSend(autoQuery, rawText, fileInfo);
    };
    reader.readAsText(file);
  };

  const handleSend = async (
    queryText = inputPrompt,
    overrideFileContent = null,
    overrideFileMeta = null
  ) => {
    const text = queryText.trim();
    if (!text || loading) return;

    const activeFile = overrideFileMeta || uploadedFile;
    const activeFileContent =
      overrideFileContent || (activeFile ? activeFile.rawText : null);

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      targetEventId,
      targetIncidentId,
      attachedFile: activeFile ? { name: activeFile.name, size: activeFile.size } : null,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputPrompt("");
    setLoading(true);

    try {
      const data = await askSecurityCopilot(
        text,
        targetEventId ? parseInt(targetEventId) : null,
        targetIncidentId ? parseInt(targetIncidentId) : null,
        activeFileContent
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
      const detail =
        err?.response?.data?.detail ||
        "Security Copilot encountered an error communicating with the AI service.";
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

  const clearActiveIncident = () => {
    setTargetIncidentId(null);
    setLoadedIncident(null);
    setUploadedFile(null);
  };

  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-12 h-[calc(100vh-130px)]">
      {/* Hidden Native File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files?.[0]) {
            handleFileSelected(e.target.files[0]);
          }
        }}
        accept=".json,.txt,.log,.md"
        className="hidden"
      />

      {/* Main Copilot Chat Console */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files?.[0]) {
            handleFileSelected(e.dataTransfer.files[0]);
          }
        }}
        className={`relative flex flex-col rounded-2xl border bg-[#090e21] shadow-2xl backdrop-blur-xl lg:col-span-8 overflow-hidden transition ${
          isDragging
            ? "border-violet-400 ring-2 ring-violet-500/40"
            : "border-violet-900/40"
        }`}
      >
        {/* Drag Overlay */}
        {isDragging && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-sm">
            <UploadCloud size={48} className="text-violet-400 animate-bounce" />
            <p className="mt-3 text-base font-bold text-white">
              Drop Incident File to Analyze
            </p>
            <p className="text-xs text-slate-400">
              Supports .json incident reports, .txt, and .log files
            </p>
          </div>
        )}

        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-violet-950/80 bg-slate-950/60 px-5 py-3.5">
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
                Powered by OpenRouter • Real-Time Incident Context
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Open Incident File Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-violet-500/40 bg-violet-500/10 px-3 py-1.5 text-xs font-semibold text-violet-300 transition hover:bg-violet-500/20 hover:text-white"
              title="Open downloaded or local incident file (.json)"
            >
              <FolderOpen size={14} className="text-violet-400" />
              <span>Open Incident File</span>
            </button>

            {targetEventId && (
              <div className="flex items-center gap-1.5 rounded-lg bg-red-500/20 border border-red-500/30 px-2 py-1 text-[11px] font-mono text-red-300">
                <span>Event #{targetEventId}</span>
                <button
                  onClick={() => setTargetEventId(null)}
                  className="text-red-400 hover:text-white ml-1"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Active Incident / File Context Banner */}
        {(loadedIncident || uploadedFile || targetIncidentId) && (
          <div className="border-b border-violet-900/50 bg-gradient-to-r from-violet-950/70 via-indigo-950/60 to-slate-950/80 px-5 py-2.5">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-violet-600/20 text-violet-300 border border-violet-500/30">
                  <FileText size={14} />
                </div>
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded">
                      {loadedIncident?.id ? `INC-${String(loadedIncident.id).padStart(4, "0")}` : "INCIDENT FILE"}
                    </span>
                    <strong className="text-white truncate">
                      {loadedIncident?.title || uploadedFile?.name || `Incident #${targetIncidentId}`}
                    </strong>
                    {loadedIncident?.severity && (
                      <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-[9px] font-bold text-red-300">
                        {loadedIncident.severity}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">
                    {loadedIncident?.reporter_name
                      ? `Reported by: ${loadedIncident.reporter_name} (${loadedIncident.reporter_employee_id || "EMP003"}) • ${loadedIncident.reporter_department || "General"}${
                          loadedIncident.log_file_name ? ` • 📄 Attached Log: ${loadedIncident.log_file_name}` : ""
                        }`
                      : uploadedFile
                      ? `Uploaded File: ${uploadedFile.name} (${uploadedFile.size})`
                      : "Active incident telemetry loaded"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const prompt = `Perform immediate threat assessment and containment review for incident ${
                      loadedIncident?.title || uploadedFile?.name || targetIncidentId
                    }.`;
                    handleSend(prompt);
                  }}
                  disabled={loading}
                  className="rounded-lg bg-violet-600 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm transition hover:bg-violet-500"
                >
                  Analyze Incident
                </button>
                <button
                  onClick={clearActiveIncident}
                  className="text-slate-400 hover:text-white p-1"
                  title="Clear Incident Context"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

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
                  className={`rounded-2xl p-4 text-xs leading-relaxed ${
                    isUser
                      ? "max-w-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/20"
                      : m.isError
                      ? "max-w-3xl bg-red-950/30 border border-red-500/30 text-red-300"
                      : "max-w-3xl w-full bg-slate-900/90 border border-slate-800 text-slate-200 shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-white/10 text-[10px]">
                    <span className="font-semibold uppercase tracking-wider opacity-80">
                      {isUser ? "Analyst Query" : "Security Copilot"}
                    </span>
                    <span className="opacity-60">{m.timestamp}</span>
                  </div>

                  {/* Attached File Chip on User Message */}
                  {m.attachedFile && (
                    <div className="mb-2 flex items-center gap-2 rounded-lg bg-black/20 px-2.5 py-1.5 text-[11px] font-mono border border-white/10">
                      <FileCode size={13} className="text-cyan-300" />
                      <span className="truncate">{m.attachedFile.name}</span>
                      <span className="opacity-60">({m.attachedFile.size})</span>
                    </div>
                  )}

                  {isUser ? (
                    <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
                  ) : (
                    <MarkdownRenderer content={m.content} />
                  )}

                  {m.telemetryContext && (
                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                      <span className="font-semibold text-violet-300">Context:</span>
                      <span>{m.telemetryContext.total_events} Total Events</span>
                      <span>•</span>
                      <span>{m.telemetryContext.total_prompts} Total Prompts</span>
                      {m.telemetryContext.incident_file_analyzed && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-400 font-semibold">Incident File Analyzed</span>
                        </>
                      )}
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
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-700 bg-slate-900 text-slate-300 transition hover:border-violet-500 hover:text-white"
              title="Open Incident File (.json)"
            >
              <FolderOpen size={16} />
            </button>

            <input
              type="text"
              placeholder="Ask Copilot: 'Analyze the incident file', 'Formulate containment steps', 'Check telemetry'..."
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
        {/* Incident File Investigation Widget */}
        <div className="rounded-2xl border border-violet-900/50 bg-gradient-to-b from-slate-900/90 to-violet-950/30 p-5 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between mb-3 text-white font-bold text-sm">
            <div className="flex items-center gap-2">
              <FolderOpen size={16} className="text-cyan-400" />
              <span>Incident File Analyzer</span>
            </div>
            {loadedIncident && (
              <span className="rounded bg-violet-500/20 px-2 py-0.5 text-[10px] font-bold text-violet-300">
                Active
              </span>
            )}
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
            Open or drop an incident file exported from the Incidents queue to evaluate the attack vector and formulate containment.
          </p>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-violet-500/40 bg-violet-950/20 p-3.5 text-xs font-semibold text-violet-300 transition hover:bg-violet-900/30 hover:border-violet-400 hover:text-white"
          >
            <UploadCloud size={16} />
            <span>Open Incident Report (.json)</span>
          </button>

          {loadedIncident && (
            <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Active Incident Details
              </p>
              <div className="rounded-xl bg-slate-950/80 p-3 border border-slate-800 text-[11px] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Title:</span>
                  <span className="font-semibold text-white truncate max-w-[170px]">{loadedIncident.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Reporter:</span>
                  <span className="font-semibold text-violet-300">
                    {loadedIncident.reporter_name || "Bhuvana"} ({loadedIncident.reporter_employee_id || "EMP003"})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Severity:</span>
                  <span className="font-bold text-red-400">{loadedIncident.severity}</span>
                </div>
              </div>

              {/* Action shortcuts */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() =>
                    handleSend(
                      `Formulate tactical containment and mitigation steps for incident: ${loadedIncident.title}`
                    )
                  }
                  className="rounded-lg bg-slate-950 p-2 text-left text-[10px] font-medium text-slate-300 border border-slate-800 hover:border-violet-500 hover:text-white transition"
                >
                  🛡️ Containment Steps
                </button>
                <button
                  onClick={() =>
                    handleSend(
                      `Assess blast radius and correlate enterprise prompt telemetry for: ${loadedIncident.title}`
                    )
                  }
                  className="rounded-lg bg-slate-950 p-2 text-left text-[10px] font-medium text-slate-300 border border-slate-800 hover:border-violet-500 hover:text-white transition"
                >
                  📡 Blast Radius
                </button>
              </div>
            </div>
          )}
        </div>

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
