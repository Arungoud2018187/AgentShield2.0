import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function PasswordField({ register, errors }) {
    const [show, setShow] = useState(false);

    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
                Password
            </label>

            <div className="relative">

                <input
                    type={show ? "text" : "password"}
                    placeholder="Enter your password"

                    {...register("password", {
                        required: "Password is required",
                        minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters",
                        },
                    })}

                    className="
                        h-14
                        w-full
                        rounded-2xl
                        border
                        border-slate-700
                        bg-slate-950/70
                        px-5
                        pr-14
                        text-white
                        placeholder:text-slate-500
                        outline-none
                        transition-all
                        duration-300
                        focus:border-cyan-400
                        focus:ring-2
                        focus:ring-cyan-500/30
                    "
                />

                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="
                        absolute
                        right-4
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                        transition
                        hover:text-cyan-400
                    "
                >
                    {show ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>

            </div>

            {errors.password && (
                <p className="mt-2 text-sm text-red-400">
                    {errors.password.message}
                </p>
            )}
        </div>
    );
}