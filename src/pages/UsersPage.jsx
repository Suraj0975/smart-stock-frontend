import { useEffect, useState } from "react";
import { UserPlus, Shield, Mail, Calendar, Trash2 } from "lucide-react";
import PageHeader from "../components/PageHeader";

const USERS_KEY = "smart-stock-demo-users";

const defaultUsers = [
  { id: "1", name: "Aarav Sharma", email: "aarav@example.com", role: "Administrator", createdAt: "2026-01-15" },
  { id: "2", name: "Priya Patel", email: "priya@example.com", role: "Active Trader", createdAt: "2026-02-10" },
  { id: "3", name: "Rohan Verma", email: "rohan@example.com", role: "Viewer", createdAt: "2026-03-01" },
];

export default function UsersPage() {
  const [users, setUsers] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(USERS_KEY) || "null");
      return Array.isArray(saved) && saved.length > 0 ? saved : defaultUsers;
    } catch {
      return defaultUsers;
    }
  });

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "Active Trader" });

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  function handleAddUser(e) {
    e.preventDefault();
    if (!form.name || !form.email) return;

    const newUser = {
      id: Date.now().toString(),
      name: form.name,
      email: form.email,
      role: form.role,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setUsers([newUser, ...users]);
    setForm({ name: "", email: "", role: "Active Trader" });
    setShowModal(false);
  }

  function deleteUser(id) {
    setUsers(users.filter((u) => u.id !== id));
  }

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Accounts & Roles"
        description="Manage workspace users, permissions, and security roles."
        action={
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <UserPlus size={16} />
            Add New User
          </button>
        }
      />

      {/* Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          className="input flex-1"
          placeholder="Search users by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[650px]">
          <thead>
            <tr className="border-b text-slate-500 dark:border-slate-800">
              <th className="p-3">User Name</th>
              <th className="p-3">Email Address</th>
              <th className="p-3">Assigned Role</th>
              <th className="p-3">Joined Date</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                <td className="p-3 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0)}
                  </div>
                  {user.name}
                </td>
                <td className="p-3 text-slate-600 dark:text-slate-400 flex items-center gap-1.5 pt-4">
                  <Mail size={14} className="text-slate-400" />
                  {user.email}
                </td>
                <td className="p-3">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                    user.role === "Administrator"
                      ? "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300"
                      : user.role === "Active Trader"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                      : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  }`}>
                    <Shield size={12} />
                    {user.role}
                  </span>
                </td>
                <td className="p-3 text-slate-500 text-xs">
                  {user.createdAt}
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                    title="Remove User"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <p className="py-12 text-center text-sm text-slate-500">No users found matching your search.</p>
        )}
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Add New User</h2>
            <p className="text-xs text-slate-500 mb-4">Create a new account profile and assign access permissions.</p>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Full Name</label>
                <input
                  className="input w-full"
                  placeholder="e.g. Amit Kumar"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Email Address</label>
                <input
                  type="email"
                  className="input w-full"
                  placeholder="e.g. amit@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Role Permission</label>
                <select
                  className="input w-full"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="Administrator">Administrator</option>
                  <option value="Active Trader">Active Trader</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}