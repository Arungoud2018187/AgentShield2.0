import { useState, useRef } from "react";
import {
  AlertTriangle,
  Send,
  ShieldAlert,
  CheckCircle2,
  Paperclip,
  FileText,
  X,
  UploadCloud,
} from "lucide-react";
import { createIncident } from "../../api/incidentApi";

export default function ReportIncident() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    severity: "Medium",
  });
  const [attachedLog, setAttachedLog] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const logInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Log file size exceeds the 5MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setAttachedLog({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
        content: event.target.result,
      });
      setError("");
    };
    reader.readAsText(file);
  };

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setStatus("");
    try {
      const payload = {
        ...form,
        log_file_name: attachedLog?.name || null,
        log_file_content: attachedLog?.content || null,
      };
      await createIncident(payload);
      setForm({ title: "", description: "", severity: "Medium" });
      setAttachedLog(null);
      setStatus("Security incident and attached evidence log successfully routed to SOC Analyst queue.");
    } catch (requestError) {
      setError(
        requestError?.response?.data?.detail || "Unable to submit incident report."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <AlertTriangle size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Report Security Incident
          </h1>
          <p className="text-xs text-slate-400">
            Notify the SOC operations team of suspicious AI behavior or policy concerns.
          </p>
        </div>
      </div>

      {/* Form Container */}
      <form
        onSubmit={submit}
        className="space-y-5 rounded-2xl border border-slate-800/80 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl"
      >
        {/* Title */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Incident Title
          </label>
          <input
            required
            minLength={3}
            maxLength={200}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Model generated unverified confidential credentials"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-500"
          />
        </div>

        {/* Severity */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Severity Level
          </label>
          <select
            value={form.severity}
            onChange={(e) => setForm({ ...form, severity: e.target.value })}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-500"
          >
            <option value="Low">Low - Informational or minor observation</option>
            <option value="Medium">Medium - Unexpected output or policy warning</option>
            <option value="High">High - Prompt injection or suspected data leakage</option>
            <option value="Critical">Critical - Active security vulnerability or exploit</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Detailed Observation
          </label>
          <textarea
            required
            minLength={10}
            rows={5}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe what occurred, prompt input details, abnormal output, and any affected resources..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-500"
          />
        </div>

        {/* Upload Logs / Evidence File */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Upload Logs / Evidence File <span className="text-slate-500 lowercase font-normal">(optional)</span>
          </label>

          {!attachedLog ? (
            <div
              onClick={() => logInputRef.current?.click()}
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-950/60 p-4 transition hover:border-cyan-500/60 hover:bg-slate-950"
            >
              <input
                type="file"
                ref={logInputRef}
                onChange={handleFileChange}
                accept=".log,.txt,.json,.csv,.md"
                className="hidden"
              />
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <UploadCloud size={18} className="text-cyan-400" />
                <span>Click to upload incident logs or threat evidence file</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                Supports .log, .txt, .json, .csv (Up to 5MB)
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-xl border border-cyan-500/30 bg-cyan-950/20 px-3.5 py-2.5 text-xs text-cyan-200">
              <div className="flex items-center gap-2.5 truncate">
                <FileText size={16} className="shrink-0 text-cyan-400" />
                <div className="truncate">
                  <p className="truncate font-mono font-semibold text-white">{attachedLog.name}</p>
                  <p className="text-[10px] text-slate-400">{attachedLog.size}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAttachedLog(null)}
                className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                title="Remove log file"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
            {error}
          </div>
        )}

        {status && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
            <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
            <span>{status}</span>
          </div>
        )}

        {/* Submit Action */}
        <div className="flex items-center justify-between border-t border-slate-800/80 pt-4">
          <p className="text-[11px] text-slate-500">
            Submitted incidents immediately appear in the SOC Analyst Triage Queue.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-500/20 transition hover:brightness-110 disabled:opacity-50"
          >
            <Send size={14} />
            <span>{loading ? "Submitting..." : "Submit Incident"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}