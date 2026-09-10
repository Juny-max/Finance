import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-12 animate-in fade-in duration-300">
      {/* 1. Greeting Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mt-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="space-y-1 md:text-right">
          <Skeleton className="h-4 w-32 md:ml-auto" />
          <Skeleton className="h-4 w-24 md:ml-auto" />
        </div>
      </div>

      {/* 2. Portfolio Value Hero */}
      <div className="space-y-3">
        <Skeleton className="h-3 w-36 uppercase" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-64 md:w-80 rounded-lg" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
        <div className="flex items-center gap-4 pt-1">
          <Skeleton className="h-4 w-44" />
          <Skeleton className="h-4 w-3" />
          <Skeleton className="h-4 w-36" />
        </div>
      </div>

      {/* 3. Quick Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col items-center justify-center gap-3 p-4 bg-white border border-slate-200/60 rounded-lg">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-3.5 w-16" />
          </div>
        ))}
      </div>

      {/* 4. Performance Chart Card */}
      <SkeletonCard className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-4 w-24 rounded" />
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5, 6].map((p) => (
              <Skeleton key={p} className="h-6 w-9 rounded-sm" />
            ))}
          </div>
        </div>
        <div className="h-[240px] w-full flex items-end gap-3 pt-6 pb-2">
          <Skeleton className="h-full w-full rounded-md" />
        </div>
        <div className="flex justify-center gap-6 pt-4 border-t border-slate-100 mt-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-24" />
        </div>
      </SkeletonCard>

      {/* 5. Where Your Money Is Invested */}
      <div className="grid md:grid-cols-2 gap-8 items-center bg-white border border-slate-200/60 rounded-lg p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-3 h-3 rounded-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="h-[220px] flex items-center justify-center">
          <Skeleton className="w-40 h-40 rounded-full" />
        </div>
      </div>

      {/* 6. Recent Activity */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="bg-white border border-slate-200/60 rounded-lg divide-y divide-slate-100">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <div className="space-y-1.5 text-right">
                <Skeleton className="h-4 w-20 ml-auto" />
                <Skeleton className="h-3 w-16 ml-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Advisor Card */}
      <div className="bg-slate-100/70 border border-slate-200/60 rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-36" />
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-3 w-56" />
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Skeleton className="h-10 w-28 rounded-md" />
          <Skeleton className="h-10 w-36 rounded-md" />
        </div>
      </div>
    </div>
  );
}
