export default function StudioMessagesLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="space-y-1">
          <div className="h-7 w-44 bg-muted/70 rounded-lg" />
          <div className="h-4 w-64 bg-muted/40 rounded" />
        </div>
        <div className="h-8 w-28 bg-secondary rounded-md" />
      </div>

      {/* Messages List Skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card/60 p-5 space-y-2"
          >
            <div className="flex justify-between items-center">
              <div className="h-4 w-40 bg-muted/70 rounded" />
              <div className="h-3 w-16 bg-muted/40 rounded" />
            </div>
            <div className="h-5 w-2/3 bg-muted/60 rounded" />
            <div className="h-10 w-full bg-secondary/40 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
