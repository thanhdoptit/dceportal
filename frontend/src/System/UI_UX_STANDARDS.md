# 🎨 Tiêu Chuẩn Thiết Kế UI/UX - Hệ Thống Tài Liệu Kỹ Thuật

## 📋 Tổng Quan
Tiêu chuẩn này được xây dựng dựa trên thiết kế của **Cooling System Vân Canh** và sẽ được áp dụng cho tất cả các hệ thống tài liệu kỹ thuật khác. Bao gồm các tiêu chuẩn về lazy loading, performance optimization, auto thu gọn menu sidebar và UX enhancement.

## 🏗️ Cấu Trúc Layout

### 1. Layout Chính
```css
.cooling-system-layout {
  height: calc(100vh - 83px);
  background: #f5f5f5;
  display: flex;
  overflow: hidden;
  position: relative;
  width: 100%;
  max-width: 100vw;
  box-sizing: border-box;
  min-width: 0;
}
```

### 2. Menu Container
- **Width**: 380px (cố định)
- **Background**: #ffffff
- **Border**: 1px solid #e8e8e8
- **Shadow**: 2px 0 10px rgba(0, 0, 0, 0.1)
- **Transition**: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)

### 3. Content Area
- **Background**: Linear gradient (135deg, #f5f7fa 0%, #c3cfe2 100%)
- **Padding**: 24px 32px
- **Scroll**: Vertical only
- **Scroll Behavior**: Smooth
- **Scroll Padding**: 20px
- **Transition**: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)

## 🚀 Performance & Lazy Loading Standards

### 1. Lazy Loading Implementation
```javascript
// Section configuration với priority levels
const sections = [
  {
    id: '1',
    name: 'Giới thiệu chung',
    importFunc: () => import('./sections/IntroductionSection'),
    priority: 'high',
    preload: true // Preload section đầu tiên
  },
  {
    id: '2',
    name: 'Hướng dẫn thiết bị',
    importFunc: () => import('./sections/DeviceGuideSection'),
    priority: 'high',
    preload: false
  }
];
```

### 2. LazySection Component
```javascript
const LazySection = ({ 
  importFunc, 
  placeholder = null,
  threshold = 0.1,
  rootMargin = '100px',
  onLoad = null,
  forceLoad = false
}) => {
  // Implementation với Intersection Observer
};
```

### 3. Progress Indicator
```css
.progress-indicator {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 16px 24px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid #e8e8e8;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.progress-indicator:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}
```

### 4. Loading States
```css
.lazy-section-placeholder {
  padding: 30px;
  text-align: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border: 2px dashed #d9d9d9;
  border-radius: 12px;
  margin: 20px 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
  margin: 20px;
  border: 2px dashed #d9d9d9;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.loading-container:hover {
  border-color: #1890ff;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.1);
}
```

## 🔄 Auto Collapse Menu Standards

### 1. Sidebar Configuration
```javascript
// Cấu hình sidebar cho từng page
export const SIDEBAR_CONFIG = {
  '/dc/cooling-system': { autoCollapse: true, defaultCollapsed: true },
  '/dc/cooling-system-vancanh': { autoCollapse: true, defaultCollapsed: true },
  '/dc/ups-system': { autoCollapse: true, defaultCollapsed: true },
  '/dc/fire-system': { autoCollapse: true, defaultCollapsed: true },
  '/dc/security-system': { autoCollapse: true, defaultCollapsed: true },
};
```

### 2. SidebarContext Implementation
```javascript
export const SidebarProvider = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [sidebarReady, setSidebarReady] = useState(true);
  const location = useLocation();

  // Tự động cập nhật trạng thái sidebar khi chuyển page
  useEffect(() => {
    const newConfig = getCurrentConfig();
    
    // Đánh dấu sidebar chưa sẵn sàng
    setSidebarReady(false);
    setIsAnimating(true);
    
    // Delay để đảm bảo page transition mượt mà và sidebar thu gọn xong
    const timer = setTimeout(() => {
      if (newConfig.autoCollapse) {
        handleSidebarChange(true);
      } else {
        handleSidebarChange(newConfig.defaultCollapsed);
      }
    }, 150); // Delay 150ms để mượt mà
    
    return () => clearTimeout(timer);
  }, [location.pathname]);
};
```

