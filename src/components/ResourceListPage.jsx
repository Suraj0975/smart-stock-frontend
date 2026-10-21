import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, RefreshCw, Search } from "lucide-react";
import toast from "react-hot-toast";

import api from "../lib/axios";
import { formatCurrency, formatDate } from "../lib/utils";
import PageHeader from "./PageHeader";
import DataTable from "./DataTable";

export default function ResourceListPage({
  title,
  description,
  endpoint,
  columns,
  addLabel,
  addTo,
  searchPlaceholder
}) {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadRows() {
    setLoading(true);

    try {
      const { data } = await api.get(endpoint);

      const records = Array.isArray(data)
        ? data
        : data.data || data.items || [];

      setRows(records);
    } catch (error) {
      setRows([]);
      toast.error(error.message || `Could not load ${title.toLowerCase()}.`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRows();
  }, [endpoint]);

  const filteredRows = rows.filter((row) =>
    JSON.stringify(row)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const preparedColumns = columns.map((column) => ({
    ...column,
    render:
      column.render ||
      ((value) => {
        if (value == null || value === "") return "—";

        if (column.type === "currency") {
          return formatCurrency(value);
        }

        if (column.type === "date") {
          return formatDate(value);
        }

        if (typeof value === "object") {
          return value.name || value.email || "—";
        }

        return String(value);
      })
  }));

  return (
    <>
      <PageHeader
        title={title}
        description={description}
        action={
          <>
            <button
              className="btn-secondary"
              onClick={loadRows}
              disabled={loading}
            >
              <RefreshCw size={16} />
              Refresh
            </button>

            {addTo && (
              <Link className="btn-primary" to={addTo}>
                <Plus size={17} />
                {addLabel || "Add new"}
              </Link>
            )}
          </>
        }
      />

      <div className="card mb-4">
        <div className="relative max-w-sm">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            className="input pl-9"
            placeholder={searchPlaceholder || "Search records..."}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      <DataTable
        columns={preparedColumns}
        rows={filteredRows}
        loading={loading}
        emptyTitle={`No ${title.toLowerCase()} found`}
        emptyDescription={
          rows.length
            ? "Try a different search term."
            : "Records will appear here when they are available in your database."
        }
      />
    </>
  );
}