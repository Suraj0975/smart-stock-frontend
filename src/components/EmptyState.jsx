import { Inbox } from "lucide-react";

export default function EmptyState({
  title = "Nothing here yet",
  description = "When you add records, they will appear here.",
  action
}) {
  return (
    <div className="flex min-h-52 flex-col items-center justify-center px-5 py-10 text-center">
      <div className="mb-3 rounded-2xl bg-slate-100 p-3 text-slate-500">
        <Inbox size={25} />
      </div>

      <h3 className="font-semibold text-slate-800">
        {title}
      </h3>

      <p className="mt-1 max-w-sm text-sm text-slate-500">
        {description}
      </p>

      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}