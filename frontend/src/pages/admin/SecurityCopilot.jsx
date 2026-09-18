import { Shield, Sparkles, Cpu, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SecurityCopilot() {
    const navigate = useNavigate();

    return (
        <div className="mx-auto flex min-h-[calc(100vh-120px)] w-full max-w-5xl items-center justify-center">

            <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/70 p-5 text-center shadow-2xl backdrop-blur-xl sm:p-8">

                {/* Icon */}

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 shadow-xl shadow-cyan-500/20">

                    <Shield
                        size={42}
                        className="text-white"
                    />

                </div>

                {/* Title */}

                <h1 className="mt-6 text-3xl font-bold text-white sm:text-4xl">
                    Security Copilot
                </h1>

                <p className="mt-4 text-lg text-slate-400">
                    AI-Powered Security Investigation & Response Platform
                </p>

                {/* Coming Soon Badge */}

                <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2">

                    <Sparkles
                        size={18}
                        className="text-cyan-400"
                    />

                    <span className="font-semibold text-cyan-400">
                        Coming Soon
                    </span>

                </div>

                {/* Description */}

                <p className="mx-auto mt-6 max-w-2xl leading-7 text-slate-400">
                    Review security signals and investigate threats with the AgentShield AI assistant.
                </p>

                <button onClick={() => navigate("/admin/chat")} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400">
                    <Sparkles size={18} /> Open AI investigation
                </button>

                {/* Features */}

                <div className="mt-8 grid gap-4 md:grid-cols-3">

                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">

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

                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">

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

                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">

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