import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="grid min-h-[70vh] place-items-center">
      <div className="text-center">
        <p className="text-sm font-bold tracking-[0.2em] text-blue-600">
          404 ERROR
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Page not found
        </h1>

        <p className="mt-3 text-slate-500">
          The page you are looking for does not exist.
        </p>

        <Link
          className="btn-primary mt-6"
          to="/dashboard"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}