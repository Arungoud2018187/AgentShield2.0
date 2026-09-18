import { useState } from "react";
import {
  Bell,
  Bot,
  Building2,
  Database,
  KeyRound,
  Palette,
  Save,
  Shield,
} from "lucide-react";

const Panel = ({ title, icon: Icon, children }) => (
  <section className="rounded-xl border border-slate-700 bg-[#111a2b] p-4 shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
    <div className="mb-3 flex items-center gap-2 border-b border-slate-700 pb-2">
      <Icon size={17} className="text-cyan-400" />
      <h2 className="text-base font-bold text-slate-100">{title}</h2>
    </div>
    {children}
  </section>
);

const Field = ({ label, value, type = "text" }) => (
  <label className="block">
    <span className="mb-1 block text-xs text-slate-400">{label}</span>
    <input type={type} defaultValue={value} className="w-full rounded-lg border border-slate-600 bg-[#0a1120] px-2.5 py-1.5 text-sm text-slate-100 outline-none focus:border-cyan-400" />
  </label>
);

function Toggle({ label, initial = true }) {
  const [active, setActive] = useState(initial);
  return (
    <button type="button" onClick={() => setActive(!active)} className="flex w-full items-center justify-between border-b border-slate-700 py-1.5 text-left last:border-0">
      <span className="text-sm text-slate-300">{label}</span>
      <span className={`relative h-5 w-9 rounded-full transition ${active ? "bg-cyan-500" : "bg-slate-600"}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${active ? "left-[18px]" : "left-0.5"}`} />
      </span>
    </button>
  );
}

export default function Settings() {
  const [message, setMessage] = useState("");
  const save = () => setMessage("Settings saved for this session.");
  const test = () => setMessage("Connection test completed successfully.");

  return (
    <div className="space-y-4 text-slate-100">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white">System Settings</h1>
        <p className="mt-1 text-sm text-slate-400">Configure AgentShield platform, AI engine and enterprise security.</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="space-y-4">
          <Panel title="Organization Settings" icon={Building2}>
            <div className="space-y-2"><Field label="Organization Name" value="AgentShield Enterprise" /><Field label="Administrator Email" value="admin@agentshield.com" type="email" /><Field label="Timezone" value="Asia/Kolkata" /></div>
          </Panel>
          <Panel title="Security Policy Enforcement" icon={Shield}>
            <div><Toggle label="Block Prompt Injection" /><Toggle label="Jailbreak Detection" /><Toggle label="Output Validation Filter" /><Toggle label="Prompt & Telemetry Logging" /></div>
          </Panel>
          <Panel title="Database Status" icon={Database}>
            <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/10 p-3"><p className="text-xs text-slate-400">Database</p><strong className="text-emerald-400">PostgreSQL Connected</strong></div><div className="mt-2 grid grid-cols-2 gap-2"><div className="rounded-lg bg-[#0a1120] p-2"><p className="text-xs text-slate-400">Response Time</p><strong>18 ms</strong></div><div className="rounded-lg bg-[#0a1120] p-2"><p className="text-xs text-slate-400">Status</p><strong className="text-emerald-400">Healthy</strong></div></div>
          </Panel>
          <Panel title="Notifications" icon={Bell}><Toggle label="Email Alerts" /><Toggle label="Slack Notifications" initial={false} /><Toggle label="Webhook Alerts" /></Panel>
        </div>

        <div className="space-y-4">
          <Panel title="AI Engine Configuration" icon={Bot}><div className="space-y-2"><Field label="AI Provider Endpoint" value="https://openrouter.ai/api/v1" /><label className="block"><span className="mb-1 block text-xs text-slate-400">AI Model</span><select defaultValue="openrouter/free" className="w-full rounded-lg border border-slate-600 bg-[#0a1120] px-2.5 py-1.5 text-sm text-slate-100"><option>openrouter/free</option><option>mistralai/mistral-7b-instruct:free</option><option>meta-llama/llama-3.3-70b-instruct:free</option></select></label></div></Panel>
          <Panel title="Authentication Settings" icon={KeyRound}><div className="space-y-2"><Field label="JWT Expiry (Minutes)" value="60" type="number" /><Field label="Minimum Password Length" value="8" type="number" /><Toggle label="Enable Multi-Factor Authentication" initial={false} /></div></Panel>
          <Panel title="Appearance" icon={Palette}><label className="block"><span className="mb-1 block text-xs text-slate-400">Theme</span><select defaultValue="Dark" className="w-full rounded-lg border border-slate-600 bg-[#0a1120] px-2.5 py-1.5 text-sm text-slate-100"><option>Dark</option><option>Light</option><option>System</option></select></label><div className="mt-3"><span className="block text-xs text-slate-400">Accent Color</span><div className="mt-2 flex gap-3"><span className="h-7 w-7 rounded-full bg-cyan-500 ring-2 ring-cyan-300/30" /><span className="h-7 w-7 rounded-full bg-violet-500" /><span className="h-7 w-7 rounded-full bg-emerald-500" /><span className="h-7 w-7 rounded-full bg-red-500" /></div></div></Panel>
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-3"><button onClick={test} className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-200 hover:border-cyan-400">Test Connection</button><button onClick={save} className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-cyan-400"><Save size={16} /> Save Settings</button></div>
      {message && <p className="text-right text-sm text-emerald-400">{message}</p>}
    </div>
  );
}
