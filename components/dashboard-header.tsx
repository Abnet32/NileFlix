"use client";

import DashboardBreadcrumb from "@/components/dashboard-breadcrumb";
import MovieSearch from "@/components/movie-search";
import { ModeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background/80 backdrop-blur transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-vertical:h-4 data-vertical:self-auto"
        />
        <DashboardBreadcrumb />
      </div>

      <div className="ml-auto flex flex-1 items-center justify-end gap-2 px-4">
        <div className="hidden w-full max-w-xs sm:block">
          <MovieSearch hrefPrefix="/dashboard" />
        </div>
        <ModeToggle />
      </div>
    </header>
  );
}
