import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getSidebarConfig } from '../components/layout/sidebarConfig';

const SidebarContext = createContext();

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProvider = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [sidebarReady, setSidebarReady] = useState(true);
  const location = useLocation();

  // Lấy cấu hình sidebar cho page hiện tại
  const getCurrentConfig = () => {
    return getSidebarConfig(location?.pathname || '/');
  };

  // Xử lý thay đổi trạng thái sidebar
  const handleSidebarChange = (newCollapsed) => {
    setIsAnimating(true);
    setCollapsed(newCollapsed);
    
    // Đợi animation hoàn thành (0.2s + buffer)
    setTimeout(() => {
      setIsAnimating(false);
      setSidebarReady(true);
    }, 300);
  };

  // Tự động cập nhật trạng thái sidebar khi chuyển page
  useEffect(() => {
    const newConfig = getCurrentConfig();
    
    // Đánh dấu sidebar chưa sẵn sàng
    setSidebarReady(false);
    setIsAnimating(true);
    
    // Delay để đảm bảo page transition mượt mà và sidebar thu gọn xong
    const timer = setTimeout(() => {
      if (newConfig.autoCollapse) {
        handleSidebarChange(true);
      } else {
        handleSidebarChange(newConfig.defaultCollapsed);
      }
    }, 150); // Tăng delay từ 100ms lên 150ms để mượt mà hơn
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const value = {
    collapsed,
    isAnimating,
    sidebarReady,
    setCollapsed: handleSidebarChange,
    getCurrentConfig
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}; 