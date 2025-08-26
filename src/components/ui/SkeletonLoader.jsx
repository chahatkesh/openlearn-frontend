import React from 'react';

// Apple-style skeletal loading components with industry-grade responsiveness

// Enhanced shimmer effect with Apple-like animation
const ShimmerOverlay = () => (
  <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer-smooth" />
);

// Base skeleton component with enhanced shimmer effect (legacy support)
const SkeletonBase = ({ className = '', children, delay = 0, ...props }) => (
  <div
    className={`animate-pulse bg-gray-200 ${className}`}
    style={{ animationDelay: `${delay}ms` }}
    {...props}
  >
    {children}
  </div>
);

// Individual skeleton components with staggered animations (legacy support)
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

// Apple-style skeleton base with smooth animations
const AppleSkeletonBase = ({ className = '', children, delay = 0, ...props }) => (
  <div
    className={`relative overflow-hidden bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl ${className}`}
    style={{ 
      animationDelay: `${delay}ms`,
      animation: 'skeleton-pulse 2s cubic-bezier(0.4, 0.0, 0.6, 1) infinite'
    }}
    {...props}
  >
    {children}
    <ShimmerOverlay />
  </div>
);

// Apple-style text skeleton with realistic widths
export const AppleSkeletonText = ({ 
  width = "w-full", 
  className = "", 
  delay = 0,
  variant = "default" // title, subtitle, body, caption
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'title':
        return 'h-8 rounded-lg';
      case 'subtitle':
        return 'h-6 rounded-lg';
      case 'body':
        return 'h-4 rounded-md';
      case 'caption':
        return 'h-3 rounded-sm';
      default:
        return 'h-4 rounded-md';
    }
  };

  return (
    <AppleSkeletonBase 
      className={`${width} ${getVariantStyles()} ${className}`} 
      delay={delay}
    />
  );
};

// Apple-style circle with smooth animation
export const AppleSkeletonCircle = ({ size = "w-8 h-8", className = "", delay = 0 }) => (
  <AppleSkeletonBase 
    className={`rounded-full ${size} ${className}`} 
    delay={delay}
  />
);

// Apple-style button skeleton
export const AppleSkeletonButton = ({ 
  width = "w-24", 
  height = "h-10", 
  className = "", 
  delay = 0,
  variant = "primary" // primary, secondary, icon
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'rounded-xl';
      case 'secondary':
        return 'rounded-lg';
      case 'icon':
        return 'rounded-full';
      default:
        return 'rounded-xl';
    }
  };

  return (
    <AppleSkeletonBase 
      className={`${width} ${height} ${getVariantStyles()} ${className}`} 
      delay={delay}
    />
  );
};

