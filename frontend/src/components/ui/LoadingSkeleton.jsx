const LoadingSkeleton = ({ rows = 5 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/3">
          <div className="skeleton w-10 h-10 rounded-xl flex-shrink-0" style={{ animationDelay: `${i * 0.1}s` }} />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-3.5 rounded w-1/3" style={{ animationDelay: `${i * 0.1}s` }} />
            <div className="skeleton h-3 rounded w-1/2" style={{ animationDelay: `${i * 0.15}s` }} />
          </div>
          <div className="skeleton h-3.5 rounded w-20" style={{ animationDelay: `${i * 0.1}s` }} />
          <div className="skeleton h-3.5 rounded w-16" style={{ animationDelay: `${i * 0.1}s` }} />
          <div className="skeleton h-7 rounded-lg w-16" style={{ animationDelay: `${i * 0.1}s` }} />
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton = ({ count = 4 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="skeleton h-4 w-24 rounded" />
          <div className="skeleton w-10 h-10 rounded-xl" />
        </div>
        <div className="skeleton h-8 w-32 rounded" />
        <div className="skeleton h-3 w-20 rounded" />
      </div>
    ))}
  </div>
);

export default LoadingSkeleton;
