import { useEffect, useState } from "react";
import {
  AlertOctagon,
  Clock,
  User,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Download,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getIncidents, downloadIncidentFile } from "../../api/incidentApi";

export default function Incidents() {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadingId, setDownloadingId] = useState(null);

  const loadIncidents = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getIncidents();
      setIncidents(data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load incidents list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const investigateWithCopilot = (incidentId) => {
    navigate(`/soc/security-copilot?incidentId=${incidentId}`);
  };

  const handleDownload = async (inc) => {
    setDownloadingId(inc.id);
    try {
      const blob = await downloadIncidentFile(inc.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `AgentShield-Incident-INC-${String(inc.id).padStart(4, "0")}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.warn("API download failed, fallback to client-side json creation:", err);
      const payloadData = {
        report_metadata: {
          system: "AgentShield AI Security Platform",
          schema: "AgentShield-Incident-Report-v1",
          exported_at: new Date().toISOString(),
          classification: "INTERNAL CONFIDENTIAL - SOC INCIDENT REPORT",
        },
        incident: {
          incident_id: `INC-${String(inc.id).padStart(4, "0")}`,
          id: inc.id,
          title: inc.title,
          severity: inc.severity,
          status: inc.status || "Open",
          created_at: inc.created_at,
          description: inc.description,
        },
        reporter: {
          full_name: inc.reporter_name || "Employee",
          employee_id: inc.reporter_employee_id || "EMP003",
          email: inc.reporter_email || "employee@agentshield.com",
          department: inc.reporter_department || "General",
        },
        soc_analyst_instructions: {
          next_steps:
            "Open or upload this file into AgentShield Security Copilot to execute automated threat vector analysis and containment.",
        },
      };
      const blob = new Blob([JSON.stringify(payloadData, null, 2)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `AgentShield-Incident-INC-${String(inc.id).padStart(4, "0")}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Incident Triage & Management
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Security incidents submitted by employees and flagged by automated defense triggers.
          </p>
        </div>
        <button
          onClick={loadIncidents}
          className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-medium text-slate-300 transition hover:border-violet-500 hover:text-white"
        >
          <RefreshCw size={14} /> Refresh Incidents
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
      ) : incidents.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-12 text-center text-slate-400">
          <CheckCircle2 size={40} className="mx-auto mb-3 text-emerald-400" />
          <p className="text-base font-semibold text-white">No Open Incidents</p>
          <p className="mt-1 text-xs text-slate-500">
            There are currently no unresolved employee-reported or automated security incidents.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {incidents.map((inc) => (
            <div
              key={inc.id}
              className="flex flex-col justify-between gap-5 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl transition hover:border-violet-500/40 lg:flex-row lg:items-center"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                  <AlertOctagon size={20} />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
                      INC-{String(inc.id).padStart(4, "0")}
                    </span>
                    <h3 className="text-base font-bold text-white">{inc.title}</h3>
                    <span
                      className={`rounded px-2.5 py-0.5 text-[10px] font-bold ${
                        inc.severity === "Critical"
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : inc.severity === "High"
                          ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {inc.severity}
                    </span>
                    <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-medium text-slate-300">
                      Status: {inc.status || "Open"}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-300 leading-relaxed max-w-3xl">
                    {inc.description}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px]">
                    <span className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-slate-300 font-medium">
                      <User size={12} className="text-violet-400" />
                      Reported by:{" "}
                      <strong className="text-white">
                        {inc.reporter_name || "Bhuvana"}
                      </strong>
                      {inc.reporter_employee_id && (
                        <span className="text-violet-300 font-mono">
                          ({inc.reporter_employee_id})
                        </span>
                      )}
                      {inc.reporter_department && (
                        <span className="text-slate-400">• {inc.reporter_department}</span>
                      )}
                    </span>

                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock size={12} />
                      {inc.created_at ? new Date(inc.created_at).toLocaleString() : "Recently"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-2.5">
                <button
                  onClick={() => handleDownload(inc)}
                  disabled={downloadingId === inc.id}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-xs font-semibold text-slate-300 shadow-sm transition hover:border-violet-500 hover:text-white"
                  title="Download Incident Report File (.json)"
                >
                  <Download size={14} className="text-cyan-400" />
                  <span>
                    {downloadingId === inc.id ? "Downloading..." : "Download Report File"}
                  </span>
                </button>

                <button
                  onClick={() => investigateWithCopilot(inc.id)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-violet-600/30 transition hover:opacity-95"
                >
                  <Sparkles size={14} />
                  <span>Analyze in Copilot</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
