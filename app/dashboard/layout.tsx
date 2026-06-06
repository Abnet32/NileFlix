import { AppSidebar } from "@/components/app-sidebar";
import DashboardHeader from "@/components/dashboard-header";
import ScrollToTop from "@/components/scroll-to-top";
import AiChatWrapper from "@/components/ai-chat-wrapper";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in?callbackUrl=/dashboard");
  }

  const user = {
    name: session.user.name ?? "NileFlix Member",
    email: session.user.email ?? "",
    avatar: session.user.image ?? "/avatar.png",
  };

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <DashboardHeader />
        {children}
        <ScrollToTop />
        <AiChatWrapper />
      </SidebarInset>
    </SidebarProvider>
  );
}
