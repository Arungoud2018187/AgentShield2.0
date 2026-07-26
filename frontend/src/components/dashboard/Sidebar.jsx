import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Shield,
  Bot,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin",
  },
  {
    title: "Users",
    icon: Users,
    path: "/admin/users",
  },
  {
    title: "AI Chat",
    icon: MessageSquare,
    path: "/admin/chat",
  },
  {
    title: "Security",
    icon: Shield,
    path: "/admin/security",
  },
  {
    title: "Security Copilot",
    icon: Bot,
    path: "/admin/security-copilot",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    path: "/admin/analytics",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/admin/settings",
  },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`${
        collapsed ? "w-24" : "w-72"
      } h-screen transition-all duration-300 bg-[#08111f] border-r border-slate-800 flex flex-col`}
    >
      {/* Logo */}
      <div className="h-20 border-b border-slate-800 flex items-center justify-between px-6">

        <div className="flex items-center gap-3">

          <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center">

            <Shield className="text-white" size={24} />

          </div>

          {!collapsed && (
            <div>

              <h1 className="font-bold text-white text-xl">

                AgentShield

              </h1>

              <p className="text-xs text-slate-400">

                Enterprise AI SOC

              </p>

            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-white"
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>

      </div>

      {/* Navigation */}

      <div className="flex-1 px-4 py-6 space-y-2">

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.title}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `group flex items-center gap-4 rounded-xl px-4 py-4 transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={22} />

              {!collapsed && (
                <span className="font-medium">

                  {item.title}

                </span>
              )}
            </NavLink>
          );
        })}
      </div>
            {/* Bottom */}

      <div className="border-t border-slate-800 p-4">

        {/* Profile */}

        <div className="mb-4 flex items-center gap-3 rounded-xl bg-slate-900 p-3">

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-lg font-bold text-white">

            A

          </div>

          {!collapsed && (
            <div className="flex-1">

              <h3 className="font-semibold text-white">

                Arun Goud

              </h3>

              <p className="text-xs text-slate-400">

                Security Analyst

              </p>

            </div>
          )}
        </div>

        {/* Logout */}

        <button
          className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-red-400 transition-all duration-200 hover:bg-red-500/10"
        >
          <LogOut size={20} />

          {!collapsed && (
            <span className="font-medium">

              Logout

            </span>
          )}
        </button>

      </div>

    </aside>
  );
}
