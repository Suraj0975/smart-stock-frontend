import ResourceListPage from "../components/ResourceListPage";

export default function CategoriesPage() {
  return (
    <ResourceListPage
      title="Categories"
      description="Organise products into useful groups."
      endpoint="/categories"
      searchPlaceholder="Search categories..."
      columns={[
        { key: "name", label: "Category" },
        { key: "description", label: "Description" }
      ]}
    />
  );
}