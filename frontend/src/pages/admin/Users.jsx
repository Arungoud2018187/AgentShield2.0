import { useCallback, useEffect, useMemo, useState } from "react";
import UserTable from "../../components/admin/UserTable";
import UserModal from "../../components/users/UserModal";
import DeleteDialog from "../../components/users/DeleteDialog";
import { getUsers, deleteUser } from "../../api/userApi";
import {
  Users as UsersIcon,
  UserPlus,
  Search,
  Filter,
  ShieldCheck,
  UserCheck,
  UserX,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
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

      setPages(data.pages || 1);
      setUsers(
        (data.users || []).map((user) => ({
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
      setError("Failed to load user directory.");
    } finally {
      setLoading(false);
    }
  }, [search, role, department, status, page]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      loadUsers();
    }, 150);
    return () => clearTimeout(timerId);
  }, [loadUsers]);

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await deleteUser(selectedUser.id);
      setDeleteOpen(false);
      loadUsers();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const activeUsers = useMemo(
    () => users.filter((u) => u.status === "Active").length,
    [users]
  );

  const inactiveUsers = useMemo(
    () => users.filter((u) => u.status === "Inactive").length,
    [users]
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            User Management
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Enterprise user directory, role assignments, and security governance
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadUsers}
            disabled={loading}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 text-xs font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => {
              setSelectedUser(null);
              setModalMode("add");
              setOpenModal(true);
            }}
            className="inline-flex h-9 items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 text-xs font-bold text-white shadow-md shadow-cyan-500/20 transition hover:brightness-110"
          >
            <UserPlus size={15} />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/80 p-4">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Total Users</span>
            <UsersIcon size={18} className="text-cyan-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{users.length}</p>
          <p className="mt-1 text-[11px] text-slate-500">In Current Scope</p>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-slate-900/80 p-4">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Active Users</span>
            <UserCheck size={18} className="text-emerald-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-400">{activeUsers}</p>
          <p className="mt-1 text-[11px] text-slate-500">Authorized & Verified</p>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-slate-900/80 p-4">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Inactive Users</span>
            <UserX size={18} className="text-amber-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-400">{inactiveUsers}</p>
          <p className="mt-1 text-[11px] text-slate-500">Suspended / Deactivated</p>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-slate-900/80 p-4">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium uppercase tracking-wider">Access Policy</span>
            <ShieldCheck size={18} className="text-blue-400" />
          </div>
          <p className="mt-2 text-2xl font-bold text-blue-400">Enforced</p>
          <p className="mt-1 text-[11px] text-slate-500">RBAC Token Authorization</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="rounded-xl border border-slate-800/80 bg-slate-900/70 p-4">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <SlidersHorizontal size={14} className="text-cyan-400" />
          <span>Filters & Directory Search</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              className="h-10 w-full rounded-lg border border-slate-700 bg-slate-950/80 pl-9 pr-3 text-xs text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
              placeholder="Search by name, email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          <input
            type="text"
            className="h-10 rounded-lg border border-slate-700 bg-slate-950/80 px-3 text-xs text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
            placeholder="Role ID filter..."
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(1);
            }}
          />

          <input
            type="text"
            className="h-10 rounded-lg border border-slate-700 bg-slate-950/80 px-3 text-xs text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
            placeholder="Department ID filter..."
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              setPage(1);
            }}
          />

          <select
            className="h-10 rounded-lg border border-slate-700 bg-slate-950/80 px-3 text-xs text-white focus:border-cyan-500 focus:outline-none"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Statuses</option>
            <option value="true">Active Only</option>
            <option value="false">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Content Stream */}
      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="text-center">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
            <p className="text-xs text-slate-400">Loading enterprise user records...</p>
          </div>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-400">
          {error}
        </div>
      ) : (
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

      {/* Pagination Controls */}
      <div className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-900/60 px-4 py-3">
        <p className="text-xs text-slate-400">
          Showing Page <strong className="text-white">{page}</strong> of <strong className="text-white">{pages}</strong>
        </p>

        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 text-xs text-slate-300 transition hover:bg-slate-700 disabled:opacity-40"
          >
            <ChevronLeft size={14} /> Previous
          </button>

          <button
            disabled={page >= pages}
            onClick={() => setPage(page + 1)}
            className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 text-xs text-slate-300 transition hover:bg-slate-700 disabled:opacity-40"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* User Modal */}
      {openModal && (
        <UserModal
          open={openModal}
          isOpen={openModal}
          onClose={() => {
            setOpenModal(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
          mode={modalMode}
          onSuccess={() => {
            setOpenModal(false);
            setSelectedUser(null);
            loadUsers();
          }}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deleteOpen && (
        <DeleteDialog
          open={deleteOpen}
          isOpen={deleteOpen}
          onClose={() => {
            setDeleteOpen(false);
            setSelectedUser(null);
          }}
          onConfirm={handleDelete}
          loading={deleteLoading}
          user={selectedUser}
        />
      )}
    </div>
  );
}