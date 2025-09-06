import { useCallback, useEffect, useMemo, useState } from 'react';
import { CoolingDataContext } from './CoolingDataContext.jsx';

// Provider component cho hệ thống làm mát Hòa Lạc
export const CoolingDataProvider = ({ children }) => {
  const [systemData, setSystemData] = useState({
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
    setLoadingProgress(prev => prev + 100 / 6); // 6 sections total
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
        await loadSectionData('device-guide', 400);
        await loadSectionData('location', 350);
        await loadSectionData('application', 300);
        await loadSectionData('contact', 200);
        await loadSectionData('documentation', 150);

        // Load dữ liệu thiết bị Hòa Lạc
        const devicesData = {
          uniflair: [
            {
              id: 'tdav1321a',
              name: 'TDAV1321A - UNIFLAIR',
              model: 'TDAV1321A',
              capacity: '48.1 kW',
              quantity: 2,
              status: 'online',
              temperature: 22.1,
              humidity: 48,
            },
            {
              id: 'tdav2242a',
              name: 'TDAV2242A - UNIFLAIR',
              model: 'TDAV2242A',
              capacity: '67.2 kW',
              quantity: 3,
              status: 'online',
              temperature: 22.0,
              humidity: 47,
            },
            {
              id: 'tdav2842a',
              name: 'TDAV2842A - UNIFLAIR',
              model: 'TDAV2842A',
              capacity: '84.0 kW',
              quantity: 3,
              status: 'online',
              temperature: 21.9,
              humidity: 46,
            },
          ],
          apc: [
            {
              id: 'fm40h-agb-esd',
              name: 'FM40H-AGB-ESD - APC',
              model: 'FM40H-AGB-ESD',
              capacity: '47-50 kW',
              quantity: 5,
              status: 'online',
              temperature: 22.2,
              humidity: 49,
            },
            {
              id: 'acrp102',
              name: 'ACRP102 - APC',
              model: 'ACRP102',
              capacity: '~45 kW',
              quantity: 4,
              status: 'online',
              temperature: 22.1,
              humidity: 48,
            },
          ],
          afm: [
            {
              id: 'afm4500b',
              name: 'Quạt sàn AFM4500B',
              model: 'AFM4500B',
              capacity: '4500 m³/h',
              quantity: 10,
              status: 'online',
              fanSpeed: '2 tốc độ',
              fanPower: '200 W',
            },
          ],
        };

        // Load dữ liệu vận hành
        const operationsData = {
          procedures: [
            { id: 'daily-operation', name: 'Quy trình vận hành hàng ngày', steps: 8 },
            { id: 'error-handling', name: 'Xử lý mã lỗi', steps: 12 },
            { id: 'maintenance', name: 'Bảo trì định kỳ', steps: 15 },
          ],
          schedules: [
            { id: 'daily', name: 'Kiểm tra hàng ngày', time: '08:00' },
            { id: 'weekly', name: 'Bảo trì hàng tuần', time: '09:00' },
            { id: 'monthly', name: 'Bảo trì hàng tháng', time: '10:00' },
          ],
          errors: [
            { id: 'tdav-errors', name: 'Lỗi TDAV Series', count: 9 },
            { id: 'apc-errors', name: 'Lỗi APC Series', count: 7 },
            { id: 'afm-errors', name: 'Lỗi AFM Series', count: 5 },
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
            { id: 'uniflair-manual', name: 'Hướng dẫn UNIFLAIR TDAV', type: 'PDF' },
            { id: 'apc-manual', name: 'Hướng dẫn APC FM40H/ACRP', type: 'PDF' },
            { id: 'afm-manual', name: 'Hướng dẫn AFM4500B', type: 'PDF' },
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
        setIsLoading(false);
        setIsFullyLoaded(true);
        setLoadingProgress(100);
        setCurrentLoadingSection('');
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    loadAllDataSequentially();
  }, []);

  // Fallback timeout để đảm bảo không bị stuck loading
  useEffect(() => {
    const fallbackTimeout = setTimeout(() => {
      if (isLoading) {
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
        ...systemData.devices.uniflair,
        ...systemData.devices.apc,
        ...systemData.devices.afm,
      ];
      return allDevices.find(device => device.id === deviceId);
    },
    [systemData.devices]
  );

  const getDevicesByStatus = useCallback(
    status => {
      const allDevices = [
        ...systemData.devices.uniflair,
        ...systemData.devices.apc,
        ...systemData.devices.afm,
      ];
      return allDevices.filter(device => device.status === status);
    },
    [systemData.devices]
  );

  const getActiveOperationMode = useCallback(() => {
    return systemData.operations.procedures.find(proc => proc.active);
  }, [systemData.operations.procedures]);

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
