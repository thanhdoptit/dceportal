import { useContext } from 'react';
import { VanCanhDataContext } from './VanCanhDataContext.jsx';

// Custom hook để sử dụng VanCanhDataContext
export const useVanCanhData = () => {
  const context = useContext(VanCanhDataContext);

  if (!context) {
    throw new Error('useVanCanhData must be used within a VanCanhDataProvider');
  }

  return context;
};
