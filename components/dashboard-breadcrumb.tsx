"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react";

function labelize(segment: string) {
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Numeric id segments (detail pages) aren't useful crumbs.
function isId(segment: string) {
  return /^\d+$/.test(segment);
}

export default function DashboardBreadcrumb() {
  const pathname = usePathname() ?? "/dashboard";
  const segments = pathname.split("/").filter(Boolean); // e.g. ["dashboard","movies","action"]
  const crumbs = segments
    .map((segment, index) => ({
      segment,
      href: "/" + segments.slice(0, index + 1).join("/"),
      isId: isId(segment),
    }))
    .filter((c) => !c.isId);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          const label =
            crumb.segment === "dashboard" ? "NileFlix" : labelize(crumb.segment);

          return (
            <Fragment key={crumb.href}>
              <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={crumb.href}>{label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast ? (
                <BreadcrumbSeparator
                  className={index === 0 ? "hidden md:block" : ""}
                />
              ) : null}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
