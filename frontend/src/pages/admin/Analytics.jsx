import { useEffect, useState } from "react";
import {
    Activity,
    Bot,
    Shield,
    Users,
    Cpu,
    Database,
    AlertTriangle,
    CheckCircle2,
    Clock3,
    Globe,
    BrainCircuit,
    TrendingUp,
    TrendingDown,
    Server,
    BarChart3,
    Sparkles,
} from "lucide-react";
import { getAnalytics } from "../../api/analyticsApi";



export const Card = ({ title, value, icon, color }) => (

    <div className="group rounded-xl border border-slate-800 bg-slate-900 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/10">

        <div className="flex items-center justify-between">

            <div>

                <p className="text-slate-400">

                    {title}

                </p>

                <h2 className={`mt-2 text-3xl font-black sm:text-4xl ${color}`}>

                    {value}

                </h2>

            </div>

            <div className="rounded-2xl bg-slate-800 p-4 transition group-hover:scale-110">

                {icon}

            </div>

        </div>

    </div>

);

export default function Analytics() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        (async () => {

            try {

                const res = await getAnalytics();
                setData(res);

            } finally {

                setLoading(false);

            }

        })();

    }, []);

    if (loading) {

        return (

            <div className="flex min-h-screen items-center justify-center bg-slate-950">

                <div className="space-y-6 text-center">

                    <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"/>

                    <h2 className="text-2xl font-bold text-white">

                        Loading Analytics...

                    </h2>

                </div>

            </div>

        );

    }

    const cards = data?.cards ?? {};
    const weekly = data?.weekly_activity ?? [];
    const threats = data?.threat_distribution ?? [];

    return (

        <div className="space-y-5">

            {/* Header */}

            <div className="flex items-center justify-between">

                <div className="flex items-center gap-5">

                    <div className="rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-3 shadow-lg shadow-cyan-500/20">

                        <BarChart3
                            size={28}
                            className="text-white"
                        />

                    </div>

                    <div>

                        <h1 className="text-2xl font-black text-white sm:text-3xl">

                            Analytics Center

                        </h1>

                        <p className="mt-1 text-slate-400">

                            Enterprise AI Insights,
                            Threat Intelligence &
                            System Performance

                        </p>

                    </div>

                </div>

                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2">

                    <div className="flex items-center gap-2">

                        <Sparkles
                            size={18}
                            className="text-emerald-400"
                        />

                        <span className="font-semibold text-emerald-400">

                            Live Analytics

                        </span>

                    </div>

                </div>

            </div>

            {/* KPI */}

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

                <Card
                    title="AI Requests"
                    value={cards.total_requests ?? 0}
                    color="text-cyan-400"
                    icon={<Bot className="text-cyan-400" size={34}/>}
                />

                <Card
                    title="Threats Blocked"
                    value={cards.blocked_threats ?? 0}
                    color="text-red-400"
                    icon={<Shield className="text-red-400" size={34}/>}
                />

                <Card
                    title="Active Users"
                    value={cards.active_users ?? 0}
                    color="text-emerald-400"
                    icon={<Users className="text-emerald-400" size={34}/>}
                />

                <Card
                    title="AI Engine"
                    value={cards.ai_status ?? "Connected"}
                    color="text-violet-400"
                    icon={<Cpu className="text-violet-400" size={34}/>}
                />
            </div>

            {/* Continue in Part 2 */}
                        {/* Weekly Activity */}

            <div className="grid gap-4 xl:grid-cols-3">

                <div className="xl:col-span-2 rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">

                    <div className="mb-8 flex items-center justify-between">

                        <div>

                            <h2 className="text-2xl font-bold text-white">

                                Weekly AI Activity

                            </h2>

                            <p className="mt-1 text-slate-400">

                                AI requests processed this week

                            </p>

                        </div>

                        <TrendingUp className="text-emerald-400" size={28} />

                    </div>

                    <div className="space-y-5">

                        {weekly.map((item) => (

                            <div
                                key={item.day}
                                className="flex items-center gap-5"
                            >

                                <div className="w-24 font-medium text-slate-300">

                                    {item.day}

                                </div>

                                <div className="h-5 flex-1 overflow-hidden rounded-full bg-slate-800">

                                    <div
                                        className="h-5 rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 transition-all duration-700"
                                        style={{
                                            width: `${Math.min(item.requests, 100)}%`,
                                        }}
                                    />

                                </div>

                                <div className="w-14 text-right font-bold text-white">

                                    {item.requests}

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

                {/* Quick Stats */}

                <div className="space-y-6">

                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                        <div className="mb-5 flex items-center gap-3">

                            <BrainCircuit className="text-cyan-400" />

                            <h3 className="font-bold text-white">

                                AI Performance

                            </h3>

                        </div>

                        <div className="space-y-5">

                            <div className="flex justify-between">

                                <span className="text-slate-400">

                                    Avg Response

                                </span>

                                <span className="font-semibold text-cyan-400">

                                    142 ms

                                </span>

                            </div>

                            <div className="flex justify-between">

                                <span className="text-slate-400">

                                    Success Rate

                                </span>

                                <span className="font-semibold text-emerald-400">

                                    99.8%

                                </span>

                            </div>

                            <div className="flex justify-between">

                                <span className="text-slate-400">

                                    Accuracy

                                </span>

                                <span className="font-semibold text-violet-400">

                                    98.6%

                                </span>

                            </div>

                        </div>

                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                        <div className="mb-5 flex items-center gap-3">

                            <Server className="text-emerald-400" />

                            <h3 className="font-bold text-white">

                                Infrastructure

                            </h3>

                        </div>

                        <div className="space-y-5">

                            <div className="flex justify-between">

                                <span className="text-slate-400">

                                    CPU

                                </span>

                                <span className="text-cyan-400">

                                    31%

                                </span>

                            </div>

                            <div className="flex justify-between">

                                <span className="text-slate-400">

                                    Memory

                                </span>

                                <span className="text-cyan-400">

                                    46%

                                </span>

                            </div>

                            <div className="flex justify-between">

                                <span className="text-slate-400">

                                    GPU

                                </span>

                                <span className="text-cyan-400">

                                    24%

                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* Continue in Part 3 */}
                        {/* Threat Distribution */}

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">

                <div className="mb-8 flex items-center justify-between">

                    <div>

                        <h2 className="text-2xl font-bold text-white">

                            Threat Distribution

                        </h2>

                        <p className="mt-1 text-slate-400">

                            AI security incidents detected today

                        </p>

                    </div>

                    <AlertTriangle className="text-red-400" size={28} />

                </div>

                <div className="space-y-4">

                    {threats.map((t) => (

                        <div
                            key={t.title}
                            className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800 p-5 transition hover:border-red-500/40 hover:bg-slate-800/80"
                        >

                            <div className="flex items-center gap-4">

                                <div className="rounded-xl bg-red-500/10 p-3">

                                    <AlertTriangle className="text-red-400" />

                                </div>

                                <div>

                                    <h3 className="font-semibold text-white">

                                        {t.title}

                                    </h3>

                                    <p className="text-sm text-slate-400">

                                        Threat Category

                                    </p>

                                </div>

                            </div>

                            <span className="rounded-full bg-red-500/10 px-4 py-2 text-lg font-bold text-red-400">

                                {t.count}

                            </span>

                        </div>

                    ))}

                </div>

            </div>

            {/* Database & AI */}

            <div className="grid gap-6 lg:grid-cols-2">

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">

                    <div className="mb-6 flex items-center gap-3">

                        <Database className="text-cyan-400"/>

                        <h2 className="text-xl font-bold text-white">

                            Database Health

                        </h2>

                    </div>

                    <div className="space-y-5">

                        <div className="flex items-center justify-between">

                            <span className="text-slate-400">

                                Status

                            </span>

                            <span className="flex items-center gap-2 font-semibold text-emerald-400">

                                <CheckCircle2 size={16}/>

                                {data.database.status}

                            </span>

                        </div>

                        <div className="flex items-center justify-between">

                            <span className="text-slate-400">

                                Response Time

                            </span>

                            <span className="text-cyan-400">

                                {data.database.response_time}

                            </span>

                        </div>

                        <div className="flex items-center justify-between">

                            <span className="text-slate-400">

                                Connections

                            </span>

                            <span className="text-white">

                                128 Active

                            </span>

                        </div>

                    </div>

                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">

                    <div className="mb-6 flex items-center gap-3">

                        <Cpu className="text-violet-400"/>

                        <h2 className="text-xl font-bold text-white">

                            AI Engine

                        </h2>

                    </div>

                    <div className="space-y-5">

                        <div className="flex items-center justify-between">

                            <span className="text-slate-400">

                                Model

                            </span>

                            <span className="font-semibold text-emerald-400">

                                {data.ai_engine.model}

                            </span>

                        </div>

                        <div className="flex items-center justify-between">

                            <span className="text-slate-400">

                                Status

                            </span>

                            <span className="text-emerald-400">

                                {data.ai_engine.status}

                            </span>

                        </div>

                        <div className="flex items-center justify-between">

                            <span className="text-slate-400">

                                Avg Response

                            </span>

                            <span className="text-cyan-400">

                                {data.ai_engine.avg_response}

                            </span>

                        </div>

                    </div>

                </div>

            </div>

            {/* Continue in Part 4 */}
                        {/* Bottom Stats */}

            <div className="grid gap-6 lg:grid-cols-4">

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                    <div className="flex items-center justify-between">

                        <Clock3 className="text-cyan-400"/>

                        <TrendingUp className="text-emerald-400"/>

                    </div>

                    <p className="mt-5 text-slate-400">

                        Average Response

                    </p>

                    <h2 className="mt-2 text-4xl font-black text-cyan-400">

                        142 ms

                    </h2>

                    <p className="mt-2 text-sm text-emerald-400">

                        ↑ 8% Faster

                    </p>

                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                    <div className="flex items-center justify-between">

                        <Shield className="text-emerald-400"/>

                        <TrendingUp className="text-emerald-400"/>

                    </div>

                    <p className="mt-5 text-slate-400">

                        Security Accuracy

                    </p>

                    <h2 className="mt-2 text-4xl font-black text-emerald-400">

                        99.7%

                    </h2>

                    <p className="mt-2 text-sm text-emerald-400">

                        Excellent

                    </p>

                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                    <div className="flex items-center justify-between">

                        <Globe className="text-violet-400"/>

                        <TrendingDown className="text-red-400"/>

                    </div>

                    <p className="mt-5 text-slate-400">

                        Failed Requests

                    </p>

                    <h2 className="mt-2 text-4xl font-black text-red-400">

                        0.3%

                    </h2>

                    <p className="mt-2 text-sm text-red-400">

                        ↓ Lower is Better

                    </p>

                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                    <div className="flex items-center justify-between">

                        <Activity className="text-orange-400"/>

                        <CheckCircle2 className="text-emerald-400"/>

                    </div>

                    <p className="mt-5 text-slate-400">

                        System Uptime

                    </p>

                    <h2 className="mt-2 text-4xl font-black text-orange-400">

                        99.99%

                    </h2>

                    <p className="mt-2 text-sm text-emerald-400">

                        Stable

                    </p>

                </div>

            </div>

        </div>

    );

}