import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import ModernErrorScreen from "../../components/common/ModernErrorScreen";
import ModernLoadingScreen from "../../components/common/ModernLoadingScreen";
import SystemMenu from "../../components/common/SystemMenu";
import { useSidebar } from "../../contexts/SidebarContext";
import LazySection from "./components/LazySection";
import { VanCanhDataProvider, useVanCanhData } from "./context";
import ArchitectureSection from "./sections/ArchitectureSection";
import CoolingSystemSection from "./sections/CoolingSystemSection";
import EffectivenessRiskSection from "./sections/EffectivenessRiskSection";
import FireProtectionSection from "./sections/FireProtectionSection";
import NetworkSystemSection from "./sections/NetworkSystemSection";
import PowerSystemSection from "./sections/PowerSystemSection";
import ProjectOverviewSection from "./sections/ProjectOverviewSection";
import RackSystemSection from "./sections/RackSystemSection";
import SecuritySystemSection from "./sections/SecuritySystemSection";

/**
 * Tổng quan TTDL Vân Canh - Static Documentation
 */

const SECTIONS = [
  {
    key: "overview",
    label: "Tổng quan dự án",
    Component: ProjectOverviewSection,
    sectionId: "section-1",
    submenu: [
      { key: "overview-1", label: "Khái quát dự án", sectionId: "section-1-1" },
      { key: "overview-2", label: "Các mốc quan trọng", sectionId: "section-1-2" },
      { key: "overview-3", label: "So sánh với tiêu chuẩn Uptime", sectionId: "section-1-3" }
    ]
  },
  {
    key: "architecture",
    label: "Kiến trúc hệ thống",
    Component: ArchitectureSection,
    sectionId: "section-2",
    submenu: [
      { key: "arch-1", label: "Kiến trúc phân vùng", sectionId: "section-2-1" },
      { key: "arch-2", label: "Tiêu chuẩn thiết kế", sectionId: "section-2-2" }
    ]
  },
  {
    key: "power",
    label: "Hệ thống điện",
    Component: PowerSystemSection,
    sectionId: "section-3",
    submenu: [
      { key: "power-1", label: "Nguồn điện và trạm biến áp", sectionId: "section-3-1" },
      { key: "power-2", label: "Hệ thống UPS", sectionId: "section-3-2" }
    ]
  },
  {
    key: "cooling",
    label: "Hệ thống làm mát",
    Component: CoolingSystemSection,
    sectionId: "section-4",
    submenu: [
      { key: "cooling-1", label: "Hệ thống Chiller", sectionId: "section-4-1" },
      { key: "cooling-2", label: "Hệ thống điều hòa chính xác", sectionId: "section-4-2" },
      { key: "cooling-3", label: "Hệ thống trữ nhiệt TES", sectionId: "section-4-3" }
    ]
  },
  {
    key: "fire",
    label: "Hệ thống PCCC",
    Component: FireProtectionSection,
    sectionId: "section-5",
    submenu: [
      { key: "fire-1", label: "Hệ thống PCCC tự động bằng khí Novec 1230", sectionId: "section-5-1" },
      { key: "fire-2", label: "Hệ thống báo khói sớm", sectionId: "section-5-2" },
      { key: "fire-3", label: "Hệ thống giám sát đồ họa", sectionId: "section-5-3" }
    ]
  },
  {
    key: "security",
    label: "Hệ thống an ninh",
    Component: SecuritySystemSection,
    sectionId: "section-6",
    submenu: [
      { key: "security-1", label: "Hệ thống CCTV", sectionId: "section-6-1" },
      { key: "security-2", label: "Hệ thống kiểm soát vào ra ACS", sectionId: "section-6-2" },
      { key: "security-3", label: "Hệ thống thông báo PA", sectionId: "section-6-3" }
    ]
  },
  {
    key: "network",
    label: "Hệ thống mạng",
    Component: NetworkSystemSection,
    sectionId: "section-7",
    submenu: [
      { key: "network-1", label: "Cáp quang và cáp đồng", sectionId: "section-7-1" },
      { key: "network-2", label: "Tốc độ truyền dẫn", sectionId: "section-7-2" },
      { key: "network-3", label: "Thiết kế Active-Active", sectionId: "section-7-3" }
    ]
  },
  {
    key: "rack",
    label: "Hệ thống rack",
    Component: RackSystemSection,
    sectionId: "section-8",
    submenu: [
      { key: "rack-1", label: "Quy mô rack server", sectionId: "section-8-1" },
      { key: "rack-2", label: "Công suất và mật độ", sectionId: "section-8-2" },
      { key: "rack-3", label: "Buồng nhốt khí nóng", sectionId: "section-8-3" }
    ]
  },
  {
    key: "risk",
    label: "Hiệu quả & Rủi ro",
    Component: EffectivenessRiskSection,
    sectionId: "section-9",
    submenu: [
      { key: "risk-1", label: "Hiệu quả dự án", sectionId: "section-9-1" },
      { key: "risk-2", label: "Các rủi ro tiềm ẩn", sectionId: "section-9-2" },
      { key: "risk-3", label: "Giải pháp khắc phục", sectionId: "section-9-3" }
    ]
  }
];

