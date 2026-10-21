import { useEffect, useState } from "react";

const KEY = "smart-stock-demo-portfolio";

export default function InvoicesPage() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    function loadTransactions() {
      try {
        const saved = JSON.parse(localStorage.getItem(KEY) || "null");
        if (saved && Array.isArray(saved.history)) {
          // Sort newest first
          setTransactions([...saved.history].reverse());
        } else {
          setTransactions([]);
        }
      } catch {
        setTransactions([]);
      }
    }

    loadTransactions();

    // Listen for real-time updates when a trade is executed
    window.addEventListener("watchlist-history-updated", loadTransactions);
    return () => {
      window.removeEventListener("watchlist-history-updated", loadTransactions);
    };
  }, []);

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-bold">Transaction & Sales Invoices</h2>
        <p className="mb-4 text-sm text-slate-500">
          Complete history of all simulated stock purchases and sales.
        </p>

        {transactions.length === 0 ? (
          <p className="text-sm text-slate-500">
            No invoices or trade records found yet. Go to the Market Watchlist and execute a trade!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b dark:border-slate-700">
                  <th className="p-3">Invoice ID</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Symbol</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Total Amount</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((item, index) => (
                  <tr
                    key={item.id || index}
                    className="border-b dark:border-slate-800"
                  >
                    <td className="p-3 font-mono text-xs">{item.id}</td>
                    <td className="p-3">
                      <span
                        className={`inline-block rounded px-2 py-1 text-xs font-bold ${
                          item.type === "BUY"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>
                    <td className="p-3 font-bold">{item.symbol}</td>
                    <td className="p-3">{item.quantity}</td>
                    <td className="p-3">
                      {item.market === "India" ? "₹" : "$"}{Number(item.price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 font-semibold">
                      {item.market === "India" ? "₹" : "$"}{Number(item.total).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-slate-500">
                      {item.date ? new Date(item.date).toLocaleString("en-IN") : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}