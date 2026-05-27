export default function Loading() {
  return (
    <main className="container mx-auto px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
        <div className="aspect-2/3 animate-pulse bg-muted sm:aspect-4/5 lg:aspect-5/6" />
        <div className="space-y-4">
          <div className="h-5 w-24 animate-pulse bg-muted" />
          <div className="h-12 w-3/4 animate-pulse bg-muted" />
          <div className="h-4 w-1/3 animate-pulse bg-muted" />
          <div className="flex gap-2">
            <div className="h-7 w-20 animate-pulse bg-muted" />
            <div className="h-7 w-20 animate-pulse bg-muted" />
          </div>
          <div className="h-24 w-full animate-pulse bg-muted" />
        </div>
      </div>
    </main>
  );
}
