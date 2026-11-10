"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  HiOutlineUsers,
  HiPlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineKey,
  HiOutlineShieldCheck,
  HiOutlineCheck,
  HiXMark,
} from "react-icons/hi2";
import { api } from "@/lib/api";

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAtUtc: string;
  lastLoginUtc?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ id?: string; username?: string; role?: string } | null>(null);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form Fields
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Admin");
  const [isActive, setIsActive] = useState(true);

  const fetchUsers = () => {
    setIsLoading(true);
    api
      .authFetch<AdminUser[]>("/api/admin/users")
      .then((data) => {
        setUsers(data);
        setIsLoading(false);
      })
      .catch((err) => {
        toast.error("Failed to load admin users: " + err.message);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
    try {
      const stored = localStorage.getItem("krishna_admin_user");
      if (stored) setCurrentUser(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  const openCreateModal = () => {
    setEditingUser(null);
    setUsername("");
    setEmail("");
    setPassword("");
    setRole("Admin");
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (u: AdminUser) => {
    setEditingUser(u);
    setUsername(u.username);
    setEmail(u.email);
    setPassword(""); // Leave blank unless changing password
    setRole(u.role);
    setIsActive(u.isActive);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim()) {
      toast.error("Username and Email are required.");
      return;
    }

    if (!editingUser && (!password || password.length < 8)) {
      toast.error("Password is required and must be at least 8 characters long.");
      return;
    }

    if (editingUser && password && password.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }

    setIsSaving(true);
    try {
      if (editingUser) {
        await api.authFetch(`/api/admin/users/${editingUser.id}`, {
          method: "PUT",
          body: JSON.stringify({
            username: username.trim(),
            email: email.trim(),
            role,
            isActive,
            newPassword: password || undefined,
          }),
        });
        toast.success("Admin user updated successfully!");
        
        // If current logged-in user edited their own username, update local session
        if (currentUser && currentUser.username === editingUser.username) {
          const updatedUser = { ...currentUser, username: username.trim() };
          localStorage.setItem("krishna_admin_user", JSON.stringify(updatedUser));
          setCurrentUser(updatedUser);
        }
      } else {
        await api.authFetch("/api/admin/users", {
          method: "POST",
          body: JSON.stringify({
            username: username.trim(),
            email: email.trim(),
            password,
            role,
          }),
        });
        toast.success("New admin user created successfully!");
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Failed to save admin user.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.authFetch(`/api/admin/users/${deleteTarget.id}`, {
        method: "DELETE",
      });
      toast.success("Admin user deleted.");
      setDeleteTarget(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <HiOutlineUsers className="text-blue-600" /> Admin Users & Access Control
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage administrative credentials, create new dashboard users, edit logins, and reset passwords directly in Supabase PostgreSQL.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <HiPlus className="text-base" /> New Admin User
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-medium">Loading admin users...</div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <HiOutlineUsers className="mx-auto text-4xl text-slate-300 mb-2" />
            <p className="text-xs font-semibold text-slate-600">No admin accounts found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Login</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {users.map((u) => {
                  const isCurrent = currentUser?.username === u.username;
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-sm">
                            {u.username.substring(0, 1).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                              {u.username}
                              {isCurrent && (
                                <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.2 rounded-md">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            u.role === "Owner"
                              ? "bg-purple-100 text-purple-700 border border-purple-200"
                              : "bg-blue-100 text-blue-700 border border-blue-200"
                          }`}
                        >
                          <HiOutlineShieldCheck className="text-xs" />
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            u.isActive
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-500 border border-slate-200"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${u.isActive ? "bg-emerald-500" : "bg-slate-400"}`}
                          />
                          {u.isActive ? "Active" : "Disabled"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {u.lastLoginUtc ? new Date(u.lastLoginUtc).toLocaleString() : "Never"}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        {new Date(u.createdAtUtc).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => openEditModal(u)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit user credentials or reset password"
                          >
                            <HiOutlinePencilSquare className="text-base" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(u)}
                            disabled={isCurrent || users.length <= 1}
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-500 rounded-lg transition-colors cursor-pointer"
                            title={
                              isCurrent
                                ? "Cannot delete yourself while logged in"
                                : users.length <= 1
                                ? "Cannot delete the sole admin account"
                                : "Delete admin account"
                            }
                          >
                            <HiOutlineTrash className="text-base" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">
                {editingUser ? `Edit Admin User: ${editingUser.username}` : "Create New Admin User"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <HiXMark className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. krishna_admin"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {editingUser ? "Reset / Change Password (leave blank to keep current)" : "Password *"}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={editingUser ? "Enter new password (optional)" : "At least 8 characters"}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Owner">Owner</option>
                  </select>
                </div>

                {editingUser && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Account Status</label>
                    <select
                      value={isActive ? "active" : "disabled"}
                      onChange={(e) => setIsActive(e.target.value === "active")}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="disabled">Disabled</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl cursor-pointer"
                >
                  <HiOutlineCheck className="text-base" />
                  {isSaving ? "Saving..." : editingUser ? "Update User" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-sm w-full p-6 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <HiOutlineTrash className="text-2xl" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Delete Admin User?</h3>
            <p className="text-xs text-slate-500 mt-1 mb-5">
              Are you sure you want to permanently delete admin account{" "}
              <strong className="text-slate-800">&quot;{deleteTarget.username}&quot;</strong> ({deleteTarget.email})?
              This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                {isDeleting ? "Deleting..." : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

