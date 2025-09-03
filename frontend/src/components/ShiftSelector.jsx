import { Spin } from 'antd';
import locale from 'antd/es/date-picker/locale/vi_VN';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import React, { useCallback, useDeferredValue, useEffect, useId, useMemo, useRef, useState, useTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from '../utils/axios';
import ErrorBoundary from './common/ErrorBoundary';

// Import modal lịch trực
import '../styles/ShiftSchedule.css';
import ShiftScheduleModal from './common/ShiftScheduleModal';

// Extend dayjs with timezone support
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Bangkok');

import { CalendarOutlined, InfoCircleOutlined } from '@ant-design/icons';
import Button from 'antd/es/button';
import DatePicker from 'antd/es/date-picker';
import Modal from 'antd/es/modal/Modal';
import Space from 'antd/es/space';
import Table from 'antd/es/table';
import Tabs from 'antd/es/tabs';
import Tooltip from 'antd/es/tooltip';

const API_URL = import.meta.env.VITE_API_URL;
const WS_URL = API_URL.replace('http', 'ws') + '/ws';

// Layout configuration - sửa giá trị này để thay đổi layout
const LAYOUT_CONFIG = {
  mode: 'vertical', // 'horizontal' hoặc 'vertical'
  // Cấu hình cho layout horizontal
  horizontal: {
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    containerClass: 'grid gap-4 auto-rows-fr'
  },
  // Cấu hình cho layout vertical  
  vertical: {
    gridTemplateColumns: (totalGroups) => {
      if (totalGroups === 1) return 'md:grid-cols-1 md:max-w-md md:mx-auto';
      if (totalGroups === 2) return 'md:grid-cols-2';
      if (totalGroups === 3) return 'md:grid-cols-3';
      if (totalGroups === 4) return 'md:grid-cols-4';
      if (totalGroups === 5) return 'md:grid-cols-5';
      if (totalGroups === 6) return 'md:grid-cols-6';
      return 'md:grid-cols-auto-fit';
    },
    containerClass: (totalGroups) => `grid grid-cols-1 ${LAYOUT_CONFIG.vertical.gridTemplateColumns(totalGroups)} gap-6`
  }
};

// Constants
const REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes
const AUTO_REFRESH_ENABLED = true; // Bật backup interval khi WebSocket fail
const HEARTBEAT_INTERVAL = 15000; // 15 seconds
const HEARTBEAT_TIMEOUT = 5000; // 5 seconds
const ENABLE_WEBSOCKET = true; // Tắt WebSocket để tránh kết nối nền
const MAX_RETRIES = 10;
const INITIAL_RETRY_DELAY = 1000; // 1 second
const MAX_RETRY_DELAY = 30000; // 30 seconds
// Optimized Badge component với React.memo
const Badge = React.memo(({ color, children }) => (
  <span className={`px-2 py-1 rounded-full text-sm font-medium ${color}`}>{children}</span>
));

const getStatusColor = (status) => {
  switch (status) {
    case 'doing': return 'bg-green-100 text-green-800';
    case 'handover': return 'bg-yellow-100 text-yellow-800';
    case 'done': return 'bg-red-100 text-red-800';
    case 'waiting': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'doing': return 'Đang làm việc';
    case 'handover': return 'Đang bàn giao';
    case 'done': return 'Đã kết thúc';
    case 'waiting': return 'Đang chờ';
    default: return 'Chưa bắt đầu';
  }
};

const getShiftName = (code) => {
  if (code.startsWith('T')) return 'Trần Hưng Đạo';
  if (code.startsWith('H')) return 'Hòa Lạc';
  if (code.startsWith('V')) return 'Vân Canh';
  return '';
};

const getLocationInfo = (code, locations) => {
  const locationName = getShiftName(code);
  const location = locations.find(loc => loc.name === locationName);
  return location;
};

// Helper function để quản lý message thống nhất
const handleBackendMessage = (data, setBackendMessage) => {
  if (data.message) {
    setBackendMessage(data.message);
    
    // Tự động clear message sau 10 giây
    setTimeout(() => {
      setBackendMessage(null);
    }, 10000);
    
    // Không hiển thị toast vì đã có banner
    return true; // Có backend message
  }
  return false; // Không có backend message
};

const handleBackendError = (err, setBackendMessage) => {
  if (err.response?.data?.message) {
    setBackendMessage(err.response.data.message);
    
    // Tự động clear error message sau 15 giây
    setTimeout(() => {
      setBackendMessage(null);
    }, 15000);
    
    // Không hiển thị toast vì đã có banner
    return true; // Có backend error message
  }
  return false; // Không có backend error message
};

// Optimized ShiftTable với React 19 features
const ShiftTable = React.memo(({
  data,
  loading,
  dateFilter,
  onDateFilterChange,
  pagination,
  onPaginationChange,
  searchText,
  onSearchChange,
  onOpenShiftSchedule,
}) => {
  const tableId = useId(); // Sử dụng useId cho unique ID


  const columns = [
    {
      title: 'Ca làm việc',
      dataIndex: 'code',
      key: 'code',
      className: 'custom-header border-gray-200',
      width: 120,
      render: (text) => <span className="text-sm font-medium">Ca {text}</span>,
    },
    {
      title: 'Địa điểm',
      dataIndex: 'code',
      key: 'location',
      className: 'custom-header border-gray-200',
      width: 120,
      render: (code) => <span>{getShiftName(code)}</span>,
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      className: 'custom-header border-gray-200',
      width: 120,
      render: (date) => format(new Date(date), 'dd/MM/yyyy', { locale: vi }),
    },
    {
      title: 'Thành viên',
      dataIndex: 'Users',
      key: 'users',
      className: 'custom-header border-gray-200',
      render: (users, record) => (
        <span>
          {record.status === 'done'
            ? (record.Users?.map(user => user.fullname).join(', ') || 'Chưa có thành viên')
            : (users?.map(user => user.fullname).join(', ') || 'Chưa có thành viên')
          }
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      className: 'custom-header border-gray-200',
      width: 120,
      defaultSortOrder: 'ascend',
      sorter: (a, b) => {
        const statusOrder = {
          'doing': 2,
          'handover': 1,
          'waiting': 3,
          'done': 4,
        };
        return statusOrder[a.status] - statusOrder[b.status];
      },
      render: (status) => (
        <Badge color={getStatusColor(status)}>
          <span className="text-xs">{getStatusText(status)}</span>
        </Badge>
      ),
    },
  ];

  return (
    <div className="p-6 bg-[#F8F9FD]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-base font-medium text-[#2D3958]">Danh sách ca làm việc</h3>
        <Space>
          <Button
            type="primary"
            icon={<CalendarOutlined />}
            onClick={onOpenShiftSchedule}
            className="bg-[#0F60FF] hover:bg-[#0040FF] border-[#0F60FF]"
          >
            Lịch làm việc
          </Button>
          <input
            type="text"
            placeholder="Tìm kiếm ..."
            value={searchText}
            onChange={onSearchChange}
            className="px-3 py-1 border border-[#E5E9F2] rounded-lg focus:border-[#0F60FF] focus:outline-none"
            style={{ minWidth: '150px' }}
            id={`${tableId}-search`}
            aria-label="Tìm kiếm ca làm việc"
          />
          <DatePicker
            value={dateFilter}
            placeholder="Chọn ngày ... "
            onChange={onDateFilterChange}
            locale={locale}
            allowClear
            className="border-[#E5E9F2] hover:border-[#0F60FF] rounded-lg"
          />
        </Space>
      </div>

      <Table
        dataSource={data}
        columns={columns}
        bordered
        rowKey={(record) => `shift-${record.code}-${record.date}`}
        size="small"
        id={tableId}
        pagination={{
          current: pagination.page,
          pageSize: pagination.limit,
          total: pagination.total,
          onChange: onPaginationChange,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['15', '20', '50', '100'],
          defaultPageSize: 15,
          locale: { items_per_page: '/ Trang' },
          showTotal: (total) => `Tổng số ${total} ca`
        }}
        loading={loading}
        className="custom-table"
        locale={{
          emptyText: dateFilter
            ? 'Không có ca làm việc nào trong ngày đã chọn'
            : 'Không có dữ liệu ca làm việc'
        }}
      />
    </div>
  );
});

// Optimized ShiftCard với React.memo và performance optimizations
const ShiftCard = React.memo(({ shift, onSelect, currentShift }) => {
  const cardId = useId(); // Sử dụng useId cho unique ID
  const { currentUser } = useAuth();
  const isManager = currentUser?.role?.toLowerCase() === 'manager';

  // Memoize expensive calculations
  const userNames = useMemo(() => {
    return shift.Users?.map(user => user.fullname).join(', ') || 'Chưa có thành viên';
  }, [shift.Users]);

  const canSelect = useMemo(() => {
    // Manager không thể chọn ca
    if (isManager) return false;
    
    // Đã có ca hiện tại thì không thể chọn ca khác
    if (currentShift) return false;
    
    // Ca đã kết thúc hoặc đang bàn giao thì không thể chọn
    if (shift.status === 'done' || shift.status === 'handover') return false;
    
    // Chỉ có thể chọn ca ở trạng thái waiting hoặc doing
    return ['waiting', 'doing'].includes(shift.status);
  }, [currentShift, shift.status, isManager]);
  return (
    <div
      className="flex flex-col bg-white rounded-xl border border-solid border-[#E5E9F2] p-4 hover:border-[#0F60FF] transition-colors shadow-sm"
      id={cardId}
      data-shift-id={shift.id}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium text-[#2D3958] " >Ca {shift.code}</h3>
        <Badge color={getStatusColor(shift.status)}>
          {getStatusText(shift.status)}
        </Badge>
      </div>
      <div className="text-sm text-[#8F95B2] mb-3 line-clamp-2">
        {shift.status !== 'doing' ? (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <span className="text-[#8F95B2]"></span>
              <span className='text-[#8F95B2]'>{userNames}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <span className="text-[#8F95B2]"></span>
            <span className="font-medium text-blue-600 ">{userNames}</span>
          </div>
        )}
      </div>
      <div className="mt-auto">
        {canSelect && (
          <button
            onClick={() => onSelect(shift)}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-[#0F60FF] rounded-lg hover:bg-[#0040FF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Chọn ca
          </button>
        )}
      </div>
    </div>
  );
});



// Optimized ShiftGroup với React.memo
const ShiftGroup = React.memo(({ shifts, title, currentShift, onSelect, locations, shiftLayout }) => {
  const groupId = useId(); // Sử dụng useId cho unique ID

  // Kiểm tra data readiness
  const isDataReady = shifts && locations && shiftLayout && shiftLayout.length > 0;

  if (!isDataReady) {
    return (
      <div className="space-y-6" id={groupId}>
        <h3 className="font-medium text-[#2D3958] mb-3">{title}</h3>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Lấy danh sách group có dữ liệu từ shifts
  const availableGroups = Array.from(new Set(shifts.map(shift => shift.code[0])));

  // Tạo layout giữ tất cả nhóm theo thứ tự, kể cả nhóm không có dữ liệu
  const displayGroups = shiftLayout
    .map(group => ({
      code: group.code,
      name: group.name,
      locationId: group.locationId,
      hasData: availableGroups.includes(group.code) // Đánh dấu nhóm có dữ liệu
    }));
  
  // Sắp xếp theo locationId từ backend để đảm bảo thứ tự chính xác
  const sortedGroup = [...displayGroups].sort((a, b) => {
    // Sử dụng locationId nếu có, nếu không thì fallback về code
    const aId = a.locationId || 0;
    const bId = b.locationId || 0;
    return aId - bId;
  });



  // Render layout theo LAYOUT_CONFIG.mode
  const currentMode = LAYOUT_CONFIG.mode;
  const totalGroups = shiftLayout.length;

  if (currentMode === 'horizontal') {
    // Layout mới: Nhóm ca theo dòng, ca theo cột
    return (
      <div className="space-y-6" id={groupId}>
        <h3 className="font-medium text-[#2D3958] mb-3">{title}</h3>

        {sortedGroup.map((group) => {
          const locationInfo = getLocationInfo(group.code + '1', locations);
          const groupName = group.name || locationInfo?.name || group.code;
          const groupShifts = shifts.filter(shift => shift.code.startsWith(group.code));

          return (
            <div key={`location-${group.code}-${title}`} className="rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="font-medium text-[#2D3958] text-lg">{groupName}</h3>
                {locationInfo && (
                  <Tooltip
                    title={
                      <div>
                        {locationInfo.description && (
                          <div><strong>Địa chỉ:</strong> {locationInfo.description}</div>
                        )}
                        {locationInfo.hotline && (
                          <div><strong>Hotline:</strong> {locationInfo.hotline}</div>
                        )}
                      </div>
                    }
                    placement="right"
                  >
                    <InfoCircleOutlined className="text-blue-500 cursor-pointer" />
                  </Tooltip>
                )}
              </div>

              <div
                className={LAYOUT_CONFIG.horizontal.containerClass}
                style={{
                  gridTemplateColumns: LAYOUT_CONFIG.horizontal.gridTemplateColumns
                }}
              >
                {groupShifts.length > 0 ? (
                  groupShifts.map(shift => (
                    <ShiftCard
                      key={`shift-${shift.code}-${shift.date}`}
                      shift={shift}
                      currentShift={currentShift}
                      onSelect={onSelect}
                    />
                  ))
                ) : (
                  <div className="flex items-center justify-center p-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                    <div className="text-center">
                      <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="text-sm">Không có ca làm việc</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  } else {
    // Layout cũ: Nhóm ca theo cột, ca theo dòng
    return (
      <div className="space-y-4">
        <h3 className="font-medium text-[#2D3958] mb-3">{title}</h3>
        <div 
          className="fixed-grid"
          style={{
            gridTemplateColumns: `repeat(${totalGroups}, 1fr)`,
            gap: '1.5rem'
          }}
        >
          {sortedGroup.map((group) => {
            const locationInfo = getLocationInfo(group.code + '1', locations);
            const groupName = group.name || locationInfo?.name || group.code;

            return (
              <div key={`location-${group.code}-${title}`}>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-medium text-[#2D3958]">{groupName}</h3>
                  {locationInfo && (
                    <Tooltip
                      title={
                        <div>
                          {locationInfo.description && (
                            <div><strong>Địa chỉ:</strong> {locationInfo.description}</div>
                          )}
                          {locationInfo.hotline && (
                            <div><strong>Hotline:</strong> {locationInfo.hotline}</div>
                          )}
                        </div>
                      }
                      placement="right"
                    >
                      <InfoCircleOutlined className="text-blue-500 cursor-pointer" />
                    </Tooltip>
                  )}
                </div>
                <div className="space-y-4">
                  {(() => {
                    const groupShifts = shifts.filter(shift => shift.code.startsWith(group.code));
                    return groupShifts.length > 0 ? (
                      groupShifts.map(shift => (
                        <ShiftCard
                          key={`shift-${shift.code}-${shift.date}`}
                          shift={shift}
                          currentShift={currentShift}
                          onSelect={onSelect}
                        />
                      ))
                    ) : (
                      <div >
                      </div>
                    );
                  })()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
});

export default function ShiftSelector() {
  // React 19 features
  const [isPending, startTransition] = useTransition(); // React 19 feature
  const [searchText, setSearchText] = useState('');
  const deferredSearchText = useDeferredValue(searchText); // React 19 feature
  const componentId = useId(); // Unique ID cho component chính

  // State
  const [currentShift, setCurrentShift] = useState(null);
  const [availableShifts, setAvailableShifts] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [exitModalVisible, setExitModalVisible] = useState(false);
  const [selectedShiftCode, setSelectedShiftCode] = useState(null);
  const [selectedshiftDate, setSelectedShiftDate] = useState(null);
  const [backendMessage, setBackendMessage] = useState(null);
  const [locations, setLocations] = useState([]);
  const [handoverId, setHandoverId] = useState(null);
  const [shiftLayout, setShiftLayout] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // State cho modal lịch trực
  const [shiftScheduleModalVisible, setShiftScheduleModalVisible] = useState(false);
  const [handoverStatus, setHandoverStatus] = useState(null);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 0
  });

  // Refs
  const abortControllerRef = useRef(null);
  const isComponentMountedRef = useRef(false);
  const hasInitialListFetchedRef = useRef(false);

  // Hooks
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isManager = currentUser?.role?.toLowerCase() === 'manager';

  // Optimized search với useDeferredValue và memoization
  const filteredShifts = useMemo(() => {
    if (!shifts || !Array.isArray(shifts)) return [];



    if (!deferredSearchText.trim()) return shifts;

    // Optimize search performance với Set
    const searchLower = deferredSearchText.toLowerCase();
    const filtered = shifts.filter(shift => {
      // Check code first (most common search)
      if (shift.code.toLowerCase().includes(searchLower)) return true;

      // Check location name
      if (getShiftName(shift.code).toLowerCase().includes(searchLower)) return true;

      // Check users (most expensive operation last)
      return shift.Users?.some(user =>
        user.fullname.toLowerCase().includes(searchLower)
      ) || false;
    });



    return filtered;
  }, [shifts, deferredSearchText]);

  // Event handlers - Di chuyển lên trước để tránh TDZ
  const handleUnauthorized = useCallback(() => {
    localStorage.clear();
    navigate('/login');
  }, [navigate]);

  const fetchHandoverIdForShift = useCallback(async (shiftId) => {
    if (!shiftId) {
      setHandoverId(null);
      setHandoverStatus(null);
      return;
    }

    try {
      // Tìm handover với các trạng thái phù hợp cho việc nhận bàn giao
      const { data } = await axios.get('/api/shifts/handover/by-status/all', {
        params: {
          toShiftId: shiftId
        }
      });

      // Tìm handover phù hợp nhất (ưu tiên pending, sau đó completed)
      const suitableHandover = data.handovers?.find(handover => {
        const isSuitable = handover.status === 'pending' || handover.status === 'completed';
        return isSuitable;
      });

      if (suitableHandover) {
        setHandoverId(suitableHandover.id);
        setHandoverStatus(suitableHandover.status);
      } else {
        setHandoverId(null);
        setHandoverStatus(null);
      }
    } catch (err) {
      console.error('Lỗi khi lấy handover ID:', err);
      if (err.response?.status === 401) {
        handleUnauthorized();
      }
      setHandoverId(null);
      setHandoverStatus(null);
    }
  }, [handleUnauthorized]);

  // Fetch data functions
  const fetchShiftLayout = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/shifts/layout');
      const layoutData = data.data || [];
      setShiftLayout(layoutData);
    } catch (err) {
      console.error('Lỗi khi lấy layout ca trực:', err);
      if (err.response?.status === 401) {
        handleUnauthorized();
      }
      // Set empty array as fallback
      setShiftLayout([]);
    }
  }, [handleUnauthorized]);

  const fetchLocations = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/locations');
      setLocations(data);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách location:', err);
      if (err.response?.status === 401) {
        handleUnauthorized();
      }
    }
  }, [handleUnauthorized]);


  const fetchCurrentShift = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/shifts/current');

      // Không set currentShift ở đây nữa, sẽ set trong logic bên dưới

      if (data.shift?.id) {
        // Cập nhật currentShift trước, sau đó fetch handover
        setCurrentShift(data.shift);
        // Gọi fetchHandoverIdForShift sau khi currentShift đã được set
        setTimeout(() => {
          fetchHandoverIdForShift(data.shift.id);
        }, 0);
      } else {
        setCurrentShift(null);
        setHandoverId(null);
        setHandoverStatus(null);
      }

      if (data.message) {
        setBackendMessage(data.message);
      }
    } catch (err) {
      console.error('Lỗi khi lấy ca trực:', err);
      if (err.response?.status === 401) {
        handleUnauthorized();
      }
      if (err.response?.data?.message) {
        setBackendMessage(err.response.data.message);
      }
    }
  }, [handleUnauthorized]);

  const fetchAvailableShifts = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/shifts/today-available');
      setAvailableShifts(data);
      if (data.message) {
        setBackendMessage(data.message);
      }
    } catch (err) {
      console.error('Lỗi khi lấy danh sách ca:', err);
      if (err.response?.status === 401) {
        handleUnauthorized();
      }
      if (err.response?.data?.message) {
        setBackendMessage(err.response.data.message);
      }
    }
  }, []);

  const fetchShifts = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit
      };

      if (dateFilter) {
        params.date = dateFilter.format('YYYY-MM-DD');
      }

      const { data } = await axios.get('/api/shifts/all', { params });

      setShifts(data.shifts);
      setPagination(prev => ({
        ...prev,
        total: data.total,
        totalPages: data.totalPages
      }));

      if (data.message) {
        setBackendMessage(data.message);
      }
    } catch (err) {
      console.error('Lỗi khi lấy danh sách tất cả ca:', err);
      if (err.response?.status === 401) {
        handleUnauthorized();
      }
      if (err.response?.data?.message) {
        setBackendMessage(err.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, dateFilter]); // Bỏ handleUnauthorized để tránh vòng lặp

  // Optimized data fetching với useTransition
  const fetchData = useCallback(async () => {
    // Cancel any ongoing requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      // Fetch data tuần tự thay vì đồng thời để đảm bảo thứ tự

      // 1. Fetch currentShift trước
      await fetchCurrentShift();

      // 2. Fetch các data khác
      await Promise.all([
        fetchAvailableShifts(),
        fetchShifts(),
        fetchLocations(),
        fetchShiftLayout()
      ]);

      // Sử dụng startTransition để cập nhật state
      startTransition(() => {
        setLoading(false);
      });
    } catch (error) {
      if (error.name === 'AbortError') {
        return;
      }
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) {
        handleUnauthorized();
      }
    }
  }, [fetchCurrentShift, fetchAvailableShifts, fetchShifts, fetchLocations, fetchShiftLayout, handleUnauthorized]);

  // Optimized shift selection
  const handleShiftSelect = useCallback((shift) => {
    // Clear backend message khi bắt đầu action mới
    setBackendMessage(null);
    
    startTransition(() => {
      setSelectedShiftCode(shift.code);
      setSelectedShiftDate(shift.date);
      setConfirmModalVisible(true);
    });
  }, [startTransition]);

  const handleConfirmSelect = useCallback(async () => {
    try {
      const { data } = await axios.put('/api/shifts/select', {
        shiftCode: selectedShiftCode,
        shiftDate: selectedshiftDate
      });
      handleBackendMessage(data, setBackendMessage);
      // Sau khi chọn ca, cần lấy lại currentShift và handoverId ngay để bật nút "Nhận bàn giao"
      const currentShiftResponse = await axios.get('/api/shifts/current');
      const newCurrentShift = currentShiftResponse.data.shift;
      setCurrentShift(newCurrentShift);

      // Đảm bảo handoverId đã được set (nếu có)
      if (newCurrentShift?.id) {
        setTimeout(() => {
          fetchHandoverIdForShift(newCurrentShift.id);
        }, 0);
      }

      // Sau đó đồng bộ các dữ liệu còn lại
      await Promise.all([
        fetchAvailableShifts(),
        fetchShifts(),
        fetchLocations(),
        fetchShiftLayout()
      ]);
    } catch (err) {
      console.error('Lỗi khi chọn ca:', err);
      handleBackendError(err, setBackendMessage);
    } finally {
      setConfirmModalVisible(false);
      setSelectedShiftCode(null);
      setSelectedShiftDate(null);
    }
  }, [selectedShiftCode, selectedshiftDate, fetchHandoverIdForShift, fetchAvailableShifts, fetchShifts, fetchLocations, fetchShiftLayout]); // Bỏ fetchData để tránh vòng lặp

  const handleExitShift = useCallback(() => {
    // Clear backend message khi bắt đầu action mới
    setBackendMessage(null);
    setExitModalVisible(true);
  }, []);

  const handleConfirmExit = useCallback(async () => {
    try {
      const { data } = await axios.put(`/api/shifts/${currentShift.id}/exit`);
      handleBackendMessage(data, setBackendMessage);
      fetchData();
    } catch (err) {
      console.error('Lỗi khi thoát ca:', err);
      handleBackendError(err, setBackendMessage);
    } finally {
      setExitModalVisible(false);
    }
  }, [currentShift, fetchData]); // Bỏ fetchData để tránh vòng lặp

  const handleRefresh = useCallback(() => {
    fetchData();
  }, [fetchData]); // Bỏ fetchData để tránh vòng lặp

  // Handle pagination change
  const handlePaginationChange = useCallback((page, pageSize) => {
    setPagination(prev => ({
      ...prev,
      page,
      limit: pageSize
    }));
  }, []);

  // Handle date filter change
  const handleDateFilterChange = useCallback((date) => {
    setDateFilter(date);
    setPagination(prev => ({
      ...prev,
      page: 1 // Reset to first page when filter changes
    }));
  }, []);

  // Handle clear date filter
  const handleClearDateFilter = useCallback(() => {
    setDateFilter(null);
    setPagination(prev => ({
      ...prev,
      page: 1 // Reset to first page when filter changes
    }));
  }, []);

  // Handle modal lịch trực
  const handleOpenShiftSchedule = useCallback(() => {
    setShiftScheduleModalVisible(true);
  }, []);

  const handleCloseShiftSchedule = useCallback(() => {
    setShiftScheduleModalVisible(false);
  }, []);

  // Render functions
  const renderCurrentShiftTab = useCallback(() => {
    // Kiểm tra data readiness
    if (!isInitialized || !shiftLayout) {
      return (
        <div className="flex justify-center items-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải dữ liệu ca làm việc...</p>
          </div>
        </div>
      );
    }

    // Lọc ca làm việc theo ngày
    const todayShifts = availableShifts.filter(shift => {
      const shiftDate = new Date(shift.date);
      const today = new Date();
      return (
        shiftDate.getDate() === today.getDate() &&
        shiftDate.getMonth() === today.getMonth() &&
        shiftDate.getFullYear() === today.getFullYear()
      );
    });

    const previousDayShifts = availableShifts.filter(shift => {
      const shiftDate = new Date(shift.date);
      const today = new Date();
      today.setDate(today.getDate() - 1);
      return (
        shiftDate.getDate() === today.getDate() &&
        shiftDate.getMonth() === today.getMonth() &&
        shiftDate.getFullYear() === today.getFullYear() &&
        (shift.status === 'handover' || shift.status === 'doing' || shift.status === 'waiting' || shift.status === 'not-started' )
      );
    });

    return (
      <div className="space-y-6 p-6 bg-[#F8F9FD]">
        {backendMessage && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
            <div className="flex justify-between items-start">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    {backendMessage}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setBackendMessage(null)}
                className="text-blue-400 hover:text-blue-600 transition-colors"
                aria-label="Đóng thông báo"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {!isManager && (
          <div className="bg-white rounded-xl border border-[#E5E9F2] p-4 shadow-sm">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-[#2D3958] font-medium">Bạn đang làm:</span>
                {currentShift ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[#2D3958]">Ca {currentShift.code} ({format(new Date(currentShift.date), 'dd/MM/yyyy', { locale: vi })})</span>
                    <Badge color={getStatusColor(currentShift.status)}>
                      {getStatusText(currentShift.status)}
                    </Badge>
                  </div>
                ) : (
                  <span className="text-[#8F95B2]">Bạn chưa vào ca nào</span>
                )}
              </div>
              <div className="flex items-center gap-2">


                {currentShift && handoverStatus === 'completed' && (
                  <Tooltip title="Vào trang quản lý công việc của ca hiện tại" placement="top">
                    <button
                      onClick={() => navigate('/dc/my-shifts')}
                      className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      Vào ca làm việc
                    </button>
                  </Tooltip>
                )}
                {currentShift && handoverId && handoverStatus !== 'completed' && (
                  <Tooltip title="Xác nhận biên bản bàn giao ca" placement="top">
                    <button
                      onClick={() => navigate(`/dc/handover/${handoverId}`)}
                      className="px-4 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      Nhận bàn giao
                    </button>
                  </Tooltip>
                )}
                {currentShift && (
                  <Tooltip title="Thoát khỏi ca làm việc hiện tại" placement="top">
                    <button
                      onClick={handleExitShift}
                      className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      Thoát ca
                    </button>
                  </Tooltip>
                )}
                {!currentShift && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Vui lòng chọn ca làm việc để sử dụng các tính năng quản lý công việc</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <h2 className="text-xxl font-semibold text-[#2D3958] text-center mb-6">
          Ca làm việc tại các Trung Tâm Dữ Liệu
        </h2>

        <ShiftGroup
          shifts={todayShifts}
          title={format(new Date(), 'dd/MM/yyyy', { locale: vi })}
          currentShift={currentShift}
          onSelect={handleShiftSelect}
          locations={locations}
          shiftLayout={shiftLayout}
        />
        {previousDayShifts.length > 0 && (
          <ShiftGroup
            shifts={previousDayShifts}
            title={format(dayjs().subtract(1, 'day').toDate(), 'dd/MM/yyyy', { locale: vi })}
            currentShift={currentShift}
            onSelect={handleShiftSelect}
            locations={locations}
            shiftLayout={shiftLayout}
          />
        )}
      </div>
    );
  }, [availableShifts, currentShift, handleExitShift, handleRefresh, handleShiftSelect, backendMessage, isManager, locations, shiftLayout, isInitialized, handoverStatus, handoverId, navigate]);

  // Tabs configuration
  const items = [
    {
      key: 'tab-current-shift',
      label: 'Ca làm việc',
      children: renderCurrentShiftTab(),
    },
    {
      key: 'tab-all-shifts',
      label: 'Danh sách ca làm việc',
      children: loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {isPending && (
            <div className="flex justify-center items-center py-4">
              <Spin size="large" />
              <span className="ml-2 text-gray-600">Đang cập nhật dữ liệu...</span>
            </div>
          )}

          <ShiftTable
            data={filteredShifts}
            loading={loading || isPending}
            dateFilter={dateFilter}
            onDateFilterChange={handleDateFilterChange}
            onClearDateFilter={handleClearDateFilter}
            pagination={pagination}
            onPaginationChange={handlePaginationChange}
            searchText={searchText}
            onSearchChange={(e) => setSearchText(e.target.value)}
            onOpenShiftSchedule={handleOpenShiftSchedule}
          />
        </>
      ),
    },
  ];

  // WebSocket connection với proper cleanup
  // Hệ thống realtime update cho:
  // - Chọn ca (select): Cập nhật trạng thái ca và danh sách user
  // - Thoát ca (exit): Cập nhật trạng thái ca và danh sách user  
  // - Bàn giao ca (handover): Cập nhật trạng thái ca từ 'doing' sang 'handover'
  // - Thay đổi trạng thái (status): Cập nhật trạng thái ca (waiting, doing, handover, done)
  // - Cập nhật handoverId: Tự động cập nhật nút "Nhận bàn giao" khi có thay đổi
  useEffect(() => {
    if (!ENABLE_WEBSOCKET) {
      return undefined;
    }

    let ws = null;
    let retryCount = 0;
    let retryTimeout = null;
    let isComponentMounted = true;
    let heartbeatInterval = null;
    let lastHeartbeat = Date.now();
    let currentRetryDelay = INITIAL_RETRY_DELAY;
    let isConnecting = false;
    let isWebSocketInitialized = false;

    // Cleanup function để tránh memory leak
    const cleanup = () => {
      isComponentMounted = false;
      isWebSocketInitialized = false;

      if (ws) {
        ws.close(1000, 'Component unmounting');
        ws = null;
      }

      if (retryTimeout) {
        clearTimeout(retryTimeout);
        retryTimeout = null;
      }

      if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
      }
    };

    const connectWebSocket = () => {
      try {
        if (!WS_URL) {
          console.error('WebSocket URL is not defined');
          return;
        }

        if (isWebSocketInitialized) {
          return;
        }

        if (isConnecting) {
          return;
        }

        if (ws && ws.readyState === WebSocket.OPEN) {
          return;
        }

        if (ws) {
          ws.close();
          ws = null;
        }

        isConnecting = true;
        isWebSocketInitialized = true;
        ws = new WebSocket(WS_URL);

        ws.onopen = () => {
          if (!isComponentMounted) return;
          isConnecting = false;
          retryCount = 0;
          currentRetryDelay = INITIAL_RETRY_DELAY;
          if (retryTimeout) {
            clearTimeout(retryTimeout);
            retryTimeout = null;
          }    

          // Start heartbeat
          heartbeatInterval = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: 'heartbeat' }));
              lastHeartbeat = Date.now();
            }
          }, HEARTBEAT_INTERVAL);
        };

        ws.onmessage = (event) => {
          if (!isComponentMounted) return;
          try {
            const data = JSON.parse(event.data);

            if (data.type === 'shift_update') {
              // Cập nhật shift trong danh sách với React 19 optimizations
              startTransition(() => {
                setAvailableShifts(prevShifts => {
                  const shiftIndex = prevShifts.findIndex(s => s.id === data.shift.id);

                  if (shiftIndex === -1) {
                    // Nếu là shift mới, thêm vào danh sách
                    if (data.changeType === 'select') {
                      return [data.shift, ...prevShifts];
                    }
                    return prevShifts;
                  }

                  // Cập nhật shift hiện có
                  const updatedShifts = [...prevShifts];
                  const currentShift = updatedShifts[shiftIndex];

                  // Kiểm tra version để tránh conflict
                  const currentVersion = currentShift?.version || 0;
                  const newVersion = data.shift?.version || 0;

                  if (newVersion < currentVersion) {
                    return prevShifts;
                  }

                  // Nếu version bằng nhau, kiểm tra thời gian cập nhật
                  if (newVersion === currentVersion) {
                    const currentUpdatedAt = new Date(currentShift.updatedAt || 0).getTime();
                    const newUpdatedAt = new Date(data.shift.updatedAt || 0).getTime();

                    if (newUpdatedAt <= currentUpdatedAt) {
                      return prevShifts;
                    }
                  }

                  // Merge các thay đổi
                  const mergedShift = {
                    ...currentShift,
                    ...data.shift,
                    status: data.shift.status || currentShift.status,
                    version: newVersion,
                    updatedAt: data.shift.updatedAt || new Date().toISOString()
                  };

                  updatedShifts[shiftIndex] = mergedShift;
                  return updatedShifts;
                });
              });

              // Cập nhật current shift nếu cần với React 19 optimizations
              if (data.shift.id === currentShift?.id) {
                startTransition(() => {
                  setCurrentShift(prevShift => {
                    if (!prevShift) return data.shift;

                    // Kiểm tra version cho current shift
                    const currentVersion = prevShift?.version || 0;
                    const newVersion = data.shift?.version || 0;

                    if (newVersion < currentVersion) {
                      return prevShift;
                    }

                    // Nếu version bằng nhau, kiểm tra thời gian cập nhật
                    if (newVersion === currentVersion) {
                      const currentUpdatedAt = new Date(prevShift.updatedAt || 0).getTime();
                      const newUpdatedAt = new Date(data.shift.updatedAt || 0).getTime();

                      if (newUpdatedAt <= currentUpdatedAt) {
                        return prevShift;
                      }
                    }

                    // Merge các thay đổi
                    const updatedShift = {
                      ...prevShift,
                      ...data.shift,
                      version: newVersion,
                      updatedAt: data.shift.updatedAt || new Date().toISOString()
                    };

                    // Cập nhật handoverId nếu cần
                    if (data.changeType === 'select' || data.changeType === 'handover') {
                      // Gọi fetchHandoverIdForShift để cập nhật handoverId
                      setTimeout(() => {
                        fetchHandoverIdForShift(updatedShift.id);
                      }, 100);
                    }

                    return updatedShift;
                  });
                });
              }

              // Cập nhật allShifts nếu đang ở tab danh sách với React 19 optimizations
              startTransition(() => {
                setShifts(prevShifts => {
                  const shiftIndex = prevShifts.findIndex(s => s.id === data.shift.id);
                  if (shiftIndex === -1) return prevShifts;

                  const updatedShifts = [...prevShifts];
                  const currentShift = updatedShifts[shiftIndex];

                  // Kiểm tra version cho allShifts
                  const currentVersion = currentShift?.version || 0;
                  const newVersion = data.shift?.version || 0;

                  if (newVersion < currentVersion) {
                    return prevShifts;
                  }

                  // Nếu version bằng nhau, kiểm tra thời gian cập nhật
                  if (newVersion === currentVersion) {
                    const currentUpdatedAt = new Date(currentShift.updatedAt || 0).getTime();
                    const newUpdatedAt = new Date(data.shift.updatedAt || 0).getTime();

                    if (newUpdatedAt <= currentUpdatedAt) {
                      return prevShifts;
                    }
                  }

                  // Merge các thay đổi
                  const mergedShift = {
                    ...currentShift,
                    ...data.shift,
                    version: newVersion,
                    updatedAt: data.shift.updatedAt || new Date().toISOString()
                  };

                  updatedShifts[shiftIndex] = mergedShift;
                  return updatedShifts;
                });
              });


            }
          } catch (error) {
            console.error('Error processing WebSocket message:', error);
          }
        };

        ws.onerror = (error) => {
          if (!isComponentMounted) return;
          console.error('WebSocket error:', error);

          // Check if connection is stale
          if (Date.now() - lastHeartbeat > HEARTBEAT_TIMEOUT) {
            ws.close();
          }
        };

        ws.onclose = (event) => {
          if (!isComponentMounted) return;
          isConnecting = false;

          // Clear heartbeat interval
          if (heartbeatInterval) {
            clearInterval(heartbeatInterval);
            heartbeatInterval = null;
          }

          if (event.code !== 1000 && retryCount < MAX_RETRIES) {
            retryCount++;

            // Exponential backoff with max delay
            currentRetryDelay = Math.min(currentRetryDelay * 2, MAX_RETRY_DELAY);

            retryTimeout = setTimeout(connectWebSocket, currentRetryDelay);
          }
        };
      } catch (error) {
        console.error('Error creating WebSocket connection:', error);
        if (retryCount < MAX_RETRIES && isComponentMounted) {
          retryCount++;
          currentRetryDelay = Math.min(currentRetryDelay * 2, MAX_RETRY_DELAY);
          retryTimeout = setTimeout(connectWebSocket, currentRetryDelay);
        }
      }
    };

    connectWebSocket();

    return cleanup;
  }, []); // Chỉ chạy 1 lần khi mount, không theo dõi currentShift

  // Effects
  useEffect(() => {
    if (isComponentMountedRef.current) {
      return;
    }

    isComponentMountedRef.current = true;
    let interval;


    const initializeData = async () => {
      try {
        // Fetch tuần tự để đảm bảo thứ tự và tránh race condition
        await fetchCurrentShift();

        await fetchLocations();

        await fetchShiftLayout();

        await Promise.all([
          fetchAvailableShifts(),
          fetchShifts()
        ]);

        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing data:', error);
        setIsInitialized(true); // Vẫn set true để tránh loading vô hạn
      }

      // Backup interval khi WebSocket fail
      if (AUTO_REFRESH_ENABLED) {
        interval = setInterval(() => {
          // Chỉ fetch nếu WebSocket không hoạt động (kiểm tra qua global)
          const isWebSocketConnected = document.querySelector('[data-ws-status="connected"]');
          if (!isWebSocketConnected) {
            fetchData();
          }
        }, REFRESH_INTERVAL);
      }
    };

    initializeData();

    return () => {
      isComponentMountedRef.current = false;
      if (interval) {
        clearInterval(interval);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []); // Chỉ chạy 1 lần khi component mount


  // Gọi fetchShifts khi pagination hoặc dateFilter thay đổi
  useEffect(() => {
    if (!hasInitialListFetchedRef.current) {
      hasInitialListFetchedRef.current = true;
      return;
    }
    fetchShifts();
  }, [pagination.page, pagination.limit, dateFilter]); // Bỏ fetchShifts khỏi deps để tránh re-run

  // Theo dõi currentShift và cập nhật handoverId
  useEffect(() => {
    if (currentShift?.id) {
      // Thêm delay nhỏ để đảm bảo state đã được cập nhật
      setTimeout(() => {
        fetchHandoverIdForShift(currentShift.id);
      }, 50);
    } else {
      setHandoverId(null);
      setHandoverStatus(null);
    }
  }, [currentShift?.id, fetchHandoverIdForShift]);

  return (
    <ErrorBoundary>
      <div className="bg-[#F8F9FD] rounded-lg shadow-sm" id={componentId}>
        <Tabs
          defaultActiveKey="tab-current-shift"
          items={items}
          className="custom-tabs"
          tabBarStyle={{
            marginBottom: 0,
            paddingLeft: '24px',
            borderBottom: '1px solid #E5E9F2'
          }}
        />
        <style>{`
        .ant-tabs-nav {
          margin: 0 !important;
        }
        .ant-tabs-tab {
          padding: 12px 0 !important;
          margin: 0 24px 0 0 !important;
        }
        .ant-tabs-tab-btn {
          color: #8F95B2 !important;
          font-weight: 500 !important;
        }
        .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #0F60FF !important;
        }
        .ant-tabs-ink-bar {
          background: #0F60FF !important;
          height: 2px !important;
        }
        
        /* Responsive grid cho nhiều nhóm ca - động theo số lượng */
        @media (min-width: 768px) {
          .md\\:grid-cols-1 {
            grid-template-columns: repeat(1, 1fr);
          }
          .md\\:grid-cols-2 {
            grid-template-columns: repeat(2, 1fr);
          }
          .md\\:grid-cols-3 {
            grid-template-columns: repeat(3, 1fr);
          }
          .md\\:grid-cols-4 {
            grid-template-columns: repeat(4, 1fr);
          }
          .md\\:grid-cols-5 {
            grid-template-columns: repeat(5, 1fr);
          }
          .md\\:grid-cols-6 {
            grid-template-columns: repeat(6, 1fr);
          }
          .md\\:grid-cols-auto-fit {
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          }
        }
        
        /* Responsive cho màn hình lớn */
        @media (min-width: 1024px) {
          .md\\:grid-cols-4 {
            grid-template-columns: repeat(4, 1fr);
          }
          .md\\:grid-cols-5 {
            grid-template-columns: repeat(5, 1fr);
          }
          .md\\:grid-cols-6 {
            grid-template-columns: repeat(6, 1fr);
          }
        }
        
        /* Responsive cho màn hình rất lớn */
        @media (min-width: 1280px) {
          .md\\:grid-cols-5 {
            grid-template-columns: repeat(5, 1fr);
          }
          .md\\:grid-cols-6 {
            grid-template-columns: repeat(6, 1fr);
          }
        }
        
        /* Đảm bảo grid items không bị dồn khi có cột trống */
        .grid > div {
          min-height: 200px;
        }
        
        /* Grid container với vị trí cột cố định */
        .fixed-grid {
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: 1fr;
          gap: 1.5rem;
        }
        
        /* Placeholder cho cột trống */
        .empty-column {
          min-height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8f9fa;
          border: 2px dashed #dee2e6;
          border-radius: 8px;
        }
        
        /* Responsive cho grid động */
        @media (max-width: 767px) {
          .fixed-grid {
            grid-auto-flow: row;
            grid-auto-rows: auto;
          }
        }
      `}</style>

        {/* Confirmation Modal for Shift Selection */}
        <Modal
          title="Xác nhận chọn ca"
          open={confirmModalVisible}
          onOk={handleConfirmSelect}
          onCancel={() => {
            setConfirmModalVisible(false);
            setSelectedShiftCode(null);
          }}
          okText="Xác nhận"
          cancelText="Hủy"
          okButtonProps={{ className: 'bg-[#003c71]' }}
        >
          <p>Bạn có chắc chắn muốn chọn ca {selectedShiftCode} không?</p>
        </Modal>

        {/* Confirmation Modal for Exit Shift */}
        <Modal
          title="Xác nhận thoát ca"
          open={exitModalVisible}
          onOk={handleConfirmExit}
          onCancel={() => setExitModalVisible(false)}
          okText="Xác nhận"
          cancelText="Hủy"
          okButtonProps={{ className: 'bg-[#003c71]' }}
        >
          <p>Bạn có chắc chắn muốn thoát ca hiện tại không?</p>
        </Modal>

        {/* Modal lịch trực */}
        <ShiftScheduleModal
          visible={shiftScheduleModalVisible}
          onCancel={handleCloseShiftSchedule}
          locationId="all"
        />
      </div>
    </ErrorBoundary>
  );
}
