import React from 'react';
import './animations.css';

/**
 * Modern Error Screen Component
 * Hiển thị error screen hiện đại với animation đẹp
 */
const ModernErrorScreen = ({
  title = 'Đã xảy ra lỗi',
  subtitle = 'Vui lòng thử lại sau',
  error = 'Unknown error',
  icon = '⚠️',
  color = '#f5222d',
  onRetry = null,
}) => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-100 flex items-center justify-center p-4'>
      <div className='max-w-md w-full'>
        {/* Main Error Card */}
        <div className='bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center'>
          {/* Animated Icon */}
          <div className='relative mb-6'>
            <div
              className='w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl animate-pulse'
              style={{
                background: `linear-gradient(135deg, ${color}20, ${color}40)`,
                border: `2px solid ${color}30`,
              }}
            >
              {icon}
            </div>

            {/* Shaking Animation */}
            <div
              className='absolute inset-0 w-20 h-20 mx-auto rounded-full border-4 border-transparent animate-shake'
              style={{
                borderColor: color + '40',
              }}
            />

            {/* Error Dots */}
            <div className='absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1'>
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className='w-2 h-2 rounded-full animate-bounce'
                  style={{
                    backgroundColor: color,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '0.6s',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Title */}
          <h2 className='text-xl font-bold mb-2 bg-gradient-to-r from-red-800 to-red-600 bg-clip-text text-transparent'>
            {title}
          </h2>

          {/* Subtitle */}
          <p className='text-slate-600 text-sm mb-4'>{subtitle}</p>

          {/* Error Details */}
          <div className='bg-red-50 border border-red-200 rounded-lg p-3 mb-6'>
            <p className='text-red-700 text-xs font-mono break-all'>{error}</p>
          </div>

          {/* Retry Button */}
          {onRetry && (
            <button
              onClick={onRetry}
              className='w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95'
            >
              Thử lại
            </button>
          )}

          {/* Help Text */}
          <p className='text-xs text-slate-500 mt-4'>
            Nếu vấn đề vẫn tiếp tục, vui lòng liên hệ quản trị viên
          </p>
        </div>

        {/* Floating Elements */}
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className='absolute w-2 h-2 rounded-full opacity-20 animate-float'
              style={{
                backgroundColor: color,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModernErrorScreen;
