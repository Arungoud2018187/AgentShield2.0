import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Loader2,
  UserCheck,
  ShieldAlert,
  Briefcase,
  AlertCircle,
  Mail,
  Lock,
  ArrowRight,
} from "lucide-react";

import PasswordField from "./PasswordField";
import { login } from "../../api/authApi";
import { useAuth } from "../../context/AuthContext";

const PORTALS = [
  {
    id: "Administrator",
    name: "Admin",
    roleCode: "EMP001",
    portal: "Admin Portal",
    badge: "Governance",
    email: "arun@agentshield.com",
    icon: UserCheck,
    activeClasses: "bg-blue-500/15 border-blue-500 text-blue-300 ring-2 ring-blue-500/40 shadow-lg shadow-blue-500/15",
    badgeActive: "bg-blue-500/25 text-blue-200 border-blue-400/40",
    badgeInactive: "bg-slate-800/80 text-slate-400 border-slate-700/50",
  },
  {
    id: "SOC Analyst",
    name: "SOC Analyst",
    roleCode: "EMP002",
    portal: "SOC Portal",
    badge: "Threat Ops",
    email: "analyst@agentshield.com",
    icon: ShieldAlert,
    activeClasses: "bg-violet-500/15 border-violet-500 text-violet-300 ring-2 ring-violet-500/40 shadow-lg shadow-violet-500/15",
    badgeActive: "bg-violet-500/25 text-violet-200 border-violet-400/40",
    badgeInactive: "bg-slate-800/80 text-slate-400 border-slate-700/50",
  },
  {
    id: "Employee",
    name: "Employee",
    roleCode: "EMP003",
    portal: "Employee Portal",
    badge: "AI Assistant",
    email: "employee@agentshield.com",
    icon: Briefcase,
    activeClasses: "bg-emerald-500/15 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-500/15",
    badgeActive: "bg-emerald-500/25 text-emerald-200 border-emerald-400/40",
    badgeInactive: "bg-slate-800/80 text-slate-400 border-slate-700/50",
  },
];

export default function LoginForm() {
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

  const handleSelectPortal = (portal) => {
    setSelectedRole(portal.id);
    setValue("identifier", portal.email);
    setValue("password", "AgentShield123");
    setErrorMessage("");
  };

  const handleClear = () => {
    setValue("identifier", "");
    setValue("password", "");
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-9 sm:gap-11">
      {/* 1. Target Portal Selector (with Integrated Demo Account) */}
      <div className="flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <label className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300">
            Target Portal & Role
          </label>
          <span className="text-xs sm:text-sm font-medium text-cyan-400">Click to select & autofill</span>
        </div>

        <div className="grid grid-cols-3 gap-4 sm:gap-6">
          {PORTALS.map((r) => {
            const Icon = r.icon;
            const isSelected = selectedRole === r.id;

            return (
              <button
                key={r.id}
                type="button"
                onClick={() => handleSelectPortal(r)}
                className={`group relative flex flex-col items-center justify-center rounded-2xl border py-6 px-4 sm:py-7 sm:px-6 text-center transition-all duration-200 ${
                  isSelected
                    ? r.activeClasses
                    : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200 hover:bg-slate-900/90"
                }`}
              >
                <Icon size={30} className="mb-2.5 shrink-0 transition-transform group-hover:scale-110" />
                <span className="text-base sm:text-lg font-bold leading-tight text-white">{r.name}</span>
                <span className="mt-1 text-xs sm:text-sm text-slate-400">{r.badge}</span>
                <span
                  className={`mt-3 inline-flex items-center rounded-lg border px-3 py-1 text-xs font-mono font-medium transition ${
                    isSelected ? r.badgeActive : r.badgeInactive
                  }`}
                >
                  {r.roleCode}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Identifier (Email or Employee ID) */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="block text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-300">
            Email or Employee ID
          </label>
          <button
            type="button"
            onClick={handleClear}
            className="text-xs sm:text-sm font-medium text-slate-400 hover:text-cyan-400 transition"
          >
            Clear credentials
          </button>
        </div>

        <div className="flex h-16 w-full items-center rounded-2xl border border-slate-700/80 bg-slate-900/70 px-5 transition focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/25">
          <Mail size={22} className="mr-4 shrink-0 text-slate-400" />
          <input
            type="text"
            placeholder="e.g. arun@agentshield.com or EMP001"
            autoComplete="username"
            {...register("identifier", {
              required: "Email or Employee ID is required",
            })}
            className="h-full w-full bg-transparent text-base sm:text-lg text-white outline-none placeholder:text-slate-500"
          />
        </div>
        {errors.identifier && (
          <p className="mt-2 text-xs sm:text-sm text-red-400">{errors.identifier.message}</p>
        )}
      </div>

      {/* 3. Password */}
      <div>
        <PasswordField register={register} errors={errors} />
      </div>

      {/* 4. Error Banner */}
      {errorMessage && (
        <div className="flex items-start gap-3.5 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 sm:p-5 text-sm sm:text-base text-red-300">
          <AlertCircle size={22} className="mt-0.5 shrink-0 text-red-400" />
          <p className="leading-relaxed font-medium">{errorMessage}</p>
        </div>
      )}

      {/* 5. Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-600 py-4.5 text-base sm:text-lg font-bold tracking-wide text-white shadow-2xl shadow-cyan-500/25 transition duration-200 hover:brightness-110 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={22} className="animate-spin" />
            <span>Verifying Credentials...</span>
          </>
        ) : (
          <>
            <Shield size={22} />
            <span>Sign In to {selectedRole} Portal</span>
            <ArrowRight size={22} />
          </>
        )}
      </button>
    </form>
  );
}