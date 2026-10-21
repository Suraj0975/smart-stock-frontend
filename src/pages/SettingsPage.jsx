import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Save, User, Sliders, ShieldCheck } from "lucide-react";
import PageHeader from "../components/PageHeader";

const SETTINGS_KEY = "smart-stock-app-settings";

export default function SettingsPage() {
  const { user } = useAuth();
  
  // Load saved preferences or defaults
  const [currency, setCurrency] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(SETTINGS_KEY))?.currency || "INR";
    } catch {
      return "INR";
    }
  });

  const [lowStockThreshold, setLowStockThreshold] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(SETTINGS_KEY))?.lowStockThreshold || "5";
    } catch {
      return "5";
    }
  });

  const [savedMessage, setSavedMessage] = useState(false);

  // Save settings persistently
  function handleSave(e) {
    e.preventDefault();
    const settings = { currency, lowStockThreshold };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  }

  // Fallback user profile for presentation/demo safety
  const displayUser = {
    name: user?.name || user?.username || "Aarav Sharma",
    email: user?.email || "aarav.admin@stockterminal.com",
    role: user?.role || "Lead Administrator",
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Settings & Preferences"
        description="Manage your account profile, trading currencies, and inventory alert limits."
      />

      {savedMessage && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-700 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-300 font-medium">
          ✓ Settings saved successfully! Preferences updated across the workspace.
        </div>
      )}

      <form onSubmit={handleSave} className="grid gap-6">
        {/* Account Info Section */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 mb-4">
            <User size={18} className="text-blue-600" />
            <h2 className="font-bold text-slate-900 dark:text-white">Account Information</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
              <p className="text-xs text-slate-500 uppercase font-semibold">Name</p>
              <p className="mt-1 font-medium text-slate-900 dark:text-white">
                {displayUser.name}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
              <p className="text-xs text-slate-500 uppercase font-semibold">Email</p>
              <p className="mt-1 font-medium text-slate-900 dark:text-white truncate">
                {displayUser.email}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
              <p className="text-xs text-slate-500 uppercase font-semibold">Role</p>
              <p className="mt-1 font-medium text-slate-900 dark:text-white flex items-center gap-1">
                <ShieldCheck size={14} className="text-emerald-600" />
                {displayUser.role}
              </p>
            </div>
          </div>
        </section>

        {/* Dashboard Preferences Section */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2 mb-4">
            <Sliders size={18} className="text-purple-600" />
            <h2 className="font-bold text-slate-900 dark:text-white">Dashboard Preferences</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                Display Currency
              </label>
              <select
                className="input w-full"
                value={currency}
                onChange={(event) => setCurrency(event.target.value)}
              >
                <option value="INR">Indian Rupee (₹ INR)</option>
                <option value="USD">US Dollar ($ USD)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                Default Low-Stock Warning Threshold
              </label>
              <input
                className="input w-full"
                type="number"
                min="0"
                value={lowStockThreshold}
                onChange={(event) => setLowStockThreshold(event.target.value)}
              />
              <p className="mt-1 text-xs text-slate-500">
                Alerts will trigger when inventory quantities fall below this number.
              </p>
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button type="submit" className="btn-primary flex items-center gap-2">
            <Save size={16} />
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}