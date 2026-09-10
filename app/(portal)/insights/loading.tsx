import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";

export default function InsightsLoading() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in duration-300">
      <div className="mt-4 space-y-2">
        <Skeleton className="h-9 w-60" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Growth Chart Card */}
      <SkeletonCard className="p-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-6 w-44" />
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6].map((p) => (
              <Skeleton key={p} className="h-6 w-8 rounded-sm" />
            ))}
          </div>
        </div>
        <div className="h-[280px] w-full pt-4">
          <Skeleton className="h-full w-full rounded-md" />
        </div>
      </SkeletonCard>

      {/* 4 Returns Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <SkeletonCard key={i} className="p-5 space-y-2">
            <Skeleton className="h-3 w-20 uppercase" />
            <Skeleton className="h-7 w-24" />
          </SkeletonCard>
        ))}
      </div>

      {/* Attribution & Benchmark */}
      <div className="grid md:grid-cols-2 gap-6">
        <SkeletonCard className="p-6 space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="space-y-4 pt-2">
            {[1, 2, 3].map((b) => (
              <div key={b} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-2.5 w-full rounded-full" />
              </div>
            ))}
          </div>
        </SkeletonCard>

        <SkeletonCard className="p-6 space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="divide-y divide-slate-100">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex justify-between py-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </SkeletonCard>
      </div>
    </div>
  );
}
