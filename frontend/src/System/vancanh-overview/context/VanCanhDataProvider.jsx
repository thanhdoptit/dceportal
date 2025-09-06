import { useCallback, useEffect, useMemo, useState } from 'react';
import { VanCanhDataContext } from './VanCanhDataContext.jsx';

// Provider component cho tổng quan TTDL Vân Canh
export const VanCanhDataProvider = ({ children }) => {
  const [systemData, setSystemData] = useState({
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
    setLoadingProgress(prev => prev + 100 / 9); // 9 sections total
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
        await loadSectionData('overview', 300);
        await loadSectionData('architecture', 400);
        await loadSectionData('power', 350);
        await loadSectionData('cooling', 300);
        await loadSectionData('fireProtection', 250);
        await loadSectionData('security', 200);
        await loadSectionData('network', 200);
        await loadSectionData('rack', 200);
        await loadSectionData('risk', 150);

        // Load dữ liệu tổng quan dự án
        const overviewData = {
          milestones: [
            {
              id: 'milestone-1',
              name: 'Khởi công xây dựng',
              date: '2023-01-01',
              status: 'completed',
            },
            {
              id: 'milestone-2',
              name: 'Hoàn thành cơ sở hạ tầng',
              date: '2023-06-01',
              status: 'completed',
            },
            {
              id: 'milestone-3',
              name: 'Lắp đặt thiết bị',
              date: '2023-09-01',
              status: 'completed',
            },
            {
              id: 'milestone-4',
              name: 'Vận hành thử nghiệm',
              date: '2023-12-01',
              status: 'completed',
            },
          ],
          standards: [
            { id: 'standard-1', name: 'Uptime Tier III', level: 'Tier III', compliance: 95 },
            { id: 'standard-2', name: 'ISO 27001', level: 'Information Security', compliance: 90 },
            { id: 'standard-3', name: 'TIA-942', level: 'Data Center', compliance: 88 },
          ],
          comparisons: [
            {
              id: 'comparison-1',
              metric: 'Uptime',
              target: '99.982%',
              current: '99.985%',
              status: 'exceeded',
            },
            {
              id: 'comparison-2',
              metric: 'PUE',
              target: '1.4',
              current: '1.35',
              status: 'exceeded',
            },
            {
              id: 'comparison-3',
              metric: 'WUE',
              target: '0.5',
              current: '0.45',
              status: 'exceeded',
            },
          ],
        };

        // Load dữ liệu kiến trúc
        const architectureData = {
          zones: [
            { id: 'zone-1', name: 'Data Hall A', capacity: '500 racks', status: 'operational' },
            { id: 'zone-2', name: 'Data Hall B', capacity: '500 racks', status: 'operational' },
            { id: 'zone-3', name: 'Support Areas', capacity: '100 racks', status: 'operational' },
          ],
          standards: [
            {
              id: 'standard-1',
              name: 'Hot/Cold Aisle',
              implementation: '100%',
              efficiency: 'high',
            },
            { id: 'standard-2', name: 'Containment', implementation: '100%', efficiency: 'high' },
            { id: 'standard-3', name: 'Redundancy', implementation: 'N+1', efficiency: 'high' },
          ],
          design: [
            {
              id: 'design-1',
              name: 'Modular Design',
              features: ['Scalable', 'Flexible', 'Efficient'],
            },
            {
              id: 'design-2',
              name: 'Green Building',
              features: ['LEED Certified', 'Energy Efficient', 'Sustainable'],
            },
          ],
        };

        // Load dữ liệu hệ thống điện
        const powerData = {
          substations: [
            {
              id: 'substation-1',
              name: 'Main Substation',
              capacity: '20 MVA',
              status: 'operational',
            },
            {
              id: 'substation-2',
              name: 'Backup Substation',
              capacity: '20 MVA',
              status: 'standby',
            },
          ],
          ups: [
            {
              id: 'ups-1',
              name: 'UPS System A',
              capacity: '2 MW',
              runtime: '15 minutes',
              status: 'operational',
            },
            {
              id: 'ups-2',
              name: 'UPS System B',
              capacity: '2 MW',
              runtime: '15 minutes',
              status: 'operational',
            },
          ],
          distribution: [
            { id: 'dist-1', name: 'PDU A', capacity: '500 kW', racks: 50, status: 'operational' },
            { id: 'dist-2', name: 'PDU B', capacity: '500 kW', racks: 50, status: 'operational' },
          ],
        };

        // Load dữ liệu hệ thống làm mát
        const coolingData = {
          chillers: [
            { id: 'chiller-1', name: 'Chiller SMARDT', capacity: '632 kW', status: 'operational' },
            { id: 'chiller-2', name: 'Chiller Backup', capacity: '632 kW', status: 'standby' },
          ],
          pacs: [
            {
              id: 'pac-1',
              name: 'PAC UNIFLAIR',
              capacity: '50 kW',
              quantity: 20,
              status: 'operational',
            },
            {
              id: 'pac-2',
              name: 'PAC APC',
              capacity: '45 kW',
              quantity: 15,
              status: 'operational',
            },
          ],
          tes: [
            {
              id: 'tes-1',
              name: 'TES Tank',
              capacity: '360 tons',
              backupTime: '10 minutes',
              status: 'operational',
            },
          ],
        };

        // Load dữ liệu hệ thống PCCC
        const fireProtectionData = {
          gasSystems: [
            { id: 'gas-1', name: 'Novec 1230 System', coverage: '100%', status: 'operational' },
            { id: 'gas-2', name: 'Backup System', coverage: '100%', status: 'standby' },
          ],
          smokeDetection: [
            {
              id: 'smoke-1',
              name: 'Early Warning System',
              sensitivity: 'high',
              coverage: '100%',
              status: 'operational',
            },
          ],
          monitoring: [
            {
              id: 'monitor-1',
              name: 'Graphic Monitoring',
              features: ['Real-time', 'Alarm', 'Logging'],
              status: 'operational',
            },
          ],
        };

        // Load dữ liệu hệ thống an ninh
        const securityData = {
          cctv: [
            {
              id: 'cctv-1',
              name: 'CCTV System',
              cameras: 50,
              coverage: '100%',
              status: 'operational',
            },
          ],
          accessControl: [
            {
              id: 'acs-1',
              name: 'Access Control System',
              readers: 20,
              coverage: '100%',
              status: 'operational',
            },
          ],
          pa: [
            {
              id: 'pa-1',
              name: 'Public Address System',
              speakers: 30,
              coverage: '100%',
              status: 'operational',
            },
          ],
        };

        // Load dữ liệu hệ thống mạng
        const networkData = {
          fiber: [
            {
              id: 'fiber-1',
              name: 'Fiber Optic Network',
              capacity: '100 Gbps',
              redundancy: 'dual',
              status: 'operational',
            },
          ],
          copper: [
            {
              id: 'copper-1',
              name: 'Copper Network',
              capacity: '10 Gbps',
              redundancy: 'dual',
              status: 'operational',
            },
          ],
          activeActive: [
            {
              id: 'active-1',
              name: 'Active-Active Design',
              availability: '99.99%',
              loadBalancing: 'enabled',
              status: 'operational',
            },
          ],
        };

        // Load dữ liệu hệ thống rack
        const rackData = {
          servers: [
            {
              id: 'rack-1',
              name: 'Server Racks',
              quantity: 1000,
              utilization: '85%',
              status: 'operational',
            },
          ],
          capacity: [
            {
              id: 'capacity-1',
              name: 'Power Capacity',
              total: '10 MW',
              used: '8.5 MW',
              available: '1.5 MW',
            },
            {
              id: 'capacity-2',
              name: 'Cooling Capacity',
              total: '12 MW',
              used: '10 MW',
              available: '2 MW',
            },
          ],
          containment: [
            {
              id: 'containment-1',
              name: 'Hot Aisle Containment',
              coverage: '100%',
              efficiency: 'high',
              status: 'operational',
            },
          ],
        };

        // Load dữ liệu hiệu quả và rủi ro
        const riskData = {
          effectiveness: [
            { id: 'eff-1', name: 'Energy Efficiency', score: 95, target: 90, status: 'exceeded' },
            {
              id: 'eff-2',
              name: 'Operational Efficiency',
              score: 92,
              target: 85,
              status: 'exceeded',
            },
            { id: 'eff-3', name: 'Cost Efficiency', score: 88, target: 80, status: 'exceeded' },
          ],
          risks: [
            {
              id: 'risk-1',
              name: 'Power Outage',
              probability: 'low',
              impact: 'high',
              mitigation: 'UPS + Generator',
            },
            {
              id: 'risk-2',
              name: 'Cooling Failure',
              probability: 'low',
              impact: 'high',
              mitigation: 'Redundant Systems',
            },
            {
              id: 'risk-3',
              name: 'Network Downtime',
              probability: 'very low',
              impact: 'medium',
              mitigation: 'Active-Active',
            },
          ],
          solutions: [
            { id: 'solution-1', name: 'Redundancy', implementation: 'N+1', effectiveness: 'high' },
            { id: 'solution-2', name: 'Monitoring', implementation: '24/7', effectiveness: 'high' },
            {
              id: 'solution-3',
              name: 'Maintenance',
              implementation: 'Preventive',
              effectiveness: 'high',
            },
          ],
        };

        // Cập nhật state với tất cả dữ liệu
        setSystemData({
          overview: overviewData,
          architecture: architectureData,
          power: powerData,
          cooling: coolingData,
          fireProtection: fireProtectionData,
          security: securityData,
          network: networkData,
          rack: rackData,
          risk: riskData,
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
  const getSystemById = useCallback(
    systemId => {
      const allSystems = [
        ...systemData.overview.milestones,
        ...systemData.architecture.zones,
        ...systemData.power.substations,
        ...systemData.cooling.chillers,
        ...systemData.fireProtection.gasSystems,
        ...systemData.security.cctv,
        ...systemData.network.fiber,
        ...systemData.rack.servers,
        ...systemData.risk.effectiveness,
      ];
      return allSystems.find(system => system.id === systemId);
    },
    [systemData]
  );

  const getSystemsByType = useCallback(
    type => {
      return systemData[type] || [];
    },
    [systemData]
  );

  const getActiveSystem = useCallback(() => {
    return systemData.overview.milestones.find(milestone => milestone.status === 'active');
  }, [systemData.overview.milestones]);

  const getRiskLevel = useCallback(() => {
    const highRisks = systemData.risk.risks.filter(
      risk => risk.probability === 'high' || risk.impact === 'high'
    );
    if (highRisks.length > 2) return 'high';
    if (highRisks.length > 0) return 'medium';
    return 'low';
  }, [systemData.risk.risks]);

  const getEffectivenessScore = useCallback(() => {
    const scores = systemData.risk.effectiveness.map(eff => eff.score);
    return scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
  }, [systemData.risk.effectiveness]);

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
      getSystemById,
      getSystemsByType,
      getActiveSystem,
      getRiskLevel,
      getEffectivenessScore,
    }),
    [
      systemData,
      isLoading,
      isFullyLoaded,
      error,
      loadingProgress,
      loadedSections,
      currentLoadingSection,
      getSystemById,
      getSystemsByType,
      getActiveSystem,
      getRiskLevel,
      getEffectivenessScore,
    ]
  );

  return <VanCanhDataContext.Provider value={value}>{children}</VanCanhDataContext.Provider>;
};
