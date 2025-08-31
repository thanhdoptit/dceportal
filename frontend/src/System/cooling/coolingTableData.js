// Dữ liệu bảng thông số kỹ thuật Uniflair
export const uniflairTableColumns = [
  {
    title: 'Model',
    dataIndex: 'model',
    key: 'model',
    width: 120,
  },
  {
    title: 'Số lượng',
    dataIndex: 'quantity',
    key: 'quantity',
    width: 80,
    align: 'center',
  },
  {
    title: 'Công suất lạnh (kW)',
    dataIndex: 'coolingCapacity',
    key: 'coolingCapacity',
    width: 140,
    align: 'center',
  },
  {
    title: 'Công suất sưởi (kW)',
    dataIndex: 'heatingCapacity',
    key: 'heatingCapacity',
    width: 140,
    align: 'center',
  },
  {
    title: 'Tạo ẩm (kg/h)',
    dataIndex: 'humidity',
    key: 'humidity',
    width: 120,
    align: 'center',
  },
  {
    title: 'Lưu lượng gió (m³/h)',
    dataIndex: 'airFlow',
    key: 'airFlow',
    width: 150,
    align: 'center',
  },
  {
    title: 'Gas',
    dataIndex: 'gas',
    key: 'gas',
    width: 80,
    align: 'center',
  },
  {
    title: 'Số máy nén',
    dataIndex: 'compressors',
    key: 'compressors',
    width: 100,
    align: 'center',
  },
  {
    title: 'Mạch gas',
    dataIndex: 'gasCircuit',
    key: 'gasCircuit',
    width: 80,
    align: 'center',
  },
  {
    title: 'Số quạt',
    dataIndex: 'fans',
    key: 'fans',
    width: 80,
    align: 'center',
  },
  {
    title: 'Dòng hoạt động (A)',
    dataIndex: 'operatingCurrent',
    key: 'operatingCurrent',
    width: 140,
    align: 'center',
  },
  {
    title: 'Dòng khởi động (A)',
    dataIndex: 'startingCurrent',
    key: 'startingCurrent',
    width: 140,
    align: 'center',
  },
];

export const uniflairTableData = [
  {
    key: '1',
    model: 'TDA V132 1A',
    quantity: 2,
    coolingCapacity: 48.1,
    heatingCapacity: 15,
    humidity: 8,
    airFlow: '10,000',
    gas: 'R410A',
    compressors: 2,
    gasCircuit: 1,
    fans: 2,
    operatingCurrent: 26,
    startingCurrent: 65,
  },
  {
    key: '2',
    model: 'TDA V224 2A',
    quantity: 3,
    coolingCapacity: 67.2,
    heatingCapacity: 20,
    humidity: 12,
    airFlow: '14,000',
    gas: 'R410A',
    compressors: 2,
    gasCircuit: 2,
    fans: 2,
    operatingCurrent: 35,
    startingCurrent: 88,
  },
  {
    key: '3',
    model: 'TDA V284 2A',
    quantity: 3,
    coolingCapacity: 84.0,
    heatingCapacity: 25,
    humidity: 15,
    airFlow: '18,000',
    gas: 'R410A',
    compressors: 2,
    gasCircuit: 2,
    fans: 2,
    operatingCurrent: 42,
    startingCurrent: 105,
  },
].filter(item => item.model && item.model.trim() !== '');

// AFM Table Columns
export const afmTableColumns = [
  {
    title: 'Model',
    dataIndex: 'model',
    key: 'model',
    width: 120,
    align: 'center',
  },
  {
    title: 'Số lượng',
    dataIndex: 'quantity',
    key: 'quantity',
    width: 100,
    align: 'center',
  },
  {
    title: 'Lưu lượng gió (m³/h)',
    dataIndex: 'airFlow',
    key: 'airFlow',
    width: 150,
    align: 'center',
  },
  {
    title: 'Tốc độ quạt',
    dataIndex: 'fanSpeed',
    key: 'fanSpeed',
    width: 120,
    align: 'center',
  },
  {
    title: 'Công suất quạt',
    dataIndex: 'fanPower',
    key: 'fanPower',
    width: 130,
    align: 'center',
  },
  {
    title: 'Số quạt',
    dataIndex: 'fans',
    key: 'fans',
    width: 100,
    align: 'center',
  },
  {
    title: 'Dòng hoạt động (A)',
    dataIndex: 'operatingCurrent',
    key: 'operatingCurrent',
    width: 150,
    align: 'center',
  },
  {
    title: 'Dòng khởi động (A)',
    dataIndex: 'startingCurrent',
    key: 'startingCurrent',
    width: 150,
    align: 'center',
  },
  {
    title: 'Ghi chú',
    dataIndex: 'notes',
    key: 'notes',
    width: 200,
    align: 'center',
  },
];

