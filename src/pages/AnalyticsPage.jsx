import { useEffect, useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { TrendingUp, TrendingDown, Activity, PieChart as PieIcon, ShieldAlert, Award } from "lucide-react";

const KEY = "smart-stock-demo-portfolio";
const COLORS = ["#2563eb", "#7c3aed", "#db2777", "#ea580c", "#16a34a", "#0891b2"];

export default function AnalyticsPage() {
  const [history, setHistory] = useState([]);
  const [holdings, setHoldings] = useState({});
  const [cash, setCash] = useState(1000000);

  function loadAnalytics() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "null");
      if (saved) {
        setHistory(Array.isArray(saved.history) ? saved.history : []);
        setHoldings(saved.holdings || {});
        setCash(saved.cash || 1000000);
      }
    } catch {
      setHistory([]);
    }
  }

  useEffect(() => {
    loadAnalytics();
    window.addEventListener("watchlist-history-updated", loadAnalytics);
    return () => {
      window.removeEventListener("watchlist-history-updated", loadAnalytics);
    };
  }, []);

  // Compute advanced metrics
  const metrics = useMemo(() => {
    let totalInvested = 0;
    let buyCount = 0;
    let sellCount = 0;

    const timelineMap = {};
    let cumulative = 0;

    history.forEach((tx) => {
      const amount = Number(tx.total || 0);
      if (tx.type === "BUY") {
        totalInvested += amount;
        buyCount++;
        cumulative += amount;
      } else {
        sellCount++;
        cumulative -= amount;
      }

      const dateStr = new Date(tx.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" });
      timelineMap[dateStr] = (timelineMap[dateStr] || 0) + amount;
    });

    const trendData = Object.entries(timelineMap).map(([date, volume]) => ({
      date,
      volume: Math.round(volume),
    }));

    const holdingsArray = Object.entries(holdings).map(([symbol, h]) => ({
      name: symbol,
      value: Math.round(h.quantity * (h.averagePrice || 100)),
    }));

    return {
      totalInvested,
      totalTrades: history.length,
      buyCount,
      sellCount,
      trendData,
      holdingsArray,
    };
  }, [history, holdings]);

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Performance & Analytics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Advanced metrics, portfolio distribution, and trading volume analysis.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Available Cash</span>
            <Activity size={18} className="text-blue-600" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            ₹{Number(cash).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </p>
          <span className="mt-1 inline-block text-xs text-slate-500">Starting baseline: ₹10,00,000</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Capital Deployed</span>
            <TrendingUp size={18} className="text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            ₹{metrics.totalInvested.toLocaleString("en-IN")}
          </p>
          <span className="mt-1 inline-block text-xs text-emerald-600 font-medium">Active asset commitment</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Execution Ratio</span>
            <Award size={18} className="text-violet-600" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {metrics.buyCount} <span className="text-sm font-normal text-slate-400">Buys</span> / {metrics.sellCount} <span className="text-sm font-normal text-slate-400">Sells</span>
          </p>
          <span className="mt-1 inline-block text-xs text-slate-500">{metrics.totalTrades} total logged orders</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Unique Assets Held</span>
            <PieIcon size={18} className="text-amber-600" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {Object.keys(holdings).length}
          </p>
          <span className="mt-1 inline-block text-xs text-slate-500">Diversified positions</span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Area Trend Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
          <div className="flex items-center justify-between pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Trading Volume Velocity</h2>
              <p className="text-xs text-slate-500">Aggregated capital flow across execution timestamps</p>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            {metrics.trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics.trendData}>
                  <defs>
                    <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`, "Volume"]} />
                  <Area type="monotone" dataKey="volume" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorVolume)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center text-slate-400">
                <Activity size={32} className="mb-2 opacity-40" />
                <p className="text-sm">No transaction velocity recorded yet.</p>
                <p className="text-xs text-slate-400">Execute trades in your watchlist to generate real-time curves.</p>
              </div>
            )}
          </div>
        </div>

        {/* Portfolio Distribution Pie Chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Asset Allocation</h2>
            <p className="text-xs text-slate-500">Distribution across active portfolio holdings</p>
          </div>

          <div className="h-72 w-full flex items-center justify-center pt-2">
            {metrics.holdingsArray.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metrics.holdingsArray}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={45}
                    paddingAngle={4}
                  >
                    {metrics.holdingsArray.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => [`₹${val.toLocaleString("en-IN")}`, "Est Value"]} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-slate-400">
                <PieIcon size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No active asset allocations.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}