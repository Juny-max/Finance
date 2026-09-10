import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";

export default function PortfolioLoading() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mt-4">
        <div className="space-y-3">
          <Skeleton className="h-9 w-40" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-7 w-7 rounded-full" />
          </div>
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-28 rounded-md" />
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i} className="p-5 space-y-3">
            <Skeleton className="h-3.5 w-24 uppercase" />
            <Skeleton className="h-7 w-32" />
          </SkeletonCard>
        ))}
      </div>

      {/* Performance Chart Card */}
      <SkeletonCard className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <Skeleton className="h-6 w-48" />
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5, 6].map((p) => (
              <Skeleton key={p} className="h-6 w-9 rounded-sm" />
            ))}
          </div>
        </div>
        <div className="h-[280px] w-full pt-4">
          <Skeleton className="h-full w-full rounded-md" />
        </div>
      </SkeletonCard>

      {/* Holdings Table */}
      <div className="bg-white border border-slate-200/60 rounded-lg overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <Skeleton className="h-6 w-36" />
        </div>
        <div className="p-6 space-y-4">
          <div className="flex justify-between border-b border-slate-100 pb-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          {[1, 2, 3].map((r) => (
            <div key={r} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
              <div className="flex items-center gap-3">
                <Skeleton className="w-2.5 h-2.5 rounded-full" />
                <Skeleton className="h-4 w-44" />
              </div>
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-14" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
