export default function CareersLoading() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10 animate-pulse">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="h-4 w-32 bg-accent/20 rounded-full mx-auto" />
        <div className="h-10 w-3/4 bg-muted/60 rounded-xl mx-auto" />
        <div className="h-4 w-5/6 bg-muted/40 rounded-lg mx-auto" />
      </div>

      {/* Job Postings List */}
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card/60 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs"
          >
            <div className="space-y-2 flex-1">
              <div className="flex gap-2">
                <div className="h-5 w-24 bg-accent/20 rounded-full" />
                <div className="h-5 w-20 bg-secondary rounded-full" />
              </div>
              <div className="h-6 w-2/3 bg-muted/70 rounded" />
              <div className="h-4 w-5/6 bg-muted/40 rounded" />
            </div>
            <div className="h-10 w-32 bg-accent/30 rounded-lg shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
