import { useState } from "react";
import { AlertTriangle, Send, ShieldAlert, CheckCircle2 } from "lucide-react";
import { createIncident } from "../../api/incidentApi";

export default function ReportIncident() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    severity: "Medium",
  });
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setStatus("");
    try {
      await createIncident(form);
      setForm({ title: "", description: "", severity: "Medium" });
      setStatus("Security incident successfully logged and routed to SOC Analyst queue.");
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