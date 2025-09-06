import { createContext } from 'react';

// Tạo context cho dữ liệu hệ thống làm mát Hòa Lạc
export const CoolingDataContext = createContext({
  systemData: {
    // Dữ liệu thiết bị chính
    devices: {
      uniflair: [],
      apc: [],
      afm: [],
    },
    // Dữ liệu vận hành
    operations: {
      procedures: [],
      schedules: [],
      errors: [],
    },
    // Dữ liệu an toàn
    safety: {
      procedures: [],
      maintenance: [],
      alerts: [],
    },
    // Dữ liệu tài liệu
    documentation: {
      manuals: [],
      drawings: [],
      references: [],
    },
  },
  isLoading: true,
  isFullyLoaded: false,
  error: null,
  loadingProgress: 0,
  loadedSections: new Set(),
  currentLoadingSection: '',
  // Helper functions
  getDeviceById: () => null,
  getDevicesByStatus: () => [],
  getActiveOperationMode: () => null,
  getMaintenanceSchedule: () => [],
  getSafetyAlerts: () => [],
});
