export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-[var(--radius-md)] p-6 shadow-sm border border-[var(--color-border)] animate-pulse-skeleton">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200"></div>
          <div>
            <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
      </div>
      <div className="space-y-3 mt-6">
        <div className="h-4 w-full bg-gray-200 rounded"></div>
        <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
      </div>
      <div className="mt-6 flex gap-2">
        <div className="h-8 w-24 bg-gray-200 rounded"></div>
        <div className="h-8 w-24 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}
