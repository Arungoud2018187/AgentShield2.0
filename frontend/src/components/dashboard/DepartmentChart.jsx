import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
} from "recharts";

import {
    Building2,
    Users,
    PieChart as PieChartIcon,
} from "lucide-react";

const COLORS = [
    "#06b6d4",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#14b8a6",
    "#ec4899",
    "#3b82f6",
];

export default function DepartmentChart({ data = [] }) {

    const totalUsers = data.reduce(
        (sum, item) => sum + (item.users || 0),
        0
    );

    const departments = data.length;

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">

            <div className="border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-violet-950/40 p-6">

                <div className="flex items-center justify-between">

                    <div>

                        <h2 className="text-2xl font-bold text-white">
                            Department Analytics
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                            User distribution across departments
                        </p>

                    </div>

                    <div className="rounded-xl bg-violet-500/10 p-3">

                        <PieChartIcon
                            size={26}
                            className="text-violet-400"
                        />

                    </div>

                </div>

            </div>

            <div className="grid grid-cols-2 gap-4 border-b border-slate-800 p-6">

                <div className="rounded-xl bg-slate-950 p-5">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-slate-500">
                                Departments
                            </p>

                            <h2 className="mt-2 text-4xl font-bold text-white">
                                {departments}
                            </h2>

                        </div>

                        <Building2
                            className="text-violet-400"
                            size={34}
                        />

                    </div>

                </div>

                <div className="rounded-xl bg-slate-950 p-5">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm text-slate-500">
                                Total Users
                            </p>

                            <h2 className="mt-2 text-4xl font-bold text-cyan-400">
                                {totalUsers}
                            </h2>

                        </div>

                        <Users
                            className="text-cyan-400"
                            size={34}
                        />

                    </div>

                </div>

            </div>

            <div className="h-[380px] p-6">

                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >

                    <PieChart>

                        <Pie
                            data={data}
                            dataKey="users"
                            nameKey="department"
                            innerRadius={70}
                            outerRadius={115}
                            paddingAngle={4}
                            stroke="#0f172a"
                            strokeWidth={3}
                            animationDuration={1200}
                        >

                            {data.map((entry, index) => (

                                <Cell
                                    key={index}
                                    fill={COLORS[index % COLORS.length]}
                                />

                            ))}

                        </Pie>

                        <Tooltip
                            contentStyle={{
                                background: "#0f172a",
                                border: "1px solid #334155",
                                borderRadius: "12px",
                                color: "#fff",
                            }}
                        />

                        <Legend
                            verticalAlign="bottom"
                            iconType="circle"
                            wrapperStyle={{
                                color: "#CBD5E1",
                                paddingTop: "20px",
                            }}
                        />

                    </PieChart>

                </ResponsiveContainer>

            </div>

        </div>
    );
}