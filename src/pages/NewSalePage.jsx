
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingCart, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

import api from "../lib/axios";
import saleService from "../services/saleService";
import PageHeader from "../components/PageHeader";
import { formatCurrency } from "../lib/utils";

function getRecords(response) {
  const data = response?.data;

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.items)) return data.items;

  return [];
}

function productId(product) {
  return String(product?._id ?? product?.id ?? "");
}

function productName(product) {
  return product?.name ?? product?.productName ?? "Unnamed product";
}

function productPrice(product) {
  return Number(product?.sellingPrice ?? product?.price ?? 0);
}

function productStock(product) {
  return Number(product?.quantity ?? product?.stockQuantity ?? product?.stock ?? 0);
}

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}

export default function NewSalePage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [discount, setDiscount] = useState("0");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  async function loadProducts() {
    setLoading(true);

    try {
      const response = await api.get("/products");
      const records = getRecords(response);

      setProducts(records);

      if (!records.length) {
        toast("No products found. Add products to inventory first.");
      }
    } catch (error) {
      toast.error(`Could not load products: ${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !term ||
        productName(product).toLowerCase().includes(term) ||
        String(product?.brand ?? "").toLowerCase().includes(term) ||
        String(product?.sku ?? "").toLowerCase().includes(term);

      return matchesSearch;
    });
  }, [products, search]);

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
      ),
    [cart]
  );

  const discountAmount = Math.min(
    subtotal,
    Math.max(0, Number(discount) || 0)
  );

  const total = Math.max(0, subtotal - discountAmount);

  function addProduct(product) {
    const id = productId(product);
    const stock = productStock(product);
    const price = productPrice(product);

    if (!id) {
      toast.error("This product has no valid ID.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      toast.error("This product has an invalid selling price.");
      return;
    }

    if (stock <= 0) {
      toast.error("This product is out of stock.");
      return;
    }

    setCart((current) => {
      const existing = current.find((item) => item.productId === id);

      if (existing) {
        if (existing.quantity >= stock) {
          toast.error("You cannot sell more than the available stock.");
          return current;
        }

        return current.map((item) =>
          item.productId === id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...current,
        {
          productId: id,
          name: productName(product),
          unitPrice: price,
          quantity: 1,
          availableStock: stock
        }
      ];
    });
  }

  function changeQuantity(id, nextQuantity) {
    if (!Number.isInteger(nextQuantity) || nextQuantity < 1) return;

    setCart((current) =>
      current.map((item) => {
        if (item.productId !== id) return item;

        if (nextQuantity > item.availableStock) {
          toast.error(`Only ${item.availableStock} units are available.`);
          return item;
        }

        return { ...item, quantity: nextQuantity };
      })
    );
  }

  function removeProduct(id) {
    setCart((current) => current.filter((item) => item.productId !== id));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (submitting) return;

    if (!cart.length) {
      toast.error("Add at least one product to the bill.");
      return;
    }

    if (!Number.isFinite(Number(discount)) || Number(discount) < 0) {
      toast.error("Enter a valid discount amount.");
      return;
    }

    if (Number(discount) > subtotal) {
      toast.error("Discount cannot exceed the subtotal.");
      return;
    }

    // Recheck the quantities against the latest product list.
    for (const item of cart) {
      const latestProduct = products.find(
        (product) => productId(product) === item.productId
      );

      if (!latestProduct || productStock(latestProduct) < item.quantity) {
        toast.error(
          `${item.name} no longer has enough stock. Refresh products and try again.`
        );
        return;
      }
    }

    setSubmitting(true);

    try {
      const payload = {
        customerName: customerName.trim() || "Walk-in Customer",
        paymentMethod,
        discountAmount: Number(discount) || 0,
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        }))
      };

      const response = await saleService.create(payload);
      const result = response?.data;

      if (result?.success === false) {
        throw new Error(result.message || "The sale could not be recorded.");
      }

      toast.success("Sale recorded successfully. Invoice created.");
      navigate("/sales");
    } catch (error) {
      toast.error(`Sale failed: ${getErrorMessage(error)}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Record a sale"
        description="Create a bill, record payment, and deduct sold quantities from inventory."
        action={
          <Link className="btn-secondary" to="/sales">
            <ArrowLeft size={16} />
            Back to sales
          </Link>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <section className="card space-y-4 xl:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Select products</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Choose items available in your inventory.
                </p>
              </div>

              <button
                type="button"
                className="btn-secondary"
                onClick={loadProducts}
                disabled={loading || submitting}
              >
                <RefreshCw size={16} />
                Refresh stock
              </button>
            </div>

            <input
              className="input"
              placeholder="Search by product name, brand, or SKU..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              disabled={submitting}
            />

            {loading ? (
              <p className="py-8 text-center text-sm text-slate-500">
                Loading inventory...
              </p>
            ) : filteredProducts.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-500">
                No matching products found.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {filteredProducts.map((product) => {
                  const id = productId(product);
                  const stock = productStock(product);
                  const price = productPrice(product);
                  const inCart = cart.find((item) => item.productId === id);
                  const unavailable = stock <= 0;

                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-700"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {productName(product)}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {formatCurrency(price)}
                        </p>
                        <p
                          className={`mt-1 text-xs ${
                            unavailable
                              ? "text-red-500"
                              : "text-slate-500"
                          }`}
                        >
                          Available: {stock}
                          {inCart ? ` · In bill: ${inCart.quantity}` : ""}
                        </p>
                      </div>

                      <button
                        type="button"
                        className="btn-primary shrink-0"
                        onClick={() => addProduct(product)}
                        disabled={submitting || unavailable || !id}
                        title={unavailable ? "Out of stock" : "Add to bill"}
                      >
                        <Plus size={16} />
                        Add
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className="card space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Customer & payment</h2>
              <p className="mt-1 text-sm text-slate-500">
                Enter the details for this transaction.
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Customer name
              </label>
              <input
                className="input"
                placeholder="Walk-in Customer"
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                maxLength={120}
                disabled={submitting}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Payment method
              </label>
              <select
                className="input"
                value={paymentMethod}
                onChange={(event) => setPaymentMethod(event.target.value)}
                disabled={submitting}
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Discount amount
              </label>
              <input
                className="input"
                type="number"
                min="0"
                max={subtotal}
                step="0.01"
                value={discount}
                onChange={(event) => setDiscount(event.target.value)}
                disabled={submitting}
              />
              <p className="mt-1 text-xs text-slate-500">
                Enter a discount in currency units. No tax is added unless
                tax handling is configured separately.
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
              <div className="flex justify-between gap-3 text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>

              <div className="mt-3 flex justify-between gap-3 text-sm">
                <span className="text-slate-500">Discount</span>
                <span>- {formatCurrency(discountAmount)}</span>
              </div>

              <div className="mt-4 flex justify-between gap-3 border-t border-slate-200 pt-4 text-lg font-bold dark:border-slate-700">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full justify-center"
              disabled={submitting || loading || cart.length === 0}
            >
              <ShoppingCart size={17} />
              {submitting ? "Recording sale..." : "Complete sale"}
            </button>

            <p className="text-xs leading-5 text-slate-500">
              Inventory changes only after the backend accepts the sale.
              Avoid submitting the same transaction again while it is
              processing.
            </p>
          </section>
        </div>

        <section className="card">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Bill items</h2>
              <p className="mt-1 text-sm text-slate-500">
                {cart.length} product{cart.length === 1 ? "" : "s"} in this bill
              </p>
            </div>
          </div>

          {cart.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 px-4 py-10 text-center dark:border-slate-700">
              <ShoppingCart className="mx-auto mb-3 text-slate-400" size={28} />
              <p className="font-medium">Your bill is empty</p>
              <p className="mt-1 text-sm text-slate-500">
                Add products from inventory to begin.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 p-4 dark:border-slate-700"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{item.name}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {formatCurrency(item.unitPrice)} each · Stock available:{" "}
                      {item.availableStock}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="btn-secondary !p-2"
                      onClick={() =>
                        changeQuantity(item.productId, item.quantity - 1)
                      }
                      disabled={submitting || item.quantity <= 1}
                      aria-label={`Decrease ${item.name} quantity`}
                    >
                      <Minus size={15} />
                    </button>

                    <span className="w-8 text-center font-semibold">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      className="btn-secondary !p-2"
                      onClick={() =>
                        changeQuantity(item.productId, item.quantity + 1)
                      }
                      disabled={
                        submitting || item.quantity >= item.availableStock
                      }
                      aria-label={`Increase ${item.name} quantity`}
                    >
                      <Plus size={15} />
                    </button>
                  </div>

                  <div className="w-28 text-right font-semibold">
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </div>

                  <button
                    type="button"
                    className="btn-secondary !p-2"
                    onClick={() => removeProduct(item.productId)}
                    disabled={submitting}
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </form>
    </>
  );
}
