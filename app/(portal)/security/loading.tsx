import { Skeleton } from "@/components/ui/Skeleton";

export default function SecurityLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in fade-in duration-300">
      <div className="space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="bg-white rounded-lg border border-slate-200/60 overflow-hidden divide-y divide-slate-100">
        {/* Password Section */}
        <div className="p-6 space-y-4">
          <Skeleton className="h-6 w-36" />
          <div className="max-w-md space-y-4">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <Skeleton className="h-10 w-36 rounded-md" />
          </div>
        </div>

        {/* 2FA Section */}
        <div className="p-6 flex justify-between items-start gap-4">
          <div className="space-y-2 flex-1 max-w-xl">
            <Skeleton className="h-6 w-60" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-8 w-72 rounded-md mt-3" />
          </div>
          <Skeleton className="w-12 h-6 rounded-full" />
        </div>

        {/* Sessions Section */}
        <div className="p-6 space-y-4">
          <Skeleton className="h-6 w-44" />
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="p-4 border border-slate-100 rounded-lg flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-9 h-9 rounded-lg" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
