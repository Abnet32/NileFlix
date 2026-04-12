"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { authClient } from "@/lib/auth-client";

type SignInState = {
  email: string;
  password: string;
  rememberMe: boolean;
};

const initialState: SignInState = {
  email: "",
  password: "",
  rememberMe: true,
};

export default function SignInPage() {
  const router = useRouter();
  const [form, setForm] = useState<SignInState>(initialState);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!form.email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (!form.password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    await authClient.signIn.email(
      {
        email: form.email.trim(),
        password: form.password,
        callbackURL: "/",
        rememberMe: form.rememberMe,
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          setLoading(false);
          router.push("/");
        },
        onError: (ctx) => {
          setLoading(false);
          setErrorMessage(ctx.error.message || "Unable to sign in.");
        },
      },
    );
  };

  const signInWithGoogle = async () => {
    setErrorMessage(null);
    setSocialLoading(true);

    await authClient.signIn.social(
      {
        provider: "google",
        callbackURL: "/",
      },
      {
        onError: (ctx) => {
          setSocialLoading(false);
          setErrorMessage(ctx.error.message || "Google sign-in failed.");
        },
      },
    );
  };

  return (
    <main className="auth-shell">
      <section className="auth-card auth-pop">
        <p className="auth-eyebrow">Welcome Back</p>
        <h1 className="auth-title">Sign in to NileFlix</h1>
        <p className="auth-subtitle">
          Pick up where you left off across every device.
        </p>

        <button
          type="button"
          onClick={signInWithGoogle}
          disabled={socialLoading || loading}
          className="auth-social"
        >
          {socialLoading ? "Connecting..." : "Continue with Google"}
        </button>

        <div className="auth-divider" aria-hidden>
          <span>or sign in with email</span>
        </div>

        <form onSubmit={onSubmit} className="auth-form">
          <label className="auth-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(event) =>
              setForm((current) => ({ ...current, email: event.target.value }))
            }
            className="auth-input"
            placeholder="you@example.com"
            required
          />

          <label className="auth-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                password: event.target.value,
              }))
            }
            className="auth-input"
            placeholder="Your password"
            required
          />

          <label className="auth-check">
            <input
              type="checkbox"
              checked={form.rememberMe}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  rememberMe: event.target.checked,
                }))
              }
            />
            <span>Keep me signed in</span>
          </label>

          {errorMessage ? (
            <p className="auth-error" role="alert">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading || socialLoading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="auth-footnote">
          New to NileFlix? <Link href="/sign-up">Create an account</Link>
        </p>
      </section>
    </main>
  );
}
