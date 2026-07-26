import {
    Pencil,
    Trash2,
    Mail,
    Shield,
    Building2,
} from "lucide-react";

export default function UserTable({
    users = [],
    onEdit,
    onDelete,
}) {

    return (

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">

            {/* Header */}

            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-5">

                <div>

                    <h2 className="text-xl font-bold text-white">
                        Enterprise Users
                    </h2>

                    <p className="text-sm text-slate-400">
                        User accounts and permissions
                    </p>

                </div>

                <span className="rounded-full bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-400">

                    {users.length} Users

                </span>

            </div>

            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead className="border-b border-slate-800 bg-slate-950">

                        <tr className="text-left text-sm uppercase tracking-wider text-slate-400">

                            <th className="px-6 py-4">
                                User
                            </th>

                            <th>
                                Employee ID
                            </th>

                            <th>
                                Role
                            </th>

                            <th>
                                Department
                            </th>

                            <th>
                                Status
                            </th>

                            <th className="text-center">
                                Actions
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {users.length === 0 ? (

                            <tr>

                                <td
                                    colSpan={6}
                                    className="py-20 text-center"
                                >

                                    <div className="flex flex-col items-center">

                                        <div className="mb-4 rounded-full bg-slate-800 p-5">

                                            <Shield
                                                size={34}
                                                className="text-slate-500"
                                            />

                                        </div>

                                        <h3 className="text-lg font-semibold text-white">

                                            No Users Found

                                        </h3>

                                        <p className="mt-2 text-slate-500">

                                            Try changing your filters.

                                        </p>

                                    </div>

                                </td>

                            </tr>

                        ) : (

                            users.map((user) => (

                                <tr
                                    key={user.id}
                                    className="border-b border-slate-800 transition-all duration-300 hover:bg-slate-800/60"
                                >

                                    {/* User */}

                                    <td className="px-6 py-5">

                                        <div className="flex items-center gap-4">

                                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-lg font-bold text-white">

                                                {user.full_name
                                                    ?.split(" ")
                                                    .map(n => n[0])
                                                    .join("")
                                                    .substring(0,2)}

                                            </div>

                                            <div>

                                                <h3 className="font-semibold text-white">

                                                    {user.full_name}

                                                </h3>

                                                <div className="mt-1 flex items-center gap-2 text-sm text-slate-400">

                                                    <Mail size={14}/>

                                                    {user.email}

                                                </div>

                                            </div>

                                        </div>

                                    </td>

                                    {/* Employee */}

                                    <td>

                                        <span className="rounded-lg bg-cyan-500/10 px-3 py-2 font-medium text-cyan-400">

                                            {user.employee_id}

                                        </span>

                                    </td>

                                    {/* Role */}

                                    <td>

                                        <span className="rounded-full bg-blue-500/10 px-4 py-2 text-blue-400">

                                            {user.role}

                                        </span>

                                    </td>

                                    {/* Department */}

                                    <td>

                                        <div className="flex items-center gap-2">

                                            <Building2
                                                size={15}
                                                className="text-slate-500"
                                            />

                                            <span className="text-slate-300">

                                                {user.department}

                                            </span>

                                        </div>

                                    </td>

                                    {/* Status */}

                                    <td>

                                        <span
                                            className={`rounded-full px-4 py-2 text-sm font-semibold ${
                                                user.status === "Active"
                                                    ? "bg-emerald-500/10 text-emerald-400"
                                                    : "bg-red-500/10 text-red-400"
                                            }`}
                                        >

                                            {user.status}

                                        </span>

                                    </td>

                                    {/* Actions */}

                                    <td>

                                        <div className="flex justify-center gap-3">

                                            <button
                                                onClick={() => onEdit(user)}
                                                className="rounded-xl bg-blue-500/10 p-3 text-blue-400 transition hover:scale-110 hover:bg-blue-500 hover:text-white"
                                            >

                                                <Pencil size={18}/>

                                            </button>

                                            <button
                                                onClick={() => onDelete(user)}
                                                className="rounded-xl bg-red-500/10 p-3 text-red-400 transition hover:scale-110 hover:bg-red-500 hover:text-white"
                                            >

                                                <Trash2 size={18}/>

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