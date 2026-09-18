import { NavLink, useNavigate } from "react-router-dom";
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
  Bell,
  User,
  FileText,
  AlertTriangle,
} from "lucide-react";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

/* =====================================
   ADMIN MENU
===================================== */

const adminMenu = [
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

/* =====================================
   SOC ANALYST MENU
===================================== */

const analystMenu = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/soc",
  },
  {
    title: "Security Copilot",
    icon: Bot,
    path: "/soc/security-copilot",
  },
  {
    title: "Security Center",
    icon: Shield,
    path: "/soc/security",
  },
  {
    title: "Incidents",
    icon: AlertTriangle,
    path: "/soc/incidents",
  },
  {
    title: "Analytics",
    icon: BarChart3,
    path: "/soc/reports",
  },
  {
    title: "AI Chat",
    icon: MessageSquare,
    path: "/soc/chat",
  },
];

/* =====================================
   EMPLOYEE MENU
===================================== */

const employeeMenu = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/employee",
  },
  {
    title: "AI Chat",
    icon: MessageSquare,
    path: "/employee/chat",
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
  {
    title: "Report Incident",
    icon: AlertTriangle,
    path: "/employee/report-incident",
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/employee/settings",
  },
];
export default function Sidebar() {

  const [collapsed, setCollapsed] = useState(false);

  const { user, logoutUser } = useAuth();

  const navigate = useNavigate();

  const role = user?.role?.toUpperCase() || "";

  const menuItems = {
    ADMIN: adminMenu,
    ANALYST: analystMenu,
    EMPLOYEE: employeeMenu,
  }[role] || [];

  const handleLogout = () => {

    logoutUser();

    navigate("/");

  };

  const getRoleBadge = () => {

    switch (role) {

      case "ADMIN":
        return "bg-red-500/20 text-red-400";

      case "ANALYST":
        return "bg-cyan-500/20 text-cyan-400";

      case "EMPLOYEE":
        return "bg-green-500/20 text-green-400";

      default:
        return "bg-slate-700 text-slate-300";

    }

  };

  return (

    <aside
      className={`${
        collapsed ? "w-20" : "w-[250px]"
        } sticky top-0 flex h-screen shrink-0 flex-col border-r border-slate-800 bg-[#101725] transition-all duration-300`}
    >

      {/* ======================================
                    LOGO
      ====================================== */}

      <div className="flex h-[70px] items-center justify-between border-b border-slate-800 px-3">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600">

            <Shield
              className="text-white"
              size={24}
            />

          </div>

          {!collapsed && (

            <div>

              <h1 className="text-xl font-bold text-white">

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

          className="text-slate-400 transition hover:text-white"

        >

          {collapsed ? (
            <ChevronRight />
          ) : (
            <ChevronLeft />
          )}

        </button>

      </div>

      {/* ======================================
                  NAVIGATION STARTS
      ====================================== */}

      <div className="flex-1 space-y-1 px-2 py-4">
      {menuItems.map((item) => {

  const Icon = item.icon;

  return (

    <NavLink
      key={item.title}
      to={item.path}
      end={item.path === "/admin" || item.path === "/soc" || item.path === "/employee"}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-lg px-2 py-2.5 transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20"
            : "text-slate-400 hover:bg-slate-800 hover:text-white"
        }`
      }
    >

      {/* Icon */}

      <Icon
        size={22}
        className="transition-transform duration-300 group-hover:scale-110"
      />

      {/* Text */}

      {!collapsed && (

        <div className="flex flex-1 items-center justify-between">

          <span className="font-medium">

            {item.title}

          </span>

        </div>

      )}

    </NavLink>

  );

})}

  </div>
      {/* ======================================
                  USER PROFILE
      ====================================== */}

      <div className="border-t border-slate-800 p-4">

        <div className="mb-4 rounded-xl bg-slate-900 p-4">

          <div className="flex items-center gap-3">

            {/* Avatar */}

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-lg font-bold text-white">

              {user?.full_name?.charAt(0)?.toUpperCase() || "U"}

            </div>

            {!collapsed && (

              <div className="flex-1">

                <h3 className="truncate font-semibold text-white">

                  {user?.full_name}

                </h3>

                <p className="truncate text-xs text-slate-400">

                  {user?.email}

                </p>

              </div>

            )}

          </div>

          {/* Role Badge */}

          {!collapsed && (

            <div className="mt-4">

              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase ${getRoleBadge()}`}
              >

                {role}

              </span>

            </div>

          )}

        </div>

        {/* Logout */}

        <button

          onClick={handleLogout}

          className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-red-400 transition duration-300 hover:bg-red-500/10 hover:text-red-300"

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