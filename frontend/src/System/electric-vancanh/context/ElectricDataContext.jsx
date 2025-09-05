import { createContext } from 'react';

// Tạo context cho dữ liệu hệ thống điện Vân Canh
export const ElectricDataContext = createContext({
  systemData: {
    // Dữ liệu giới thiệu chung
    introduction: {
      singleLineDiagram: [],
      systemOverview: [],
      technicalSpecs: [],
      standards: []
    },
    // Dữ liệu tủ điện hạ thế
    lowVoltage: {
      acitPanels: [],
      bloksetPanels: [],
      acbBreakers: [],
      mccbBreakers: [],
      mcbBreakers: [],
      rcboRccb: []
    },
    // Dữ liệu hệ thống bảo vệ
    protection: {
      overcurrentProtection: [],
      earthFaultProtection: [],
      shortCircuitProtection: []
    },
    // Dữ liệu hệ thống điều khiển
    control: {
      plcSystems: [],
      atsSystems: [],
      generatorControl: []
    },
    // Dữ liệu hệ thống chiếu sáng
    lighting: {
      generalLighting: [],
      emergencyLighting: [],
      socketSystems: []
    },
    // Dữ liệu hệ thống cáp và máng
    cable: {
      cableTrays: [],
      powerCables: [],
      controlCables: []
    },
    // Dữ liệu vận hành và bảo trì
    operation: {
      operationProcedures: [],
      backupSystemTests: [],
      maintenanceSchedules: []
    },
    // Dữ liệu tài liệu và tiêu chuẩn
    documentation: {
      vietnameseStandards: [],
      internationalStandards: [],
      productCertifications: []
    }
  },
  isLoading: true,
  isFullyLoaded: false,
  error: null,
  loadingProgress: 0,
  loadedSections: new Set(),
  currentLoadingSection: '',
  // Helper functions
  getPanelById: () => null,
  getPanelsByType: () => [],
  getActiveProtection: () => null,
  getSystemStatus: () => 'normal',
  getMaintenanceSchedule: () => []
});
