import React from 'react';

// Base skeleton component with enhanced shimmer effect
const SkeletonBase = ({ className = '', children, delay = 0, ...props }) => (
  <div
    className={`animate-pulse bg-gray-200 ${className}`}
    style={{ animationDelay: `${delay}ms` }}
    {...props}
  >
    {children}
  </div>
);

// Shimmer effect overlay
const ShimmerOverlay = () => (
  <div className="absolute inset-0 -skew-x-12 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
);

// Individual skeleton components with staggered animations
export const SkeletonText = ({ width = "w-full", height = "h-4", className = "", delay = 0 }) => (
  <SkeletonBase className={`relative overflow-hidden rounded ${width} ${height} ${className}`} delay={delay}>
    <ShimmerOverlay />
  </SkeletonBase>
);

export const SkeletonCircle = ({ size = "w-8 h-8", className = "", delay = 0 }) => (
  <SkeletonBase className={`relative overflow-hidden rounded-full ${size} ${className}`} delay={delay}>
    <ShimmerOverlay />
  </SkeletonBase>
);

export const SkeletonButton = ({ width = "w-24", height = "h-9", className = "", delay = 0 }) => (
  <SkeletonBase className={`relative overflow-hidden rounded-lg ${width} ${height} ${className}`} delay={delay}>
    <ShimmerOverlay />
  </SkeletonBase>
);

export const SkeletonCard = ({ height = "h-32", className = "", children }) => (
  <div className={`relative overflow-hidden bg-white rounded-lg border border-gray-200 ${height} ${className}`}>
    <SkeletonBase className="w-full h-full">
      <ShimmerOverlay />
    </SkeletonBase>
    {children}
  </div>
);

// League-specific skeleton components
export const LeagueHeaderSkeleton = () => (
  <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
    <div className="px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <SkeletonText width="w-48" height="h-6" className="mb-2" />
          <SkeletonText width="w-96" height="h-4" />
        </div>
        
        {/* Progress indicator skeleton */}
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <SkeletonText width="w-12" height="h-8" className="mb-1" />
            <SkeletonText width="w-16" height="h-3" />
          </div>
          <SkeletonCircle size="w-12 h-12" />
        </div>
      </div>
    </div>
  </div>
);

export const WeekSkeleton = ({ expanded = false }) => (
  <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
    {/* Week header */}
    <div className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-3">
        <SkeletonCircle size="w-5 h-5" />
        <div>
          <SkeletonText width="w-32" height="h-5" className="mb-1" />
          <SkeletonText width="w-48" height="h-4" />
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <SkeletonText width="w-8" height="h-4" />
        <SkeletonText width="w-24" height="h-2" />
      </div>
    </div>

    {/* Expanded content */}
    {expanded && (
      <div className="px-6 pb-4">
        <div className="space-y-4">
          {[1, 2].map(i => (
            <SectionSkeleton key={i} />
          ))}
        </div>
      </div>
    )}
  </div>
);

export const SectionSkeleton = () => (
  <div className="border border-gray-100 rounded-lg">
    {/* Section header */}
    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-t-lg border-b border-gray-100">
      <SkeletonText width="w-36" height="h-5" />
    </div>
    
    {/* Resources table skeleton */}
    <div>
      {/* Table header */}
      <div className="grid grid-cols-16 gap-2 px-4 py-2 bg-gray-100 border-b border-gray-200">
        <div className="col-span-1 flex justify-center">
          <SkeletonText width="w-6" height="h-3" />
        </div>
        <div className="col-span-7 text-center">
          <SkeletonText width="w-12" height="h-3" />
        </div>
        <div className="col-span-2 text-center">
          <SkeletonText width="w-16" height="h-3" />
        </div>
        <div className="col-span-3 text-center">
          <SkeletonText width="w-8" height="h-3" />
        </div>
        <div className="col-span-2 text-center">
          <SkeletonText width="w-12" height="h-3" />
        </div>
        <div className="col-span-1 text-center">
          <SkeletonText width="w-8" height="h-3" />
        </div>
      </div>
      
      {/* Table rows */}
      {[1, 2, 3].map(i => (
        <ResourceRowSkeleton key={i} index={i - 1} />
      ))}
    </div>
  </div>
);

