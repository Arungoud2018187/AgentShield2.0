import {
  Pencil,
  Trash2,
  Mail,
  Shield,
  Building2,
  CheckCircle2,
  XCircle,
  Hash,
} from "lucide-react";

export default function UserTable({
  users = [],
  onEdit,
  onDelete,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/90 shadow-xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 px-6 py-4">
        <div>
          <h2 className="text-base font-bold text-white">
            Enterprise Directory
          </h2>
          <p className="text-xs text-slate-400">
            Active user accounts, assigned roles, and department affiliations
          </p>
        </div>

        <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400">
          {users.length} Records
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-slate-800/80 bg-slate-950/70 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-6 py-3.5">User Details</th>
              <th className="px-4 py-3.5">Employee ID</th>
              <th className="px-4 py-3.5">Security Role</th>
              <th className="px-4 py-3.5">Department</th>
              <th className="px-4 py-3.5">Account Status</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60 text-sm">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <div className="flex flex-col items-center">
                    <Shield size={32} className="mb-2 text-slate-600" />
                    <h3 className="text-sm font-semibold text-slate-300">
                      No Users Found
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Try clearing or adjusting your search filters.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="transition-colors hover:bg-slate-800/40"
                >
                  {/* User Details */}
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-xs font-bold text-white shadow-sm">
                        {user.full_name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)
                          .toUpperCase() || "U"}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                          {user.full_name}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Mail size={12} className="text-slate-500" />
                          <span className="truncate">{user.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Employee ID */}
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1 font-mono text-xs font-medium text-cyan-300">
                      <Hash size={12} className="text-cyan-500" />
                      {user.employee_id}
                    </span>
                  </td>

                  {/* Role */}
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-blue-500/25 bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-300">
                      <Shield size={12} className="text-blue-400" />
                      {user.role}
                    </span>
                  </td>

                  {/* Department */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5 text-xs text-slate-300">
                      <Building2 size={13} className="text-slate-500" />
                      <span>{user.department || "General"}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                        user.status === "Active"
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                          : "border-red-500/30 bg-red-500/10 text-red-300"
                      }`}
                    >
                      {user.status === "Active" ? (
                        <CheckCircle2 size={12} className="text-emerald-400" />
                      ) : (
                        <XCircle size={12} className="text-red-400" />
                      )}
                      <span>{user.status}</span>
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(user)}
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-cyan-400"
                        title="Edit User"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => onDelete(user)}
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
                        title="Delete User"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}