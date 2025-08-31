# Module Hệ thống làm mát TTDL

## 📋 Mô tả
Module hiển thị thông tin chi tiết về hệ thống làm mát của Trung tâm dữ liệu Hòa Lạc, bao gồm thông số kỹ thuật, hướng dẫn vận hành và bảo trì các thiết bị.

## 🏗️ Cấu trúc thư mục
```
frontend/src/System/cooling/
├── CoolingSystemPage.jsx    # Trang chính với layout 3 cột
├── CoolingContent.jsx       # Component hiển thị nội dung
├── CoolingSystemPage.css    # Styles cho module
├── index.js                 # Export các component
└── README.md               # Hướng dẫn sử dụng
```

## 🎨 Layout
Module sử dụng layout 3 cột:
- **Cột trái (350px)**: Menu navigation với các đầu mục và sub-menu
- **Cột giữa**: Nội dung chính với các section có thể scroll
- **Cột phải (200px)**: Để trống theo yêu cầu

## 📱 Tính năng

### Menu Navigation
- Menu phân cấp với các đầu mục lớn và sub-menu
- Icons cho từng mục menu
- Expand/collapse cho các sub-menu
- Smooth scroll đến section tương ứng khi click

### Nội dung
- **Section 1**: Giới thiệu chung
  - Thông số kỹ thuật theo tài liệu hãng
  - Cấu trúc đặt tên model
  - Nguyên lý hoạt động

- **Section 2**: Hướng dẫn chi tiết từng thiết bị
  - TDAV1321A - UNIFLAIR
  - TDAV2242A - UNIFLAIR
  - TDAV2842A - UNIFLAIR
  - FM40H-AGB-ESD-APC
  - ACRP102 - APC
  - Quạt sàn AFM4500B

- **Section 3**: Vị trí hệ thống
- **Section 4**: Ứng dụng
- **Section 5**: Liên hệ
- **Section 6**: Tài liệu kèm theo

### Bảng thông số kỹ thuật
- Bảng chi tiết thông số Uniflair TDAV Series
- Responsive design với horizontal scroll
- Styling đẹp mắt với Ant Design

## 🚀 Cách sử dụng

### 1. Import module
```jsx
import { CoolingSystemPage } from '../System/cooling';
```

### 2. Thêm route
```jsx
{
  path: '/cooling-system',
  element: <CoolingSystemPage />,
  name: 'Hệ thống làm mát TTDL'
}
```

### 3. Thêm menu item
```jsx
{
  key: 'cooling-system',
  icon: <ThermometerOutlined />,
  label: 'Hệ thống làm mát TTDL',
  onClick: () => navigate('/cooling-system')
}
```

## 🎯 Tính năng chính

### Smooth Scroll Navigation
- Khi click vào menu item, trang sẽ scroll mượt mà đến section tương ứng
- Sử dụng `scrollIntoView` với `behavior: 'smooth'`
- Highlight section được chọn

### Responsive Design
- Layout thích ứng với các kích thước màn hình
- Menu có thể collapse trên mobile
- Table có horizontal scroll trên màn hình nhỏ

### Styling
- Sử dụng Ant Design components
- Custom CSS cho layout và animation
- Theme colors nhất quán với hệ thống

## 📊 Dữ liệu
Module hiện tại sử dụng dữ liệu tĩnh trong component. Có thể mở rộng để:
- Load dữ liệu từ API
- Thêm tính năng search/filter
- Export PDF
- Print functionality

## 🔧 Tùy chỉnh

### Thêm thiết bị mới
1. Thêm vào menu items trong `CoolingSystemPage.jsx`
2. Thêm section tương ứng trong `CoolingContent.jsx`
3. Cập nhật dữ liệu bảng nếu cần

### Thay đổi layout
- Điều chỉnh width của các cột trong CSS
- Thay đổi màu sắc theme
- Tùy chỉnh animation

## 📝 Lưu ý
- Module được thiết kế để dễ dàng mở rộng
- Tất cả text đều bằng tiếng Việt
- Tuân thủ quy tắc coding của dự án DCE
- Sử dụng ES6 modules và React hooks 