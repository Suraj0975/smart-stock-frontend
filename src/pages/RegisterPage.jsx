import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const { register: createAccount } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const password = watch("password");

  const onSubmit = async ({
    confirmPassword,
    ...values
  }) => {
    setBusy(true);

    try {
      await createAccount(values);
      toast.success("Registration submitted.");

      // Navigate only if the backend created a login session.
      if (
        localStorage.getItem("smartstock_token") &&
        localStorage.getItem("smartstock_user")
      ) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    } catch (error) {
      toast.error(
        error.message || "Could not create account."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <p className="text-sm font-semibold text-blue-600">
        GET STARTED
      </p>

      <h1 className="mt-2 text-3xl font-bold tracking-tight">
        Create your account
      </h1>

      <p className="mt-2 text-sm text-slate-500">
        Set up your workspace to manage stock and sales.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-7 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Full name
          </label>

          <input
            className="input mt-2"
            placeholder="Your name"
            {...register("name", {
              required: "Name is required"
            })}
          />

          {errors.name && (
            <p className="mt-1 text-xs text-red-600">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Email address
          </label>

          <input
            className="input mt-2"
            type="email"
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
            placeholder="At least 8 characters"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Use at least 8 characters"
              }
            })}
          />

          {errors.password && (
            <p className="mt-1 text-xs text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700">
            Confirm password
          </label>

          <input
            className="input mt-2"
            type="password"
            placeholder="Re-enter your password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password ||
                "Passwords do not match"
            })}
          />

          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          className="btn-primary w-full"
          disabled={busy}
          type="submit"
        >
          {busy ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-500">
        Already have an account?{" "}
        <Link
          className="font-semibold text-blue-600"
          to="/login"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}