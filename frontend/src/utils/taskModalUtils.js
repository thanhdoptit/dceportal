import { message } from 'antd';
import dayjs from 'dayjs';
import axios from './axios';
import { getFileUrl } from './taskUtils';
import * as taskService from '../services/taskService';

const API_URL = import.meta.env.VITE_API_URL || window.location.origin;

// Fetch task detail
export const fetchTaskDetailApi = async taskId => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/api/tasks/${taskId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Lock task for editing
export const lockTask = async taskId => {
  const token = localStorage.getItem('token');
  await axios.post(`${API_URL}/api/tasks/${taskId}/lock`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Unlock task after editing
export const unlockTask = async taskId => {
  const token = localStorage.getItem('token');
  await axios.delete(`${API_URL}/api/tasks/${taskId}/lock`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Download file with proper handling
export const downloadFile = async (file, selectedTask, message) => {
  console.log('Downloading file:', file);

  if (!file) {
    message.error('Không thể tải file. File không hợp lệ.');
    return;
  }

  const url = getFileUrl(file, selectedTask);
  if (!url) {
    message.error('Không thể tải file. URL không hợp lệ.');
    return;
  }

  console.log('Download URL:', url);

  const loadingMessage = message.loading('Đang tải file...', 0);

  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    };

    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`File không tồn tại hoặc không thể truy cập (${response.status})`);
    }

    let filename = '';

    if (file.originalName) {
      try {
        const bytes = new Uint8Array(file.originalName.length);
        for (let i = 0; i < file.originalName.length; i++) {
          bytes[i] = file.originalName.charCodeAt(i);
        }
        filename = new TextDecoder('utf-8').decode(bytes);
        console.log('Decoded originalName:', filename);
      } catch (e) {
        console.warn('Error decoding originalName:', e);
        filename = file.originalName;
      }
    }

    if (!filename) {
      const contentDisposition = response.headers.get('Content-Disposition');
      if (contentDisposition) {
        const filenameRegex = /filename\*?=([^;]+)/i;
        const matches = filenameRegex.exec(contentDisposition);
        if (matches && matches[1]) {
          try {
            let extractedName = matches[1].replace(/['"]/g, '');
            if (extractedName.startsWith("UTF-8''")) {
              extractedName = extractedName.substring(7);
            }
            filename = decodeURIComponent(extractedName);
          } catch (e) {
            console.warn('Error decoding filename from Content-Disposition:', e);
          }
        }
      }
    }

    if (!filename && file.path) {
      try {
        const pathParts = file.path.split(/[\\/]/);
        filename = pathParts[pathParts.length - 1];

        const timestampRegex = /^\d{8}_\d{6}_[a-f0-9]{8}_/;
        if (timestampRegex.test(filename)) {
          filename = filename.replace(timestampRegex, '');
        }
      } catch (e) {
        console.warn('Error extracting filename from path:', e);
      }
    }

    if (!filename) {
      filename = 'downloaded_file';
    }

    try {
      filename = filename.normalize('NFC');

      if (!filename.includes('.')) {
        const ext = file.path ? file.path.split('.').pop() : 'docx';
        filename = `${filename}.${ext}`;
      }
    } catch (e) {
      console.warn('Error normalizing filename:', e);
    }

    console.log('Processing download file:', {
      url,
      contentDisposition: response.headers.get('Content-Disposition'),
      originalName: file.originalName,
      path: file.path,
      finalFilename: filename,
    });

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    message.success('Tải file thành công');
  } catch (error) {
    console.error('Error downloading file:', error);
    message.error(`Không thể tải file: ${error.message}`);
  } finally {
    loadingMessage();
  }
};

// Prepare form data for task submission
export const prepareTaskFormData = (values, modalType, selectedTask, removedAttachments) => {
  const formData = new FormData();

  if (typeof values.name === 'string') {
    formData.set('name', values.name.trim());
  }

  // Handle worker/fullName fields
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

  // Handle attachments
  if (values.attachments) {
    const filesToUpload = values.attachments.filter(file => file.originFileObj);
    if (filesToUpload.length > 0) {
      filesToUpload.forEach(file => {
        formData.append('attachments', file.originFileObj);
      });
    }
  }

  if (removedAttachments.length > 0) {
    const removedPaths = removedAttachments.map(file => file.path);
    formData.set('removedAttachments', JSON.stringify(removedPaths));
  }

  // Set change reason
  const changeReason =
    modalType === 'edit'
      ? values.changeReason?.trim() || 'Cập nhật thông tin'
      : 'Tạo mới công việc';
  formData.set('changeReason', changeReason);

  return formData;
};

// Common functionality for showing modal
export const handleShowModal = async (type, task, options = {}) => {
  const {
    setModalType,
    setSelectedTask,
    setModalVisible,
    setRemovedAttachments,
    form,
    getCurrentUserId,
    fetchTaskDetail,
    lockTask,
    getFileUrl,
    formatFileName,
  } = options;

  setModalType(type);
  setSelectedTask(task);
  setModalVisible(true);
  setRemovedAttachments([]);

  if (type === 'view' && task) {
    await fetchTaskDetail(task.id);
  } else if (type === 'edit') {
    const updatedTask = await fetchTaskDetail(task.id);
    if (!updatedTask) {
      message.error('Không thể tải thông tin công việc. Vui lòng thử lại sau.');
      setModalVisible(false);
      return;
    }

    if (updatedTask.lockedBy && updatedTask.lockedBy !== getCurrentUserId()) {
      message.warning(
        `Công việc đang được chỉnh sửa bởi ${updatedTask.lockedByUser?.fullname || 'người khác'}`
      );
      setModalType('view');
      return;
    }

    try {
      await lockTask(updatedTask.id);
      setSelectedTask(prev => ({
        ...prev,
        isLocked: true,
      }));
    } catch (error) {
      if (error.response?.status === 423) {
        message.warning(
          error.response?.data?.message || 'Công việc đang được chỉnh sửa bởi người khác'
        );
        setModalType('view');
        return;
      }
      message.error('Không thể khóa công việc để chỉnh sửa');
      setModalType('view');
      return;
    }

    const fileList =
      updatedTask?.attachments?.map((file, index) => ({
        uid: index,
        name: formatFileName(file.originalName),
        status: 'done',
        url: getFileUrl(file, updatedTask),
        response: file,
      })) || [];

    const taskLocation = updatedTask?.location || task?.location;

    form.resetFields();
    setTimeout(() => {
      form.setFieldsValue({
        location: taskLocation,
        worker:
          updatedTask?.staff && updatedTask.staff.length > 0
            ? updatedTask.staff
            : updatedTask?.fullName
              ? updatedTask.fullName.split(',').map(name => ({
                  type: 'partner',
                  id: null,
                  fullName: name.trim(),
                }))
              : [],
        taskDescription: '',
        taskTitle: updatedTask.taskTitle,
        checkInTime: updatedTask.checkInTime ? dayjs(updatedTask.checkInTime) : undefined,
        checkOutTime: updatedTask.checkOutTime ? dayjs(updatedTask.checkOutTime) : undefined,
        attachments: fileList,
        changeReason: '',
      });
    }, 100);
  } else {
    form.resetFields();
  }
};

// Hàm lấy ID người dùng hiện tại
export const getCurrentUserId = currentUser => {
  return currentUser?.id;
};

// Hàm lấy role người dùng hiện tại
export const getCurrentUserRole = currentUser => {
  return currentUser?.role;
};

// Hàm lấy header xác thực
export const getAuthHeader = navigate => {
  const token = localStorage.getItem('token');
  if (!token) {
    message.error('Phiên đăng nhập đã hết hạn');
    navigate('/login');
    return null;
  }
  return { Authorization: `Bearer ${token}` };
};

// Hàm hiển thị modal
export const showModal = async ({
  type,
  task,
  setModalType,
  setSelectedTask,
  setModalVisible,
  setRemovedAttachments,
  fetchTaskDetail,
  getCurrentUserId,
  lockTask,
  message,
  form,
}) => {
  setModalType(type);
  setRemovedAttachments([]);

  if (type === 'view' && task) {
    setSelectedTask(task);
    setModalVisible(true);
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

    // Try to acquire lock
    try {
      await lockTask(updatedTask.id);
      setSelectedTask({ ...updatedTask, isLocked: true });
    } catch (error) {
      if (error.response?.status === 423) {
        message.warning(
          error.response?.data?.message || 'Công việc đang được chỉnh sửa bởi người khác'
        );
        setModalType('view');
        return;
      }
      message.error('Không thể khóa công việc để chỉnh sửa');
      setModalType('view');
      return;
    }

    // Reset và set lại form
    form.resetFields();
    setTimeout(() => {
      form.setFieldsValue({
        location: updatedTask?.location,
        worker:
          updatedTask?.staff && updatedTask.staff.length > 0
            ? updatedTask.staff.map(p => ({
                ...p,
                key: p.id,
                value: p.id,
                label: (p.fullName || p.fullname || p.name) + (p.donVi ? ` (${p.donVi})` : ''),
              }))
            : updatedTask?.fullName
              ? updatedTask.fullName.split(',').map(name => ({
                  type: 'partner',
                  id: null,
                  fullName: name.trim(),
                  key: null,
                  value: null,
                  label: name.trim(),
                }))
              : [],
        taskDescription: '',
        taskTitle: updatedTask.taskTitle,
        checkInTime: updatedTask.checkInTime ? dayjs(updatedTask.checkInTime) : undefined,
        checkOutTime: updatedTask.checkOutTime ? dayjs(updatedTask.checkOutTime) : undefined,
        attachments: (updatedTask?.attachments || []).map((file, index) => ({
          uid: index,
          name: file.originalName,
          status: 'done',
          url: file.url,
          response: file,
        })),
        changeReason: '',
      });
    }, 100);

    setModalVisible(true); // Mở modal sau khi đã set xong dữ liệu
  } else {
    setSelectedTask(null);
    form.resetFields();
    setModalVisible(true);
  }
};

// Hàm xử lý submit modal
export const handleModalSubmit = async ({
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
  locations = [],
}) => {
  try {
    const values = await form.validateFields();
    const staffList = (values.worker || [])
      .filter(Boolean)
      .map(staff => {
        if (!staff) return null;
        if (staff.type) return staff;
        if (typeof staff.id === 'number') {
          if (staff.fullName || staff.fullname) {
            return { ...staff, type: 'partner' };
          } else {
            return { ...staff, type: 'user' };
          }
        }
        return { ...staff, type: 'partner' };
      })
      .filter(Boolean);
    console.log('staffList gửi lên:', staffList);
    const formData = new FormData();

    // Thêm xử lý location
    if (values.location) {
      // Tìm location name từ id
      const selectedLocation = locations?.find(loc => loc.id === values.location);
      if (selectedLocation) {
        formData.set('location', selectedLocation.name);
      } else {
        // Fallback: gửi ID nếu không tìm thấy name
        formData.set('location', values.location);
      }
    }

    if (typeof values.name === 'string') {
      formData.set('name', values.name.trim());
    }
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
    if (values.attachments) {
      const filesToUpload = values.attachments.filter(file => file.originFileObj);
      if (filesToUpload.length > 0) {
        filesToUpload.forEach(file => {
          formData.append('attachments', file.originFileObj);
        });
      }
    }
    if (removedAttachments.length > 0) {
      const removedPaths = removedAttachments.map(file => file.path);
      formData.set('removedAttachments', JSON.stringify(removedPaths));
    }
    let changeReason = '';
    if (modalType === 'edit') {
      changeReason = values.changeReason?.trim() || 'Cập nhật thông tin';
    } else {
      changeReason = 'Tạo mới công việc';
    }
    formData.set('changeReason', changeReason);

    // Gửi danh sách đối tác lên backend
    if (staffList.length > 0) {
      formData.set('partners', JSON.stringify(staffList));
    }

    const loadingMessage = message.loading('Đang xử lý...', 0);
    try {
      let taskRes;
      if (modalType === 'create') {
        taskRes = await createTask(formData);
        const taskId = taskRes?.task?.id || taskRes?.id;
        // Lưu từng nhân sự vào task
        if (taskId && staffList.length > 0) {
          await Promise.all(staffList.map(staff => taskService.addTaskStaff(taskId, staff)));
        }
        message.success('Tạo công việc thành công');
        setModalVisible(false);
        fetchAllTasksData();
      } else {
        await updateTask(selectedTask.id, formData);
        // Xử lý cập nhật nhân sự (so sánh danh sách cũ/mới)
        const oldStaff = await taskService.getTaskStaff(selectedTask.id);
        const oldIds = oldStaff.map(s => s.id);
        const newIds = staffList.map(s => s.id);
        // Thêm mới
        const added = staffList.filter(s => !oldIds.includes(s.id));
        // Xóa những nhân sự không còn
        const removed = oldStaff.filter(s => !newIds.includes(s.id));
        // Ghi lại trackChanges.staff nếu có thay đổi
        if (added.length > 0 || removed.length > 0) {
          const trackChanges = {
            staff: {
              added: added.map(s => s.fullName || s.fullname || s.name),
              removed: removed.map(s => s.fullName || s.fullname || s.name),
            },
          };
          formData.set('trackChanges', JSON.stringify(trackChanges));
        }
        // Thêm mới
        for (const staff of staffList) {
          if (!oldIds.includes(staff.id)) {
            const staffData = staff.type
              ? staff
              : {
                  ...staff,
                  type: staff.fullName || staff.fullname ? 'partner' : 'user',
                };
            await taskService.addTaskStaff(selectedTask.id, staffData);
          }
        }
        // Xóa những nhân sự không còn
        for (const old of oldStaff) {
          if (!newIds.includes(old.id)) {
            await taskService.removeTaskStaff(selectedTask.id, old.id, old.type);
          }
        }
        message.success('Cập nhật công việc thành công');
        setModalType('view');
        fetchTaskDetail(selectedTask.id);
        fetchAllTasksData();
      }
    } finally {
      loadingMessage();
      if (modalType === 'edit' && selectedTask?.id && selectedTask.isLocked) {
        try {
          await unlockTask(selectedTask.id);
        } catch (error) {
          if (error.response?.status !== 404) {
            console.error('Error releasing lock:', error);
          }
        }
      }
    }
  } catch (error) {
    console.error('Submit error:', error);
    if (error.message === 'Token expired') {
      message.error('Phiên đăng nhập đã hết hạn');
      navigate('/login');
      return;
    }
    message.error(error.response?.data?.message || 'Có lỗi xảy ra khi lưu thông tin');
  }
};

// Hàm xử lý xóa file đính kèm
export const handleAttachmentRemove = (file, form, setRemovedAttachments) => {
  console.log('Removing attachment:', file);

  // Nếu file đã upload thành công (có url), thêm vào removedAttachments
  if (file.url || file.response) {
    const fileToRemove = file.response || file;
    setRemovedAttachments(prev => {
      // Kiểm tra nếu file đã tồn tại trong removedAttachments
      const exists = prev.some(f => f.path === fileToRemove.path);
      if (!exists) {
        console.log('Added to removedAttachments:', fileToRemove);
        return [...prev, fileToRemove];
      }
      return prev;
    });
  }

  // Cập nhật fileList trong form
  const currentFileList = form.getFieldValue('attachments') || [];
  const updatedFileList = currentFileList.filter(f => f.uid !== file.uid);
  form.setFieldsValue({ attachments: updatedFileList });

  return true; // Cho phép xóa file
};

// Hàm xử lý hiển thị modal lý do
export const showReasonModal = (action, setPendingAction, setReasonModalVisible, reasonForm) => {
  setPendingAction(action);
  setReasonModalVisible(true);
  reasonForm.resetFields();
};

// Hàm xử lý submit lý do
export const handleReasonSubmit = async ({
  reasonForm,
  pendingAction,
  selectedTask,
  handleStatusChange,
  setReasonModalVisible,
}) => {
  try {
    const values = await reasonForm.validateFields();
    const { reason } = values;

    if (pendingAction === 'pause') {
      await handleStatusChange(selectedTask.id, 'pending', false, reason);
    } else if (pendingAction === 'resume') {
      await handleStatusChange(selectedTask.id, 'in_progress', false, reason);
    }

    setReasonModalVisible(false);
    reasonForm.resetFields();
  } catch (error) {
    console.error('Error submitting reason:', error);
  }
};

// Hàm xử lý mở lại task
export const handleReopen = async ({
  reopenForm,
  selectedTask,
  getAuthHeader,
  message,
  navigate,
  setReopenModalVisible,
  fetchTaskDetail,
  fetchAllTasksData,
}) => {
  try {
    const values = await reopenForm.validateFields();
    const { reopenTime, reason } = values;

    // Validate thời gian
    if (!reopenTime) {
      message.warning('Vui lòng chọn thời gian kết thúc mới');
      return;
    }

    // Validate thời gian kết thúc mới phải sau thời gian kết thúc cũ
    if (selectedTask.checkOutTime && dayjs(reopenTime).isBefore(dayjs(selectedTask.checkOutTime))) {
      message.warning('Thời gian kết thúc mới phải sau thời gian kết thúc cũ');
      return;
    }

    const headers = getAuthHeader();
    if (!headers) return;

    const formData = new FormData();
    formData.set('status', 'in_progress');
    formData.set('checkOutTime', reopenTime.format('YYYY-MM-DD HH:mm:ss'));
    formData.set('changeReason', reason || 'Mở lại công việc');

    // Xử lý worker và fullName
    if (selectedTask.staff && selectedTask.staff.length > 0) {
      // Nếu có staff list, gửi dưới dạng JSON
      const staffList = selectedTask.staff.map(staff => ({
        type: staff.type || (staff.fullName ? 'partner' : 'user'),
        id: staff.id,
        fullName: staff.fullName || staff.fullname || staff.name,
        donVi: staff.donVi,
      }));
      formData.set('worker', JSON.stringify(staffList));
    } else if (selectedTask.fullName) {
      // Nếu chỉ có fullName, gửi dưới dạng string
      formData.set('worker', selectedTask.fullName);
      formData.set('fullName', selectedTask.fullName);
    }

    // Thêm các thông tin cơ bản
    formData.set('taskDescription', selectedTask.taskDescription || '');
    formData.set('taskTitle', selectedTask.taskTitle || '');
    formData.set('location', selectedTask.location || '');
    formData.set('checkInTime', selectedTask.checkInTime || '');

    // Track changes
    const trackChanges = {
      status: {
        oldValue: selectedTask.status,
        newValue: 'in_progress',
      },
      checkOutTime: {
        oldValue: selectedTask.checkOutTime,
        newValue: reopenTime.format('YYYY-MM-DD HH:mm:ss'),
      },
    };

    formData.set('trackChanges', JSON.stringify(trackChanges));

    const loadingMessage = message.loading('Đang mở lại công việc...', 0);
    try {
      await axios.put(`${API_URL}/api/tasks/${selectedTask.id}`, formData, {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data',
        },
      });

      message.success('Đã mở lại công việc');
      setReopenModalVisible(false);
      reopenForm.resetFields();
      await fetchTaskDetail(selectedTask.id);
      await fetchAllTasksData();
    } finally {
      loadingMessage();
    }
  } catch (error) {
    console.error('Reopen error:', error);
    if (error.response?.status === 401) {
      message.error('Phiên đăng nhập đã hết hạn');
      navigate('/login');
      return;
    }
    if (error.response?.status === 400) {
      message.error(error.response.data.message || 'Không thể mở lại công việc');
      return;
    }
    message.error('Có lỗi xảy ra khi mở lại công việc');
  }
};
