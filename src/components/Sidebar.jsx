
import { NavLink, useLocation } from "react-router-dom";
import {
  Activity,
  BarChart3,
  BrainCircuit,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  Users,
  X,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const groups = [
  {
    label: "WORKSPACE",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "OPERATIONS",
    items: [
      { to: "/sales", label: "Sales & Billing", icon: ShoppingCart },
      { to: "/invoices", label: "Invoices", icon: FileText },
    ],
  },
  {
    label: "INTELLIGENCE",
    items: [
      { to: "/ai-predictions", label: "AI Predictions", icon: BrainCircuit },
      { to: "/analytics", label: "Analytics", icon: BarChart3 },
      { to: "/reports", label: "Reports", icon: ClipboardList },
      { to: "/market-watchlist", label: "Market Watchlist", icon: TrendingUp },
    ],
  },
  {
    label: "ADMINISTRATION",
    items: [
      { to: "/users", label: "Users", icon: Users },
      { to: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

export default function Sidebar({ open = false, onClose = () => {} }) {
  const { logout, user } = useAuth();
  const location = useLocation();

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform dark:border-slate-800 dark:bg-slate-900 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[76px] items-center justify-between border-b border-slate-100 px-5 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white">
              <Activity size={22} />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-slate-100">
                Smart Stock AI
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Inventory intelligence
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
          {groups.map((group) => (
            <section key={group.label}>
              <p className="mb-2 px-3 text-[10px] font-bold tracking-[0.16em] text-slate-400">
                {group.label}
              </p>

              <div className="space-y-1">
                {group.items.map(({ to, label, icon: Icon }) => {
                  const active =
                    location.pathname === to ||
                    (["/products", "/purchases", "/sales"].includes(to) &&
                      location.pathname.startsWith(`${to}/`));

                  return (
                    <NavLink
                      key={to}
                      to={to}
                      onClick={onClose}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                        active
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                      }`}
                    >
                      <Icon size={18} />
                      {label}
                    </NavLink>
                  );
                })}
              </div>
            </section>
          ))}
        </nav>

        <div className="border-t border-slate-100 p-4 dark:border-slate-800">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
              {(user?.name || user?.username || "U").slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                {user?.name || user?.username || "User"}
              </p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                {user?.email || user?.role || "Signed in"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 dark:text-slate-300 dark:hover:bg-red-950 dark:hover:text-red-300"
          >
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
