import { useCallback, useEffect, useMemo, useState } from "react";

import UserTable from "../../components/admin/UserTable";
import UserModal from "../../components/users/UserModal";
import DeleteDialog from "../../components/users/DeleteDialog";

import {
    getUsers,
    deleteUser,
} from "../../services/userService";

import {
    Users as UsersIcon,
    UserPlus,
    Search,
    Filter,
    Download,
    Upload,
    ShieldCheck,
    UserCheck,
    UserX,
    Activity,
    RefreshCw,
} from "lucide-react";

export default function Users() {

    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [openModal, setOpenModal] = useState(false);

    const [selectedUser, setSelectedUser] = useState(null);

    const [modalMode, setModalMode] = useState("add");

    const [deleteOpen, setDeleteOpen] = useState(false);

    const [deleteLoading, setDeleteLoading] = useState(false);

    const [search, setSearch] = useState("");

    const [role, setRole] = useState("");

    const [department, setDepartment] = useState("");

    const [status, setStatus] = useState("");

    const [page, setPage] = useState(1);

    const [pages, setPages] = useState(1);

    const loadUsers = useCallback(async () => {

        try {

            setLoading(true);

            const data = await getUsers({
                search,
                role_id: role,
                department_id: department,
                status,
                page,
                limit: 10,
            });

            setPages(data.pages);

            setUsers(
                data.users.map((user) => ({
                    id: user.id,
                    employee_id: user.employee_id,
                    full_name: user.full_name,
                    email: user.email,
                    role: user.role_id,
                    role_id: user.role_id,
                    department: user.department_id,
                    department_id: user.department_id,
                    status: user.is_active ? "Active" : "Inactive",
                }))
            );

            setError("");

        } catch (err) {

            console.error(err);

            setError("Failed to load users.");

        } finally {

            setLoading(false);

        }

    }, [search, role, department, status, page]);

    useEffect(() => {

        const timerId = setTimeout(() => {
            loadUsers();
        }, 0);

        return () => clearTimeout(timerId);

    }, [loadUsers]);

    const handleDelete = async () => {

        try {

            setDeleteLoading(true);

            await deleteUser(selectedUser.id);

            setDeleteOpen(false);

            loadUsers();

        } finally {

            setDeleteLoading(false);

        }

    };

    const activeUsers = useMemo(
        () =>
            users.filter(
                (u) => u.status === "Active"
            ).length,
        [users]
    );

    const inactiveUsers = useMemo(
        () =>
            users.filter(
                (u) => u.status === "Inactive"
            ).length,
        [users]
    );

    return (

        <div className="space-y-8">

            {/* Header */}

            <div className="flex items-center justify-between">

                <div className="flex items-center gap-5">

                    <div className="rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 p-4 shadow-xl shadow-cyan-500/20">

                        <UsersIcon
                            size={34}
                            className="text-white"
                        />

                    </div>

                    <div>

                        <h1 className="text-4xl font-black tracking-tight text-white">

                            User Management

                        </h1>

                        <p className="mt-1 text-slate-400">

                            Manage enterprise users, permissions,
                            departments and security access.

                        </p>

                    </div>

                </div>

                <div className="flex items-center gap-3">

                    <button
                        onClick={loadUsers}
                        className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-slate-300 transition hover:border-cyan-500 hover:text-white"
                    >

                        <RefreshCw size={18} />

                        Refresh

                    </button>

                    <button
                        className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-slate-300 transition hover:border-cyan-500 hover:text-white"
                    >

                        <Download size={18} />

                        Export

                    </button>

                    <button
                        className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-slate-300 transition hover:border-cyan-500 hover:text-white"
                    >

                        <Upload size={18} />

                        Import

                    </button>

                    <button
                        onClick={() => {

                            setSelectedUser(null);

                            setModalMode("add");

                            setOpenModal(true);

                        }}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-semibold text-white shadow-xl shadow-cyan-500/30 transition hover:scale-105"
                    >

                        <UserPlus size={19} />

                        Add User

                    </button>

                </div>

            </div>

            {/* KPI Cards */}

            <div className="grid grid-cols-4 gap-6">

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                    <div className="flex items-center justify-between">

                        <p className="text-slate-400">
                            Total Users
                        </p>

                        <UsersIcon className="text-cyan-400" />

                    </div>

                    <h2 className="mt-4 text-5xl font-black text-white">

                        {users.length}

                    </h2>

                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                    <div className="flex items-center justify-between">

                        <p className="text-slate-400">
                            Active Users
                        </p>

                        <UserCheck className="text-emerald-400" />

                    </div>

                    <h2 className="mt-4 text-5xl font-black text-emerald-400">

                        {activeUsers}

                    </h2>

                </div>
                                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                    <div className="flex items-center justify-between">

                        <p className="text-slate-400">
                            Inactive Users
                        </p>

                        <UserX className="text-red-400" />

                    </div>

                    <h2 className="mt-4 text-5xl font-black text-red-400">

                        {inactiveUsers}

                    </h2>

                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                    <div className="flex items-center justify-between">

                        <p className="text-slate-400">
                            Security Score
                        </p>

                        <ShieldCheck className="text-cyan-400" />

                    </div>

                    <h2 className="mt-4 text-5xl font-black text-cyan-400">

                        98%

                    </h2>

                    <p className="mt-2 text-sm text-slate-500">

                        Identity Protection Enabled

                    </p>

                </div>

            </div>

            {/* Filters */}

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">

                <div className="mb-6 flex items-center justify-between">

                    <div className="flex items-center gap-3">

                        <Filter
                            size={22}
                            className="text-cyan-400"
                        />

                        <h2 className="text-xl font-bold text-white">

                            Search & Filters

                        </h2>

                    </div>

                    <div className="flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2">

                        <Activity
                            size={16}
                            className="text-emerald-400"
                        />

                        <span className="text-sm text-emerald-400">

                            Live Search

                        </span>

                    </div>

                </div>

                <div className="grid grid-cols-4 gap-5">

                    <div className="relative">

                        <Search
                            size={18}
                            className="absolute left-4 top-4 text-slate-500"
                        />

                        <input
                            className="
                                w-full
                                rounded-xl
                                border
                                border-slate-700
                                bg-slate-950
                                py-3
                                pl-11
                                pr-4
                                text-white
                                outline-none
                                transition
                                focus:border-cyan-500
                            "
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => {

                                setSearch(e.target.value);

                                setPage(1);

                            }}
                        />

                    </div>

                    <input
                        className="
                            rounded-xl
                            border
                            border-slate-700
                            bg-slate-950
                            px-4
                            py-3
                            text-white
                            outline-none
                            focus:border-cyan-500
                        "
                        placeholder="Role ID"
                        value={role}
                        onChange={(e) => {

                            setRole(e.target.value);

                            setPage(1);

                        }}
                    />

                    <input
                        className="
                            rounded-xl
                            border
                            border-slate-700
                            bg-slate-950
                            px-4
                            py-3
                            text-white
                            outline-none
                            focus:border-cyan-500
                        "
                        placeholder="Department ID"
                        value={department}
                        onChange={(e) => {

                            setDepartment(e.target.value);

                            setPage(1);

                        }}
                    />

                    <select
                        className="
                            rounded-xl
                            border
                            border-slate-700
                            bg-slate-950
                            px-4
                            py-3
                            text-white
                            outline-none
                            focus:border-cyan-500
                        "
                        value={status}
                        onChange={(e) => {

                            setStatus(e.target.value);

                            setPage(1);

                        }}
                    >

                        <option value="">

                            All Status

                        </option>

                        <option value="true">

                            Active

                        </option>

                        <option value="false">

                            Inactive

                        </option>

                    </select>

                </div>

            </div>

            {/* Content */}

            {loading && (

                <div className="rounded-2xl border border-slate-800 bg-slate-900 py-24">

                    <div className="flex flex-col items-center">

                        <div className="mb-6 h-12 w-12 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />

                        <h3 className="text-lg font-semibold text-white">

                            Loading Users...

                        </h3>

                        <p className="mt-2 text-slate-400">

                            Fetching latest enterprise records.

                        </p>

                    </div>

                </div>

            )}

            {error && (

                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-400">

                    {error}

                </div>

            )}

            {!loading && !error && (

                <UserTable
                    users={users}
                    onEdit={(user) => {

                        setSelectedUser(user);

                        setModalMode("edit");

                        setOpenModal(true);

                    }}
                                        onDelete={(user) => {

                        setSelectedUser(user);

                        setDeleteOpen(true);

                    }}

                />

            )}

            {/* Pagination */}

            <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900 px-6 py-5">

                <div>

                    <p className="text-slate-400">

                        Showing

                        <span className="mx-2 font-semibold text-white">

                            Page {page}

                        </span>

                        of

                        <span className="mx-2 font-semibold text-white">

                            {pages}

                        </span>

                    </p>

                </div>

                <div className="flex items-center gap-3">

                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="
                            rounded-xl
                            border
                            border-slate-700
                            bg-slate-800
                            px-5
                            py-2.5
                            text-white
                            transition
                            hover:bg-slate-700
                            disabled:cursor-not-allowed
                            disabled:opacity-40
                        "
                    >

                        Previous

                    </button>

                    <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-5 py-2 font-semibold text-cyan-400">

                        {page}

                    </div>

                    <button
                        disabled={page === pages}
                        onClick={() => setPage(page + 1)}
                        className="
                            rounded-xl
                            border
                            border-slate-700
                            bg-slate-800
                            px-5
                            py-2.5
                            text-white
                            transition
                            hover:bg-slate-700
                            disabled:cursor-not-allowed
                            disabled:opacity-40
                        "
                    >

                        Next

                    </button>

                </div>

            </div>

            {/* Add/Edit User Modal */}

            <UserModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onSuccess={loadUsers}
                mode={modalMode}
                user={selectedUser}
            />

            {/* Delete Dialog */}

            <DeleteDialog
                open={deleteOpen}
                loading={deleteLoading}
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDelete}
            />

        </div>

    );

}