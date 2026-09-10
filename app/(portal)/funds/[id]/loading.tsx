import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";

export default function FundDetailLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in duration-300">
      <Skeleton className="h-4 w-28 mt-4" />

      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-6 w-24 rounded" />
          </div>
          <Skeleton className="h-4 w-44 uppercase" />
          <div className="space-y-2 max-w-2xl pt-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
        <Skeleton className="h-10 w-44 rounded-md shrink-0" />
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-slate-100/70 rounded-lg p-5 space-y-2">
            <Skeleton className="h-3 w-20 uppercase" />
            <Skeleton className="h-7 w-28" />
          </div>
        ))}
      </div>

      {/* 3. Performance Chart */}
      <SkeletonCard className="p-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-6 w-44" />
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5, 6].map((p) => (
              <Skeleton key={p} className="h-6 w-8 rounded-sm" />
            ))}
          </div>
        </div>
        <div className="h-[260px] w-full pt-4">
          <Skeleton className="h-full w-full rounded-md" />
        </div>
      </SkeletonCard>

      {/* 4. Composition & Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <SkeletonCard className="p-6 space-y-4">
          <Skeleton className="h-6 w-44" />
          <div className="space-y-3 pt-2">
            {[1, 2, 3, 4].map((c) => (
              <div key={c} className="space-y-1.5">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-4 w-10" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </SkeletonCard>

        <SkeletonCard className="p-6 space-y-4">
          <Skeleton className="h-6 w-36" />
          <div className="divide-y divide-slate-100">
            {[1, 2, 3, 4, 5].map((info) => (
              <div key={info} className="flex justify-between py-2.5">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </SkeletonCard>
      </div>

      {/* 5. Documents */}
      <div className="space-y-4 pt-4">
        <Skeleton className="h-6 w-36" />
        <div className="grid sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((d) => (
            <div key={d} className="bg-white border border-slate-200/60 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
