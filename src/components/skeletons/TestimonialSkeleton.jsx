import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

export default function TestimonialSkeleton() {
  return (
    <SkeletonTheme baseColor="#f3f3f3" highlightColor="#ecebeb">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[1, 2].map((_, i) => (
          <div key={i} className="flex flex-col md:flex-row items-center gap-8 p-4">
            {/* Image Skeleton */}
            <div className="w-full md:w-1/3 aspect-square">
              <Skeleton className="h-full w-full" borderRadius={16} />
            </div>
            {/* Content Skeleton */}
            <div className="w-full md:w-2/3 space-y-4">
              <Skeleton width="40%" height={15} />
              <Skeleton count={3} height={12} />
              <Skeleton width="50%" height={20} className="mt-4" />
            </div>
          </div>
        ))}
      </div>
    </SkeletonTheme>
  );
}