import React, { useEffect, useRef, useState } from "react";
import ArchitectureSection from "../vancanh-overview/sections/ArchitectureSection";
import CoolingSystemSection from "../vancanh-overview/sections/CoolingSystemSection";
import EffectivenessRiskSection from "../vancanh-overview/sections/EffectivenessRiskSection";
import FireProtectionSection from "../vancanh-overview/sections/FireProtectionSection";
import NetworkSystemSection from "../vancanh-overview/sections/NetworkSystemSection";
import PowerSystemSection from "../vancanh-overview/sections/PowerSystemSection";
import ProjectOverviewSection from "../vancanh-overview/sections/ProjectOverviewSection";
import RackSystemSection from "../vancanh-overview/sections/RackSystemSection";
import SecuritySystemSection from "../vancanh-overview/sections/SecuritySystemSection";

/**
 * DCIM Static Documentation – Vân Canh DC with Scroll + Scrollspy + Smooth Scroll
 */

const SECTIONS = [
  { key: "overview", label: "Tổng quan dự án", Component: ProjectOverviewSection, sectionId: "section-1", submenu: [
    { key: "overview-1", label: "Khái quát dự án", sectionId: "section-1.1" },
    { key: "overview-2", label: "Các mốc quan trọng", sectionId: "section-1.2" },
    { key: "overview-3", label: "So sánh với tiêu chuẩn Uptime", sectionId: "section-1.3" }
  ]},
  { key: "architecture", label: "Kiến trúc hệ thống", Component: ArchitectureSection, sectionId: "section-2", submenu: [
    { key: "arch-1", label: "Kiến trúc phân vùng", sectionId: "section-2.1" },
    { key: "arch-2", label: "Tiêu chuẩn thiết kế", sectionId: "section-2.2" }
  ]},
  { key: "power", label: "Hệ thống điện", Component: PowerSystemSection, sectionId: "section-3", submenu: [
    { key: "power-1", label: "Nguồn điện và trạm biến áp", sectionId: "section-3.1" },
    { key: "power-2", label: "Hệ thống UPS", sectionId: "section-3.2" }
  ]},
  { key: "cooling", label: "Hệ thống làm mát", Component: CoolingSystemSection, sectionId: "section-4", submenu: [
    { key: "cooling-1", label: "Hệ thống Chiller", sectionId: "section-4.1" },
    { key: "cooling-2", label: "Hệ thống điều hòa chính xác", sectionId: "section-4.2" },
    { key: "cooling-3", label: "Hệ thống trữ nhiệt TES", sectionId: "section-4.3" }
  ]},
  { key: "fire", label: "Hệ thống PCCC", Component: FireProtectionSection, sectionId: "section-5", submenu: [
    { key: "fire-1", label: "Hệ thống PCCC tự động bằng khí Novec 1230", sectionId: "section-5.1" },
    { key: "fire-2", label: "Hệ thống báo khói sớm", sectionId: "section-5.2" },
    { key: "fire-3", label: "Hệ thống giám sát đồ họa", sectionId: "section-5.3" }
  ]},
  { key: "security", label: "Hệ thống an ninh", Component: SecuritySystemSection, sectionId: "section-6", submenu: [
    { key: "security-1", label: "Hệ thống CCTV", sectionId: "section-6.1" },
    { key: "security-2", label: "Hệ thống kiểm soát vào ra ACS", sectionId: "section-6.2" },
    { key: "security-3", label: "Hệ thống thông báo PA", sectionId: "section-6.3" }
  ]},
  { key: "network", label: "Hệ thống mạng", Component: NetworkSystemSection, sectionId: "section-7", submenu: [
    { key: "network-1", label: "Cáp quang và cáp đồng", sectionId: "section-7.1" },
    { key: "network-2", label: "Tốc độ truyền dẫn", sectionId: "section-7.2" },
    { key: "network-3", label: "Thiết kế Active-Active", sectionId: "section-7.3" }
  ]},
  { key: "rack", label: "Hệ thống rack", Component: RackSystemSection, sectionId: "section-8", submenu: [
    { key: "rack-1", label: "Quy mô rack server", sectionId: "section-8.1" },
    { key: "rack-2", label: "Công suất và mật độ", sectionId: "section-8.2" },
    { key: "rack-3", label: "Buồng nhốt khí nóng", sectionId: "section-8.3" }
  ]},
  { key: "risk", label: "Hiệu quả & Rủi ro", Component: EffectivenessRiskSection, sectionId: "section-9", submenu: [
    { key: "risk-1", label: "Hiệu quả dự án", sectionId: "section-9.1" },
    { key: "risk-2", label: "Các rủi ro tiềm ẩn", sectionId: "section-9.2" },
    { key: "risk-3", label: "Giải pháp khắc phục", sectionId: "section-9.3" }
  ]}
];

