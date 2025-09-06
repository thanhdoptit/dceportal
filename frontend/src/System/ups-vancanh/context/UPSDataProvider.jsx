import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { UPSDataContext } from './UPSDataContext.jsx';

// Provider component cho hệ thống UPS Vân Canh
export const UPSDataProvider = ({ children }) => {
  const [systemData, setSystemData] = useState({
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
        await loadSectionData('galaxyVL', 400);
        await loadSectionData('batteryBMS', 350);
        await loadSectionData('monitoring', 300);
        await loadSectionData('operation', 250);
        await loadSectionData('troubleshooting', 200);

        // Load dữ liệu giới thiệu chung
        const introductionData = {
          specifications: [
            {
              id: 'spec-1',
              name: 'UPS Galaxy VL 500kVA',
              capacity: '500 kVA',
              input: '380V/50Hz',
              output: '380V/50Hz',
              status: 'operational',
            },
            {
              id: 'spec-2',
              name: 'UPS Galaxy VL 500kVA (Backup)',
              capacity: '500 kVA',
              input: '380V/50Hz',
              output: '380V/50Hz',
              status: 'standby',
            },
          ],
          architecture: [
            {
              id: 'arch-1',
              name: 'Double Conversion',
              type: 'Online UPS',
              efficiency: '96%',
              status: 'operational',
            },
            {
              id: 'arch-2',
              name: 'Parallel System',
              type: 'N+1 Redundancy',
              efficiency: '97%',
              status: 'operational',
            },
          ],
          operationModes: [
            {
              id: 'mode-1',
              name: 'Normal Mode',
              description: 'AC Input → Rectifier → Inverter → Load',
              active: true,
            },
            {
              id: 'mode-2',
              name: 'Battery Mode',
              description: 'Battery → Inverter → Load',
              active: false,
            },
            {
              id: 'mode-3',
              name: 'Bypass Mode',
              description: 'AC Input → Bypass → Load',
              active: false,
            },
          ],
          bms: [
            {
              id: 'bms-1',
              name: 'Battery Management System',
              type: 'Smart BMS',
              batteries: 40,
              status: 'operational',
            },
          ],
        };

        // Load dữ liệu hệ thống UPS Galaxy VL
        const galaxyVLData = {
          generalInfo: [
            {
              id: 'galaxy-1',
              name: 'Galaxy VL 500kVA',
              model: 'Galaxy VL 500kVA',
              power: '500 kVA',
              efficiency: '96%',
              status: 'operational',
            },
          ],
          installation: [
            {
              id: 'install-1',
              name: 'Environmental Requirements',
              temperature: '0-40°C',
              humidity: '0-95% RH',
              ventilation: 'Required',
            },
            {
              id: 'install-2',
              name: 'Electrical Requirements',
              input: '380V ±10%',
              frequency: '50Hz ±5%',
              grounding: 'Required',
            },
          ],
          operation: [
            {
              id: 'op-1',
              name: 'Startup Procedure',
              steps: 8,
              duration: '5 minutes',
              status: 'ready',
            },
            {
              id: 'op-2',
              name: 'Normal Operation',
              monitoring: 'continuous',
              alarms: 'enabled',
              status: 'active',
            },
          ],
          maintenance: [
            {
              id: 'maint-1',
              name: 'Preventive Maintenance',
              interval: '3 months',
              items: 12,
              status: 'scheduled',
            },
            {
              id: 'maint-2',
              name: 'Battery Replacement',
              interval: '5 years',
              batteries: 40,
              status: 'planned',
            },
          ],
        };

        // Load dữ liệu hệ thống ắc quy & BMS
        const batteryBMSData = {
          batteries: [
            {
              id: 'battery-1',
              name: 'VRLA Battery',
              type: 'Lead Acid',
              capacity: '12V 100Ah',
              quantity: 40,
              status: 'good',
            },
            {
              id: 'battery-2',
              name: 'Battery Bank',
              voltage: '480V',
              capacity: '100Ah',
              runtime: '15 minutes',
              status: 'operational',
            },
          ],
          bms: [
            {
              id: 'bms-1',
              name: 'Battery Management System',
              type: 'Smart BMS',
              monitoring: 'continuous',
              status: 'operational',
            },
          ],
          monitoring: [
            {
              id: 'monitor-1',
              name: 'Battery Voltage',
              range: '10.5V - 13.8V',
              current: '12.6V',
              status: 'normal',
            },
            {
              id: 'monitor-2',
              name: 'Battery Temperature',
              range: '15°C - 35°C',
              current: '25°C',
              status: 'normal',
            },
          ],
        };

        // Load dữ liệu giám sát & điều khiển
        const monitoringData = {
          userInterface: [
            {
              id: 'ui-1',
              name: 'Main Display',
              type: 'LCD Touchscreen',
              features: ['Status', 'Alarms', 'Settings'],
              status: 'operational',
            },
            {
              id: 'ui-2',
              name: 'Web Interface',
              type: 'Web-based',
              features: ['Remote Access', 'Historical Data'],
              status: 'operational',
            },
          ],
          networkConnection: [
            {
              id: 'net-1',
              name: 'Modbus TCP',
              protocol: 'Modbus TCP/IP',
              port: 502,
              status: 'connected',
            },
            { id: 'net-2', name: 'SNMP', protocol: 'SNMP v2c', port: 161, status: 'connected' },
          ],
          scada: [
            {
              id: 'scada-1',
              name: 'SCADA Integration',
              type: 'OPC UA',
              status: 'connected',
              dataPoints: 50,
            },
          ],
        };

        // Load dữ liệu quy trình vận hành
        const operationData = {
          galaxy500kva: [
            {
              id: 'op-1',
              name: 'Safety Guidelines',
              items: 15,
              priority: 'high',
              status: 'active',
            },
            { id: 'op-2', name: 'System Overview', components: 8, status: 'operational' },
            { id: 'op-3', name: 'Operation Procedures', steps: 12, status: 'ready' },
            { id: 'op-4', name: 'Troubleshooting', issues: 20, status: 'available' },
          ],
          parallelSystem: [
            {
              id: 'parallel-1',
              name: 'Parallel Startup',
              steps: 8,
              duration: '10 minutes',
              status: 'ready',
            },
            {
              id: 'parallel-2',
              name: 'Maintenance Bypass',
              steps: 6,
              duration: '5 minutes',
              status: 'ready',
            },
            {
              id: 'parallel-3',
              name: 'System Isolation',
              steps: 4,
              duration: '3 minutes',
              status: 'ready',
            },
            {
              id: 'parallel-4',
              name: 'System Integration',
              steps: 5,
              duration: '5 minutes',
              status: 'ready',
            },
          ],
        };

        // Load dữ liệu xử lý sự cố
        const troubleshootingData = {
          commonIssues: [
            {
              id: 'issue-1',
              name: 'Battery Issues',
              type: 'Battery',
              frequency: 'low',
              severity: 'medium',
              resolution: 'Replace battery',
            },
            {
              id: 'issue-2',
              name: 'Electrical Issues',
              type: 'Electrical',
              frequency: 'very low',
              severity: 'high',
              resolution: 'Check connections',
            },
            {
              id: 'issue-3',
              name: 'Network Issues',
              type: 'Network',
              frequency: 'low',
              severity: 'low',
              resolution: 'Check network settings',
            },
          ],
          resolutionProcess: [
            {
              id: 'process-1',
              name: 'Issue Analysis',
              steps: 5,
              duration: '10 minutes',
              priority: 'high',
            },
            {
              id: 'process-2',
              name: 'Resolution Steps',
              steps: 8,
              duration: '30 minutes',
              priority: 'high',
            },
            {
              id: 'process-3',
              name: 'Post-Resolution Check',
              steps: 6,
              duration: '15 minutes',
              priority: 'medium',
            },
          ],
        };

        // Cập nhật state với tất cả dữ liệu
        setSystemData({
          introduction: introductionData,
          galaxyVL: galaxyVLData,
          batteryBMS: batteryBMSData,
          monitoring: monitoringData,
          operation: operationData,
          troubleshooting: troubleshootingData,
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
  const getUPSById = useCallback(
    upsId => {
      const allUPS = [
        ...systemData.introduction.specifications,
        ...systemData.galaxyVL.generalInfo,
      ];
      return allUPS.find(ups => ups.id === upsId);
    },
    [systemData]
  );

  const getUPSByStatus = useCallback(
    status => {
      const allUPS = [
        ...systemData.introduction.specifications,
        ...systemData.galaxyVL.generalInfo,
      ];
      return allUPS.filter(ups => ups.status === status);
    },
    [systemData]
  );

  const getActiveOperationMode = useCallback(() => {
    return systemData.introduction.operationModes.find(mode => mode.active);
  }, [systemData.introduction.operationModes]);

  const getBatteryStatus = useCallback(() => {
    const battery = systemData.batteryBMS.batteries.find(b => b.id === 'battery-1');
    if (!battery) return 'unknown';
    return battery.status;
  }, [systemData.batteryBMS.batteries]);

  const getSystemHealth = useCallback(() => {
    const operationalUPS = systemData.introduction.specifications.filter(
      ups => ups.status === 'operational'
    ).length;
    const totalUPS = systemData.introduction.specifications.length;
    const healthPercentage = (operationalUPS / totalUPS) * 100;

    if (healthPercentage >= 90) return 'excellent';
    if (healthPercentage >= 75) return 'good';
    if (healthPercentage >= 50) return 'fair';
    return 'poor';
  }, [systemData.introduction.specifications]);

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
      getUPSById,
      getUPSByStatus,
      getActiveOperationMode,
      getBatteryStatus,
      getSystemHealth,
    }),
    [
      systemData,
      isLoading,
      isFullyLoaded,
      error,
      loadingProgress,
      loadedSections,
      currentLoadingSection,
      getUPSById,
      getUPSByStatus,
      getActiveOperationMode,
      getBatteryStatus,
      getSystemHealth,
    ]
  );

  return <UPSDataContext.Provider value={value}>{children}</UPSDataContext.Provider>;
};