### 3. Content Loading Logic
```javascript
const CoolingContent = () => {
  const { sidebarReady, isAnimating } = useSidebar();
  const [loadedSections, setLoadedSections] = useState(0);
  const [forceLoadAll, setForceLoadAll] = useState(false);

  // Preload section đầu tiên khi sidebar đã sẵn sàng
  useEffect(() => {
    if (sidebarReady && !isAnimating) {
      const firstSection = sections.find(s => s.preload);
      if (firstSection) {
        firstSection.importFunc().then(() => {
          setLoadedSections(1);
        });
      }
    }
  }, [sidebarReady, isAnimating]);

  // Force load tất cả sections khi sidebar đã sẵn sàng
  useEffect(() => {
    if (sidebarReady && !isAnimating) {
      const timer = setTimeout(() => {
        setForceLoadAll(true);
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [sidebarReady, isAnimating]);

  // Hiển thị loading khi sidebar đang animating
  if (isAnimating || !sidebarReady) {
    return (
      <div className="cooling-content">
        <div className="loading-container">
          <div style={{ textAlign: 'center' }}>
            <Spin size="large" />
            <p className="loading-text">
              Đang tải tài liệu hệ thống...
            </p>
          </div>
        </div>
      </div>
    );
  }
};
```

### 4. Timing Standards
- **Page Transition Delay**: 150ms
- **Sidebar Animation Duration**: 300ms
- **Content Preload Delay**: 200ms
- **Force Load Delay**: 200ms

## 🎯 Menu Design Standards

