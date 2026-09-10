import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";

export default function FundsLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in duration-300">
      <div className="mt-4 space-y-2">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white border border-slate-200/60 rounded-lg overflow-hidden flex flex-col">
            <Skeleton className="h-[3px] w-full rounded-none" />
            <div className="p-6 space-y-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start">
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-5 w-4/5" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-5 w-20 rounded" />
              </div>

              <div className="space-y-2 pt-2">
                <Skeleton className="h-3 w-24 uppercase" />
                <div className="flex items-baseline gap-2">
                  <Skeleton className="h-8 w-28" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div className="space-y-1">
                  <Skeleton className="h-3 w-16 uppercase" />
                  <Skeleton className="h-4 w-14" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-3 w-20 uppercase" />
                  <Skeleton className="h-4 w-14" />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-1">
                <Skeleton className="h-3 w-24 uppercase" />
                <Skeleton className="h-4 w-20" />
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2 flex-1">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-4/5" />
              </div>

              <div className="flex gap-3 pt-4 mt-auto">
                <Skeleton className="h-10 flex-1 rounded-md" />
                <Skeleton className="h-10 flex-1 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
