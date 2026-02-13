"use client";

import * as React from "react";
import {
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFolder,
  IconInnerShadowTop,
  IconReport,
  IconUsers,
  IconFlask,
  IconBook,
  IconCalendar,
  IconUser,
  IconBuildingSkyscraper,
} from "@tabler/icons-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = authClient.useSession();
  const { toggleSidebar } = useSidebar();

  const adminNav = [
    { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
    { title: "Projects", url: "/dashboard/projects", icon: IconFolder },
    {
      title: "Training Management",
      url: "/dashboard/training",
      icon: IconBook,
    },
    {
      title: "Research & Tech Transfer",
      url: "/dashboard/research",
      icon: IconFileAi,
    },
    {
      title: "Laboratory Services",
      url: "/dashboard/laboratory",
      icon: IconFlask,
    },
    {
      title: "Inventory & Assets",
      url: "/dashboard/inventory",
      icon: IconDatabase,
    },
    { title: "Users", url: "/dashboard/users", icon: IconUsers },
    {
      title: "Directorates",
      url: "/dashboard/directorates",
      icon: IconBuildingSkyscraper,
    },
    { title: "Events", url: "/dashboard/events", icon: IconCalendar },
    {
      title: "Documents",
      url: "/dashboard/documents",
      icon: IconFileDescription,
    },
    {
      title: "Reports & Analytics",
      url: "/dashboard/reports",
      icon: IconReport,
    },
    { title: "Profile", url: "/dashboard/profile", icon: IconUser },
  ];

  const user = session?.user
    ? {
        name: session.user.name || "User",
        email: session.user.email || "",
        avatar: session.user.image || "/avatars/user.jpg",
      }
    : {
        name: "User",
        email: "user@ewti.et",
        avatar: "/avatars/user.jpg",
      };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button"
            >
              <div className="flex justify-between items-center mt-2">
                <div
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={toggleSidebar}
                >
                  <IconInnerShadowTop className="size-5!" />
                  <span className="text-base font-semibold group-data-[collapsible=icon]:hidden ">
                    Emmaus
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={adminNav} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
