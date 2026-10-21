
import { Outlet } from "react-router-dom";
import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function DashboardLayout() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <Sidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <div className="min-h-screen lg:pl-64">
        <Topbar onMenuClick={() => setMenuOpen(true)} />

        <main className="mx-auto max-w-[1600px] p-4 sm:p-7">
          <Outlet />
        </main>

        <footer className="px-7 pb-6 text-center text-xs text-slate-400">
          Smart Stock AI · Inventory intelligence for growing businesses
        </footer>
      </div>
    </div>
  );
}
