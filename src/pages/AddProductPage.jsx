import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import api from "../lib/axios";
import PageHeader from "../components/PageHeader";

export default function AddProductPage() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [busy, setBusy] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      quantity: 0,
      reorderLevel: 5,
      costPrice: 0,
      sellingPrice: 0
    }
  });

  useEffect(() => {
    api
      .get("/categories")
      .then(({ data }) => {
        const records = Array.isArray(data)
          ? data
          : data.data || data.categories || [];

        setCategories(records);
      })
      .catch(() => {
        // The category dropdown remains usable once the API is available.
      });
  }, []);

  async function onSubmit(values) {
    setBusy(true);

    try {
      const payload = {
        ...values,
        quantity: Number(values.quantity),
        reorderLevel: Number(values.reorderLevel),
        costPrice: Number(values.costPrice),
        sellingPrice: Number(values.sellingPrice)
      };

      await api.post("/products", payload);

      toast.success("Product created successfully.");
      navigate("/products");
    } catch (error) {
      toast.error(error.message || "Could not create product.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Add product"
        description="Add a new product to your inventory."
        action={
          <Link className="btn-secondary" to="/products">
            Cancel
          </Link>
        }
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card max-w-3xl space-y-5"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-medium">
            Product name *
            <input
              className="input mt-2"
              placeholder="Wireless mouse"
              {...register("name", {
                required: "Product name is required"
              })}
            />
            {errors.name && (
              <span className="mt-1 block text-xs text-red-600">
                {errors.name.message}
              </span>
            )}
          </label>

          <label className="text-sm font-medium">
            SKU *
            <input
              className="input mt-2"
              placeholder="MOU-001"
              {...register("sku", {
                required: "SKU is required"
              })}
            />
            {errors.sku && (
              <span className="mt-1 block text-xs text-red-600">
                {errors.sku.message}
              </span>
            )}
          </label>

          <label className="text-sm font-medium">
            Category
            <select
              className="input mt-2"
              defaultValue=""
              {...register("category")}
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option
                  key={category._id}
                  value={category._id}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium">
            Cost price (₹) *
            <input
              className="input mt-2"
              type="number"
              min="0"
              step="0.01"
              {...register("costPrice", {
                required: "Cost price is required",
                valueAsNumber: true,
                min: {
                  value: 0,
                  message: "Price cannot be negative"
                }
              })}
            />
          </label>

          <label className="text-sm font-medium">
            Selling price (₹) *
            <input
              className="input mt-2"
              type="number"
              min="0"
              step="0.01"
              {...register("sellingPrice", {
                required: "Selling price is required",
                valueAsNumber: true,
                min: {
                  value: 0,
                  message: "Price cannot be negative"
                }
              })}
            />
          </label>

          <label className="text-sm font-medium">
            Opening stock
            <input
              className="input mt-2"
              type="number"
              min="0"
              {...register("quantity", {
                valueAsNumber: true,
                min: 0
              })}
            />
          </label>

          <label className="text-sm font-medium">
            Reorder level
            <input
              className="input mt-2"
              type="number"
              min="0"
              {...register("reorderLevel", {
                valueAsNumber: true,
                min: 0
              })}
            />
          </label>
        </div>

        <label className="block text-sm font-medium">
          Description
          <textarea
            className="input mt-2 min-h-24"
            placeholder="Product details..."
            {...register("description")}
          />
        </label>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
          <Link className="btn-secondary" to="/products">
            Cancel
          </Link>

          <button
            className="btn-primary"
            disabled={busy}
            type="submit"
          >
            {busy ? "Saving..." : "Save product"}
          </button>
        </div>
      </form>
    </>
  );
}