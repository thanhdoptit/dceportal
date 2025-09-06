import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Modal,
  Table,
  Card,
  Typography,
  Space,
  Tag,
  Row,
  Col,
  Button,
  message,
  Badge,
  Spin,
} from 'antd';
import { CalendarOutlined, TeamOutlined, ReloadOutlined, LoadingOutlined } from '@ant-design/icons';
import { getShiftSchedule, reloadShiftSchedule } from '../../services/shiftScheduleService.js';
import { useAuth } from '../../contexts/AuthContext.jsx';
import '../../styles/ShiftSchedule.css';

const { Title, Text } = Typography;

// Định nghĩa màu cho các ca trực (dùng chung cho table và chú thích)
const SHIFT_COLORS = {
  /*
  T: 'green',
  T1: 'green',
  T2: 'green',
  T3: 'green',
  N: 'red',
  H1: 'blue',
  H2: 'blue',
  V1: 'purple',
  V2: 'purple'
*/
};

const ShiftScheduleModal = ({ visible, onCancel }) => {
  const { currentUser } = useAuth();
  const [scheduleData, setScheduleData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [weekDates, setWeekDates] = useState({});
  const [currentDate, setCurrentDate] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);

  // Tối ưu hóa: Chỉ tính toán khi cần thiết
  const memoizedCurrentDate = useMemo(() => {
    if (!visible) return null;
    return new Date();
  }, [visible]);

  // Tối ưu hóa: Lazy loading dữ liệu
  const initializeModal = useCallback(async () => {
    if (!visible || isInitialized) return;

    setLoading(true);
    setError(null);

    try {
      // Tạo một Date object duy nhất cho toàn bộ component
      const today = memoizedCurrentDate;
      setCurrentDate(today);
      console.log('🕐 Ngày hiện tại (từ browser):', today.toString());
      console.log('🕐 Timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone);

      // Reset weekDates trước khi tính toán mới
      setWeekDates({});

      // Load dữ liệu song song để tối ưu performance
      await Promise.all([loadScheduleData(), calculateWeekDates(today)]);

      setIsInitialized(true);
    } catch (err) {
      console.error('Lỗi khi khởi tạo modal:', err);
      setError('Không thể tải dữ liệu lịch trực. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, [visible, isInitialized, memoizedCurrentDate]);

  // Tự động khởi tạo khi modal mở
  useEffect(() => {
    if (visible) {
      initializeModal();
    } else {
      // Reset state khi modal đóng
      setIsInitialized(false);
      setError(null);
    }
  }, [visible, initializeModal]);

  // Hàm tính số tuần trong năm (theo ISO 8601)
  const getISOWeekNumber = date => {
    const tempDate = new Date(date.getTime());
    tempDate.setHours(0, 0, 0, 0);
    tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));
    const week1 = new Date(tempDate.getFullYear(), 0, 4);
    return (
      1 +
      Math.round(
        ((tempDate.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7
      )
    );
  };

  // Hàm helper tạo key cho tuần
  const getWeekKey = weekIndex => `week${weekIndex}`;

  // Hàm helper tạo title cho tuần
  const getWeekTitle = weekIndex => `Tuần ${weekIndex}`;

  // Hàm tính thứ 2 của tuần chứa ngày cho trước
  const getMondayOfWeek = date => {
    const dayOfWeek = date.getDay();
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(date);
    monday.setDate(date.getDate() + mondayOffset);
    return monday;
  };

  // Hàm tính chu kỳ 4 tuần hiện tại
  const calculateCurrentCycle = today => {
    // Điểm neo: 4/8/2025 (Thứ 2) = Tuần 4 của chu kỳ
    const anchorDate = new Date(2025, 7, 4); // 4/8/2025 (month = 7 vì tháng 8)
    const anchorMonday = getMondayOfWeek(anchorDate);
    const currentMonday = getMondayOfWeek(today);
    // Tính số tuần từ anchor date đến ngày hiện tại
    const daysDiff = Math.floor(
      (currentMonday.getTime() - anchorMonday.getTime()) / (7 * 24 * 60 * 60 * 1000)
    );

    // Tính vị trí trong chu kỳ 4 tuần (0=Tuần 1, 1=Tuần 2, 2=Tuần 3, 3=Tuần 4)
    // Anchor date (4/8) là Tuần 4 (index 3), nên ta cần điều chỉnh
    const cyclePosition = (daysDiff + 3) % 4; // +3 vì 4/8 là tuần 4 (index 3)
    const currentCycleWeek = cyclePosition + 1; // Chuyển về 1-4

    // Tính thứ 2 của tuần đầu chu kỳ hiện tại
    const cycleStartMonday = new Date(currentMonday);
    cycleStartMonday.setDate(currentMonday.getDate() - (currentCycleWeek - 1) * 7);

    return {
      currentCycleWeek,
      cycleStartMonday,
      cycleEndDate: new Date(cycleStartMonday.getTime() + (4 * 7 - 1) * 24 * 60 * 60 * 1000),
    };
  };

  // Hàm tạo dữ liệu cho một tuần cụ thể
  const generateWeekData = (cycleStartMonday, weekIndex, today) => {
    const weekData = {};

    // Tính thứ 2 của tuần này trong chu kỳ
    const weekStartMonday = new Date(cycleStartMonday);
    weekStartMonday.setDate(cycleStartMonday.getDate() + (weekIndex - 1) * 7);

    // Tính số tuần trong năm cho tuần này
    const weekNumber = getISOWeekNumber(weekStartMonday);
    const weekYear = weekStartMonday.getFullYear();

    // Lưu thông tin số tuần trong năm
    weekData.weekInfo = {
      weekNumber,
      year: weekYear,
      startDate: weekStartMonday,
      endDate: new Date(weekStartMonday.getTime() + 6 * 24 * 60 * 60 * 1000),
    };

    // Tạo dữ liệu cho từng ngày trong tuần
    const days = ['2', '3', '4', '5', '6', '7', 'CN'];
    days.forEach((day, dayIndex) => {
      const cellDate = new Date(weekStartMonday);
      cellDate.setDate(weekStartMonday.getDate() + dayIndex);

      weekData[day] = {
        date: cellDate.getDate(),
        month: cellDate.getMonth() + 1,
        fullDate: cellDate,
      };

      // Kiểm tra ngày hôm nay
      if (
        cellDate.getDate() === today.getDate() &&
        cellDate.getMonth() === today.getMonth() &&
        cellDate.getFullYear() === today.getFullYear()
      ) {
        console.log(
          '🎯 Tìm thấy ngày hiện tại tại:',
          getWeekTitle(weekIndex),
          day,
          cellDate.toDateString()
        );
      }
    });

    return weekData;
  };

  // Hàm tính toán chu kỳ 4 tuần tự động (cải thiện)
  const calculateWeekDates = today => {
    console.log(
      '🔍 Ngày hiện tại:',
      today.toDateString(),
      'Date:',
      today.getDate(),
      'Month:',
      today.getMonth() + 1
    );

    // Tính chu kỳ hiện tại
    const cycle = calculateCurrentCycle(today);
    console.log('🔍 Tuần hiện tại trong chu kỳ:', cycle.currentCycleWeek);
    console.log('🔍 Thứ 2 tuần đầu chu kỳ hiện tại:', cycle.cycleStartMonday.toDateString());

    // Tạo dữ liệu cho 4 tuần
    const dates = {};
    for (let weekIndex = 1; weekIndex <= 4; weekIndex++) {
      const weekKey = getWeekKey(weekIndex);
      const weekData = generateWeekData(cycle.cycleStartMonday, weekIndex, today);
      dates[weekKey] = weekData;

      const weekInfo = dates[weekKey].weekInfo;
      console.log(
        `🔍 ${getWeekTitle(weekIndex)} - Tuần ${weekInfo.weekNumber}/${weekInfo.year} (${weekInfo.startDate.getDate()}/${weekInfo.startDate.getMonth() + 1} - ${weekInfo.endDate.getDate()}/${weekInfo.endDate.getMonth() + 1})`
      );
    }

    // Hiển thị thông tin chu kỳ hiện tại
    console.log(
      '🔄 Chu kỳ hiện tại:',
      cycle.cycleStartMonday.getDate() + '/' + (cycle.cycleStartMonday.getMonth() + 1),
      'đến',
      cycle.cycleEndDate.getDate() + '/' + (cycle.cycleEndDate.getMonth() + 1)
    );

    setWeekDates(dates);
  };

  const loadScheduleData = async () => {
    try {
      const response = await getShiftSchedule();
      if (response.success) {
        setScheduleData(response.data);
      } else {
        throw new Error('Không thể tải dữ liệu lịch trực');
      }
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu lịch trực:', err);
      throw err;
    }
  };

  const handleReloadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await reloadShiftSchedule();
      if (response.success) {
        message.success(response.message);
        await loadScheduleData(); // Tải lại dữ liệu sau khi reload
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      console.error('Lỗi khi reload dữ liệu Excel lịch trực:', err);
      setError('Lỗi khi cập nhật dữ liệu Excel lịch trực');
    } finally {
      setLoading(false);
    }
  };

  // Tối ưu hóa: Memoize columns để tránh tính toán lại
  const createColumns = useCallback(() => {
    if (!currentDate || Object.keys(weekDates).length === 0) {
      return [];
    }
    const today = currentDate;

    const baseColumns = [
      {
        title: 'STT',
        dataIndex: 'stt',
        key: 'stt',
        width: 15,
        align: 'center',
        render: text => (
          <Text style={{ fontSize: '14px', fontWeight: '600', letterSpacing: '0.025em' }}>
            {text}
          </Text>
        ),
      },
      {
        title: 'Họ đệm',
        dataIndex: 'hoDem',
        key: 'hoDem',
        width: 40,
        align: 'right',
        render: text => <Text style={{ fontSize: '14px', alignItems: 'center' }}>{text}</Text>,
      },
      {
        title: 'Tên',
        dataIndex: 'ten',
        key: 'ten',
        width: 20,
        render: text => <Text style={{ fontSize: '14px' }}>{text}</Text>,
      },
    ];

    // Tạo columns cho các tuần (theo chu kỳ 4 tuần quay vòng)
    const weekColumns = [
      { key: getWeekKey(1), title: getWeekTitle(1) },
      { key: getWeekKey(2), title: getWeekTitle(2) },
      { key: getWeekKey(3), title: getWeekTitle(3) },
      { key: getWeekKey(4), title: getWeekTitle(4) },
    ];

    weekColumns.forEach(week => {
      const days = ['2', '3', '4', '5', '6', '7', 'CN'];
      days.forEach(day => {
        const dateInfo = weekDates[week.key]?.[day];

        // Kiểm tra xem có phải ngày hôm nay không bằng cách so sánh trực tiếp ngày tháng
        const isTodayCell =
          dateInfo && dateInfo.date === today.getDate() && dateInfo.month === today.getMonth() + 1;

        baseColumns.push({
          title: (
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  color: isTodayCell ? '#ff4d4f' : 'inherit',
                  fontWeight: isTodayCell ? 'bold' : '500',
                  fontSize: '14px',
                }}
              >
                {day}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: isTodayCell ? '#ff4d4f' : '#666666',
                  fontWeight: isTodayCell ? 'bold' : 'normal',
                }}
              >
                {dateInfo ? `${dateInfo.date}/${dateInfo.month}` : 'N/A'}
              </div>
            </div>
          ),
          key: `${week.key}_${day}`,
          width: 12,
          align: 'center',
          className: '',
          onCell: () => ({
            style: {
              backgroundColor: isTodayCell ? '' : '',
              fontWeight: 'normal',
            },
          }),
          render: (_, record) => {
            const shift = record[week.key]?.[day];

            if (!shift) return null;

            return (
              <Text
                style={{
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: isTodayCell ? '#ff4d4f' : SHIFT_COLORS[shift] || '#000000',
                  fontSize: '12px',
                }}
              >
                {shift}
              </Text>
            );
          },
        });
      });
    });

    return baseColumns;
  }, [currentDate, weekDates]);

  // Tối ưu hóa: Memoize filtered data
  const filteredScheduleData = useMemo(() => {
    return scheduleData.filter(item => item && item.stt);
  }, [scheduleData]);

  // Hàm kiểm tra xem dòng có phải của người dùng hiện tại không
  const isCurrentUserRow = useCallback(
    record => {
      if (!currentUser || !record.adName) return false;
      return record.adName.toLowerCase() === currentUser.username?.toLowerCase();
    },
    [currentUser]
  );

  // Loading component tùy chỉnh
  const loadingComponent = (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} size='large' />
      <Text type='secondary'>Đang tải dữ liệu lịch trực...</Text>
    </div>
  );

  // Error component
  const errorComponent = error && (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <Text type='danger'>{error}</Text>
      <Button type='primary' onClick={initializeModal}>
        Thử lại
      </Button>
    </div>
  );

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      width='1650px'
      style={{ maxHeight: '95vh' }}
      footer={null}
      centered
      destroyOnHidden
      className='shift-schedule-modal'
    >
      {/* Header với layout 2 dòng */}
      <div style={{ marginBottom: 5, padding: '0 20px' }}>
        {/* Dòng 1: KHỐI CÔNG NGHỆ THÔNG TIN và LỊCH LÀM VIỆC */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <Text style={{ fontSize: '16px', fontWeight: '600', color: '#2D3958' }}>
            KHỐI CÔNG NGHỆ THÔNG TIN
          </Text>
          <div>
            <Text style={{ fontSize: '16px', fontWeight: '600', color: '#2D3958' }}>
              LỊCH LÀM VIỆC DATACENTER
            </Text>
          </div>
        </div>
        {/* Dòng 2: PHÒNG VẬN HÀNH VÀ TRANG THIẾT BỊ và Năm 2025 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: '18px', fontWeight: '600', color: '#0F60FF' }}>
            PHÒNG VẬN HÀNH VÀ TRANG THIẾT BỊ
          </Text>
          <div style={{ textAlign: 'right' }}>
            {currentDate && (
              <div
                style={{ fontSize: '14px', color: '#ff4d4f', fontWeight: '600', marginTop: '2px' }}
              >
                <CalendarOutlined style={{ marginRight: '2px' }} />
                Hôm nay:{' '}
                {(() => {
                  const dayOfWeek = currentDate.getDay();
                  const dayNames = [
                    'Chủ nhật',
                    'Thứ 2',
                    'Thứ 3',
                    'Thứ 4',
                    'Thứ 5',
                    'Thứ 6',
                    'Thứ 7',
                  ];
                  return dayNames[dayOfWeek];
                })()}{' '}
                ngày {currentDate.getDate()}/{currentDate.getMonth() + 1}/
                {currentDate.getFullYear()}
                <Button
                  type='primary'
                  size='small'
                  onClick={handleReloadData}
                  loading={loading}
                  className='bg-[#0F60FF] hover:bg-[#0040FF] border-[#0F60FF] text-white ml-2'
                >
                  Cập nhật
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content với loading và error handling */}
      {loading && !isInitialized ? (
        loadingComponent
      ) : error ? (
        errorComponent
      ) : (
        <>
          <Table
            columns={createColumns()}
            dataSource={filteredScheduleData}
            rowKey='id'
            loading={loading}
            pagination={false}
            scroll={{ x: 800, y: 460 }}
            size='small'
            bordered={false}
            showHeader={true}
            className='shift-schedule-table'
            rowClassName={(record, index) => {
              const baseClass = index % 2 === 0 ? 'even-row' : 'odd-row';
              return isCurrentUserRow(record) ? `${baseClass} current-user-row` : baseClass;
            }}
          />
          {/* Chú thích chi tiết các ca trực */}
          <div
            style={{
              marginTop: 12,
              padding: '10px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #e9ecef',
            }}
          >
            <div style={{ marginBottom: 12 }}>
              <Text strong style={{ fontSize: '14px', color: '#2D3958' }}>
                Ký hiệu ca trực:
              </Text>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                fontSize: '12px',
              }}
            >
              {/* Cột trái - Nhóm T (Trần Hưng Đạo) */}
              <div>
                <div style={{ marginBottom: 8 }}>
                  <Tag color={SHIFT_COLORS['T']} style={{ marginRight: 8, fontWeight: 'bold' }}>
                    T
                  </Tag>
                  <span>Làm việc từ 8h - 17h tại Tầng 3 -108 THĐ</span>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <Tag color={SHIFT_COLORS['T1']} style={{ marginRight: 8, fontWeight: 'bold' }}>
                    T1
                  </Tag>
                  <span>Làm việc từ 6h - 14h tại Tầng 3 -108 THĐ</span>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <Tag color={SHIFT_COLORS['T2']} style={{ marginRight: 8, fontWeight: 'bold' }}>
                    T2
                  </Tag>
                  <span>Làm việc từ 14h - 22h tại Tầng 3 -108 THĐ</span>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <Tag color={SHIFT_COLORS['T3']} style={{ marginRight: 8, fontWeight: 'bold' }}>
                    T3
                  </Tag>
                  <span>Làm việc từ 22h - 06h tại Tầng 3 -108 THĐ</span>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <Tag color={SHIFT_COLORS['N']} style={{ marginRight: 8, fontWeight: 'bold' }}>
                    N
                  </Tag>
                  <span>Làm việc từ 8h - 17h Nguyễn Lương Bằng</span>
                </div>
              </div>

              {/* Cột phải - Nhóm H (Hòa Lạc) và V (Vân Canh) */}
              <div>
                <div style={{ marginBottom: 8 }}>
                  <Tag color={SHIFT_COLORS['H1']} style={{ marginRight: 8, fontWeight: 'bold' }}>
                    H1
                  </Tag>
                  <span>Làm việc từ 7h30 - 18h30 tại LHL</span>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <Tag color={SHIFT_COLORS['H2']} style={{ marginRight: 8, fontWeight: 'bold' }}>
                    H2
                  </Tag>
                  <span>Làm việc từ 18h30 - 7h30 tại LHL</span>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <Tag color={SHIFT_COLORS['V1']} style={{ marginRight: 8, fontWeight: 'bold' }}>
                    V1
                  </Tag>
                  <span>Làm việc từ 7h30 - 18h30 tại VC</span>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <Tag color={SHIFT_COLORS['V2']} style={{ marginRight: 8, fontWeight: 'bold' }}>
                    V2
                  </Tag>
                  <span>Làm việc từ 18h30 - 7h30 tại VC</span>
                </div>
                <div style={{ marginBottom: 8, display: 'flex', alignItems: 'center' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      width: 32,
                      height: 22,
                      background: '#fff',
                      border: '2px solid #fff',
                      marginRight: 8,
                    }}
                  />
                  <span style={{ fontStyle: 'italic', color: '#666' }}>Nghỉ giãn ca </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};

export default ShiftScheduleModal;
