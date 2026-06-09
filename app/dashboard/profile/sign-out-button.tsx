"use client";

import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.replace("/");
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="inline-flex items-center gap-2 rounded-sm border border-destructive/30 bg-destructive/10 px-6 py-2.5 text-sm font-medium text-destructive transition-all duration-200 hover:bg-destructive/20 active:scale-95"
    >
      <LogOut className="size-4" />
      Sign Out
    </button>
  );
}
