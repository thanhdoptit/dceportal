import { ContactsOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, DatePicker, Form, Input, message, Select, Space, Typography } from 'antd';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { renderChangeContent } from '../components/tasks/taskChangeUtils';
import TaskFilters from '../components/tasks/TaskFilters';
import TaskModal from '../components/tasks/TaskModal';
import TaskReasonModal from '../components/tasks/TaskReasonModal';
import TaskTable from '../components/tasks/TaskTable';
import { STATUS_LABELS } from '../constants/taskStatus';
import { useAuth } from '../contexts/AuthContext';
import { useLocations } from '../hooks/useLocations';
import {
  createTask,
  deleteTask,
  fetchAllTasks,
  fetchTaskDetail as fetchTaskDetailApi,
  lockTask,
  unlockTask,
  updateTask,
  updateTaskStatus,
} from '../services/taskService';
import {
  downloadFile,
  getAuthHeader,
  getCurrentUserId,
  getCurrentUserRole,
  handleAttachmentRemove,
  handleModalSubmit,
  handleReasonSubmit,
  handleReopen,
  showModal,
  showReasonModal,
} from '../utils/taskModalUtils';
import { processFileName } from '../utils/VietnameseFile';

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title } = Typography;

const API_URL = import.meta.env.VITE_API_URL;
const WS_URL = API_URL.replace('http', 'ws') + '/ws';

