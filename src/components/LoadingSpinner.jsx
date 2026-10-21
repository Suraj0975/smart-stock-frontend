export default function LoadingSpinner({
  label = "Loading..."
}) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-3 text-sm text-slate-500">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-blue-100 border-t-blue-600" />
      {label}
    </div>
  );
}