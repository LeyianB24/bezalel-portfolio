export default function StudioOverviewLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="border-b border-border pb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-3 w-40 bg-accent/20 rounded" />
          <div className="h-8 w-64 bg-muted/70 rounded-lg" />
          <div className="h-4 w-96 bg-muted/40 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-28 bg-accent/30 rounded-md" />
          <div className="h-9 w-32 bg-secondary rounded-md" />
        </div>
      </div>

      {/* KPI Metric Cards Skeleton (4 cards) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-card/60 p-5 space-y-3 shadow-xs">
            <div className="flex justify-between items-center">
              <div className="h-3 w-24 bg-muted/50 rounded" />
              <div className="h-8 w-8 bg-accent/20 rounded-lg" />
            </div>
            <div className="h-8 w-16 bg-muted/70 rounded" />
            <div className="h-3 w-3/4 bg-muted/30 rounded" />
          </div>
        ))}
      </div>

      {/* Revenue & Quick Launcher Skeleton */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card/60 p-6 lg:col-span-2 space-y-4">
          <div className="h-6 w-1/3 bg-muted/60 rounded" />
          <div className="h-10 w-1/2 bg-muted/70 rounded" />
          <div className="h-20 bg-secondary/50 rounded-lg" />
        </div>
        <div className="rounded-xl border border-border bg-card/60 p-6 space-y-3">
          <div className="h-4 w-32 bg-muted/60 rounded" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-9 rounded-md bg-secondary/70 w-full" />
          ))}
        </div>
      </div>

      {/* Chart & Queue Skeleton */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card/60 p-6 lg:col-span-2 h-72">
          <div className="h-6 w-40 bg-muted/60 rounded mb-4" />
          <div className="h-48 bg-secondary/40 rounded-lg" />
        </div>
        <div className="rounded-xl border border-border bg-card/60 p-6 h-72 space-y-3">
          <div className="h-6 w-32 bg-muted/60 rounded mb-4" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-14 rounded-lg bg-secondary/50 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
