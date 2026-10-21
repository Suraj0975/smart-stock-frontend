import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";

export default function AddPurchasePage() {
  return (
    <>
      <PageHeader
        title="New purchase"
        description="Record stock received from a supplier."
        action={
          <Link className="btn-secondary" to="/purchases">
            Back to purchases
          </Link>
        }
      />

      <div className="card max-w-2xl">
        <h2 className="font-semibold">
          Purchase form integration
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          The purchase form will be connected after confirming
          your backend purchase schema. It must validate supplier
          and product IDs, record received quantities, and update
          stock safely.
        </p>
      </div>
    </>
  );
}