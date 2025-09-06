# Cấu hình Sidebar cho từng Page

## Tổng quan

Hệ thống sidebar mới cho phép cấu hình linh hoạt trạng thái thu gọn/mở rộng cho từng page khác nhau.

## Cách hoạt động

### 1. Cấu hình trong `sidebarConfig.js`

```javascript
export const SIDEBAR_CONFIG = {
  '/dc/cooling-system': {
    autoCollapse: true, // Tự động thu gọn khi vào page
    defaultCollapsed: true, // Trạng thái mặc định là thu gọn
  },
  '/dc/shifts': {
    autoCollapse: false, // Không tự động thu gọn
    defaultCollapsed: false, // Trạng thái mặc định là mở rộng
  },
};
```

### 2. Các thuộc tính cấu hình

- **`autoCollapse`**:
  - `true`: Tự động thu gọn sidebar khi vào page
  - `false`: Không tự động thu gọn, giữ nguyên trạng thái hiện tại

- **`defaultCollapsed`**:
  - `true`: Trạng thái mặc định là thu gọn
  - `false`: Trạng thái mặc định là mở rộng

### 3. Logic hoạt động

1. Khi user chuyển page, hệ thống sẽ kiểm tra cấu hình của page đó
2. Nếu `autoCollapse: true` → Tự động thu gọn sidebar
3. Nếu `autoCollapse: false` → Sử dụng `defaultCollapsed` để set trạng thái
4. User vẫn có thể click vào trigger để thay đổi trạng thái thủ công

## Cách thêm cấu hình mới

### Thêm trực tiếp vào `sidebarConfig.js`:

```javascript
export const SIDEBAR_CONFIG = {
  // ... existing configs
  '/your/new/page': { autoCollapse: true, defaultCollapsed: true },
};
```

### Sử dụng helper functions:

```javascript
import { addSidebarConfig, updateSidebarConfig } from './sidebarConfig';

// Thêm cấu hình mới
addSidebarConfig('/your/new/page', {
  autoCollapse: true,
  defaultCollapsed: true,
});

// Cập nhật cấu hình hiện có
updateSidebarConfig('/dc/cooling-system', {
  autoCollapse: false,
});
```

## Các page đã được cấu hình

### Datacenter Pages:

- `/dc/cooling-system`: Tự động thu gọn (để có nhiều không gian cho content)
- `/dc/ups-system`: Tự động thu gọn
- `/dc/fire-system`: Tự động thu gọn
- `/dc/security-system`: Tự động thu gọn
- `/dc/shifts`, `/dc/tasks`, `/dc/handovers`, `/dc/faq`: Mở rộng mặc định

### Manager Pages:

- Tất cả pages: Mở rộng mặc định

### BE Pages:

- Tất cả pages: Mở rộng mặc định

## Lưu ý

- User vẫn có thể thay đổi trạng thái sidebar thủ công bằng cách click vào trigger
- Khi user thay đổi thủ công, trạng thái sẽ được giữ nguyên cho đến khi chuyển page
- Cấu hình `autoCollapse: true` sẽ override trạng thái thủ công khi chuyển page
