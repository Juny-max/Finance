import { Skeleton } from "@/components/ui/Skeleton";

export default function StatementsLoading() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in duration-300">
      <div className="mt-4 space-y-2">
        <Skeleton className="h-9 w-60" />
        <Skeleton className="h-4 w-52" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200/60 pb-3">
        {[1, 2, 3, 4, 5].map((t) => (
          <Skeleton key={t} className="h-8 w-24 rounded-md" />
        ))}
      </div>

      {/* Document Cards */}
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white border border-slate-200/60 rounded-lg p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
              <div className="space-y-1.5">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-16 rounded" />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <Skeleton className="h-9 w-20 rounded-md" />
              <Skeleton className="h-9 w-28 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
