import React from 'react';

const DashboardSkeleton = () => {
  return (
    <div className="flex h-screen bg-[#F8FAFC] font-inter">
      {/* Sidebar Skeleton (Icon-only) */}
      <div className="w-20 border-r border-slate-200 bg-white flex flex-col items-center py-8 gap-8">
        <div className="h-10 w-10 shimmer rounded-xl" />
        <div className="space-y-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-12 w-12 shimmer rounded-2xl" />
          ))}
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 flex flex-col">
        {/* Header Skeleton */}
        <header className="h-20 border-b border-slate-200 bg-white flex items-center justify-between px-8">
          <div className="flex items-center gap-12">
            <div className="h-6 w-32 shimmer rounded" />
            <div className="h-11 w-80 shimmer rounded-2xl hidden xl:block" />
          </div>
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 shimmer rounded-2xl" />
            <div className="h-11 w-11 shimmer rounded-2xl" />
            <div className="h-10 w-32 shimmer rounded-xl" />
            <div className="h-11 w-32 shimmer rounded-2xl" />
          </div>
        </header>

        {/* Dashboard Body Skeleton */}
        <main className="p-8 space-y-8 overflow-y-auto">
          {/* Info Tags */}
          <div className="grid grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 shimmer rounded-lg" />
            ))}
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Left Column */}
            <div className="col-span-8 space-y-8">
              <div className="grid grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-40 shimmer rounded-2xl border border-slate-100" />
                ))}
              </div>
              <div className="h-96 shimmer rounded-2xl border border-slate-100" />
            </div>

            {/* Right Column */}
            <div className="col-span-4 space-y-8">
              <div className="h-80 shimmer rounded-2xl border border-slate-100" />
              <div className="h-64 shimmer rounded-2xl border border-slate-100" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
