import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export default function StatCard({
  title,
  value,
  icon,
  color = "from-cyan-500/20 via-sky-500/10 to-transparent",
  trend = "+12%",
  subtitle = "This Month",
  progress = 70,
}) {
  const positive = !trend.startsWith("-");

  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-slate-800
        bg-slate-900/80
        backdrop-blur-xl
        transition-all
        duration-300
        hover:-translate-y-2
        hover:border-cyan-500/40
        hover:shadow-[0_18px_45px_rgba(6,182,212,0.18)]
      "
    >
      {/* Background */}
      <div
        className={`
          absolute
          inset-0
          bg-gradient-to-br
          ${color}
          opacity-60
        `}
      />

      {/* Glow */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl transition-all duration-500 group-hover:scale-125" />

      {/* Border Highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div
            className="
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              border
              border-cyan-500/20
              bg-slate-950/70
              text-cyan-400
              shadow-lg
              transition-all
              duration-300
              group-hover:scale-110
              group-hover:rotate-6
            "
          >
            {icon}
          </div>

          <div
            className={`rounded-full px-3 py-1 border ${
              positive
                ? "border-emerald-500/20 bg-emerald-500/10"
                : "border-red-500/20 bg-red-500/10"
            }`}
          >
            <div className="flex items-center gap-1">
              {positive ? (
                <ArrowUpRight size={14} className="text-emerald-400" />
              ) : (
                <ArrowDownRight size={14} className="text-red-400" />
              )}

              <span
                className={`text-xs font-semibold ${
                  positive ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {trend}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mt-8">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
            {title}
          </p>

          <h2 className="mt-3 text-5xl font-black tracking-tight text-white">
            {value}
          </h2>

          {/* Progress */}
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-slate-400">{subtitle}</span>

              <span className="text-xs font-medium text-cyan-400">
                {progress}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 transition-all duration-700 group-hover:brightness-110"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4">
            <span className="text-xs text-slate-500">
              Live Metrics
            </span>

            <span className="flex items-center gap-2 text-xs text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Updated
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}