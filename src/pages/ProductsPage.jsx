import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, RefreshCw, Search } from "lucide-react";
import toast from "react-hot-toast";

import api from "../lib/axios";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import { formatCurrency } from "../lib/utils";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadProducts() {
    setLoading(true);

    try {
      const { data } = await api.get("/products");

      const records = Array.isArray(data)
        ? data
        : data.data || data.products || [];

      setProducts(records);
    } catch (error) {
      setProducts([]);
      toast.error(error.message || "Could not load products.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = products.filter((product) =>
    [
      product.name,
      product.sku,
      product.brand,
      product.description
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const columns = [
    {
      key: "name",
      label: "Product",
      render: (value, row) => (
        <div>
          <p className="font-semibold text-slate-900">
            {value}
          </p>
          <p className="text-xs text-slate-500">
            {row.brand || "No brand specified"}
          </p>
        </div>
      )
    },
    {
      key: "sku",
      label: "SKU"
    },
    {
      key: "category",
      label: "Category",
      render: (value) =>
        typeof value === "object"
          ? value?.name || "—"
          : value || "—"
    },
    {
      key: "sellingPrice",
      label: "Selling price",
      render: (value, row) =>
        formatCurrency(value ?? row.price ?? 0)
    },
    {
      key: "quantity",
      label: "Stock",
      render: (value, row) => {
        const quantity = Number(value ?? row.stock ?? 0);
        const reorderLevel = Number(row.reorderLevel ?? 5);

        return (
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
              quantity <= reorderLevel
                ? "bg-orange-50 text-orange-700"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {quantity} units
          </span>
        );
      }
    }
  ];

  return (
    <>
      <PageHeader
        title="Products"
        description="Manage your catalogue, pricing, and stock levels."
        action={
          <>
            <button
              className="btn-secondary"
              onClick={loadProducts}
            >
              <RefreshCw size={16} />
              Refresh
            </button>

            <Link
              to="/products/new"
              className="btn-primary"
            >
              <Plus size={17} />
              Add product
            </Link>
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
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={filteredProducts}
        loading={loading}
        emptyTitle="No products found"
        emptyDescription="Add a product or try a different search."
        renderActions={(product) => (
          <Link
            className="font-semibold text-blue-600 hover:text-blue-800"
            to={`/products/${product._id}/edit`}
          >
            Edit
          </Link>
        )}
      />
    </>
  );
}