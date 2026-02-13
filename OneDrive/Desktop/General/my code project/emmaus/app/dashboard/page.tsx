"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";
import BreadcrumbUi from "@/components/breadcomb";
import Dashboard from "@/components/dashboard-ui";

export default function Page() {
  const { isPending, error, refetch } = authClient.useSession();
  if (isPending) {
    return (
      <div>
        <BreadcrumbUi page={"Dashboard"} />
        <div className="flex items-center justify-between p-4 md:p-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-100 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <>
        <BreadcrumbUi page={"Dashboard"} />
        <div className="p-4 md:p-6">
          Error getting session <Button onClick={() => refetch()}>Retry</Button>
        </div>
      </>
    );
  } else {
    return (
      <>
        <BreadcrumbUi page={"Dashboard"} />
        <div className="p-4 md:p-6">
          <Dashboard />
        </div>
      </>
    );
  }
}