// AFM Table Data
export const afmTableData = [
  {
    key: '1',
    model: 'AFM4500B',
    quantity: 10,
    airFlow: '4500',
    fanSpeed: '2 tốc độ',
    fanPower: '200 W',
    fans: 1,
    operatingCurrent: 1.2,
    startingCurrent: 3.2,
    notes: 'Module gắn sàn',
  },
];

// APC Table Columns
export const apcTableColumns = [
  {
    title: 'Model',
    dataIndex: 'model',
    key: 'model',
    width: 150,
    align: 'center',
  },
  {
    title: 'Số lượng',
    dataIndex: 'quantity',
    key: 'quantity',
    width: 100,
    align: 'center',
  },
  {
    title: 'Loại thiết kế',
    dataIndex: 'designType',
    key: 'designType',
    width: 140,
    align: 'center',
  },
  {
    title: 'Công suất lạnh (kW)',
    dataIndex: 'coolingCapacity',
    key: 'coolingCapacity',
    width: 160,
    align: 'center',
  },
  {
    title: 'Gas',
    dataIndex: 'gas',
    key: 'gas',
    width: 100,
    align: 'center',
  },
  {
    title: 'Máy nén',
    dataIndex: 'compressor',
    key: 'compressor',
    width: 140,
    align: 'center',
  },
  {
    title: 'Mạch gas',
    dataIndex: 'gasCircuit',
    key: 'gasCircuit',
    width: 100,
    align: 'center',
  },
  {
    title: 'Quạt EC',
    dataIndex: 'ecFans',
    key: 'ecFans',
    width: 100,
    align: 'center',
  },
  {
    title: 'Dòng hoạt động (A)',
    dataIndex: 'operatingCurrent',
    key: 'operatingCurrent',
    width: 150,
    align: 'center',
  },
  {
    title: 'Dòng khởi động (A)',
    dataIndex: 'startingCurrent',
    key: 'startingCurrent',
    width: 150,
    align: 'center',
  },
];

// APC Table Data
export const apcTableData = [
  {
    key: '1',
    model: 'FM40H-AGB-ESD',
    quantity: 5,
    designType: 'InRoom đứng',
    coolingCapacity: '47–50',
    gas: 'R407C',
    compressor: '2 Scroll',
    gasCircuit: 2,
    ecFans: 2,
    operatingCurrent: 38,
    startingCurrent: 95,
  },
  {
    key: '2',
    model: 'ACRP102',
    quantity: 4,
    designType: 'InRow giữa rack',
    coolingCapacity: '~45',
    gas: 'R407C',
    compressor: '1 Digital Scroll',
    gasCircuit: 1,
    ecFans: 4,
    operatingCurrent: 30,
    startingCurrent: 75,
  },
];

// Bảng cấu trúc đặt tên TDAV
export const tdavStructureColumns = [
  { title: 'Ký tự', dataIndex: 'character', key: 'character', width: 100 },
  { title: 'Ý nghĩa', dataIndex: 'meaning', key: 'meaning', width: 200 },
  { title: 'Ví dụ', dataIndex: 'example', key: 'example', width: 150 }
];

