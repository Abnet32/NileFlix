"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Check, Shield, Sparkles, Star, UserPlus } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";

type SignUpState = {
  name: string;
  email: string;
  password: string;
  image: string;
};

const initialState: SignUpState = {
  name: "",
  email: "",
  password: "",
  image: "",
};

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState<SignUpState>(initialState);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!form.name.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!form.email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (form.password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    await authClient.signUp.email(
      {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        image: form.image.trim() || undefined,
        callbackURL: "/",
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
          setErrorMessage(ctx.error.message || "Unable to create account.");
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
            <Sparkles className="size-3.5 text-accent" />
            7-day premium trial
          </div>
          <div className="space-y-4">
            <h1 className="max-w-md text-4xl font-semibold leading-tight">
              Build your profile and dive into blockbuster storytelling.
            </h1>
            <p className="max-w-md text-sm text-muted-foreground">
              Join in minutes and unlock personalized rows, seamless resume, and
              multi-device playback.
            </p>
            <div className="grid gap-2 text-sm text-muted-foreground">
              <p className="inline-flex items-center gap-2">
                <Check className="size-4 text-accent" />
                Personalized homepage from day one.
              </p>
              <p className="inline-flex items-center gap-2">
                <Check className="size-4 text-accent" />
                Download and watch offline on mobile.
              </p>
              <p className="inline-flex items-center gap-2">
                <Check className="size-4 text-accent" />
                Cancel anytime with no lock-in.
              </p>
            </div>
            <div className="rounded-xl border border-border/70 bg-background/35 p-3 text-xs text-muted-foreground">
              <p className="inline-flex items-center gap-1 text-sm font-medium text-foreground">
                <Shield className="size-4 text-accent" />
                Private and secure account setup
              </p>
              <p className="mt-1">
                Your login credentials are encrypted and protected.
              </p>
              <p className="mt-2 inline-flex items-center gap-1 text-accent">
                <Star className="size-3.5 fill-current" />
                Trusted by 2M+ streamers
              </p>
            </div>
          </div>
        </div>

        <Card className="glass-panel stagger-in w-full rounded-none border-0 bg-card/85 md:px-4 md:py-3">
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl">Create your account</CardTitle>
            <CardDescription>
              Start your streaming journey with NileFlix today.
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
                <span className="bg-card px-2">or create with email</span>
              </p>
            </div>

            <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Ada Lovelace"
                  className="h-10"
                  required
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
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
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      password: event.target.value,
                    }))
                  }
                  placeholder="Minimum 8 characters"
                  className="h-10"
                  minLength={8}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="image">Avatar URL (optional)</Label>
                <Input
                  id="image"
                  type="url"
                  autoComplete="url"
                  value={form.image}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      image: event.target.value,
                    }))
                  }
                  placeholder="https://example.com/avatar.png"
                  className="h-10"
                />
              </div>

              {errorMessage ? (
                <p
                  role="alert"
                  className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive md:col-span-2"
                >
                  {errorMessage}
                </p>
              ) : null}

              <Button
                type="submit"
                className="h-10 w-full gap-2 md:col-span-2"
                disabled={loading || socialLoading}
              >
                <UserPlus className="size-4" />
                {loading ? "Creating account..." : "Create account"}
              </Button>
            </form>

            <div className="mt-4 rounded-lg border border-border/60 bg-background/35 p-3 text-xs text-muted-foreground">
              Your free trial starts immediately after registration. No hidden
              setup fees.
            </div>

            <p className="mt-5 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className={buttonVariants({ variant: "link" })}
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
