import { auth } from "@/lib/auth";
import { AuthForm } from "@/components/login-form";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session) {
    return redirect("/"); // Redirect to home page if already authenticated
  }

  return <AuthForm />;
}
