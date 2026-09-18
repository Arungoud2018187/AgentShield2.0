import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Shield, Loader2, UserCheck, ShieldAlert, Briefcase, AlertCircle } from "lucide-react";

import PasswordField from "./PasswordField";
import { login } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";

const ROLES = [
  {
    id: "Employee",
    name: "Employee",
    portal: "Employee Portal",
    badge: "AI Assistant",
    icon: Briefcase,
    accent: "from-emerald-500/20 to-teal-500/10 border-emerald-500/40 text-emerald-400",
    activeRing: "ring-emerald-500/50 border-emerald-500",
  },
  {
    id: "Administrator",
    name: "Administrator",
    portal: "Admin Portal",
    badge: "Governance",
    icon: UserCheck,
    accent: "from-blue-500/20 to-cyan-500/10 border-blue-500/40 text-blue-400",
    activeRing: "ring-cyan-500/50 border-cyan-500",
  },
  {
    id: "SOC Analyst",
    name: "SOC Analyst",
    portal: "SOC Portal",
    badge: "Threat Ops",
    icon: ShieldAlert,
    accent: "from-violet-500/20 to-purple-500/10 border-violet-500/40 text-violet-400",
    activeRing: "ring-violet-500/50 border-violet-500",
  },
];

function LoginForm() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [selectedRole, setSelectedRole] = useState("Administrator");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      identifier: "arun@agentshield.com",
      password: "AgentShield123",
    },
  });

  const fillDemo = (roleId, identifier) => {
    setSelectedRole(roleId);
    setValue("identifier", identifier);
    setValue("password", "AgentShield123");
    setErrorMessage("");
  };

  const onSubmit = async (data) => {
    setErrorMessage("");

    try {
      const payload = {
        identifier: data.identifier,
        password: data.password,
        selected_role: selectedRole,
      };

      const response = await login(payload);

      loginUser(response);

      const canonicalRole = (response.user.role || "").toUpperCase();

      if (canonicalRole === "ADMIN") {
        navigate("/admin");
      } else if (canonicalRole === "ANALYST") {
        navigate("/soc");
      } else {
        navigate("/employee");
      }
    } catch (error) {
      console.error(error);
      const detail = error?.response?.data?.detail;
      setErrorMessage(
        typeof detail === "string"
          ? detail
          : "Authentication failed. Please verify your credentials and selected role."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Role Selection */}
      <div>
        <div className="mb-2.5 flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Target Security Portal
          </label>
          <span className="text-[11px] text-cyan-400">Strict Role Verification</span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {ROLES.map((r) => {
            const Icon = r.icon;
            const isSelected = selectedRole === r.id;

            return (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  setSelectedRole(r.id);
                  setErrorMessage("");
                }}
                className={`relative flex flex-col items-center rounded-xl border p-3 text-center transition-all duration-200 ${
                  isSelected
                    ? `bg-slate-900 shadow-lg ring-2 ${r.activeRing} ${r.accent}`
                    : "border-slate-800 bg-slate-950/70 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                <Icon size={20} className="mb-1.5" />
                <span className="text-xs font-bold leading-tight text-white">{r.name}</span>
                <span className="mt-1 text-[10px] text-slate-400">{r.badge}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Email or Employee ID */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Email or Employee ID
        </label>

        <input
          type="text"
          placeholder="e.g. arun@agentshield.com or EMP001"
          autoComplete="username"
          {...register("identifier", {
            required: "Email or Employee ID is required",
          })}
          className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition-all duration-200 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
        />

        {errors.identifier && (
          <p className="mt-2 text-sm text-red-400">
            {errors.identifier.message}
          </p>
        )}
      </div>

      {/* Password */}
      <PasswordField register={register} errors={errors} />

      {/* Demo Credentials Quick-Select */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3">
        <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-slate-400">
          Demo Quick Fill
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => fillDemo("Administrator", "arun@agentshield.com")}
            className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-xs text-blue-300 transition hover:bg-blue-500/20"
          >
            Admin (EMP001)
          </button>
          <button
            type="button"
            onClick={() => fillDemo("SOC Analyst", "analyst@agentshield.com")}
            className="rounded-lg border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 text-xs text-violet-300 transition hover:bg-violet-500/20"
          >
            SOC Analyst (EMP002)
          </button>
          <button
            type="button"
            onClick={() => fillDemo("Employee", "employee@agentshield.com")}
            className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-300 transition hover:bg-emerald-500/20"
          >
            Employee (EMP003)
          </button>
        </div>
      </div>

      {/* Error Message Display */}
      {errorMessage && (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-500/40 bg-red-500/10 p-3.5 text-sm text-red-300">
          <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-400" />
          <p className="leading-snug">{errorMessage}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-600 py-3 font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-cyan-500/40 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Authenticating with AgentShield...
          </>
        ) : (
          <>
            <Shield size={18} />
            Sign In to {selectedRole} Portal
          </>
        )}
      </button>
    </form>
  );
}

export default LoginForm;