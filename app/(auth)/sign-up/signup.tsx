"use client";

export const dynamic = "force-dynamic"; // ⚡ Prevent prerendering errors

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { sanitizeCallbackUrl } from "@/lib/auth-redirect";
import type { PasswordStrength } from "@/lib/types";
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaEye, FaEyeSlash } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";
import { IoAlertCircle } from "react-icons/io5";

function getPasswordStrength(password: string): PasswordStrength {
  if (password.length < 8) return "weak";
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const score = [hasUpper, hasLower, hasNumber, hasSpecial].filter(
    Boolean,
  ).length;
  if (score >= 3) return "strong";
  if (score >= 2) return "fair";
  return "weak";
}

const strengthConfig: Record<
  PasswordStrength,
  { label: string; color: string; width: string }
> = {
  weak: { label: "Weak", color: "bg-destructive", width: "w-1/3" },
  fair: { label: "Fair", color: "bg-yellow-500", width: "w-2/3" },
  strong: { label: "Strong", color: "bg-primary", width: "w-full" },
};

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = sanitizeCallbackUrl(
    searchParams?.get("callbackUrl"),
    "/dashboard",
  );

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<
    "google" | "github" | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  const passwordStrength = form.password
    ? getPasswordStrength(form.password)
    : null;
  const passwordsMatch =
    form.confirmPassword && form.password === form.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await authClient.signUp.email({
        name: form.name,
        email: form.email,
        password: form.password,
        callbackURL: callbackUrl,
      });

      if (error) {
        toast.error(
          error.message ||
            "Could not create account. This email may already be registered.",
        );
        setError(
          error.message ||
            "Could not create account. This email may already be registered.",
        );
      } else {
        toast.success("Account created. Loading your courses.");
        router.replace(callbackUrl);
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: "google" | "github") => {
    setError(null);
    setSocialLoading(provider);

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: callbackUrl,
      });

      if (error) {
        const message = error.message || `Could not continue with ${provider}.`;
        toast.error(message);
        setError(message);
        setSocialLoading(null);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
      setError("Something went wrong. Please try again.");
      setSocialLoading(null);
    }
  };

  return (
    <div className="w-full max-w-lg">
      <div className="mb-5 text-center">
        <h1 className="mb-1 text-2xl font-bold tracking-tight text-foreground">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground">
          Join E-brary and start learning for free
        </p>
      </div>

      {error && (
        <div className="mb-5 flex items-start gap-2.5 rounded-sm border border-destructive/30 bg-destructive/10 px-4 py-3">
          <IoAlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-xs font-semibold text-foreground"
          >
            Full name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Jane Smith"
            className="w-full rounded-sm border border-border bg-input px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-xs font-semibold text-foreground"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="you@example.com"
            className="w-full rounded-sm border border-border bg-input px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-xs font-semibold text-foreground"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={8}
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
              placeholder="Min. 8 characters"
              className="w-full rounded-sm border border-border bg-input py-2.5 pl-3.5 pr-10 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <FaEyeSlash className="h-4 w-4" />
              ) : (
                <FaEye className="h-4 w-4" />
              )}
            </button>
          </div>

          {passwordStrength && (
            <div className="mt-2">
              <div className="h-1 w-full overflow-hidden rounded-sm bg-muted">
                <div
                  className={`h-full rounded-sm transition-all duration-300 ${strengthConfig[passwordStrength].color} ${strengthConfig[passwordStrength].width}`}
                />
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Strength:{" "}
                <span
                  className={
                    passwordStrength === "strong"
                      ? "text-primary font-medium"
                      : passwordStrength === "fair"
                        ? "text-yellow-500 font-medium"
                        : "text-destructive font-medium"
                  }
                >
                  {strengthConfig[passwordStrength].label}
                </span>
              </p>
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="confirm"
            className="mb-1.5 block text-xs font-semibold text-foreground"
          >
            Confirm password
          </label>
          <div className="relative">
            <input
              id="confirm"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              required
              value={form.confirmPassword}
              onChange={(e) =>
                setForm((f) => ({ ...f, confirmPassword: e.target.value }))
              }
              placeholder="Re-enter password"
              className={`w-full rounded-sm border bg-input py-2.5 pl-3.5 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 ${
                form.confirmPassword.length > 0
                  ? passwordsMatch
                    ? "border-primary focus:border-primary focus:ring-primary/20"
                    : "border-destructive focus:border-destructive focus:ring-destructive/20"
                  : "border-border focus:border-primary focus:ring-primary/20"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirm ? (
                <FaEyeSlash className="h-4 w-4" />
              ) : (
                <FaEye className="h-4 w-4" />
              )}
            </button>
          </div>
          {form.confirmPassword.length > 0 && !passwordsMatch && (
            <p className="mt-1 text-[11px] text-destructive">
              Passwords do not match
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-sm bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-60 cursor-pointer"
        >
          {loading && <FiLoader className="h-4 w-4 animate-spin" />}
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => void handleSocialSignIn("google")}
          disabled={loading || socialLoading !== null}
          className="flex w-full items-center justify-center gap-2 rounded-sm border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-muted/60 disabled:pointer-events-none disabled:opacity-60 cursor-pointer"
        >
          {socialLoading === "google" ? (
            <FiLoader className="h-4 w-4 animate-spin" />
          ) : (
            <FcGoogle />
          )}
          Continue with Google
        </button>
        <button
          type="button"
          onClick={() => void handleSocialSignIn("github")}
          disabled={loading || socialLoading !== null}
          className="flex w-full items-center justify-center gap-2 rounded-sm border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-muted/60 disabled:pointer-events-none disabled:opacity-60 cursor-pointer"
        >
          {socialLoading === "github" ? (
            <FiLoader className="h-4 w-4 animate-spin" />
          ) : (
            <FaGithub />
          )}
          Continue with GitHub
        </button>
      </div>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">
          Already have an account?
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <Link
        href="/sign-in?callbackUrl=/dashboard"
        className="flex w-full items-center justify-center rounded-sm border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted/60"
      >
        Sign in instead
      </Link>
    </div>
  );
}
