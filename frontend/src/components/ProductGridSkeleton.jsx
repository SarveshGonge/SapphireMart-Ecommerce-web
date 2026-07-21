export default function ProductGridSkeleton({ count = 32 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-[10px] overflow-hidden border border-slate-100">
          <div className="aspect-[3/4] skeleton animate-shimmer" />
          <div className="p-3 space-y-2">
            <div className="h-2.5 w-1/3 skeleton animate-shimmer rounded" />
            <div className="h-3 w-4/5 skeleton animate-shimmer rounded" />
            <div className="h-3 w-1/2 skeleton animate-shimmer rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
