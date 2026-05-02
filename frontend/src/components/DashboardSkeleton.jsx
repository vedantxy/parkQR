import React from 'react';

const DashboardSkeleton = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-end">
        <div className="space-y-3">
          <div className="h-10 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
          <div className="h-3 w-40 bg-slate-100 dark:bg-slate-900 rounded-md"></div>
        </div>
        <div className="h-12 w-40 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
      </div>

      {/* KPI Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-[32px] border border-slate-100 dark:border-slate-700"></div>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-[400px] bg-slate-200 dark:bg-slate-800 rounded-[32px]"></div>
        <div className="h-[400px] bg-slate-200 dark:bg-slate-800 rounded-[32px]"></div>
      </div>

      {/* Bottom Grid Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-40 bg-slate-200 dark:bg-slate-800 rounded-[24px]"></div>
        ))}
      </div>
    </div>
  );
};

export default DashboardSkeleton;
