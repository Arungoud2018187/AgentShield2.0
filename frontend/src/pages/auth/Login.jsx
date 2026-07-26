import LoginForm from "../../components/auth/LoginForm";

export default function Login() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950">

      {/* Background Glow */}
      <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-3xl"></div>

      <div className="absolute -right-32 bottom-0 h-[600px] w-[600px] rounded-full bg-blue-600/10 blur-3xl"></div>

      <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/5 blur-3xl"></div>

      {/* Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-2xl px-6">

        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-12 shadow-2xl backdrop-blur-xl">

          {/* Logo */}

          <div className="flex flex-col items-center">

            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-3xl font-bold text-white shadow-xl shadow-cyan-500/30">
              AS
            </div>

            <h1 className="text-5xl font-bold tracking-tight text-white">
              AgentShield
            </h1>

            <p className="mt-3 text-lg text-slate-400">
              Enterprise AI Security Platform
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Secure • Private • Local AI
            </p>

          </div>

          {/* Login Form */}

          <div className="mt-12">
            <LoginForm />
          </div>

          {/* Footer */}

          <div className="mt-10 border-t border-slate-800 pt-6">

            <div className="flex justify-center">

              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-5 py-2">

                <span className="text-lg">
                  🛡
                </span>

                <span className="text-sm font-medium text-emerald-300">
                  Enterprise Protected
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}