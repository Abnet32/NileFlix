"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, Send } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

import { authClient } from "@/lib/auth-client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function AuthForm() {
  const router = useRouter();

  const [emailPending, startEmailTransition] = useTransition();
  const [googlePending, startGoogleTransition] = useTransition();


  const [email, setEmail] = useState("");

  // -------------------------
  // Email
  // -------------------------

  async function signInWithEmail() {
    startEmailTransition(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email: email,
        type: "sign-in",
        fetchOptions: {
          onSuccess: () => {
            toast.success("OTP sent to your email!");
            router.push("/verify-request?email=" + email);
          },
          onError: () => {
            toast.error("Failed to send OTP. Please try again.");
          },
        },
      });
    });
  }

  // -------------------------
  // Google
  // -------------------------

  async function signInWithGoogle() {
    startGoogleTransition(async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Successfully signed in with Google!");
          },
          onError: () => {
            toast.error("Internal server error. Please try again later.");
          },
        },
      });
    });
  }

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle className="text-xl text-center">Welcome Back!</CardTitle>
        <CardDescription className="text-center">
          Login with your Google or Email Account
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {/* Google Button */}
        <Button
          variant="outline"
          onClick={signInWithGoogle}
          disabled={googlePending}
          className="w-full flex items-center gap-2"
        >
          {googlePending ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Signing in with Google...</span>
            </>
          ) : (
            <>
              <FcGoogle size={20} />
              Sign In with Google
            </>
          )}
        </Button>

        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>

        {/* Email */}
        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="email@example.com"
              required
            />
          </div>
          <Button onClick={signInWithEmail} disabled={emailPending}>
            {emailPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <Send className="size-4" />
                <span>continue with email</span>
              </>
            )}
          </Button>
        </div>

        {/* <p className="text-sm text-center text-muted-foreground">
          {isSignUp ? (
            <>
              Already have an account?{" "}
              <span
                onClick={() => setIsSignUp(false)}
                className="cursor-pointer text-primary hover:underline"
              >
                Sign In
              </span>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <span
                onClick={() => setIsSignUp(true)}
                className="cursor-pointer text-primary hover:underline"
              >
                Sign Up
              </span>
            </>
          )}
        </p> */}
      </CardContent>
    </Card>
  );
}
