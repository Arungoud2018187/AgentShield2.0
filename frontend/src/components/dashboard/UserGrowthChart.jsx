import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";
import { TrendingUp, Users } from "lucide-react";

export default function UserGrowthChart({ data = [] }) {

    const totalUsers = data.reduce(
        (sum, item) => sum + (item.users || 0),
        0
    );

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">

            <div className="border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 p-6">

                <div className="flex items-center justify-between">

                    <div>

                        <h2 className="text-2xl font-bold text-white">
                            User Growth
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            Enterprise user registrations
                        </p>

                    </div>

                    <div className="rounded-xl bg-cyan-500/10 p-3">

                        <TrendingUp
                            className="text-cyan-400"
                            size={26}
                        />

                    </div>

                </div>

            </div>

            <div className="grid grid-cols-2 gap-4 border-b border-slate-800 p-6">

                <div className="rounded-xl bg-slate-950 p-5">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-slate-500">
                                Total Users
                            </p>

                            <h2 className="mt-2 text-4xl font-bold text-white">
                                {totalUsers}
                            </h2>

                        </div>

                        <Users
                            size={34}
                            className="text-cyan-400"
                        />

                    </div>

                </div>

                <div className="rounded-xl bg-slate-950 p-5">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-slate-500">
                                Growth
                            </p>

                            <h2 className="mt-2 text-4xl font-bold text-emerald-400">
                                +18%
                            </h2>

                        </div>

                        <TrendingUp
                            size={34}
                            className="text-emerald-400"
                        />

                    </div>

                </div>

            </div>

            <div className="h-[240px] p-4 sm:h-[300px] sm:p-6">

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    <AreaChart data={data}>

                        <defs>

                            <linearGradient
                                id="growthFill"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >

                                <stop
                                    offset="0%"
                                    stopColor="#06b6d4"
                                    stopOpacity={0.55}
                                />

                                <stop
                                    offset="100%"
                                    stopColor="#06b6d4"
                                    stopOpacity={0}
                                />

                            </linearGradient>

                        </defs>

                        <CartesianGrid
                            strokeDasharray="4 4"
                            stroke="#334155"
                        />

                        <XAxis
                            dataKey="date"
                            stroke="#94a3b8"
                            tick={{ fill: "#94a3b8" }}
                        />

                        <YAxis
                            stroke="#94a3b8"
                            tick={{ fill: "#94a3b8" }}
                        />

                        <Tooltip
                            contentStyle={{
                                background: "#0f172a",
                                border: "1px solid #334155",
                                borderRadius: "12px",
                                color: "#fff",
                            }}
                        />

                        <Area
                            type="monotone"
                            dataKey="users"
                            stroke="#06b6d4"
                            strokeWidth={4}
                            fill="url(#growthFill)"
                            animationDuration={1200}
                        />

                    </AreaChart>

                </ResponsiveContainer>

            </div>

        </div>
    );
}