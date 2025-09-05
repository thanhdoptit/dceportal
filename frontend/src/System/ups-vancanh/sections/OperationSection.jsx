import { Alert, Card, Col, Collapse, Divider, Row, Steps, Tag, Typography } from 'antd';
import React from 'react';
import '../../shared/styles/SystemSection.css';

const { Title, Paragraph, Text } = Typography;

const OperationSection = () => {
  const [currentStartupStep, setCurrentStartupStep] = React.useState(0);
  const [currentShutdownStep, setCurrentShutdownStep] = React.useState(0);
  const [currentParallelStep, setCurrentParallelStep] = React.useState(0);

  // Thông tin hệ thống thực tế tại datacenter
  const systemInfo = {
    title: 'HỆ THỐNG UPS GALAXY VL 500KVA - TTDL VÂN CANH',
    description: 'Hướng dẫn vận hành thực tế cho hệ thống UPS Galaxy VL 500kVA đang hoạt động tại Trung tâm Dữ liệu Vân Canh. Tài liệu này cung cấp các quy trình vận hành cụ thể và chi tiết cho hệ thống thực tế.',
    model: 'Galaxy VL 500kVA',
    location: 'Trung tâm Dữ liệu Vân Canh',
    configuration: 'Hệ thống song song với N+X redundancy',
    capacity: '500kVA',
    standard: 'IEC/UL Standards'
  };

  // Thông tin giao diện điều khiển từ tài liệu thực tế
  const controlInterfaceInfo = {
    title: 'Giao diện điều khiển UPS Galaxy VL 500KVA',
    description: 'Hệ thống UPS Galaxy VL được trang bị màn hình cảm ứng thông minh với các nút điều khiển chính:',
    features: [
      {
        name: 'Nút Home (A)',
        description: 'Chạm vào nút này trên màn hình bất kỳ để quay lại màn hình chính',
        icon: '🏠'
      },
      {
        name: 'Nút Menu chính (B)',
        description: 'Chạm vào nút này trên màn hình bất kỳ để truy cập các menu',
        icon: '📋'
      },
      {
        name: 'Nút Sơ đồ (C)',
        description: 'Chạm vào nút này trên màn hình bất kỳ để truy cập sơ đồ hệ thống',
        icon: '📊'
      },
      {
        name: 'Biểu tượng trạng thái báo động (D)',
        description: 'Chạm vào biểu tượng này để xem các cảnh báo trên UPS',
        icon: '⚠️'
      }
    ],
    note: 'Người dùng có thể chạm vào các trường đầu ra hoặc pin trên màn hình chính để chuyển trực tiếp đến các trang đo lường chi tiết.'
  };

  // Các chế độ hoạt động từ tài liệu thực tế
  const operationModes = [
    {
      title: 'Chế độ bình thường (Normal)',
      description: 'Trong hoạt động bình thường, UPS hỗ trợ tải với nguồn điện được cấp từ UPS',
      icon: '🟢',
      features: [
        'UPS hỗ trợ tải với nguồn điện ổn định',
        'Ắc quy được sạc liên tục',
        'Giám sát real-time các thông số',
        'Chuyển đổi tự động khi có sự cố'
      ]
    },
    {
      title: 'Chế độ ắc quy (Battery)',
      description: 'Nếu nguồn điện lưới không thành công, UPS sẽ chuyển sang hoạt động bằng ắc quy và hỗ trợ tải bằng nguồn điện ổn định từ ắc quy',
      icon: '🔋',
      features: [
        'Chuyển đổi tự động khi mất điện lưới',
        'Hỗ trợ tải bằng nguồn điện ổn định từ ắc quy',
        'Thời gian backup theo cấu hình ắc quy',
        'Cảnh báo thời gian backup còn lại'
      ]
    },
    {
      title: 'Chế độ Request Static Bypass',
      description: 'UPS có thể được chuyển sang hoạt động bypass tĩnh được yêu cầu sau một lệnh từ màn hình',
      icon: '⚡',
      features: [
        'Chuyển đổi theo yêu cầu từ màn hình',
        'Tải được cung cấp từ nguồn bypass',
        'Tự động chuyển về chế độ bình thường khi có lỗi',
        'Chuyển sang chế độ ắc quy khi mất điện bypass'
      ]
    },
    {
      title: 'Chế độ Forced Static Bypass',
      description: 'UPS hoạt động ở chế độ bypass cưỡng bức theo lệnh của UPS hoặc do người dùng đã nhấn nút TẮT biến tần',
      icon: '🔧',
      features: [
        'Chuyển đổi cưỡng bức khi cần thiết',
        'Tải được cung cấp từ nguồn BYPASS',
        'Bảo vệ tải khỏi mất điện',
        'Sử dụng khi có sự cố nghiêm trọng'
      ]
    },
    {
      title: 'Chế độ Maintenance Bypass',
      description: 'Khi đóng ngắt attomat Maintenance Bypass, UPS sẽ chuyển sang hoạt động ở chế độ Maintenance Bypass',
      icon: '🔌',
      features: [
        'Tải được cấp nguồn từ nguồn điện lưới',
        'Bảo trì và xử lý sự cố được thực hiện trên toàn bộ UPS',
        'Hoạt động trong quá trình vận hành Maintenance Bypass',
        'Sử dụng cho bảo trì định kỳ'
      ]
    }
  ];

  // Quy trình khởi động hệ thống đơn lẻ từ tài liệu thực tế
  const singleSystemStartup = [
    {
      title: 'Bước 1: Bật attomat đầu vào',
      description: 'ON attomat đầu vào và chờ 10 phút',
      details: 'Chờ 10 phút để hệ thống ổn định'
    },
    {
      title: 'Bước 2: Kiểm tra cảnh báo',
      description: 'Kiểm tra các cảnh báo trên UPS',
      details: 'Đảm bảo không có cảnh báo lỗi nghiêm trọng'
    },
    {
      title: 'Bước 3: Bật attomat ắc quy',
      description: 'ON attomat Acquy',
      details: 'Kích hoạt nguồn ắc quy'
    },
    {
      title: 'Bước 4: Truy cập Control',
      description: 'Từ màn hình chính, chọn Control',
      details: 'Nhập user: "admin", password: "admin"'
    },
    {
      title: 'Bước 5: Chọn Operation mode',
      description: 'Chọn Operation mode',
      details: 'Truy cập menu điều khiển hoạt động'
    },
    {
      title: 'Bước 6: Chuyển sang bypass',
      description: 'Chọn Transfer to bypass operation',
      details: 'Chuyển UPS sang chế độ bypass tạm thời'
    },
    {
      title: 'Bước 7: Xác nhận bypass',
      description: 'Chọn OK',
      details: 'Xác nhận thao tác chuyển đổi'
    },
    {
      title: 'Bước 8: Chọn Operation mode',
      description: 'Chọn Operation mode',
      details: 'Truy cập lại menu điều khiển'
    },
    {
      title: 'Bước 9: Chuyển về chế độ bình thường',
      description: 'Chọn Transfer to normal operation',
      details: 'Chuyển UPS về chế độ hoạt động bình thường'
    },
    {
      title: 'Bước 10: Xác nhận hoạt động',
      description: 'Chọn OK',
      details: 'Xác nhận thao tác chuyển đổi cuối cùng'
    }
  ];

  // Quy trình khởi động hệ thống song song từ tài liệu thực tế
  const parallelSystemStartup = [
    {
      title: 'Bước 1: ON attomat đầu vào',
      description: 'ON attomat đầu vào (chờ 10 phút)',
      details: 'Kích hoạt nguồn đầu vào cho UPS đầu tiên'
    },
    {
      title: 'Bước 2: Kiểm tra cảnh báo',
      description: 'Kiểm tra các cảnh báo trên UPS',
      details: 'Đảm bảo không có cảnh báo lỗi nghiêm trọng'
    },
    {
      title: 'Bước 3: ON attomat ắc quy',
      description: 'ON attomat Acquy',
      details: 'Kích hoạt nguồn ắc quy cho UPS đầu tiên'
    },
    {
      title: 'Bước 4: Truy cập Control',
      description: 'Từ màn hình chính, chọn Control',
      details: 'Nhập user: "admin", password: "admin"'
    },
    {
      title: 'Bước 5: Chọn Operation mode',
      description: 'Chọn Operation mode',
      details: 'Truy cập menu điều khiển hoạt động'
    },
    {
      title: 'Bước 6: Chuyển sang bypass',
      description: 'Chọn Transfer to bypass operation',
      details: 'Chuyển UPS sang chế độ bypass tạm thời'
    },
    {
      title: 'Bước 7: Xác nhận bypass',
      description: 'Chọn OK',
      details: 'Xác nhận thao tác chuyển đổi'
    },
    {
      title: 'Bước 8: Lặp lại cho UPS thứ 2',
      description: 'Lặp lại từ bước 1 đến bước 8 đối với UPS còn lại',
      details: 'Thực hiện cùng quy trình cho UPS thứ hai'
    },
    {
      title: 'Bước 9: Kiểm tra cảnh báo tổng thể',
      description: 'Kiểm tra lại cảnh báo trên UPS',
      details: 'UPS không có cảnh báo lỗi thực hiện bước tiếp theo'
    },
    {
      title: 'Bước 10: Bật attomat đầu ra',
      description: 'ON attomat đầu ra của 02 UPS',
      details: 'Kích hoạt nguồn đầu ra cho cả hai UPS'
    },
    {
      title: 'Bước 11: Chuyển về chế độ bình thường',
      description: 'Chọn Operation mode > Transfer to Normal > OK',
      details: 'Chuyển cả hệ thống về chế độ hoạt động bình thường'
    }
  ];

  // Quy trình tắt máy an toàn từ tài liệu thực tế
  const shutdownProcedure = [
    {
      title: 'Bước 1: Truy cập Control',
      description: 'Từ màn hình chính, chọn Control',
      details: 'Nhập user: "admin", password: "admin"'
    },
    {
      title: 'Bước 2: Chọn INVERTER',
      description: 'Chọn INVERTER',
      details: 'Truy cập menu điều khiển biến tần'
    },
    {
      title: 'Bước 3: Tắt INVERTER',
      description: 'Chọn INVERTER OFF',
      details: 'Tắt biến tần UPS'
    },
    {
      title: 'Bước 4: Xác nhận tắt',
      description: 'Chọn OK',
      details: 'Xác nhận thao tác tắt biến tần'
    }
  ];

  // Thiết bị bảo vệ cá nhân được khuyến nghị (PPE)
  const ppeRequirements = [
    {
      item: 'Quần áo bằng cotton không bắt lửa',
      description: 'Bảo vệ chống cháy nổ',
      importance: 'high'
    },
    {
      item: 'Bảo vệ mắt (kính hoặc kính bảo hộ)',
      description: 'Bảo vệ mắt khỏi hồ quang điện',
      importance: 'high'
    },
    {
      item: 'Giày an toàn',
      description: 'Bảo vệ chân và cách điện',
      importance: 'high'
    },
    {
      item: 'Thiết bị bảo vệ cá nhân được khuyến nghị bởi khách hàng',
      description: 'Theo yêu cầu cụ thể của từng công ty',
      importance: 'medium'
    }
  ];

  // Quy trình bảo trì từ tài liệu thực tế
  const maintenanceProcedures = [
    {
      title: 'Thiết bị bảo vệ cá nhân được khuyến nghị (PPE)',
      description: 'Đối với tất cả các quy trình mở cửa trước ngoài cùng của thiết bị, Schneider Electric khuyến nghị tối thiểu các thiết bị bảo vệ cá nhân (PPE) sau đây:',
      isPPE: true,
      steps: ppeRequirements.map(item => item.item),
      warning: 'NGUY CƠ THƯƠNG TÍCH CÁ NHÂN - Luôn thực hiện đánh giá rủi ro trước khi vận hành hoặc bảo trì thiết bị này. Sử dụng thiết bị bảo vệ cá nhân phù hợp.'
    },
    {
      title: 'Thay thế bộ lọc không khí (GVLOPT001)',
      description: 'Quy trình thay thế bộ lọc không khí định kỳ',
      steps: [
        'Mở cửa trước',
        'Tháo ba giá đỡ ngang',
        'Tháo bộ lọc khí cũ và lắp bộ lọc khí mới',
        'Lắp lại ba giá đỡ ngang',
        'Đóng cửa trước'
      ]
    },
    {
      title: 'Thay thế, lắp đặt bổ sung module nguồn',
      description: 'Quy trình thay thế hoặc bổ sung module nguồn',
      dangerWarning: 'NGUY CƠ SỐC ĐIỆN, NỔ HOẶC CHÁY HỒ QUANG - Kiểm tra xem UPS có nhãn Live Swap không. Nếu không có nhãn Live Swap trên UPS thì phải chuyển UPS sang chế độ bảo trì bỏ qua hoặc tắt UPS trước khi có thể lắp hoặc tháo mô-đun nguồn.',
      cautionWarning: 'NGUY CƠ THIẾT BỊ HƯ HỎNG - Bảo quản các mô-đun nguồn ở nhiệt độ môi trường từ -15 đến 40 °C (5 đến 104 °F), độ ẩm 10-80%.',
      heavyWarning: 'TẢI NẶNG - Các mô-đun nguồn rất nặng (38 kg (83,77 lbs)) và cần hai người để nâng.',
      overloadWarning: 'NGUY CƠ QUÁ TẢI LẮP ĐẶT - Kiểm tra và xác minh rằng lắp đặt có kích thước chính xác để tăng định mức công suất trước khi lắp thêm mô-đun nguồn vào UPS.',
      dropLoadWarning: 'NGUY CƠ RƠI TẢI - Kiểm tra và xác minh rằng các mô-đun nguồn còn lại có thể chịu được tải trước khi tháo mô-đun nguồn ra khỏi UPS.',
      steps: [
        'Để tháo mô-đun nguồn đã lắp đặt: Tháo các vít ở trên cùng và dưới cùng của mô-đun nguồn và đẩy công tắc mở khóa',
        'Kéo mô-đun nguồn ra một nửa. Cơ chế khóa ngăn chặn mô-đun nguồn không bị kéo ra ngoài hoàn toàn',
        'Nhả khóa bằng cách nhấn nút nhả ở phía trên của nguồn điện mô-đun và tháo mô-đun nguồn',
        'Nếu không lắp đặt mô-đun nguồn thay thế: Lắp đặt tấm đệm vào phía trước khe cắm mô-đun nguồn trống',
        'Để lắp đặt mô-đun nguồn mới: Nếu đây là mô-đun nguồn bổ sung đang được lắp đặt: Tháo tấm đệm ra khỏi khe cắm mô-đun nguồn trống',
        'Đẩy mô-đun nguồn vào khe. Cơ chế kích hoạt sẽ chốt khi mô-đun nguồn được lắp đúng cách',
        'Lắp các vít được cung cấp vào phía trên và phía dưới của nguồn điện mô-đun'
      ]
    }
  ];

  // Biểu tượng cảnh báo an toàn từ tài liệu thực tế
  const safetySymbols = [
    {
      symbol: '⚡',
      meaning: 'Nguy hiểm về điện',
      action: 'Tuân thủ nghiêm ngặt các hướng dẫn an toàn',
      color: 'red'
    },
    {
      symbol: '⚠️',
      meaning: 'Cảnh báo về tiềm năng nguy cơ thương tích cá nhân',
      action: 'Tuân theo tất cả các thông báo an toàn',
      color: 'orange'
    },
    {
      symbol: '🚨',
      meaning: 'DANGER - Tình huống nguy hiểm có thể dẫn đến tử vong',
      action: 'Tuân thủ nghiêm ngặt các hướng dẫn',
      color: 'red'
    },
    {
      symbol: '⚠️',
      meaning: 'CẢNH BÁO - Có thể dẫn đến thương tích nghiêm trọng',
      action: 'Tuân theo hướng dẫn để tránh thương tích',
      color: 'orange'
    },
    {
      symbol: '🔶',
      meaning: 'THẬN TRỌNG - Có thể dẫn đến thương tích nhẹ',
      action: 'Thực hiện cẩn thận theo hướng dẫn',
      color: 'yellow'
    },
    {
      symbol: 'ℹ️',
      meaning: 'THÔNG BÁO - Không liên quan đến chấn thương thể chất',
      action: 'Tuân theo để tránh hư hỏng thiết bị',
      color: 'blue'
    }
  ];

  // Trạng thái LED từ tài liệu thực tế
  const ledStatus = [
    {
      status: 'Đèn LED xanh',
      meaning: 'Chức năng đang hoạt động',
      color: 'green'
    },
    {
      status: 'Đèn LED tắt',
      meaning: 'Chức năng không hoạt động',
      color: 'gray'
    },
    {
      status: 'Đèn LED màu đỏ',
      meaning: 'Chức năng không hoạt động được hoặc trong tình trạng báo động',
      color: 'red'
    }
  ];

  // Trạng thái LED theo từng chế độ hoạt động
  const ledOperationModes = [
    {
      mode: 'UPS hoạt động ở chế độ NORMAL',
      description: 'Chế độ hoạt động bình thường của UPS'
    },
    {
      mode: 'UPS hoạt động ở chế độ ắc quy (hệ thống có đường cấp nguồn bypass riêng biệt)',
      description: 'UPS sử dụng nguồn ắc quy với bypass riêng biệt'
    },
    {
      mode: 'UPS hoạt động ở chế độ ắc quy (hệ thống không có đường cấp nguồn bypass riêng biệt)',
      description: 'UPS sử dụng nguồn ắc quy không có bypass riêng biệt'
    },
    {
      mode: 'UPS hoạt động ở các chế độ: Requested static bypass operation (Chế độ bypass được yêu cầu) / Forced static bypass operation (Chế độ bypass cưỡng chế)',
      description: 'Các chế độ bypass được yêu cầu hoặc cưỡng bức'
    },
    {
      mode: 'UPS ở chế độ OFF',
      description: 'UPS đã được tắt'
    },
    {
      mode: 'UPS hoạt động ở chế độ Static Bypass (Bypass tĩnh)',
      description: 'UPS hoạt động ở chế độ bypass tĩnh'
    }
  ];

  // Biểu tượng trạng thái báo động từ tài liệu thực tế
  const alertStatus = [
    {
      color: 'Màu xanh lá cây',
      meaning: 'UPS không có cảnh báo lỗi',
      action: 'Hệ thống hoạt động bình thường'
    },
    {
      color: 'Màu xanh lam',
      meaning: 'Có cảnh báo thông tin trong hệ thống UPS',
      action: 'Nhấn vào biểu tượng trạng thái báo thức để xem các cảnh báo'
    },
    {
      color: 'Màu vàng',
      meaning: 'Có báo động cảnh báo trong hệ thống UPS',
      action: 'Nhấn vào biểu tượng trạng thái báo thức để xem các báo động'
    },
    {
      color: 'Màu đỏ',
      meaning: 'Có cảnh báo quan trọng trong hệ thống UPS',
      action: 'Chạm vào biểu tượng cảnh báo để xem các cảnh báo quan trọng'
    }
  ];

  // Quy trình xử lý sự cố từ tài liệu thực tế
  const troubleshootingProcedures = [
    {
      title: 'Xuất báo logfile UPS ra USB',
      description: 'Quy trình xuất dữ liệu log để phân tích sự cố',
      steps: [
        'Chọn Maintenance > UPS report',
        'Mở cửa trước',
        'Cắm thiết bị USB vào cổng USB trên bộ điều khiển cấp hệ thống',
        'Chọn Export',
        'Không tháo thiết bị USB cho đến khi quá trình xuất dữ liệu hoàn tất',
        'Gửi báo cáo UPS tới bộ phận hỗ trợ khách hàng của Schneider Electric'
      ]
    },
    {
      title: 'Kiểm tra các cảnh báo trên UPS',
      description: 'Quy trình kiểm tra và xử lý cảnh báo',
      steps: [
        'Chạm vào các biểu tượng trạng thái cảnh báo trên màn hình UPS',
        'Kiểm tra loại cảnh báo (thông tin, cảnh báo, quan trọng)',
        'Ghi lại mã lỗi và mô tả sự cố',
        'Thực hiện các bước khắc phục theo hướng dẫn',
        'Liên hệ hỗ trợ kỹ thuật nếu cần thiết'
      ]
    }
  ];

  return (
    <div className="content-section">
      {/* 5.1 Vận hành UPS Galaxy 500KVA Vân Canh */}
      <div id="section-5-1" className="subsection">
        <Title level={3}>
          5.1. Vận hành UPS Galaxy 500KVA Vân Canh
        </Title>
      
        {/* 5.1.1 Hướng dẫn an toàn */}
        <div id="5.1.1" className="subsection">
          <Title level={4}>
            5.1.1. Hướng dẫn an toàn
          </Title>
          <Card title="Hướng dẫn an toàn" style={{ marginBottom: '16px' }}>
            <Alert
              message="Yêu cầu về trình độ nhân viên"
              description="Thiết bị điện chỉ nên được lắp đặt, vận hành, bảo dưỡng và bảo trì bởi nhân viên có trình độ. Người có trình độ là người có kỹ năng và kiến thức liên quan đến việc xây dựng, lắp đặt và vận hành thiết bị điện và đã được đào tạo về an toàn để nhận biết và tránh những nguy cơ liên quan."
              type="warning"
              showIcon
              style={{ marginBottom: '16px' }}
            />
            <Alert
              message="Trách nhiệm"
              description="Schneider Electric không chịu trách nhiệm cho bất kỳ hậu quả phát sinh từ việc sử dụng vật liệu này. Người vận hành phải tuân thủ nghiêm ngặt các hướng dẫn an toàn."
              type="info"
              showIcon
              style={{ marginBottom: '16px' }}
            />
            <Alert
              message="An toàn điện"
              description="NGUY HIỂM CỦA SỐC ĐIỆN, NỔ, HOẶC SỐC ARC: Chờ ít nhất 5 phút trước khi tháo nắp UPS sau khi màn hình đã tắt để cho phép các tụ điện phóng điện hoàn toàn. Luôn đo điện áp nguy hiểm trên tất cả các thiết bị đầu cuối trước khi làm việc bộ lưu điện."
              type="error"
              showIcon
              style={{ marginBottom: '16px' }}
            />
            
            <Title level={5}>
              Biểu tượng cảnh báo an toàn
            </Title>
            <Paragraph>
              Các biểu tượng cảnh báo an toàn xuất hiện xuyên suốt tài liệu để cảnh báo về các nguy cơ tiềm ẩn:
            </Paragraph>
            <Row gutter={[16, 16]}>
              {safetySymbols.map((symbol, index) => (
                <Col xs={24} sm={12} key={index}>
                  <Card 
                    size="small" 
                    style={{ 
                      height: '100%',
                      borderLeft: `4px solid ${symbol.color === 'red' ? '#ff4d4f' : 
                                       symbol.color === 'orange' ? '#fa8c16' : 
                                       symbol.color === 'yellow' ? '#faad14' : '#1890ff'}`
                    }}
                  >
                    <Text strong style={{ color: symbol.color === 'red' ? '#ff4d4f' : 
                                       symbol.color === 'orange' ? '#fa8c16' : 
                                       symbol.color === 'yellow' ? '#faad14' : '#1890ff' }}>
                      {symbol.symbol}
                    </Text>
                    <br />
                    <Text type="secondary">{symbol.meaning}</Text>
                    <br />
                    <Text strong>Hành động: {symbol.action}</Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </div>

        {/* 5.1.2 Tổng quan hệ thống */}
        <div id="5.1.2" className="subsection">
          <Title level={4}>
            5.1.2. Tổng quan hệ thống
          </Title>
          
          <Card title={systemInfo.title} style={{ marginBottom: '16px' }}>
            <Alert
              message="Hệ thống thực tế tại datacenter"
              description="Đây là hướng dẫn vận hành cụ thể cho hệ thống UPS Galaxy VL 500kVA đang hoạt động tại Trung tâm Dữ liệu Vân Canh."
              type="success"
              showIcon
              style={{ marginBottom: '16px' }}
            />
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Text strong>Model:</Text> <Tag color="blue">{systemInfo.model}</Tag>
              </Col>
              <Col xs={24} sm={12}>
                <Text strong>Vị trí:</Text> <Tag color="green">{systemInfo.location}</Tag>
              </Col>
              <Col xs={24} sm={12}>
                <Text strong>Cấu hình:</Text> <Tag color="orange">{systemInfo.configuration}</Tag>
              </Col>
              <Col xs={24} sm={12}>
                <Text strong>Công suất:</Text> <Tag color="red">{systemInfo.capacity}</Tag>
              </Col>
            </Row>
            <Divider />
            <Paragraph>{systemInfo.description}</Paragraph>
          </Card>

          {/* Giao diện điều khiển */}
        <div id="5.1.2" className="subsection">
          <Title level={4}>
            5.1.2. Giao diện điều khiển
          </Title>
          <Card title={controlInterfaceInfo.title} style={{ marginBottom: '16px' }}>
            <Paragraph>{controlInterfaceInfo.description}</Paragraph>
        <Row gutter={[16, 16]}>
              {controlInterfaceInfo.features.map((feature, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <Card size="small" style={{ height: '100%', textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>{feature.icon}</div>
                    <Text strong>{feature.name}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>{feature.description}</Text>
                  </Card>
                </Col>
              ))}
            </Row>
            <Divider />
            <Text type="secondary">{controlInterfaceInfo.note}</Text>
          </Card>
                  </div>

          {/* Các chế độ hoạt động của hệ thống */}
          <Title level={5}>
            Các chế độ hoạt động của hệ thống
          </Title>
          <Card title="Các chế độ hoạt động của hệ thống" style={{ marginBottom: '16px' }}>
            <Row gutter={[16, 16]}>
              {operationModes.map((mode, index) => (
                <Col xs={24} lg={12} key={index}>
                  <Card 
                    size="small" 
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '20px' }}>{mode.icon}</span>
                        {mode.title}
                  </div>
                    }
                    style={{ height: '100%' }}
                  >
                    <Paragraph>{mode.description}</Paragraph>
                    <Text strong>Đặc điểm:</Text>
                    <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                      {mode.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
        </div>

        {/* 5.1.3 Quy trình vận hành */}
        <div id="5.1.3" className="subsection">
          <Title level={4}>
            5.1.3. Quy trình vận hành
          </Title>
          
          {/* Quy trình khởi động hệ thống đơn lẻ */}
          <Title level={5}>
            Quy trình khởi động hệ thống đơn lẻ
          </Title>
          <Card title="Quy trình khởi động hệ thống đơn lẻ" style={{ marginBottom: '16px' }}>
            <Alert
              message="Lưu ý quan trọng"
              description="Tuân thủ đúng thứ tự các bước để đảm bảo an toàn và hoạt động ổn định của hệ thống."
              type="info"
              showIcon
              style={{ marginBottom: '16px' }}
            />
            <Steps
              current={currentStartupStep}
              onChange={setCurrentStartupStep}
              direction="vertical"
              size="small"
            >
              {singleSystemStartup.map((step, index) => (
                <Steps.Step
                  key={index}
                  title={step.title}
                  description={step.description}
                  subTitle={
                    <div style={{ marginTop: '8px' }}>
                      <Text type="secondary">{step.details}</Text>
                    </div>
                  }
                />
              ))}
            </Steps>
          </Card>
          
          {/* Quy trình tắt máy an toàn */}
          <Title level={5}>
            Quy trình tắt máy an toàn
          </Title>
          <Card title="Quy trình khởi động hệ thống song song" style={{ marginBottom: '16px' }}>
            <Alert
              message="Hệ thống song song"
              description="Hệ thống UPS song song tại TTDL Vân Canh với khả năng N+X redundancy."
              type="warning"
              showIcon
              style={{ marginBottom: '16px' }}
            />
            <Steps
              current={currentParallelStep}
              onChange={setCurrentParallelStep}
              direction="vertical"
              size="small"
            >
              {parallelSystemStartup.map((step, index) => (
                <Steps.Step
                  key={index}
                  title={step.title}
                  description={step.description}
                  subTitle={
                    <div style={{ marginTop: '8px' }}>
                      <Text type="secondary">{step.details}</Text>
                    </div>
                  }
                />
              ))}
            </Steps>
          </Card>
          <Card title="Quy trình tắt máy an toàn" style={{ marginBottom: '16px' }}>
            <Alert
              message="CẢNH BÁO QUAN TRỌNG"
              description="Tắt inverter sẽ tắt nguồn cung cấp cho tải. Đảm bảo tải đã được chuyển về nguồn khác trước khi thực hiện."
              type="error"
              showIcon
              style={{ marginBottom: '16px' }}
            />
              <Steps
                current={currentShutdownStep}
                onChange={setCurrentShutdownStep}
                direction="vertical"
                size="small"
            >
              {shutdownProcedure.map((step, index) => (
                <Steps.Step
                  key={index}
                  title={step.title}
                  description={step.description}
                  subTitle={
                    <div style={{ marginTop: '8px' }}>
                      <Text type="secondary">{step.details}</Text>
                    </div>
                  }
                />
              ))}
            </Steps>
          </Card>
          
          {/* Các thao tác chuyển đổi chế độ */}
          <Title level={5}>
            Các thao tác chuyển đổi chế độ
          </Title>
          <Card title="Chuyển UPS từ chế độ bình thường sang chế độ static bypass" style={{ marginBottom: '16px' }}>
            <Steps direction="vertical" size="small">
              <Steps.Step title="Bước 1: Truy cập Control" description="Từ màn hình chính, chọn Control" />
              <Steps.Step title="Bước 2: Đăng nhập" description='Nhập user: "admin", password: "admin"' />
              <Steps.Step title="Bước 3: Chọn Operation mode" description="Chọn Operation mode" />
              <Steps.Step title="Bước 4: Chuyển sang bypass" description="Chọn Transfer to bypass operation" />
              <Steps.Step title="Bước 5: Xác nhận" description="Chọn OK" />
            </Steps>
          </Card>

          <Card title="Chuyển UPS từ chế độ static bypass sang chế độ hoạt động bình thường" style={{ marginBottom: '16px' }}>
            <Steps direction="vertical" size="small">
              <Steps.Step title="Bước 1: Truy cập Control" description="Từ màn hình chính, chọn Control" />
              <Steps.Step title="Bước 2: Đăng nhập" description='Nhập user: "admin", password: "admin"' />
              <Steps.Step title="Bước 3: Chọn Operation mode" description="Chọn Operation mode" />
              <Steps.Step title="Bước 4: Chuyển về normal" description="Chọn Transfer to normal operation" />
              <Steps.Step title="Bước 5: Xác nhận" description="Chọn OK" />
            </Steps>
          </Card>

          {/* Điều khiển Inverter */}
          <Title level={5}>
            Điều khiển Inverter
          </Title>
          <Card title="Tắt INVERTER" style={{ marginBottom: '16px' }}>
            <Alert
              message="QUAN TRỌNG"
              description="Điều này sẽ tắt nguồn cung cấp cho tải."
              type="error"
              showIcon
              style={{ marginBottom: '16px' }}
            />
            <Steps direction="vertical" size="small">
              <Steps.Step title="Bước 1: Truy cập Control" description="Từ màn hình chính, chọn Control" />
              <Steps.Step title="Bước 2: Đăng nhập" description='Nhập user: "admin", password: "admin"' />
              <Steps.Step title="Bước 3: Chọn INVERTER" description="Chọn INVERTER" />
              <Steps.Step title="Bước 4: Tắt Inverter" description="Chọn INVERTER OFF" />
              <Steps.Step title="Bước 5: Xác nhận" description="Chọn OK" />
            </Steps>
          </Card>

          <Card title="Bật INVERTER" style={{ marginBottom: '16px' }}>
            <Steps direction="vertical" size="small">
              <Steps.Step title="Bước 1: Truy cập Control" description="Từ màn hình chính, chọn Control" />
              <Steps.Step title="Bước 2: Đăng nhập" description='Nhập user: "admin", password: "admin"' />
              <Steps.Step title="Bước 3: Chọn INVERTER" description="Chọn INVERTER" />
              <Steps.Step title="Bước 4: Bật Inverter" description="Chọn INVERTER ON" />
              <Steps.Step title="Bước 5: Xác nhận" description="Chọn OK" />
            </Steps>
          </Card>

          {/* Quy trình Maintenance Bypass cho hệ thống đơn lẻ */}
          <Title level={5}>
            Chuyển UPS từ chế độ bình thường sang Maintenance Bypass
          </Title>
          <Card title="Chuyển sang chế độ Maintenance Bypass" style={{ marginBottom: '16px' }}>
            <Alert
              message="NGUY HIỂM CỦA SỐC ĐIỆN, NỔ, HOẶC SỐC ARC"
              description="Chờ ít nhất 5 phút trước khi tháo nắp UPS sau khi màn hình đã tắt để cho phép các tụ điện phóng điện hoàn toàn. Luôn đo điện áp nguy hiểm trên tất cả các thiết bị đầu cuối trước khi làm việc bộ lưu điện."
              type="error"
              showIcon
              style={{ marginBottom: '16px' }}
            />
            <Steps direction="vertical" size="small">
              <Steps.Step title="Bước 1-5: Chuyển bypass" description="Control > Operation mode > Transfer to bypass operation > OK" />
              <Steps.Step title="Bước 6: ON attomat MBB" description="ON attomat MBB" />
            </Steps>
          </Card>

          <Card title="Chuyển UPS từ chế độ Maintenance Bypass sang hoạt động bình thường" style={{ marginBottom: '16px' }}>
            <Steps direction="vertical" size="small">
              <Steps.Step title="Bước 1-5: Chuyển bypass" description="Control > Operation mode > Transfer to bypass operation > OK" />
              <Steps.Step title="Bước 6: OFF attomat MBB" description="OFF attomat MBB" />
              <Steps.Step title="Bước 7: Truy cập Control" description="Từ màn hình chính, chọn Control" />
              <Steps.Step title="Bước 8: Chuyển về normal" description="Chọn Transfer to normal operation" />
              <Steps.Step title="Bước 9: Xác nhận" description="Chọn OK" />
            </Steps>
          </Card>

          <Card title="Bật UPS từ chế độ Maintenance Bypass" style={{ marginBottom: '16px' }}>
            <Steps direction="vertical" size="small">
              <Steps.Step title="Bước 1: ON attomat đầu vào" description="ON attomat đầu vào (chờ 10 phút)" />
              <Steps.Step title="Bước 2: Kiểm tra cảnh báo" description="Kiểm tra các cảnh báo trên UPS" />
              <Steps.Step title="Bước 3: ON attomat Acquy" description="ON attomat Acquy" />
              <Steps.Step title="Bước 4: Kiểm tra tủ ắc quy" description="Kiểm tra trạng thái hoạt động, và các cảnh báo trên tủ ắc quy" />
              <Steps.Step title="Bước 5-10: Chuyển bypass" description="Control > Operation mode > Transfer to bypass operation > OK" />
              <Steps.Step title="Bước 11: OFF attomat MBB" description="OFF attomat MBB" />
              <Steps.Step title="Bước 12-14: Chuyển về normal" description="Control > Operation mode > Transfer to normal operation" />
              <Steps.Step title="Bước 15: Xác nhận" description="Chọn OK" />
            </Steps>
          </Card>
        </div>

        {/* 5.1.4 Xử lý sự cố */}
        <div id="5.1.4" className="subsection">
          <Title level={4}>
            5.1.4. Xử lý sự cố
          </Title>
          
          {/* Trạng thái LED */}
          <Title level={5}>
            Trạng thái LED và ý nghĩa
          </Title>
          <Card title="Trạng thái LED và ý nghĩa" style={{ marginBottom: '16px' }}>
            <Paragraph>
              Nếu màn hình không hoạt động, bạn có thể xem chế độ hoạt động của UPS thông qua các đèn LED trạng thái phía sau bảng điều khiển phía trước.
            </Paragraph>
        <Row gutter={[16, 16]}>
              {ledStatus.map((status, index) => (
                <Col xs={24} sm={8} key={index}>
                  <Card size="small" style={{ textAlign: 'center' }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor: status.color === 'green' ? '#52c41a' : 
                                     status.color === 'red' ? '#ff4d4f' : '#d9d9d9',
                      margin: '0 auto 8px auto'
                    }} />
                    <Text strong>{status.status}</Text>
                    <br />
                    <Text type="secondary">{status.meaning}</Text>
              </Card>
            </Col>
          ))}
        </Row>
          
          <Title level={5}>
            Trạng thái LED theo từng chế độ hoạt động
          </Title>
          <Card size="small" style={{ marginBottom: '16px' }}>
            {ledOperationModes.map((mode, index) => (
              <div key={index} style={{ marginBottom: '8px', padding: '8px', backgroundColor: '#f6f6f6', borderRadius: '4px' }}>
                <Text strong style={{ fontSize: '13px' }}>{mode.mode}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>{mode.description}</Text>
              </div>
            ))}
          </Card>
          </Card>
          
          {/* Biểu tượng trạng thái báo động */}
          <Title level={5}>
            Biểu tượng trạng thái báo động
          </Title>
          <Card title="Biểu tượng trạng thái báo động" style={{ marginBottom: '16px' }}>
            <Paragraph>
              Chạm vào các biểu tượng trạng thái cảnh báo trên màn hình UPS để kiểm tra các cảnh báo:
            </Paragraph>
        <Row gutter={[16, 16]}>
              {alertStatus.map((alert, index) => (
                <Col xs={24} sm={12} key={index}>
                  <Card size="small" style={{ height: '100%' }}>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: alert.color === 'Màu xanh lá cây' ? '#52c41a' : 
                                     alert.color === 'Màu xanh lam' ? '#1890ff' : 
                                     alert.color === 'Màu vàng' ? '#faad14' : '#ff4d4f',
                      marginBottom: '8px'
                    }} />
                    <Text strong>{alert.color}</Text>
                    <br />
                    <Text type="secondary">{alert.meaning}</Text>
                    <br />
                    <Text strong>Hành động: {alert.action}</Text>
            </Card>
          </Col>
              ))}
        </Row>
          </Card>
          
          {/* Quy trình xử lý sự cố */}
          <Title level={5}>
            Quy trình xử lý sự cố
          </Title>
          <Card title="Quy trình xử lý sự cố" style={{ marginBottom: '16px' }}>
            <Collapse 
              defaultActiveKey={['0']}
              items={troubleshootingProcedures.map((procedure, index) => ({
                key: index.toString(),
                label: procedure.title,
                children: (
                  <>
                    <Paragraph>{procedure.description}</Paragraph>
                    <Text strong>Các bước thực hiện:</Text>
                    <ol style={{ margin: '8px 0', paddingLeft: '20px' }}>
                      {procedure.steps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </>
                )
              }))}
            />
          </Card>
          
          {/* Hướng dẫn bảo trì */}
          <Title level={5}>
            Hướng dẫn bảo trì
          </Title>
          <Card title="Hướng dẫn bảo trì" style={{ marginBottom: '16px' }}>
            <Collapse 
              defaultActiveKey={['0']}
              items={maintenanceProcedures.map((procedure, index) => ({
                key: index.toString(),
                label: procedure.title,
                children: (
                  <>
                    <Paragraph>{procedure.description}</Paragraph>
                    
                    {/* PPE Requirements */}
                    {procedure.isPPE && (
                      <>
                        <Alert
                          message="THẬN TRỌNG"
                          description={procedure.warning}
                          type="warning"
                          showIcon
                          style={{ marginBottom: '16px' }}
                        />
                        <Row gutter={[16, 16]}>
                          {ppeRequirements.map((item, i) => (
                            <Col xs={24} sm={12} key={i}>
                              <Card size="small" style={{ height: '100%' }}>
                                <Text strong style={{ color: item.importance === 'high' ? '#fa541c' : '#1890ff' }}>
                                  • {item.item}
                                </Text>
                                <br />
                                <Text type="secondary" style={{ fontSize: '12px' }}>{item.description}</Text>
                              </Card>
                            </Col>
                          ))}
                        </Row>
                      </>
                    )}
                    
                    {/* Safety Warnings for Power Module */}
                    {procedure.dangerWarning && (
                      <Alert
                        message="SỰ NGUY HIỂM"
                        description={procedure.dangerWarning}
                        type="error"
                        showIcon
                        style={{ marginBottom: '8px' }}
                      />
                    )}
                    {procedure.cautionWarning && (
                      <Alert
                        message="CẢNH BÁO"
                        description={procedure.cautionWarning}
                        type="warning"
                        showIcon
                        style={{ marginBottom: '8px' }}
                      />
                    )}
                    {procedure.heavyWarning && (
                      <Alert
                        message="THẬN TRỌNG"
                        description={procedure.heavyWarning}
                        type="warning"
                        showIcon
                        style={{ marginBottom: '8px' }}
                      />
                    )}
                    {procedure.overloadWarning && (
                      <Alert
                        message="ĐỂ Ý"
                        description={procedure.overloadWarning}
                        type="info"
                        showIcon
                        style={{ marginBottom: '8px' }}
                      />
                    )}
                    {procedure.dropLoadWarning && (
                      <Alert
                        message="ĐỂ Ý"
                        description={procedure.dropLoadWarning}
                        type="info"
                        showIcon
                        style={{ marginBottom: '16px' }}
                      />
                    )}
                    
                    {/* Steps */}
                    {!procedure.isPPE && (
                      <>
                        <Text strong>Các bước thực hiện:</Text>
                        <ol style={{ margin: '8px 0', paddingLeft: '20px' }}>
                          {procedure.steps.map((step, i) => (
                            <li key={i} style={{ marginBottom: '4px' }}>{step}</li>
                          ))}
                        </ol>
                      </>
                    )}
                  </>
                )
              }))}
            />
          </Card>
        </div>
        
        {/* 5.2 Vận hành hệ thống UPS song song */}
        <div id="section-5-2" className="subsection">
          <Title level={4}>
            5.2. Vận hành hệ thống UPS song song
          </Title>
          
          {/* 5.2.1 Quy trình khởi động hệ thống song song */}
          <div id="5.2.1" className="subsection">
            <Title level={5}>
              5.2.1. Quy trình khởi động hệ thống song song
            </Title>
          <Card title="Quy trình khởi động hệ thống song song" style={{ marginBottom: '16px' }}>
            <Alert
              message="Hệ thống song song"
              description="Hệ thống UPS song song tại TTDL Vân Canh với khả năng N+X redundancy."
              type="warning"
              showIcon
              style={{ marginBottom: '16px' }}
            />
            <Steps
              current={currentParallelStep}
              onChange={setCurrentParallelStep}
              direction="vertical"
              size="small"
            >
              {parallelSystemStartup.map((step, index) => (
                <Steps.Step
                  key={index}
                  title={step.title}
                  description={step.description}
                  subTitle={
                    <div style={{ marginTop: '8px' }}>
                      <Text type="secondary">{step.details}</Text>
                    </div>
                  }
                />
              ))}
            </Steps>
          </Card>
          </div>

          {/* 5.2.2 Tắt UPS ở chế độ Maintenance Bypass */}
          <div id="5.2.2" className="subsection">
            <Title level={5}>
              5.2.2. Tắt UPS ở chế độ Maintenance Bypass
            </Title>
          <Card title="Tắt UPS ở chế độ Maintenance Bypass" style={{ marginBottom: '16px' }}>
            <Alert
              message="CẢNH BÁO QUAN TRỌNG"
              description="Quy trình này sẽ chuyển hệ thống sang chế độ bypass cứng và tắt UPS. Đảm bảo hệ thống ở trạng thái an toàn trước khi thực hiện."
              type="error"
              showIcon
              style={{ marginBottom: '16px' }}
            />
            <Steps direction="vertical" size="small">
              <Steps.Step title="Bước 1-3: Chuyển bypass" description="Control > Transfer to bypass operation > OK" />
              <Steps.Step title="Bước 4: Chuyển công bảng điều khiển" description="Chuyển ACB từ chế độ Auto sang Manual" />
              <Steps.Step title="Bước 5: ON Maintenance Bypass" description='ON attomat Maintenance Bypass "LỘ 1600A"' />
              <Steps.Step title="Bước 6: OFF attomat đầu ra" description='OFF attomat đầu ra "LSI EDO ACB"' />
              <Steps.Step title="Bước 7: Tắt Inverter" description="Control > Inverter > Inverter OFF > OK" />
              <Steps.Step title="Bước 8: OFF attomat Acquy" description="OFF attomat Acquy" />
              <Steps.Step title="Bước 9: OFF attomat đầu vào" description="OFF attomat đầu vào" />
              <Steps.Step title="Bước 10: Lặp lại cho UPS còn lại" description="Lặp lại từ bước 1 đến bước 9" />
            </Steps>
          </Card>
          </div>

          {/* 5.2.3 Bật UPS từ chế độ Maintenance Bypass */}
          <div id="5.2.3" className="subsection">
            <Title level={5}>
              5.2.3. Bật UPS từ chế độ Maintenance Bypass
            </Title>
          <Card title="Bật UPS từ chế độ Maintenance Bypass" style={{ marginBottom: '16px' }}>
            <Steps direction="vertical" size="small">
              <Steps.Step title="Bước 1: ON attomat đầu vào" description="ON attomat đầu vào (chờ 10 phút)" />
              <Steps.Step title="Bước 2: ON attomat Acquy" description="ON attomat Acquy" />
              <Steps.Step title="Bước 3-5: Chuyển bypass" description="Control > Operation mode > Transfer to bypass operation > OK" />
              <Steps.Step title="Bước 6: ON attomat đầu ra" description="ON attomat đầu ra" />
              <Steps.Step title="Bước 7: Lặp lại cho UPS còn lại" description="Làm lại từ bước 1 tới bước 6 đối với UPS còn lại" />
              <Steps.Step title="Bước 8: ON attomat đầu ra chính" description='ON attomat đầu ra "LSI EDO ACB"' />
              <Steps.Step title="Bước 9: OFF Maintenance Bypass" description='OFF attomat Maintenance Bypass "LỘ 1600A"' />
              <Steps.Step title="Bước 10: Bật Inverter" description="Control > Inverter > Inverter ON > OK" />
            </Steps>
          </Card>
          </div>

          {/* 5.2.4 Cách li 01 UPS khỏi hệ thống */}
          <div id="5.2.4" className="subsection">
            <Title level={5}>
              5.2.4. Cách li 01 UPS khỏi hệ thống
            </Title>
          <Card title="Cách li 01 UPS khỏi hệ thống" style={{ marginBottom: '16px' }}>
            <Alert
              message="Lưu ý quan trọng"
              description="Các thao tác phải được thực hiện đúng trên attomat bảo vệ của UPS muốn cách li."
              type="warning"
              showIcon
              style={{ marginBottom: '16px' }}
            />
            <Steps direction="vertical" size="small">
              <Steps.Step title="Bước 1: Kiểm tra hiện trạng" description="Kiểm tra hiện trạng hoạt động của hệ thống UPS" />
              <Steps.Step title="Bước 2-3: Truy cập Control" description="Control > admin/admin" />
              <Steps.Step title="Bước 4: Guided sequences" description="Control > Guided sequences > Shut down UPS system hoặc Shut down a UPS in a parallel system" />
              <Steps.Step title="Bước 5: Turn off inverter" description="Chạm vào Turn off inverter và kiểm tra lại trạng thái" />
              <Steps.Step title="Bước 6: OFF attomat đầu ra" description="OFF attomat đầu ra, tại tủ UPS PANEL" />
              <Steps.Step title="Bước 7: OFF attomat battery" description="OFF attomat battery (đúng UPS muốn cách li)" />
              <Steps.Step title="Bước 8: OFF attomat đầu vào" description="OFF attomat đầu vào (đúng UPS muốn cách li)" />
            </Steps>
          </Card>
          </div>

          {/* 5.2.5 Hòa 01 UPS vào hệ thống */}
          <div id="5.2.5" className="subsection">
            <Title level={5}>
              5.2.5. Hòa 01 UPS vào hệ thống
            </Title>
          <Card title="Hòa 01 UPS vào hệ thống" style={{ marginBottom: '16px' }}>
            <Steps direction="vertical" size="small">
              <Steps.Step title="Bước 1: ON attomat đầu vào" description="ON attomat đầu vào" />
              <Steps.Step title="Bước 2-3: Truy cập Control" description="Control > admin/admin" />
              <Steps.Step title="Bước 4: Guided sequences" description="Control > Guided sequences > Start up UPS system hoặc Start up a UPS in a parallel system" />
              <Steps.Step title="Bước 5: ON attomat Battery" description="ON attomat Battery" />
              <Steps.Step title="Bước 6: ON attomat đầu ra" description="ON attomat đầu ra" />
              <Steps.Step title="Bước 7: Turn on inverter" description="Chạm vào Turn on inverter, kiểm tra lại tình trạng hoạt động" />
            </Steps>
          </Card>
          </div>
        </div>
      </div>     
    </div>
  );
};

export default OperationSection;
