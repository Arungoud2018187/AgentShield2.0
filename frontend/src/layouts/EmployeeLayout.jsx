import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  MessageSquare,
  AlertTriangle,
  Bell,
  User,
  LogOut,
  Shield,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const employeeNav = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/employee",
    exact: true,
  },
  {
    title: "AI Assistant",
    icon: MessageSquare,
    path: "/employee/chat",
  },
  {
    title: "Report Incident",
    icon: AlertTriangle,
    path: "/employee/report-incident",
  },
  {
    title: "Notifications",
    icon: Bell,
    path: "/employee/notifications",
  },
  {
    title: "Profile",
    icon: User,
    path: "/employee/profile",
  },
];

export default function EmployeeLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen overflow-hidden bg-[#070c1b]">
      {/* Employee Sidebar */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-[260px]"
        } sticky top-0 flex h-screen shrink-0 flex-col border-r border-slate-800/80 bg-[#0d1527] transition-all duration-300`}
      >
        {/* Brand Header */}
        <div className="flex h-[70px] items-center justify-between border-b border-slate-800/80 px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md shadow-emerald-500/20">
              <Shield className="text-white" size={22} />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white">AgentShield</h1>
                <p className="text-[11px] font-medium text-emerald-400">Employee Workspace</p>
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

        {/* Role Badge */}
        {!collapsed && (
          <div className="mx-4 my-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                Employee Portal
              </span>
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="mt-0.5 text-[11px] text-slate-400">Secure AI Productivity Surface</p>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5 px-3 py-3 overflow-y-auto">
          {employeeNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-500/25 to-teal-600/20 text-emerald-300 border border-emerald-500/40 shadow-sm"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                  }`
                }
              >
                <Icon size={20} className="shrink-0 transition group-hover:scale-110" />
                {!collapsed && <span>{item.title}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="border-t border-slate-800/80 p-3">
          <div className="mb-2 rounded-xl bg-slate-900/80 p-3 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-sm">
                {user?.full_name?.charAt(0)?.toUpperCase() || "E"}
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
        {/* Employee Portal Header */}
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-slate-800/80 bg-[#0d1527]/90 px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
              <ShieldCheck size={15} />
              AI Guardrails Active
            </div>
            <span className="hidden text-xs text-slate-400 md:inline">
              Jailbreak & Prompt Injection Protections Engaged
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/employee/chat")}
              className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-500/20 transition hover:opacity-95"
            >
              <MessageSquare size={14} /> Launch AI Assistant
            </button>
            <div className="text-right">
              <p className="text-xs font-semibold text-white">{user?.full_name}</p>
              <p className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">Employee</p>
            </div>
          </div>
        </header>

        {/* Page Outlet */}
        <main className="flex-1 overflow-y-auto bg-[#070c1b] p-5 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
