import {
  Shield,
  Bell,
  Moon,
  Lock,
  Save,
  Smartphone,
} from "lucide-react";

import { useState } from "react";

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [mfa, setMfa] = useState(true);
  const [saved, setSaved] = useState(false);

  const saveSettings = () => {
    localStorage.setItem("agentshield_preferences", JSON.stringify({ notifications, darkMode, mfa }));
    setSaved(true);
  };

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="rounded-xl border border-slate-800 bg-[#111a2b] p-5">

        <h1 className="text-3xl font-bold text-white">
          Settings
        </h1>

        <p className="mt-2 text-slate-300">
          Manage your account preferences and enterprise security settings.
        </p>

      </div>

      {/* Preferences */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">

        <h2 className="mb-8 text-2xl font-bold text-white">
          Preferences
        </h2>

        <div className="space-y-6">

          <div className="flex items-center justify-between rounded-xl bg-slate-800 p-5">
            <div className="flex items-center gap-4">
              <Bell className="text-cyan-400" />
              <div>
                <h3 className="text-white font-semibold">
                  Email Notifications
                </h3>
                <p className="text-slate-400 text-sm">
                  Receive enterprise security alerts.
                </p>
              </div>
            </div>

            <input
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
              className="h-5 w-5"
            />
          </div>

          <div className="flex items-center justify-between rounded-xl bg-slate-800 p-5">
            <div className="flex items-center gap-4">
              <Moon className="text-cyan-400" />
              <div>
                <h3 className="text-white font-semibold">
                  Dark Theme
                </h3>
                <p className="text-slate-400 text-sm">
                  Use dark appearance.
                </p>
              </div>
            </div>

            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              className="h-5 w-5"
            />
          </div>

        </div>

      </div>

      {/* Security */}

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">

        <h2 className="mb-8 text-2xl font-bold text-white">
          Security
        </h2>

        <div className="space-y-6">

          <div className="flex items-center justify-between rounded-xl bg-slate-800 p-5">

            <div className="flex items-center gap-4">

              <Shield className="text-green-400" />

              <div>

                <h3 className="font-semibold text-white">
                  Multi-Factor Authentication
                </h3>

                <p className="text-sm text-slate-400">
                  Protect your account with MFA.
                </p>

              </div>

            </div>

            <input
              type="checkbox"
              checked={mfa}
              onChange={() => setMfa(!mfa)}
              className="h-5 w-5"
            />

          </div>

          <div className="rounded-xl bg-slate-800 p-5">

            <div className="flex items-center gap-4">

              <Smartphone className="text-cyan-400" />

              <div>

                <h3 className="font-semibold text-white">
                  Registered Device
                </h3>

                <p className="text-sm text-slate-400">
                  Fedora Linux • Last Active Today
                </p>

              </div>

            </div>

          </div>

          <div className="rounded-xl bg-slate-800 p-5">

            <div className="flex items-center gap-4">

              <Lock className="text-red-400" />

              <div>

                <h3 className="font-semibold text-white">
                  Active Sessions
                </h3>

                <p className="text-sm text-slate-400">
                  1 Active Session
                </p>

              </div>

            </div>

          </div>

        </div>

        <button onClick={saveSettings} className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-white transition hover:bg-cyan-600">

          <Save size={18} />

          Save Settings

        </button>

        {saved && <p className="mt-3 text-sm text-emerald-400">Preferences saved for this browser.</p>}

      </div>

    </div>
  );
}