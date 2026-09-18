import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Sparkles,
  ShieldAlert,
  Activity,
  AlertOctagon,
  BarChart3,
  Cpu,
  FileText,
  User,
  LogOut,
  Shield,
  Radio,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const socNav = [
  {
    title: "SOC Dashboard",
    icon: LayoutDashboard,
    path: "/soc",
    exact: true,
  },
  {
    title: "Security Copilot",
    icon: Sparkles,
    path: "/soc/security-copilot",
    highlight: true,
  },
  {
    title: "Security Events",
    icon: ShieldAlert,
    path: "/soc/events",
  },
  {
    title: "Threat Monitoring",
    icon: Activity,
    path: "/soc/threats",
  },
  {
    title: "Incidents",
    icon: AlertOctagon,
    path: "/soc/incidents",
  },
  {
    title: "Analytics & Telemetry",
    icon: BarChart3,
    path: "/soc/analytics",
  },
  {
    title: "Agent Monitoring",
    icon: Cpu,
    path: "/soc/agents",
  },
  {
    title: "Audit Logs",
    icon: FileText,
    path: "/soc/audit-logs",
  },
  {
    title: "Analyst Profile",
    icon: User,
    path: "/soc/profile",
  },
];

export default function SocLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen overflow-hidden bg-[#060a17]">
      {/* SOC Sidebar */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-[265px]"
        } sticky top-0 flex h-screen shrink-0 flex-col border-r border-violet-900/40 bg-[#0a1024] transition-all duration-300`}
      >
        {/* Brand Header */}
        <div className="flex h-[70px] items-center justify-between border-b border-violet-950 px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-700 shadow-md shadow-violet-600/30">
              <Shield className="text-white" size={22} />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white">AgentShield</h1>
                <p className="text-[11px] font-semibold text-violet-400">SOC Operations</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Role & Telemetry Status Banner */}
        {!collapsed && (
          <div className="mx-4 my-3 rounded-lg border border-violet-500/30 bg-violet-950/40 px-3 py-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-violet-300">
                SOC Analyst Portal
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live
              </span>
            </div>
            <p className="mt-0.5 text-[11px] text-slate-400">Real-time AI Threat Defense</p>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5 px-3 py-3 overflow-y-auto">
          {socNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-violet-600/30 to-cyan-600/20 text-violet-300 border border-violet-500/40 shadow-sm"
                      : item.highlight
                      ? "text-cyan-300 bg-cyan-950/30 border border-cyan-500/20 hover:border-cyan-500/40"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                  }`
                }
              >
                <Icon
                  size={20}
                  className={`shrink-0 transition group-hover:scale-110 ${
                    item.highlight ? "text-cyan-400" : ""
                  }`}
                />
                {!collapsed && (
                  <div className="flex flex-1 items-center justify-between">
                    <span>{item.title}</span>
                    {item.highlight && (
                      <span className="rounded bg-cyan-500/20 px-1.5 py-0.5 text-[10px] font-bold text-cyan-300">
                        AI
                      </span>
                    )}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="border-t border-violet-950 p-3">
          <div className="mb-2 rounded-xl bg-slate-900/80 p-3 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-600/20 text-violet-300 font-bold text-sm">
                {user?.full_name?.charAt(0)?.toUpperCase() || "S"}
              </div>
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-white">{user?.full_name}</p>
                  <p className="truncate text-[11px] text-slate-400">{user?.employee_id || user?.email}</p>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut size={16} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* SOC Portal Header */}
        <header className="sticky top-0 z-40 flex min-h-[70px] items-center justify-between border-b border-violet-950 bg-[#0a1024]/90 px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
              <Radio size={13} className="text-violet-400 animate-pulse" /> SOC Telemetry Active
            </div>
            <div className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
              <Cpu size={13} /> 3 Pipeline Agents Online
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/soc/security-copilot")}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-violet-600/30 transition hover:opacity-95"
            >
              <Sparkles size={14} /> Open Security Copilot
            </button>
            <div className="text-right">
              <p className="text-xs font-semibold text-white">{user?.full_name}</p>
              <p className="text-[10px] uppercase tracking-wider text-violet-400 font-bold">SOC Analyst</p>
            </div>
          </div>
        </header>

        {/* Page Outlet */}
        <main className="flex-1 overflow-y-auto bg-[#060a17] p-5 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
