export default function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "blue"
}) {
  const tones = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-violet-50 text-violet-600"
  };

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>

        {Icon && (
          <div
            className={`rounded-xl p-3 ${
              tones[tone] || tones.blue
            }`}
          >
            <Icon size={21} />
          </div>
        )}
      </div>

      {detail && (
        <p className="mt-3 text-xs text-slate-500">
          {detail}
        </p>
      )}
    </div>
  );
}