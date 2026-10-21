import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import api from "../lib/axios";
import PageHeader from "../components/PageHeader";
import LoadingSpinner from "../components/LoadingSpinner";

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    let active = true;

    api
      .get(`/products/${id}`)
      .then(({ data }) => {
        if (!active) return;

        const product = data.data || data.product || data;
        reset({
          name: product.name || "",
          sku: product.sku || "",
          description: product.description || "",
          costPrice: product.costPrice ?? 0,
          sellingPrice:
            product.sellingPrice ?? product.price ?? 0,
          quantity: product.quantity ?? product.stock ?? 0,
          reorderLevel: product.reorderLevel ?? 5
        });
      })
      .catch((error) => {
        toast.error(
          error.message || "Could not load this product."
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, reset]);

  async function onSubmit(values) {
    setBusy(true);

    try {
      const payload = {
        ...values,
        costPrice: Number(values.costPrice),
        sellingPrice: Number(values.sellingPrice),
        quantity: Number(values.quantity),
        reorderLevel: Number(values.reorderLevel)
      };

      await api.put(`/products/${id}`, payload);

      toast.success("Product updated.");
      navigate("/products");
    } catch (error) {
      toast.error(error.message || "Could not update product.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Edit product"
        description="Update an existing product."
        action={
          <Link className="btn-secondary" to="/products">
            Back to products
          </Link>
        }
      />

      {loading ? (
        <div className="card">
          <LoadingSpinner label="Loading product..." />
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="card max-w-3xl space-y-5"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-medium">
              Product name
              <input
                className="input mt-2"
                {...register("name", {
                  required: "Product name is required"
                })}
              />
              {errors.name && (
                <span className="text-xs text-red-600">
                  {errors.name.message}
                </span>
              )}
            </label>

            <label className="text-sm font-medium">
              SKU
              <input
                className="input mt-2"
                {...register("sku", {
                  required: "SKU is required"
                })}
              />
            </label>

            <label className="text-sm font-medium">
              Cost price
              <input
                className="input mt-2"
                type="number"
                min="0"
                step="0.01"
                {...register("costPrice", {
                  valueAsNumber: true,
                  min: 0
                })}
              />
            </label>

            <label className="text-sm font-medium">
              Selling price
              <input
                className="input mt-2"
                type="number"
                min="0"
                step="0.01"
                {...register("sellingPrice", {
                  valueAsNumber: true,
                  min: 0
                })}
              />
            </label>

            <label className="text-sm font-medium">
              Quantity
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
              {busy ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      )}
    </>
  );
}