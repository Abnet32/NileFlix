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
import { Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

import { authClient } from "@/lib/auth-client";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function AuthForm() {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [isSignUp, setIsSignUp] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // -------------------------
  // Email + Password
  // -------------------------

  const handleEmailAuth = () => {
    startTransition(async () => {
      if (!email || !password) {
        toast.error("Please fill all fields");
        return;
      }

      try {
        if (isSignUp) {
          await authClient.signUp.email({
            email,
            password,
            name: email.split("@")[0],
          });

          toast.success("Account created successfully!");
        } else {
          await authClient.signIn.email({
            email,
            password,
          });

          toast.success("Signed in successfully!");
        }

        router.push("/");
        router.refresh();
      } catch (error) {
        toast.error("Authentication failed");
      }
    });
  };

  // -------------------------
  // Google
  // -------------------------
  
  const handleGoogleAuth = () => {
    startTransition(async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    });
  };

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle className="text-xl text-center">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </CardTitle>
        <CardDescription className="text-center">
          {isSignUp
            ? "Sign up using email or Google"
            : "Sign in using email or Google"}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {/* Google Button */}
        <Button
          variant="outline"
          onClick={handleGoogleAuth}
          disabled={isPending}
          className="w-full flex items-center gap-2"
        >
          <FcGoogle size={20} />
          Continue with Google
        </Button>

        <div className="text-center text-sm text-muted-foreground">OR</div>

        {/* Email */}
        <div className="grid gap-2">
          <Label>Email</Label>
          <Input
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        {/* Password */}
        <div className="grid gap-2">
          <Label>Password</Label>
          <Input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button onClick={handleEmailAuth} disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="animate-spin mr-2" size={16} />
              Loading...
            </>
          ) : isSignUp ? (
            "Sign Up"
          ) : (
            "Sign In"
          )}
        </Button>

        <p className="text-sm text-center text-muted-foreground">
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
        </p>
      </CardContent>
    </Card>
  );
}
