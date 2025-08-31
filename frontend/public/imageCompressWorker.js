self.onmessage = async (e) => {
  const { file, maxSizeMB } = e.data;

  // Nếu file nhỏ hơn maxSizeMB, không cần nén
  if (file.size / 1024 / 1024 < maxSizeMB) {
    self.postMessage(file);
    return;
  }

  try {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Tính toán tỷ lệ nén dựa trên kích thước mong muốn
        const ratio = Math.min(1, maxSizeMB * 1024 * 1024 / file.size);
        width *= ratio;
        height *= ratio;

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            self.postMessage(compressedFile);
          },
          file.type,
          0.8
        );
      };
      img.onerror = () => {
        throw new Error('Không thể tải ảnh');
      };
      img.src = event.target.result;
    };
    reader.onerror = () => {
      throw new Error('Không thể đọc file');
    };
    reader.readAsDataURL(file);
  } catch (error) {
    self.postMessage({ error: error.message });
  }
}; 