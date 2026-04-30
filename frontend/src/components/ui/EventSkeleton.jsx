export default function EventSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card overflow-hidden">
          <div className="skeleton aspect-[16/9]" />
          <div className="p-5 space-y-3">
            <div className="skeleton h-6 w-3/4 rounded-lg" />
            <div className="skeleton h-4 w-full rounded-lg" />
            <div className="skeleton h-4 w-2/3 rounded-lg" />
            <div className="space-y-2 mt-4">
              <div className="skeleton h-3 w-1/2 rounded" />
              <div className="skeleton h-3 w-2/3 rounded" />
            </div>
            <div className="flex gap-2 pt-2">
              <div className="skeleton h-6 w-16 rounded-full" />
              <div className="skeleton h-6 w-16 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
