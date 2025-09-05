import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ElectricDataContext } from './ElectricDataContext.jsx';

// Provider component cho hệ thống điện Vân Canh
export const ElectricDataProvider = ({ children }) => {
  const [systemData, setSystemData] = useState({
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
    setLoadingProgress(prev => prev + (100 / 8)); // 8 sections total
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
        await loadSectionData('lowVoltage', 400);
        await loadSectionData('protection', 350);
        await loadSectionData('control', 300);
        await loadSectionData('lighting', 250);
        await loadSectionData('cable', 200);
        await loadSectionData('operation', 200);
        await loadSectionData('documentation', 150);

        // Load dữ liệu giới thiệu chung
        const introductionData = {
          singleLineDiagram: [
            { id: 'sld-1', name: 'Sơ đồ đơn tuyến chính', voltage: '22kV/0.4kV', capacity: '2x1000kVA', status: 'operational' },
            { id: 'sld-2', name: 'Sơ đồ phân phối', voltage: '0.4kV', capacity: '800kVA', status: 'operational' }
          ],
          systemOverview: [
            { id: 'overview-1', name: 'Trạm biến áp chính', type: '22kV/0.4kV', transformers: 2, status: 'operational' },
            { id: 'overview-2', name: 'Tủ điện phân phối', type: 'ACIT', panels: 8, status: 'operational' }
          ],
          technicalSpecs: [
            { id: 'spec-1', name: 'Điện áp định mức', value: '22kV/0.4kV', unit: 'V', status: 'normal' },
            { id: 'spec-2', name: 'Tần số', value: '50', unit: 'Hz', status: 'normal' },
            { id: 'spec-3', name: 'Công suất tổng', value: '2000', unit: 'kVA', status: 'normal' }
          ],
          standards: [
            { id: 'std-1', name: 'TCVN 5935-1:2013', description: 'Hệ thống điện hạ áp', compliance: '100%' },
            { id: 'std-2', name: 'IEC 60502-1', description: 'Cáp điện lực', compliance: '100%' }
          ]
        };

        // Load dữ liệu tủ điện hạ thế
        const lowVoltageData = {
          acitPanels: [
            { id: 'acit-1', name: 'Tủ ACIT 1', voltage: '400V', current: '1600A', status: 'operational' },
            { id: 'acit-2', name: 'Tủ ACIT 2', voltage: '400V', current: '1600A', status: 'operational' }
          ],
          bloksetPanels: [
            { id: 'blokset-1', name: 'Tủ Blokset 1', voltage: '400V', current: '630A', status: 'operational' },
            { id: 'blokset-2', name: 'Tủ Blokset 2', voltage: '400V', current: '630A', status: 'operational' }
          ],
          acbBreakers: [
            { id: 'acb-1', name: 'ACB MTZ2 1600A', voltage: '400V', current: '1600A', status: 'operational' },
            { id: 'acb-2', name: 'ACB MTZ2 1250A', voltage: '400V', current: '1250A', status: 'operational' }
          ],
          mccbBreakers: [
            { id: 'mccb-1', name: 'MCCB 400A', voltage: '400V', current: '400A', status: 'operational' },
            { id: 'mccb-2', name: 'MCCB 250A', voltage: '400V', current: '250A', status: 'operational' }
          ],
          mcbBreakers: [
            { id: 'mcb-1', name: 'MCB 63A', voltage: '230V', current: '63A', status: 'operational' },
            { id: 'mcb-2', name: 'MCB 32A', voltage: '230V', current: '32A', status: 'operational' }
          ],
          rcboRccb: [
            { id: 'rcbo-1', name: 'RCBO 30mA', voltage: '230V', current: '32A', status: 'operational' },
            { id: 'rccb-1', name: 'RCCB 30mA', voltage: '230V', current: '63A', status: 'operational' }
          ]
        };

        // Load dữ liệu hệ thống bảo vệ
        const protectionData = {
          overcurrentProtection: [
            { id: 'oc-1', name: 'Bảo vệ quá dòng', type: 'Thermal', setting: '1.2xIn', status: 'active' },
            { id: 'oc-2', name: 'Bảo vệ quá tải', type: 'Magnetic', setting: '5xIn', status: 'active' }
          ],
          earthFaultProtection: [
            { id: 'ef-1', name: 'RCD 30mA', type: 'Type A', sensitivity: '30mA', status: 'active' },
            { id: 'ef-2', name: 'RCD 100mA', type: 'Type A', sensitivity: '100mA', status: 'active' }
          ],
          shortCircuitProtection: [
            { id: 'sc-1', name: 'Bảo vệ ngắn mạch', type: 'Instantaneous', setting: '10xIn', status: 'active' }
          ]
        };

        // Load dữ liệu hệ thống điều khiển
        const controlData = {
          plcSystems: [
            { id: 'plc-1', name: 'PLC Siemens S7-1200', type: 'CPU 1214C', status: 'operational' },
            { id: 'plc-2', name: 'PLC Schneider Modicon', type: 'M221', status: 'operational' }
          ],
          atsSystems: [
            { id: 'ats-1', name: 'ATS Main', type: '4P 400A', status: 'operational' },
            { id: 'ats-2', name: 'ATS Backup', type: '4P 250A', status: 'operational' }
          ],
          generatorControl: [
            { id: 'gen-1', name: 'Điều khiển máy phát 1', type: 'Auto Start', status: 'operational' },
            { id: 'gen-2', name: 'Điều khiển máy phát 2', type: 'Auto Start', status: 'operational' }
          ]
        };

        // Load dữ liệu hệ thống chiếu sáng
        const lightingData = {
          generalLighting: [
            { id: 'light-1', name: 'Đèn LED 36W', type: 'LED Panel', quantity: 50, status: 'operational' },
            { id: 'light-2', name: 'Đèn LED 18W', type: 'LED Tube', quantity: 100, status: 'operational' }
          ],
          emergencyLighting: [
            { id: 'emergency-1', name: 'Đèn Exit', type: 'LED Exit', quantity: 20, status: 'operational' },
            { id: 'emergency-2', name: 'Đèn Emergency', type: 'LED Emergency', quantity: 30, status: 'operational' }
          ],
          socketSystems: [
            { id: 'socket-1', name: 'Ổ cắm 16A', type: 'Schuko', quantity: 80, status: 'operational' },
            { id: 'socket-2', name: 'Ổ cắm 32A', type: 'Industrial', quantity: 20, status: 'operational' }
          ]
        };

        // Load dữ liệu hệ thống cáp và máng
        const cableData = {
          cableTrays: [
            { id: 'tray-1', name: 'Thang máng 300x100', material: 'Galvanized Steel', length: '500m', status: 'installed' },
            { id: 'tray-2', name: 'Thang máng 200x100', material: 'Galvanized Steel', length: '300m', status: 'installed' }
          ],
          powerCables: [
            { id: 'power-1', name: 'Cáp 4x240mm²', type: 'XLPE', length: '200m', status: 'installed' },
            { id: 'power-2', name: 'Cáp 4x120mm²', type: 'XLPE', length: '150m', status: 'installed' }
          ],
          controlCables: [
            { id: 'control-1', name: 'Cáp điều khiển 24x1.5mm²', type: 'PVC', length: '100m', status: 'installed' },
            { id: 'control-2', name: 'Cáp điều khiển 12x1.5mm²', type: 'PVC', length: '80m', status: 'installed' }
          ]
        };

        // Load dữ liệu vận hành và bảo trì
        const operationData = {
          operationProcedures: [
            { id: 'op-1', name: 'Khởi động hệ thống', steps: 8, duration: '15 minutes', status: 'ready' },
            { id: 'op-2', name: 'Vận hành bình thường', monitoring: 'continuous', status: 'active' }
          ],
          backupSystemTests: [
            { id: 'test-1', name: 'Test máy phát', frequency: 'weekly', duration: '30 minutes', status: 'scheduled' },
            { id: 'test-2', name: 'Test ATS', frequency: 'monthly', duration: '15 minutes', status: 'scheduled' }
          ],
          maintenanceSchedules: [
            { id: 'maint-1', name: 'Bảo trì tủ điện', interval: '3 months', items: 15, status: 'scheduled' },
            { id: 'maint-2', name: 'Kiểm tra cáp', interval: '6 months', items: 10, status: 'scheduled' }
          ]
        };

        // Load dữ liệu tài liệu và tiêu chuẩn
        const documentationData = {
          vietnameseStandards: [
            { id: 'vn-1', name: 'TCVN 5935-1:2013', title: 'Hệ thống điện hạ áp', compliance: '100%' },
            { id: 'vn-2', name: 'QCVN 4:2009', title: 'Quy chuẩn kỹ thuật điện', compliance: '100%' }
          ],
          internationalStandards: [
            { id: 'int-1', name: 'IEC 60502-1', title: 'Cáp điện lực', compliance: '100%' },
            { id: 'int-2', name: 'BS 6387', title: 'Cáp chống cháy', compliance: '100%' }
          ],
          productCertifications: [
            { id: 'cert-1', name: 'ISO 9001', type: 'Quality Management', status: 'valid' },
            { id: 'cert-2', name: 'CE Marking', type: 'European Conformity', status: 'valid' }
          ]
        };

        // Cập nhật state với tất cả dữ liệu
        setSystemData({
          introduction: introductionData,
          lowVoltage: lowVoltageData,
          protection: protectionData,
          control: controlData,
          lighting: lightingData,
          cable: cableData,
          operation: operationData,
          documentation: documentationData
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
  const getPanelById = useCallback((panelId) => {
    const allPanels = [
      ...systemData.lowVoltage.acitPanels,
      ...systemData.lowVoltage.bloksetPanels
    ];
    return allPanels.find(panel => panel.id === panelId);
  }, [systemData]);

  const getPanelsByType = useCallback((type) => {
    return systemData.lowVoltage[type] || [];
  }, [systemData.lowVoltage]);

  const getActiveProtection = useCallback(() => {
    const allProtection = [
      ...systemData.protection.overcurrentProtection,
      ...systemData.protection.earthFaultProtection,
      ...systemData.protection.shortCircuitProtection
    ];
    return allProtection.filter(protection => protection.status === 'active');
  }, [systemData.protection]);

  const getSystemStatus = useCallback(() => {
    const operationalPanels = systemData.lowVoltage.acitPanels.filter(panel => panel.status === 'operational').length;
    const totalPanels = systemData.lowVoltage.acitPanels.length;
    const healthPercentage = (operationalPanels / totalPanels) * 100;
    
    if (healthPercentage >= 90) return 'excellent';
    if (healthPercentage >= 75) return 'good';
    if (healthPercentage >= 50) return 'fair';
    return 'poor';
  }, [systemData.lowVoltage.acitPanels]);

  const getMaintenanceSchedule = useCallback(() => {
    return systemData.operation.maintenanceSchedules.filter(schedule => schedule.status === 'scheduled');
  }, [systemData.operation.maintenanceSchedules]);

  // Memoize value object để tránh re-render
  const value = useMemo(() => ({
    systemData,
    isLoading,
    isFullyLoaded,
    error,
    loadingProgress,
    loadedSections,
    currentLoadingSection,
    // Helper functions
    getPanelById,
    getPanelsByType,
    getActiveProtection,
    getSystemStatus,
    getMaintenanceSchedule
  }), [
    systemData,
    isLoading,
    isFullyLoaded,
    error,
    loadingProgress,
    loadedSections,
    currentLoadingSection,
    getPanelById,
    getPanelsByType,
    getActiveProtection,
    getSystemStatus,
    getMaintenanceSchedule
  ]);

  return (
    <ElectricDataContext.Provider value={value}>
      {children}
    </ElectricDataContext.Provider>
  );
};
