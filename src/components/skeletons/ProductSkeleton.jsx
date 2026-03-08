import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function ProductSkeleton({ cards = 4 }) {
  return (
    <SkeletonTheme baseColor="#f3f3f3" highlightColor="#ecebeb">
      {Array(cards).fill(0).map((_, i) => (
        <div key={i} className="flex flex-col gap-4">
          {/* Image box skeleton */}
          <div className="aspect-square w-full">
            <Skeleton className="h-full w-full" borderRadius={0} />
          </div>
          {/* Text lines skeleton */}
          <div className="space-y-2">
            <Skeleton width="40%" height={12} />
            <Skeleton width="80%" height={20} />
            <Skeleton width="30%" height={24} />
          </div>
        </div>
      ))}
    </SkeletonTheme>
  );
}