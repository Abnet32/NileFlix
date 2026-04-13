"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Check, Film, LogIn, Play, Star } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
    <main className="cinema-grid flex min-h-dvh items-center justify-center px-4 py-10">
      <section className="ott-shell grid w-full overflow-hidden rounded-3xl border border-border/80 bg-card/50 md:grid-cols-[1fr_1fr]">
        <div className="ott-poster relative hidden min-h-144 p-8 md:flex md:flex-col md:justify-between">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-secondary/70 px-3 py-1 text-xs text-muted-foreground">
            <Film className="size-3.5 text-accent" />
            Premium streaming
          </div>

          <div className="space-y-4">
            <h1 className="max-w-md text-4xl font-semibold leading-tight">
              Continue your story from where you paused.
            </h1>
            <p className="max-w-md text-sm text-muted-foreground">
              Sign in to unlock your watchlist, progress sync, and tailored
              movie recommendations.
            </p>
            <div className="grid gap-2 text-sm text-muted-foreground">
              <p className="inline-flex items-center gap-2">
                <Check className="size-4 text-accent" />
                Your playback history across all devices.
              </p>
              <p className="inline-flex items-center gap-2">
                <Check className="size-4 text-accent" />
                Personalized recommendations each day.
              </p>
            </div>
            <div className="rounded-xl border border-border/70 bg-background/30 p-3">
              <p className="text-sm font-medium">
                Now streaming: Night Horizon
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Sci-Fi • 2h 04m • 4K
              </p>
              <p className="mt-2 inline-flex items-center gap-1 text-xs text-accent">
                <Star className="size-3.5 fill-current" />
                9.1 viewer score
              </p>
            </div>
          </div>
        </div>

        <Card className="glass-panel stagger-in w-full rounded-none border-0 bg-card/85 md:px-4 md:py-3">
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl">Sign in to NileFlix</CardTitle>
            <CardDescription>
              Welcome back. Your next episode is waiting.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Button
              type="button"
              onClick={signInWithGoogle}
              disabled={socialLoading || loading}
              variant="secondary"
              className="h-10 w-full"
            >
              {socialLoading ? "Connecting..." : "Continue with Google"}
            </Button>

            <div className="my-5">
              <Separator />
              <p className="-mt-2 text-center text-xs text-muted-foreground">
                <span className="bg-card px-2">or sign in with email</span>
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                  placeholder="you@example.com"
                  className="h-10"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
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
                  placeholder="Your password"
                  className="h-10"
                  required
                />
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox
                  id="remember"
                  checked={form.rememberMe}
                  onCheckedChange={(checked) =>
                    setForm((current) => ({
                      ...current,
                      rememberMe: Boolean(checked),
                    }))
                  }
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-normal text-muted-foreground"
                >
                  Keep me signed in
                </Label>
              </div>

              {errorMessage ? (
                <p
                  role="alert"
                  className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                  {errorMessage}
                </p>
              ) : null}

              <Button
                type="submit"
                className="h-10 w-full gap-2"
                disabled={loading || socialLoading}
              >
                <LogIn className="size-4" />
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="mt-4 rounded-lg border border-border/60 bg-background/35 p-3 text-xs text-muted-foreground">
              Tip: Use the same account on TV and mobile to keep your watch
              progress synced.
              <p className="mt-2 inline-flex items-center gap-1 text-accent">
                <Play className="size-3.5" />
                Resume in one tap.
              </p>
            </div>

            <p className="mt-5 text-center text-sm text-muted-foreground">
              New to NileFlix?{" "}
              <Link
                href="/sign-up"
                className={buttonVariants({ variant: "link" })}
              >
                Create an account
              </Link>
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
