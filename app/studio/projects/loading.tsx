export default function StudioProjectsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div className="space-y-1">
          <div className="h-7 w-48 bg-muted/70 rounded-lg" />
          <div className="h-4 w-72 bg-muted/40 rounded" />
        </div>
        <div className="h-9 w-36 bg-accent/30 rounded-md" />
      </div>

      {/* Filter Tabs Skeleton */}
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-8 w-24 bg-secondary/80 rounded-md" />
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="rounded-xl border border-border bg-card/60 p-4 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 rounded-lg bg-secondary/40 w-full" />
        ))}
      </div>
    </div>
  );
}
