'use client';
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/toggle-theme";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
export default function Home() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/"); // redirect to login page
          toast.success("Successfully signed out!");
        },
      },
    });
  }
  return (
    <div className="gap-4 flex flex-col items-center justify-center">
      <h1 className="text-3xl p-10">Emmaus Diary</h1>
      <Button>Emmaus</Button>
      <ModeToggle />
      {session ? (
        <div>
          <p>Hi, {session.user.name}!</p>
          <Button onClick={signOut}>Logout</Button>
        </div>
      ) : (
        <Button>Login</Button>
      )}
    </div>
  );
}