### 1. Menu Header
```css
.menu-header {
  background: #0072BC;
  color: white;
  padding: 8px;
  border-radius: 8px;
  margin: 8px;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 2. Menu Items - Level 1 (Main Categories)
```css
.ant-menu-submenu-title {
  border-radius: 6px;
  margin: 1px 2px;
  height: auto;
  min-height: 40px;
  line-height: 1.3;
  padding: 6px 8px;
  font-weight: 600;
  font-size: 14px;
  color: #333333;
  background: #fff !important;
  border: 1px solid #e0e0e0 !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 3. Menu Items - Level 2 (Sub Categories)
```css
.ant-menu-submenu .ant-menu-submenu-title {
  font-weight: 500;
  font-size: 13px;
  color: #333333;
  padding: 4px 6px;
  min-height: 36px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 4. Menu Items - Level 3 (Detail Items)
```css
.ant-menu-item {
  border-radius: 6px;
  margin: 1px 2px;
  height: auto;
  min-height: 36px;
  line-height: 1.3;
  padding: 4px 6px;
  font-weight: 400;
  font-size: 12px;
  color: #333333;
  background: #fff !important;
  border: 1px solid #e0e0e0 !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 5. Hover Effects
```css
.ant-menu-item:hover,
.ant-menu-submenu-title:hover {
  background: #e6f7ff !important;
  color: #0072BC !important;
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(0, 114, 188, 0.15) !important;
}
```

### 6. Selected States
```css
.ant-menu-item-selected,
.ant-menu-submenu-selected > .ant-menu-submenu-title {
  background: #0072BC !important;
  color: #fff !important;
  border: 1px solid #0072BC !important;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 114, 188, 0.3) !important;
}
```

## 🎨 Color Palette

### Primary Colors
- **Primary Blue**: #0072BC
- **Light Blue**: #e6f7ff
- **Dark Blue**: #1890ff

### Background Colors
- **Main Background**: #f5f5f5
- **Content Background**: Linear gradient (#f5f7fa → #c3cfe2)
- **Card Background**: #ffffff
- **Section Background**: #f8f9fa

### Text Colors
- **Primary Text**: #333333
- **Secondary Text**: #595959
- **Light Text**: #8c8c8c

### Border Colors
- **Primary Border**: #e0e0e0
- **Card Border**: #e8e8e8
- **Table Border**: #d9d9d9

### Status Colors
- **Success**: #52c41a
- **Warning**: #faad14
- **Error**: #ff4d4f
- **Info**: #1890ff

## 📱 Typography Standards

### Font Sizes
- **Menu Header**: 20px (bold)
- **Level 1 Menu**: 14px (600 weight)
- **Level 2 Menu**: 13px (500 weight)
- **Level 3 Menu**: 12px (400 weight)
- **Section Titles**: 24px (600 weight)
- **Subsection Titles**: 20px (500 weight)
- **Content Text**: 14px (400 weight)

### Line Heights
- **Menu Items**: 1.3
- **Content**: 1.6
- **Titles**: 1.4

## 🎭 Animation Standards

### Transitions
```css
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

### Hover Transformations
- **Menu Items**: translateX(4px)
- **Buttons**: translateY(-1px)
- **Tags**: scale(1.05)
- **Progress Indicators**: translateY(-1px)

### Scroll Behavior
```css
scroll-behavior: smooth;
scroll-margin-top: 20px;
scroll-padding-top: 20px;
```

### Loading Animations
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.pulse-animation {
  animation: pulse 2s ease-in-out infinite;
}
```

### Sidebar Animations
```css
@keyframes sidebarCollapse {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
}

@keyframes sidebarExpand {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.sidebar-collapsing {
  animation: sidebarCollapse 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.sidebar-expanding {
  animation: sidebarExpand 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
```

## 📐 Spacing Standards

### Margins & Padding
- **Menu Container**: 8px margin
- **Menu Items**: 1px 2px margin
- **Content Wrapper**: 24px 32px padding
- **Section Spacing**: 32px margin-bottom
- **Card Padding**: 16px
- **Subsection Padding**: 16px

### Border Radius
- **Menu Items**: 6px
- **Cards**: 8px
- **Buttons**: 6px
- **Tables**: 8px
- **Progress Indicators**: 12px

## 🔧 Component Standards

### 1. Cards
```css
.ant-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e8e8e8;
  margin-bottom: 16px;
}
```

### 2. Tables
```css
.ant-table {
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #d9d9d9;
}

.ant-table-thead > tr > th {
  background: #f0f8ff;
  color: #1890ff;
  font-weight: 900;
  border-bottom: 2px solid #1890ff;
}
```

### 3. Buttons
```css
.ant-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.ant-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 114, 188, 0.3);
}
```

### 4. Tags
```css
.ant-tag {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.ant-tag:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
```

### 5. Progress Bars
```css
.ant-progress {
  margin: 0;
}

.ant-progress-bg {
  background: linear-gradient(90deg, #1890ff 0%, #0072BC 100%);
}
```

### 6. Alerts
```css
.ant-alert {
  border-radius: 8px;
  border: 1px solid;
}

.ant-alert-success {
  background: linear-gradient(135deg, #f6ffed 0%, #e6f7ff 100%);
  border-color: #b7eb8f;
}
```

## 📱 Responsive Design

### Breakpoints
- **Desktop**: > 1200px
- **Tablet**: 768px - 1200px
- **Mobile**: < 768px

### Mobile Adaptations
```css
@media (max-width: 768px) {
  .cooling-system-layout {
    flex-direction: column;
  }
  
  .cooling-system-sider {
    width: 100% !important;
    height: auto;
    max-height: 300px;
  }
  
  .content-wrapper {
    padding: 16px;
  }
  
  .progress-indicator {
    position: relative;
    margin: 16px;
  }
}
```

## 🎯 Content Structure Standards

### 1. Section Layout
- Mỗi section phải có `id` attribute để scroll
- Layout dọc (không dùng Row/Col cho các section con)
- Spacing nhất quán giữa các section
- Sử dụng LazySection component cho lazy loading

### 2. ID Naming Convention
- **Main Sections**: `section-{key}` (ví dụ: `section-3.1`)
- **Sub Sections**: `{key}` (ví dụ: `2.1.1`)
- **Fallback**: `section-{mainKey}` (ví dụ: `section-4`)

### 3. Content Organization
- **Title**: Sử dụng Ant Design Typography
- **Content**: Sử dụng Cards cho các phần chính
- **Spacing**: Divider giữa các section lớn
- **Loading**: Placeholder cho lazy loading

## 🔄 Performance Standards

### 1. Lazy Loading Strategy
- **Preload**: Section đầu tiên được preload
- **Intersection Observer**: Detect khi section vào viewport
- **Force Load**: Tất cả sections được load sau 200ms
- **Error Handling**: Retry mechanism cho failed loads

### 2. Code Splitting
- **Dynamic Import**: Sử dụng `import()` cho tất cả sections
- **Bundle Optimization**: Mỗi section là một chunk riêng biệt
- **Caching**: Browser cache cho các chunks đã load

### 3. UX Optimization
- **Progress Indicator**: Hiển thị tiến độ loading
- **Placeholder**: Loading state đẹp mắt
- **Completion Message**: Thông báo khi load xong
- **Smooth Transitions**: Animation mượt mà

### 4. Auto Collapse Optimization
- **Timing**: 150ms delay cho page transition
- **Animation**: 300ms cho sidebar collapse/expand
- **Content Loading**: Chỉ load sau khi sidebar sẵn sàng
- **State Management**: `sidebarReady` và `isAnimating` flags

## 🔄 Implementation Checklist

### ✅ Layout Setup
- [ ] Layout chính với flexbox
- [ ] Menu container 380px width
- [ ] Content area full width
- [ ] Responsive breakpoints

### ✅ Menu Implementation
- [ ] Menu header với branding
- [ ] 3-level menu structure
- [ ] Hover và selected states
- [ ] Smooth scroll functionality

### ✅ Auto Collapse Implementation
- [ ] SidebarContext với timing optimization
- [ ] Sidebar configuration cho từng page
- [ ] Content loading logic với sidebarReady check
- [ ] Loading state khi sidebar animating

### ✅ Lazy Loading Implementation
- [ ] LazySection component
- [ ] useIntersectionObserver hook
- [ ] Progress indicator
- [ ] Error handling và retry

### ✅ Content Structure
- [ ] Proper ID attributes
- [ ] Vertical layout cho sections
- [ ] Consistent spacing
- [ ] Card-based content
- [ ] Lazy loading cho tất cả sections

### ✅ Styling
- [ ] Color palette implementation
- [ ] Typography standards
- [ ] Animation effects
- [ ] Responsive design
- [ ] Loading states và placeholders
- [ ] Smooth transitions cho tất cả elements

### ✅ Performance
- [ ] Optimized CSS
- [ ] Smooth animations
- [ ] Efficient scroll handling
- [ ] Mobile optimization
- [ ] Code splitting và lazy loading
- [ ] Auto collapse timing optimization

## 📝 Notes
- **Không thay đổi nội dung** đã được phê duyệt
- Chỉ áp dụng thiết kế cho **cấu trúc và giao diện**
- Đảm bảo **tính nhất quán** giữa các hệ thống
- **Tối ưu UX** cho việc navigation và reading
- **Performance first** - ưu tiên tốc độ load và smooth UX
- **Progressive enhancement** - tải nội dung theo nhu cầu
- **Auto collapse timing** - đảm bảo sidebar thu gọn xong rồi mới load dữ liệu
- **Smooth transitions** - tất cả animations phải mượt mà và nhất quán
