import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import ModernErrorScreen from "../../components/common/ModernErrorScreen";
import ModernLoadingScreen from "../../components/common/ModernLoadingScreen";
import SystemMenu from "../../components/common/SystemMenu";
import { useSidebar } from "../../contexts/SidebarContext";
import { useLayoutPositions } from "../shared/utils";
import LazySection from "./components/LazySection";
import { ElectricDataProvider, useElectricData } from "./context";
import CableSection from "./sections/CableSection";
import ControlSection from "./sections/ControlSection";
import DocumentationSection from "./sections/DocumentationSection";
import IntroductionSection from "./sections/IntroductionSection";
import LightingSection from "./sections/LightingSection";
import LowVoltageSection from "./sections/LowVoltageSection";
import OperationSection from "./sections/OperationSection";
import ProtectionSection from "./sections/ProtectionSection";

/**
 * Hệ thống phân phối điện Vân Canh - Static Documentation
 */

const SECTIONS = [
  {
    key: "introduction",
    label: "Giới thiệu chung",
    Component: IntroductionSection,
    sectionId: "section-1",
    submenu: [
      { key: "intro-1", label: "Sơ đồ đơn tuyến hệ thống điện", sectionId: "section-1-1" },
      { key: "intro-2", label: "Cấu trúc tổng quan hệ thống", sectionId: "section-1-2" },
      { key: "intro-3", label: "Thông số kỹ thuật chung", sectionId: "section-1-3" },
      { key: "intro-4", label: "Tiêu chuẩn và quy định", sectionId: "section-1-4" }
    ]
  },
  {
    key: "lowVoltage",
    label: "Tủ điện hạ thế",
    Component: LowVoltageSection,
    sectionId: "section-2",
    submenu: [
      { key: "low-1", label: "Tủ điện ACIT", sectionId: "section-2-1" },
      { key: "low-2", label: "Tủ Blokset", sectionId: "section-2-2" },
      { key: "low-3", label: "Máy cắt ACB MTZ2 Schneider", sectionId: "section-2-3" },
      { key: "low-4", label: "MCCB Schneider", sectionId: "section-2-4" },
      { key: "low-5", label: "MCB Schneider", sectionId: "section-2-5" },
      { key: "low-6", label: "RCBO & RCCB ABB", sectionId: "section-2-6" }
    ]
  },
  {
    key: "protection",
    label: "Hệ thống bảo vệ",
    Component: ProtectionSection,
    sectionId: "section-3",
    submenu: [
      { key: "prot-1", label: "Bảo vệ quá dòng", sectionId: "section-3-1" },
      { key: "prot-2", label: "Bảo vệ chạm đất", sectionId: "section-3-2" },
      { key: "prot-3", label: "Bảo vệ ngắn mạch", sectionId: "section-3-3" }
    ]
  },
  {
    key: "control",
    label: "Hệ thống điều khiển",
    Component: ControlSection,
    sectionId: "section-4",
    submenu: [
      { key: "ctrl-1", label: "PLC điều khiển", sectionId: "section-4-1" },
      { key: "ctrl-2", label: "Hệ thống ATS", sectionId: "section-4-2" },
      { key: "ctrl-3", label: "Điều khiển máy phát", sectionId: "section-4-3" }
    ]
  },
  {
    key: "lighting",
    label: "Hệ thống chiếu sáng",
    Component: LightingSection,
    sectionId: "section-5",
    submenu: [
      { key: "light-1", label: "Chiếu sáng chung", sectionId: "section-5-1" },
      { key: "light-2", label: "Chiếu sáng khẩn cấp", sectionId: "section-5-2" },
      { key: "light-3", label: "Hệ thống ổ cắm", sectionId: "section-5-3" }
    ]
  },
  {
    key: "cable",
    label: "Hệ thống cáp và máng",
    Component: CableSection,
    sectionId: "section-6",
    submenu: [
      { key: "cable-1", label: "Thang máng cáp", sectionId: "section-6-1" },
      { key: "cable-2", label: "Cáp điện lực", sectionId: "section-6-2" },
      { key: "cable-3", label: "Cáp điều khiển", sectionId: "section-6-3" }
    ]
  },
  {
    key: "operation",
    label: "Vận hành và bảo trì",
    Component: OperationSection,
    sectionId: "section-7",
    submenu: [
      { key: "op-1", label: "Quy trình vận hành", sectionId: "section-7-1" },
      { key: "op-2", label: "Kiểm tra hệ thống dự phòng", sectionId: "section-7-2" },
      { key: "op-3", label: "Bảo trì định kỳ", sectionId: "section-7-3" }
    ]
  },
  {
    key: "documentation",
    label: "Tài liệu và tiêu chuẩn",
    Component: DocumentationSection,
    sectionId: "section-8",
    submenu: [
      { key: "doc-1", label: "Tiêu chuẩn Việt Nam", sectionId: "section-8-1" },
      { key: "doc-2", label: "Tiêu chuẩn quốc tế", sectionId: "section-8-2" },
      { key: "doc-3", label: "Chứng nhận sản phẩm", sectionId: "section-8-3" }
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

function ElectricSystemContent() {
  const { isLoading, isFullyLoaded, error } = useElectricData();
  const { collapsed } = useSidebar();
  const [active, setActive] = useState("introduction");
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [expandedSections, setExpandedSections] = useState(new Set(["introduction"]));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ignoreSpy, setIgnoreSpy] = useState(false);

  // Sử dụng layout positions utility
  const { headerStyle, menuStyle, contentStyle } = useLayoutPositions(collapsed);

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
        title="Đang tải hệ thống phân phối điện"
        subtitle="Khởi tạo dữ liệu tủ điện, bảo vệ, điều khiển và chiếu sáng..."
        icon="⚡"
        color="#f5222d"
      />
    );
  }

  if (error) {
    return (
      <ModernErrorScreen 
        title="Lỗi tải hệ thống phân phối điện"
        subtitle="Không thể khởi tạo dữ liệu hệ thống"
        error={error}
        icon="⚡"
        color="#f5222d"
        onRetry={() => window.location.reload()}
      />
    );
  }

  // Layout positions đã được tính toán trong useLayoutPositions hook

  return (
    <>
      {/* 1. Header - Independent */}
      <header 
        className="fixed top-20 z-5 bg-white border-b border-slate-200 transition-all duration-200"
        style={{ ...headerStyle, right: 0 }}
      >
        <div className="max-w-8xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-9 w-9 rounded-xl bg-blue-600 text-white grid place-items-center font-bold">⚡</div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">Hệ thống phân phối điện Vân Canh</h1>
              <p className="text-xs text-slate-500">Giới thiệu • Tủ điện • Bảo vệ • Điều khiển • Chiếu sáng • Cáp • Vận hành • Tài liệu</p>
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
        style={menuStyle}
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
        style={contentStyle}
      >
        <div className="h-full overflow-y-auto p-8">
          <div className="max-w-8xl mx-auto space-y-8">
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

export default function ElectricSystemPage() {
  return (
    <ElectricDataProvider>
      <ElectricSystemContent />
    </ElectricDataProvider>
  );
}
