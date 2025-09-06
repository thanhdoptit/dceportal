import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  DatePicker,
  Descriptions,
  Input,
  message,
  Modal,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import React, { useEffect, useState } from 'react';
import axios from '../../utils/axios';

const { RangePicker } = DatePicker;
const { Text } = Typography;

const HandoverListPage = () => {
  const [loading, setLoading] = useState(false);
  const [handovers, setHandovers] = useState([]);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedHandover, setSelectedHandover] = useState(null);

  useEffect(() => {
    fetchHandovers();
  }, []);

  const fetchHandovers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/shifts/handover/by-status/all');
      setHandovers(response.data);
    } catch (error) {
      console.error('Error fetching handovers:', error);
      message.error('Lỗi khi tải danh sách bàn giao ca');
    } finally {
      setLoading(false);
    }
  };

  const handleView = record => {
    setSelectedHandover(record);
    setViewModalVisible(true);
  };

  const handleDelete = async id => {
    try {
      await axios.delete(`/api/shifts/handover/${id}`);
      message.success('Xóa bản ghi bàn giao ca thành công');
      fetchHandovers();
    } catch (error) {
      console.error('Error deleting handover:', error);
      message.error('Lỗi khi xóa bản ghi bàn giao ca');
    }
  };

  const handleApprove = async id => {
    try {
      await axios.post(`/api/shifts/handover/confirm/${id}`);
      message.success('Phê duyệt bàn giao ca thành công');
      fetchHandovers();
    } catch (error) {
      console.error('Error approving handover:', error);
      message.error('Lỗi khi phê duyệt bàn giao ca');
    }
  };

  const handleReject = async (id, reason) => {
    try {
      await axios.post(`/api/shifts/handover/reject/${id}`, { reason });
      message.success('Từ chối bàn giao ca thành công');
      fetchHandovers();
    } catch (error) {
      console.error('Error rejecting handover:', error);
      message.error('Lỗi khi từ chối bàn giao ca');
    }
  };

  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      render: date => format(new Date(date), 'dd/MM/yyyy', { locale: vi }),
    },
    {
      title: 'Ca giao',
      dataIndex: ['fromShift', 'code'],
      key: 'fromShift',
      render: code => <Tag color='blue'>Ca {code}</Tag>,
    },
    {
      title: 'Ca nhận',
      dataIndex: ['toShift', 'code'],
      key: 'toShift',
      render: code => <Tag color='cyan'>Ca {code}</Tag>,
    },
    {
      title: 'Người giao',
      dataIndex: ['fromUser', 'name'],
      key: 'fromUser',
    },
    {
      title: 'Người nhận',
      dataIndex: ['toUser', 'name'],
      key: 'toUser',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: status => {
        const statusMap = {
          pending: { color: 'warning', text: 'Chờ xác nhận' },
          confirmed: { color: 'success', text: 'Đã xác nhận' },
          rejected: { color: 'error', text: 'Từ chối' },
        };
        return <Tag color={statusMap[status]?.color}>{statusMap[status]?.text}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            type='primary'
            size='small'
            onClick={() => handleView(record)}
          >
            Xem
          </Button>
          {record.status === 'pending' && (
            <>
              <Button
                icon={<CheckCircleOutlined />}
                type='primary'
                size='small'
                onClick={() => handleApprove(record.id)}
              >
                Duyệt
              </Button>
              <Button
                icon={<CloseCircleOutlined />}
                type='primary'
                danger
                size='small'
                onClick={() => {
                  Modal.confirm({
                    title: 'Từ chối bàn giao ca',
                    content: (
                      <Input.TextArea
                        placeholder='Nhập lý do từ chối'
                        onChange={e => {
                          Modal.confirm.rejectReason = e.target.value;
                        }}
                      />
                    ),
                    onOk: () => handleReject(record.id, Modal.confirm.rejectReason),
                    okText: 'Từ chối',
                    cancelText: 'Hủy',
                  });
                }}
              >
                Từ chối
              </Button>
            </>
          )}
          <Button
            icon={<DeleteOutlined />}
            type='primary'
            danger
            size='small'
            onClick={() => handleDelete(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className='space-y-4'>
      <Card
        title='Danh sách bàn giao ca'
        extra={
          <Space>
            <RangePicker
              placeholder={['Từ ngày', 'Đến ngày']}
              onChange={dates => {
                // Handle date filter
              }}
            />
            <Input
              placeholder='Tìm kiếm...'
              prefix={<SearchOutlined />}
              onChange={e => {
                // Handle search
              }}
            />
          </Space>
        }
      >
        <Table columns={columns} dataSource={handovers} rowKey='id' loading={loading} />
      </Card>

      <Modal
        title='Chi tiết bàn giao ca'
        open={viewModalVisible}
        onCancel={() => {
          setViewModalVisible(false);
          setSelectedHandover(null);
        }}
        footer={[
          <Button
            key='close'
            onClick={() => {
              setViewModalVisible(false);
              setSelectedHandover(null);
            }}
          >
            Đóng
          </Button>,
        ]}
        width={800}
      >
        {selectedHandover && (
          <div className='space-y-6'>
            <Descriptions title='Thông tin cơ bản' bordered column={2}>
              <Descriptions.Item label='Ngày'>
                {format(new Date(selectedHandover.date), 'dd/MM/yyyy', { locale: vi })}
              </Descriptions.Item>
              <Descriptions.Item label='Trạng thái'>
                <Tag
                  color={
                    selectedHandover.status === 'confirmed'
                      ? 'success'
                      : selectedHandover.status === 'rejected'
                        ? 'error'
                        : 'warning'
                  }
                >
                  {selectedHandover.status === 'confirmed'
                    ? 'Đã xác nhận'
                    : selectedHandover.status === 'rejected'
                      ? 'Từ chối'
                      : 'Chờ xác nhận'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label='Ca giao'>
                Ca {selectedHandover.fromShift?.code}
              </Descriptions.Item>
              <Descriptions.Item label='Ca nhận'>
                Ca {selectedHandover.toShift?.code}
              </Descriptions.Item>
              <Descriptions.Item label='Người giao'>
                {selectedHandover.fromUser?.name}
              </Descriptions.Item>
              <Descriptions.Item label='Người nhận'>
                {selectedHandover.toUser?.name}
              </Descriptions.Item>
            </Descriptions>

            <div>
              <Text strong>Nội dung bàn giao:</Text>
              <div className='mt-2 p-4 bg-gray-50 rounded'>
                <pre className='whitespace-pre-wrap'>{selectedHandover.content}</pre>
              </div>
            </div>

            {selectedHandover.note && (
              <div>
                <Text strong>Ghi chú:</Text>
                <div className='mt-2 p-4 bg-gray-50 rounded'>
                  <pre className='whitespace-pre-wrap'>{selectedHandover.note}</pre>
                </div>
              </div>
            )}

            {selectedHandover.status === 'rejected' && selectedHandover.rejectReason && (
              <div>
                <Text strong type='danger'>
                  Lý do từ chối:
                </Text>
                <div className='mt-2 p-4 bg-red-50 rounded'>
                  <pre className='whitespace-pre-wrap'>{selectedHandover.rejectReason}</pre>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HandoverListPage;
