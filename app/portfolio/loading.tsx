export default function PortfolioLoading() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 animate-pulse">
      {/* Header Skeleton */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="h-4 w-32 bg-accent/20 rounded-full mx-auto" />
        <div className="h-10 sm:h-12 w-3/4 bg-muted/60 rounded-xl mx-auto" />
        <div className="h-4 w-5/6 bg-muted/40 rounded-lg mx-auto" />
      </div>

      {/* Filter Chips Skeleton */}
      <div className="flex justify-center gap-2 overflow-x-auto py-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-9 w-24 rounded-full bg-secondary/80 shrink-0" />
        ))}
      </div>

      {/* Case Studies Grid Skeleton */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card/60 p-6 space-y-4 shadow-sm"
          >
            <div className="h-48 rounded-xl bg-secondary/70 w-full" />
            <div className="space-y-2">
              <div className="h-4 w-1/3 bg-accent/20 rounded" />
              <div className="h-6 w-3/4 bg-muted/70 rounded" />
              <div className="h-12 w-full bg-muted/40 rounded" />
            </div>
            <div className="flex gap-2 pt-2">
              <div className="h-6 w-16 bg-secondary rounded-full" />
              <div className="h-6 w-20 bg-secondary rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
