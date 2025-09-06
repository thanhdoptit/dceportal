import { message } from 'antd';

const API_URL = import.meta.env.VITE_API_URL || window.location.origin;

// Handle task detail fetch with error handling
export const fetchTaskDetailWithErrorHandling = async (taskId, fetchTaskDetailApi, navigate) => {
  try {
    const taskData = await fetchTaskDetailApi(taskId);
    return taskData;
  } catch (error) {
    console.error('Error fetching task detail:', error);
    if (error.message === 'Token expired') {
      message.error('Phiên đăng nhập đã hết hạn');
      navigate('/login');
      return null;
    }
    message.error('Không thể tải thông tin chi tiết');
    return null;
  }
};

// Handle modal visibility and form state
export const handleModalVisibility = async (type, task, options) => {
  const {
    setModalType,
    setSelectedTask,
    setModalVisible,
    setRemovedAttachments,
    fetchTaskDetail,
    getCurrentUserId,
    lockTask,
    form,
  } = options;

  setModalType(type);
  setSelectedTask(task);
  setModalVisible(true);
  setRemovedAttachments([]); // Reset removed attachments

  if (type === 'view' && task) {
    await fetchTaskDetail(task.id);
  } else if (type === 'edit') {
    // Fetch latest task details first
    const updatedTask = await fetchTaskDetail(task.id);
    if (!updatedTask) {
      message.error('Không thể tải thông tin công việc. Vui lòng thử lại sau.');
      setModalVisible(false);
      return;
    }

    // Check if task is being edited by someone else
    if (updatedTask.lockedBy && updatedTask.lockedBy !== getCurrentUserId()) {
      message.warning(
        `Công việc đang được chỉnh sửa bởi ${updatedTask.lockedByUser?.fullname || 'người khác'}`
      );
      setModalType('view');
      return;
    }

    try {
      // Try to lock the task
      await lockTask(task.id);

      // Set initial form values
      const values = {
        ...updatedTask,
        worker: updatedTask.worker.split(',').map(w => w.trim()),
      };
      form.setFieldsValue(values);
    } catch (error) {
      console.error('Error locking task:', error);
      message.error('Không thể khóa công việc để chỉnh sửa');
      setModalType('view');
    }
  } else if (type === 'create') {
    form.resetFields();
  }
};

// Handle file download
export const downloadTaskFile = async (file, task, getFileUrl) => {
  try {
    const response = await fetch(getFileUrl(task.id, file.uid));
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error downloading file:', error);
    message.error('Không thể tải tập tin');
  }
};

// Prepare form data for modal submission
export const prepareModalFormData = (values, modalType, selectedTask, removedAttachments) => {
  const formData = new FormData();

  // Common fields
  if (values.name) {
    formData.set('name', values.name.trim());
  }

  // Handle workers field
  if (modalType === 'edit' && selectedTask?.fullName) {
    const currentWorkers = selectedTask.fullName.split(',').map(w => w.trim());
    const newWorkers = values.worker.filter(w => !currentWorkers.includes(w.trim()));
    const allWorkers = [...currentWorkers, ...newWorkers];
    const workerString = allWorkers.join(',');
    formData.set('worker', workerString);
    formData.set('fullName', workerString);
  } else {
    const workerString = Array.isArray(values.worker)
      ? values.worker.map(w => String(w).trim()).join(',')
      : String(values.worker).trim();
    formData.set('worker', workerString);
    formData.set('fullName', workerString);
  }

  // Optional fields
  if (values.taskDescription) {
    formData.set('taskDescription', values.taskDescription.trim());
  }

  if (values.taskTitle) {
    formData.set('taskTitle', values.taskTitle.trim());
  }

  if (values.checkInTime) {
    formData.set('checkInTime', values.checkInTime.format('YYYY-MM-DD HH:mm:ss'));
  }

  if (values.checkOutTime) {
    formData.set('checkOutTime', values.checkOutTime.format('YYYY-MM-DD HH:mm:ss'));
  }

  // Handle removed attachments
  if (removedAttachments && removedAttachments.length > 0) {
    formData.set('removedAttachments', JSON.stringify(removedAttachments));
  }

  // Handle file attachments
  if (values.uploadFiles) {
    const files = values.uploadFiles.filter(file => file.originFileObj);
    files.forEach(file => {
      formData.append('files', file.originFileObj);
    });
  }

  return formData;
};
