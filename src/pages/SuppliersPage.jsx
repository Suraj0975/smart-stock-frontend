import ResourceListPage from "../components/ResourceListPage";

export default function SuppliersPage() {
  return (
    <ResourceListPage
      title="Suppliers"
      description="Manage supplier details and contact information."
      endpoint="/suppliers"
      searchPlaceholder="Search suppliers..."
      columns={[
        { key: "name", label: "Supplier" },
        { key: "company", label: "Company" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" }
      ]}
    />
  );
}