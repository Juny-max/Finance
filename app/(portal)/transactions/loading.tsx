import { Skeleton } from "@/components/ui/Skeleton";

export default function TransactionsLoading() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in duration-300">
      <div className="mt-4 space-y-2">
        <Skeleton className="h-9 w-44" />
        <Skeleton className="h-4 w-60" />
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {[1, 2, 3, 4, 5].map((t) => (
            <Skeleton key={t} className="h-9 w-24 rounded-md" />
          ))}
        </div>
        <Skeleton className="h-10 w-full sm:w-64 rounded-md" />
      </div>

      {/* Transactions Ledger */}
      <div className="bg-white border border-slate-200/60 rounded-lg overflow-hidden divide-y divide-slate-100">
        <div className="p-4 bg-slate-50 border-b border-slate-100 hidden sm:flex justify-between items-center">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>

        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <Skeleton className="h-10 w-10 rounded-full shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-48" />
                <div className="flex gap-3">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </div>
            <div className="space-y-1.5 text-right">
              <Skeleton className="h-4 w-24 ml-auto" />
              <Skeleton className="h-3.5 w-16 ml-auto rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

