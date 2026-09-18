import {
  User,
  Mail,
  Building2,
  Shield,
  Calendar,
  KeyRound,
  Save,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="rounded-xl border border-slate-800 bg-[#111a2b] p-5">

        <h1 className="text-3xl font-bold text-white">
          My Profile
        </h1>

        <p className="mt-2 text-slate-300">
          Manage your enterprise account information and security settings.
        </p>

      </div>

      <div className="grid gap-5 lg:grid-cols-3">

        {/* Left Card */}

        <div className="rounded-xl border border-slate-800 bg-[#111a2b] p-5">

          <div className="flex flex-col items-center">

            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-5xl font-bold text-white">

              {user?.full_name?.charAt(0)}

            </div>

            <h2 className="mt-6 text-2xl font-bold text-white">

              {user?.full_name}

            </h2>

            <p className="mt-2 rounded-full bg-cyan-500/20 px-4 py-2 text-sm font-semibold uppercase text-cyan-300">

              {user?.role}

            </p>

          </div>

        </div>

        {/* Right */}

        <div className="xl:col-span-2">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">

            <h2 className="mb-8 text-2xl font-bold text-white">
              Account Information
            </h2>

            <div className="grid gap-6 md:grid-cols-2">

              <div>
                <label className="mb-2 flex items-center gap-2 text-slate-400">
                  <User size={18} />
                  Full Name
                </label>

                <input
                  value={user?.full_name || ""}
                  readOnly
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-slate-400">
                  <Mail size={18} />
                  Email
                </label>

                <input
                  value={user?.email || ""}
                  readOnly
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-slate-400">
                  <Shield size={18} />
                  Role
                </label>

                <input
                  value={user?.role || ""}
                  readOnly
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-slate-400">
                  <Building2 size={18} />
                  Department
                </label>

                <input
                  value="Security Operations"
                  readOnly
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white"
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-slate-400">
                  <Calendar size={18} />
                  Employee ID
                </label>

                <input
                  value={user?.employee_id || ""}
                  readOnly
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white"
                />
              </div>

            </div>

          </div>

          {/* Password */}

          <div className="mt-5 rounded-xl border border-slate-800 bg-[#111a2b] p-5">

            <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-white">

              <KeyRound />

              Change Password

            </h2>

            <div className="grid gap-6">

              <input
                type="password"
                placeholder="Current Password"
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white"
              />

              <input
                type="password"
                placeholder="New Password"
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white"
              />

              <input
                type="password"
                placeholder="Confirm Password"
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white"
              />

              <button className="inline-flex w-fit items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-white transition hover:bg-cyan-600">

                <Save size={18} />

                Update Password

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}