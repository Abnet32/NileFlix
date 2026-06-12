"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string;
    logo: React.ReactNode;
    plan: string;
  }[];
}) {
  const team = teams[0];
  if (!team) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          render={<Link href="/dashboard" />}
          className="gap-2"
        >
          <div className="flex aspect-square size-8 items-center justify-center">
            <Image
              src="/icon1.png"
              alt="NileFlix"
              width={28}
              height={28}
              className="size-7 dark:hidden"
            />
            <Image
              src="/icon2.png"
              alt="NileFlix"
              width={28}
              height={28}
              className="size-7 hidden dark:block"
            />
          </div>
          <span className="truncate text-base font-semibold tracking-tight">
            {team.name}
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
