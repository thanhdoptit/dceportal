import React, { useState, useEffect, useRef } from 'react';
import { Card, Descriptions, Tag, Typography, message, Button, Space, Form } from 'antd';
import { SwapOutlined, FileSearchOutlined } from '@ant-design/icons';
import axios from '../utils/axios';
import { formatDate } from '../utils/dateUtils';
import { useNavigate } from 'react-router-dom';
import DeviceCheckForm from '../components/DeviceCheckForm';
import TaskTable from '../components/tasks/TaskTable';
import TaskModal from '../components/tasks/TaskModal';
import TaskReasonModal from '../components/tasks/TaskReasonModal';
import {
  getCurrentUserId,
  getCurrentUserRole,
  getAuthHeader,
  showModal,
  handleModalSubmit,
  handleAttachmentRemove,
  downloadFile,
  showReasonModal,
  handleReasonSubmit,
  handleReopen,
} from '../utils/taskModalUtils';
import { processFileName } from '../utils/VietnameseFile';
import { renderChangeContent } from '../components/tasks/taskChangeUtils';
import { STATUS_LABELS } from '../constants/taskStatus';
import {
  fetchTaskDetail as fetchTaskDetailApi,
  createTask,
  updateTask,
  lockTask,
  unlockTask,
  updateTaskStatus
} from '../services/taskService';
const { Title, Text } = Typography;
const API_URL = import.meta.env.VITE_API_URL || window.location.origin;

