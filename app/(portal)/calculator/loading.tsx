import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";

export default function CalculatorLoading() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in duration-300">
      <div className="mt-4 space-y-2">
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-4 w-60" />
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs Column */}
        <div className="lg:col-span-5 space-y-6 bg-white border border-slate-200/60 rounded-lg p-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>

          <div className="space-y-3">
            <Skeleton className="h-4 w-32" />
            <div className="grid grid-cols-6 gap-2">
              {[1, 2, 3, 4, 5, 6].map((y) => (
                <Skeleton key={y} className="h-9 w-full rounded-md" />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Skeleton className="h-4 w-40" />
            <div className="space-y-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className="p-3 border border-slate-100 rounded-lg flex justify-between items-center">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-36" />
                  </div>
                  <Skeleton className="h-5 w-12" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Results Column */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((r) => (
              <SkeletonCard key={r} className="p-4 space-y-2">
                <Skeleton className="h-3 w-20 uppercase" />
                <Skeleton className="h-7 w-24" />
              </SkeletonCard>
            ))}
          </div>

          <SkeletonCard className="p-6 space-y-4">
            <Skeleton className="h-6 w-48" />
            <div className="h-[260px] w-full pt-4">
              <Skeleton className="h-full w-full rounded-md" />
            </div>
          </SkeletonCard>
        </div>
      </div>
    </div>
  );
}