export default function TaskPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Sử dụng custom hook cho locations
  const {
    locations,
    loading: locationsLoading,
    error: locationsError,
  } = useLocations({
    autoFetch: true,
    activeOnly: false,
    onError: error => {
      console.error('Error loading locations:', error);
    },
  });

  // States
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('view');
  const [selectedTask, setSelectedTask] = useState(null);
  const [reopenForm] = Form.useForm();
  const [removedAttachments, setRemovedAttachments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allTasks, setAllTasks] = useState([]);
  const [inputValue, setInputValue] = useState(''); // State riêng cho input value - tránh re-render
  const fetchAllTasksDataWithSearchRef = useRef();
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    dateRange: null,
    location: null,
  });

  // Add filter state with debounce
  const [pendingAction, setPendingAction] = useState(null);
  const [reasonModalVisible, setReasonModalVisible] = useState(false);
  const [reasonForm] = Form.useForm();
  const [reopenModalVisible, setReopenModalVisible] = useState(false);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 0,
  });

  // Function riêng cho search - tối ưu hóa dependencies
  const fetchAllTasksDataWithSearch = useCallback(
    async (searchText, page, limit) => {
      setLoading(true);
      try {
        const params = {
          page,
          limit,
        };

        // Thêm các tham số filter
        if (filters.status) params.status = filters.status;
        if (filters.location) {
          const selectedLocation = locations.find(loc => loc.id === filters.location);
          if (selectedLocation) {
            params.location = selectedLocation.name;
          }
        }
        if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
          params.fromDate = filters.dateRange[0].startOf('day').toISOString();
          params.toDate = filters.dateRange[1].endOf('day').toISOString();
        }
        if (filters.dateField) params.dateField = filters.dateField;
        if (searchText?.trim()) params.search = searchText.trim();

        const res = await fetchAllTasks(params);
        setAllTasks(res.tasks);
        setPagination(prev => ({
          ...prev,
          total: res.total,
          totalPages: res.totalPages,
        }));
      } catch (error) {
        console.error('Error fetching tasks:', error);
        if (error.message === 'Token expired') {
          message.error('Phiên đăng nhập đã hết hạn');
          navigate('/login');
          return;
        }
        message.error('Không thể tải danh sách công việc');
      } finally {
        setLoading(false);
      }
    },
    [navigate, filters.status, filters.location, filters.dateRange, filters.dateField, locations]
  );

  // Update ref với function hiện tại
  useEffect(() => {
    fetchAllTasksDataWithSearchRef.current = fetchAllTasksDataWithSearch;
  }, [fetchAllTasksDataWithSearch]);

  // Function cho các trường hợp khác (không search)
  const fetchAllTasksData = useCallback(async (page, limit) => {
    if (fetchAllTasksDataWithSearchRef.current) {
      await fetchAllTasksDataWithSearchRef.current('', page, limit);
    }
  }, []);

  // Simple filtering - chỉ filter theo status, search sẽ dùng server-side
  const filteredTasks = useMemo(() => {
    if (!filters.status || filters.status === 'all') {
      return allTasks;
    }
    return allTasks.filter(task => task.status === filters.status);
  }, [allTasks, filters.status]);

  // Chỉ render data khi có kết quả từ API, không render ngay khi gõ
  const displayTasks = useMemo(() => {
    // Nếu đang loading và có search text, không render data cũ
    if (loading && inputValue?.trim()) {
      return [];
    }
    return filteredTasks;
  }, [filteredTasks, loading, inputValue]);

  // Tìm kiếm với debounce - tối ưu hóa chuyên gia
  const debouncedSearch = useCallback(
    debounce(searchText => {
      setPagination(prev => ({ ...prev, page: 1 }));
      // Gọi API với searchText trực tiếp, sử dụng ref để tránh stale closure
      if (fetchAllTasksDataWithSearchRef.current) {
        fetchAllTasksDataWithSearchRef.current(searchText, 1, 15);
      }
    }, 300), // Delay 300ms
    [] // Không có dependency để tránh circular dependency
  );

  // Xử lý tìm kiếm - tối ưu hóa chuyên gia
  const handleSearch = useCallback(
    searchText => {
      // Update input value ngay lập tức - không gây re-render
      setInputValue(searchText);
      // Update filters.search để sync với UI
      setFilters(prev => ({ ...prev, search: searchText }));
      // Debounce API call
      debouncedSearch(searchText);
    },
    [debouncedSearch]
  );

  // Update pagination for client-side status filter - tối ưu hóa
  useEffect(() => {
    if (filters.status && filters.status !== 'all') {
      const filteredLength = allTasks.filter(task => task.status === filters.status).length;
      setPagination(prev => ({
        ...prev,
        total: filteredLength,
        totalPages: Math.ceil(filteredLength / prev.limit),
        page: 1,
      }));
    }
  }, [allTasks, filters.status]);

  // Sync inputValue với filters.search khi component mount
  useEffect(() => {
    setInputValue(filters.search || '');
  }, []);

  // Combined data fetch for both filter and pagination changes
  useEffect(() => {
    console.log('Data fetch triggered:', {
      page: pagination.page,
      limit: pagination.limit,
      location: filters.location,
      dateRange: filters.dateRange,
      dateField: filters.dateField,
      status: filters.status,
    });
    fetchAllTasksData(pagination.page, pagination.limit);
  }, [
    pagination.page,
    pagination.limit,
    filters.location,
    filters.dateRange,
    filters.dateField,
    filters.status,
    locations.length,
  ]);

  // Fetch task detail with version
  const fetchTaskDetail = async taskId => {
    try {
      const taskData = await fetchTaskDetailApi(taskId);
      setSelectedTask(taskData);
      return taskData;
    } catch (error) {
      console.error('Error fetching task detail:', error);
      if (error.message === 'Token expired') {
        message.error('Phiên đăng nhập đã hết hạn');
        navigate('/login');
        return;
      }
      message.error('Không thể tải thông tin chi tiết');
      return null;
    }
  };

  // Handle status change
  const handleStatusChange = async (
    taskId,
    newStatus,
    isSystemChange = false,
    customReason = null
  ) => {
    try {
      const task = allTasks.find(t => t.id === taskId);
      if (!task) {
        console.error('Task not found:', taskId);
        message.error('Không tìm thấy công việc');
        return;
      }

      if (task.status === newStatus) {
        console.log('Status unchanged, skipping update:', {
          taskId,
          currentStatus: task.status,
          newStatus,
        });
        return;
      }

      let changeReason = customReason;
      if (!changeReason && !isSystemChange) {
        const statusLabels = {
          waiting: 'Chờ xử lý',
          pending: 'Tạm dừng',
          in_progress: 'Đang thực hiện',
          completed: 'Đã kết thúc',
          cancelled: 'Đã hủy',
        };

        const oldStatus = statusLabels[task.status] || task.status;
        const newStatusLabel = statusLabels[newStatus] || newStatus;
        changeReason = `Chuyển trạng thái từ "${oldStatus}" sang "${newStatusLabel}"`;
      }

      const updatedTask = await updateTaskStatus({
        taskId,
        newStatus,
        reason: changeReason,
        userId: currentUser.id,
        system: isSystemChange,
      });

      if (!isSystemChange) {
        message.success('Cập nhật trạng thái thành công');
        fetchAllTasksData(); // Bật lại để đảm bảo danh sách được cập nhật
      }

      setAllTasks(prev => prev.map(t => (t.id === taskId ? updatedTask : t)));

      if (modalVisible && selectedTask && selectedTask.id === taskId) {
        const updatedTaskWithHistory = await fetchTaskDetail(taskId);
        if (updatedTaskWithHistory) {
          setSelectedTask(updatedTaskWithHistory);
        }
      }
    } catch (error) {
      console.error('Status update error:', error);
      if (error.message === 'Token expired') {
        message.error('Phiên đăng nhập đã hết hạn');
        navigate('/login');
        return;
      }
      if (!isSystemChange) {
        message.error('Không thể cập nhật trạng thái');
      }
    }
  };

  // Handle delete
  const handleDelete = async taskId => {
    try {
      await deleteTask(taskId);
      message.success('Xóa công việc thành công');
      setModalType('view');
      setSelectedTask(null);
      fetchAllTasksData();
    } catch (error) {
      if (error.message === 'Token expired') {
        message.error('Phiên đăng nhập đã hết hạn');
        navigate('/login');
        return;
      }
      message.error('Không thể xóa công việc');
      console.error('Delete error:', error);
    }
  };

  const sortedHistory = selectedTask?.history
    ?.filter(h =>
      h?.changes?.some(c => c?.type === 'content' && (c?.field === 'taskDescription' || !c?.field))
    )
    ?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  // Lấy oldValue của lần chỉnh sửa đầu tiên → chính là nội dung khởi tạo
  let firstContent = '';
  if (sortedHistory?.length > 0) {
    const firstChange = sortedHistory[0]?.changes?.find(
      c => c?.type === 'content' && (c?.field === 'taskDescription' || !c?.field) && c?.oldValue
    );
    firstContent = firstChange?.oldValue || '';
  } else {
    // Nếu chưa có lịch sử chỉnh sửa, lấy từ taskDescription gốc
    firstContent = selectedTask?.taskDescription || '';
  }

  // WebSocket connection
  useEffect(() => {
    let ws = null;
    let retryCount = 0;
    const MAX_RETRIES = 5;
    const RETRY_DELAY = 3000; // 3 seconds
    let retryTimeout = null;
    let isComponentMounted = true;

    const connectWebSocket = () => {
      try {
        // Kiểm tra URL WebSocket
        if (!WS_URL) {
          console.error('WebSocket URL is not defined');
          return;
        }

        // Đóng kết nối cũ nếu có
        if (ws) {
          ws.close();
          ws = null;
        }

        console.log('Connecting to WebSocket:', WS_URL);
        ws = new WebSocket(WS_URL);

        ws.onopen = () => {
          if (!isComponentMounted) return;
          console.log('WebSocket connected successfully');
          retryCount = 0; // Reset retry count on successful connection
          if (retryTimeout) {
            clearTimeout(retryTimeout);
            retryTimeout = null;
          }
        };

        ws.onmessage = event => {
          if (!isComponentMounted) return;
          try {
            const data = JSON.parse(event.data);
            // console.log('WebSocket message received:', data); // Comment out để giảm spam

            if (data.type === 'task_update') {
              // Cập nhật task trong danh sách
              setAllTasks(prevTasks => {
                // Tìm task cần cập nhật
                const taskIndex = prevTasks.findIndex(t => t.id === data.task.id);

                if (taskIndex === -1) {
                  // Nếu là task mới, thêm vào đầu danh sách
                  if (data.changeType === 'create') {
                    return [data.task, ...prevTasks];
                  }
                  return prevTasks;
                }

                // Nếu là task bị xóa, loại bỏ khỏi danh sách
                if (data.changeType === 'delete') {
                  return prevTasks.filter(t => t.id !== data.task.id);
                }

                // Cập nhật task hiện có
                const updatedTasks = [...prevTasks];
                const currentTask = updatedTasks[taskIndex];

                // Cập nhật task với thông tin mới
                updatedTasks[taskIndex] = {
                  ...currentTask,
                  ...data.task,
                  // Đảm bảo các trường quan trọng được cập nhật
                  status: data.task.status || currentTask.status,
                  completedAt: data.task.completedAt || currentTask.completedAt,
                  completedBy: data.task.completedBy || currentTask.completedBy,
                };

                // Log để debug
                // console.log('Updated task:', { // Comment out để giảm spam
                //   taskId: data.task.id,
                //   oldStatus: currentTask.status,
                //   newStatus: data.task.status,
                //   updatedTask: updatedTasks[taskIndex]
                // });

                return updatedTasks;
              });

              // Cập nhật all tasks với cùng logic (filteredTasks sẽ tự động update qua useMemo)
              setAllTasks(prevTasks => {
                const taskIndex = prevTasks.findIndex(t => t.id === data.task.id);

                if (taskIndex === -1) {
                  if (data.changeType === 'create') {
                    return [data.task, ...prevTasks];
                  }
                  return prevTasks;
                }

                if (data.changeType === 'delete') {
                  return prevTasks.filter(t => t.id !== data.task.id);
                }

                const updatedTasks = [...prevTasks];
                const currentTask = updatedTasks[taskIndex];

                updatedTasks[taskIndex] = {
                  ...currentTask,
                  ...data.task,
                  status: data.task.status || currentTask.status,
                  completedAt: data.task.completedAt || currentTask.completedAt,
                  completedBy: data.task.completedBy || currentTask.completedBy,
                };

                return updatedTasks;
              });

              // Nếu đang xem chi tiết task này, cập nhật lại thông tin
              if (selectedTask?.id === data.task.id) {
                setSelectedTask(prev => ({
                  ...prev,
                  ...data.task,
                  status: data.task.status || prev.status,
                  completedAt: data.task.completedAt || prev.completedAt,
                  completedBy: data.task.completedBy || prev.completedBy,
                }));
              }

              // Hiển thị thông báo nếu có thay đổi trạng thái
              if (data.changeType === 'status') {
                const oldStatus = STATUS_LABELS[data.oldValue] || data.oldValue;
                const newStatus = STATUS_LABELS[data.newValue] || data.newValue;
                message.info(
                  `Công việc #${data.task.id} đã được cập nhật trạng thái từ "${oldStatus}" sang "${newStatus}"`
                );
              }
            }
          } catch (error) {
            console.error('Error processing WebSocket message:', error);
          }
        };

        ws.onerror = error => {
          if (!isComponentMounted) return;
          console.error('WebSocket error:', error);
          // Không cần xử lý retry ở đây vì onclose sẽ được gọi sau
        };

        ws.onclose = event => {
          if (!isComponentMounted) return;
          console.log('WebSocket disconnected:', event.code, event.reason);

          // Chỉ thử kết nối lại nếu không phải là đóng có chủ đích
          if (event.code !== 1000 && retryCount < MAX_RETRIES) {
            retryCount++;
            console.log(`Attempting to reconnect (${retryCount}/${MAX_RETRIES})...`);
            retryTimeout = setTimeout(connectWebSocket, RETRY_DELAY);
          } else if (retryCount >= MAX_RETRIES) {
            console.log('Max retry attempts reached. Please refresh the page to reconnect.');
            message.warning('Mất kết nối với máy chủ. Vui lòng tải lại trang để kết nối lại.');
          }
        };
      } catch (error) {
        console.error('Error creating WebSocket connection:', error);
        if (retryCount < MAX_RETRIES && isComponentMounted) {
          retryCount++;
          retryTimeout = setTimeout(connectWebSocket, RETRY_DELAY);
        }
      }
    };

    connectWebSocket();

    // Cleanup on unmount
    return () => {
      isComponentMounted = false;
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
      if (ws) {
        ws.close(1000, 'Component unmounting');
        ws = null;
      }
    };
  }, [selectedTask]);

  const handlePaginationChange = (page, pageSize) => {
    setPagination(prev => ({
      ...prev,
      page,
      limit: pageSize,
    }));
  };

  // Optimized filter change handler
  const handleFilterChange = useCallback(newFilters => {
    setFilters(newFilters);
    // Reset về page 1 khi thay đổi filter
    setPagination(prev => ({
      ...prev,
      page: 1,
    }));
  }, []);

  // Hàm xuất Excel theo filter
  const exportToExcel = async () => {
    try {
      setLoading(true);

      // Tạo params cho API với filter hiện tại
      const params = {
        page: 1,
        limit: 10000, // Lấy tất cả dữ liệu
      };

      // Thêm các tham số filter
      if (filters.status) params.status = filters.status;
      if (filters.location) {
        const selectedLocation = locations.find(loc => loc.id === filters.location);
        if (selectedLocation) {
          params.location = selectedLocation.name;
        }
      }
      if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
        params.fromDate = filters.dateRange[0].startOf('day').toISOString();
        params.toDate = filters.dateRange[1].endOf('day').toISOString();
      }
      if (filters.dateField) params.dateField = filters.dateField;
      if (filters.search && filters.search.trim()) params.search = filters.search.trim();

      // Lấy dữ liệu từ API
      const res = await fetchAllTasks(params);
      const tasksToExport = res.tasks;

      // Chuẩn bị dữ liệu cho Excel
      const excelData = tasksToExport.map(task => {
        // Xử lý staff data
        let staffNames = '';
        if (task.staff && task.staff.length > 0) {
          staffNames = task.staff
            .map(person => `${person.fullName}${person.donVi ? ` (${person.donVi})` : ''}`)
            .join(', ');
        } else if (task.fullName) {
          staffNames = task.fullName;
        }

        return {
          Mã: `CV ${task.id}`,
          'Địa điểm': task.location || '',
          'Họ tên nhân sự vào/ra TTDL': staffNames,
          'Công việc thực hiện': task.taskTitle || '',
          'Nội dung': task.taskDescription || '',
          'Thời gian bắt đầu': task.checkInTime
            ? new Date(task.checkInTime).toLocaleString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
            : '',
          'Thời gian kết thúc': task.checkOutTime
            ? new Date(task.checkOutTime).toLocaleString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
            : '',
          'Trạng thái': STATUS_LABELS[task.status] || task.status,
          'Người tạo': task.creator?.fullname || task.creator?.fullName || task.creatorName || '',
        };
      });

      // Tạo workbook và worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      // Đặt độ rộng cột
      const colWidths = [
        { wch: 8 }, // Mã
        { wch: 15 }, // Địa điểm
        { wch: 30 }, // Họ tên nhân sự
        { wch: 25 }, // Công việc thực hiện
        { wch: 40 }, // Nội dung
        { wch: 18 }, // Thời gian bắt đầu
        { wch: 18 }, // Thời gian kết thúc
        { wch: 12 }, // Trạng thái
        { wch: 20 }, // Người tạo
      ];
      ws['!cols'] = colWidths;

      // Thêm format wrap text cho tất cả các ô
      const range = XLSX.utils.decode_range(ws['!ref']);
      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
          if (!ws[cellAddress]) continue;

          // Đảm bảo cell có style object
          if (!ws[cellAddress].s) ws[cellAddress].s = {};

          // Thêm wrap text
          ws[cellAddress].s.alignment = {
            ...ws[cellAddress].s.alignment,
            wrapText: true,
            vertical: 'top',
          };
        }
      }

      // Thêm worksheet vào workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Danh sách công việc');

      // Tạo tên file với timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const fileName = `Danh_sach_cong_viec_${timestamp}.xlsx`;

      // Xuất file
      XLSX.writeFile(wb, fileName);

      message.success(`Đã xuất ${excelData.length} bản ghi ra file Excel`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      if (error.message === 'Token expired') {
        message.error('Phiên đăng nhập đã hết hạn');
        navigate('/login');
        return;
      }
      message.error('Không thể xuất file Excel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-0'>
      <style>
        {`
          .ant-table-cell {
            white-space: pre-line !important;
            word-wrap: break-word !important;
            word-break: break-word !important;
          }
          .ant-table-thead > tr > th {
            white-space: pre-line !important;
            word-wrap: break-word !important;
            word-break: break-word !important;
          }
        `}
      </style>
      <Card>
        <div className='flex justify-between items-center mb-4'>
          <Title level={4} style={{ color: '#003c71', margin: 0 }}>
            Danh sách vào ra Trung Tâm Dữ Liệu
          </Title>
          <Space>
            <Button
              type='primary'
              icon={<ContactsOutlined />}
              style={{ backgroundColor: '#0072BC', borderColor: '#0072BC' }}
              onClick={() => navigate('/dc/partners')}
            >
              Danh sách nhân sự
            </Button>
            <Button
              type='primary'
              icon={<PlusOutlined />}
              style={{ backgroundColor: '#003c71', borderColor: '#003c71' }}
              onClick={() =>
                showModal({
                  type: 'create',
                  setModalType,
                  setSelectedTask,
                  setModalVisible,
                  setRemovedAttachments,
                  form,
                })
              }
            >
              Tạo mới
            </Button>
          </Space>
        </div>

        {/* Filters */}
        <TaskFilters
          key={`filters-${filters.status}-${filters.location}`} // Chỉ re-render khi cần thiết
          filters={{
            ...filters,
            search: inputValue, // Sử dụng inputValue thay vì filters.search
            statusLabels: STATUS_LABELS,
          }}
          setFilters={handleFilterChange}
          filterLoading={{
            status: false,
          }}
          locations={locations}
          locationsLoading={locationsLoading}
          locationsError={locationsError}
          onSearchChange={handleSearch}
          searchLoading={loading && inputValue?.trim()}
        />

        {loading ? (
          <LoadingSpinner tip='Đang tải danh sách công việc...' />
        ) : (
          <>
            <TaskTable
              tasks={displayTasks}
              loading={loading}
              pagination={pagination}
              onPaginationChange={handlePaginationChange}
              onView={record =>
                showModal({
                  type: 'view',
                  task: record,
                  setModalType,
                  setSelectedTask,
                  setModalVisible,
                  setRemovedAttachments,
                  fetchTaskDetail,
                  form,
                })
              }
              onDelete={handleDelete}
              getCurrentUserId={() => getCurrentUserId(currentUser)}
              getCurrentUserRole={() => getCurrentUserRole(currentUser)}
              exportToExcel={exportToExcel}
            />

            {/* Export Excel Section */}
            {/* <div className="flex justify-end items-center mt-1">
              <Button
                type="primary"
                icon={<ExportOutlined />}
                style={{ backgroundColor: '#28a745', borderColor: '#28a745' }}
                onClick={exportToExcel}
                loading={loading}
                size="normal"
              >
                Export Excel
              </Button>
            </div> */}
          </>
        )}
      </Card>

      {/* TaskModal */}
      <TaskModal
        modalType={modalType}
        modalVisible={modalVisible}
        form={form}
        selectedTask={selectedTask}
        locations={locations}
        locationsLoading={locationsLoading}
        locationsError={locationsError}
        STATUS_LABELS={STATUS_LABELS}
        handleModalSubmit={() =>
          handleModalSubmit({
            form,
            modalType,
            selectedTask,
            removedAttachments,
            createTask,
            updateTask,
            message,
            navigate,
            setModalVisible,
            fetchTaskDetail,
            fetchAllTasksData,
            unlockTask,
            setModalType,
            locations,
          })
        }
        handleAttachmentRemove={file => handleAttachmentRemove(file, form, setRemovedAttachments)}
        processFileName={processFileName}
        downloadFile={file => downloadFile(file, selectedTask, message)}
        setModalVisible={setModalVisible}
        unlockTask={unlockTask}
        fetchTaskDetail={fetchTaskDetail}
        getCurrentUserRole={() => getCurrentUserRole(currentUser)}
        showReasonModal={action =>
          showReasonModal(action, setPendingAction, setReasonModalVisible, reasonForm)
        }
        setReopenModalVisible={setReopenModalVisible}
        sortedHistory={sortedHistory}
        firstContent={firstContent}
        renderChangeContent={renderChangeContent}
        setModalType={setModalType}
        showModal={(type, task) =>
          showModal({
            type,
            task,
            setModalType,
            setSelectedTask,
            setModalVisible,
            setRemovedAttachments,
            fetchTaskDetail,
            getCurrentUserId: () => getCurrentUserId(currentUser),
            lockTask,
            message,
            form,
          })
        }
        handleStatusChange={handleStatusChange}
      />

      {/* TaskReasonModal */}
      <TaskReasonModal
        pendingAction={pendingAction}
        reasonModalVisible={reasonModalVisible}
        setReasonModalVisible={setReasonModalVisible}
        handleReasonSubmit={() =>
          handleReasonSubmit({
            reasonForm,
            pendingAction,
            selectedTask,
            handleStatusChange,
            setReasonModalVisible,
          })
        }
        reopenModalVisible={reopenModalVisible}
        setReopenModalVisible={setReopenModalVisible}
        handleReopen={() =>
          handleReopen({
            reopenForm,
            selectedTask,
            getAuthHeader: () => getAuthHeader(navigate),
            message,
            navigate,
            setReopenModalVisible,
            fetchTaskDetail,
            fetchAllTasksData,
          })
        }
        reasonForm={reasonForm}
        reopenForm={reopenForm}
      />
    </div>
  );
}
