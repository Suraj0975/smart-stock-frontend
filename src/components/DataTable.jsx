import EmptyState from "./EmptyState";
import LoadingSpinner from "./LoadingSpinner";

export default function DataTable({
  columns = [],
  rows = [],
  loading = false,
  rowKey = "_id",
  emptyTitle,
  emptyDescription,
  renderActions
}) {
  if (loading) {
    return (
      <div className="card">
        <LoadingSpinner label="Loading records..." />
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="card">
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="whitespace-nowrap px-5 py-3.5 font-semibold"
                >
                  {column.label}
                </th>
              ))}

              {renderActions && (
                <th className="px-5 py-3.5 text-right font-semibold">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.map((row, index) => (
              <tr
                key={row[rowKey] || row.id || index}
                className="hover:bg-slate-50/70"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="whitespace-nowrap px-5 py-4 text-slate-700"
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key] ?? "—"}
                  </td>
                ))}

                {renderActions && (
                  <td className="px-5 py-4 text-right">
                    {renderActions(row)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}