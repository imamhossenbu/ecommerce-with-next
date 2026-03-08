import React from 'react';
import Skeleton from 'react-loading-skeleton';

export default function CategorySkeleton({ cards = 4 }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {Array(cards).fill(0).map((_, i) => (
        <div key={i} className="aspect-square w-full">
          <Skeleton className="h-full w-full" borderRadius={4} />
        </div>
      ))}
    </div>
  );
}
