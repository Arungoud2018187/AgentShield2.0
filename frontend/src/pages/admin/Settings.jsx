import {
  Bot,
  Bell,
  Building2,
  Database,
  KeyRound,
  Palette,
  Save,
  Shield,
} from "lucide-react";

const Card = ({ title, icon: Icon, children }) => (
  <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-lg">
    <div className="mb-5 flex items-center gap-3">
      <div className="rounded-lg bg-cyan-500/10 p-2">
        <Icon className="h-5 w-5 text-cyan-400" />
      </div>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
    </div>
    {children}
  </div>
);

const Input = ({ label, value, type = "text" }) => (
  <div>
    <label className="mb-2 block text-sm text-slate-400">{label}</label>
    <input
      type={type}
      defaultValue={value}
      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
    />
  </div>
);

const Toggle = ({ label, enabled = true }) => (
  <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 px-4 py-3">
    <span className="text-slate-300">{label}</span>

    <button
      className={`relative h-6 w-11 rounded-full transition ${
        enabled ? "bg-cyan-500" : "bg-slate-700"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
          enabled ? "left-5" : "left-0.5"
        }`}
      />
    </button>
  </div>
);

export default function Settings() {
  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold text-white">
          System Settings
        </h1>

        <p className="mt-2 text-slate-400">
          Configure AgentShield platform, AI engine and enterprise security.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">

        <Card title="Organization" icon={Building2}>
          <div className="space-y-4">
            <Input
              label="Organization Name"
              value="AgentShield Enterprise"
            />

            <Input
              label="Administrator Email"
              value="admin@agentshield.com"
            />

            <Input
              label="Timezone"
              value="Asia/Kolkata"
            />
          </div>
        </Card>

        <Card title="AI Configuration" icon={Bot}>
          <div className="space-y-4">

            <Input
              label="Ollama Endpoint"
              value="http://localhost:11434"
            />

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                AI Model
              </label>

              <select className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white">
                <option>qwen3:8b</option>
                <option>llama3</option>
                <option>mistral</option>
                <option>gemma</option>
              </select>
            </div>

          </div>
        </Card>

        <Card title="Security" icon={Shield}>
          <div className="space-y-3">
            <Toggle label="Prompt Injection Detection" />
            <Toggle label="Jailbreak Detection" />
            <Toggle label="Sensitive Data Protection" />
            <Toggle label="Audit Logging" />
          </div>
        </Card>

        <Card title="Authentication" icon={KeyRound}>
          <div className="space-y-4">
            <Input
              label="JWT Expiry (Minutes)"
              value="60"
            />

            <Input
              label="Minimum Password Length"
              value="8"
            />

            <Toggle label="Enable Multi-Factor Authentication" enabled={false}/>
          </div>
        </Card>

        <Card title="Database Status" icon={Database}>
          <div className="space-y-4">

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
              <p className="text-sm text-slate-400">Database</p>
              <h3 className="text-xl font-semibold text-emerald-400">
                PostgreSQL Connected
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">

              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-sm text-slate-500">
                  Response Time
                </p>

                <h2 className="mt-2 text-2xl font-bold text-white">
                  18 ms
                </h2>
              </div>

              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-sm text-slate-500">
                  Status
                </p>

                <h2 className="mt-2 text-2xl font-bold text-emerald-400">
                  Healthy
                </h2>
              </div>

            </div>

          </div>
        </Card>

        <Card title="Appearance" icon={Palette}>
          <div className="space-y-4">

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Theme
              </label>

              <select className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white">
                <option>Dark</option>
                <option>Light</option>
                <option>System</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Accent Color
              </label>

              <div className="flex gap-4">

                <div className="h-8 w-8 rounded-full bg-cyan-500"></div>

                <div className="h-8 w-8 rounded-full bg-violet-500"></div>

                <div className="h-8 w-8 rounded-full bg-emerald-500"></div>

                <div className="h-8 w-8 rounded-full bg-red-500"></div>

              </div>
            </div>

          </div>
        </Card>

        <Card title="Notifications" icon={Bell}>
          <div className="space-y-3">
            <Toggle label="Email Alerts" />
            <Toggle label="Slack Notifications" enabled={false}/>
            <Toggle label="Webhook Alerts" />
          </div>
        </Card>

      </div>

      <div className="flex justify-end gap-4">

        <button className="rounded-xl border border-slate-700 px-6 py-3 text-white transition hover:bg-slate-800">
          Test Connection
        </button>

        <button className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black transition hover:bg-cyan-400">
          <Save size={18} />
          Save Settings
        </button>

      </div>

    </div>
  );
}