const Sidebar = memo(({ active, activeSubmenu, setActive, setActiveSubmenu, expandedSections, setExpandedSections, mobileMenuOpen, setMobileMenuOpen, setIgnoreSpy }) => {
  return (
    <SystemMenu
      sections={SECTIONS}
      active={active}
      activeSubmenu={activeSubmenu}
      setActive={setActive}
      setActiveSubmenu={setActiveSubmenu}
      expandedSections={expandedSections}
      setExpandedSections={setExpandedSections}
      mobileMenuOpen={mobileMenuOpen}
      setMobileMenuOpen={setMobileMenuOpen}
      setIgnoreSpy={setIgnoreSpy}
    />
  );
});

Sidebar.displayName = 'Sidebar';

function VanCanhOverviewContent() {
  const { isLoading, isFullyLoaded, error } = useVanCanhData();
  const { collapsed } = useSidebar();
  const [active, setActive] = useState("overview");
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [expandedSections, setExpandedSections] = useState(new Set(["overview"]));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ignoreSpy, setIgnoreSpy] = useState(false);

  const observer = useRef(null);

  // Function để setup observer - có thể gọi lại khi cần
  const setupObserver = useCallback(() => {
    // Disconnect observer cũ nếu có
    if (observer.current) {
      observer.current.disconnect();
    }

    const options = { root: null, rootMargin: "-80px 0px -50% 0px", threshold: [0, 0.1, 0.3, 0.5, 0.7, 1] };
    const obs = new IntersectionObserver((entries) => {
      const visibleEntries = entries.filter(e => e.isIntersecting);
      if (visibleEntries.length === 0) {
        return;
      }

      // Đơn giản hóa: chọn element có intersection ratio cao nhất
      const bestEntry = visibleEntries.reduce((best, current) =>
        current.intersectionRatio > best.intersectionRatio ? current : best
      );

      const id = bestEntry.target.getAttribute("id");
      if (!id) {
        return;
      }

      const sec = SECTIONS.find(s => s.sectionId === id);
      if (sec) {
        setActive(sec.key);
        setActiveSubmenu(null);
        setExpandedSections(new Set([sec.key]));
        return;
      }

      for (const section of SECTIONS) {
        if (section.submenu) {
          const sub = section.submenu.find(s => s.sectionId === id);
          if (sub) {
            setActive(section.key);
            setActiveSubmenu(sub.key);
            setExpandedSections(new Set([section.key]));
            return;
          }
        }
      }

    }, options);

    const allIds = SECTIONS.flatMap(s => [s.sectionId, ...(s.submenu?.map(sub => sub.sectionId) || [])]);
    
    allIds.forEach(id => { 
      const el = document.getElementById(id); 
      if (el) {
        obs.observe(el); 
      }
    });
      
    observer.current = obs;
  }, []);

  useEffect(() => {
    if (ignoreSpy) {
      return;
    }

    // Setup observer ngay lập tức
    setupObserver();

    return () => { 
      if (observer.current) observer.current.disconnect(); 
    };
  }, [ignoreSpy, setupObserver]);

  // Re-setup observer khi isFullyLoaded thay đổi (có section mới được render)
  useEffect(() => {
    if (isFullyLoaded && !ignoreSpy) {
      // Delay nhỏ để đảm bảo DOM đã update
      const timeoutId = setTimeout(() => {
        setupObserver();
      }, 200);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isFullyLoaded, ignoreSpy, setupObserver]);

  // MutationObserver để theo dõi khi có section mới được lazy load
  useEffect(() => {
    if (!isFullyLoaded || ignoreSpy) return;

    const mutationObserver = new MutationObserver((mutations) => {
      let shouldReSetup = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node;
              // Kiểm tra nếu có element mới với ID section
              if (element.id && element.id.startsWith('section-')) {
                shouldReSetup = true;
              }
              // Kiểm tra trong children
              const sectionElements = element.querySelectorAll && element.querySelectorAll('[id^="section-"]');
              if (sectionElements && sectionElements.length > 0) {
                shouldReSetup = true;
              }
            }
          });
        }
      });

      if (shouldReSetup) {
        setTimeout(() => {
          setupObserver();
        }, 100);
      }
    });

    // Theo dõi thay đổi trong content area
    const contentArea = document.querySelector('main');
    if (contentArea) {
      mutationObserver.observe(contentArea, {
        childList: true,
        subtree: true
      });
    }

    return () => {
      mutationObserver.disconnect();
    };
  }, [isFullyLoaded, ignoreSpy, setupObserver]);

  // Kích hoạt scrollspy ngay khi trang load xong
  useEffect(() => {
    const checkInitialSection = () => {
      // Nếu đang ở đầu trang (scrollY = 0), luôn chọn section đầu tiên
      if (window.scrollY === 0) {
        setActive("overview");
        setExpandedSections(new Set(["overview"]));
        setActiveSubmenu(null);
        return;
      }

      const fromTop = window.scrollY + 120; // offset ~header
      let found = null;
      
      for (const section of SECTIONS) {
        const el = document.getElementById(section.sectionId);
        if (el && el.offsetTop <= fromTop) {
          found = section.key;
        }
        // check submenu
        if (section.submenu) {
          for (const sub of section.submenu) {
            const subEl = document.getElementById(sub.sectionId);
            if (subEl && subEl.offsetTop <= fromTop) {
              found = sub.key;
            }
          }
        }
      }
      
      if (found) {
        if (found.includes("-")) {
          // submenu key
          const parent = SECTIONS.find(s => s.submenu?.some(sub => sub.key === found));
          if (parent) {
            setActive(parent.key);
            setActiveSubmenu(found);
            setExpandedSections(new Set([parent.key]));
          }
        } else {
          setActive(found);
          setExpandedSections(new Set([found]));
          setActiveSubmenu(null);
        }
      } else {
        // Fallback: nếu không tìm thấy gì, chọn section đầu tiên
        setActive("overview");
        setExpandedSections(new Set(["overview"]));
        setActiveSubmenu(null);
      }
    };

    // Chờ DOM render xong bằng MutationObserver thay vì timeout
    let timeoutId = null;
    let hasInitialized = false;

    const initializeScrollspy = () => {
      if (hasInitialized) return;
      
      // Kiểm tra xem có ít nhất 1 section đã render chưa
      const firstSection = document.getElementById("section-1");
      if (firstSection) {
        hasInitialized = true;
        checkInitialSection();
        return;
      }

      // Nếu chưa có section nào, chờ thêm
      timeoutId = setTimeout(initializeScrollspy, 100);
    };

    // Bắt đầu kiểm tra ngay lập tức
    requestAnimationFrame(initializeScrollspy);

    // Fallback timeout để đảm bảo không chờ vô hạn
    const fallbackTimeout = setTimeout(() => {
      if (!hasInitialized) {
        hasInitialized = true;
        checkInitialSection();
      }
    }, 2000);

    window.addEventListener("resize", checkInitialSection);
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      clearTimeout(fallbackTimeout);
      window.removeEventListener("resize", checkInitialSection);
    };
  }, [isFullyLoaded]);

  if (isLoading || !isFullyLoaded) {
    return (
      <ModernLoadingScreen 
        title="Đang tải tổng quan TTDL Vân Canh"
        subtitle="Khởi tạo dữ liệu kiến trúc, điện, làm mát, an ninh..."
        icon="🏢"
        color="#722ed1"
      />
    );
  }

  if (error) {
    return (
      <ModernErrorScreen 
        title="Lỗi tải tổng quan TTDL Vân Canh"
        subtitle="Không thể khởi tạo dữ liệu hệ thống"
        error={error}
        icon="🏢"
        color="#722ed1"
        onRetry={() => window.location.reload()}
      />
    );
  }

  // Tính toán vị trí dựa trên trạng thái sidebar
  const sidebarLeft = collapsed ? 70 : 200;
  const headerLeft = sidebarLeft;
  const menuLeft = sidebarLeft;
  const contentLeft = sidebarLeft + 320; // 320px là width của menu

  return (
    <>
      {/* 1. Header - Independent */}
      <header 
        className="fixed top-20 z-5 bg-white border-b border-slate-200 transition-all duration-200"
        style={{ left: `${headerLeft}px`, right: 0 }}
      >
        <div className="max-w-8xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-9 w-9 rounded-xl bg-blue-600 text-white grid place-items-center font-bold">VC</div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Giới thiệu chung về TTDL Vân Canh</h1>
              <p className="text-xs text-slate-500">Tổng quan • Kiến trúc • Điện • Làm mát • An ninh • Mạng • Rack • PCCC • Rủi ro</p>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* 2. Menu - Independent */}
      <aside 
        className="hidden lg:block fixed top-40 w-80 h-[calc(100vh-80px)] bg-white border-r border-slate-200 z-5 transition-all duration-200"
        style={{ left: `${menuLeft}px` }}
      >
        <div className="h-full overflow-y-auto p-6">
          <Sidebar
            active={active}
            activeSubmenu={activeSubmenu}
            setActive={setActive}
            setActiveSubmenu={setActiveSubmenu}
            expandedSections={expandedSections}
            setExpandedSections={setExpandedSections}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            setIgnoreSpy={setIgnoreSpy}
          />
        </div>
      </aside>

      {/* 3. Content - Independent */}
      <main 
        className="fixed top-40 right-0 h-[calc(100vh-80px)] bg-white border-l border-slate-200 z-5 transition-all duration-200"
        style={{ left: `${contentLeft}px` }}
      >
        <div className="h-full overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {SECTIONS.map(section => (
              <LazySection
                key={section.key}
                sectionKey={section.key}
                Component={section.Component}
                sectionId={section.sectionId}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

export default function VanCanhOverviewPage() {
  return (
    <VanCanhDataProvider>
      <VanCanhOverviewContent />
    </VanCanhDataProvider>
  );
}