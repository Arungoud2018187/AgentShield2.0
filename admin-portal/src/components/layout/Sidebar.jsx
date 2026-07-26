import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    Bot,
    Shield,
    BarChart3,
    Settings,
} from "lucide-react";

const menus = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { title: "Users", icon: Users, path: "/admin/users" },
    { title: "AI Chat", icon: Bot, path: "/admin/chat" },
    { title: "Security", icon: Shield, path: "/admin/security" },
    { title: "Analytics", icon: BarChart3, path: "/admin/analytics" },
    { title: "Settings", icon: Settings, path: "/admin/settings" },
];

export default function Sidebar() {
    return (
        <aside style={{ width: 260, background: "#0f172a", color: "white", padding: 20 }}>
            <h2>AgentShield</h2>

            {menus.map((item) => {
                const Icon = item.icon;

                return (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        style={{
                            display: "flex",
                            gap: 10,
                            alignItems: "center",
                            marginTop: 20,
                            color: "white",
                            textDecoration: "none",
                        }}
                    >
                        <Icon size={18} />
                        {item.title}
                    </NavLink>
                );
            })}
        </aside>
    );
}