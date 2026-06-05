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
      title: "Home",
      url: "/dashboard",
      icon: <GalleryVerticalEndIcon />,
    },
    {
      title: "Discover",
      url: "/dashboard/discover/trending",
      icon: <TerminalSquareIcon />,
      isActive: true,
      items: [
        {
          title: "Trending",
          url: "/dashboard/discover/trending",
        },
        {
          title: "Popular",
          url: "/dashboard/discover/popular",
        },
        {
          title: "Top Rated",
          url: "/dashboard/discover/top-rated",
        },
        {
          title: "Upcoming",
          url: "/dashboard/discover/upcoming",
        },
      ],
    },

    {
      title: "Movies",
      url: "/dashboard/movies/action",
      icon: <BotIcon />,
      items: [
        {
          title: "Action",
          url: "/dashboard/movies/action",
        },
        {
          title: "Comedy",
          url: "/dashboard/movies/comedy",
        },
        {
          title: "Drama",
          url: "/dashboard/movies/drama",
        },
        {
          title: "Sci-Fi",
          url: "/dashboard/movies/scifi",
        },
      ],
    },

    {
      title: "TV Shows",
      url: "/dashboard/tv-shows/popular",
      icon: <BookOpenIcon />,
      items: [
        {
          title: "Popular Shows",
          url: "/dashboard/tv-shows/popular",
        },
        {
          title: "Top Rated",
          url: "/dashboard/tv-shows/top-rated",
        },
        {
          title: "Airing Today",
          url: "/dashboard/tv-shows/airing-today",
        },
      ],
    },

    {
      title: "My Library",
      url: "/dashboard/favorites",
      icon: <Settings2Icon />,
      items: [
        {
          title: "Favorites",
          url: "/dashboard/favorites",
        },
        {
          title: "Watchlist",
          url: "/dashboard/watchlist",
        },
        {
          title: "Recently Seen",
          url: "/dashboard",
        },
      ],
    },
  ],

  projects: [
    {
      name: "AI Recommendations",
      url: "/dashboard/discover/trending",
      icon: <FrameIcon />,
    },
    {
      name: "Movie Collections",
      url: "/dashboard/favorites",
      icon: <PieChartIcon />,
    },
    {
      name: "Watch Goals",
      url: "/dashboard/watchlist",
      icon: <MapIcon />,
    },
  ],
};

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user?: {
    name: string;
    email: string;
    avatar: string;
  };
};

export function AppSidebar({ user, ...props }: AppSidebarProps) {
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
        <NavUser user={user ?? data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
