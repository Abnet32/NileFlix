import { Skeleton } from "@/components/ui/skeleton";

export function MediaCardSkeleton() {
  return (
    <div className="w-full space-y-2">
      <Skeleton className="aspect-2/3 w-full rounded-xl" />
      <Skeleton className="h-4 w-3/4 rounded-md" />
      <Skeleton className="h-3 w-1/2 rounded-md" />
    </div>
  );
}

export function MediaRowSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="mb-8 space-y-3">
      <Skeleton className="h-6 w-48 rounded-md" />
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="w-36 shrink-0 sm:w-44 md:w-52 lg:w-60">
            <MediaCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}

export function MediaDetailSkeleton() {
  return (
    <main className="container mx-auto px-4 py-10 animate-pulse">
      <div className="mb-4 flex justify-end">
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
        <Skeleton className="aspect-2/3 w-full rounded-xl sm:aspect-4/5 lg:aspect-5/6" />
        <div className="flex flex-col gap-6">
          <div className="space-y-3">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-10 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-1/2 rounded-md" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-2/3 rounded-md" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-11 w-44 rounded-lg" />
            <Skeleton className="h-11 w-44 rounded-lg" />
          </div>
        </div>
      </div>
    </main>
  );
}

export function WatchScreenSkeleton() {
  return (
    <main className="min-h-dvh bg-black text-white">
      <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col gap-4 px-3 py-3 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-3 w-24 rounded-md" />
            <Skeleton className="h-8 w-64 rounded-md" />
          </div>
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
        <Skeleton className="aspect-video w-full rounded-xl" />
      </div>
    </main>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative mb-8 w-full overflow-hidden rounded-b-2xl bg-muted">
      <Skeleton className="min-h-80 w-full sm:min-h-[30rem] lg:min-h-[34rem] rounded-none" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <main className="flex-1 px-4 py-6 sm:px-6">
      <HeroSkeleton />
      <MediaRowSkeleton count={6} />
      <MediaRowSkeleton count={6} />
      <MediaRowSkeleton count={6} />
      <MediaRowSkeleton count={6} />
    </main>
  );
}
