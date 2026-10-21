import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, Package, ShoppingCart, ArrowUpRight } from "lucide-react";
import PageHeader from "../components/PageHeader";

const KEY = "smart-stock-demo-portfolio";

export default function ReportsPage() {
  const [stats, setStats] = useState({
    totalTrades: 0,
    holdingsCount: 0,
    totalVolume: 0,
  });

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "null");
      if (saved) {
        const history = Array.isArray(saved.history) ? saved.history : [];
        const holdings = saved.holdings || {};
        const volume = history.reduce((sum, t) => sum + Number(t.total || 0), 0);

        setStats({
          totalTrades: history.length,
          holdingsCount: Object.keys(holdings).length,
          totalVolume: volume,
        });
      }
    } catch {
      setStats({ totalTrades: 0, holdingsCount: 0, totalVolume: 0 });
    }
  }, []);

  const reports = [
    {
      title: "Sales & Performance Analytics",
      description: "Review revenue velocity trends, capital deployment, and distribution charts.",
      to: "/analytics",
      icon: BarChart3,
      badge: `${stats.totalTrades} orders logged`,
      color: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
    },
    {
      title: "Portfolio & Watchlist Assets",
      description: "Review current stock holdings, quantity balances, and simulated cash.",
      to: "/market-watchlist", // FIXED: Updated from /inventory to your actual portfolio route
      icon: Package,
      badge: `${stats.holdingsCount} active positions`,
      color: "bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400",
    },
    {
      title: "Sales Invoices & Transactions",
      description: "Browse recorded buy/sell orders, item totals, and generated invoice records.",
      to: "/invoices",
      icon: ShoppingCart,
      badge: `₹${stats.totalVolume.toLocaleString("en-IN")} volume`,
      color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Business Reports & Insights"
        description="Access centralized operational analytics, stock reports, and automated invoice ledgers."
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {reports.map(({ title, description, to, icon: Icon, badge, color }) => (
          <Link
            key={title}
            to={to}
            className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-fit rounded-xl p-3 ${color}`}>
                  <Icon size={22} />
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {badge}
                </span>
              </div>

              <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 transition-colors">
                {title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {description}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                Open report 
              </span>
              <ArrowUpRight size={16} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform dark:group-hover:text-blue-400" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}