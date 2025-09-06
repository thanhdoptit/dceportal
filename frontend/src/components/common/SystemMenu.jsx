import React, { memo, useCallback } from 'react';

/**
 * SystemMenu Component - Menu chung cho tất cả hệ thống
 * Đảm bảo màu sắc và style đồng nhất
 */
const SystemMenu = memo(
  ({
    sections,
    active,
    activeSubmenu,
    setActive,
    setActiveSubmenu,
    expandedSections,
    setExpandedSections,
    mobileMenuOpen,
    setMobileMenuOpen,
    setIgnoreSpy,
  }) => {
    const handleClick = useCallback(
      (e, id, submenuKey = null, sectionKey = null) => {
        e.preventDefault();

        // tạm ignore scrollspy để không overwrite state
        setIgnoreSpy(true);
        setTimeout(() => setIgnoreSpy(false), 600);

        if (submenuKey) {
          setActiveSubmenu(submenuKey);
          const parentSection = sections.find(s => s.submenu?.some(sub => sub.key === submenuKey));
          if (parentSection) {
            setExpandedSections(new Set([parentSection.key]));
          }
        }

        if (sectionKey && !submenuKey) {
          setActive(sectionKey);
          setExpandedSections(new Set([sectionKey]));
          setActiveSubmenu(null);
        }

        const scrollToElement = (retryCount = 0) => {
          const el = document.getElementById(id);

          if (el) {
            el.scrollIntoView({ behavior: 'auto', block: 'start' });
          } else {
            if (retryCount < 3) {
              setTimeout(() => scrollToElement(retryCount + 1), 100);
            }
          }
        };

        scrollToElement();
        setMobileMenuOpen(false);
      },
      [sections, setActive, setActiveSubmenu, setExpandedSections, setMobileMenuOpen, setIgnoreSpy]
    );

    return (
      <nav className={`w-full space-y-1 ${mobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
        {sections.map(s => {
          const isExpanded = expandedSections.has(s.key);
          return (
            <div key={s.key} className='space-y-1'>
              {/* Main Menu Item */}
              <a
                href={`#${s.sectionId}`}
                onClick={e => handleClick(e, s.sectionId, null, s.key)}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition cursor-pointer ${
                  active === s.key
                    ? 'bg-slate-900'
                    : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                }`}
                style={active === s.key ? { color: 'white' } : {}}
              >
                {s.label}
              </a>

              {/* Submenu Items */}
              {s.submenu && isExpanded && (
                <div className='ml-4 space-y-1'>
                  {s.submenu.map(sub => (
                    <a
                      key={sub.key}
                      href={`#${sub.sectionId}`}
                      onClick={e => handleClick(e, sub.sectionId, sub.key, s.key)}
                      className={`block w-full text-left px-3 py-1.5 rounded text-xs transition ${
                        activeSubmenu === sub.key
                          ? 'bg-blue-100 font-medium'
                          : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                      style={activeSubmenu === sub.key ? { color: '#1d4ed8' } : {}}
                    >
                      {sub.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    );
  }
);

SystemMenu.displayName = 'SystemMenu';

export default SystemMenu;
