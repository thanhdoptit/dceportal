import { createContext } from 'react';

// Tạo context cho dữ liệu tổng quan TTDL Vân Canh
export const VanCanhDataContext = createContext({
  systemData: {
    // Dữ liệu tổng quan dự án
    overview: {
      milestones: [],
      standards: [],
      comparisons: [],
    },
    // Dữ liệu kiến trúc
    architecture: {
      zones: [],
      standards: [],
      design: [],
    },
    // Dữ liệu hệ thống điện
    power: {
      substations: [],
      ups: [],
      distribution: [],
    },
    // Dữ liệu hệ thống làm mát
    cooling: {
      chillers: [],
      pacs: [],
      tes: [],
    },
    // Dữ liệu hệ thống PCCC
    fireProtection: {
      gasSystems: [],
      smokeDetection: [],
      monitoring: [],
    },
    // Dữ liệu hệ thống an ninh
    security: {
      cctv: [],
      accessControl: [],
      pa: [],
    },
    // Dữ liệu hệ thống mạng
    network: {
      fiber: [],
      copper: [],
      activeActive: [],
    },
    // Dữ liệu hệ thống rack
    rack: {
      servers: [],
      capacity: [],
      containment: [],
    },
    // Dữ liệu hiệu quả và rủi ro
    risk: {
      effectiveness: [],
      risks: [],
      solutions: [],
    },
  },
  isLoading: true,
  isFullyLoaded: false,
  error: null,
  loadingProgress: 0,
  loadedSections: new Set(),
  currentLoadingSection: '',
  // Helper functions
  getSystemById: () => null,
  getSystemsByType: () => [],
  getActiveSystem: () => null,
  getRiskLevel: () => 'low',
  getEffectivenessScore: () => 0,
});
