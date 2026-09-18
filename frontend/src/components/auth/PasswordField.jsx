import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function PasswordField({ register, errors }) {
  const [show, setShow] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300">
          Password
        </label>
        <span className="text-xs sm:text-sm text-slate-400">Min. 6 characters</span>
      </div>

      <div className="flex h-16 w-full items-center rounded-2xl border border-slate-700/80 bg-slate-900/70 px-5 transition focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/25">
        <Lock size={22} className="mr-4 shrink-0 text-slate-400" />

        <input
          type={show ? "text" : "password"}
          placeholder="Enter corporate password"
          autoComplete="current-password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          })}
          className="h-full w-full bg-transparent text-base sm:text-lg text-white outline-none placeholder:text-slate-500"
        />

        <button
          type="button"
          onClick={() => setShow(!show)}
          className="ml-3 shrink-0 text-slate-400 transition hover:text-slate-200"
          tabIndex={-1}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={22} /> : <Eye size={22} />}
        </button>
      </div>

      {errors.password && (
        <p className="mt-1 text-xs text-red-400">
          {errors.password.message}
        </p>
      )}
    </div>
  );
}