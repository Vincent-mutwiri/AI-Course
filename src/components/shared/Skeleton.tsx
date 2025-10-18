export const Skeleton = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-muted rounded ${className}`} />
);

export const CardSkeleton = () => (
  <div className="space-y-4 p-6 border rounded-lg">
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
    <Skeleton className="h-32 w-full mt-4" />
  </div>
);
