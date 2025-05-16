export default function Loading() {
  return (
    <div className="animate-pulse space-y-6">
      <div>
        <div className="h-6 bg-gray-300 rounded w-48 mb-2" />
        <div className="h-4 bg-gray-300 rounded w-24" />
      </div>

      {[...Array(3)].map((_, i) => (
        <div key={i}>
          <div className="h-5 bg-gray-300 rounded w-32 mb-1" />
          <div className="h-4 bg-gray-200 rounded w-64 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-48" />
        </div>
      ))}
    </div>
  );
}
