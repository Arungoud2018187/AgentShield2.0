import {
    ShieldAlert,
    ShieldCheck,
    Database,
    Bug,
    Activity,
    Server,
    Cpu,
    Wifi,
    TrendingUp,
    AlertCircle,
} from "lucide-react";

const ICON_MAP = {
    "Prompt Injection": ShieldAlert,
    "Jailbreak Attempts": Bug,
    "Output Violations": ShieldCheck,
    "Sensitive Output Violations": ShieldCheck,
    "Sensitive Data": ShieldCheck,
    "Policy Violations": Database,
    "Database Threats": Database,
};

const defaultSecurityData = [
    {
        id: 1,
        title: "Prompt Injection",
        count: 0,
        status: "Protected",
        severity: "Low",
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
    },
    {
        id: 2,
        title: "Jailbreak Attempts",
        count: 0,
        status: "Protected",
        severity: "Low",
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
    },
    {
        id: 3,
        title: "Output Violations",
        count: 0,
        status: "Secure",
        severity: "Low",
        color: "text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
    },
    {
        id: 4,
        title: "Policy Violations",
        count: 0,
        status: "Monitored",
        severity: "Low",
        color: "text-cyan-400",
        bg: "bg-cyan-500/10",
        border: "border-cyan-500/20",
    },
];

const services = [
    {
        name: "Backend API",
        icon: Server,
        status: "Online",
        color: "bg-emerald-500",
    },
    {
        name: "OpenRouter AI",
        icon: Cpu,
        status: "Running",
        color: "bg-cyan-500",
    },
    {
        name: "Database",
        icon: Database,
        status: "Connected",
        color: "bg-emerald-500",
    },
    {
        name: "Network",
        icon: Wifi,
        status: "Healthy",
        color: "bg-green-500",
    },
];

export default function SecurityPanel({ data }) {
    const activeData = (data && data.length > 0 ? data : defaultSecurityData).map((item) => ({
        ...item,
        icon: item.icon || ICON_MAP[item.title] || ShieldAlert,
    }));

    const totalThreats = activeData.reduce((sum, item) => sum + (item.count || 0), 0);
    const score = Math.max(82, 100 - totalThreats * 2);

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">

            <div className="border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 p-6">

                <div className="flex items-center justify-between">

                    <div>

                        <h2 className="text-2xl font-bold text-white">
                            Security Operations
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            AI Threat Intelligence Center
                        </p>

                    </div>

                    <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2">

                        <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400"/>

                        <span className="text-sm font-semibold text-emerald-400">
                            LIVE
                        </span>

                    </div>

                </div>

            </div>

            <div className="space-y-5 p-6">

                <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-5">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-slate-400">
                                Security Score
                            </p>

                            <h1 className="mt-2 text-5xl font-black text-cyan-400">
                                {score}%
                            </h1>

                        </div>

                        <TrendingUp
                            size={42}
                            className="text-cyan-400"
                        />

                    </div>

                </div>

                {activeData.map((item) => {

                    const Icon = item.icon;

                    return (

                        <div
                            key={item.id}
                            className={`${item.bg} ${item.border} rounded-xl border p-4 transition duration-300 hover:scale-[1.02] hover:shadow-lg`}
                        >

                            <div className="flex items-center justify-between">

                                <div className="flex items-center gap-4">

                                    <div className="rounded-xl bg-slate-950 p-3">

                                        <Icon
                                            size={22}
                                            className={item.color}
                                        />

                                    </div>

                                    <div>

                                        <h3 className="font-semibold text-white">
                                            {item.title}
                                        </h3>

                                        <p className={`text-sm ${item.color}`}>
                                            {item.status}
                                        </p>

                                    </div>

                                </div>

                                <div className="text-right">

                                    <div className={`text-3xl font-bold ${item.color}`}>
                                        {item.count}
                                    </div>

                                    <div className="mt-1">

                                        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs text-slate-300">
                                            {item.severity}
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </div>

                    );

                })}

                <div className="border-t border-slate-800 pt-6">

                    <div className="mb-4 flex items-center gap-2">

                        <Activity
                            className="text-cyan-400"
                            size={20}
                        />

                        <h3 className="font-semibold text-white">
                            Infrastructure Health
                        </h3>

                    </div>

                    <div className="space-y-3">

                        {services.map((service) => {

                            const Icon = service.icon;

                            return (

                                <div
                                    key={service.name}
                                    className="flex items-center justify-between rounded-xl bg-slate-950 px-4 py-3 transition hover:bg-slate-800"
                                >

                                    <div className="flex items-center gap-3">

                                        <Icon
                                            size={18}
                                            className="text-cyan-400"
                                        />

                                        <span className="text-white">
                                            {service.name}
                                        </span>

                                    </div>

                                    <div className="flex items-center gap-2">

                                        <div
                                            className={`h-2.5 w-2.5 rounded-full ${service.color}`}
                                        />

                                        <span className="text-sm text-slate-300">
                                            {service.status}
                                        </span>

                                    </div>

                                </div>

                            );

                        })}

                    </div>

                </div>

                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">

                    <div className="flex items-center gap-3">

                        <AlertCircle
                            className="text-red-400"
                            size={22}
                        />

                        <div>

                            <h4 className="font-semibold text-white">
                                Latest Alert
                            </h4>

                            <p className="text-sm text-slate-400">
                                Prompt Injection detected and automatically blocked.
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}