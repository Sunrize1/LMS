export function ClassCardSkeleton() {
  return (
    <div
      data-testid="class-card-skeleton"
      className="animate-pulse rounded-lg border border-gray-200 bg-white p-5"
    >
      <div className="flex items-start justify-between">
        <div className="h-6 w-40 rounded bg-gray-200" />
        <div className="h-5 w-16 rounded-full bg-gray-200" />
      </div>
      <div className="mt-3 h-4 w-24 rounded bg-gray-200" />
    </div>
  )
}
