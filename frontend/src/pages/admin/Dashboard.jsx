import { useEffect, useState } from "react";
import {
    Users,
    UserCheck,
    UserX,
    Shield,
    Building2,
    Cpu,
    Database,
    FileText,
    CalendarDays,
    Activity,
    Clock,
} from "lucide-react";

import { dashboardService } from "../../services/adminService";

import StatCard from "../../components/dashboard/StatCard";
import ActivityTable from "../../components/dashboard/ActivityTable";
import SecurityPanel from "../../components/dashboard/SecurityPanel";

import UserGrowthChart from "../../components/dashboard/UserGrowthChart";
import DepartmentChart from "../../components/dashboard/DepartmentChart";
import SecuritySeverityChart from "../../components/dashboard/SecuritySeverityChart";

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const data = await dashboardService();
                setStats(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950">
                <div className="text-center">

                    <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>

                    <h2 className="text-2xl font-bold text-white">
                        Loading AgentShield...
                    </h2>

                    <p className="mt-3 text-slate-400">
                        Initializing Enterprise Security Dashboard
                    </p>

                </div>
            </div>
        );
    }

    const cards = stats.cards;

    const currentDate = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    const greeting = () => {
        const hour = new Date().getHours();

        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <div className="space-y-8">

            {/* ================= HEADER ================= */}

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-8 backdrop-blur-xl">

                <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

                    {/* LEFT */}

                    <div className="flex items-center gap-5">

                        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-600 shadow-xl shadow-cyan-500/20">

                            <Shield
                                size={38}
                                className="text-white"
                            />

                        </div>

                        <div>

                            <p className="text-slate-400">
                                {greeting()}
                            </p>

                            <h1 className="mt-1 text-4xl font-bold text-white">
                                AgentShield SOC
                            </h1>

                            <p className="mt-3 text-slate-400">
                                Enterprise AI Security Operations Center
                            </p>

                        </div>

                    </div>

                    {/* RIGHT */}

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">

                            <div className="flex items-center gap-2">

                                <CalendarDays
                                    size={18}
                                    className="text-cyan-400"
                                />

                                <span className="text-xs uppercase tracking-wider text-slate-500">
                                    Today
                                </span>

                            </div>

                            <p className="mt-3 text-sm font-medium text-white">
                                {currentDate}
                            </p>

                        </div>

                        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">

                            <div className="flex items-center gap-2">

                                <Cpu
                                    size={18}
                                    className="text-cyan-400"
                                />

                                <span className="text-xs uppercase tracking-wider text-slate-500">
                                    AI Engine
                                </span>

                            </div>

                            <h3 className="mt-3 text-lg font-bold text-cyan-400">
                                Qwen3 8B
                            </h3>

                            <p className="mt-1 text-xs text-slate-500">
                                Ollama Connected
                            </p>

                        </div>

                        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">

                            <div className="flex items-center gap-2">

                                <Activity
                                    size={18}
                                    className="text-emerald-400"
                                />

                                <span className="text-xs uppercase tracking-wider text-emerald-300">
                                    System Status
                                </span>

                            </div>

                            <h3 className="mt-3 text-lg font-bold text-emerald-400">
                                ● Operational
                            </h3>

                            <p className="mt-1 text-xs text-emerald-300">
                                99.98% Uptime
                            </p>

                        </div>

                    </div>

                </div>

            </div>

            {/* ================= QUICK STATS ================= */}

            <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-4">

                <StatCard
                    title="Total Users"
                    value={cards.total_users}
                    icon={<Users size={28} />}
                    trend="+8.2%"
                    subtitle="This Month"
                    progress={82}
                />

                <StatCard
                    title="Active Users"
                    value={cards.active_users}
                    icon={<UserCheck size={28} />}
                    trend="+3.4%"
                    subtitle="Today"
                    progress={73}
                />

                <StatCard
                    title="Inactive Users"
                    value={cards.inactive_users}
                    icon={<UserX size={28} />}
                    trend="-1.1%"
                    subtitle="This Week"
                    progress={18}
                />

                <StatCard
                    title="Roles"
                    value={cards.total_roles}
                    icon={<Shield size={28} />}
                    trend="+2"
                    subtitle="Enterprise"
                    progress={90}
                />

                <StatCard
                    title="Departments"
                    value={cards.total_departments}
                    icon={<Building2 size={28} />}
                    trend="+1"
                    subtitle="Organization"
                    progress={76}
                />

                <StatCard
                    title="AI Agents"
                    value={cards.ai_agents}
                    icon={<Cpu size={28} />}
                    trend="+15%"
                    subtitle="Running"
                    progress={95}
                />

                <StatCard
                    title="Prompt Logs"
                    value={cards.total_prompts}
                    icon={<FileText size={28} />}
                    trend="+28%"
                    subtitle="Last 24 Hours"
                    progress={88}
                />

                <StatCard
                    title="Security Events"
                    value={cards.total_security_events}
                    icon={<Database size={28} />}
                    trend="-12%"
                    subtitle="Threat Activity"
                    progress={35}
                />
            </div>

            {/* PART 2 CONTINUES FROM HERE */}\
                        {/* ================= CHARTS ================= */}

            <div className="grid gap-7 xl:grid-cols-12">

                <div className="xl:col-span-8">

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl">

                        <div className="mb-6 flex items-center justify-between">

                            <div>

                                <h2 className="text-xl font-bold text-white">
                                    User Growth Analytics
                                </h2>

                                <p className="mt-1 text-sm text-slate-400">
                                    Monthly user onboarding and growth
                                </p>

                            </div>

                            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-2">

                                <span className="text-sm font-medium text-cyan-400">
                                    Live
                                </span>

                            </div>

                        </div>

                        <UserGrowthChart
                            data={stats.user_growth || []}
                        />

                    </div>

                </div>

                <div className="xl:col-span-4">

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl">

                        <div className="mb-6">

                            <h2 className="text-xl font-bold text-white">
                                Departments
                            </h2>

                            <p className="mt-1 text-sm text-slate-400">
                                User distribution
                            </p>

                        </div>

                        <DepartmentChart
                            data={stats.department_distribution || []}
                        />

                    </div>

                </div>

            </div>

            {/* ================= SECURITY ================= */}

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl">

                <div className="mb-6 flex items-center justify-between">

                    <div>

                        <h2 className="text-xl font-bold text-white">
                            Security Event Distribution
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            Threat severity across the platform
                        </p>

                    </div>

                    <div className="rounded-full bg-emerald-500/10 px-4 py-2">

                        <span className="text-sm font-semibold text-emerald-400">
                            Monitoring
                        </span>

                    </div>

                </div>

                <SecuritySeverityChart
                    data={stats.security_distribution || []}
                />

            </div>

            {/* ================= ACTIVITY ================= */}

            <div className="grid gap-7 xl:grid-cols-12">

                <div className="space-y-7 xl:col-span-8">

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl">

                        <div className="mb-6 flex items-center justify-between">

                            <div>

                                <h2 className="text-xl font-bold text-white">
                                    Recent Activity
                                </h2>

                                <p className="mt-1 text-sm text-slate-400">
                                    Latest enterprise users
                                </p>

                            </div>

                            <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2">

                                <Clock
                                    size={16}
                                    className="text-cyan-400"
                                />

                                <span className="text-sm text-slate-300">
                                    Live Updates
                                </span>

                            </div>

                        </div>

                        <ActivityTable
                            users={stats.recent_users || []}
                        />

                    </div>

                </div>

                <div className="xl:col-span-4">

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl">

                        <div className="mb-6">

                            <h2 className="text-xl font-bold text-white">
                                Security Overview
                            </h2>

                            <p className="mt-1 text-sm text-slate-400">
                                Enterprise protection status
                            </p>

                        </div>

                        <SecurityPanel />

                    </div>

                </div>

            </div>

            {/* ================= FOOTER ================= */}

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-xl">

                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                    <div>

                        <h3 className="font-semibold text-white">
                            AgentShield Enterprise AI Security Platform
                        </h3>

                        <p className="mt-1 text-sm text-slate-400">
                            Local AI • FastAPI • PostgreSQL • Ollama • Qwen3
                        </p>

                    </div>

                    <div className="flex items-center gap-3">

                        <span className="h-3 w-3 animate-pulse rounded-full bg-emerald-400"></span>

                        <span className="font-medium text-emerald-400">
                            All Systems Operational
                        </span>

                    </div>

                </div>

            </div>

        </div>
    );
}