import { useEffect, useState } from "react";
import {
  BrainCircuit,
  RefreshCw,
  Sparkles
} from "lucide-react";
import toast from "react-hot-toast";

const KEY = "smart-stock-demo-portfolio";

export default function AIPredictionsPage() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);

  function loadPredictions() {
    setLoading(true);
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "null");
      const holdings = saved?.holdings || {};
      const history = saved?.history || [];

      // Generate dynamic predictions based on user's portfolio and watchlist
      const generated = Object.entries(holdings).map(([symbol, holding], index) => {
        // Calculate recent activity or volume for this symbol from history
        const symbolTrades = history.filter(t => t.symbol === symbol);
        const totalBought = symbolTrades
          .filter(t => t.type === "BUY")
          .reduce((acc, t) => acc + t.quantity, 0);

        // Algorithmic forecast simulation based on holdings
        const predictedDemand = Math.max(10, holding.quantity * 2 + Math.floor(Math.random() * 25));
        const recommendedQuantity = Math.max(5, predictedDemand - holding.quantity);
        const marketName = symbolTrades[symbolTrades.length - 1]?.market || (["RELIANCE", "TCS", "HDFCBANK"].includes(symbol) ? "India" : "US");

        return {
          productId: symbol,
          productName: `${symbol} Stock / Asset`,
          market: marketName,
          currentOwned: holding.quantity,
          averagePrice: Number(holding.averagePrice || 0).toFixed(2),
          predictedDemand,
          recommendedQuantity,
          message: totalBought > 5 
            ? "High trading frequency detected. Strong momentum continuation expected." 
            : "Steady accumulation phase. Maintain balanced inventory thresholds.",
        };
      });

      // If no holdings yet, add default demo insights
      if (generated.length === 0) {
        setPredictions([
          {
            productId: "DEFAULT_1",
            productName: "AAPL (Apple Inc.)",
            market: "US",
            currentOwned: 0,
            predictedDemand: 120,
            recommendedQuantity: 50,
            message: "No active holdings. Simulated trend indicates stable bullish demand.",
          },
          {
            productId: "DEFAULT_2",
            productName: "RELIANCE (Reliance Industries)",
            market: "India",
            currentOwned: 0,
            predictedDemand: 85,
            recommendedQuantity: 30,
            message: "High regional volume projected for upcoming quarter.",
          }
        ]);
      } else {
        setPredictions(generated);
      }
      
      toast.success("AI Forecast updated successfully!");
    } catch {
      setPredictions([]);
      toast.error("Failed to generate predictions.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPredictions();
    window.addEventListener("watchlist-history-updated", loadPredictions);
    return () => {
      window.removeEventListener("watchlist-history-updated", loadPredictions);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">AI Predictions</h1>
          <p className="text-sm text-slate-500">Forecast demand and plan stock/asset restocking based on your portfolio.</p>
        </div>
        <button
          className="btn-primary flex items-center gap-2 self-start"
          onClick={loadPredictions}
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh forecast
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="card flex gap-4 bg-white p-5 rounded-xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
          <div className="h-fit rounded-xl bg-violet-50 p-3 text-violet-600 dark:bg-violet-950/50">
            <BrainCircuit size={22} />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white">Demand forecasting</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Uses your portfolio holdings and trading history to estimate future market demand and asset trajectory.
            </p>
          </div>
        </section>

        <section className="card flex gap-4 bg-white p-5 rounded-xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
          <div className="h-fit rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950/50">
            <Sparkles size={22} />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white">Restock recommendations</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Personalized allocation suggestions based on current inventory levels, market volatility, and lead metrics.
            </p>
          </div>
        </section>
      </div>

      <section className="card bg-white p-5 rounded-xl border border-slate-200 dark:bg-slate-900 dark:border-slate-800">
        {loading ? (
          <div className="py-12 text-center text-sm text-slate-500">Analyzing portfolio metrics...</div>
        ) : predictions.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {predictions.map((prediction, index) => (
              <div
                key={prediction.productId || index}
                className="rounded-xl border border-slate-200 p-4 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50"
              >
                <div className="flex justify-between items-start">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {prediction.productName}
                  </p>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {prediction.market}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="text-slate-500">
                    Current Owned: <strong className="text-slate-900 dark:text-white">{prediction.currentOwned ?? 0}</strong>
                  </div>
                  {prediction.averagePrice && (
                    <div className="text-slate-500">
                      Avg Price: <strong className="text-slate-900 dark:text-white">
                        {prediction.market === "India" ? "₹" : "$"}{Number(prediction.averagePrice).toLocaleString("en-IN")}
                      </strong>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-1 text-sm text-slate-500">
                  <p>
                    Predicted demand:{" "}
                    <strong className="text-slate-900 dark:text-white">
                      {prediction.predictedDemand} units
                    </strong>
                  </p>
                  <p>
                    Suggested restock/buy:{" "}
                    <strong className="text-violet-600 dark:text-violet-400">
                      +{prediction.recommendedQuantity} units
                    </strong>
                  </p>
                </div>

                {prediction.message && (
                  <p className="mt-3 text-xs italic text-slate-500 bg-white dark:bg-slate-900 p-2 rounded border border-slate-100 dark:border-slate-800">
                    💡 {prediction.message}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-sm text-slate-500">
            No forecasts available. Try buying some stocks in the Market Watchlist first!
          </div>
        )}
      </section>
    </div>
  );
}