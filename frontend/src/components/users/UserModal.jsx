import { useEffect, useState } from "react";
import { X, User, Mail, Key, Shield, Building2, UserPlus, CheckCircle2 } from "lucide-react";
import { createUser, updateUser } from "../../api/userApi";

const initialForm = {
  employee_id: "",
  full_name: "",
  email: "",
  password: "",
  role_id: 1,
  department_id: 1,
  is_active: true,
};

const ROLES = [
  { id: 1, name: "Employee" },
  { id: 2, name: "SOC Analyst" },
  { id: 3, name: "Administrator" },
];

const DEPARTMENTS = [
  { id: 1, name: "Engineering" },
  { id: 2, name: "Security" },
  { id: 3, name: "Finance" },
  { id: 4, name: "HR" },
  { id: 5, name: "Management" },
];

export default function UserModal({
  open,
  isOpen,
  onClose,
  onSuccess,
  mode = "add",
  user = null,
}) {
  const isModalOpen = open ?? isOpen ?? false;
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isModalOpen) {
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
        role_id: Number(user.role_id ?? user.role ?? 1),
        department_id: Number(user.department_id ?? user.department ?? 1),
        is_active: user.status === "Active" || user.is_active !== false,
      });
    } else {
      setForm(initialForm);
    }
  }, [isModalOpen, mode, user]);

  if (!isModalOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    if (!form.employee_id.trim()) return "Employee ID is required (e.g. EMP004).";
    if (!form.full_name.trim()) return "Full Name is required.";
    if (!form.email.trim() || !form.email.includes("@")) return "A valid email address is required.";
    if (mode === "add" && form.password.trim().length < 6) {
      return "Password must be at least 6 characters long.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (mode === "add") {
        const payload = {
          employee_id: form.employee_id.trim(),
          full_name: form.full_name.trim(),
          email: form.email.trim(),
          password: form.password.trim(),
          role_id: parseInt(form.role_id, 10),
          department_id: parseInt(form.department_id, 10),
        };
        await createUser(payload);
      } else {
        const payload = {
          employee_id: form.employee_id.trim(),
          full_name: form.full_name.trim(),
          email: form.email.trim(),
          role_id: parseInt(form.role_id, 10),
          department_id: parseInt(form.department_id, 10),
          is_active: Boolean(form.is_active),
        };
        await updateUser(user.id, payload);
      }

      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.detail ||
          "Unable to save user account. Please check the provided details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <UserPlus size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {mode === "add" ? "Create Enterprise User" : "Edit Enterprise User"}
              </h2>
              <p className="text-xs text-slate-400">
                Configure identity credentials, role permissions, and access level.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Employee ID & Full Name */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Employee ID
              </label>
              <input
                required
                name="employee_id"
                value={form.employee_id}
                onChange={handleChange}
                placeholder="e.g. EMP004"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Full Name
              </label>
              <input
                required
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                placeholder="e.g. Alex Rivera"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Email Address
            </label>
            <input
              required
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="e.g. alex@agentshield.com"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-500"
            />
          </div>

          {/* Password (Only required on Add) */}
          {mode === "add" && (
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Initial Password
              </label>
              <input
                required
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-500"
              />
            </div>
          )}

          {/* Role & Department Dropdowns */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Security Role
              </label>
              <select
                name="role_id"
                value={form.role_id}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-500"
              >
                {ROLES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Department
              </label>
              <select
                name="department_id"
                value={form.department_id}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-500"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Account Status (on edit) */}
          {mode === "edit" && (
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Account Status
              </label>
              <select
                name="is_active"
                value={form.is_active ? "true" : "false"}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, is_active: e.target.value === "true" }))
                }
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-white outline-none focus:border-cyan-500"
              >
                <option value="true">Active - Authorized Access</option>
                <option value="false">Inactive - Suspended Account</option>
              </select>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-700 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-cyan-500/25 transition hover:brightness-110 disabled:opacity-50"
            >
              <span>{loading ? "Saving..." : mode === "add" ? "Create User" : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}