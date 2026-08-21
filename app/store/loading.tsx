export default function StoreLoading() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 animate-pulse">
      {/* Header Skeleton */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="h-4 w-28 bg-accent/20 rounded-full mx-auto" />
        <div className="h-10 w-2/3 bg-muted/60 rounded-xl mx-auto" />
        <div className="h-4 w-4/5 bg-muted/40 rounded-lg mx-auto" />
      </div>

      {/* Category Filter Chips */}
      <div className="flex justify-center gap-2 overflow-x-auto">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-9 w-28 rounded-full bg-secondary/80 shrink-0" />
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card/60 p-4 space-y-3 shadow-xs"
          >
            <div className="h-44 rounded-lg bg-secondary/70 w-full" />
            <div className="h-3 w-1/4 bg-accent/20 rounded" />
            <div className="h-5 w-4/5 bg-muted/70 rounded" />
            <div className="h-8 w-full bg-muted/30 rounded" />
            <div className="flex items-center justify-between pt-2">
              <div className="h-6 w-20 bg-muted/60 rounded" />
              <div className="h-8 w-20 bg-accent/30 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