function Sidebar({ active, activeSubmenu, setActiveSubmenu, expandedSections, setExpandedSections, mobileMenuOpen, setMobileMenuOpen }) {
  const handleClick = (e, id, submenuKey = null, sectionKey = null) => {
    e.preventDefault();
    
    // Nếu click submenu, cần mở parent section trước
    if (submenuKey) {
      setActiveSubmenu(submenuKey);
      // Tìm parent section và mở nó
      const parentSection = SECTIONS.find(s => s.submenu?.some(sub => sub.key === submenuKey));
      if (parentSection) {
        const newExpanded = new Set();
        newExpanded.add(parentSection.key);
        setExpandedSections(newExpanded);
      }
    }
    
    // Nếu click main menu, mở section đó
    if (sectionKey && !submenuKey) {
      const newExpanded = new Set();
      newExpanded.add(sectionKey);
      setExpandedSections(newExpanded);
    }
    
         // Scroll đến element với retry logic
     const scrollToElement = (retryCount = 0) => {
       // Sử dụng getElementById thay vì querySelector để tránh vấn đề CSS selector
       const el = document.getElementById(id);
      
       if (el) {
         el.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
         setTimeout(() => window.scrollBy(0, -80), 100);
       } else if (retryCount < 3) {
         // Retry sau 100ms nếu element chưa sẵn sàng
         setTimeout(() => scrollToElement(retryCount + 1), 100);
       }
     };
    
    // Đợi một chút để DOM update, sau đó scroll
    setTimeout(() => scrollToElement(), 50);
    
    // Đóng mobile menu sau khi click
    setMobileMenuOpen(false);
  };

  return (
    <nav className={`sticky top-20 w-full max-w-sm space-y-1 z-10 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-slate-200 mx-auto lg:mx-0 ${
      mobileMenuOpen ? 'block' : 'hidden lg:block'
    }`}>
      {SECTIONS.map((s) => {
         const targetId = `#${s.sectionId}`;
         const isExpanded = expandedSections.has(s.key);
        return (
           <div key={s.key} className="space-y-1">
          <a
            href={targetId}
               onClick={(e) => handleClick(e, s.sectionId, null, s.key)}
              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition cursor-pointer ${
              active === s.key ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-200"
            }`}
          >
            {s.label}
          </a>
            {s.submenu && isExpanded && (
              <div className="ml-4 space-y-1">
                                 {s.submenu.map((sub) => {
                   const subTargetId = `#${sub.sectionId}`;
                   return (
                     <a
                       key={sub.key}
                       href={subTargetId}
                       onClick={(e) => handleClick(e, sub.sectionId, sub.key, s.key)}
                      className={`block w-full text-left px-3 py-1.5 rounded text-xs transition ${
                        activeSubmenu === sub.key
                          ? "bg-blue-100 text-blue-700 font-medium"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {sub.label}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export default function UPSPage() {
  const [active, setActive] = useState("overview");
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [expandedSections, setExpandedSections] = useState(new Set());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const observer = useRef(null);
  const debounceTimer = useRef(null);

  useEffect(() => {
    const options = { root: null, rootMargin: "-80px 0px -50% 0px", threshold: [0.1, 0.3, 0.5, 0.7, 0.9] };
    const obs = new IntersectionObserver((entries) => {
      const intersectingEntries = entries.filter(e => e.isIntersecting).map(entry => {
        const rect = entry.boundingClientRect;
        const vh = window.innerHeight;
        const center = vh / 2;
        const distance = Math.abs(rect.top + rect.height / 2 - center);
        const intersectionScore = entry.intersectionRatio;
        const centerScore = 1 - distance / vh;
        const positionScore = rect.top < center ? 1 : 0.5;
        const totalScore = intersectionScore * 0.4 + centerScore * 0.4 + positionScore * 0.2;
        return { entry, score: totalScore, id: entry.target.getAttribute("id") };
      }).sort((a, b) => b.score - a.score);

      if (intersectingEntries.length > 0) {
        const bestEntry = intersectingEntries[0];
        const id = bestEntry.id;
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
          const sec = SECTIONS.find(s => s.sectionId === id);
          if (sec) {
            setActive(sec.key);
            setActiveSubmenu(null);
            return;
          }
          for (const section of SECTIONS) {
            if (section.submenu) {
              const sub = section.submenu.find(s => s.sectionId === id);
              if (sub) {
                setActive(section.key);
                setActiveSubmenu(sub.key);
                const newExpanded = new Set();
                newExpanded.add(section.key);
                setExpandedSections(newExpanded);
                return;
              }
            }
          }
        }, 50);
      }
    }, options);

    const allIds = SECTIONS.flatMap(s => [s.sectionId, ...(s.submenu?.map(sub => sub.sectionId) || [])]);
    allIds.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    observer.current = obs;

    return () => { if (observer.current) observer.current.disconnect(); if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, [expandedSections]);

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-8xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-9 w-9 rounded-xl bg-slate-900 text-white grid place-items-center font-bold">DC</div>
          <div>
              <h1 className="text-lg font-bold text-slate-900">Tài liệu Trung tâm Dữ liệu Vân Canh</h1>
              <p className="text-xs text-slate-500">Tổng quan • Kiến trúc • Điện • Làm mát • An ninh • Mạng • Rack • PCCC • Rủi ro</p>
            </div>
          </div>
          
          {/* Mobile menu button */}
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

      <div className="max-w-8xl mx-auto px-6 py-8">
        {/* Mobile menu overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-20 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
            <div className="absolute top-0 left-0 w-80 h-full bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-900">Menu</h2>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-slate-100"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <Sidebar
                  active={active}
                  activeSubmenu={activeSubmenu}
                  setActiveSubmenu={setActiveSubmenu}
                  expandedSections={expandedSections}
                  setExpandedSections={setExpandedSections}
                  mobileMenuOpen={mobileMenuOpen}
                  setMobileMenuOpen={setMobileMenuOpen}
                />
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="hidden lg:block lg:col-span-2">
            <Sidebar
              active={active}
              activeSubmenu={activeSubmenu}
              setActiveSubmenu={setActiveSubmenu}
              expandedSections={expandedSections}
              setExpandedSections={setExpandedSections}
              mobileMenuOpen={mobileMenuOpen}
              setMobileMenuOpen={setMobileMenuOpen}
            />
        </aside>
          <main className="lg:col-span-10 space-y-8">
          {SECTIONS.map(section => {
            const SectionComponent = section.Component;
            return <SectionComponent key={section.key} />;
          })}
        </main>
        </div>
      </div>

      <footer className="px-6 py-8 border-t border-slate-200 text-center text-xs text-slate-500">
        © 2025 – DCIM Vân Canh Documentation
      </footer>
    </div>
  );
}
