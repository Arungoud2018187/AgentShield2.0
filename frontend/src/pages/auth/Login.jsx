import { Shield } from "lucide-react";
import LoginForm from "../../components/auth/LoginForm";

export default function Login() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#070c1b] px-4 py-10 sm:px-6 lg:px-8">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-cyan-500/10 blur-[140px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-[150px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[120px]" />

      {/* Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Open Unboxed Login Container */}
      <div className="relative z-10 w-full max-w-[780px] py-6 sm:py-12">
        {/* Brand Header */}
        <div className="mb-10 flex items-center justify-between border-b border-slate-800/70 pb-8 sm:mb-12 sm:pb-9">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-xl shadow-cyan-500/30 p-3">
              <Shield size={34} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                AgentShield
              </h1>
              <p className="text-sm sm:text-base font-medium text-slate-400 mt-1">
                Enterprise AI Security Platform
              </p>
            </div>
          </div>

          <div className="hidden sm:inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-400">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Guardrails Active</span>
          </div>
        </div>

        {/* Form */}
        <LoginForm />
      </div>
    </div>
  );
}