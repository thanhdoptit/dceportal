import React, { useState } from 'react';
import { Modal, Form, Input, Select, TimePicker, message } from 'antd';
import { backupService } from '../../services/backupService.js';

const { Option } = Select;
const { TextArea } = Input;

const CreateBackupJobModal = ({ visible, onCancel, onCreate }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Xử lý tạo job
  const handleCreate = async () => {
    try {
      const values = await form.validateFields();

      // Format thời gian
      if (values.scheduled_time) {
        values.scheduled_time = values.scheduled_time.format('HH:mm:ss');
      }

      setLoading(true);
      await onCreate(values);

      // Reset form
      form.resetFields();
    } catch (error) {
      if (error.errorFields) {
        message.error('Vui lòng kiểm tra lại thông tin');
      } else {
        message.error('Lỗi khi tạo backup job');
        console.error('Create job error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Xử lý hủy
  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title='Tạo Backup Job Mới'
      open={visible}
      onCancel={handleCancel}
      onOk={handleCreate}
      confirmLoading={loading}
      width={800}
    >
      <Form
        form={form}
        layout='vertical'
        initialValues={{
          job_type: 'EXPORT',
          status: 'PENDING',
        }}
      >
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1 }}>
            <Form.Item
              name='job_name'
              label='Tên Job'
              rules={[
                { required: true, message: 'Vui lòng nhập tên job' },
                { max: 255, message: 'Tên job không được quá 255 ký tự' },
              ]}
            >
              <Input placeholder='Nhập tên backup job' />
            </Form.Item>

            <Form.Item
              name='job_type'
              label='Loại Job'
              rules={[{ required: true, message: 'Vui lòng chọn loại job' }]}
            >
              <Select placeholder='Chọn loại job'>
                <Option value='EXPORT'>Export</Option>
                <Option value='BACKUP_DISK'>Backup DISK</Option>
                <Option value='BACKUP_TAPE'>Backup TAPE</Option>
                <Option value='SYNC'>Sync</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name='client_ip'
              label='Client IP'
              rules={[
                {
                  pattern:
                    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
                  message: 'IP không hợp lệ',
                },
              ]}
            >
              <Input placeholder='192.168.1.1' />
            </Form.Item>

            <Form.Item
              name='client_name'
              label='Tên Client'
              rules={[{ max: 255, message: 'Tên client không được quá 255 ký tự' }]}
            >
              <Input placeholder='Nhập tên client' />
            </Form.Item>

            <Form.Item
              name='export_path'
              label='Đường dẫn Export'
              rules={[{ max: 1000, message: 'Đường dẫn không được quá 1000 ký tự' }]}
            >
              <Input placeholder='D:/backup/export' />
            </Form.Item>

            <Form.Item
              name='local_check_path'
              label='Đường dẫn kiểm tra Local'
              rules={[{ max: 1000, message: 'Đường dẫn không được quá 1000 ký tự' }]}
            >
              <Input placeholder='D:/backup/check' />
            </Form.Item>
          </div>

          <div style={{ flex: 1 }}>
            <Form.Item name='scheduled_time' label='Thời gian lên lịch'>
              <TimePicker format='HH:mm' placeholder='Chọn thời gian' style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name='tape_label'
              label='Tape Label'
              rules={[{ max: 50, message: 'Tape label không được quá 50 ký tự' }]}
            >
              <Input placeholder='5H0002L8' />
            </Form.Item>

            <Form.Item
              name='commvault_job_id'
              label='CommVault Job ID'
              rules={[{ max: 50, message: 'Job ID không được quá 50 ký tự' }]}
            >
              <Input placeholder='CommVault job ID' />
            </Form.Item>

            <Form.Item
              name='backup_disk_path'
              label='Đường dẫn Backup DISK'
              rules={[{ max: 1000, message: 'Đường dẫn không được quá 1000 ký tự' }]}
            >
              <Input placeholder='D:/backup/disk' />
            </Form.Item>

            <Form.Item
              name='backup_tape_path'
              label='Đường dẫn Backup TAPE'
              rules={[{ max: 1000, message: 'Đường dẫn không được quá 1000 ký tự' }]}
            >
              <Input placeholder='D:/backup/tape' />
            </Form.Item>

            <Form.Item
              name='export_files'
              label='Số lượng file Export'
              rules={[{ max: 255, message: 'Thông tin file không được quá 255 ký tự' }]}
            >
              <Input placeholder='25 files' />
            </Form.Item>
          </div>
        </div>

        <Form.Item
          name='schedule_info'
          label='Thông tin lịch chạy'
          rules={[{ max: 1000, message: 'Thông tin lịch chạy không được quá 1000 ký tự' }]}
        >
          <TextArea
            rows={3}
            placeholder='Mô tả lịch chạy job (ví dụ: Daily 20h00, Weekly Sunday 02h00)'
          />
        </Form.Item>

        <Form.Item
          name='description'
          label='Mô tả'
          rules={[{ max: 1000, message: 'Mô tả không được quá 1000 ký tự' }]}
        >
          <TextArea rows={3} placeholder='Mô tả chi tiết về backup job' />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateBackupJobModal;
