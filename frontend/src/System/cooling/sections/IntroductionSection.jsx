import { InfoCircleOutlined } from '@ant-design/icons';
import { Card, Divider, Table, Typography } from 'antd';
import React from 'react';
import '../../shared/styles/SystemSection.css';
import {
  acrp102StructureColumns,
  acrp102StructureData,
  afmTableColumns,
  afmTableData,
  apcTableColumns,
  apcTableData,
  fm40hStructureColumns,
  fm40hStructureData,
  tdavCapacityColumns,
  tdavCapacityData,
  tdavStructureColumns,
  tdavStructureData,
  uniflairTableColumns,
  uniflairTableData
} from '../coolingTableData';
// Dùng Google Model Viewer (web component) qua CDN khai báo trong index.html

const { Title, Paragraph, Text } = Typography;

const IntroductionSection = () => {
  return (
    <section id="section-1" className="content-section">
      <Title level={2}>
        <InfoCircleOutlined style={{ marginRight: '12px' }} />
        1. GIỚI THIỆU CHUNG - TTDL Hòa Lạc
      </Title>

      <Paragraph>
        Hệ thống điều hòa chính xác (Precision Air Conditioning) được thiết kế để kiểm soát nhiệt độ, độ ẩm và lưu lượng khí một cách chính xác, phục vụ cho các trung tâm dữ liệu, phòng server và ứng dụng công nghiệp quan trọng khác.
      </Paragraph>

      <Paragraph>
        Danh mục thiết bị dưới đây bao gồm các dòng Uniflair và APC by Schneider Electric với hướng dẫn chi tiết cho từng model của TTDL Hòa Lạc.
      </Paragraph>

      <Divider />


      <div id="section-1-1" className="subsection">
        <Title level={3}>
          1.1. Thông số kĩ thuật theo tài liệu hãng các thiết bị thuộc hệ thống làm mát của TTDL Hòa Lạc
        </Title>
        <Paragraph>
          Danh mục thiết bị dưới đây bao gồm các dòng Uniflair và APC by Schneider Electric với hướng dẫn chi tiết cho từng model của TTDL Hòa Lạc.
        </Paragraph>

        <Card
          title={
            <div
              style={{
                color: '#fff',
                padding: '6px 16px',
                borderRadius: 6,
                width: '100%',
                boxSizing: 'border-box'
              }}
            >
              Uniflair - Dòng TDAV (InRoom Air Conditioner)
            </div>
          }
          className="device-card"
        >
          <Table
            columns={uniflairTableColumns}
            dataSource={uniflairTableData}
            rowKey="key"
            pagination={false}
            size="small"
            bordered
          />
        </Card>

        <Card title={
          <div
            style={{
              color: '#fff',
              padding: '6px 16px',
              borderRadius: 6,
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            Uniflair - Dòng AFM (Active Floor Module)
          </div>
        } className="device-card" style={{ marginTop: '20px' }}>
          <Table
            columns={afmTableColumns}
            dataSource={afmTableData}
            rowKey="key"
            pagination={false}
            size="small"
            bordered
          />
        </Card>

        <Card title={
          <div
            style={{
              color: '#fff',
              padding: '6px 16px',
              borderRadius: 6,
              width: '100%',
              boxSizing: 'border-box'
            }}
          >
            APC - Dòng InRoom & InRow
          </div>
        } className="device-card" style={{ marginTop: '20px' }}>
          <Table
            columns={apcTableColumns}
            dataSource={apcTableData}
            rowKey="key"
            pagination={false}
            size="small"
            bordered
          />
        </Card>
      </div>

      <div id="section-1-2" className="subsection">
        <Title level={3} style={{ color: '#52c41a', marginBottom: '16px' }}>
          1.2. Cấu trúc đặt tên của các model thuộc TTDL Hòa Lạc
        </Title>

        <Card title="Cấu trúc đặt tên model TDAVxxxxA" style={{ marginBottom: '20px' }}>
          <Paragraph>
            <Text strong>Cấu trúc:</Text> TDAVabcdX
          </Paragraph>
          <Table
            columns={tdavStructureColumns}
            dataSource={tdavStructureData}
            rowKey="key"
            pagination={false}
            size="small"
            bordered
          />
          <br />
          <Title level={4}>Công suất lạnh định danh của Uniflair TDAV</Title>
          <Table
            columns={tdavCapacityColumns}
            dataSource={tdavCapacityData}
            rowKey="key"
            pagination={false}
            size="small"
            bordered
            style={{ maxWidth: '600px' }}
          />
          <Divider />
          <Paragraph>
            <Text strong>Ví dụ phân tích model TDAV1321A</Text>
          </Paragraph>
          <Paragraph>
            <Text strong>Model:</Text> TDAV1321A
          </Paragraph>
          <ul>
            <li><Text strong>13:</Text> Công suất lạnh định danh khoảng 40–50 kW</li>
            <li><Text strong>2:</Text> 2 máy nén</li>
            <li><Text strong>1:</Text> 1 mạch gas</li>
            <li><Text strong>A:</Text> Thổi sàn (downflow type)</li>
          </ul>
        </Card>

        <Card title="Cấu trúc đặt tên model FM40H-AGB-ESD (APC)" style={{ marginBottom: '20px' }}>
          <Paragraph>
            <Text strong>Cấu trúc:</Text> FM40-H-AGB-ESD
          </Paragraph>
          <Table
            columns={[
              fm40hStructureColumns[0],
              fm40hStructureColumns[1],
              {
                ...fm40hStructureColumns[2],
                render: (text) => (
                  <div style={{ whiteSpace: 'pre-line', lineHeight: '1.5', wordWrap: 'break-word' }}>
                    {text}
                  </div>
                )
              }
            ]}
            dataSource={fm40hStructureData}
            rowKey="key"
            pagination={false}
            size="small"
            bordered
          />
          <Paragraph style={{ marginTop: '15px' }}>
            <Text strong>Vậy model FM40H-AGB-ESD có thể được diễn giải là:</Text> Một thiết bị điều hòa chính xác thuộc dòng NetworkAIR FM, công suất 40 kW, giải nhiệt bằng khí, có cấu hình luồng gió thổi sàn (Downflow), và được tích hợp sẵn các tùy chọn sưởi điện (Electric Reheat) và tạo ẩm bằng hơi nước (Steam Humidifier).
          </Paragraph>
        </Card>

        <Card title="Cấu trúc đặt tên model ACRP102 (APC)" style={{ marginBottom: '20px' }}>
          <Paragraph>
            <Text strong>Cấu trúc:</Text> AC-R-P-102
          </Paragraph>
          <Table
            columns={[
              acrp102StructureColumns[0],
              acrp102StructureColumns[1],
              {
                ...acrp102StructureColumns[2],
                render: (text) => (
                  <div style={{ whiteSpace: 'pre-line', lineHeight: '1.5', wordWrap: 'break-word' }}>
                    {text}
                  </div>
                )
              }
            ]}
            dataSource={acrp102StructureData}
            rowKey="key"
            pagination={false}
            size="small"
            bordered
          />
          <Paragraph style={{ marginTop: '15px' }}>
            <Text strong>Vậy model ACRP102 có thể được diễn giải là:</Text> Một thiết bị Điều hòa không khí (AC), thuộc dòng InRow (R), dòng sản phẩm RP (P), với mã model cụ thể là 102.Đây là một thiết bị làm mát chính xác được thiết kế để lắp đặt giữa các tủ rack, cung cấp luồng khí lạnh trực tiếp đến các thiết bị IT, giúp tối ưu hóa hiệu quả sử dụng năng lượng trong trung tâm dữ liệu.
          </Paragraph>
        </Card>
      </div>

      <div id="section-1-3" className="subsection">
        <Title level={3} style={{ color: '#52c41a', marginBottom: '16px' }}>
          1.3. Nguyên lý hoạt động của hệ thống làm mát Trung tâm dữ liệu Hòa Lạc
        </Title>

        <Card title="Tạo Hành lang nóng/lạnh (Hot/Cold Aisle Containment)" style={{ marginBottom: '20px' }}>
          <Paragraph>
            Đây là nguyên tắc cơ bản nhất trong thiết kế làm mát trung tâm dữ liệu hiện đại và là nền tảng để các thiết bị phát huy được tối đa hiệu quả.
          </Paragraph>
          <ul>
            <li>
              <Text strong>Hành lang lạnh (Cold Aisle):</Text> Không khí lạnh được cấp vào từ các thiết bị điều hòa, đi vào phía trước của các tủ rack chứa máy chủ. Các tủ rack được bố trí quay lưng vào nhau hoặc quay mặt vào nhau để tạo ra các hành lang lạnh riêng biệt.
            </li>
            <li>
              <Text strong>Hành lang nóng (Hot Aisle):</Text> Không khí nóng sau khi đi qua các thiết bị IT sẽ được thải ra phía sau tủ rack, tạo thành hành lang nóng. Không khí nóng này sau đó sẽ được hút về lại các thiết bị điều hòa để làm mát và tái tuần hoàn.
            </li>
          </ul>

          <Divider />

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img
                src="/cooling/inrow.jpg"
                alt="Nguyên lý hoạt động của dòng điều hòa InRow ACRP102"
                style={{
                  maxWidth: '50%',
                  height: 'auto',
                  border: '1px solid #d9d9d9',
                  borderRadius: '6px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  display: 'block',
                  margin: '0 auto'
                }}
              />
              <Paragraph style={{ marginTop: '10px', fontWeight: 'bold', textAlign: 'center' }}>
                Nguyên lý hoạt động của dòng điều hòa InRow ACRP102
              </Paragraph>
            </div>

            <div style={{ textAlign: 'center' }}>
              <img
                src="/cooling/fm.jpg"
                alt="Nguyên lý hoạt động của các dòng điều hòa InRoom FM40H và Uniflair"
                style={{
                  maxWidth: '50%',
                  height: 'auto',
                  border: '1px solid #d9d9d9',
                  borderRadius: '6px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  display: 'block',
                  margin: '0 auto'
                }}
              />
              <Paragraph style={{ marginTop: '10px', fontWeight: 'bold' }}>
                Nguyên lý hoạt động của các dòng điều hòa InRoom FM40H và Uniflair
              </Paragraph>
            </div>
          </div>
        </Card>

        <Card title="Vai trò của từng thiết bị điều hòa và quạt sàn APC" style={{ marginBottom: '20px' }}>
          <ul>
            <li>
              <Text strong>Điều hòa FM40 (InRoom Cooling – Điều hòa InRoom đứng):</Text>
              <br />
              <Text type="primary">Vị trí: FM40 là điều hòa InRoom đứng, có nghĩa là chúng được đặt ở ngoại vi của trung tâm dữ liệu hoặc trong các khu vực làm mát chuyên biệt, không phải đặt xen kẽ trong hàng tủ rack. Chúng là các thiết bị lớn, đảm nhiệm việc xử lý một lượng lớn không khí cho toàn bộ không gian sàn.</Text>
            </li>
            <li>
              <Text strong>Điều hòa Uniflair (CRAC/CRAH – Computer Room Air Conditioner/Handler):</Text>
              <br />
              <Text type="primary">Vị trí: Tương tự như FM40, Uniflair cũng là một loại điều hòa InRoom/CRAC/CRAH. Chúng được đặt ở ngoại vi của trung tâm dữ liệu, hoặc trong các khu vực riêng biệt. Đây là những thiết bị hiệu suất cao, được thiết kế để xử lý lượng nhiệt lớn và kiểm soát môi trường chặt chẽ.</Text>
            </li>
            <li>
              <Text strong>Điều hòa ACRP102 (InRow Cooling – Điều hòa InRow):</Text>
              <br />
              <Text type="primary">Vị trí: ACRP102 là điều hòa InRow, có nghĩa là chúng được đặt xen kẽ với các tủ rack trong hành lang nóng hoặc hành lang lạnh, rất gần với nguồn nhiệt.</Text>
            </li>
            <li>
              <Text strong>Quạt sàn AFM4500B (Floor Mount Air Mover/Fan Unit):</Text>
              <br />
              <Text type="primary">Vị trí: Đặt trên sàn nâng, thường là trong các hành lang lạnh hoặc tại các khu vực cần tang cường luồng không khí lạnh.</Text>
            </li>
          </ul>
        </Card>

        <Card title="Cơ chế phối hợp và Quản lý" style={{ marginBottom: '20px' }}>
          <Paragraph>
            Để toàn bộ hệ thống hoạt động hiệu quả, cần một hệ thống quản lý trung tâm (DCIM – Data Center Infrastructure Management) của APC.
          </Paragraph>
          <ul>
            <li>
              <Text strong>Giám sát và cảm biến:</Text> Các cảm biến nhiệt độ và độ ẩm được đặt khắp trung tâm dữ liệu, đặc biệt là ở đầu vào/ra của các tủ rack và trong hành lang nóng/lạnh.
            </li>
            <li>
              <Text strong>Phân tích dữ liệu:</Text> DCIM thu thập dữ liệu từ tất cả các cảm biến và thiết bị làm mát.
            </li>
            <li>
              <Text strong>Điều khiển tự động:</Text> Dựa trên dữ liệu, hệ thống DCIM có thể tự động điều chỉnh công suất của các điều hòa FM40, Uniflair, ACRP102, cũng như tốc độ của quạt AFM4500B để duy trì nhiệt độ và độ ẩm mong muốn, đồng thời tối ưu hóa hiệu quả năng lượng. Ví dụ: nếu một hành lang nóng trở nên quá nóng, hệ thống có thể tăng công suất của các ACRP102 hoặc FM40/Uniflair tương ứng.
            </li>
            <li>
              <Text strong>Cảnh báo:</Text> Gửi cảnh báo khi có sự cố hoặc vượt ngưỡng nhiệt độ/độ ẩm.
            </li>
          </ul>
        </Card>

        <Card title="Tóm tắt luồng không khí" style={{ marginBottom: '20px' }}>
          <ol>
            <li>
              <Text strong>Hút khí nóng:</Text>
              <ul>
                <li>Các điều hòa ACRP102 (InRow) hút khí nóng trực tiếp từ hành lang nóng.</li>
                <li>Điều hòa FM40 và Uniflair (InRoom) hút khí nóng tổng thể từ hành lang nóng, khí nóng bay phía trên phòng máy chủ.</li>
              </ul>
            </li>
            <li>
              <Text strong>Làm mát:</Text> Không khí nóng được làm lạnh bởi các bộ trao đổi nhiệt trong từng loại điều hòa.
            </li>
            <li>
              <Text strong>Thổi khí lạnh:</Text>
              <ul>
                <li>ACRP102 (InRow) thổi khí lạnh trực tiếp vào hành lang lạnh.</li>
                <li>FM40 và Uniflair (InRoom) thổi khí lạnh phía dưới thấp mặt sàn, dồn ép khí nóng sang các hành lang nóng và bay lên phía trên.</li>
                <li>Quạt sàn AFM4500B hỗ trợ đẩy/phân phối khí lạnh từ sàn nâng hoặc từ hành lang lạnh đến các khu vực cần thiết, đảm bảo luồng khí đồng đều và loại bỏ điểm nóng cục bộ.</li>
              </ul>
            </li>
            <li>
              <Text strong>Tuần hoàn:</Text> Không khí lạnh đi qua các thiết bị IT, hấp thụ nhiệt và trở thành khí nóng, sau đó khí nóng bay lên trên và quay trở lại để được hút và làm mát, hoàn thành chu trình.
            </li>
          </ol>
          <Paragraph style={{ marginTop: '15px' }}>
            <Text strong>Kết luận:</Text> Sự kết hợp này cho phép trung tâm dữ liệu đạt được hiệu quả làm mát tối ưu, đáp ứng các yêu cầu về tản nhiệt khác nhau, từ mật độ thấp đến cực kỳ cao, đồng thời tối đa hóa hiệu quả năng lượng và độ tin cậy.
          </Paragraph>
        </Card>
      </div>
    </section>
  );
};

export default IntroductionSection;
