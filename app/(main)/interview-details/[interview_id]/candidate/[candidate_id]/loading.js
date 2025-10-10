export default function Loading() {
  return (
    <div className="container py-6 max-w-6xl space-y-6">
      <div className="flex flex-col gap-4">
        <div className="h-8 bg-gray-200 animate-pulse rounded-md w-1/4"></div>
        <div className="h-4 bg-gray-200 animate-pulse rounded-md w-1/3"></div>
      </div>
      <div className="h-1 bg-gray-200 my-6"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
          <div className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
        </div>
        <div className="md:col-span-1 space-y-6">
          <div className="h-48 bg-gray-200 animate-pulse rounded-lg"></div>
        </div>
      </div>
    </div>
  )
}