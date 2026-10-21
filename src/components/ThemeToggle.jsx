
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "smartstock_theme";

function readSavedTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "dark";
  } catch {
    return document.documentElement.classList.contains("dark");
  }
}

export default function ThemeToggle() {
  const [dark, setDark] = useState(readSavedTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";

    try {
      localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light");
    } catch {
      // Theme still works for this session.
    }
  }, [dark]);

  return (
    <button
      type="button"
      onClick={() => setDark((current) => !current)}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
      <span>{dark ? "Light mode" : "Dark mode"}</span>
    </button>
  );
}
