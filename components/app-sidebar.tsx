"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  GalleryVerticalEndIcon,
  
  TerminalSquareIcon,
  BotIcon,
  BookOpenIcon,
  Settings2Icon,
  FrameIcon,
  PieChartIcon,
  MapIcon,
} from "lucide-react";

// This is sample data.
const data = {
  user: {
    name: "Abnet Mekonen",
    email: "abnet@example.com",
    avatar: "/avatar.png",
  },

  teams: [
    {
      name: "NileFlix",
      logo: <GalleryVerticalEndIcon />,
      plan: "Premium",
    },
  ],

  navMain: [
    {
      title: "Discover",
      url: "/dashboard",
      icon: <TerminalSquareIcon />,
      isActive: true,
      items: [
        {
          title: "Trending",
          url: "/dashboard/trending",
        },
        {
          title: "Popular",
          url: "/dashboard/popular",
        },
        {
          title: "Top Rated",
          url: "/dashboard/top-rated",
        },
        {
          title: "Upcoming",
          url: "/dashboard/upcoming",
        },
      ],
    },

    {
      title: "Movies",
      url: "/dashboard/movies",
      icon: <BotIcon />,
      items: [
        {
          title: "Action",
          url: "/movies/action",
        },
        {
          title: "Comedy",
          url: "/movies/comedy",
        },
        {
          title: "Drama",
          url: "/movies/drama",
        },
        {
          title: "Sci-Fi",
          url: "/movies/scifi",
        },
      ],
    },

    {
      title: "TV Shows",
      url: "/dashboard/tv",
      icon: <BookOpenIcon />,
      items: [
        {
          title: "Popular Shows",
          url: "/tv/popular",
        },
        {
          title: "Top Rated",
          url: "/tv/top-rated",
        },
        {
          title: "Airing Today",
          url: "/tv/airing-today",
        },
      ],
    },

    {
      title: "My Library",
      url: "/dashboard/library",
      icon: <Settings2Icon />,
      items: [
        {
          title: "Favorites",
          url: "/favorites",
        },
        {
          title: "Watchlist",
          url: "/watchlist",
        },
        {
          title: "Collections",
          url: "/collections",
        },
        {
          title: "Goals",
          url: "/goals",
        },
      ],
    },
  ],

  projects: [
    {
      name: "AI Recommendations",
      url: "/ai",
      icon: <FrameIcon />,
    },
    {
      name: "Movie Collections",
      url: "/collections",
      icon: <PieChartIcon />,
    },
    {
      name: "Watch Goals",
      url: "/goals",
      icon: <MapIcon />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