export const tdavStructureData = [
  {
    key: '1',
    character: 'TDAV',
    meaning: 'Loại điều hòa tủ đứng, giải nhiệt bằng khí',
    example: 'Luôn cố định cho dòng DX'
  },
  {
    key: '2',
    character: 'a (1-2 chữ số)',
    meaning: 'Công suất lạnh danh định',
    example: '13 ≈ 40–50 kW, 22 ≈ 70 kW, 28 ≈ 76–88 kW'
  },
  {
    key: '3',
    character: 'b (1 chữ số)',
    meaning: 'Số lượng máy nén (compressor)',
    example: '1 = 1 máy nén, 2 = 2 máy nén, 4 = 4 máy nén'
  },
  {
    key: '4',
    character: 'c (1 chữ số)',
    meaning: 'Số mạch gas (circuit)',
    example: '1 = 1 circuit, 2 = 2 circuit'
  },
  {
    key: '5',
    character: 'd (1 chữ cái)',
    meaning: 'Loại thổi gió & hướng gió (luồng không khí)',
    example: 'A = Thổi sàn (downflow)'
  }
];

// Bảng công suất lạnh định danh Uniflair TDAV
// Chỉ hiển thị tối đa 4 dòng, không full hết bảng
export const tdavCapacityColumns = [
  { title: 'Mã model', dataIndex: 'code', key: 'code', width: 100 },
  { title: 'Công suất (kW)', dataIndex: 'capacity', key: 'capacity', width: 100 }
];

export const tdavCapacityData = [
  { key: '1', code: '05', capacity: '17 kW' },
  { key: '2', code: '11', capacity: '35 kW' },
  { key: '3', code: '18', capacity: '53 kW' },
  { key: '4', code: '22', capacity: '70 kW' },
  { key: '5', code: '25', capacity: '72 kW' },
  { key: '6', code: '28', capacity: '76 kW' }
];

// Bảng cấu trúc đặt tên FM40H-AGB-ESD
export const fm40hStructureColumns = [
  { title: 'Phần', dataIndex: 'part', key: 'part', width: 120 },
  { title: 'Ký tự', dataIndex: 'character', key: 'character', width: 100 },
  { title: 'Ý nghĩa', dataIndex: 'meaning', key: 'meaning', width: 300 }
];

export const fm40hStructureData = [
  {
    key: '1',
    part: 'Dòng SP & Công suất',
    character: 'FM40',
    meaning: 'FM: Đây là mã định danh cho dòng sản phẩm NetworkAIR FM, một dòng điều hòa chính xác dạng tủ đứng (InRoom) của APC.\n\n40: Con số này chỉ công suất lạnh danh định của thiết bị, tức là 40 kW (tương đương khoảng 12 tấn lạnh).'
  },
  {
    key: '2',
    part: 'Loại Module',
    character: 'H',
    meaning: 'Ký tự này xác định vai trò của tủ điều hòa khi hoạt động trong một hệ thống lớn gồm nhiều tủ.\n\nTuy nhiên, trong các tài liệu công khai của APC, ký tự này thường là "M" (Main - Chính) hoặc "E" (Expansion - Mở rộng). Ký tự "H" có thể là một mã tùy chỉnh hoặc mã nội bộ cho TTDL Hòa Lạc và không được giải thích trong tài liệu tiêu chuẩn.'
  },
  {
    key: '3',
    part: 'Cấu hình',
    character: 'AGB',
    meaning: 'A: Ký tự đầu tiên trong cụm này chỉ phương pháp giải nhiệt. "A" là viết tắt của Air Cooled (Giải nhiệt bằng khí). Điều này có nghĩa là thiết bị sẽ có một dàn nóng (outdoor unit) đặt bên ngoài để thải nhiệt ra môi trường không khí.\n\nGB: Hai ký tự này không được định nghĩa trong bảng mã tiêu chuẩn công khai của APC. Tương tự như ký tự "H", đây có thể là mã cho một cấu hình phần cứng đặc biệt hoặc một gói tùy chọn riêng.'
  },
  {
    key: '4',
    part: 'Tùy chọn',
    character: 'ESD',
    meaning: 'E: Viết tắt của Electric Reheat (Sưởi điện). Thiết bị được trang bị một bộ sưởi bằng điện trở để làm nóng không khí khi cần thiết, giúp kiểm soát độ ẩm chính xác hơn hoặc tăng nhiệt độ phòng trong một số điều kiện nhất định. \n\n S: Viết tắt của Steam Humidifier (Bộ tạo ẩm bằng hơi nước). Thiết bị có khả năng tạo ra hơi nước tinh khiết để bổ sung độ ẩm cho phòng máy, duy trì độ ẩm trong ngưỡng an toàn cho thiết bị IT.. \n\n	D: Viết tắt của Downflow (Thổi sàn). Đây là kiểu luồng gió của thiết bị, không khí lạnh sẽ được thổi xuống dưới sàn nâng và phân phối đến các tủ rack từ phía dưới'
  }
];

