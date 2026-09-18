import { useEffect, useState } from "react";
import {
    createUser,
    updateUser,
}from "../../api/userApi"

const initialForm = {
    employee_id: "",
    full_name: "",
    email: "",
    password: "",
    role_id: 1,
    department_id: 1,
};

export default function UserModal({
    open,
    onClose,
    onSuccess,
    mode = "add",
    user = null,
}) {

    const [form, setForm] = useState(initialForm);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    useEffect(() => {

        if (!open) {
            setForm(initialForm);
            setError("");
            return;
        }

        if (mode === "edit" && user) {

            setForm({
                employee_id: user.employee_id || "",
                full_name: user.full_name || "",
                email: user.email || "",
                password: "",
                role_id: user.role_id ?? 1,
                department_id: user.department_id ?? 1,
            });

        } else {

            setForm(initialForm);

        }

    }, [open, mode, user]);

    if (!open) return null;

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validate = () => {

        if (!form.employee_id.trim())
            return "Employee ID is required.";

        if (!form.full_name.trim())
            return "Full Name is required.";

        if (!form.email.trim())
            return "Email is required.";

        if (
            mode === "add" &&
            form.password.trim().length < 6
        )
            return "Password must be at least 6 characters.";

        return null;
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        const validation = validate();

        if (validation) {
            setError(validation);
            return;
        }

        try {

            setLoading(true);

            setError("");

            if (mode === "add") {

                await createUser(form);

            } else {

                const payload = { ...form };

                if (!payload.password)
                    delete payload.password;

                await updateUser(user.id, payload);

            }

            onSuccess?.();

            onClose?.();

        } catch (err) {

            console.error(err);

            setError(
                err?.response?.data?.detail ||
                "Unable to save user."
            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">

            <div className="w-full max-w-xl rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">

                <h2 className="mb-6 text-2xl font-bold text-white">

                    {mode === "add"
                        ? "Add User"
                        : "Edit User"}

                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    <input
                        className="w-full rounded-lg bg-slate-800 p-3 outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Employee ID"
                        name="employee_id"
                        value={form.employee_id}
                        onChange={handleChange}
                    />

                    <input
                        className="w-full rounded-lg bg-slate-800 p-3 outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Full Name"
                        name="full_name"
                        value={form.full_name}
                        onChange={handleChange}
                    />

                    <input
                        type="email"
                        className="w-full rounded-lg bg-slate-800 p-3 outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                    />

                    {mode === "add" && (

                        <input
                            type="password"
                            className="w-full rounded-lg bg-slate-800 p-3 outline-none focus:ring-2 focus:ring-cyan-500"
                            placeholder="Password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                        />

                    )}

                    <div className="grid grid-cols-2 gap-4">

                        <input
                            type="number"
                            className="rounded-lg bg-slate-800 p-3 outline-none focus:ring-2 focus:ring-cyan-500"
                            placeholder="Role ID"
                            name="role_id"
                            value={form.role_id}
                            onChange={handleChange}
                        />

                        <input
                            type="number"
                            className="rounded-lg bg-slate-800 p-3 outline-none focus:ring-2 focus:ring-cyan-500"
                            placeholder="Department ID"
                            name="department_id"
                            value={form.department_id}
                            onChange={handleChange}
                        />

                    </div>

                    {error && (

                        <div className="rounded-lg bg-red-900/30 p-3 text-red-400">

                            {error}

                        </div>

                    )}

                    <div className="flex justify-end gap-3">

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg bg-slate-700 px-5 py-2 transition hover:bg-slate-600"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg bg-cyan-600 px-5 py-2 transition hover:bg-cyan-500 disabled:opacity-60"
                        >
                            {loading
                                ? (mode === "add"
                                    ? "Creating..."
                                    : "Updating...")
                                : (mode === "add"
                                    ? "Create User"
                                    : "Update User")}
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );
}