import { createContext } from 'react';

// Tạo context cho dữ liệu hệ thống UPS Vân Canh
export const UPSDataContext = createContext({
  systemData: {
    // Dữ liệu giới thiệu chung
    introduction: {
      specifications: [],
      architecture: [],
      operationModes: [],
      bms: [],
    },
    // Dữ liệu hệ thống UPS Galaxy VL
    galaxyVL: {
      generalInfo: [],
      installation: [],
      operation: [],
      maintenance: [],
    },
    // Dữ liệu hệ thống ắc quy & BMS
    batteryBMS: {
      batteries: [],
      bms: [],
      monitoring: [],
    },
    // Dữ liệu giám sát & điều khiển
    monitoring: {
      userInterface: [],
      networkConnection: [],
      scada: [],
    },
    // Dữ liệu quy trình vận hành
    operation: {
      galaxy500kva: [],
      parallelSystem: [],
    },
    // Dữ liệu xử lý sự cố
    troubleshooting: {
      commonIssues: [],
      resolutionProcess: [],
    },
  },
  isLoading: true,
  isFullyLoaded: false,
  error: null,
  loadingProgress: 0,
  loadedSections: new Set(),
  currentLoadingSection: '',
  // Helper functions
  getUPSById: () => null,
  getUPSByStatus: () => [],
  getActiveOperationMode: () => null,
  getBatteryStatus: () => 'normal',
  getSystemHealth: () => 'good',
});
