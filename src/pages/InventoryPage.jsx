import ResourceListPage from "../components/ResourceListPage";

export default function InventoryPage() {
  return (
    <ResourceListPage
      title="Inventory"
      description="Monitor stock levels and identify products that need restocking."
      endpoint="/products"
      searchPlaceholder="Search inventory..."
      columns={[
        { key: "name", label: "Product" },
        { key: "sku", label: "SKU" },
        { key: "quantity", label: "Quantity" },
        { key: "reorderLevel", label: "Reorder level" }
      ]}
    />
  );
}