# 🎯 System Shared Components

Thư mục này chứa các components, hooks, styles và utilities chung cho tất cả các hệ thống tài liệu kỹ thuật.

## 📁 Cấu trúc thư mục

```
shared/
├── components/          # React components chung
│   ├── LazySection.jsx  # Component lazy loading
│   ├── PasswordField.jsx # Component hiển thị password
│   ├── SystemLayout.jsx # Layout chung cho tất cả hệ thống
│   └── index.js         # Export tất cả components
├── hooks/               # Custom React hooks
│   ├── useIntersectionObserver.js # Hook cho intersection observer
│   └── index.js         # Export tất cả hooks
├── styles/              # CSS styles chung
│   └── SystemLayout.css # CSS chuẩn cho layout hệ thống
├── utils/               # Utility functions
│   ├── menuUtils.js     # Functions xử lý menu
│   └── index.js         # Export tất cả utilities
├── index.js             # Export chính
└── README.md           # Tài liệu này
```

## 🚀 Components

### SystemLayout
Layout chung cho tất cả hệ thống với sidebar menu và content area.

```jsx
import { SystemLayout } from '../shared';

<SystemLayout
  menuItems={menuItems}
  title="Hệ thống làm mát TTDL Vân Canh"
  headerBgColor="#1890ff"
  selectedKey={selectedKey}
>
  <CoolingContent />
</SystemLayout>
```

### LazySection
Component lazy loading với intersection observer.

```jsx
import { LazySection } from '../shared';

<LazySection
  importFunc={() => import('./sections/IntroductionSection')}
  forceLoad={forceLoadAll}
  threshold={0.1}
  rootMargin="100px"
  onLoad={handleSectionLoad}
/>
```

### PasswordField
Component hiển thị password với toggle visibility.

```jsx
import { PasswordField } from '../shared';

<PasswordField 
  password="admin123" 
  label="Password:" 
/>
```

## 🔧 Hooks

### useIntersectionObserver
Hook để detect khi element vào viewport.

```jsx
import { useIntersectionObserver } from '../shared';

const [ref, isIntersecting] = useIntersectionObserver({
  threshold: 0.1,
  rootMargin: '100px',
  triggerOnce: true
});
```

## 🎨 Styles

### SystemLayout.css
CSS chuẩn cho layout hệ thống bao gồm:

#### **Layout & Menu:**
- Layout chính với flexbox
- Menu container và styling
- Sidebar với smooth transitions
- Menu items với hover effects và selected states

#### **Content Area:**
- Content area với responsive design
- Content sections và subsections
- Device sections và cards
- Table và card styling

#### **Components:**
- Loading states và animations
- Progress indicators
- Lazy section placeholders
- Button và tag hover effects

#### **Responsive Design:**
- Mobile-first approach
- Breakpoints: 1600px, 1400px, 1200px, 768px
- Adaptive menu và content

#### **Performance:**
- Smooth transitions và animations
- Optimized scrollbars
- Box-sizing optimization
- Image optimization

## 🛠️ Utils

### menuUtils.js
Utility functions cho menu handling:
- `handleMenuClick`: Xử lý click menu item
- `getMenuHeaderStyle`: Tạo style cho menu header
- `getMenuHeaderTitleStyle`: Tạo style cho menu title
- `createMenuStructure`: Tạo cấu trúc menu
- `createMenuItem`: Tạo menu item
- `createSubMenuItem`: Tạo sub menu item
- `createLeafMenuItem`: Tạo leaf menu item

## 📦 Usage

### Import tất cả
```jsx
import { 
  SystemLayout, 
  LazySection, 
  PasswordField,
  useIntersectionObserver 
} from '../shared';
```

### Import riêng lẻ
```jsx
import { SystemLayout } from '../shared/components/SystemLayout';
import { useIntersectionObserver } from '../shared/hooks/useIntersectionObserver';
```

### CSS tự động được import
```jsx
import { SystemLayout } from '../shared';
// CSS sẽ tự động được import từ shared/styles/SystemLayout.css
```

## 🎯 Benefits

1. **Tái sử dụng**: Các components có thể dùng cho nhiều hệ thống
2. **Nhất quán**: UI/UX đồng nhất giữa các hệ thống
3. **Dễ bảo trì**: Chỉ cần update ở một nơi
4. **Performance**: Lazy loading và optimization chung
5. **Scalability**: Dễ dàng thêm hệ thống mới
6. **CSS chuẩn**: Một file CSS duy nhất cho tất cả hệ thống

## 🔄 Migration

### Khi tạo hệ thống mới:
1. Import components từ `../shared`
2. Sử dụng `SystemLayout` thay vì tự tạo layout
3. Sử dụng `LazySection` cho lazy loading
4. Sử dụng utility functions cho menu handling
5. **KHÔNG cần tạo file CSS riêng** - CSS tự động từ shared

### Ví dụ hệ thống mới:
```jsx
import React, { useState } from 'react';
import { SystemLayout } from '../shared';

const NewSystemPage = () => {
  const [selectedKey, setSelectedKey] = useState('1');
  
  const menuItems = [
    {
      key: '1',
      icon: <InfoCircleOutlined />,
      label: '1. GIỚI THIỆU',
      children: [
        { key: '1.1', label: '1.1 Thông tin chung' },
        { key: '1.2', label: '1.2 Hướng dẫn sử dụng' }
      ]
    }
  ];

  return (
    <SystemLayout
      menuItems={menuItems}
      title="Hệ thống mới"
      headerBgColor="#1890ff"
      selectedKey={selectedKey}
    >
      <div>Nội dung hệ thống mới</div>
    </SystemLayout>
  );
};
```

## 📝 CSS Classes Available

### Layout Classes:
- `.system-layout` - Layout chính
- `.menu-container` - Container cho menu
- `.system-sider` - Sidebar menu
- `.system-content` - Content area
- `.content-wrapper` - Wrapper cho content

### Menu Classes:
- `.system-menu` - Menu chính
- `.menu-header` - Header của menu
- `.expand-icon` - Icon expand/collapse

### Content Classes:
- `.content-section` - Section chính
- `.subsection` - Subsection
- `.device-section` - Section thiết bị
- `.device-card` - Card thiết bị
- `.content-footer` - Footer content

### Loading Classes:
- `.loading-container` - Container loading
- `.loading-text` - Text loading
- `.progress-indicator` - Progress bar
- `.lazy-section-loading` - Lazy loading placeholder

### Backward Compatibility:
- `.cooling-system-layout` - Layout cũ
- `.cooling-system-menu` - Menu cũ
- `.cooling-system-content` - Content cũ
- `.cooling-content` - Content wrapper cũ

## 🎨 Customization

### Thay đổi màu sắc:
```jsx
<SystemLayout
  headerBgColor="#1890ff"  // Màu header
  // CSS variables có thể được override
/>
```

### Thêm CSS riêng:
```css
/* Trong file CSS riêng của hệ thống */
.system-layout {
  /* Override styles nếu cần */
}

.system-content {
  /* Custom styles cho content */
}
```

## 📝 Notes

- Tất cả components đều có TypeScript support
- CSS sử dụng CSS classes thay vì inline styles
- Hooks có proper cleanup và error handling
- Utils có JSDoc documentation
- **CSS tự động được import** khi import từ shared
- **Backward compatibility** được đảm bảo cho các hệ thống cũ