// Bảng cấu trúc đặt tên ACRP102
export const acrp102StructureColumns = [
  { title: 'Phần', dataIndex: 'part', key: 'part', width: 120 },
  { title: 'Ký tự', dataIndex: 'character', key: 'character', width: 100 },
  { title: 'Ý nghĩa', dataIndex: 'meaning', key: 'meaning', width: 300 }
];

export const acrp102StructureData = [
  {
    key: '1',
    part: 'Loại thiết bị',
    character: 'AC',
    meaning: 'AC là tiền tố chung mà APC by Schneider Electric sử dụng cho các sản phẩm Điều hòa không khí (Air Conditioner).'
  },
  {
    key: '2',
    part: 'Dòng sản phẩm',
    character: 'R',
    meaning: 'R là viết tắt của "Row", chỉ ra rằng đây là thiết bị thuộc dòng InRow. Thiết kế "InRow" có nghĩa là điều hòa được đặt ngay trong hàng tủ rack, giúp làm mát tập trung và hiệu quả trực tiếp cho các thiết bị IT thay vì làm mát cả phòng.'
  },
  {
    key: '3',
    part: 'Product Line',
    character: 'P',
    meaning: 'P là ký tự định danh cho dòng sản phẩm RP (InRow RP). Chữ "P" là viết tắt của Precision (Chính xác), nhấn mạnh khả năng kiểm soát nhiệt độ và độ ẩm một cách chính xác của thiết bị.'
  },
  {
    key: '4',
    part: 'Model Number',
    character: '102',
    meaning: '102 là mã số cụ thể của model trong chuỗi sản phẩm'
  }
];

// Bảng dữ liệu lỗi thường gặp cho TDAV1321A
export const tdav1321aErrorColumns = [
  {
    title: 'STT',
    dataIndex: 'stt',
    key: 'stt',
    width: 60,
    align: 'center'
  },
  {
    title: 'Loại lỗi',
    dataIndex: 'loaiLoi',
    key: 'loaiLoi',
    width: 150
  },
  {
    title: 'Dấu hiệu / Cảnh báo',
    dataIndex: 'dauHieu',
    key: 'dauHieu',
    width: 200
  },
  {
    title: 'Nguyên nhân cụ thể',
    dataIndex: 'nguyenNhan',
    key: 'nguyenNhan',
    width: 200
  },
  {
    title: 'Cách kiểm tra',
    dataIndex: 'cachKiemTra',
    key: 'cachKiemTra',
    width: 200
  }
];

