import { useContext } from 'react';
import { CoolingDataContext } from './CoolingDataContext.js';

// Hook để sử dụng context
export const useCoolingData = () => {
  const context = useContext(CoolingDataContext);
  if (!context) {
    throw new Error('useCoolingData must be used within a CoolingDataProvider');
  }
  return context;
};
