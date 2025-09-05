import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import ModernErrorScreen from "../../components/common/ModernErrorScreen";
import ModernLoadingScreen from "../../components/common/ModernLoadingScreen";
import SystemMenu from "../../components/common/SystemMenu";
import { useSidebar } from "../../contexts/SidebarContext";
import LazySection from "./components/LazySection";
import { CoolingDataProvider, useCoolingData } from "./context";
import ContactSection from "./sections/ContactSection";
import ChillerSystemSection from "./sections/DeviceGuideSection";
import DocumentationSection from "./sections/DocumentationSection";
import IntroductionSection from "./sections/IntroductionSection";
import LocationSection from "./sections/LocationSection";
import OperationSection from "./sections/OperationSection";
import PumpSystemSection from "./sections/PumpSystemSection";
import SafetySection from "./sections/SafetySection";

/**
 * Hệ thống làm mát TTDL Vân Canh - Static Documentation
 */

const SECTIONS = [
  {
    key: "introduction",
    label: "Giới thiệu chung",
    Component: IntroductionSection,
    sectionId: "section-1",
    submenu: [
      { key: "intro-1", label: "Thông số kỹ thuật hệ thống", sectionId: "section-1-1" },
      { key: "intro-2", label: "Cấu trúc và nguyên lý hoạt động", sectionId: "section-1-2" },
      { key: "intro-3", label: "Các chế độ vận hành chính", sectionId: "section-1-3" },
      { key: "intro-4", label: "Hệ thống điều khiển BMS", sectionId: "section-1-4" },
      { key: "intro-5", label: "Tổng quan hệ thống", sectionId: "section-1-5" }
    ]
  },
  {
    key: "chiller",
    label: "Hệ thống Chiller & PAC",
    Component: ChillerSystemSection,
    sectionId: "section-2",
    submenu: [
      { key: "chiller-1", label: "SMARDT Chiller AE Series", sectionId: "section-2-1" },
      { key: "chiller-2", label: "UNIFLAIR SDCV Series", sectionId: "section-2-2" },
      { key: "chiller-3", label: "UNIFLAIR LDCV Series", sectionId: "section-2-3" },
      { key: "chiller-4", label: "Easy InRow CW ERC311", sectionId: "section-2-4" },
      { key: "chiller-5", label: "BMS Chiller Control", sectionId: "section-2-5" },
      { key: "chiller-6", label: "Pumping System Devices", sectionId: "section-2-6" }
    ]
  },
  {
    key: "pump",
    label: "Hệ thống bơm & thiết bị phụ trợ",
    Component: PumpSystemSection,
    sectionId: "section-3",
    submenu: [
      { key: "pump-1", label: "Hệ thống bơm nước lạnh", sectionId: "section-3-1" },
      { key: "pump-2", label: "Thiết bị phụ trợ hệ nước", sectionId: "section-3-2" },
      { key: "pump-3", label: "Hệ thống TES (Thermal Energy Storage)", sectionId: "section-3-3" }
    ]
  },
  {
    key: "location",
    label: "Vị trí & bố trí hệ thống",
    Component: LocationSection,
    sectionId: "section-4",
    submenu: [
      { key: "location-1", label: "Sơ đồ tổng thể hệ thống", sectionId: "section-4-1" },
      { key: "location-2", label: "Bố trí thiết bị theo tầng", sectionId: "section-4-2" },
      { key: "location-3", label: "Hệ thống đường ống và phân phối", sectionId: "section-4-3" },
      { key: "location-4", label: "Chi tiết bố trí thiết bị", sectionId: "section-4-4" }
    ]
  },
  {
    key: "operation",
    label: "Quy trình vận hành",
    Component: OperationSection,
    sectionId: "section-5",
    submenu: [
      { key: "operation-1", label: "Quy trình khởi động hệ thống", sectionId: "section-5-1" },
      { key: "operation-2", label: "Vận hành chế độ Normal", sectionId: "section-5-2" },
      { key: "operation-3", label: "Quy trình gọi thêm, cắt bớt cụm Chiller", sectionId: "section-5-3" },
      { key: "operation-4", label: "Xử lý sự cố và chế độ khẩn cấp", sectionId: "section-5-4" },
      { key: "operation-5", label: "Chế độ vận hành tự động", sectionId: "section-5-5" },
      { key: "operation-6", label: "Quy trình bảo trì định kỳ", sectionId: "section-5-6" },
      { key: "operation-7", label: "Giám sát và báo cáo", sectionId: "section-5-7" }
    ]
  },
  {
    key: "safety",
    label: "An toàn & bảo trì",
    Component: SafetySection,
    sectionId: "section-6",
    submenu: [
      { key: "safety-1", label: "Biện pháp an toàn vận hành", sectionId: "section-6-1" },
      { key: "safety-2", label: "Quy trình bảo trì thiết bị", sectionId: "section-6-2" },
      { key: "safety-3", label: "Xử lý mã lỗi và sự cố", sectionId: "section-6-3" },
      { key: "safety-4", label: "Kiểm tra định kỳ", sectionId: "section-6-4" },
      { key: "safety-5", label: "Bảo trì phòng ngừa", sectionId: "section-6-5" }
    ]
  },
  {
    key: "documentation",
    label: "Tài liệu & tham khảo",
    Component: DocumentationSection,
    sectionId: "section-7"
  },
  {
    key: "contact",
    label: "Liên hệ & hỗ trợ",
    Component: ContactSection,
    sectionId: "section-8",
    submenu: [
      { key: "contact-1", label: "Thông tin liên hệ", sectionId: "section-8-1" },
      { key: "contact-2", label: "Hỗ trợ kỹ thuật", sectionId: "section-8-2" },
      { key: "contact-3", label: "Báo cáo sự cố", sectionId: "section-8-3" }
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

function CoolingSystemContent() {
  const { isLoading, isFullyLoaded, error } = useCoolingData();
  const { collapsed } = useSidebar();
  const [active, setActive] = useState("introduction");
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [expandedSections, setExpandedSections] = useState(new Set(["introduction"]));
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

      // Special handling for section-2 (DeviceGuideSection) - Simplified
      if (id.startsWith('section-2')) {
        setActive('chiller');
        setExpandedSections(new Set(['chiller']));
        
        // If it's a subsection, set active submenu
        if (id.includes('-')) {
          const subIndex = id.split('-')[2]; // ví dụ "section-2-3" => "3"
          if (subIndex) {
            const submenuKey = `chiller-${subIndex}`;
            setActiveSubmenu(submenuKey);
          } else {
            setActiveSubmenu(null);
          }
        } else {
          setActiveSubmenu(null);
        }
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
        setActive("introduction");
        setExpandedSections(new Set(["introduction"]));
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
        setActive("introduction");
        setExpandedSections(new Set(["introduction"]));
        setActiveSubmenu(null);
      }
    };

    // Chờ DOM render xong bằng kiểm tra thực tế thay vì timeout
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
        title="Đang tải hệ thống làm mát Vân Canh"
        subtitle="Khởi tạo dữ liệu hệ thống Chiller, PAC và TES..."
        icon="❄️"
        color="#1890ff"
      />
    );
  }

  if (error) {
    return (
      <ModernErrorScreen 
        title="Lỗi tải hệ thống làm mát"
        subtitle="Không thể khởi tạo dữ liệu hệ thống"
        error={error}
        icon="❄️"
        color="#1890ff"
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
            <div className="h-9 w-9 rounded-xl bg-blue-600 text-white grid place-items-center font-bold">CS</div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Hệ thống làm mát TTDL Vân Canh</h1>
              <p className="text-xs text-slate-500">Chiller • PAC • Bơm • TES • Vận hành • An toàn • Tài liệu</p>
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

export default function CoolingSystemPage() {
  return (
    <CoolingDataProvider>
      <CoolingSystemContent />
    </CoolingDataProvider>
  );
}
