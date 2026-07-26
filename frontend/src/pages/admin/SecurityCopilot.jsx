import { Shield, Sparkles, Cpu, Clock } from "lucide-react";

export default function SecurityCopilot() {
    return (
        <div className="flex min-h-[calc(100vh-120px)] items-center justify-center">

            <div className="w-full max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/70 p-12 text-center shadow-2xl backdrop-blur-xl">

                {/* Icon */}

                <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-r from-cyan-500 to-blue-600 shadow-xl shadow-cyan-500/20">

                    <Shield
                        size={56}
                        className="text-white"
                    />

                </div>

                {/* Title */}

                <h1 className="mt-8 text-5xl font-bold text-white">
                    Security Copilot
                </h1>

                <p className="mt-4 text-lg text-slate-400">
                    AI-Powered Security Investigation & Response Platform
                </p>

                {/* Coming Soon Badge */}

                <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-6 py-3">

                    <Sparkles
                        size={18}
                        className="text-cyan-400"
                    />

                    <span className="font-semibold text-cyan-400">
                        Coming Soon
                    </span>

                </div>

                {/* Description */}

                <p className="mx-auto mt-8 max-w-2xl text-slate-400 leading-8">
                    The Security Copilot module is currently under development
                    and is planned for the next phase of the AgentShield
                    platform. It will provide AI-assisted threat detection,
                    investigation, incident response, log analysis, and
                    automated security recommendations.
                </p>

                {/* Features */}

                <div className="mt-12 grid gap-5 md:grid-cols-3">

                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">

                        <Cpu
                            size={32}
                            className="mx-auto text-cyan-400"
                        />

                        <h3 className="mt-4 font-semibold text-white">
                            AI Investigation
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Intelligent threat investigation powered by local AI.
                        </p>

                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">

                        <Shield
                            size={32}
                            className="mx-auto text-emerald-400"
                        />

                        <h3 className="mt-4 font-semibold text-white">
                            Automated Response
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            AI-assisted incident response and remediation.
                        </p>

                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">

                        <Clock
                            size={32}
                            className="mx-auto text-orange-400"
                        />

                        <h3 className="mt-4 font-semibold text-white">
                            Next Semester
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Planned implementation in the next development phase.
                        </p>

                    </div>

                </div>

                {/* Footer */}

                <div className="mt-12 border-t border-slate-800 pt-6">

                    <p className="text-sm text-slate-500">
                        AgentShield Roadmap • Phase 2 Feature
                    </p>

                </div>

            </div>

        </div>
    );
}