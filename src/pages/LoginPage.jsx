import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [busy, setBusy] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (values) => {
    setBusy(true);

    try {
      await login(values);
      toast.success("Welcome back!");

      navigate(
        location.state?.from?.pathname || "/dashboard",
        { replace: true }
      );
    } catch (error) {
      toast.error(error.message || "Could not sign in.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <p className="text-sm font-semibold text-blue-600">
        WELCOME BACK
      </p>

      <h1 className="mt-2 text-3xl font-bold tracking-tight">
        Sign in to your account
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        Manage your products and sales in one place.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-5"
      >
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Email address
          </label>

          <input
            className="input mt-2"
            type="email"
            autoComplete="email"
            placeholder="you@business.com"
            {...register("email", {
              required: "Email is required"
            })}
          />

          {errors.email && (
            <p className="mt-1 text-xs text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Password
          </label>

          <input
            className="input mt-2"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            {...register("password", {
              required: "Password is required"
            })}
          />

          {errors.password && (
            <p className="mt-1 text-xs text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          className="btn-primary w-full"
          disabled={busy}
          type="submit"
        >
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        New to Smart Stock AI?{" "}
        <Link
          className="font-semibold text-blue-600 hover:text-blue-700"
          to="/register"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}