import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  DollarSign, 
  Search, 
  Filter, 
  Briefcase, 
  ArrowUpRight, 
  ArrowDownRight,
  Sparkles
} from "lucide-react";

const initialStocks = [
  ["AAPL", "Apple Inc.", "US", 252.30],
  ["MSFT", "Microsoft Corp.", "US", 512.80],
  ["NVDA", "NVIDIA Corp.", "US", 183.45],
  ["GOOGL", "Alphabet Inc.", "US", 245.10],
  ["AMZN", "Amazon.com Inc.", "US", 225.60],
  ["META", "Meta Platforms", "US", 718.25],
  ["TSLA", "Tesla Inc.", "US", 342.70],
  ["AMD", "Advanced Micro Devices", "US", 164.20],
  ["NFLX", "Netflix Inc.", "US", 1185.00],
  ["AVGO", "Broadcom Inc.", "US", 302.40],
  ["JPM", "JPMorgan Chase", "US", 289.60],
  ["WMT", "Walmart Inc.", "US", 98.75],
  ["KO", "Coca-Cola Co.", "US", 71.20],
  ["DIS", "Walt Disney Co.", "US", 119.40],
  ["ORCL", "Oracle Corp.", "US", 198.65],
  ["RELIANCE", "Reliance Industries", "India", 1450.00],
  ["TCS", "Tata Consultancy Services", "India", 3250.00],
  ["HDFCBANK", "HDFC Bank Ltd.", "India", 980.00],
  ["ICICIBANK", "ICICI Bank Ltd.", "India", 1375.00],
  ["INFY", "Infosys Ltd.", "India", 1510.00],
  ["BHARTIARTL", "Bharti Airtel", "India", 1850.00],
  ["ITC", "ITC Ltd.", "India", 410.00],
  ["SBIN", "State Bank of India", "India", 790.00],
  ["LT", "Larsen & Toubro", "India", 3650.00],
  ["TATAMOTORS", "Tata Motors", "India", 680.00],
  ["WIPRO", "Wipro Ltd.", "India", 265.00],
  ["AXISBANK", "Axis Bank Ltd.", "India", 1120.00],
  ["TATASTEEL", "Tata Steel Ltd.", "India", 155.00],
  ["MARUTI", "Maruti Suzuki", "India", 12400.00],
  ["SUNPHARMA", "Sun Pharma", "India", 1710.00],
].map(([symbol, name, market, basePrice]) => ({
  symbol,
  name,
  market,
  price: Number(basePrice),
  openPrice: Number(basePrice),
  high: Number(basePrice) * 1.025,
  low: Number(basePrice) * 0.975,
  change: 0,
  changePercent: 0,
  direction: "same",
}));

const KEY = "smart-stock-demo-portfolio";

function loadPortfolio() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "null");
    if (saved && Number.isFinite(saved.cash) && saved.holdings) {
      return {
        ...saved,
        history: Array.isArray(saved.history) ? saved.history : [],
      };
    }
  } catch {}

  return { cash: 1000000, holdings: {}, history: [] };
}

