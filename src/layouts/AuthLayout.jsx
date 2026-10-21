import { Activity } from "lucide-react";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <main className="grid min-h-screen bg-slate-50 lg:grid-cols-2">
      <section className="hidden flex-col justify-between bg-slate-950 p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-600 p-3">
            <Activity size={23} />
          </div>

          <span className="text-lg font-bold">
            Smart Stock AI
          </span>
        </div>

        <div className="max-w-lg">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
            Inventory, made intelligent
          </p>

          <h1 className="text-4xl font-bold leading-tight">
            Know what you have. Predict what you need.
          </h1>

          <p className="mt-5 leading-7 text-slate-300">
            Manage products, track sales, and make better
            restocking decisions from one workspace.
          </p>
        </div>

        <p className="text-xs text-slate-500">
          Smart Stock AI · Student project
        </p>
      </section>

      <section className="grid place-items-center p-5 sm:p-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
            <div className="rounded-xl bg-blue-600 p-2.5 text-white">
              <Activity size={22} />
            </div>

            <span className="font-bold">Smart Stock AI</span>
          </div>

          <Outlet />
        </div>
      </section>
    </main>
  );
}