export default function DeleteDialog({
    open,
    onClose,
    onConfirm,
    loading,
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">

            <div className="w-full max-w-md rounded-xl bg-slate-900 p-6">

                <h2 className="text-2xl font-bold text-white">
                    Delete User
                </h2>

                <p className="mt-4 text-slate-400">
                    Are you sure you want to delete this user?
                    This action cannot be undone.
                </p>

                <div className="mt-8 flex justify-end gap-3">

                    <button
                        onClick={onClose}
                        className="rounded-lg bg-slate-700 px-5 py-2 hover:bg-slate-600"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="rounded-lg bg-red-600 px-5 py-2 hover:bg-red-500"
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </button>

                </div>

            </div>

        </div>
    );
}