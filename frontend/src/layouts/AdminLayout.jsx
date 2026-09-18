import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  ShieldCheck,
  FileText,
  Settings,
  Bell,
  User,
  LogOut,
  Shield,
  Database,
  Cpu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const adminNav = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin",
    exact: true,
  },
  {
    title: "User Management",
    icon: Users,
    path: "/admin/users",
  },
  {
    title: "Roles & Departments",
    icon: Building2,
    path: "/admin/roles-departments",
  },
  {
    title: "Security Policies",
    icon: ShieldCheck,
    path: "/admin/policies",
  },
  {
    title: "Audit Logs",
    icon: FileText,
    path: "/admin/audit-logs",
  },
  {
    title: "System Settings",
    icon: Settings,
    path: "/admin/settings",
  },
  {
    title: "Notifications",
    icon: Bell,
    path: "/admin/notifications",
  },
  {
    title: "Profile",
    icon: User,
    path: "/admin/profile",
  },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen overflow-hidden bg-[#070c1b]">
      {/* Admin Sidebar */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-[260px]"
        } sticky top-0 flex h-screen shrink-0 flex-col border-r border-slate-800/80 bg-[#0d1629] transition-all duration-300`}
      >
        {/* Brand Header */}
        <div className="flex h-[70px] items-center justify-between border-b border-slate-800/80 px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-md shadow-cyan-500/20">
              <Shield className="text-white" size={22} />
            </div>
            {!collapsed && (
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white">AgentShield</h1>
                <p className="text-[11px] font-medium text-cyan-400">Admin Console</p>
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
          <div className="mx-4 my-3 rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
                Administrator
              </span>
              <span className="rounded bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-bold text-cyan-300">
                Tier-1
              </span>
            </div>
            <p className="mt-0.5 text-[11px] text-slate-400">Organization & Access Governance</p>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5 px-3 py-3 overflow-y-auto">
          {adminNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500/25 to-blue-600/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
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
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-300 font-bold text-sm">
                {user?.full_name?.charAt(0)?.toUpperCase() || "A"}
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
        {/* Admin Portal Header */}
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-slate-800/80 bg-[#0d1629]/90 px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
              <Database size={13} /> PostgreSQL Connected
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
              <Cpu size={13} /> OpenRouter AI Engine
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/users")}
              className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-cyan-500 hover:text-white"
            >
              <Users size={14} /> Manage Users
            </button>
            <div className="text-right">
              <p className="text-xs font-semibold text-white">{user?.full_name}</p>
              <p className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold">Administrator</p>
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
