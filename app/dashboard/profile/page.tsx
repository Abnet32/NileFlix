import ProfileStats from "@/components/profile-stats";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Shield } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import SignOutButton from "./sign-out-button";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in?callbackUrl=/dashboard/profile");
  }

  const user = session.user;
  const initials = (user.name ?? "U").slice(0, 1).toUpperCase();

  return (
    <main className="flex-1 px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-8">
        {/* Profile Header */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
          <Avatar className="size-20 ring-2 ring-border sm:size-24">
            <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} />
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-heading font-bold sm:text-3xl">
              {user.name ?? "NileFlix Member"}
            </h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="mt-1 flex items-center justify-center gap-1 text-xs text-muted-foreground sm:justify-start">
              <Shield className="size-3" />
              Member
            </p>
          </div>
        </div>

        {/* Stats */}
        <ProfileStats />

        {/* Account Info Card */}
        <div className="rounded-sm border border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur">
          <h2 className="mb-4 text-lg font-semibold">Account Details</h2>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Name</dt>
              <dd className="mt-1 text-sm font-medium">{user.name ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Email</dt>
              <dd className="mt-1 text-sm font-medium">{user.email}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Email Verified</dt>
              <dd className="mt-1 text-sm font-medium">
                {user.emailVerified ? "Verified ✅" : "Not verified"}
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Account ID</dt>
              <dd className="mt-1 text-sm font-medium font-mono text-muted-foreground">
                {user.id.slice(0, 8)}…
              </dd>
            </div>
          </dl>
        </div>

        {/* Sign Out */}
        <div className="flex justify-center">
          <SignOutButton />
        </div>
      </div>
    </main>
  );
}
