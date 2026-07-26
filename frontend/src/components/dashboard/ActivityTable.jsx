import { Search, Eye, MoreVertical } from "lucide-react";
import { useMemo, useState } from "react";

export default function ActivityTable({ users = [] }) {
    const [search, setSearch] = useState("");

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const value = search.toLowerCase();

            return (
                user.full_name?.toLowerCase().includes(value) ||
                user.email?.toLowerCase().includes(value) ||
                user.employee_id?.toLowerCase().includes(value)
            );
        });
    }, [users, search]);

    const getInitials = (name) => {
        if (!name) return "NA";

        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();
    };

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">

            <div className="border-b border-slate-800 p-6">

                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                    <div>

                        <h2 className="text-2xl font-bold text-white">
                            Enterprise Users
                        </h2>

                        <p className="mt-1 text-slate-400">
                            Recently registered employees
                        </p>

                    </div>

                    <div className="flex items-center gap-4">

                        <div className="relative">

                            <Search
                                size={18}
                                className="absolute left-3 top-3 text-slate-500"
                            />

                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search user..."
                                className="w-72 rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-4 text-white outline-none transition focus:border-cyan-500"
                            />

                        </div>

                        <div className="rounded-xl bg-cyan-500/10 px-4 py-2 font-semibold text-cyan-400">
                            {filteredUsers.length} Users
                        </div>

                    </div>

                </div>

            </div>

            <div className="overflow-x-auto">

                <table className="min-w-full">

                    <thead className="sticky top-0 bg-slate-950">

                        <tr className="border-b border-slate-800 text-left text-xs uppercase tracking-wider text-slate-500">

                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Employee ID</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Department</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Joined</th>
                            <th className="px-6 py-4 text-right">Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {filteredUsers.map((user) => (

                            <tr
                                key={user.id}
                                className="border-b border-slate-800 transition hover:bg-slate-800/40"
                            >

                                <td className="px-6 py-5">

                                    <div className="flex items-center gap-4">

                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 font-bold text-white shadow-lg">

                                            {getInitials(user.full_name)}

                                        </div>

                                        <div>

                                            <h3 className="font-semibold text-white">
                                                {user.full_name}
                                            </h3>

                                            <p className="text-xs text-slate-500">
                                                User #{user.id}
                                            </p>

                                        </div>

                                    </div>

                                </td>

                                <td className="px-6 text-cyan-400 font-semibold">
                                    {user.employee_id}
                                </td>

                                <td className="px-6 text-slate-300">
                                    {user.email}
                                </td>

                                <td className="px-6">

                                    <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-400">
                                        {user.role_name || user.role_id}
                                    </span>

                                </td>

                                <td className="px-6">

                                    <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400">
                                        {user.department_name || user.department_id}
                                    </span>

                                </td>

                                <td className="px-6">

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                                            user.is_active
                                                ? "bg-emerald-500/10 text-emerald-400"
                                                : "bg-red-500/10 text-red-400"
                                        }`}
                                    >
                                        {user.is_active ? "Active" : "Inactive"}
                                    </span>

                                </td>

                                <td className="px-6 text-slate-400">
                                    {formatDate(user.created_at)}
                                </td>

                                <td className="px-6">

                                    <div className="flex justify-end gap-2">

                                        <button className="rounded-lg bg-cyan-500/10 p-2 text-cyan-400 transition hover:bg-cyan-500 hover:text-white">
                                            <Eye size={18}/>
                                        </button>

                                        <button className="rounded-lg bg-slate-800 p-2 text-slate-400 transition hover:bg-slate-700 hover:text-white">
                                            <MoreVertical size={18}/>
                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))}

                        {filteredUsers.length === 0 && (

                            <tr>

                                <td
                                    colSpan={8}
                                    className="py-20 text-center"
                                >

                                    <div className="space-y-3">

                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-800">

                                            👥

                                        </div>

                                        <h3 className="text-lg font-semibold text-white">
                                            No Users Found
                                        </h3>

                                        <p className="text-slate-500">
                                            Try searching with another keyword.
                                        </p>

                                    </div>

                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>

        </div>
    );
}