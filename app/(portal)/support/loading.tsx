import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";

export default function SupportLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in duration-300">
      <div className="space-y-2">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-4 w-52" />
      </div>

      {/* Advisor Hero Card Skeleton */}
      <div className="bg-navy-900/90 rounded-lg p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/10 animate-pulse" />
          <div className="space-y-2">
            <div className="h-3 w-36 bg-white/10 rounded animate-pulse" />
            <div className="h-6 w-48 bg-white/20 rounded animate-pulse" />
            <div className="h-4 w-40 bg-white/10 rounded animate-pulse" />
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full sm:w-auto">
          <div className="h-10 w-44 bg-white/20 rounded-md animate-pulse" />
          <div className="flex gap-2">
            <div className="h-10 flex-1 bg-white/10 rounded-md animate-pulse" />
            <div className="h-10 flex-1 bg-white/10 rounded-md animate-pulse" />
          </div>
        </div>
      </div>

      {/* Support Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white p-5 rounded-lg border border-slate-200/60 flex gap-4 items-start">
            <Skeleton className="w-11 h-11 rounded-lg shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-3.5 w-full" />
            </div>
          </div>
        ))}
      </div>

      {/* FAQ & Contact Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pt-4">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-6 w-52 mb-4" />
          <div className="bg-white rounded-lg border border-slate-200/60 divide-y divide-slate-100">
            {[1, 2, 3, 4].map((f) => (
              <div key={f} className="p-5 flex justify-between items-center">
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        <SkeletonCard className="p-6 space-y-4">
          <Skeleton className="h-6 w-44" />
          <div className="space-y-4">
            {[1, 2, 3].map((c) => (
              <div key={c} className="space-y-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-36" />
              </div>
            ))}
          </div>
        </SkeletonCard>
      </div>
    </div>
  );
}

