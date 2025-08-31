import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  message,
  Modal,
  Form,
  Input,
  Typography,
  Card,
  Tag,
  Spin,
  Space,
  Tabs,
  Descriptions,
  Table,
  Popconfirm,
  List,
  Checkbox,
  Row,
  Col,
  Select,
  Progress,
  Alert
} from 'antd';
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
  FileOutlined,
  UserOutlined,
  MailOutlined,
  LoadingOutlined,
  FileWordOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import axios from 'axios';
import DeviceCheckForm from '../components/DeviceCheckForm';
import { sendEmail } from '../services/emailService';
import { exportHandoverToWord } from '../utils/wordExport';
import { DEVICE_ERROR_STATUS, DEVICE_ERROR_STATUS_COLORS } from '../constants/deviceErrorStatus';

const { TextArea } = Input;
const { Title, Text } = Typography;

const HandoverDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, authLoading } = useAuth();



  const [loading, setLoading] = useState(false);
  const [templateLoading, setTemplateLoading] = useState(false);
  const [templateError, setTemplateError] = useState(null);
  const [handover, setHandover] = useState(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [confirmNote, setConfirmNote] = useState('');
  const [rejectNote, setRejectNote] = useState('');
  const [isInReceivingShift, setIsInReceivingShift] = useState(false);
  const [isInCurrentShift, setIsInCurrentShift] = useState(false);
  const confirmFormRef = useRef(null);
  const rejectFormRef = useRef(null);
  const [attachmentsLoading, setAttachmentsLoading] = useState(false);
  const [attachmentsError, setAttachmentsError] = useState(null);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [emailForm] = Form.useForm();
  // Thêm state cho email sending status
  const [emailSendingStatus, setEmailSendingStatus] = useState({
    isSending: false,
    step: '',
    progress: 0,
    error: null
  });

  // State cho xuất Word
  const [exportingWord, setExportingWord] = useState(false);

  // Fetch template
  useEffect(() => {
    const fetchTemplate = async () => {
      // Wait for auth to be ready
      if (authLoading) return;

      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Vui lòng đăng nhập');
        navigate('/login');
        return;
      }

      setTemplateLoading(true);
      setTemplateError(null);
      try {
        await axios.get(`${import.meta.env.VITE_API_URL}/api/form-templates/handover`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (error) {
        console.error('Error fetching template:', error);
        setTemplateError(error.message);
        if (error.response?.status === 401) {
          message.error('Phiên đăng nhập hết hạn');
          navigate('/login');
        } else if (error.response?.status === 403) {
          message.error('Bạn không có quyền truy cập template');
        } else {
          message.error('Không thể tải template form bàn giao');
        }
      } finally {
        setTemplateLoading(false);
      }
    };
    fetchTemplate();
  }, [authLoading, navigate]);

  useEffect(() => {
    fetchHandoverDetails();
  }, [id]);

  const fetchHandoverDetails = async () => {
    try {
      setLoading(true);
      setAttachmentsLoading(true);
      setAttachmentsError(null);

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/shifts/handover/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setHandover(response.data);

      // Kiểm tra người dùng có thuộc ca nhận không
      let isUserInShift = false;

      console.log('Debug handover check:', {
        currentUser: currentUser?.id,
        currentShiftId: currentUser?.currentShiftId,
        toShiftId: response.data.toShiftId,
        toShiftCode: response.data.ToShift?.code,
        currentShiftCode: currentUser?.currentShiftCode
      });

      // Kiểm tra shift hiện tại của user có phải là toShift của handover không
      if (currentUser?.currentShiftId && response.data.toShiftId) {
        isUserInShift = Number(currentUser.currentShiftId) === Number(response.data.toShiftId);
        console.log('Check by currentShiftId:', isUserInShift);
      }

      // Fallback: kiểm tra theo ToUsers nếu không có currentShiftId
      if (!isUserInShift && response.data.ToUsers && Array.isArray(response.data.ToUsers)) {
        isUserInShift = response.data.ToUsers.some(
          user => user.id === currentUser?.id
        );
        console.log('Check by ToUsers:', isUserInShift);
      }

      // Fallback: kiểm tra theo ToShift.Users nếu không có currentShiftId
      if (!isUserInShift && response.data.ToShift?.Users) {
        isUserInShift = response.data.ToShift.Users.some(
          user => user.id === currentUser?.id
        );
        console.log('Check by ToShift.Users:', isUserInShift);
      }

      // Fallback: kiểm tra theo currentShiftCode nếu không có currentShiftId
      if (!isUserInShift && currentUser?.currentShiftCode) {
        isUserInShift = response.data.ToShift?.code === currentUser.currentShiftCode;
        console.log('Check by currentShiftCode:', isUserInShift);
      }

      setIsInReceivingShift(isUserInShift);

      // Kiểm tra người dùng có thuộc ca hiện tại không
      const isUserInCurrentShift = response.data.FromUsers?.some(
        user => user.id === currentUser?.id
      );
      setIsInCurrentShift(isUserInCurrentShift);

    } catch (error) {
      console.error('Error fetching handover details:', error);
      setAttachmentsError('Có lỗi khi tải thông tin file đính kèm');
      message.error('Có lỗi khi tải thông tin biên bản bàn giao');
      navigate('/dc/handover');
    } finally {
      setLoading(false);
      setAttachmentsLoading(false);
    }
  };

  useEffect(() => {
    console.log('Current ToUsers:', handover?.ToUsers);
    console.log('Current ToShift:', handover?.ToShift);

    // Debug resolveStatus data
    if (handover?.devices) {
      console.log('=== Debug Device ResolveStatus ===');
      handover.devices.forEach((device, index) => {
        console.log(`Device ${index + 1}:`, {
          deviceName: device.deviceNameSnapshot,
          status: device.status,
          resolveStatus: device.resolveStatus,
          errorCode: device.errorCode
        });
      });
      console.log('=== End Debug ===');
    }
  }, [handover]);

  // Thêm hàm xử lý confirm dialog
  const showConfirmDialog = () => {
    setEmailModalVisible(true);
  };

  const handleSendHandover = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Vui lòng đăng nhập');
        navigate('/login');
        return;
      }

      // Kiểm tra người dùng có thuộc ca không
      if (!isInCurrentShift) {
        message.error('Bạn không thuộc ca này');
        return;
      }

      // Kiểm tra trạng thái handover
      if (handover.status !== 'draft') {
        message.error('Chỉ có thể gửi bàn giao ở trạng thái bản nháp');
        return;
      }

      // Lấy thông tin email từ form
      const emailTo = emailForm.getFieldValue('to') || [];
      const emailCc = emailForm.getFieldValue('cc') || [];
      const customContent = emailForm.getFieldValue('customContent') || '';

      // Kiểm tra người nhận email
      if (emailTo.length === 0) {
        message.error('Vui lòng nhập ít nhất một địa chỉ email người nhận');
        return;
      }

      // Fetch file contents for attachments
      const attachmentPromises = (handover.attachments || []).map(async (file) => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/shifts/handover/${handover.id}/attachments/${file.filename}`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              },
              responseType: 'arraybuffer'
            }
          );

          // Convert ArrayBuffer to base64 string
          const base64String = btoa(
            new Uint8Array(response.data)
              .reduce((data, byte) => data + String.fromCharCode(byte), '')
          );

          return {
            filename: file.originalname || file.filename,
            content: base64String,
            contentType: response.headers['content-type']
          };
        } catch (error) {
          console.error('Error fetching attachment:', error);
          return null;
        }
      });

      const attachments = (await Promise.all(attachmentPromises)).filter(Boolean);
      const emailData = {
        to: emailTo,
        cc: emailCc,
        subject: `Báo cáo ca ${handover.FromShift?.code} ngày ${format(new Date(handover.FromShift?.date), 'dd/MM/yyyy', { locale: vi })}`,
        html: `
          <div style="font-family: Arial, sans-serif; width: 100%;">
          ${customContent ? `
          <div >
            ${customContent.replace(/\n/g, '<br>')}
          </div>
          ` : ''}
            <h2 style="color: #003c71; margin-bottom: 20px;">Biên bản bàn giao ca</h2>
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb;">
              <tbody>
                <tr>
                  <td style="padding: 12px; background-color: #f3f4f6; font-weight: bold; width: 30%; border: 1px solid #e5e7eb;">Ca làm việc</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">${handover.FromShift?.code} - ${format(new Date(handover.FromShift?.date), 'dd/MM/yyyy', { locale: vi })}</td>
                </tr>
                <tr>
                  <td style="padding: 12px; background-color: #f3f4f6; font-weight: bold; border: 1px solid #e5e7eb;">Thành viên</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">
                    ${handover.FromUsers?.map(user => user.fullname || user.fullName).join(', ')}
                  </td>
                </tr>
              </tbody>
            </table>

            <h3 style="color: #003c71; margin: 20px 0 10px;">Nội dung bàn giao</h3>
            <table style="width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb;">
              <tbody>
                <tr>
                  <td style="padding: 12px; background-color: #f3f4f6; font-weight: bold; width: 30%; border: 1px solid #e5e7eb;">Công cụ, tài liệu</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">
                    ${handover.handoverForm?.tools?.status === 'complete' ? '✓ Đủ' : '⚠️ Thiếu'}
                    ${handover.handoverForm?.tools?.missing?.items?.length > 0 ?
            `<br>Thiếu: ${handover.handoverForm.tools.missing.items.join(', ')}` : ''}
                        ${handover.handoverForm?.tools.missing.description
            ? `<br>Mô tả: ${handover.handoverForm?.tools.missing.description}`
            : ''
          }
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px; background-color: #f3f4f6; font-weight: bold; border: 1px solid #e5e7eb;">Vệ sinh môi trường</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">
                    ${handover.handoverForm?.environment?.status ? '✓ Tốt' : '⚠️ Chưa tốt'}
                    ${handover.handoverForm?.environment?.description ?
            `<br>Mô tả: ${handover.handoverForm?.environment?.description}` : ''}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px; background-color: #f3f4f6; font-weight: bold; border: 1px solid #e5e7eb;">Thiết bị có lỗi</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">
                    ${handover.devices?.filter(d => d.status === 'Có lỗi').length > 0 ?
            handover.devices.filter(d => d.status === 'Có lỗi').map(d => {
              return `
                          <div style="margin-bottom: 12px; padding: 8px; background-color: #fff1f0; border-left: 4px solid #ff4d4f;">
                            <div style="font-weight: bold; color: #ff4d4f; margin-bottom: 4px;">
                              ${d.deviceNameSnapshot || 'Hệ thống không xác định'}
                            </div>
                            <div style="margin-left: 12px;">
                              <div><strong>Thiết bị:</strong> ${d.subDeviceName || 'Không xác định'}</div>
                              <div><strong>Serial:</strong> ${d.serialNumber || 'Không có'}</div>
                              <div><strong>Mã lỗi:</strong> ${d.errorCode || 'Không có'}</div>
                              <div><strong>Trạng thái xử lý:</strong> <span style="color: ${d.resolveStatus && d.resolveStatus.trim() ? getResolveStatusColor(d.resolveStatus) : '#8c8c8c'};">${d.resolveStatus && d.resolveStatus.trim() ? d.resolveStatus : 'Không áp dụng'}</span></div>
                              <div><strong>Nguyên nhân:</strong> ${d.errorCause || 'Không có'}</div>
                              <div><strong>Giải pháp:</strong> ${d.solution || 'Không có'}</div>
                            </div>
                          </div>
                        `;
            }).join('') : '✓ Không có lỗi'}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px; background-color: #f3f4f6; font-weight: bold; border: 1px solid #e5e7eb;">Công việc tồn đọng</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">
                    ${handover.Tasks?.length > 0 ?
            handover.Tasks.map(task => {
              const getStatusColor = (status) => {
                switch (status) {
                  case 'in_progress': return '#1890ff'; // blue
                  case 'waiting': return '#faad14';     // orange
                  case 'completed': return '#52c41a';   // green
                  case 'cancelled': return '#ff4d4f';   // red
                  case 'pending': return '#faad14';
                }
              };
              const getStatusText = (status) => {
                switch (status) {
                  case 'in_progress': return 'Đang thực hiện';
                  case 'waiting': return 'Chờ xử lý';
                  case 'completed': return 'Đã hoàn thành';
                  case 'cancelled': return 'Đã hủy';
                  case 'pending': return 'Tạm dừng';
                }
              };
              return `
                          <div style="margin-bottom: 16px; padding: 12px; background-color: #fafafa; border-left: 4px solid ${getStatusColor(task.status)};">
                            <div style="font-weight: bold; font-size: 16px; margin-bottom: 8px;">
                              CV${task.taskId} - ${task.taskTitle}
                            </div>
                            <div style="margin-left: 12px;">
                              <div style="margin-bottom: 4px;"><strong>Nội dung:</strong> ${task.taskDescription || 'Không có'}</div>
                              <div style="margin-bottom: 4px;"><strong>Người thực hiện:</strong> ${task.fullName || 'Chưa phân công'}</div>
                              <div style="margin-bottom: 4px;">
                                <strong>Thời gian:</strong>
                                ${task.checkInTime ? format(new Date(task.checkInTime), 'HH:mm dd/MM/yyyy', { locale: vi }) : 'Chưa bắt đầu'}
                                ${task.checkOutTime ? ` - ${format(new Date(task.checkOutTime), 'HH:mm dd/MM/yyyy', { locale: vi })}` : ''}
                              </div>
                              <div style="margin-top: 8px; color: ${getStatusColor(task.status)}; font-weight: bold;">
                                Trạng thái: ${getStatusText(task.status)}
                              </div>
                            </div>
                          </div>
                        `;
            }).join('') : '✓ Không có công việc tồn đọng'}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px; background-color: #f3f4f6; font-weight: bold; border: 1px solid #e5e7eb;">Ghi chú bàn giao</td>
                  <td style="padding: 12px; border: 1px solid #e5e7eb;">${handover.content || 'Không có'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        `,
        attachments
      };

      // Gửi email và kiểm tra kết quả
      try {
        setEmailSendingStatus({
          isSending: true,
          step: 'Đang chuẩn bị gửi email...',
          progress: 10,
          error: null
        });

        // Xử lý attachments
        if (emailData.attachments?.length > 0) {
          setEmailSendingStatus(prev => ({
            ...prev,
            step: 'Đang xử lý file đính kèm...',
            progress: 30
          }));
        }

        setEmailSendingStatus(prev => ({
          ...prev,
          step: 'Đang gửi email...',
          progress: 50
        }));

        const emailResult = await sendEmail(emailData);

        if (!emailResult.success) {
          throw new Error(emailResult.message || 'Gửi email thất bại');
        }

        setEmailSendingStatus(prev => ({
          ...prev,
          step: 'Gửi email thành công!',
          progress: 100
        }));

        message.success('Gửi email thành công');
      } catch (error) {
        console.error('Error sending email:', error);
        setEmailSendingStatus(prev => ({
          ...prev,
          isSending: false,
          step: 'Gửi email thất bại',
          progress: 0,
          error: error.message || 'Gửi email thất bại. Vui lòng thử lại sau.'
        }));
        message.error(error.message || 'Gửi email thất bại. Vui lòng thử lại sau.');
        return; // Dừng quá trình nếu gửi email thất bại
      }

      // Nếu gửi email thành công, tiếp tục gửi bàn giao
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/shifts/handover/draft/${id}/submit`,
          {
            handoverForm: handover.handoverForm
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data && !response.data.error) {
          message.success('Gửi bàn giao thành công');
          setEmailModalVisible(false);
          setEmailSendingStatus({
            isSending: false,
            step: '',
            progress: 0,
            error: null
          });
          fetchHandoverDetails();
          navigate('/dc/handover');
        } else {
          message.error(response.data.message || 'Có lỗi khi gửi bàn giao');
        }
      } catch (error) {
        console.error('Error sending handover:', error);
        message.error('Gửi bàn giao thất bại. Vui lòng thử lại sau.');
      }
    } catch (error) {
      console.error('Error in handleSendHandover:', error);
      message.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/api/shifts/handover/confirm/${id}`, {
        notes: confirmNote
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      message.success('Xác nhận bàn giao thành công');
      setConfirmModalVisible(false);
      setConfirmNote('');
      fetchHandoverDetails();
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi khi xác nhận bàn giao');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/api/shifts/handover/reject/${id}`, {
        notes: rejectNote
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      message.success('Từ chối bàn giao thành công');
      setRejectModalVisible(false);
      setRejectNote('');
      fetchHandoverDetails();
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi khi từ chối bàn giao');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => navigate('/dc/handover');

  // Hàm xuất biên bản Word
  const handleExportWord = async () => {
    try {
      setExportingWord(true);
      const result = await exportHandoverToWord(handover);

      if (result.success) {
        message.success(`Đã xuất biên bản Word: ${result.fileName}`);
      } else {
        message.error(`Lỗi khi xuất Word: ${result.error}`);
      }
    } catch (error) {
      console.error('Error exporting Word:', error);
      message.error('Có lỗi xảy ra khi xuất biên bản Word');
    } finally {
      setExportingWord(false);
    }
  };

  // Hàm download file với tên gốc
  const downloadFile = async (file) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Tạo URL cho API download
      const url = `${import.meta.env.VITE_API_URL}/api/shifts/handover/${handover.id}/attachments/${file.filename}`;

      // Sử dụng axios để download file
      const response = await axios({
        url,
        method: 'GET',
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Tạo URL cho blob
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const downloadUrl = window.URL.createObjectURL(blob);

      // Tạo link tạm thời để download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = file.originalname; // Sử dụng tên gốc của file
      document.body.appendChild(link);
      link.click();

      // Dọn dẹp
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      message.success('Tải file thành công');
    } catch (error) {
      console.error('Error downloading file:', error);
      message.error('Không thể tải file. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const statusMap = {
    draft: <Tag color="blue">Đang làm việc</Tag>,
    pending: <Tag color="orange">Chờ xác nhận</Tag>,
    completed: <Tag color="green">Đã bàn giao</Tag>,
    rejected: <Tag color="red">Đã từ chối</Tag>
  };

  const getSafeValue = (primary, fallback, defaultVal = 'Không rõ') => primary || fallback || defaultVal;

  // Helper function để lấy màu sắc cho trạng thái xử lý
  const getResolveStatusColor = (status) => {
    if (!status || !status.trim()) return '#8c8c8c'; // Màu xám cho thiết bị bình thường

    switch (status) {
      case DEVICE_ERROR_STATUS.RESOLVED:
        return DEVICE_ERROR_STATUS_COLORS.RESOLVED;
      case DEVICE_ERROR_STATUS.IN_PROGRESS:
        return DEVICE_ERROR_STATUS_COLORS.IN_PROGRESS;
      case DEVICE_ERROR_STATUS.PENDING:
      default:
        return DEVICE_ERROR_STATUS_COLORS.PENDING;
    }
  };

  // Helper function để lấy Tag color cho trạng thái xử lý
  const getResolveStatusTagColor = (status) => {
    if (!status || !status.trim()) return 'default'; // Cho thiết bị bình thường

    switch (status) {
      case DEVICE_ERROR_STATUS.RESOLVED:
        return 'success';
      case DEVICE_ERROR_STATUS.IN_PROGRESS:
        return 'warning';
      case DEVICE_ERROR_STATUS.PENDING:
      default:
        return 'error';
    }
  };

  const handleEdit = () => {
    navigate(`/dc/handover/edit/${id}`);
  };

  useEffect(() => {
    console.log('=== Debug User Data ===');
    console.log('Handover status:', handover?.status);
    console.log('FromUsers:', handover?.FromUsers);
    console.log('FromShift workedUsers:', handover?.FromShift?.workedUsers);
    console.log('ToUsers:', handover?.ToUsers);
    console.log('ToShift:', handover?.ToShift);
    console.log('=====================');
  }, [handover]);

  if (loading || templateLoading) {
    return (
      <Spin spinning={loading} tip="Đang tải..." fullscreen>
        <div className="p-6">
          {/* Nội dung trang */}
        </div>
      </Spin>
    );
  }

  if (templateError) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Lỗi khi tải template: {templateError}</p>
        </div>
      </div>
    );
  }

  if (!handover) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-gradient-to-r from-[#003c71] to-[#0079c2] text-white p-4 rounded shadow mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Button type="link" icon={<ArrowLeftOutlined />} onClick={handleBack} className="text-white">Quay lại</Button>
          </div>
          <div>
            <Title level={3} style={{ color: 'white', margin: 0 }}>Chi tiết bàn giao</Title>
          </div>
        </div>
        <p className="mt-1 text-sm text-white">Thông tin chi tiết về biên bản bàn giao giữa các ca trực</p>
      </div>

      <div>
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: '1',
              label: <span className="font-medium text-base">Thông tin bàn giao</span>,
              className: "custom-tab",
              children: (
                <div className="space-y-6">
                  {/* Thông tin bàn giao ca */}
                  <Card
                    title={<div className="text-2xl font-bold text-center font-['Roboto']">BIÊN BẢN BÀN GIAO CA</div>}
                    variant="outlined"
                    className="shadow-sm w-full"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <span className="font-medium mr-2 min-w-[120px]">Trạng thái:</span>
                        {statusMap[handover.status]}
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium mr-2 min-w-[120px]">Địa điểm làm việc:</span>
                        <span>{getSafeValue(handover.FromShift?.name)}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium mr-2 min-w-[120px]">Ca làm việc:</span>
                        <span>{`${getSafeValue(handover.FromShift?.code)} - ${format(new Date(handover.FromShift?.date), 'dd/MM/yyyy', { locale: vi })}`}</span>
                      </div>
                      {handover.confirmedAt && (
                        <div className="flex items-center">
                          <span className="font-medium mr-2 min-w-[120px]">Thời gian bàn giao ca:</span>
                          <span>{format(new Date(handover.confirmedAt), 'HH:mm dd/MM/yyyy ', { locale: vi })}</span>
                        </div>
                      )}
                      {handover.confirmNote && (
                        <div className="flex items-start">
                          <span className="font-medium mr-2 min-w-[120px]">Ghi chú xác nhận:</span>
                          <span>{handover.confirmNote}</span>
                        </div>
                      )}
                      {handover.rejectNote && (
                        <div className="flex items-start">
                          <span className="font-medium mr-2 min-w-[120px]">Lý do từ chối:</span>
                          <span className="text-red-600">{handover.rejectNote}</span>
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Ca giao/Ca nhận - 2 columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card title="Bên giao ca" variant="outlined" className="shadow-sm">
                      <p><strong>Người giao:</strong></p>
                      <ul className="ml-4 list-disc">
                        {(handover.FromUsers || []).map(user => (
                          <li key={user.id}>
                            {user.fullname || user.fullName}
                          </li>
                        ))}
                      </ul>
                    </Card>

                    <Card title="Bên nhận ca" variant="outlined" className="shadow-sm">
                      <p><strong>Người nhận:</strong></p>
                      {handover.ToUsers && handover.ToUsers.length > 0 ? (
                        <ul className="ml-4 list-disc">
                          {handover.ToUsers.map(user => (
                            <li key={user.id}>
                              {user.fullname || user.fullName}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-gray-500 italic ml-4">
                          Chưa có người nhận ca
                        </div>
                      )}
                    </Card>
                  </div>

                  {/* Form Data - Full width */}
                  {handover.handoverForm && (
                    <div className="space-y-6 w-full">
                      {/* 1. Công cụ, tài liệu làm việc */}
                      <Card title="1. Công cụ, tài liệu làm việc" variant="outlined" className="shadow-sm">
                        <div className="space-y-4">
                          <div>
                            <p className="mb-2">Tình trạng công cụ tài liệu</p>
                            <div>
                              <Tag color={handover.handoverForm?.tools?.status === 'complete' ? 'blue' : 'red'}>
                                {handover.handoverForm?.tools?.status === 'complete' ? 'Đủ' : 'Thiếu'}
                              </Tag>
                            </div>
                          </div>

                          {handover.handoverForm?.tools?.missing?.items && handover.handoverForm.tools.missing.items.length > 0 && (
                            <div>
                              <p className="font-medium mb-2">Các mục thiếu:</p>
                              <ul className="list-disc pl-5 space-y-1">
                                {handover.handoverForm.tools.missing.items.map((item, index) => (
                                  <li key={index}>{item}</li>
                                ))}
                              </ul>
                              {handover.handoverForm.tools.missing.description && (
                                <div className="mt-4">
                                  <p className="font-medium mb-2">Mô tả nguyên nhân thiếu thiết bị:</p>
                                  <div className="bg-gray-50 p-4 rounded">
                                    {handover.handoverForm.tools.missing.description}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </Card>

                      {/* 2. Vệ sinh môi trường trong các phòng chức năng */}
                      <Card title="2. Vệ sinh môi trường trong các phòng chức năng" variant="outlined" className="shadow-sm">
                        <div className="space-y-4">
                          <div>
                            <p className="mb-2">Hiện trạng vệ sinh môi trường</p>
                            <div>
                              <Tag color={handover.handoverForm?.environment?.status ? 'success' : 'error'}>
                                {handover.handoverForm?.environment?.status ? 'Tốt' : 'Chưa tốt'}
                              </Tag>
                            </div>
                          </div>

                          {!handover.handoverForm?.environment?.status && (
                            <div>
                              <p className="mb-2">Mô tả chi tiết tình trạng môi trường</p>
                              <div className="bg-gray-50 p-4 rounded">
                                {handover.handoverForm?.environment?.description || 'Không có mô tả'}
                              </div>
                            </div>
                          )}
                        </div>
                      </Card>

                      {/* 3. Tình trạng các hệ thống hạ tầng TTDL */}
                      <Card title="3. Tình trạng các hệ thống hạ tầng TTDL" variant="outlined" className="shadow-sm">
                        <div className="space-y-4">
                          <Table
                            bordered
                            size="small"
                            rowKey="id"
                            pagination={false}
                            columns={[
                              {
                                title: 'STT',
                                dataIndex: 'index',
                                key: 'index',
                                width: 60,
                                className: 'custom-header border-gray-200',
                                render: (_, __, index) => (
                                  <div className="text-center">
                                    {index + 1}
                                  </div>
                                )
                              },
                              {
                                title: 'Thiết bị',
                                dataIndex: 'deviceId',
                                key: 'deviceId',
                                width: '30%',
                                className: 'custom-header border-gray-200',
                                render: (deviceId, record) => {
                                  // Sử dụng deviceNameSnapshot từ API response
                                  return record.deviceNameSnapshot || `Thiết bị ${deviceId}`;
                                }
                              },
                              {
                                title: 'Trạng thái',
                                key: 'status',
                                width: '70%',
                                className: 'custom-header border-gray-200',
                                render: (_, record) => {
                                  // Sử dụng trực tiếp dữ liệu từ record (đã là device từ API)
                                  if (record.status === 'Bình thường') {
                                    return <Tag color="success">✓ Bình thường</Tag>;
                                  } else if (record.status === 'Có lỗi') {
                                    return (
                                      <Space direction="vertical" className="w-full">
                                        <Tag color="error">✓ Có lỗi</Tag>
                                        <Card
                                          style={{ background: '#fff1f0', borderColor: '#ff4d4f' }}
                                          title={<span style={{ color: '#ff4d4f' }}>Tên thiết bị: {record.subDeviceName || 'Không rõ'}</span>}
                                        >
                                          <div className="ant-descriptions-item"><b>Serial:</b> {record.serialNumber}</div>
                                          <div className="ant-descriptions-item"><b>Tình trạng lỗi:</b> {record.errorCode}</div>
                                          <div className="ant-descriptions-item"><b>Nguyên nhân:</b> {record.errorCause}</div>
                                          <div className="ant-descriptions-item"><b>Giải pháp:</b> {record.solution}</div>
                                          <div className="ant-descriptions-item"><b>Trạng thái:</b>{record.resolveStatus && record.resolveStatus.trim() ? (
                                            <Tag color={getResolveStatusTagColor(record.resolveStatus)} style={{ marginLeft: 8 }}>
                                              {record.resolveStatus}
                                            </Tag>
                                          ) : (
                                            <span style={{ marginLeft: 8, color: '#8c8c8c' }}>Không áp dụng</span>
                                          )}
                                          </div>
                                        </Card>
                                      </Space>
                                    );
                                  }
                                  return <Tag color="default">Không xác định</Tag>;
                                }
                              }
                            ]}
                            dataSource={handover.devices || []}
                          />
                        </div>
                      </Card>

                      {/* 4. Các công việc đang thực hiện */}
                      <Card title="4. Các công việc đang thực hiện" variant="outlined" className="shadow-sm">
                        <div className="space-y-4">
                          <div>
                            <p className="mb-2">Công việc đang tồn đọng</p>
                            <div>
                              <Tag color={handover.Tasks?.length > 0 ? 'blue' : 'default'}>
                                {handover.Tasks?.length > 0 ? 'Có' : 'Không Có'}
                              </Tag>
                            </div>
                          </div>

                          {handover.Tasks?.length > 0 && (
                            <Table
                              bordered
                              size="small"
                              rowKey="id"
                              pagination={false}
                              columns={[
                                {
                                  title: 'Mã',
                                  dataIndex: 'taskId',
                                  key: 'taskId',
                                  width: 60,
                                  className: 'custom-header border-gray-200',
                                  render: (text) => (
                                    <div className="text-center">
                                      CV {text}
                                    </div>
                                  )
                                },
                                {
                                  title: 'Địa điểm',
                                  dataIndex: 'location',
                                  key: 'location',
                                  width: 100,
                                  className: 'custom-header border-gray-200',
                                },
                                {
                                  title: 'Tiêu đề công việc',
                                  dataIndex: 'taskTitle',
                                  key: 'taskTitle',
                                  width: 300,
                                  className: 'custom-header border-gray-200',
                                },
                                {
                                  title: 'Nội dung công việc',
                                  dataIndex: 'taskDescription',
                                  key: 'taskDescription',
                                  width: 300,
                                  className: 'custom-header border-gray-200',
                                },
                                {
                                  title: 'Người thực hiện',
                                  dataIndex: 'fullName',
                                  key: 'fullName',
                                  width: 300,
                                  className: 'custom-header border-gray-200',
                                  render: (name) => (
                                    <div className="whitespace-pre-line break-words">
                                      {name.split(',').map((person, index) => (
                                        <div key={`person-${index}-${person.trim()}`} className="flex items-center mb-1">
                                          <UserOutlined className="mr-1 flex-shrink-0" />
                                          <span className="break-words">{person.trim()}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )
                                },
                                {
                                  title: 'Thời gian bắt đầu',
                                  dataIndex: 'checkInTime',
                                  key: 'checkInTime',
                                  width: 150,
                                  className: 'custom-header border-gray-200',
                                  render: (time) => time ? format(new Date(time), 'HH:mm dd/MM/yyyy', { locale: vi }) : 'Chưa bắt đầu'
                                },
                                {
                                  title: 'Thời gian kết thúc',
                                  dataIndex: 'checkOutTime',
                                  key: 'checkOutTime',
                                  width: 150,
                                  className: 'custom-header border-r border-gray-200',
                                  render: (time) => time ? format(new Date(time), 'HH:mm dd/MM/yyyy', { locale: vi }) : 'Chưa kết thúc'
                                },
                                {
                                  title: 'Trạng thái',
                                  dataIndex: 'status',
                                  key: 'status',
                                  width: 120,
                                  className: 'custom-header border-r border-gray-200',
                                  render: (status) => (
                                    <Tag color={
                                      status === 'completed' ? 'success' :
                                        status === 'cancelled' ? 'error' :
                                          status === 'in_progress' ? 'processing' :
                                            status === 'pending' ? 'warning' :
                                              status === 'waiting' ? 'warning' :
                                                'default'
                                    }>
                                      {status === 'in_progress' ? 'Đang thực hiện' :
                                        status === 'waiting' ? 'Chờ xử lý' :
                                          status === 'completed' ? 'Đã hoàn thành' :
                                            status === 'cancelled' ? 'Đã hủy' :
                                              status === 'pending' ? 'Tạm dừng' :
                                                'Không xác định'}
                                    </Tag>
                                  )
                                },
                              ]}
                              dataSource={handover.Tasks}
                            />
                          )}
                        </div>
                      </Card>
                      {/* 5. Nội dung bàn giao */}
                      <Card title="5. Nội dung bàn giao" variant="outlined" className="shadow-sm">
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded">
                            {handover.content || 'Không có nội dung bàn giao'}
                          </div>
                        </div>
                      </Card>

                      {/* 6. File đính kèm */}
                      <Card title="6. File đính kèm" variant="outlined" className="shadow-sm">
                        <div className="space-y-4">
                          {attachmentsLoading ? (
                            <div className="text-center py-4">
                              <Spin tip="Đang tải danh sách file..." />
                            </div>
                          ) : attachmentsError ? (
                            <div className="text-center py-4">
                              <Text type="danger">{attachmentsError}</Text>
                            </div>
                          ) : handover.attachments && handover.attachments.length > 0 ? (
                            <List
                              className="mt-4"
                              size="small"
                              dataSource={handover.attachments}
                              renderItem={file => (
                                <List.Item
                                  actions={[
                                    <Button
                                      type="link"
                                      icon={<DownloadOutlined />}
                                      onClick={() => downloadFile(file)}
                                    >
                                      Tải xuống
                                    </Button>
                                  ]}
                                >
                                  <List.Item.Meta
                                    avatar={<FileOutlined />}
                                    title={file.originalname}
                                    description={`${(file.size / 1024).toFixed(2)} KB`}
                                  />
                                </List.Item>
                              )}
                            />
                          ) : (
                            <div className="text-center py-4">
                              <Text type="secondary">Không có file đính kèm</Text>
                            </div>
                          )}
                        </div>
                      </Card>
                    </div>
                  )}

                  {/* Action Buttons for Edit - At the end of tab content */}
                  {handover.status === 'draft' && isInCurrentShift && (
                    <div className="flex justify-end mt-6 gap-1">
                      <Button
                        type="primary"
                        onClick={handleEdit}
                        style={{ backgroundColor: '#1890ff', borderColor: '#1890ff' }}
                      >
                        Chỉnh sửa
                      </Button>
                      <Button
                        type="primary"
                        onClick={showConfirmDialog}
                        loading={loading}
                        danger
                      >
                        Bàn giao ca
                      </Button>
                    </div>
                  )}

                  {/* Nút xuất Word - luôn hiển thị
                  <div className="flex justify-end mt-4">
                    <Button
                      type="default"
                      icon={<FileWordOutlined />}
                      onClick={handleExportWord}
                      loading={exportingWord}
                      style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', color: 'white' }}
                    >
                      Xuất biên bản Word
                    </Button>
                  </div>*/}
                  {/* Action Buttons */}
                  <div className="flex gap-4 justify-end" style={{ position: 'sticky', bottom: 0, padding: '10px' }}>
                    {handover.status === 'pending' && isInReceivingShift && (
                      <>
                        <Button
                          type="primary"
                          className="bg-[#003c71]"
                          icon={<CheckCircleOutlined />}
                          onClick={() => setConfirmModalVisible(true)}
                          disabled={!isInReceivingShift}
                        >
                          Xác nhận nhận ca
                        </Button>
                        <Button
                          danger
                          icon={<CloseCircleOutlined />}
                          onClick={() => setRejectModalVisible(true)}
                          disabled={!isInReceivingShift}
                        >
                          Từ chối
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )
            },
            {
              key: '2',
              label: <span className="font-medium text-base">Kiểm tra thiết bị</span>,
              className: "custom-tab",
              children: (
                <div className="bg-white p-1 rounded-lg px-6">
                  <DeviceCheckForm
                    currentShift={{
                      WorkShift: {
                        id: handover?.fromShiftId,
                        code: handover?.FromShift?.code,
                        name: handover?.FromShift?.name,
                        date: handover?.FromShift?.date,
                        status: handover?.FromShift?.status
                      }
                    }}
                    currentUser={currentUser}
                    hideCreateButton={true}
                    hideDeleteButton={true}
                  />
                </div>
              )
            }
          ]}
        />
      </div>

      {/* Bottom Back Button */}
      <div className="mt-6 flex justify-center">
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          className="bg-[#003c71]"
        >
          Quay lại danh sách
        </Button>
      </div>

      <Modal
        title="Xác nhận nhận ca"
        open={confirmModalVisible}
        onOk={handleConfirm}
        onCancel={() => setConfirmModalVisible(false)}
        confirmLoading={loading}
        okButtonProps={{ className: 'bg-[#003c71]' }}
        destroyOnHidden
      >
        <Form ref={confirmFormRef} layout="vertical">
          <Form.Item label="Ghi chú">
            <TextArea rows={4} value={confirmNote} onChange={(e) => setConfirmNote(e.target.value)} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={
          <div className="flex items-center gap-2">
            <MailOutlined />
            <span>Gửi email bàn giao</span>
          </div>
        }
        open={emailModalVisible}
        onOk={handleSendHandover}
        onCancel={() => {
          setEmailModalVisible(false);
          setEmailSendingStatus({
            isSending: false,
            step: '',
            progress: 0,
            error: null
          });
        }}
        footer={[
          <Button key="back" onClick={() => {
            setEmailModalVisible(false);
            setEmailSendingStatus({
              isSending: false,
              step: '',
              progress: 0,
              error: null
            });
          }}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleSendHandover}
            className="bg-[#003c71]"
            disabled={emailSendingStatus.isSending}
          >
            Gửi email và bàn giao
          </Button>
        ]}
        width={800}
      >
        <Form
          form={emailForm}
          layout="vertical"
          initialValues={{
            to: ['datacenter@vietinbank.vn'],
            cc: ['anhtt@vietinbank.vn', 'nhandv@vietinbank.vn', 'huu.nguyen@vietinbank.vn']
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="to"
                label="Người nhận"
                rules={[{ required: true, message: 'Vui lòng nhập email người nhận' }]}
              >
                <Select
                  mode="tags"
                  placeholder="Nhập email người nhận"
                  style={{ width: '100%' }}
                  tokenSeparators={[',', ';']}
                  onInputKeyDown={(e) => {
                    if (e.key === 'Tab') {
                      e.stopPropagation();
                    }
                  }}
                />
              </Form.Item>

              <Form.Item
                name="cc"
                label="CC"
              >
                <Select
                  mode="tags"
                  placeholder="Nhập email CC"
                  style={{ width: '100%' }}
                  tokenSeparators={[',', ';']}
                  onInputKeyDown={(e) => {
                    if (e.key === 'Tab') {
                      e.stopPropagation();
                    }
                  }}
                />
              </Form.Item>
              <Form.Item
                name="customContent"
                label="Nội dung "
                tooltip="Nội dung này sẽ được hiển thị ở đầu email"
              >
                <TextArea
                  autoSize={{ minRows: 3, maxRows: 6 }}
                  placeholder="Nhập nội dung  (tùy chọn)"
                  style={{ resize: 'none' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <div className="bg-gray-50 p-4 rounded border border-gray-200" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <h3 className="text-lg font-semibold mb-4">Nội dung email sẽ gửi:</h3>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-3 font-medium bg-gray-100 w-1/3">Tiêu đề:</td>
                      <td className="py-2 px-3">{`Bàn giao ca  ${handover.FromShift?.code} ngày ${format(new Date(handover.FromShift?.date), 'dd/MM/yyyy', { locale: vi })}`}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-3 font-medium bg-gray-100">Ca làm việc:</td>
                      <td className="py-2 px-3">{`${handover.FromShift?.code} - ${format(new Date(handover.FromShift?.date), 'dd/MM/yyyy', { locale: vi })}`}</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-3 font-medium bg-gray-100">Người giao ca:</td>
                      <td className="py-2 px-3">{handover.FromUsers?.map(user => user.fullname || user.fullName).join(', ')}</td>
                    </tr>
                    {handover.attachments && handover.attachments.length > 0 && (
                      <tr className="border-b border-gray-200">
                        <td className="py-2 px-3 font-medium bg-gray-100">File đính kèm:</td>
                        <td className="py-2 px-3">
                          <ul className="list-disc pl-4">
                            {handover.attachments.map(file => (
                              <li key={file.filename}>{file.originalname}</li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Col>
          </Row>

          {/* Email Sending Status */}
          {emailSendingStatus.isSending && (
            <div className="mt-4">
              <Alert
                message={
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <LoadingOutlined className="mr-2" />
                      <span>{emailSendingStatus.step}</span>
                    </div>
                    <span>{emailSendingStatus.progress}%</span>
                  </div>
                }
                type="info"
                showIcon={false}
                className="mb-2"
              />
              <Progress
                percent={emailSendingStatus.progress}
                status={emailSendingStatus.error ? 'exception' : 'active'}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
                size="small"
              />
            </div>
          )}

          {/* Error Message */}
          {emailSendingStatus.error && (
            <Alert
              message={emailSendingStatus.error}
              type="error"
              showIcon
              className="mt-4"
            />
          )}
        </Form>
      </Modal>

      <Modal
        title="Từ chối nhận ca"
        open={rejectModalVisible}
        onOk={handleReject}
        onCancel={() => setRejectModalVisible(false)}
        confirmLoading={loading}
        okButtonProps={{ danger: true }}
        destroyOnHidden
      >
        <Form ref={rejectFormRef} layout="vertical">
          <Form.Item label="Lý do từ chối">
            <TextArea rows={4} value={rejectNote} onChange={(e) => setRejectNote(e.target.value)} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default HandoverDetailPage;