export const tdav1321aErrorData = [
  {
    key: '1',
    stt: '1',
    loaiLoi: 'Không khởi động được',
    dauHieu: 'Màn hình không sáng, máy không chạy',
    nguyenNhan: '- Mất nguồn điện\n- Aptomat chưa bật\n- Dây nguồn đứt',
    cachKiemTra: 'Kiểm tra nguồn cấp, aptomat, cầu chì'
  },
  {
    key: '2',
    stt: '2',
    loaiLoi: 'Báo lỗi áp suất gas',
    dauHieu: 'Mã lỗi HP/LP, áp suất cao/thấp',
    nguyenNhan: '- Thiếu gas / rò rỉ gas\n- Block hỏng\n- Tắc van tiết lưu',
    cachKiemTra: 'Đo áp suất gas, kiểm tra rò rỉ'
  },
  {
    key: '3',
    stt: '3',
    loaiLoi: 'Cảnh báo quạt dàn lạnh',
    dauHieu: 'Không có gió thổi ra, cảnh báo EC fan',
    nguyenNhan: '- Quạt hỏng\n- Bộ điều khiển quạt lỗi\n- Lỏng dây kết nối',
    cachKiemTra: 'Kiểm tra cấp nguồn và tín hiệu điều khiển'
  },
  {
    key: '4',
    stt: '4',
    loaiLoi: 'Lỗi bộ lọc khí (lọc bẩn)',
    dauHieu: 'Báo "Air Filter Dirty"',
    nguyenNhan: '- Tích bụi lâu ngày\n- Gió yếu, tăng tải máy nén',
    cachKiemTra: 'Kiểm tra trực tiếp bộ lọc, thay/làm sạch'
  },
  {
    key: '5',
    stt: '5',
    loaiLoi: 'Quá nhiệt dàn nóng',
    dauHieu: 'Báo lỗi nhiệt độ cao',
    nguyenNhan: '- Môi trường ngoài trời quá nóng\n- Dàn nóng đặt sai vị trí',
    cachKiemTra: 'Đo nhiệt độ môi trường, kiểm tra thông gió'
  },
  {
    key: '6',
    stt: '6',
    loaiLoi: 'Lỗi cảm biến nhiệt/ẩm',
    dauHieu: 'Giá trị đọc bị sai hoặc không hiển thị',
    nguyenNhan: '- Cảm biến hỏng\n- Dây tín hiệu đứt\n- Mất kết nối điều khiển',
    cachKiemTra: 'So sánh với nhiệt ẩm kế độc lập'
  },
  {
    key: '7',
    stt: '7',
    loaiLoi: 'Cảnh báo rò rỉ nước',
    dauHieu: 'Hệ thống NetBotz báo động Leak',
    nguyenNhan: '- Dây cảm biến ẩm ướt do rò\n- Ngưng tụ bất thường',
    cachKiemTra: 'Kiểm tra sàn dưới thiết bị, khay nước ngưng'
  },
  {
    key: '8',
    stt: '8',
    loaiLoi: 'Không đạt nhiệt độ/độ ẩm',
    dauHieu: 'Thông số chênh lệch lớn với cài đặt',
    nguyenNhan: '- Cảm biến sai\n- Dàn lạnh không đủ tải\n- Rò khí nóng',
    cachKiemTra: 'So sánh nhiệt ẩm kế, kiểm tra lưu lượng gió'
  },
  {
    key: '9',
    stt: '9',
    loaiLoi: 'Không chuyển sang dự phòng',
    dauHieu: 'Thiết bị phụ không hoạt động khi lỗi',
    nguyenNhan: '- Cài sai chế độ N+1\n- Thiết bị dự phòng bị lỗi',
    cachKiemTra: 'Kiểm tra cấu hình dự phòng, test chuyển đổi'
  }
];

// Bảng dữ liệu hạng mục bảo trì định kỳ cho TDAV1321A
export const tdav1321aMaintenanceScheduleColumns = [
  {
    title: 'STT',
    dataIndex: 'stt',
    key: 'stt',
    width: 60,
    align: 'center'
  },
  {
    title: 'Thành phần',
    dataIndex: 'thanhPhan',
    key: 'thanhPhan',
    width: 200
  },
  {
    title: 'Chu kỳ',
    dataIndex: 'chuKy',
    key: 'chuKy',
    width: 150,
    align: 'center'
  }
];

export const tdav1321aMaintenanceScheduleData = [
  { key: '1', stt: '1', thanhPhan: 'Bộ lọc khí (EU4)', chuKy: 'Hàng tháng' },
  { key: '2', stt: '2', thanhPhan: 'Dàn lạnh, dàn nóng', chuKy: '3 – 6 tháng' },
  { key: '3', stt: '3', thanhPhan: 'Quạt EC', chuKy: '3 – 6 tháng' },
  { key: '4', stt: '4', thanhPhan: 'Máy nén (Scroll)', chuKy: '6 – 12 tháng' },
  { key: '5', stt: '5', thanhPhan: 'Bộ sưởi', chuKy: '6 tháng' },
  { key: '6', stt: '6', thanhPhan: 'Hệ thống van tiết lưu điện tử (EEV)', chuKy: '6 –12 tháng' },
  { key: '7', stt: '7', thanhPhan: 'Hệ thống điều khiển', chuKy: '6 – 12 tháng' },
  { key: '8', stt: '8', thanhPhan: 'Cảm biến nhiệt độ, độ ẩm', chuKy: '3 – 6 tháng' },
  { key: '9', stt: '9', thanhPhan: 'Bộ phun ẩm (Humidifier)', chuKy: '6 – 12 tháng' },
  { key: '10', stt: '10', thanhPhan: 'Bộ sưởi điện (Electric heater)', chuKy: '6 – 12 tháng' },
  { key: '11', stt: '11', thanhPhan: 'Kiểm tra gas lạnh', chuKy: '6 – 12 tháng' },
  { key: '12', stt: '12', thanhPhan: 'Kiểm tra kết nối điện', chuKy: '6 tháng' },
  { key: '13', stt: '13', thanhPhan: 'Kiểm tra cảnh báo NetBotz (nếu dùng)', chuKy: '6 tháng' }
];

