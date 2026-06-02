"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { sanitizeCallbackUrl } from "@/lib/auth-redirect";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaEye, FaEyeSlash } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";
import { IoAlertCircle } from "react-icons/io5";
import { toast } from "sonner";

function SignInForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const callbackUrl = sanitizeCallbackUrl(
    searchParams.get("callbackUrl"),
    "/dashboard",
  );
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<
    "google" | "github" | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      router.replace(callbackUrl);
    }
  }, [callbackUrl, router, session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const normalizedEmail = form.email.trim().toLowerCase();
    const password = form.password.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length === 0) {
      setError("Password is required.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email: normalizedEmail,
        password,
        callbackURL: callbackUrl,
        rememberMe: true,
      });

      if (error) {
        toast.error(
          error.message || "Invalid email or password. Please try again.",
        );
        setError(
          error.message || "Invalid email or password. Please try again.",
        );
      } else {
        const destination = data?.url ?? callbackUrl;
        toast.success("Welcome back!");
        router.replace(destination);
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
        const message = error.message || `Could not sign in with ${provider}.`;
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
    <div className="w-full max-w-md">
      <div className="mb-5 text-center">
        <h1 className="mb-1 text-2xl font-bold tracking-tight text-foreground">
          Welcome back
        </h1>
        {/* <p className="text-sm text-muted-foreground">
          Sign in to continue your learning journey.
        </p> */}
      </div>

      {error && (
        <div className="mb-5 flex items-start gap-2.5 rounded-sm border border-destructive/30 bg-destructive/10 px-4 py-3">
          <IoAlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
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
            className="w-full rounded-sm border border-border bg-input px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-xs font-semibold text-foreground"
            >
              Password
            </label>
            {/* <Link
              href="/forgot-password"
              className="text-xs text-primary hover:underline"
            >
              Forgot Password?
            </Link> */}
          </div>

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
              placeholder="••••••••"
              className="w-full rounded-sm border border-border bg-input py-2.5 pl-3.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <FaEyeSlash className="h-4 w-4" />
              ) : (
                <FaEye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-sm bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-60 cursor-pointer"
        >
          {loading && <FiLoader className="h-4 w-4 animate-spin" />}
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div className="mt-4 grid  gap-2 grid-cols-2">
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
          Google
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
          GitHub
        </button>
      </div>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">
          Don&apos;t have an account?
        </span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <Link
        href="/sign-up"
        className="flex w-full items-center justify-center rounded-sm border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-muted/60"
      >
        Create an account
      </Link>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-32 items-center justify-center">
          <FiLoader className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
