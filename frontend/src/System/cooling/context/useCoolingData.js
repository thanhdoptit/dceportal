import { useContext } from 'react';
import { CoolingDataContext } from './CoolingDataContext.jsx';

// Custom hook để sử dụng CoolingDataContext
export const useCoolingData = () => {
  const context = useContext(CoolingDataContext);

  if (!context) {
    throw new Error('useCoolingData must be used within a CoolingDataProvider');
  }

  return context;
};