export const ResourceRowSkeleton = ({ index = 0 }) => (
  <div 
    className="grid grid-cols-16 gap-2 items-center px-4 py-3 border-b border-gray-100 last:border-b-0"
    style={{ animationDelay: `${index * 50}ms` }}
  >
    {/* Status */}
    <div className="col-span-1 flex justify-center">
      <SkeletonCircle size="w-5 h-5" delay={index * 50} />
    </div>
    
    {/* Title */}
    <div className="col-span-7">
      <SkeletonText width="w-full" height="h-4" delay={index * 50 + 100} />
    </div>
    
    {/* Resource */}
    <div className="col-span-2 flex items-center justify-center space-x-2">
      <SkeletonCircle size="w-4 h-4" delay={index * 50 + 200} />
      <SkeletonButton width="w-12" height="h-6" delay={index * 50 + 250} />
    </div>
    
    {/* Note */}
    <div className="col-span-3 flex justify-center">
      <SkeletonButton width="w-16" height="h-6" delay={index * 50 + 300} />
    </div>
    
    {/* Revision */}
    <div className="col-span-2 flex justify-center">
      <SkeletonCircle size="w-6 h-6" delay={index * 50 + 350} />
    </div>
    
    {/* Share */}
    <div className="col-span-1 flex justify-center">
      <SkeletonCircle size="w-4 h-4" delay={index * 50 + 400} />
    </div>
  </div>
);

// Main league detail skeleton
export const LeagueDetailSkeleton = () => (
  <div className="min-h-screen bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back button skeleton */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <SkeletonCircle size="w-4 h-4" />
            <SkeletonText width="w-24" height="h-4" />
          </div>
          
          {/* Quick stats skeleton */}
          <div className="flex items-center space-x-6 text-sm">
            <SkeletonText width="w-20" height="h-4" />
            <SkeletonText width="w-24" height="h-4" />
            <SkeletonText width="w-20" height="h-4" />
          </div>
        </div>
        
        {/* League header */}
        <LeagueHeaderSkeleton />
      </div>

      {/* Weeks skeleton */}
      <div className="space-y-4">
        <WeekSkeleton expanded={true} />
        <WeekSkeleton />
        <WeekSkeleton />
      </div>

      {/* Assignment section skeleton */}
      <div className="mt-8">
        <SkeletonCard height="h-40" className="p-6">
          <div className="space-y-4">
            <SkeletonText width="w-32" height="h-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SkeletonText width="w-full" height="h-4" />
              <SkeletonText width="w-full" height="h-4" />
            </div>
            <div className="flex justify-end space-x-3">
              <SkeletonButton width="w-20" height="h-8" />
              <SkeletonButton width="w-24" height="h-8" />
            </div>
          </div>
        </SkeletonCard>
      </div>
    </div>
  </div>
);

// Progressive loading skeleton (shows partial content while resources load)
export const ProgressiveLoadingSkeleton = ({ sectionName, resourceCount = 3 }) => (
  <div className="px-4 py-6 text-center">
    <div className="animate-pulse space-y-4">
      {/* Loading header */}
      <div className="flex items-center justify-center space-x-2 mb-4">
        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#FFDE59]"></div>
        <SkeletonText width="w-32" height="h-4" />
      </div>
      
      {/* Resource skeletons */}
      <div className="space-y-3">
        {Array.from({ length: resourceCount }, (_, i) => (
          <ResourceRowSkeleton key={i} index={i} />
        ))}
      </div>
      
      {/* Loading text */}
      <div className="mt-4">
        <p className="text-sm text-gray-500">
          Loading {sectionName ? `${sectionName} resources` : 'resources'}...
        </p>
        <div className="w-32 h-1 bg-gray-200 rounded-full mx-auto mt-2 overflow-hidden">
          <div className="h-full bg-[#FFDE59] rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
);

export default {
  LeagueDetailSkeleton,
  LeagueHeaderSkeleton,
  WeekSkeleton,
  SectionSkeleton,
  ResourceRowSkeleton,
  ProgressiveLoadingSkeleton,
  SkeletonText,
  SkeletonCircle,
  SkeletonButton,
  SkeletonCard
};