// Apple-style card container
export const AppleSkeletonCard = ({ 
  height = "h-32", 
  className = "", 
  children,
  padding = "p-6"
}) => (
  <div className={`relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-100/50 shadow-sm ${height} ${padding} ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-gray-100/30 rounded-2xl" />
    <div className="relative z-10">
      {children}
    </div>
  </div>
);

// Apple-style League Header Skeleton
export const AppleLeagueHeaderSkeleton = () => (
  <AppleSkeletonCard className="mb-8" padding="p-8">
    {/* Mobile-first responsive layout */}
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-start lg:justify-between lg:space-y-0">
        {/* Title and description */}
        <div className="flex-1 space-y-3 lg:pr-8">
          <AppleSkeletonText 
            width="w-full max-w-sm" 
            variant="title" 
            delay={100}
          />
          <AppleSkeletonText 
            width="w-full max-w-lg" 
            variant="body" 
            delay={200}
          />
          <AppleSkeletonText 
            width="w-full max-w-md" 
            variant="body" 
            delay={250}
          />
        </div>
        
        {/* Progress section - responsive layout */}
        <div className="flex items-center justify-between lg:flex-col lg:items-end lg:space-y-3">
          {/* Progress stats */}
          <div className="flex items-center space-x-6 lg:flex-col lg:items-end lg:space-x-0 lg:space-y-2">
            <div className="text-right space-y-1">
              <AppleSkeletonText 
                width="w-12" 
                variant="title" 
                delay={300}
              />
              <AppleSkeletonText 
                width="w-16" 
                variant="caption" 
                delay={350}
              />
            </div>
            <div className="text-right space-y-1 hidden sm:block">
              <AppleSkeletonText 
                width="w-10" 
                variant="body" 
                delay={400}
              />
              <AppleSkeletonText 
                width="w-14" 
                variant="caption" 
                delay={450}
              />
            </div>
          </div>
          
          {/* Progress circle */}
          <AppleSkeletonCircle 
            size="w-16 h-16 lg:w-20 lg:h-20" 
            delay={500}
          />
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <AppleSkeletonText 
            width="w-20" 
            variant="caption" 
            delay={600}
          />
          <AppleSkeletonText 
            width="w-16" 
            variant="caption" 
            delay={650}
          />
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-200 to-blue-300 rounded-full animate-progress-fill"
            style={{ width: '45%', animationDelay: '700ms' }}
          />
        </div>
      </div>
    </div>
  </AppleSkeletonCard>
);

// Apple-style Week Skeleton with responsive design
export const AppleWeekSkeleton = ({ expanded = false, index = 0 }) => (
  <AppleSkeletonCard className="mb-4" padding="p-0">
    {/* Week header */}
    <div className="p-6 border-b border-gray-100/50">
      <div className="flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center space-x-4 flex-1">
          <AppleSkeletonCircle 
            size="w-6 h-6" 
            delay={index * 100}
          />
          <div className="space-y-2 flex-1">
            <AppleSkeletonText 
              width="w-full max-w-xs" 
              variant="subtitle" 
              delay={index * 100 + 50}
            />
            <AppleSkeletonText 
              width="w-full max-w-lg" 
              variant="body" 
              delay={index * 100 + 100}
            />
          </div>
        </div>
        
        {/* Right section - responsive */}
        <div className="flex items-center space-x-4 ml-4">
          <div className="hidden sm:flex items-center space-x-3">
            <AppleSkeletonText 
              width="w-8" 
              variant="caption" 
              delay={index * 100 + 150}
            />
            <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-200 to-green-300 rounded-full"
                style={{ 
                  width: `${30 + (index * 20)}%`,
                  animation: 'progress-fill 1.5s ease-out forwards',
                  animationDelay: `${index * 100 + 200}ms`
                }}
              />
            </div>
          </div>
          <AppleSkeletonCircle 
            size="w-5 h-5" 
            delay={index * 100 + 250}
          />
        </div>
      </div>
    </div>

    {/* Expanded content */}
    {expanded && (
      <div className="p-6 space-y-6">
        {[1, 2].map(sectionIndex => (
          <AppleSectionSkeleton 
            key={sectionIndex} 
            index={sectionIndex}
            delay={index * 100 + sectionIndex * 200}
          />
        ))}
      </div>
    )}
  </AppleSkeletonCard>
);

// Apple-style Section Skeleton with table structure
export const AppleSectionSkeleton = ({ delay = 0 }) => (
  <div className="border border-gray-100/50 rounded-xl overflow-hidden">
    {/* Section header */}
    <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100/50">
      <AppleSkeletonText 
        width="w-48" 
        variant="subtitle" 
        delay={delay}
      />
    </div>
    
    {/* Resources table */}
    <div className="overflow-x-auto">
      {/* Table header - responsive */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-3 bg-gray-50/30 border-b border-gray-100/50 text-sm">
        <div className="col-span-1 flex justify-center">
          <AppleSkeletonCircle size="w-4 h-4" delay={delay + 50} />
        </div>
        <div className="col-span-5">
          <AppleSkeletonText width="w-12" variant="caption" delay={delay + 100} />
        </div>
        <div className="col-span-2">
          <AppleSkeletonText width="w-16" variant="caption" delay={delay + 150} />
        </div>
        <div className="col-span-2">
          <AppleSkeletonText width="w-10" variant="caption" delay={delay + 200} />
        </div>
        <div className="col-span-2">
          <AppleSkeletonText width="w-14" variant="caption" delay={delay + 250} />
        </div>
      </div>
      
      {/* Table rows */}
      <div className="divide-y divide-gray-100/50">
        {[1, 2, 3].map(rowIndex => (
          <AppleResourceRowSkeleton 
            key={rowIndex} 
            index={rowIndex}
            delay={delay + rowIndex * 100}
          />
        ))}
      </div>
    </div>
  </div>
);

// Apple-style Resource Row Skeleton with responsive grid
export const AppleResourceRowSkeleton = ({ delay = 0 }) => (
  <div className="px-6 py-4">
    {/* Mobile layout */}
    <div className="lg:hidden space-y-3">
      <div className="flex items-start space-x-3">
        <AppleSkeletonCircle size="w-5 h-5" delay={delay} />
        <div className="flex-1 space-y-2">
          <AppleSkeletonText 
            width="w-full" 
            variant="body" 
            delay={delay + 50}
          />
          <div className="flex items-center space-x-4">
            <AppleSkeletonButton 
              width="w-12" 
              height="h-6" 
              variant="secondary"
              delay={delay + 100}
            />
            <AppleSkeletonText 
              width="w-16" 
              variant="caption" 
              delay={delay + 150}
            />
          </div>
        </div>
        <AppleSkeletonCircle size="w-6 h-6" delay={delay + 200} />
      </div>
    </div>

    {/* Desktop layout */}
    <div className="hidden lg:grid lg:grid-cols-12 gap-4 items-center">
      {/* Status */}
      <div className="col-span-1 flex justify-center">
        <AppleSkeletonCircle size="w-5 h-5" delay={delay} />
      </div>
      
      {/* Title */}
      <div className="col-span-5">
        <AppleSkeletonText 
          width="w-full" 
          variant="body" 
          delay={delay + 50}
        />
      </div>
      
      {/* Resource type */}
      <div className="col-span-2 flex items-center space-x-2">
        <AppleSkeletonCircle size="w-4 h-4" delay={delay + 100} />
        <AppleSkeletonButton 
          width="w-12" 
          height="h-6" 
          variant="secondary"
          delay={delay + 150}
        />
      </div>
      
      {/* Note */}
      <div className="col-span-2 flex justify-center">
        <AppleSkeletonButton 
          width="w-16" 
          height="h-6" 
          variant="secondary"
          delay={delay + 200}
        />
      </div>
      
      {/* Actions */}
      <div className="col-span-2 flex justify-center space-x-2">
        <AppleSkeletonCircle size="w-6 h-6" delay={delay + 250} />
        <AppleSkeletonCircle size="w-4 h-4" delay={delay + 300} />
      </div>
    </div>
  </div>
);

// Main Apple-style League Detail Skeleton
export const LeagueDetailSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50/50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
      {/* Back navigation with breadcrumb style */}
      <div className="mb-8">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          {/* Back button */}
          <div className="flex items-center space-x-3">
            <AppleSkeletonCircle size="w-5 h-5" delay={0} />
            <AppleSkeletonText width="w-24" variant="body" delay={50} />
          </div>
          
          {/* Quick stats - hidden on mobile */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <AppleSkeletonCircle size="w-4 h-4" delay={100} />
              <AppleSkeletonText width="w-20" variant="caption" delay={150} />
            </div>
            <div className="flex items-center space-x-2">
              <AppleSkeletonCircle size="w-4 h-4" delay={200} />
              <AppleSkeletonText width="w-24" variant="caption" delay={250} />
            </div>
            <div className="flex items-center space-x-2">
              <AppleSkeletonCircle size="w-4 h-4" delay={300} />
              <AppleSkeletonText width="w-18" variant="caption" delay={350} />
            </div>
          </div>
        </div>
      </div>
      
      {/* League header */}
      <AppleLeagueHeaderSkeleton />

      {/* Weeks skeleton with staggered animation */}
      <div className="space-y-6">
        <AppleWeekSkeleton expanded={true} index={0} />
        <AppleWeekSkeleton index={1} />
        <AppleWeekSkeleton index={2} />
      </div>

      {/* Assignment section skeleton */}
      <div className="mt-12">
        <AppleSkeletonCard height="h-48" padding="p-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <AppleSkeletonText 
                width="w-40" 
                variant="title" 
                delay={800}
              />
              <AppleSkeletonButton 
                width="w-32" 
                height="h-10" 
                delay={850}
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <AppleSkeletonText 
                  width="w-full" 
                  variant="body" 
                  delay={900}
                />
                <AppleSkeletonText 
                  width="w-3/4" 
                  variant="body" 
                  delay={950}
                />
              </div>
              <div className="space-y-3">
                <AppleSkeletonText 
                  width="w-full" 
                  variant="body" 
                  delay={1000}
                />
                <AppleSkeletonText 
                  width="w-2/3" 
                  variant="body" 
                  delay={1050}
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-100/50">
              <AppleSkeletonButton 
                width="w-full sm:w-24" 
                height="h-10" 
                variant="secondary"
                delay={1100}
              />
              <AppleSkeletonButton 
                width="w-full sm:w-32" 
                height="h-10" 
                delay={1150}
              />
            </div>
          </div>
        </AppleSkeletonCard>
      </div>
    </div>
  </div>
);

// Progressive loading with Apple-style indicators
export const AppleProgressiveLoadingSkeleton = ({ 
  sectionName, 
  resourceCount = 3,
  progress = 0 
}) => (
  <div className="px-6 py-8 text-center">
    <div className="max-w-sm mx-auto space-y-6">
      {/* Loading header with animated icon */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <AppleSkeletonCircle size="w-12 h-12" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
        
        <div className="space-y-2">
          <AppleSkeletonText 
            width="w-48" 
            variant="subtitle" 
            delay={100}
          />
          <AppleSkeletonText 
            width="w-32" 
            variant="caption" 
            delay={200}
          />
        </div>
      </div>
      
      {/* Progress indicator */}
      <div className="space-y-3">
        <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <p className="text-sm text-gray-500">
          Loading {sectionName ? `${sectionName} content` : 'content'}...
        </p>
      </div>
      
      {/* Resource preview skeletons */}
      <div className="space-y-3">
        {Array.from({ length: Math.min(resourceCount, 3) }, (_, i) => (
          <div key={i} className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg">
            <AppleSkeletonCircle size="w-8 h-8" delay={i * 100} />
            <div className="flex-1 space-y-1">
              <AppleSkeletonText 
                width="w-full" 
                variant="body" 
                delay={i * 100 + 50}
              />
              <AppleSkeletonText 
                width="w-20" 
                variant="caption" 
                delay={i * 100 + 100}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Legacy aliases for backward compatibility
export const LeagueHeaderSkeleton = AppleLeagueHeaderSkeleton;
export const WeekSkeleton = AppleWeekSkeleton;
export const SectionSkeleton = AppleSectionSkeleton;
export const ResourceRowSkeleton = AppleResourceRowSkeleton;
export const ProgressiveLoadingSkeleton = AppleProgressiveLoadingSkeleton;

// Export AppleSkeletonBase for external use
export { AppleSkeletonBase };

export default {
  LeagueDetailSkeleton,
  LeagueHeaderSkeleton,
  WeekSkeleton,
  SectionSkeleton,
  ResourceRowSkeleton,
  ProgressiveLoadingSkeleton,
  // Apple-style components
  AppleSkeletonBase,
  AppleLeagueHeaderSkeleton,
  AppleWeekSkeleton,
  AppleSectionSkeleton,
  AppleResourceRowSkeleton,
  AppleProgressiveLoadingSkeleton,
  AppleSkeletonText,
  AppleSkeletonCircle,
  AppleSkeletonButton,
  AppleSkeletonCard,
  // Legacy components
  SkeletonText,
  SkeletonCircle,
  SkeletonButton,
  SkeletonCard
};
