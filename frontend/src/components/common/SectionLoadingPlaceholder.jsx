import React from 'react';

/**
 * Section Loading Placeholder Component
 * Hiển thị placeholder đẹp cho các section đang load
 */
const SectionLoadingPlaceholder = ({ 
  title = "Đang tải nội dung...",
  icon = "⏳",
  color = "#1890ff"
}) => {
  return (
    <div className="w-full">
      {/* Main Placeholder Card */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-dashed border-slate-300 rounded-xl p-8 text-center transition-all duration-300 hover:border-blue-400 hover:shadow-lg">
        {/* Animated Icon */}
        <div className="relative mb-4">
          <div 
            className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl animate-pulse"
            style={{ 
              background: `linear-gradient(135deg, ${color}20, ${color}40)`,
              border: `2px solid ${color}30`
            }}
          >
            {icon}
          </div>
          
          {/* Rotating Ring */}
          <div 
            className="absolute inset-0 w-16 h-16 mx-auto rounded-full border-3 border-transparent animate-spin"
            style={{ 
              borderTopColor: color,
              borderRightColor: color + '40'
            }}
          />
        </div>

        {/* Title */}
        <h3 
          className="text-lg font-semibold mb-2 bg-gradient-to-r from-slate-700 to-slate-500 bg-clip-text text-transparent"
        >
          {title}
        </h3>
        
        {/* Subtitle */}
        <p className="text-slate-500 text-sm mb-4">
          Nội dung sẽ hiển thị trong giây lát...
        </p>

        {/* Progress Dots */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full animate-bounce"
              style={{ 
                backgroundColor: color,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '0.6s'
              }}
            />
          ))}
        </div>

        {/* Skeleton Content */}
        <div className="mt-6 space-y-3">
          <div className="h-4 bg-slate-200 rounded animate-pulse" style={{ width: '80%', margin: '0 auto' }} />
          <div className="h-4 bg-slate-200 rounded animate-pulse" style={{ width: '60%', margin: '0 auto' }} />
          <div className="h-4 bg-slate-200 rounded animate-pulse" style={{ width: '70%', margin: '0 auto' }} />
        </div>
      </div>
    </div>
  );
};

export default SectionLoadingPlaceholder;
