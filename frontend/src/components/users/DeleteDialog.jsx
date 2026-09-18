import { AlertTriangle, Trash2, X } from "lucide-react";

export default function DeleteDialog({
  open,
  isOpen,
  onClose,
  onConfirm,
  loading,
  user,
}) {
  const show = open ?? isOpen ?? false;
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-red-500/30 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Delete User Account</h2>
              <p className="text-xs text-slate-400">Irreversible security governance action</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        <p className="mt-4 text-xs text-slate-300 leading-relaxed">
          Are you sure you want to delete user{" "}
          <strong className="text-white">
            {user?.full_name || "this user"} {user?.employee_id ? `(${user.employee_id})` : ""}
          </strong>
          ? All associated session tokens will be invalidated immediately.
        </p>

        <div className="mt-6 flex justify-end gap-3 border-t border-slate-800 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-slate-700 hover:text-white"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-red-500 disabled:opacity-50 shadow-md shadow-red-600/20"
          >
            <Trash2 size={14} />
            <span>{loading ? "Deleting..." : "Confirm Delete"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}