function formatCurrency(amount, market = "India") {
  const symbol = market === "India" ? "₹" : "$";
  const locale = market === "India" ? "en-IN" : "en-US";
  return `${symbol}${Number(amount).toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function MarketWatchlistPage() {
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get("search") || "";

  const [stocks, setStocks] = useState(initialStocks);
  const [portfolio, setPortfolio] = useState(loadPortfolio);
  const [search, setSearch] = useState(urlQuery);
  const [marketFilter, setMarketFilter] = useState("All");
  const [quantities, setQuantities] = useState({});
  const [message, setMessage] = useState("");

  // Keep search in sync if topbar search updates URL
  useEffect(() => {
    if (urlQuery) {
      setSearch(urlQuery);
    }
  }, [urlQuery]);

  // Live simulation ticker (random updates every 2.5s)
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks((currentStocks) =>
        currentStocks.map((stock) => {
          if (Math.random() > 0.45) return stock;

          const fluctuation = (Math.random() - 0.48) * (stock.price * 0.009);
          const newPrice = Math.max(1, stock.price + fluctuation);
          const diff = newPrice - stock.openPrice;
          const changePercent = (diff / stock.openPrice) * 100;

          const high = Math.max(stock.high, newPrice);
          const low = Math.min(stock.low, newPrice);
          const direction = newPrice > stock.price ? "up" : newPrice < stock.price ? "down" : "same";

          return {
            ...stock,
            price: Number(newPrice.toFixed(2)),
            high: Number(high.toFixed(2)),
            low: Number(low.toFixed(2)),
            change: Number(diff.toFixed(2)),
            changePercent: Number(changePercent.toFixed(2)),
            direction,
          };
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Save portfolio to local storage and sync app-wide
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(portfolio));
    window.dispatchEvent(new Event("watchlist-history-updated"));
  }, [portfolio]);

  // Filter logic
  const visibleStocks = useMemo(() => {
    const term = search.trim().toLowerCase();
    return stocks.filter((s) => {
      const matchesMarket =
        marketFilter === "All" ||
        s.market === marketFilter ||
        (marketFilter === "Owned" && portfolio.holdings[s.symbol]?.quantity > 0);

      const matchesSearch = `${s.symbol} ${s.name}`.toLowerCase().includes(term);
      return matchesMarket && matchesSearch;
    });
  }, [stocks, search, marketFilter, portfolio.holdings]);

  // Trade Execution Handler
  function trade(stock, action) {
    const quantity = Number(quantities[stock.symbol] || 1);
    const cost = stock.price * quantity;
    const owned = portfolio.holdings[stock.symbol]?.quantity || 0;

    if (!Number.isInteger(quantity) || quantity < 1) {
      setMessage("Please enter a valid whole quantity greater than 0.");
      return;
    }

    if (action === "buy" && cost > portfolio.cash) {
      setMessage("Insufficient simulated capital balance for this order.");
      return;
    }

    if (action === "sell" && quantity > owned) {
      setMessage(`Order rejected: You only own ${owned} shares of ${stock.symbol}.`);
      return;
    }

    const transaction = {
      id: `INV-${Date.now().toString().slice(-6)}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`,
      type: action.toUpperCase(),
      symbol: stock.symbol,
      name: stock.name,
      market: stock.market,
      quantity,
      price: stock.price,
      total: Number(cost.toFixed(2)),
      date: new Date().toISOString(),
    };

    setPortfolio((current) => {
      const holdings = { ...current.holdings };
      const old = holdings[stock.symbol] || { quantity: 0, averagePrice: 0 };

      if (action === "buy") {
        const newQuantity = old.quantity + quantity;
        holdings[stock.symbol] = {
          quantity: newQuantity,
          averagePrice: (old.quantity * old.averagePrice + cost) / newQuantity,
        };
      } else {
        const newQuantity = old.quantity - quantity;
        if (newQuantity === 0) {
          delete holdings[stock.symbol];
        } else {
          holdings[stock.symbol] = old;
        }
      }

      return {
        cash: current.cash + (action === "sell" ? cost : -cost),
        holdings,
        history: [...(current.history || []), transaction],
      };
    });

    setMessage(
      `✔ Order Executed: ${action.toUpperCase()} ${quantity} × ${stock.symbol} @ ${formatCurrency(stock.price, stock.market)}. Invoice logged.`
    );
  }

  // Portfolio Summary Calculations
  const holdingsEntries = Object.entries(portfolio.holdings);
  
  const { portfolioValue, totalCostBasis } = useMemo(() => {
    return holdingsEntries.reduce(
      (acc, [symbol, holding]) => {
        const stock = stocks.find((s) => s.symbol === symbol);
        const currentPrice = stock ? stock.price : holding.averagePrice;
        acc.portfolioValue += currentPrice * holding.quantity;
        acc.totalCostBasis += holding.averagePrice * holding.quantity;
        return acc;
      },
      { portfolioValue: 0, totalCostBasis: 0 }
    );
  }, [holdingsEntries, stocks]);

  const totalPnL = portfolioValue - totalCostBasis;
  const isProfit = totalPnL >= 0;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Market Watchlist & Trading Terminal
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time simulated market data, order execution, and invoice generation.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3.5 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300 w-fit border border-slate-200 dark:border-slate-700">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          Live Feed Active
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Simulated Cash</span>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            ₹{portfolio.cash.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </p>
          <span className="mt-1 inline-block text-xs text-slate-500">Starting baseline: ₹10,00,000</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Portfolio Value</span>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            ₹{portfolioValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </p>
          <span className="mt-1 inline-block text-xs text-slate-500">Mark-to-Market Valuation</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Unrealized P&L</span>
          <p className={`mt-2 text-2xl font-bold tracking-tight ${isProfit ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
            {isProfit ? "+" : ""}₹{totalPnL.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
          </p>
          <span className="mt-1 inline-block text-xs text-slate-500">Based on active positions</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Positions Held</span>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {holdingsEntries.length} Assets
          </p>
          <span className="mt-1 inline-block text-xs text-slate-500">Active portfolio holdings</span>
        </div>
      </div>

      {/* Search & Market Filter Tabs */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="input w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            placeholder="Search stock symbol, ticker, or company name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800 w-fit">
          {["All", "US", "India", "Owned"].map((tab) => (
            <button
              key={tab}
              onClick={() => setMarketFilter(tab)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                marketFilter === tab
                  ? "bg-white text-blue-600 shadow-sm dark:bg-slate-900 dark:text-blue-400"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              {tab === "US" ? "US Markets ($)" : tab === "India" ? "India (₹)" : tab === "Owned" ? "My Holdings" : "All Markets"}
            </button>
          ))}
        </div>
      </div>

      {/* System Toast Notification */}
      {message && (
        <div className="flex items-center justify-between rounded-xl bg-blue-50 border border-blue-200 p-4 text-sm text-blue-800 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300 font-medium shadow-sm">
          <span>{message}</span>
          <button className="text-xs font-bold underline hover:opacity-80" onClick={() => setMessage("")}>
            Dismiss
          </button>
        </div>
      )}

      {/* Main Watchlist & Order Execution Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[850px]">
          <thead>
            <tr className="border-b text-slate-500 dark:border-slate-800">
              <th className="p-3">Asset</th>
              <th className="p-3">Market</th>
              <th className="p-3">Live Price</th>
              <th className="p-3">24h Change</th>
              <th className="p-3">Day's Range (L / H)</th>
              <th className="p-3">Owned</th>
              <th className="p-3">Order Qty</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {visibleStocks.map((stock) => {
              const holding = portfolio.holdings[stock.symbol];
              const isUp = stock.change >= 0;

              return (
                <tr
                  key={stock.symbol}
                  className="border-b dark:border-slate-800/60 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="p-3">
                    <div className="font-bold text-slate-900 dark:text-white">{stock.symbol}</div>
                    <div className="text-xs text-slate-500">{stock.name}</div>
                  </td>
                  <td className="p-3">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {stock.market}
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded transition-all duration-300 ${
                        stock.direction === "up"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : stock.direction === "down"
                          ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                          : "text-slate-900 dark:text-white"
                      }`}
                    >
                      {formatCurrency(stock.price, stock.market)}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-flex items-center gap-1 font-semibold text-xs px-2 py-1 rounded-full ${
                        isUp
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300"
                      }`}
                    >
                      {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {isUp ? "+" : ""}{stock.changePercent}%
                    </span>
                  </td>
                  <td className="p-3 text-xs font-mono text-slate-500">
                    <div>L: {formatCurrency(stock.low, stock.market)}</div>
                    <div>H: {formatCurrency(stock.high, stock.market)}</div>
                  </td>
                  <td className="p-3 font-bold text-slate-800 dark:text-slate-200">
                    {holding?.quantity || 0}
                  </td>
                  <td className="p-3">
                    <input
                      className="input w-20 text-center font-mono py-1 text-sm border border-slate-200 dark:border-slate-700"
                      type="number"
                      min="1"
                      step="1"
                      value={quantities[stock.symbol] || "1"}
                      onChange={(e) =>
                        setQuantities((q) => ({
                          ...q,
                          [stock.symbol]: e.target.value,
                        }))
                      }
                    />
                  </td>
                  <td className="p-3 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        className="btn-primary text-xs px-3 py-1.5"
                        onClick={() => trade(stock, "buy")}
                      >
                        Buy
                      </button>
                      <button
                        className="btn-secondary text-xs px-3 py-1.5"
                        onClick={() => trade(stock, "sell")}
                      >
                        Sell
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {visibleStocks.length === 0 && (
          <div className="p-12 text-center text-sm text-slate-500">
            No stock assets match your criteria. Try adjusting your search query or filters.
          </div>
        )}
      </div>

      {/* Portfolio Positions Breakdown */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          Active Portfolio Position Summary
        </h2>

        {holdingsEntries.length === 0 ? (
          <p className="text-sm text-slate-500">
            You do not own any assets yet. Execute buy orders in the table above to build your portfolio!
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {holdingsEntries.map(([symbol, holding]) => {
              const stock = stocks.find((s) => s.symbol === symbol);
              const currentVal = stock ? stock.price * holding.quantity : 0;
              const costBasis = holding.averagePrice * holding.quantity;
              const pnl = currentVal - costBasis;
              const holdingIsProfit = pnl >= 0;

              return (
                <div
                  key={symbol}
                  className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white text-base">{symbol}</span>
                      <p className="text-xs text-slate-500">{stock?.name}</p>
                    </div>
                    <span className="text-xs font-semibold bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                      {holding.quantity} shares
                    </span>
                  </div>

                  <div className="text-xs space-y-1 text-slate-500 dark:text-slate-400 font-mono">
                    <div className="flex justify-between">
                      <span>Avg Cost:</span>
                      <span>{formatCurrency(holding.averagePrice, stock?.market)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Valuation:</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {formatCurrency(currentVal, stock?.market)}
                      </span>
                    </div>
                  </div>

                  <div className={`pt-2 border-t border-slate-200 dark:border-slate-700 text-xs font-bold flex justify-between ${
                    holdingIsProfit ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                  }`}>
                    <span>Unrealized P&L:</span>
                    <span>{holdingIsProfit ? "+" : ""}{formatCurrency(pnl, stock?.market)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}