const MyShiftsPage = () => {
  const [loading, setLoading] = useState(false);
  const [currentShift, setCurrentShift] = useState(null);
  const [relatedTasks, setRelatedTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const [form] = Form.useForm();
  const [removedAttachments, setRemovedAttachments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('view');
  const [pendingAction, setPendingAction] = useState(null);
  const [reasonModalVisible, setReasonModalVisible] = useState(false);
  const [reasonForm] = Form.useForm();
  const [reopenModalVisible, setReopenModalVisible] = useState(false);
  const [reopenForm] = Form.useForm();
  const abortControllerRef = useRef(null);

  useEffect(() => {
    fetchCurrentShift();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    if (currentShift?.WorkShift?.id && !tasksLoading) {
      fetchRelatedTasks();
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [currentShift?.WorkShift?.id]);

  const fetchCurrentShift = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Phiên đăng nhập đã hết hạn');
        navigate('/login');
        return;
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const response = await axios.get(`${API_URL}/api/shifts/my-shifts`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: abortControllerRef.current.signal
      });

      if (response.data?.data?.[0]) {
        const shift = response.data.data[0];
        if (!shift.WorkShift.confirmedAt) {
          message.warning('Ca trực chưa được xác nhận. Vui lòng xác nhận nhận ca trước khi bắt đầu làm việc.');
        }
        setCurrentShift(shift);
      }
    } catch (error) {
      if (error.code === 'ERR_CANCELED' || error.name === 'CanceledError') {
        return;
      }

      console.error('Error fetching current shift:', error);
      if (error.response?.status === 404) {
        message.info('Bạn chưa chọn ca làm việc');
      } else if (error.response?.status === 401) {
        message.error('Phiên đăng nhập đã hết hạn');
        navigate('/login');
      } else {
        message.error('Không thể tải thông tin ca làm việc');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedTasks = async () => {
    if (!currentShift?.WorkShift?.id || tasksLoading) return;

    try {
      setTasksLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      // Logic lấy tasks theo yêu cầu:
      // 1. Tất cả tasks pending, in_progress (không giới hạn thời gian)
      // 2. Tasks completed chỉ trong khoảng từ ca được xác nhận đến hiện tại
      // Backend sẽ tự động áp dụng time filter chỉ cho completed tasks
      const params = {
        status: ['pending', 'in_progress', 'completed'],
        location: currentShift.WorkShift.name,
        toDate: new Date().toISOString()
      };

      if (currentShift.WorkShift.confirmedAt) {
        params.fromDate = currentShift.WorkShift.confirmedAt;
      }

      const response = await axios.get(`${API_URL}/api/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
        signal: abortControllerRef.current.signal
      });

      if (response.data?.tasks) {
        setRelatedTasks(response.data.tasks || []);
        // Log số lượng tasks để debug
        console.log(`Loaded ${response.data.tasks.length} related tasks for shift ${currentShift.WorkShift.name}`);
      } else {
        setRelatedTasks([]);
        console.log('No related tasks found');
      }
    } catch (error) {
      if (error.code === 'ERR_CANCELED' || error.name === 'CanceledError') {
        return;
      }

      console.error('Error fetching related tasks:', error);
      if (error.response?.status === 401) {
        message.error('Phiên đăng nhập đã hết hạn');
        navigate('/login');
      } else {
        message.error('Không thể tải danh sách công việc liên quan');
      }
    } finally {
      setTasksLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'doing': return 'success';
      case 'handover': return 'warning';
      case 'done': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'doing': return 'Đang làm việc';
      case 'handover': return 'Đang bàn giao';
      case 'done': return 'Đã kết thúc';
      default: return 'Chưa bắt đầu';
    }
  };

  const handleViewTask = async (task) => {
    setModalType('view');
    const detail = await fetchTaskDetail(task.id);
    setSelectedTask(detail);
    setModalVisible(true);
    fetchTaskHistory(task.id);
  };

  const handleEditTask = async (task) => {
    setModalType('edit');
    setModalVisible(true);
    const updatedTask = await fetchTaskDetail(task.id);
    if (!updatedTask) {
      message.error('Không thể tải thông tin công việc. Vui lòng thử lại sau.');
      setModalVisible(false);
      return;
    }
    try {
      await lockTask(updatedTask.id);
      setSelectedTask({ ...updatedTask, isLocked: true });
    } catch (error) {
      console.error('Error locking task:', error); // Log lỗi để debug
      message.warning('Công việc đang được chỉnh sửa bởi người khác');
      setModalType('view');
      return;
    }
    fetchTaskHistory(task.id);
  };

  const fetchTaskHistory = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/tasks/${taskId}/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data?.history) {
        setSelectedTask(prev => prev ? { ...prev, history: response.data.history } : prev);
      }
    } catch (error) {
      console.error('Error fetching task history:', error);
      message.error('Không thể tải lịch sử công việc');
    }
  };

  const fetchTaskDetail = async (taskId) => {
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

  const handleStatusChange = async (taskId, newStatus, isSystemChange = false, customReason = null) => {
    try {
      const task = relatedTasks.find(t => t.id === taskId);
      if (!task) {
        console.error('Task not found:', taskId);
        message.error('Không tìm thấy công việc');
        return;
      }

      if (task.status === newStatus) {
        console.log('Status unchanged, skipping update:', {
          taskId,
          currentStatus: task.status,
          newStatus
        });
        return;
      }

      let changeReason = customReason;
      if (!changeReason && !isSystemChange) {
        const statusLabels = {
          'waiting': 'Chờ xử lý',
          'pending': 'Tạm dừng',
          'in_progress': 'Đang thực hiện',
          'completed': 'Đã kết thúc',
          'cancelled': 'Đã hủy'
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
        system: isSystemChange
      });

      if (!isSystemChange) {
        message.success('Cập nhật trạng thái thành công');
        fetchRelatedTasks();
      }

      setRelatedTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));

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

  const sortedHistory = selectedTask?.history
    ?.filter(h => h?.changes?.some(c => c?.type === 'content' && (c?.field === 'taskDescription' || !c?.field)))
    ?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  let firstContent = '';
  if (sortedHistory?.length > 0) {
    const firstChange = sortedHistory[0]?.changes?.find(
      c => c?.type === 'content' && (c?.field === 'taskDescription' || !c?.field) && c?.oldValue
    );
    firstContent = firstChange?.oldValue || '';
  } else {
    firstContent = selectedTask?.taskDescription || '';
  }

  const handleHandoverClick = async () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      message.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
      navigate('/login');
      return;
    }

    try {
      const userData = JSON.parse(user);
      if (userData.role.toLowerCase() !== 'datacenter') {
        message.error('Bạn không có quyền truy cập tính năng này');
        return;
      }

      if (currentShift?.WorkShift?.id) {
        try {
          const response = await axios.get(`${API_URL}/api/shifts/handover/by-shift/${currentShift.WorkShift.id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          const shiftHandovers = response.data.filter(handover =>
            handover.fromShiftId === currentShift.WorkShift.id
          );

          if (shiftHandovers.length > 0) {
            const sortedHandovers = shiftHandovers.sort((a, b) => {
              const statusPriority = {
                'draft': 0,
                'pending': 1,
                'completed': 2,
                'rejected': 3
              };
              if (statusPriority[a.status] !== statusPriority[b.status]) {
                return statusPriority[a.status] - statusPriority[b.status];
              }
              return new Date(b.createdAt) - new Date(a.createdAt);
            });

            const latestHandover = sortedHandovers[0];
            navigate(`/dc/handover/${latestHandover.id}`);
            message.info('Đã tìm thấy biên bản bàn giao cho ca này');
          } else {
            navigate('/dc/handover/create', {
              state: { shiftId: currentShift.WorkShift.id }
            });
          }
        } catch (error) {
          console.error('Lỗi khi kiểm tra biên bản bàn giao:', error);
          message.error('Có lỗi khi kiểm tra biên bản bàn giao');
        }
      } else {
        message.error('Không thể tạo biên bản bàn giao. Vui lòng thử lại sau.');
      }
    } catch (err) {
      console.error('Lỗi khi xử lý dữ liệu người dùng:', err);
      message.error('Dữ liệu người dùng không hợp lệ. Vui lòng đăng nhập lại.');
      localStorage.clear();
      navigate('/login');
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (!currentShift) {
    return (
      <div className="text-center py-8">
        <Title level={3}>Bạn chưa chọn ca làm việc</Title>
        <Text type="secondary">Vui lòng chọn ca làm việc để xem thông tin chi tiết</Text>
      </div>
    );
  }
  if (!currentShift.WorkShift.confirmedAt) {
    return (
      <div className="text-center py-8">
        <Title level={3}>Ca trực chưa được xác nhận</Title>
        <Text type="secondary">Vui lòng xác nhận nhận ca trước khi bắt đầu làm việc</Text>
      </div>
    );
  }

  return (
    <>
      <div className="w-full p-0">
        <Card variant="outlined" className="w-full">
          <div className="flex justify-between items-center mb-6">
            <Title level={4} style={{ color: '#003c71', margin: 0 }}>Nội dung ca làm việc</Title>
            <Space>
              {currentShift?.WorkShift?.status === 'doing' && (
                <Button
                  type="primary"
                  icon={<SwapOutlined />}
                  onClick={handleHandoverClick}
                  className="bg-[#003c71] hover:bg-[#002c51]"
                >
                  Biên bản bàn giao
                </Button>
              )}
              <Tag color={getStatusColor(currentShift.WorkShift.status)} style={{ fontSize: '16px', padding: '5px 16px' }}>
                {getStatusText(currentShift.WorkShift.status)}
              </Tag>
            </Space>
          </div>

          <Descriptions
            bordered
            column={{ xxl: 4, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}
            className="w-full"
          >
            <Descriptions.Item label="Ca làm việc">
              {currentShift.WorkShift.code}
            </Descriptions.Item>
            <Descriptions.Item label="Địa điểm">
              {currentShift.WorkShift.name}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày">
              {formatDate(currentShift.WorkShift.date)}
            </Descriptions.Item>
            <Descriptions.Item label="Thời điểm bắt đầu">
              {currentShift.WorkShift.confirmedAt ? formatDate(currentShift.WorkShift.confirmedAt, 'HH:mm') : 'Chưa xác nhận'}
            </Descriptions.Item>
          </Descriptions>

          <div className="mt-6 w-full">
            <Title level={4} style={{ color: '#003c71', margin: 0 }}>Thành viên</Title>
            <div className="grid  lg:grid-cols-4 gap-4">
              {currentShift.WorkShift.Users?.map(user => (
                <div key={user.id} className="p-3 bg-gray-50 rounded">
                  <Text>{user.fullname}</Text>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <Title level={4} style={{ color: '#003c71', margin: 0 }}>Công việc liên quan</Title>
              <Button
                type="primary"
                icon={<FileSearchOutlined />}
                onClick={fetchRelatedTasks}
                loading={tasksLoading}
                className="flex items-center bg-blue-600 hover:bg-blue-600"
              >
                Làm mới
              </Button>
            </div>

            <TaskTable
              tasks={relatedTasks}
              loading={tasksLoading}
              onView={handleViewTask}
              onEdit={handleEditTask}
              getCurrentUserId={() => currentUser?.id}
              getCurrentUserRole={() => getCurrentUserRole(currentUser)}
            />
          </div>

          <DeviceCheckForm currentShift={currentShift} currentUser={currentUser} />
        </Card>
      </div>

      <TaskModal
        modalType={modalType}
        modalVisible={modalVisible}
        form={form}
        selectedTask={selectedTask}
        STATUS_LABELS={STATUS_LABELS}
        handleModalSubmit={() => handleModalSubmit({
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
          fetchAllTasksData: fetchRelatedTasks,
          unlockTask,
          setModalType,
          locations: []
        })}
        handleAttachmentRemove={(file) => handleAttachmentRemove(file, form, setRemovedAttachments)}
        processFileName={processFileName}
        downloadFile={(file) => downloadFile(file, selectedTask, message)}
        setModalVisible={setModalVisible}
        unlockTask={unlockTask}
        fetchTaskDetail={fetchTaskDetail}
        getCurrentUserRole={() => getCurrentUserRole(currentUser)}
        showReasonModal={(action) => showReasonModal(action, setPendingAction, setReasonModalVisible, reasonForm)}
        setReopenModalVisible={setReopenModalVisible}
        sortedHistory={sortedHistory}
        firstContent={firstContent}
        renderChangeContent={renderChangeContent}
        setModalType={setModalType}
        showModal={(type, task) => showModal({
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
          form
        })}
        handleStatusChange={handleStatusChange}
      />

      <TaskReasonModal
        pendingAction={pendingAction}
        reasonModalVisible={reasonModalVisible}
        setReasonModalVisible={setReasonModalVisible}
        handleReasonSubmit={() => handleReasonSubmit({
          reasonForm,
          pendingAction,
          selectedTask,
          handleStatusChange,
          setReasonModalVisible
        })}
        reopenModalVisible={reopenModalVisible}
        setReopenModalVisible={setReopenModalVisible}
        handleReopen={() => handleReopen({
          reopenForm,
          selectedTask,
          getAuthHeader: () => getAuthHeader(navigate),
          message,
          navigate,
          setReopenModalVisible,
          fetchTaskDetail,
          fetchAllTasksData: fetchRelatedTasks
        })}
        reasonForm={reasonForm}
        reopenForm={reopenForm}
      />
    </>
  );
};

export default MyShiftsPage;