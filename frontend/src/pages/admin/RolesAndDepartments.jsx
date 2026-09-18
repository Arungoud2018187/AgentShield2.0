import { useEffect, useState } from "react";
import { Building2, Shield, Users, RefreshCw } from "lucide-react";
import api from "../../api/axios";

export default function RolesAndDepartments() {
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [rolesRes, deptsRes] = await Promise.all([
        api.get("/api/dashboard/roles"),
        api.get("/api/dashboard/departments"),
      ]);
      setRoles(rolesRes.data);
      setDepartments(deptsRes.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load organization hierarchy.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Roles & Departments
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Enterprise structure, access roles, and department distribution from PostgreSQL.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-medium text-slate-300 transition hover:border-cyan-500 hover:text-white"
        >
          <RefreshCw size={15} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Roles Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl backdrop-blur-xl">
            <div className="flex items-center gap-3 border-b border-slate-800 bg-slate-950/60 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                <Shield size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">System Roles</h2>
                <p className="text-xs text-slate-400">Configured platform access tiers</p>
              </div>
            </div>

            <div className="divide-y divide-slate-800">
              {roles.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-4 transition hover:bg-slate-800/40">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-xs font-mono text-slate-400">
                      #{r.id}
                    </span>
                    <div>
                      <p className="font-semibold text-white">{r.role_name}</p>
                      <p className="text-xs text-slate-400">
                        {r.role_name === "ADMIN" && "Full administrative control and user governance"}
                        {r.role_name === "ANALYST" && "SOC threat triage, events, and Security Copilot"}
                        {r.role_name === "EMPLOYEE" && "Standard AI chat and security incident submission"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                    <Users size={13} />
                    {r.user_count} {r.user_count === 1 ? "user" : "users"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Departments Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl backdrop-blur-xl">
            <div className="flex items-center gap-3 border-b border-slate-800 bg-slate-950/60 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                <Building2 size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Departments</h2>
                <p className="text-xs text-slate-400">Organizational operational divisions</p>
              </div>
            </div>

            <div className="divide-y divide-slate-800">
              {departments.map((d) => (
                <div key={d.id} className="flex items-center justify-between p-4 transition hover:bg-slate-800/40">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-xs font-mono text-slate-400">
                      #{d.id}
                    </span>
                    <div>
                      <p className="font-semibold text-white">{d.department_name}</p>
                      <p className="text-xs text-slate-400">Corporate organizational unit</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-300">
                    <Users size={13} />
                    {d.user_count} {d.user_count === 1 ? "user" : "users"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
