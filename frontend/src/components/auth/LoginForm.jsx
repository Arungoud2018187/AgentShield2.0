import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Shield, Loader2 } from "lucide-react";

import PasswordField from "./PasswordField";
import { login as loginService } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

function LoginForm() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setErrorMessage("");

    try {
      const response = await loginService(data);

      loginUser(response);

      const role = response.user.role.toLowerCase();

      switch (role) {
        case "admin":
          navigate("/admin");
          break;

        case "analyst":
          navigate("/analyst");
          break;

        default:
          navigate("/employee");
      }
    } catch (error) {
      console.error(error);

      setErrorMessage(
        error?.response?.data?.detail ||
          "Invalid email or password."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* Email */}

      <div>

        <label className="mb-2 block text-sm font-medium text-slate-300">
          Email Address
        </label>

        <input
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          {...register("email", {
            required: "Email address is required",
          })}
          className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition-all duration-200 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
        />

        {errors.email && (
          <p className="mt-2 text-sm text-red-400">
            {errors.email.message}
          </p>
        )}

      </div>

      {/* Password */}

      <PasswordField
        register={register}
        errors={errors}
      />

      {/* Remember Me + Forgot Password */}

      <div className="flex items-center justify-between">

        <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-400">

          <input
            type="checkbox"
            className="rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
          />

          Remember Me

        </label>

        <button
          type="button"
          className="text-sm text-cyan-400 transition hover:text-cyan-300"
        >
          Forgot Password?
        </button>

      </div>

      {/* Error */}

      {errorMessage && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {errorMessage}
        </div>
      )}

      {/* Login Button */}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-cyan-500/40 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2
              size={18}
              className="animate-spin"
            />
            Signing In...
          </>
        ) : (
          <>
            <Shield size={18} />
            Login Securely
          </>
        )}
      </button>
    </form>
  );
}

export default LoginForm;