import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell,
} from "recharts";

import {
    ShieldAlert,
    AlertTriangle,
} from "lucide-react";

const COLORS = {
    Critical: "#ef4444",
    High: "#f97316",
    Medium: "#eab308",
    Low: "#06b6d4",
    Info: "#22c55e",
};

export default function SecuritySeverityChart({ data = [] }) {

    const totalEvents = data.reduce(
        (sum, item) => sum + (item.count || 0),
        0
    );

    const critical =
        data.find((x) => x.severity === "Critical")?.count || 0;

    return (

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">

            <div className="border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-red-950/30 p-6">

                <div className="flex items-center justify-between">

                    <div>

                        <h2 className="text-2xl font-bold text-white">
                            Threat Analytics
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            Security events by severity
                        </p>

                    </div>

                    <div className="rounded-xl bg-red-500/10 p-3">

                        <ShieldAlert
                            size={28}
                            className="text-red-400"
                        />

                    </div>

                </div>

            </div>

            <div className="grid grid-cols-2 gap-4 border-b border-slate-800 p-6">

                <div className="rounded-xl bg-slate-950 p-5">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-slate-500">
                                Total Events
                            </p>

                            <h2 className="mt-2 text-4xl font-bold text-white">
                                {totalEvents}
                            </h2>

                        </div>

                        <AlertTriangle
                            size={34}
                            className="text-cyan-400"
                        />

                    </div>

                </div>

                <div className="rounded-xl bg-slate-950 p-5">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-slate-500">
                                Critical
                            </p>

                            <h2 className="mt-2 text-4xl font-bold text-red-400">
                                {critical}
                            </h2>

                        </div>

                        <ShieldAlert
                            size={34}
                            className="text-red-400"
                        />

                    </div>

                </div>

            </div>

            <div className="h-[280px] p-4 sm:h-[340px] sm:p-6">

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    <BarChart
                        data={data}
                    >

                        <CartesianGrid
                            stroke="#334155"
                            strokeDasharray="4 4"
                        />

                        <XAxis
                            dataKey="severity"
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

                        <Bar
                            dataKey="count"
                            radius={[10, 10, 0, 0]}
                            animationDuration={1200}
                        >

                            {data.map((entry, index) => (

                                <Cell
                                    key={index}
                                    fill={
                                        COLORS[entry.severity] ||
                                        "#06b6d4"
                                    }
                                />

                            ))}

                        </Bar>

                    </BarChart>

                </ResponsiveContainer>

            </div>

            <div className="grid grid-cols-5 gap-3 border-t border-slate-800 p-6">

                {Object.entries(COLORS).map(([name, color]) => (

                    <div
                        key={name}
                        className="rounded-xl bg-slate-950 p-3 text-center"
                    >

                        <div
                            className="mx-auto mb-2 h-3 w-3 rounded-full"
                            style={{ background: color }}
                        />

                        <p className="text-xs font-medium text-slate-300">
                            {name}
                        </p>

                    </div>

                ))}

            </div>

        </div>

    );

}