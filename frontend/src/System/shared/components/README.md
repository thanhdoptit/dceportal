# Shared Components - Hướng dẫn sử dụng

## ImagePreview Component

Component hiển thị ảnh với tính năng preview, hỗ trợ cả ảnh đơn và nhiều ảnh.

### Cách sử dụng:

```jsx
import { ImagePreview } from '../../shared';

// Hiển thị một ảnh
<ImagePreview
  src="/path/to/image.jpg"
  alt="Mô tả ảnh"
  width={200}
  height={150}
/>

// Hiển thị nhiều ảnh
<ImagePreview
  src={['/image1.jpg', '/image2.jpg', '/image3.jpg']}
  alt="Bộ ảnh thiết bị"
  width={100}
  height={100}
  showImageCount={true}
/>

// Tùy chỉnh mask text
<ImagePreview
  src="/image.jpg"
  maskText="Click để xem"
  maskClassName="custom-preview-mask"
/>
```

### Props:

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `src` | `string \| Array` | - | Đường dẫn ảnh hoặc mảng ảnh |
| `alt` | `string` | 'Hình ảnh' | Alt text cho ảnh |
| `width` | `number` | 100 | Chiều rộng ảnh |
| `height` | `number` | 100 | Chiều cao ảnh |
| `style` | `Object` | {} | Style tùy chỉnh |
| `maskText` | `string` | 'Xem ảnh' | Text hiển thị trên mask |
| `maskClassName` | `string` | 'custom-mask' | Class name cho mask |
| `showImageCount` | `boolean` | true | Hiển thị số lượng ảnh |
| `fallbackText` | `string` | 'Không có ảnh' | Text khi không có ảnh |

## ImageGallery Component

Component hiển thị gallery ảnh dạng grid với preview.

### Cách sử dụng:

```jsx
import { ImageGallery } from '../../shared';

// Hiển thị gallery đơn giản
<ImageGallery
  images={['/img1.jpg', '/img2.jpg', '/img3.jpg']}
  columns={3}
/>

// Hiển thị gallery với caption
<ImageGallery
  images={[
    { src: '/img1.jpg', alt: 'Ảnh 1', caption: 'Mô tả ảnh 1' },
    { src: '/img2.jpg', alt: 'Ảnh 2', caption: 'Mô tả ảnh 2' }
  ]}
  columns={2}
  imageWidth={300}
  imageHeight={200}
/>

// Tùy chỉnh style
<ImageGallery
  images={images}
  columns={4}
  style={{ marginTop: '20px' }}
  maskText="Click để xem chi tiết"
/>
```

### Props:

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `images` | `Array` | [] | Mảng các ảnh |
| `columns` | `number` | 3 | Số cột hiển thị |
| `imageWidth` | `number` | 200 | Chiều rộng mỗi ảnh |
| `imageHeight` | `number` | 150 | Chiều cao mỗi ảnh |
| `maskText` | `string` | 'Xem ảnh' | Text hiển thị trên mask |
| `maskClassName` | `string` | 'custom-mask' | Class name cho mask |
| `style` | `Object` | {} | Style tùy chỉnh cho container |
| `fallbackText` | `string` | 'Không có ảnh nào' | Text khi không có ảnh |

## Ví dụ sử dụng trong Table:

```jsx
// Trong Table column
{
  title: 'Hình ảnh',
  dataIndex: 'images',
  key: 'images',
  width: '15%',
  render: (images) => (
    <ImagePreview
      src={images}
      alt="Hình ảnh thiết bị"
      width={80}
      height={60}
    />
  )
}
```

## Lưu ý:

- Cả hai component đều sử dụng Ant Design Image component
- Hỗ trợ PreviewGroup để xem nhiều ảnh
- Có thể tùy chỉnh style và mask text
- Tự động xử lý fallback khi không có ảnh
- Tương thích với tất cả props của Ant Design Image
