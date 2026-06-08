"use client";

import DashboardBreadcrumb from "@/components/dashboard-breadcrumb";
import { ModeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-vertical:h-4 data-vertical:self-auto"
        />
        <DashboardBreadcrumb />
      </div>

      <div className="ml-auto flex items-center gap-2 px-4">
        <ModeToggle />
      </div>
    </header>
  );
}
