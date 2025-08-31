# Module Hệ thống làm mát TTDL Vân Canh

## 📋 Mô tả
Module hiển thị thông tin chi tiết về hệ thống làm mát của Trung tâm dữ liệu Vân Canh, bao gồm thông số kỹ thuật, hướng dẫn vận hành và bảo trì các thiết bị.

## 🏗️ Cấu trúc thư mục
```
frontend/src/System/cooling-vancanh/
├── CoolingSystemPage.jsx    # Trang chính với layout 3 cột
├── CoolingContent.jsx       # Component hiển thị nội dung
├── CoolingSystemPage.css    # Styles cho module
├── index.jsx                # Export các component
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
  - Chiller SMARDT AE Series
  - PAC UNIFLAIR SDCV Series
  - PAC UNIFLAIR LDCV Series
  - Easy InRow CW Series
  - Hệ thống BMS Chiller

- **Section 3**: Vị trí hệ thống
- **Section 4**: Ứng dụng
- **Section 5**: Liên hệ
- **Section 6**: Tài liệu kèm theo

### Bảng thông số kỹ thuật
- Bảng chi tiết thông số SMARDT AE Series
- Responsive design với horizontal scroll
- Styling đẹp mắt với Ant Design

## 🚀 Cách sử dụng

### 1. Import module
```jsx
import { CoolingSystemPage } from '../System/cooling-vancanh';
```

### 2. Thêm route
```jsx
{
  path: '/cooling-system-vancanh',
  element: <CoolingSystemPage />,
  name: 'Hệ thống làm mát TTDL Vân Canh'
}
```

### 3. Thêm menu item
```jsx
{
  key: 'cooling-system-vancanh',
  icon: <ThermometerOutlined />,
  label: 'Hệ thống làm mát TTDL Vân Canh',
  onClick: () => navigate('/cooling-system-vancanh')
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

## 🏢 Thiết bị chính TTDL Vân Canh (Cập nhật từ tài liệu thực tế)

### Chiller SMARDT AE Series
- **Model chính xác**: AE054.2B.F2HAJA.A010DX.E10
- **Công suất**: 632kW (180RT) 
- **Công nghệ**: Oil-free compressor, Air-cooled
- **Nhiệt độ**: Nước lạnh ra 10°C, vào 16°C
- **Đặc điểm**: COP 3.5, 2 máy nén song song, tiết kiệm 30% năng lượng

### PAC UNIFLAIR (Từ catalog thực tế)
- **SDCV Series**: SDCV0300A (7.2kW), SDCV0400A (9.5kW), SDCV0600A (15.6kW)
- **LDCV Series**: LDCV0600A (16.8kW), LDCV1800A (64.4kW), LDCV3400A (79.8kW), LDCV4300A (110kW)
- **Độ chính xác**: ±0.5°C nhiệt độ
- **Điều khiển độ ẩm**: 45-55% RH

### Easy InRow CW Series
- **Model chính xác**: ERC311AD0HPE 
- **Công suất**: 21.6kW cooling
- **Loại**: Chilled Water InRow Cooling
- **Tính năng**: Direct cooling, space-efficient, Modbus integration

### BMS Chiller Integration (Chi tiết từ tài liệu)
- **PLC**: Siemens S7-1200 với Modbus RTU/TCP
- **TES Tank**: Thermal Energy Storage 10 phút backup
- **Chế độ vận hành**: Commissioning, Normal, Charge, Discharge
- **Van điều khiển**: V1A/V1B/V2A/V2B/V3A/V3B (3-way valves)
- **Load balancing**: Auto start/stop Chiller theo tải (>80% gọi thêm, <60% cắt bớt)
- **Rotation**: Luân phiên Chiller mỗi 8 giờ
- **Pump control**: Biến tần theo chênh lệch áp suất
- **Emergency**: Tự động chuyển Discharge mode khi mất điện

### Hệ thống phụ trợ (Từ bản vẽ As-built)
- **Bơm nước lạnh**: P1A/P1B (primary pumps)
- **Bơm bù áp**: Booster pumps duy trì áp suất hệ thống  
- **Van bypass**: Tự động duy trì áp suất tối thiểu
- **BTU Meters**: Đo năng lượng tiêu thụ
- **Cảm biến**: TT (nhiệt độ), PT (áp suất), FIT (lưu lượng)
