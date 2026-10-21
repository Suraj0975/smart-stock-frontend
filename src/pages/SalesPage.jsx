
import { useEffect, useState } from "react";

const KEY = "smart-stock-demo-portfolio";

export default function SalesPage() {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    function loadHistory() {
      try {
        const portfolio = JSON.parse(localStorage.getItem(KEY) || "{}");
        setTrades(
          Array.isArray(portfolio.history) ? portfolio.history : []
        );
      } catch {
        setTrades([]);
      }
    }

    loadHistory();
    window.addEventListener("storage", loadHistory);
    window.addEventListener("watchlist-history-updated", loadHistory);

    return () => {
      window.removeEventListener("storage", loadHistory);
      window.removeEventListener("watchlist-history-updated", loadHistory);
    };
  }, []);

  const money = (value, market) =>
    `${market === "India" ? "₹" : "$"}${Number(value || 0).toLocaleString(
      market === "India" ? "en-IN" : "en-US",
      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
    )}`;

  const total = (type, market) =>
    trades
      .filter((t) => t.type === type && t.market === market)
      .reduce((sum, t) => sum + Number(t.total || 0), 0);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Sales & Billing</h1>
        <p className="text-sm text-slate-500">
          Automatic history of simulated Market Watchlist purchases and sales.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Total spent (₹)", total("BUY", "India"), "India"],
          ["Total received (₹)", total("SELL", "India"), "India"],
          ["Total spent ($)", total("BUY", "US"), "US"],
          ["Total received ($)", total("SELL", "US"), "US"],
        ].map(([label, amount, market]) => (
          <div className="card" key={label}>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="text-xl font-bold">{money(amount, market)}</p>
          </div>
        ))}
      </div>

      <section className="card overflow-x-auto">
        <h2 className="mb-4 text-lg font-semibold">
          Buy & Sell Transaction History
        </h2>

        {!trades.length ? (
          <p className="py-6 text-center text-slate-500">
            No transactions yet. Buy or sell a stock in Market Watchlist
            and its history will appear here automatically.
          </p>
        ) : (
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="p-3">Date</th>
                <th className="p-3">Action</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Market</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Price</th>
                <th className="p-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {[...trades].reverse().map((trade, index) => (
                <tr key={trade.id || index} className="border-b">
                  <td className="p-3">
                    {trade.date ? new Date(trade.date).toLocaleString() : "—"}
                  </td>
                  <td className="p-3">
                    <span
                      className={
                        trade.type === "BUY"
                          ? "font-semibold text-blue-600"
                          : "font-semibold text-green-600"
                      }
                    >
                      {trade.type}
                    </span>
                  </td>
                  <td className="p-3">
                    <b>{trade.symbol}</b>
                    <div className="text-xs text-slate-500">{trade.name}</div>
                  </td>
                  <td className="p-3">{trade.market}</td>
                  <td className="p-3">{trade.quantity}</td>
                  <td className="p-3">{money(trade.price, trade.market)}</td>
                  <td className="p-3">{money(trade.total, trade.market)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
