import { Card, Divider, Image, Typography } from 'antd';
import React from 'react';

const { Title, Paragraph, Text } = Typography;

const faqData = [
  // Quy trình giao nhận ca
  {
    question: 'Quy trình giao nhận ca như thế nào?',
    answer: (
      <>
        <Paragraph>
          <b>Bước 1: Nhận ca</b>
          <br />- Chọn ca làm việc trên giao diện <Text code>/dc/shifts</Text>.<br />- Xác nhận nhận
          ca, hệ thống tạo WorkSession và chuyển trạng thái ca thành <Text code>doing</Text>.<br />-
          Nếu ca trước có biên bản bàn giao ở trạng thái <Text code>pending</Text>, bạn phải xác
          nhận hoặc từ chối biên bản trước khi làm việc.
          <br />
          <Image src='/faq/ca_nhan_ca.png' alt='Nhận ca' width={600} style={{ margin: '16px 0' }} />
        </Paragraph>
        <Paragraph>
          <b>Bước 2: Làm việc trong ca</b>
          <br />
          - Thực hiện các công việc, kiểm tra thiết bị, cập nhật thông tin liên quan trong ca.
          <br />
          <Image
            src='/faq/ca_lam_viec.png'
            alt='Làm việc trong ca'
            width={600}
            style={{ margin: '16px 0' }}
          />
        </Paragraph>
        <Paragraph>
          <b>Bước 3: Bàn giao ca</b>
          <br />- Khi kết thúc ca, người dùng (hoặc trưởng ca) tạo biên bản bàn giao (trạng thái{' '}
          <Text code>draft</Text>).
          <br />
          - Có thể chỉnh sửa, bổ sung thông tin, đính kèm file.
          <br />- Khi hoàn tất, gửi biên bản để chuyển sang trạng thái <Text code>pending</Text>.
          <br />
          <Image
            src='/faq/ca_ban_giao.png'
            alt='Bàn giao ca'
            width={600}
            style={{ margin: '16px 0' }}
          />
        </Paragraph>
        <Paragraph>
          <b>Bước 4: Xác nhận nhận ca (ca sau)</b>
          <br />- Người nhận ca tiếp theo xem biên bản bàn giao ở trạng thái{' '}
          <Text code>pending</Text>.<br />- Có thể xác nhận (biên bản sang{' '}
          <Text code>completed</Text>, ca trước chuyển <Text code>done</Text>, ca sau chuyển{' '}
          <Text code>doing</Text>) hoặc từ chối (biên bản về <Text code>draft</Text>, ca trước quay
          lại <Text code>doing</Text>).
          <br />
          <Image
            src='/faq/ca_xac_nhan.png'
            alt='Xác nhận nhận ca'
            width={600}
            style={{ margin: '16px 0' }}
          />
        </Paragraph>
        <Paragraph>
          <b>Bước 5: Kết thúc ca</b>
          <br />- Khi tất cả biên bản đã được xác nhận, ca trước có thể kết thúc (trạng thái{' '}
          <Text code>done</Text> hoặc <Text code>closed</Text>).
          <br />
          <Image
            src='/faq/ca_ket_thuc.png'
            alt='Kết thúc ca'
            width={600}
            style={{ margin: '16px 0' }}
          />
        </Paragraph>
        <Paragraph>
          <b>Lưu ý:</b>
          <br />
          - Một ca chỉ được nhận khi ca trước đã bàn giao và biên bản được xác nhận.
          <br />
          - Nếu biên bản bị từ chối, ca trước phải chỉnh sửa và gửi lại.
          <br />
          - Mỗi người chỉ được nhận một ca/ngày.
          <br />
        </Paragraph>
      </>
    ),
  },
  // Chức năng quản lý công việc (Task)
  {
    question: 'Các chức năng quản lý công việc (Task) gồm những gì?',
    answer: (
      <>
        <Paragraph>
          <b>1. Xem danh sách công việc</b>
          <br />
          - Hiển thị tất cả công việc liên quan đến trung tâm dữ liệu.
          <br />
          - Lọc theo trạng thái, vị trí, ngày, từ khóa.
          <br />
          - Hỗ trợ phân trang, sắp xếp.
          <br />
          <Image
            src='/faq/task_danhsach.png'
            alt='Danh sách công việc'
            width={600}
            style={{ margin: '16px 0' }}
          />
        </Paragraph>
        <Paragraph>
          <b>2. Tạo mới công việc</b>
          <br />- Nhấn nút <b>Tạo mới</b> để mở form nhập thông tin.
          <br />
          - Nhập tiêu đề, mô tả, chọn vị trí, trạng thái, đính kèm file.
          <br />
          - Có thể gán người thực hiện.
          <br />
          <Image
            src='/faq/task_taomoi.png'
            alt='Tạo mới công việc'
            width={600}
            style={{ margin: '16px 0' }}
          />
        </Paragraph>
        <Paragraph>
          <b>3. Nhân sự thực hiện công việc (Partner)</b>
          <br />
          - Khi tạo hoặc sửa công việc, có thể chọn một hoặc nhiều nhân sự (partner) thực hiện từ
          danh sách đối tác.
          <br />- Quy trình chi tiết:
          <ul style={{ marginLeft: 24 }}>
            <li>
              <b>Bước 1:</b> Chọn đối tác/nhân sự từ danh sách partner khi tạo/sửa Task.
            </li>
            <li>
              <b>Bước 2:</b> Sau khi lưu, nhân sự được gán sẽ nhận thông báo và xuất hiện trong danh
              sách công việc của họ.
            </li>
            <li>
              <b>Bước 3:</b> Nhân sự (partner) có thể xác nhận, cập nhật trạng thái, đính kèm file,
              ghi chú tiến độ công việc.
            </li>
            <li>
              <b>Bước 4:</b> Người tạo Task hoặc quản trị viên có thể thay đổi, bổ sung hoặc loại bỏ
              nhân sự thực hiện khi cần thiết.
            </li>
            <li>
              <b>Bước 5:</b> Mọi thay đổi về nhân sự, trạng thái đều được lưu lại lịch sử (audit).
            </li>
          </ul>
          - Nhân sự thực hiện chính là các đối tác (partner) đã được quản lý trong chức năng{' '}
          <Text code>/dc/partners</Text>.<br />
          - Có thể xem, tìm kiếm, chỉnh sửa thông tin partner trong trang quản lý đối tác.
          <br />
          <Image
            src='/faq/task_nhansu.png'
            alt='Nhân sự thực hiện công việc (partner)'
            width={600}
            style={{ margin: '16px 0' }}
          />
        </Paragraph>
        <Paragraph>
          <b>3. Xem chi tiết công việc</b>
          <br />
          - Nhấn vào công việc để xem chi tiết: mô tả, file đính kèm, lịch sử thay đổi.
          <br />
          - Xem trạng thái, người thực hiện, ghi chú.
          <br />
          <Image
            src='/faq/task_chitiet.png'
            alt='Chi tiết công việc'
            width={600}
            style={{ margin: '16px 0' }}
          />
        </Paragraph>
        <Paragraph>
          <b>4. Sửa công việc</b>
          <br />- Nhấn <b>Chỉnh sửa</b> để cập nhật nội dung, trạng thái, file, người thực hiện.
          <br />
          - Chỉ người tạo hoặc người được phân quyền mới được sửa.
          <br />
        </Paragraph>
        <Paragraph>
          <b>5. Xóa công việc</b>
          <br />- Nhấn <b>Xóa</b> để xóa công việc (cần xác nhận).
          <br />
          - Chỉ người tạo hoặc quản trị viên mới được xóa.
          <br />
        </Paragraph>
        <Paragraph>
          <b>6. Đổi trạng thái công việc</b>
          <br />
          - Chuyển trạng thái: chờ xử lý → đang thực hiện → hoàn thành, hoặc tạm dừng, hủy.
          <br />
          - Khi đổi trạng thái, hệ thống yêu cầu nhập lý do.
          <br />
          - Lịch sử trạng thái được lưu lại.
          <br />
          <Image
            src='/faq/task_doitrangthai.png'
            alt='Đổi trạng thái công việc'
            width={600}
            style={{ margin: '16px 0' }}
          />
        </Paragraph>
        <Paragraph>
          <b>7. Đính kèm & tải file</b>
          <br />
          - Đính kèm nhiều file cho mỗi công việc.
          <br />
          - File có thể tải về hoặc xóa (nếu có quyền).
          <br />
          <Image
            src='/faq/task_dinhkem.png'
            alt='Đính kèm file công việc'
            width={600}
            style={{ margin: '16px 0' }}
          />
        </Paragraph>
        <Paragraph>
          <b>8. Lịch sử thay đổi (Audit)</b>
          <br />
          - Mỗi lần chỉnh sửa, đổi trạng thái, xóa đều lưu lại lịch sử.
          <br />
          - Xem chi tiết ai đã thay đổi gì, khi nào, lý do.
          <br />
        </Paragraph>
        <Paragraph>
          <b>9. Phân quyền & bảo mật</b>
          <br />
          - Chỉ người tạo, người được giao việc hoặc quản trị viên mới được sửa/xóa.
          <br />
          - Người dùng khác chỉ được xem.
          <br />
        </Paragraph>
        <Paragraph>
          <b>10. Tìm kiếm & lọc nâng cao</b>
          <br />
          - Tìm kiếm theo từ khóa tiêu đề, mô tả.
          <br />
          - Lọc theo trạng thái, vị trí, ngày tạo, người thực hiện.
          <br />
        </Paragraph>
      </>
    ),
  },
  // Quản lý thiết bị & lỗi thiết bị
  {
    question: 'Làm thế nào để quản lý thiết bị và lỗi thiết bị?',
    answer: (
      <>
        <Paragraph>
          <b>1. Xem danh sách thiết bị & lỗi thiết bị</b>
          <br />- Vào trang <Text code>/dc/devices</Text> để xem toàn bộ thiết bị và các lỗi liên
          quan.
          <br />
          - Danh sách lỗi hiển thị các thông tin: thiết bị, số serial, mã lỗi, nguyên nhân, giải
          pháp, trạng thái xử lý, thời gian tạo, v.v.
          <br />
          - Có thể xem chi tiết từng lỗi, lịch sử xử lý lỗi.
          <br />
          <Image
            src='/faq/device_danhsach.png'
            alt='Danh sách thiết bị & lỗi'
            width={600}
            style={{ margin: '16px 0' }}
          />
        </Paragraph>
        <Paragraph>
          <b>2. Lọc, tìm kiếm lỗi thiết bị</b>
          <br />
          - Lọc lỗi theo: thiết bị, trạng thái xử lý, địa điểm, khoảng thời gian tạo lỗi.
          <br />
          - Có thể kết hợp nhiều bộ lọc cùng lúc, hoặc reset tất cả về mặc định.
          <br />
          <Image
            src='/faq/device_loc.png'
            alt='Bộ lọc lỗi thiết bị'
            width={600}
            style={{ margin: '16px 0' }}
          />
        </Paragraph>
        <Paragraph>
          <b>3. Tạo mới lỗi thiết bị</b>
          <br />- Nhấn nút <b>Tạo mới</b> để mở form nhập thông tin lỗi.
          <br />
          - Chọn thiết bị, nhập địa điểm, tên thiết bị, số serial, mã lỗi, nguyên nhân, giải pháp,
          trạng thái xử lý.
          <br />
          - Sau khi lưu, lỗi sẽ xuất hiện trong danh sách và có thể chỉnh sửa, cập nhật tiếp.
          <br />
          <Image
            src='/faq/device_taomoi.png'
            alt='Tạo mới lỗi thiết bị'
            width={600}
            style={{ margin: '16px 0' }}
          />
        </Paragraph>
        <Paragraph>
          <b>4. Cập nhật trạng thái & xử lý lỗi</b>
          <br />- Nhấn vào nút <b>Chi tiết</b> để xem và cập nhật trạng thái xử lý, ghi chú, giải
          pháp cho từng lỗi.
          <br />
          - Có thể chuyển trạng thái từ "Chưa xử lý" sang "Đã xử lý", nhập thời gian xử lý, người xử
          lý, ghi chú giải pháp.
          <br />
          - Mọi thay đổi đều được lưu lại lịch sử.
          <br />
          <Image
            src='/faq/device_chitiet.png'
            alt='Chi tiết & cập nhật lỗi'
            width={600}
            style={{ margin: '16px 0' }}
          />
        </Paragraph>
        <Paragraph>
          <b>5. Xem lịch sử lỗi thiết bị</b>
          <br />
          - Mỗi lỗi đều có thể xem lịch sử thay đổi, quá trình xử lý, ai đã cập nhật, khi nào.
          <br />
          - Lịch sử giúp truy vết toàn bộ quá trình xử lý sự cố.
          <br />
          <Image
            src='/faq/device_history.png'
            alt='Lịch sử xử lý lỗi'
            width={600}
            style={{ margin: '16px 0' }}
          />
        </Paragraph>
        <Paragraph>
          <b>6. Phân quyền & bảo mật</b>
          <br />
          - Chỉ người có quyền (DataCenter, quản trị viên) mới được tạo mới, cập nhật, xử lý lỗi
          thiết bị.
          <br />
          - Người dùng khác chỉ có thể xem, không được chỉnh sửa.
          <br />
        </Paragraph>
      </>
    ),
  },
];

const DatacenterFAQ = () => (
  <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
    <Title level={2} style={{ color: '#003c71' }}>
      FAQ - Hướng dẫn sử dụng cho DataCenter
    </Title>
    <Divider />
    {faqData.map((item, idx) => (
      <Card key={idx} style={{ marginBottom: 32 }}>
        <Title level={4}>{item.question}</Title>
        <div>{item.answer}</div>
      </Card>
    ))}
  </div>
);

export default DatacenterFAQ;