// Bảng dữ liệu bảo trì từng thành phần cho TDAV1321A
export const tdav1321aMaintenanceDetailColumns = [
  {
    title: 'STT',
    dataIndex: 'stt',
    key: 'stt',
    width: 60,
    align: 'center'
  },
  {
    title: 'Thành phần',
    dataIndex: 'thanhPhan',
    key: 'thanhPhan',
    width: 150
  },
  {
    title: 'Vị trí trên thiết bị',
    dataIndex: 'viTri',
    key: 'viTri',
    width: 180
  },
  {
    title: 'Chu kỳ bảo trì',
    dataIndex: 'chuKy',
    key: 'chuKy',
    width: 120,
    align: 'center'
  },
  {
    title: 'Nội dung bảo trì',
    dataIndex: 'noiDung',
    key: 'noiDung',
    width: 200
  },
  {
    title: 'Lưu ý kỹ thuật',
    dataIndex: 'luuY',
    key: 'luuY',
    width: 200
  }
];

export const tdav1321aMaintenanceDetailData = [
  {
    key: '1',
    stt: '1',
    thanhPhan: 'Bộ lọc khí EU4',
    viTri: 'Mặt trước dàn lạnh (khe hút gió)',
    chuKy: 'Hàng tháng',
    noiDung: '- Tháo bộ lọc ra vệ sinh (bụi bám)\n- Thay mới nếu biến dạng, thủng hoặc giảm lưu lượng\n- Làm sạch bằng khí nén hoặc nước áp lực thấp\n- Phơi khô hoàn toàn trước khi lắp lại',
    luuY: '- Phơi khô hoàn toàn trước khi lắp lại'
  },
  {
    key: '2',
    stt: '2',
    thanhPhan: 'Dàn trao đổi nhiệt (dàn lạnh)',
    viTri: 'Phía trong thiết bị, sau lớp lọc khí',
    chuKy: '3 – 6 tháng',
    noiDung: '- Vệ sinh cánh tản nhiệt nhôm\n- Kiểm tra oxy hóa ăn mòn',
    luuY: '- Dùng chổi mềm, nước hoặc hóa chất chuyên dụng, tránh làm cong cánh nhôm'
  },
  {
    key: '3',
    stt: '3',
    thanhPhan: 'Quạt EC dàn lạnh',
    viTri: 'Bên trong khoang gió đẩy, dưới nắp trên',
    chuKy: '3 – 6 tháng',
    noiDung: '- Kiểm tra độ ồn, độ rung\n- Làm sạch bụi cánh quạt',
    luuY: '- Không tháo bộ điều tốc khi không cần thiết\n- Tránh va đập vào động cơ quạt'
  },
  {
    key: '4',
    stt: '4',
    thanhPhan: 'Máy nén Scroll',
    viTri: 'Khoang kỹ thuật bên dưới (sau vách dưới thiết bị)',
    chuKy: '6 tháng – 12 tháng',
    noiDung: '- Đo dòng vận hành & khởi động\n- Kiểm tra độ rung, ống đồng, tiếng ồn bất thường',
    luuY: '- Đảm bảo cách ly điện trước khi kiểm tra\n- Không mở vỏ nén, tránh rò gas'
  },
  {
    key: '5',
    stt: '5',
    thanhPhan: 'Dàn nóng (condenser CAP)',
    viTri: 'Ngoài trời (gần thiết bị hoặc trên mái)',
    chuKy: '3 – 6 tháng',
    noiDung: '- Làm sạch cánh tản nhiệt\n- Kiểm tra quạt dàn nóng\n- Đảm bảo thông gió tốt',
    luuY: '- Tránh nước áp lực mạnh vào motor quạt\n- Kiểm tra chuột/rác cản trở thông gió'
  },
  {
    key: '6',
    stt: '6',
    thanhPhan: 'Van tiết lưu điện tử (EEV)',
    viTri: 'Trong đường ống gas, gần coil lạnh',
    chuKy: '6 tháng – 12 tháng',
    noiDung: '- Kiểm tra khả năng đóng/mở\n- Kiểm tra nhiệt độ trước và sau van',
    luuY: '- Không điều chỉnh bằng tay\n- Cần kỹ thuật viên có đồng hồ manifold để đo'
  },
  {
    key: '7',
    stt: '7',
    thanhPhan: 'Cảm biến nhiệt độ / độ ẩm',
    viTri: 'Gắn trên đường gió hồi và gió cấp',
    chuKy: '3 – 6 tháng',
    noiDung: '- Đo và đối chiếu sai số\n- Hiệu chuẩn nếu sai số vượt ngưỡng ±0.5°C, ±3% RH',
    luuY: '- Không tháo khi có điện\n- Dùng thiết bị hiệu chuẩn đúng tiêu chuẩn công nghiệp'
  },
  {
    key: '8',
    stt: '8',
    thanhPhan: 'Bộ sưởi điện (Electric heater)',
    viTri: 'Gắn sau dàn lạnh',
    chuKy: '6 tháng',
    noiDung: '- Kiểm tra điện trở cách điện\n- Kiểm tra relay điều khiển\n- Đảm bảo thiết bị không quá nhiệt',
    luuY: '- Có thể kiểm tra nhiệt độ bề mặt trong lúc hoạt động ngắn hạn'
  },
  {
    key: '9',
    stt: '9',
    thanhPhan: 'Bộ phun ẩm (Humidifier)',
    viTri: 'Dưới đáy dàn lạnh, gần khay nước ngưng',
    chuKy: '6 tháng – 12 tháng',
    noiDung: '- Kiểm tra vòi phun, bơm nước\n- Tẩy cặn canxi nếu dùng nước cứng\n- Kiểm tra điện trở bốc hơi',
    luuY: '- Dùng nước tinh khiết nếu có\n- Tắt hoàn toàn thiết bị trước khi tháo rửa'
  },
  {
    key: '10',
    stt: '10',
    thanhPhan: 'Khay nước ngưng và ống xả',
    viTri: 'Dưới đáy thiết bị',
    chuKy: 'Hàng tháng – 3 tháng',
    noiDung: '- Vệ sinh khay\n- Kiểm tra ống xả không nghẹt\n- Đảm bảo không tràn nước hoặc rò rỉ',
    luuY: '- Có thể đổ thêm dung dịch chống nấm mốc vào khay nếu phòng ẩm'
  },
  {
    key: '11',
    stt: '11',
    thanhPhan: 'Tủ điều khiển và màn hình',
    viTri: 'Phía trước thân máy',
    chuKy: '6 tháng – 12 tháng',
    noiDung: '- Kiểm tra màn hình, nút bấm\n- Cập nhật phần mềm nếu Schneider cung cấp\n- Kiểm tra giao tiếp Modbus/SNMP',
    luuY: '- Lưu lại log lỗi định kỳ\n- Backup cấu hình trước khi nâng cấp firmware'
  },
  {
    key: '12',
    stt: '12',
    thanhPhan: 'Hệ thống điện và tiếp địa',
    viTri: 'Cáp nguồn, tủ CB',
    chuKy: '6 tháng – 12 tháng',
    noiDung: '- Đo áp – dòng hoạt động\n- Siết lại đầu cos\n- Kiểm tra tiếp địa, rò rỉ điện',
    luuY: '- Cần kỹ thuật viên có đồng hồ đo cách điện / đo trở kháng đất'
  },
  {
    key: '13',
    stt: '13',
    thanhPhan: 'Cảnh báo & log lỗi',
    viTri: 'Menu điều khiển hoặc kết nối từ xa',
    chuKy: 'Hàng tuần',
    noiDung: '- Xem lại log alarm\n- Phân tích và khắc phục cảnh báo\n- Đánh giá hiệu suất thiết bị',
    luuY: '- Không xóa log nếu chưa lưu lại để đối chiếu\n- Đặt lịch xuất log tự động (nếu có phần mềm giám sát)'
  }
];
