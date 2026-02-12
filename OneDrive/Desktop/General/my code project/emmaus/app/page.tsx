"use client";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/toggle-theme";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Home() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  // ---------------------
  // Logout
  // ---------------------
  const handleLogout = async () => {
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
  };

  // ---------------------
  // Loading state
  // ---------------------
  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Checking session...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6">
      <h1 className="text-3xl font-bold">Emmaus Diary</h1>

      <ModeToggle />

      {session ? (
        <div>
          <p>Hi, {session.user.name}!</p>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      ) : (
        <Button>Login</Button>
      )}
    </div>
  );
}
