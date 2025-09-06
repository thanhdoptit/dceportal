import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { CoolingDataContext } from './CoolingDataContext.js';

// Provider component
export const CoolingDataProvider = ({ children }) => {
  const [systemData, setSystemData] = useState({
    // Dữ liệu thiết bị chính
    devices: {
      chillers: [],
      pacs: [],
      pumps: [],
      tes: null,
      bms: null,
    },
    // Dữ liệu vận hành
    operations: {
      modes: [],
      procedures: [],
      schedules: [],
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
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadedSections, setLoadedSections] = useState(new Set());
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);
  const [currentLoadingSection, setCurrentLoadingSection] = useState('');

  // Các hàm load data riêng biệt cho từng section
  const loadSectionData = async (sectionName, delay = 200) => {
    setCurrentLoadingSection(sectionName);
    await new Promise(resolve => setTimeout(resolve, delay));
    setLoadingProgress(prev => prev + 100 / 8); // 8 sections total
    setLoadedSections(prev => new Set([...prev, sectionName]));
  };

  // Load tất cả dữ liệu tuần tự để UX mượt mà
  useEffect(() => {
    const loadAllDataSequentially = async () => {
      try {
        setIsLoading(true);
        setIsFullyLoaded(false);
        setError(null);
        setLoadingProgress(0);
        setLoadedSections(new Set());
        setCurrentLoadingSection('');

        // Load từng section tuần tự để UX mượt mà
        await loadSectionData('introduction', 300);
        await loadSectionData('devices', 400);
        await loadSectionData('pumps', 350);
        await loadSectionData('location', 200);
        await loadSectionData('operations', 300);
        await loadSectionData('safety', 250);
        await loadSectionData('documentation', 200);
        await loadSectionData('contact', 150);

        console.log('📊 Tạo dữ liệu đầy đủ cho tất cả sections...');

        // Load dữ liệu thiết bị
        const devicesData = {
          chillers: [
            {
              id: 'chiller-1',
              name: 'Chiller SMARDT AE Series',
              model: 'AE054.2B.F2HAJA.A010DX.E10',
              capacity: '632kW (180RT)',
              status: 'online',
              temperature: 10.2,
              pressure: 4.5,
            },
          ],
          pacs: [
            {
              id: 'pac-sdcv-1',
              name: 'PAC UNIFLAIR SDCV Series',
              model: 'SDCV0300A',
              capacity: '3-15.6kW',
              status: 'online',
              temperature: 22.1,
              humidity: 48,
            },
          ],
          pumps: [
            {
              id: 'pump-1',
              name: 'Bơm PCH-01',
              model: '3D 40-200',
              capacity: '600L/min',
              status: 'online',
              flow: 580,
              pressure: 2.8,
            },
          ],
          tes: {
            id: 'tes-1',
            name: 'TES Tank BTD-360',
            capacity: '360 tấn',
            temperature: 10.1,
            level: 85,
            backupTime: 10,
          },
          bms: {
            id: 'bms-1',
            name: 'BMS Integration',
            status: 'online',
            connectedDevices: 12,
            lastUpdate: new Date().toISOString(),
          },
        };

        // Load dữ liệu vận hành
        const operationsData = {
          modes: [
            { id: 'commissioning', name: 'Commissioning', active: false },
            { id: 'normal', name: 'Normal', active: true },
            { id: 'discharge', name: 'Discharge', active: false },
          ],
          procedures: [
            { id: 'startup', name: 'Quy trình khởi động', steps: 8 },
            { id: 'shutdown', name: 'Quy trình tắt máy', steps: 6 },
            { id: 'maintenance', name: 'Bảo trì định kỳ', steps: 12 },
          ],
          schedules: [
            { id: 'daily', name: 'Kiểm tra hàng ngày', time: '08:00' },
            { id: 'weekly', name: 'Bảo trì hàng tuần', time: '09:00' },
            { id: 'monthly', name: 'Bảo trì hàng tháng', time: '10:00' },
          ],
        };

        // Load dữ liệu an toàn
        const safetyData = {
          procedures: [
            { id: 'emergency', name: 'Quy trình khẩn cấp', priority: 'high' },
            { id: 'lockout', name: 'Lockout/Tagout', priority: 'high' },
            { id: 'ppe', name: 'Trang bị bảo hộ', priority: 'medium' },
          ],
          maintenance: [
            { id: 'filter', name: 'Thay lọc', interval: '3 months' },
            { id: 'belt', name: 'Kiểm tra dây curoa', interval: '6 months' },
            { id: 'refrigerant', name: 'Kiểm tra gas', interval: '12 months' },
          ],
          alerts: [
            { id: 'temp-high', message: 'Nhiệt độ cao', level: 'warning' },
            { id: 'pressure-low', message: 'Áp suất thấp', level: 'info' },
          ],
        };

        // Load dữ liệu tài liệu
        const documentationData = {
          manuals: [
            { id: 'chiller-manual', name: 'Hướng dẫn Chiller SMARDT', type: 'PDF' },
            { id: 'pac-manual', name: 'Hướng dẫn PAC UNIFLAIR', type: 'PDF' },
            { id: 'bms-manual', name: 'Hướng dẫn BMS', type: 'PDF' },
          ],
          drawings: [
            { id: 'piping', name: 'Sơ đồ đường ống', type: 'DWG' },
            { id: 'electrical', name: 'Sơ đồ điện', type: 'DWG' },
            { id: 'layout', name: 'Bố trí thiết bị', type: 'DWG' },
          ],
          references: [
            { id: 'ashrae', name: 'Tiêu chuẩn ASHRAE', type: 'Standard' },
            { id: 'uptime', name: 'Tiêu chuẩn Uptime', type: 'Standard' },
          ],
        };

        // Cập nhật state với tất cả dữ liệu
        setSystemData({
          devices: devicesData,
          operations: operationsData,
          safety: safetyData,
          documentation: documentationData,
        });

        // Đảm bảo tất cả sections đã load xong
        const allSections = [
          'introduction',
          'devices',
          'pumps',
          'location',
          'operations',
          'safety',
          'documentation',
          'contact',
        ];

        // Force complete loading sau khi tất cả sections đã được gọi
        setIsLoading(false);
        setIsFullyLoaded(true);
        setLoadingProgress(100);
        setCurrentLoadingSection('');

        console.log('🎉 Hoàn thành lazy loading tất cả dữ liệu hệ thống làm mát!');
        console.log('📋 Tất cả 8 sections đã được load:', allSections);
        console.log('✅ Tất cả sections đã sẵn sàng cho user thao tác!');
      } catch (err) {
        console.error('❌ Lỗi khi load dữ liệu:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    loadAllDataSequentially();
  }, []);

  // Debug effect để track loading states
  useEffect(() => {
    console.log('🔍 Loading states update:', {
      isLoading,
      isFullyLoaded,
      loadingProgress,
      loadedSectionsCount: loadedSections.size,
      currentLoadingSection,
    });
  }, [isLoading, isFullyLoaded, loadingProgress, loadedSections.size, currentLoadingSection]);

  // Fallback timeout để đảm bảo không bị stuck loading
  useEffect(() => {
    const fallbackTimeout = setTimeout(() => {
      if (isLoading) {
        console.warn('⚠️ Loading timeout - Force complete loading');
        setIsLoading(false);
        setIsFullyLoaded(true);
        setLoadingProgress(100);
        setCurrentLoadingSection('');
      }
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(fallbackTimeout);
  }, [isLoading]);

  // Memoize các hàm helper để tránh re-render
  const getDeviceById = useCallback(
    deviceId => {
      const allDevices = [
        ...systemData.devices.chillers,
        ...systemData.devices.pacs,
        ...systemData.devices.pumps,
      ];
      return allDevices.find(device => device.id === deviceId);
    },
    [systemData.devices]
  );

  const getDevicesByStatus = useCallback(
    status => {
      const allDevices = [
        ...systemData.devices.chillers,
        ...systemData.devices.pacs,
        ...systemData.devices.pumps,
      ];
      return allDevices.filter(device => device.status === status);
    },
    [systemData.devices]
  );

  const getActiveOperationMode = useCallback(() => {
    return systemData.operations.modes.find(mode => mode.active);
  }, [systemData.operations.modes]);

  const getMaintenanceSchedule = useCallback(() => {
    return systemData.operations.schedules;
  }, [systemData.operations.schedules]);

  const getSafetyAlerts = useCallback(() => {
    return systemData.safety.alerts;
  }, [systemData.safety.alerts]);

  // Memoize value object để tránh re-render
  const value = useMemo(
    () => ({
      systemData,
      isLoading,
      isFullyLoaded,
      error,
      loadingProgress,
      loadedSections,
      currentLoadingSection,
      // Helper functions
      getDeviceById,
      getDevicesByStatus,
      getActiveOperationMode,
      getMaintenanceSchedule,
      getSafetyAlerts,
    }),
    [
      systemData,
      isLoading,
      isFullyLoaded,
      error,
      loadingProgress,
      loadedSections,
      currentLoadingSection,
      getDeviceById,
      getDevicesByStatus,
      getActiveOperationMode,
      getMaintenanceSchedule,
      getSafetyAlerts,
    ]
  );

  return <CoolingDataContext.Provider value={value}>{children}</CoolingDataContext.Provider>;
};

// Chỉ export component để tương thích với Fast Refresh
// CoolingDataContext sẽ được export từ index.js
