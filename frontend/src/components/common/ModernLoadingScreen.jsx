import React from 'react';
import './animations.css';

/**
 * Modern Loading Screen Component
 * Hiển thị loading screen hiện đại với animation đẹp
 */
const ModernLoadingScreen = ({ 
  title = "Đang tải hệ thống...", 
  subtitle = "Vui lòng chờ trong giây lát",
  icon = "⚡",
  color = "#1890ff"
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Main Loading Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center">
          {/* Animated Icon */}
          <div className="relative mb-6">
            <div 
              className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl animate-pulse"
              style={{ 
                background: `linear-gradient(135deg, ${color}20, ${color}40)`,
                border: `2px solid ${color}30`
              }}
            >
              {icon}
            </div>
            
            {/* Rotating Ring */}
            <div 
              className="absolute inset-0 w-20 h-20 mx-auto rounded-full border-4 border-transparent animate-spin"
              style={{ 
                borderTopColor: color,
                borderRightColor: color + '40'
              }}
            />
            
            {/* Pulsing Dots */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
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
          </div>

          {/* Title */}
          <h2 
            className="text-xl font-bold mb-2 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent"
          >
            {title}
          </h2>
          
          {/* Subtitle */}
          <p className="text-slate-600 text-sm mb-6">
            {subtitle}
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 rounded-full h-2 mb-4 overflow-hidden">
                      <div 
            className="h-full rounded-full transition-all duration-1000 ease-out animate-progress"
            style={{ 
              background: `linear-gradient(90deg, ${color}, ${color}80)`,
              width: '70%'
            }}
          />
          </div>

          {/* Loading Steps */}
          <div className="space-y-2 text-xs text-slate-500">
            <div className="flex items-center justify-between">
              <span>Đang tải</span>
              <span className="text-green-500">✓</span>
            </div>
            {/* <div className="flex items-center justify-between">
              <span>Tải dữ liệu</span>
              <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
            <div className="flex items-center justify-between">
              <span>Chuẩn bị giao diện</span>
              <span className="text-slate-400">⏳</span>
            </div> */}
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full opacity-20 animate-float"
              style={{
                backgroundColor: color,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

    </div>
  );
};

export default ModernLoadingScreen;
