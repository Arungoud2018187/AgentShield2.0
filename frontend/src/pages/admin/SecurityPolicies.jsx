import { useState } from "react";
import { Shield, ShieldAlert, CheckCircle2, Lock, Save, Sparkles, Cpu } from "lucide-react";

const initialPolicies = [
  {
    id: "jailbreak",
    name: "Jailbreak Detection Filter",
    agent: "JailbreakAgent",
    category: "Input Defense",
    description: "Scans incoming prompts against forbidden instruction override patterns, developer bypass tags, and role manipulation strings.",
    enforced: true,
    severity: "CRITICAL",
  },
  {
    id: "injection",
    name: "Prompt Injection Protection",
    agent: "PromptInjectionAgent",
    category: "Input Defense",
    description: "Evaluates token sequences for hidden instruction hijacking, policy overrides, internal reasoning extraction, and secret exfiltration.",
    enforced: true,
    severity: "HIGH",
  },
  {
    id: "output",
    name: "Output Validation Guardrail",
    agent: "OutputValidationAgent",
    category: "Output Guardrail",
    description: "Validates all LLM responses prior to transmission to user endpoints to ensure model compliance and prevent reflected jailbreaks.",
    enforced: true,
    severity: "HIGH",
  },
  {
    id: "rbac_enforcement",
    name: "Role Authorization Guard",
    agent: "AgentShield RBAC Engine",
    category: "Access Control",
    description: "Enforces strict database-verified role matching at login and denies unauthorized API access with HTTP 403 Forbidden.",
    enforced: true,
    severity: "CRITICAL",
  },
  {
    id: "audit_logging",
    name: "Immutable Prompt & Audit Logging",
    agent: "LoggingService",
    category: "Audit & Compliance",
    description: "Persists verified interactions to prompt_logs, policy violations to security_events, and admin activities to audit_logs.",
    enforced: true,
    severity: "MEDIUM",
  },
];

export default function SecurityPolicies() {
  const [policies, setPolicies] = useState(initialPolicies);
  const [savedMessage, setSavedMessage] = useState("");

  const togglePolicy = (id) => {
    setPolicies((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enforced: !p.enforced } : p))
    );
  };

  const handleSave = () => {
    setSavedMessage("Security policy rules successfully saved and active.");
    setTimeout(() => setSavedMessage(""), 4000);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Security Policies
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Define active guardrail thresholds, defense agents, and access control policies for AgentShield.
          </p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-105"
        >
          <Save size={16} /> Save Policies
        </button>
      </div>

      {savedMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300">
          <CheckCircle2 size={18} />
          {savedMessage}
        </div>
      )}

      {/* Policies List */}
      <div className="space-y-4">
        {policies.map((p) => (
          <div
            key={p.id}
            className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl backdrop-blur-xl sm:flex-row sm:items-center"
          >
            <div className="flex items-start gap-4">
              <div
                className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                  p.enforced
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-slate-800 text-slate-500"
                }`}
              >
                {p.enforced ? <Shield size={22} /> : <Lock size={22} />}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="text-base font-bold text-white">{p.name}</h3>
                  <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[11px] font-mono text-cyan-300">
                    {p.agent}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      p.severity === "CRITICAL"
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}
                  >
                    {p.severity}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-slate-400">{p.description}</p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-4 self-end sm:self-center">
              <span
                className={`text-xs font-semibold uppercase tracking-wider ${
                  p.enforced ? "text-emerald-400" : "text-slate-500"
                }`}
              >
                {p.enforced ? "Active" : "Disabled"}
              </span>
              <button
                type="button"
                onClick={() => togglePolicy(p.id)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  p.enforced ? "bg-cyan-500" : "bg-slate-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    p.enforced ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
