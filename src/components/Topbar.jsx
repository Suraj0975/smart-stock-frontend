import { useState } from "react";
import { Bell, Menu, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

export default function Topbar({ onMenuClick }) {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function handleSearch(e) {
    if (e.key === "Enter" && query.trim()) {
      // Redirect directly to your active market watchlist with the search term
      navigate(`/market-watchlist?search=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-[76px] items-center gap-3 border-b border-slate-200 bg-white/90 px-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 sm:gap-4 sm:px-7">
      <button
        type="button"
        className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 lg:hidden"
        onClick={onMenuClick}
        aria-label="Open navigation"
      >
        <Menu size={21} />
      </button>

      <div className="relative hidden max-w-md flex-1 sm:block">
        <Search
          size={17}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          className="input w-full border-transparent bg-slate-50 pl-9 focus:border-blue-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          placeholder="Search inventory, stocks, or assets..."
          aria-label="Search inventory"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <span className="hidden text-sm text-slate-500 dark:text-slate-400 xl:inline">
          Welcome back,{" "}
          <strong className="text-slate-800 dark:text-slate-100">
            {user?.name || user?.username || "Aarav"}
          </strong>
        </span>

        <ThemeToggle />

        <button
          type="button"
          className="relative rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          aria-label="Notifications"
          title="Notifications"
          onClick={() => navigate("/invoices")}
        >
          <Bell size={18} />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-orange-500" />
        </button>
      </div>
    </header>
  );
}