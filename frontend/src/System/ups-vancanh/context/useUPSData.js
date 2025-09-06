import { useContext } from 'react';
import { UPSDataContext } from './UPSDataContext.jsx';

// Custom hook để sử dụng UPSDataContext
export const useUPSData = () => {
  const context = useContext(UPSDataContext);

  if (!context) {
    throw new Error('useUPSData must be used within a UPSDataProvider');
  }

  return context;
};
