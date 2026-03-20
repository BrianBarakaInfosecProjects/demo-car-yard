'use client';

interface VehicleCardSkeletonProps {
  viewMode?: 'grid' | 'list';
}

export function VehicleCardSkeleton({ viewMode = 'grid' }: VehicleCardSkeletonProps) {
  if (viewMode === 'list') {
    return (
      <div className="bg-brand-ink border border-border rounded-xl overflow-hidden flex">
        <div className="relative w-48 h-36 bg-brand-ink-soft animate-pulse" />
        <div className="flex-1 p-4">
          <div className="h-3 w-16 bg-brand-ink-soft rounded animate-pulse mb-2" />
          <div className="h-5 w-48 bg-brand-ink-soft rounded animate-pulse mb-3" />
          <div className="flex gap-4 mb-3">
            <div className="h-4 w-12 bg-brand-ink-soft rounded animate-pulse" />
            <div className="h-4 w-16 bg-brand-ink-soft rounded animate-pulse" />
            <div className="h-4 w-14 bg-brand-ink-soft rounded animate-pulse" />
          </div>
          <div className="h-4 w-32 bg-brand-ink-soft rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-ink border border-border rounded-xl overflow-hidden">
      <div className="relative h-[180px] bg-brand-ink-soft animate-pulse" />
      <div className="p-4">
        <div className="h-3 w-12 bg-brand-ink-soft rounded animate-pulse mb-1" />
        <div className="h-5 w-32 bg-brand-ink-soft rounded animate-pulse mb-3" />
        <div className="flex justify-between pb-3 mb-3 border-b border-border">
          <div className="h-8 w-14 bg-brand-ink-soft rounded animate-pulse" />
          <div className="h-8 w-14 bg-brand-ink-soft rounded animate-pulse" />
          <div className="h-8 w-14 bg-brand-ink-soft rounded animate-pulse" />
        </div>
        <div className="h-4 w-full bg-brand-ink-soft rounded animate-pulse mb-3" />
        <div className="h-6 w-24 bg-brand-ink-soft rounded animate-pulse mb-3" />
        <div className="flex gap-2">
          <div className="h-9 flex-1 bg-brand-ink-soft rounded animate-pulse" />
          <div className="h-9 flex-1 bg-brand-ink-soft rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function VehicleGridSkeleton({ count = 6, viewMode = 'grid' }: { count?: number; viewMode?: 'grid' | 'list' }) {
  return (
    <div className={`grid ${viewMode === 'grid' ? 'md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-5 lg:gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <VehicleCardSkeleton key={i} viewMode={viewMode} />
      ))}
    </div>
  );
}

export function VehicleDetailsSkeleton() {
  return (
    <div className="bg-brand-ink min-h-screen">
      <div className="animate-pulse">
        <div className="h-[400px] bg-brand-ink-soft" />
        <div className="p-6">
          <div className="h-8 w-64 bg-brand-ink-soft rounded animate-pulse mb-4" />
          <div className="h-10 w-48 bg-brand-ink-soft rounded animate-pulse mb-6" />
          <div className="grid grid-cols-3 gap-4 mb-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-20 bg-brand-ink-soft rounded-lg animate-pulse" />
            ))}
          </div>
          <div className="h-32 bg-brand-ink-soft rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}
