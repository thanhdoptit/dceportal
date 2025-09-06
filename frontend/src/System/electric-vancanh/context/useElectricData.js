import { useContext } from 'react';
import { ElectricDataContext } from './ElectricDataContext.jsx';

// Custom hook để sử dụng ElectricDataContext
export const useElectricData = () => {
  const context = useContext(ElectricDataContext);

  if (!context) {
    throw new Error('useElectricData must be used within an ElectricDataProvider');
  }

  return context;
};
