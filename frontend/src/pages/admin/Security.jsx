import {
    ShieldCheck,
    ShieldAlert,
    Activity,
    Globe,
    Clock3,
    CheckCircle2,
    XCircle,
    BrainCircuit,
    Cpu,
} from "lucide-react";

import SecurityPanel from "../../components/dashboard/SecurityPanel";

const events = [
    {
        time: "10:25 AM",
        threat: "Prompt Injection",
        severity: "Critical",
        status: "Blocked",
    },
    {
        time: "09:48 AM",
        threat: "Jailbreak Attempt",
        severity: "High",
        status: "Mitigated",
    },
    {
        time: "09:10 AM",
        threat: "SQL Injection",
        severity: "Medium",
        status: "Prevented",
    },
    {
        time: "08:40 AM",
        threat: "Sensitive Data Leak",
        severity: "Low",
        status: "Resolved",
    },
];

export default function Security() {
    return (
        <div className="space-y-8">

            {/* Header */}

            <div className="flex items-center justify-between">

                <div className="flex items-center gap-5">

                    <div className="rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 p-4 shadow-xl shadow-red-500/20">

                        <ShieldAlert
                            size={34}
                            className="text-white"
                        />

                    </div>

                    <div>

                        <h1 className="text-4xl font-black text-white">

                            Security Operations Center

                        </h1>

                        <p className="mt-1 text-slate-400">

                            Enterprise AI Security Monitoring &
                            Threat Intelligence

                        </p>

                    </div>

                </div>

                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-3">

                    <div className="flex items-center gap-2">

                        <CheckCircle2 className="text-emerald-400" />

                        <span className="font-semibold text-emerald-400">

                            All Systems Secure

                        </span>

                    </div>

                </div>

            </div>

            {/* KPI */}

            <div className="grid grid-cols-4 gap-6">

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                    <div className="flex items-center justify-between">

                        <p className="text-slate-400">
                            Threat Score
                        </p>

                        <ShieldAlert className="text-red-400"/>

                    </div>

                    <h2 className="mt-4 text-5xl font-black text-red-400">

                        12

                    </h2>

                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                    <div className="flex items-center justify-between">

                        <p className="text-slate-400">
                            Threats Blocked
                        </p>

                        <ShieldCheck className="text-emerald-400"/>

                    </div>

                    <h2 className="mt-4 text-5xl font-black text-emerald-400">

                        198

                    </h2>

                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                    <div className="flex items-center justify-between">

                        <p className="text-slate-400">
                            AI Requests
                        </p>

                        <BrainCircuit className="text-cyan-400"/>

                    </div>

                    <h2 className="mt-4 text-5xl font-black text-cyan-400">

                        14K

                    </h2>

                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                    <div className="flex items-center justify-between">

                        <p className="text-slate-400">
                            Security Health
                        </p>

                        <Activity className="text-emerald-400"/>

                    </div>

                    <h2 className="mt-4 text-5xl font-black text-emerald-400">

                        99%

                    </h2>

                </div>

            </div>

            {/* Main */}

            <div className="grid grid-cols-12 gap-6">

                <div className="col-span-8">

                    <SecurityPanel />

                </div>

                <div className="col-span-4 space-y-6">

                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                        <h3 className="mb-5 font-bold text-white">

                            Infrastructure

                        </h3>

                        <div className="space-y-4">

                            <div className="flex items-center justify-between">

                                <div className="flex items-center gap-3">

                                    <Cpu className="text-cyan-400"/>

                                    AI Engine

                                </div>

                                <span className="text-emerald-400">

                                    Online

                                </span>

                            </div>

                            <div className="flex items-center justify-between">

                                <div className="flex items-center gap-3">

                                    <Globe className="text-cyan-400"/>

                                    Firewall

                                </div>

                                <span className="text-emerald-400">

                                    Active

                                </span>

                            </div>

                            <div className="flex items-center justify-between">

                                <div className="flex items-center gap-3">

                                    <ShieldCheck className="text-cyan-400"/>

                                    Endpoint

                                </div>

                                <span className="text-emerald-400">

                                    Protected

                                </span>

                            </div>

                        </div>

                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                        <h3 className="mb-5 font-bold text-white">

                            Live Status

                        </h3>

                        <div className="space-y-4">

                            <div className="flex justify-between">

                                <span className="text-slate-400">

                                    CPU Usage

                                </span>

                                <span className="text-cyan-400">

                                    26%

                                </span>

                            </div>

                            <div className="flex justify-between">

                                <span className="text-slate-400">

                                    Memory

                                </span>

                                <span className="text-cyan-400">

                                    48%

                                </span>

                            </div>

                            <div className="flex justify-between">

                                <span className="text-slate-400">

                                    AI Latency

                                </span>

                                <span className="text-emerald-400">

                                    132 ms

                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* Events */}

            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

                <div className="border-b border-slate-800 px-6 py-5">

                    <h2 className="text-xl font-bold text-white">

                        Recent Security Events

                    </h2>

                </div>

                <table className="w-full">

                    <thead className="border-b border-slate-800 bg-slate-950 text-left text-slate-400">

                        <tr>

                            <th className="px-6 py-4">
                                Time
                            </th>

                            <th>
                                Threat
                            </th>

                            <th>
                                Severity
                            </th>

                            <th>
                                Status
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {events.map((event, index) => (

                            <tr
                                key={index}
                                className="border-b border-slate-800 transition hover:bg-slate-800/60"
                            >

                                <td className="px-6 py-5">

                                    <div className="flex items-center gap-2">

                                        <Clock3 size={15}/>

                                        {event.time}

                                    </div>

                                </td>

                                <td className="font-medium text-white">

                                    {event.threat}

                                </td>

                                <td>

                                    <span
                                        className={`rounded-full px-3 py-1 text-sm font-semibold ${
                                            event.severity === "Critical"
                                                ? "bg-red-500/10 text-red-400"
                                                : event.severity === "High"
                                                ? "bg-orange-500/10 text-orange-400"
                                                : "bg-yellow-500/10 text-yellow-400"
                                        }`}
                                    >

                                        {event.severity}

                                    </span>

                                </td>

                                <td>

                                    <div className="flex items-center gap-2">

                                        {event.status === "Blocked" && (
                                            <XCircle
                                                size={16}
                                                className="text-red-400"
                                            />
                                        )}

                                        {event.status !== "Blocked" && (
                                            <CheckCircle2
                                                size={16}
                                                className="text-emerald-400"
                                            />
                                        )}

                                        <span
                                            className={
                                                event.status === "Blocked"
                                                    ? "text-red-400"
                                                    : "text-emerald-400"
                                            }
                                        >

                                            {event.status}

                                        </span>

                                    </div>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}