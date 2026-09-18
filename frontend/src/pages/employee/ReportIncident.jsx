import { useState } from "react";
import { AlertTriangle, Send } from "lucide-react";
import { createIncident } from "../../api/incidentApi";

export default function ReportIncident() {
    const [form, setForm] = useState({ title: "", description: "", severity: "Medium" });
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
            setStatus("Incident submitted successfully.");
        } catch (requestError) {
            setError(requestError?.response?.data?.detail || "Unable to submit incident.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-3xl space-y-8">
            <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-orange-500/15 p-4"><AlertTriangle className="text-orange-400" size={32} /></div>
                <div>
                    <h1 className="text-3xl font-bold text-white">Report Incident</h1>
                    <p className="mt-2 text-slate-400">Send a security concern to the operations team.</p>
                </div>
            </div>
            <form onSubmit={submit} className="space-y-5 rounded-xl border border-slate-800 bg-[#111a2b] p-5 sm:p-6">
                <input required minLength={3} maxLength={200} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Incident title" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500" />
                <select value={form.severity} onChange={(event) => setForm({ ...form, severity: event.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500">
                    <option>Low</option><option>Medium</option><option>High</option><option>Critical</option>
                </select>
                <textarea required minLength={10} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Describe what happened, when it happened, and any affected systems." rows={7} className="w-full resize-y rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500" />
                {error && <p className="rounded-xl bg-red-500/10 p-3 text-red-300">{error}</p>}
                {status && <p className="rounded-xl bg-emerald-500/10 p-3 text-emerald-300">{status}</p>}
                <button disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-50"><Send size={18} />{loading ? "Submitting..." : "Submit incident"}</button>
            </form>
        </div>
    );
}