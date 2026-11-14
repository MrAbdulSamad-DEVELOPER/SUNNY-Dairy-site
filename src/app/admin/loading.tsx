import React from 'react';

export default function AdminLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-borderCream">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-forest-800/10 rounded-lg"></div>
          <div className="h-4 w-72 bg-forest-800/5 rounded-lg"></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-9 w-20 bg-forest-800/10 rounded-xl"></div>
          <div className="h-9 w-20 bg-gold-500/20 rounded-xl"></div>
        </div>
      </div>

      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-[#FFFDFA] p-5 rounded-2xl border border-borderCream space-y-3">
            <div className="h-3 w-20 bg-forest-800/10 rounded"></div>
            <div className="h-7 w-16 bg-forest-800/20 rounded-lg"></div>
            <div className="h-3 w-24 bg-forest-800/5 rounded"></div>
          </div>
        ))}
      </div>

      {/* Main Body Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-[#FFFDFA] p-6 sm:p-8 rounded-3xl border border-borderCream space-y-4">
          <div className="h-6 w-40 bg-forest-800/15 rounded"></div>
          <div className="space-y-3 pt-4">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="h-16 bg-cream-100/60 rounded-xl"></div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#FFFDFA] p-6 rounded-3xl border border-borderCream space-y-4">
            <div className="h-5 w-32 bg-forest-800/15 rounded"></div>
            <div className="space-y-2">
              {[1, 2, 3].map((k) => (
                <div key={k} className="h-10 bg-cream-100/60 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
