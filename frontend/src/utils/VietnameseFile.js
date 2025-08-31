// Hàm chuẩn hóa Unicode tiếng Việt
export const normalizeVietnamese = (str) => {
    if (!str) return '';
    try {
        // Chuẩn hóa Unicode
        const normalized = str.normalize('NFC');
        return normalized;
    } catch (error) {
        console.warn('Lỗi khi chuẩn hóa Unicode:', error);
        return str;
    }
};

// Hàm xử lý Unicode tiếng Việt
export const convertToUnicode = (str) => {
    if (!str) return '';
    try {
        // Chuẩn hóa trước khi chuyển đổi
        const normalized = normalizeVietnamese(str);
        return normalized
            .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
            .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
            .replace(/[ìíịỉĩ]/g, 'i')
            .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
            .replace(/[ùúụủũưừứựửữ]/g, 'u')
            .replace(/[ỳýỵỷỹ]/g, 'y')
            .replace(/đ/g, 'd')
            .replace(/[ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ]/g, 'A')
            .replace(/[ÈÉẸẺẼÊỀẾỆỂỄ]/g, 'E')
            .replace(/[ÌÍỊỈĨ]/g, 'I')
            .replace(/[ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ]/g, 'O')
            .replace(/[ÙÚỤỦŨƯỪỨỰỬỮ]/g, 'U')
            .replace(/[ỲÝỴỶỸ]/g, 'Y')
            .replace(/Đ/g, 'D');
    } catch (error) {
        console.warn('Lỗi khi chuyển đổi Unicode:', error);
        return str;
    }
};

// Hàm xử lý tên file tiếng Việt
export const formatFileName = (filename) => {
    try {
        if (!filename) return '';

        // Chuẩn hóa filename
        const normalizedName = normalizeVietnamese(filename);

        // Tách phần mở rộng
        const lastDotIndex = normalizedName.lastIndexOf('.');
        if (lastDotIndex === -1) {
            // Không có phần mở rộng
            const cleanName = convertToUnicode(normalizedName)
                .replace(/[^a-zA-Z0-9]/g, '_')
                .replace(/_+/g, '_')
                .toLowerCase()
                .trim();
            return cleanName;
        }

        // Có phần mở rộng
        const nameWithoutExt = normalizedName.substring(0, lastDotIndex);
        const ext = normalizedName.substring(lastDotIndex + 1);

        const cleanName = convertToUnicode(nameWithoutExt)
            .replace(/[^a-zA-Z0-9]/g, '_')
            .replace(/_+/g, '_')
            .toLowerCase()
            .trim();

        return `${cleanName}.${ext.toLowerCase()}`;
    } catch (error) {
        console.error('Lỗi khi xử lý tên file:', error);
        return filename || '';
    }
};

// Hàm decode tên file tiếng Việt từ UTF-8
export const decodeVietnameseName = (encodedName) => {
    try {
        if (!encodedName) return '';

        // Thử decode URI component
        let decodedName = encodedName;
        try {
            decodedName = decodeURIComponent(encodedName);
        } catch (e) {
            console.warn('Không thể decode URI:', e);
        }

        // Thử decode UTF-8 bytes
        try {
            const bytes = new Uint8Array(decodedName.length);
            for (let i = 0; i < decodedName.length; i++) {
                bytes[i] = decodedName.charCodeAt(i);
            }
            const decoded = new TextDecoder('utf-8').decode(bytes);
            if (decoded) decodedName = decoded;
        } catch (e) {
            console.warn('Không thể decode UTF-8:', e);
        }

        // Chuẩn hóa Unicode
        return normalizeVietnamese(decodedName);
    } catch (error) {
        console.error('Lỗi khi decode tên file:', error);
        return encodedName;
    }
};

// Hàm xử lý tên file
export const processFileName = (file) => {
    if (!file) return '';

    try {
        // Log input để debug
        console.log('Processing file:', {
            file,
            type: typeof file,
            hasResponse: !!file.response,
            hasOriginalName: !!file.originalName,
            hasName: !!file.name
        });

        // Lấy tên file gốc theo thứ tự ưu tiên
        let fileName = '';

        if (file.response?.originalName) {
            fileName = decodeVietnameseName(file.response.originalName);
        } else if (file.originFileObj) {
            fileName = normalizeVietnamese(file.originFileObj.name);
        } else if (file.originalName) {
            fileName = decodeVietnameseName(file.originalName);
        } else if (file.name) {
            fileName = normalizeVietnamese(file.name);
        } else if (typeof file === 'string') {
            fileName = decodeVietnameseName(file);
        } else {
            fileName = normalizeVietnamese(String(file));
        }

        // Log kết quả để debug
        console.log('Processed file name:', {
            input: file.name || file.originalName || file,
            output: fileName
        });

        // Rút gọn tên file nếu quá dài
        const MAX_LENGTH = 50;
        if (fileName.length > MAX_LENGTH) {
            const lastDotIndex = fileName.lastIndexOf('.');
            if (lastDotIndex === -1) {
                return fileName.substring(0, MAX_LENGTH - 3) + '...';
            }
            const ext = fileName.substring(lastDotIndex);
            const name = fileName.substring(0, lastDotIndex);
            const shortName = name.substring(0, MAX_LENGTH - ext.length - 3) + '...';
            fileName = shortName + ext;
        }

        return fileName;

    } catch (error) {
        console.warn('Error in processFileName:', error);
        // Fallback về tên gốc nếu có lỗi
        if (file.response?.originalName) return decodeVietnameseName(file.response.originalName);
        if (file.originalName) return decodeVietnameseName(file.originalName);
        if (file.name) return normalizeVietnamese(file.name);
        return normalizeVietnamese(String(file));
    }
};
