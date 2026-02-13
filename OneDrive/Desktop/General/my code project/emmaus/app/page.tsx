"use client";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/toggle-theme";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
// import { DynamicBreadcrumb } from "./dashboard/layout";

export default function Home() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const [isLoading, startTransition] = useTransition();

  // ---------------------
  // Logout
  // ---------------------
  async function handleLogout() {
    startTransition(async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Logged out successfully");
            router.push("/login");
          },
          onError: () => {
            toast.error("Something went wrong");
          },
        },
      });
    });
  }

  const handleLogin = () => {
    router.push("/login");
  };

  // ---------------------
  // Loading state
  // ---------------------
  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin size-4 mr-2" />
        <span className="text-lg">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h1 className="text-3xl font-bold">Emmaus Diary</h1>
      <div className="border-b pb-3">
      </div>
      <ModeToggle />

      {session ? (
        <>
          <p>Hi, {session.user.name}</p>
          <Button onClick={handleLogout} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="animate-spin size-4 mr-2" />
                Logging out...
              </>
            ) : (
              "Logout"
            )}
          </Button>
        </>
      ) : (
        <Button onClick={handleLogin}>Login</Button>
      )}
    </div>
  );
}
