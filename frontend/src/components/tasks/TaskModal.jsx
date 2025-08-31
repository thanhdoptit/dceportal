import React, { useState, useCallback } from 'react';
import { Modal, Form, DatePicker, Select, Input, Button, Space, Tag, Upload, Typography, Row, Col, message, Timeline, Popconfirm, Tooltip } from 'antd';
import { FileOutlined, UploadOutlined, DeleteOutlined, DownloadOutlined, UserOutlined, CalendarOutlined, PlayCircleOutlined, InfoCircleOutlined, CheckOutlined, EditOutlined, CloseCircleOutlined, LoadingOutlined, PlusOutlined, CopyFilled } from '@ant-design/icons';
import { format } from 'date-fns';
import { STATUS_COLORS, STATUS_LABELS } from '../../constants/taskStatus';
import * as partnerService from '../../services/partnerService';
import LocationSelect from '../common/LocationSelect';
import CreatePartnerModal from '../partner/CreatePartnerModal';
import debounce from 'lodash/debounce';

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

// Thêm component chọn nhân sự
const PartnerSelect = ({ value = [], onChange }) => {
  const [options, setOptions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [createModal, setCreateModal] = useState(false);

  // Tìm kiếm partner với debounce
  const debouncedSearch = useCallback(
    debounce(async (val) => {
      if (!val || val.trim().length < 2) {
        setOptions([]);
        return;
      }
      setSearching(true);
      try {
        const res = await partnerService.searchPartners(val);
        setOptions(res.map(p => ({
          label: p.fullname + (p.donVi ? ` (${p.donVi})` : ''),
          value: p.id,
          key: p.id,
          partner: p
        })));
      } catch {
        setOptions([]);
      }
      setSearching(false);
    }, 300),
    []
  );

  // Xóa nhân sự khỏi danh sách
  const handleDeselect = (val) => {
    onChange(value.filter(v => v.value !== val.value));
  };

  // Xử lý khi tạo đối tác thành công
  const handleCreateSuccess = (createdPartners) => {
    // Thêm tất cả đối tác đã tạo vào danh sách
    onChange([...value, ...createdPartners]);
    setCreateModal(false);
  };

  // Khi mở modal tạo mới đối tác
  const handleOpenCreateModal = () => {
    setCreateModal(true);
    // Không cần fetch toàn bộ partners nữa vì kiểm tra trùng lặp sẽ được thực hiện trực tiếp với database
  };

  // Chuẩn hóa value cho Select
  const selectValue = value.map(v => ({
    key: v.key ?? v.id,
    value: v.value ?? v.id,
    label: v.label || v.fullName || v.fullname || v.name
  }));

  return (
    <>
      <Select
        mode="multiple"
        showSearch
        labelInValue
        value={selectValue}
        onChange={vals => {
          // Loại bỏ giá trị tạo mới đối tác nếu có
          const filteredVals = vals.filter(val => val.value !== '__create__');
          const newList = filteredVals.map(val => {
            return (
              value.find(v => v.value === val.value) ||
              (options.find(o => o.value === val.value)?.partner
                ? {
                  ...options.find(o => o.value === val.value).partner,
                  type: 'partner',
                  id: options.find(o => o.value === val.value).partner.id,
                  key: options.find(o => o.value === val.value).partner.id,
                  value: options.find(o => o.value === val.value).partner.id,
                  label: options.find(o => o.value === val.value).label
                }
                : { id: val.value, key: val.value, value: val.value, label: val.label, type: 'partner', fullName: val.label })
            );
          });
          onChange(newList);
        }}
        onSearch={debouncedSearch}
        onSelect={(val, option) => {
          if (val.value === '__create__' || val.key === '__create__') {
            handleOpenCreateModal();
            return;
          }
          const partner = option.partner;
          if (!value.find(v => v.id === partner.id)) {
            onChange([
              ...value,
              {
                type: 'partner',
                id: partner.id,
                fullName: partner.fullname,
                donVi: partner.donVi,
                email: partner.email,
                phone: partner.phone,
                cccd: partner.cccd,
                key: partner.id,
                value: partner.id,
                label: partner.fullname + (partner.donVi ? ` (${partner.donVi})` : '')
              }
            ]);
          }
        }}
        onDeselect={handleDeselect}
        options={[
          ...options,
          { label: `+ Thêm mới nhân sự`, value: '__create__', key: '__create__' }
        ]}
        placeholder="Nhập tên nhân sự, tìm kiếm hoặc tạo mới"
        style={{ width: '100%' }}
        loading={searching}
        optionFilterProp="label"
        notFoundContent={
          searching
            ? 'Đang tìm kiếm...'
            : <span style={{ color: 'red' }}>Không tìm thấy đối tác phù hợp</span>
        }
        tagRender={(props) => {
          const { label, closable, onClose } = props;
          const partner = value.find(v => v.value === props.value || v.id === props.value);
          return (
            <Tooltip
              title={
                partner ? (
                  <div>
                    <div><b>Họ tên:</b> {partner.fullName || partner.fullname || partner.label}</div>
                    {partner.donVi && <div><b>Đơn vị:</b> {partner.donVi}</div>}
                    {partner.email && <div><b>Email:</b> {partner.email}</div>}
                    {partner.phone && <div><b>Điện thoại:</b> {partner.phone}</div>}
                    {partner.cccd && <div><b>Số thẻ \ CCCD:</b> {partner.cccd}</div>}
                    {partner.role && <div><b>Vai trò:</b> {partner.role}</div>}
                  </div>
                ) : (
                  <div>Không tìm thấy thông tin</div>
                )
              }
              placement="top"
              mouseEnterDelay={0.3}
            >
              <Tag
                color="blue"
                closable={closable}
                onClose={onClose}
                style={{ cursor: 'pointer', margin: 2 }}
              >
                <UserOutlined style={{ marginRight: 4 }} />
                {label}
              </Tag>
            </Tooltip>
          );
        }}
      />



      <CreatePartnerModal
        visible={createModal}
        onCancel={() => setCreateModal(false)}
        onSuccess={handleCreateSuccess}
        title="Thêm mới nhân sự"
      />
    </>
  );
};

export default function TaskModal({
  modalType,
  modalVisible,
  form,
  selectedTask,
  locations = [],
  locationsLoading = false,
  locationsError = null,
  handleModalSubmit,
  handleAttachmentRemove,
  processFileName,
  downloadFile,
  setModalVisible,
  unlockTask,
  fetchTaskDetail,
  getCurrentUserRole,
  handleStatusChange,
  showReasonModal,
  setReopenModalVisible,
  sortedHistory,
  firstContent,
  renderChangeContent,
  setModalType,
  showModal
}) {
  return (
    <Modal
      title={
        <div className="flex items-center w-full">
          <span>
            {modalType === 'create' ? 'Thêm công việc' :
              modalType === 'edit' ? 'Cập nhật công việc' :
                'Chi tiết công việc'}
          </span>
          {modalType === 'view' && (
            <div >
              <Button
                type="primary"
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a', marginLeft: '10px' }}
                icon={<CopyFilled />}
                onClick={e => {
                  e.stopPropagation();
                  if (selectedTask) {
                    const cloneData = {
                      worker: Array.isArray(selectedTask.staff)
                        ? selectedTask.staff.map(s => ({
                          ...s,
                          key: s.key ?? s.id,
                          value: s.value ?? s.id,
                          label: s.fullName
                            ? (s.donVi ? `${s.fullName} (${s.donVi})` : s.fullName)
                            : (s.label || s.fullname || s.name)
                        }))
                        : [],
                      taskTitle: selectedTask.taskTitle || '',
                      taskDescription: selectedTask.taskDescription || '',
                    };
                    form.setFieldsValue(cloneData);
                    setModalType('create');
                  }
                }}
                title="Tạo mới từ công việc này"
              />
            </div>
          )}
        </div>
      }
      open={modalVisible}
      maskClosable={false}
      keyboard={false}
      centered
      closable={true}
      onOk={modalType !== 'view' ? handleModalSubmit : null}
      onCancel={async () => {
        try {
          if (modalType === 'edit' && selectedTask?.id && selectedTask.isLocked) {
            await unlockTask(selectedTask.id);
          }

          form.resetFields();

          if (modalType === 'edit') {
            setModalType('view');
            if (selectedTask?.id) {
              await fetchTaskDetail(selectedTask.id);
            }
          } else {
            setModalVisible(false);
          }
        } catch { message.error('Có lỗi xảy ra khi hủy thao tác'); }
      }}
      afterClose={() => {
        form.resetFields();
        if (modalType === 'edit' && selectedTask?.id && selectedTask.isLocked) {
          unlockTask(selectedTask.id);
        }
      }}
      footer={null}
      width={1400}
      destroyOnHide={true}
    >
      {/* Nút tạo mới từ công việc này */}
      {/* Đã chuyển lên title, xóa ở đây */}
      {modalType === 'view' ? (
        <>
          <div className="flex gap-4">
            {/* Nội dung Task - bên trái */}
            <div className={modalType === 'create' ? 'w-full' : 'w-2/3 rounded-lg'}>
              <div className="flex-1 p-2 bg-white rounded border border-gray-200 shadow min-h-[400px] max-h-[700px]">
                <Row gutter={[8, 8]}>
                  <Col span={8}>
                    <div className="mb-4 sticky">
                      <div className="text-gray-500 mb-1">Mã CV</div>
                      <Tag color="blue">#{selectedTask?.id}</Tag>
                    </div>
                    <div className="mb-4">
                      <div className="text-gray-500 mb-1">Địa điểm</div>
                      <Tag color="green">{selectedTask?.location}</Tag>
                    </div>
                    <div className="mb-4">
                      <div className="text-gray-500 mb-1">Trạng thái</div>
                      <Tag color={STATUS_COLORS[selectedTask?.status]}>
                        {STATUS_LABELS[selectedTask?.status]}
                      </Tag>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className="mb-4">
                      <div className="text-gray-500 mb-1">Thời gian bắt đầu</div>
                      <div>
                        <CalendarOutlined className="mr-2" />
                        {selectedTask?.checkInTime && format(new Date(selectedTask.checkInTime), 'HH:mm dd/MM/yyyy')}
                      </div>
                      <div className="text-s text-gray-400 mt-1">
                        <UserOutlined className="mr-1" />
                        Người xác nhận: {selectedTask?.creator?.fullname}
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="text-gray-500 mb-1">Thời gian kết thúc</div>
                      <div>
                        {selectedTask?.checkOutTime ? (
                          <>
                            <CalendarOutlined className="mr-2" />
                            {format(new Date(selectedTask.checkOutTime), 'HH:mm dd/MM/yyyy')}
                            {selectedTask?.completer && (
                              <div className="text-s text-gray-400 mt-1">
                                <UserOutlined className="mr-1" />
                                Người xác nhận: {selectedTask.completer.fullname}
                              </div>
                            )}
                          </>
                        ) : (
                          <span className="text-gray-400">Chưa có</span>
                        )}
                      </div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div className="mb-4">
                      <div className="text-gray-500 mb-1">Họ tên nhân sự</div>
                      {selectedTask?.staff && selectedTask.staff.length > 0 ? (
                        <div className="max-h-[300px] overflow-x-auto max-w-full rounded">
                          <div className="flex gap-1 flex-wrap">
                            {selectedTask.staff.map((person, idx) => (
                              <div key={idx} className="flex flex-col min-w-[200px] max-w-[300px] break-words ">
                                <div className="flex items-center mb-1">
                                  <UserOutlined className="mr-2" />
                                  <span>{person.fullName}</span>
                                  {person.donVi && <span className="ml-2 text-gray-400">({person.donVi})</span>}
                                  <Tooltip
                                    title={
                                      <div>
                                        <div><b>Họ tên:</b> {person.fullName}</div>
                                        {person.donVi && <div><b>Đơn vị:</b> {person.donVi}</div>}
                                        {person.email && <div><b>Email:</b> {person.email}</div>}
                                        {person.phone && <div><b>Điện thoại:</b> {person.phone}</div>}
                                        {person.cccd && <div><b>Số thẻ \ CCCD:</b> {person.cccd}</div>}
                                        {person.role && <div><b>Vai trò:</b> {person.role}</div>}
                                      </div>
                                    }
                                    placement="right"
                                  >
                                    <InfoCircleOutlined style={{ color: '#1677ff', marginLeft: 8, cursor: 'pointer' }} />
                                  </Tooltip>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : selectedTask?.fullName ? (
                        <div className="overflow-x-auto max-w-full">
                          <div className="flex gap-1 flex-wrap">
                            {selectedTask.fullName.split(',').map((person, idx) => (
                              <div key={idx} className="flex flex-col min-w-[200px] max-w-[300px] break-words ">
                                <div className="flex items-center mb-1">
                                  <UserOutlined className="mr-2" />
                                  <span>{person.trim()}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">Chưa có nhân sự</span>
                      )}
                    </div>
                  </Col>
                </Row>

                <div className="mb-4">
                  <div className="text-gray-500 mb-1">Công việc thực hiện</div>
                  <div className="bg-gray-50 p-1 rounded whitespace-pre-line break-words">
                    {selectedTask?.taskTitle}
                  </div>
                </div>
                {selectedTask?.attachments?.length > 0 && (
                  <div className="mb-4">
                    <Space className="text-gray-500 mb-2">
                      <span>Phê duyệt</span>
                      <Tooltip
                        title={
                          <>
                            Với các phê duyệt bằng mail thì lưu mail dưới dạng .msg và upload.
                            <br /><br />
                            Với các phê duyệt bằng tin nhắn, chụp màn hình tin nhắn phê duyệt và upload.
                            <br /><br />
                            Hỗ trợ các định dạng: .doc, .docx, .pdf, .xls, .xlsx, .jpg, .jpeg, .png, .msg.
                          </>
                        }
                        placement="right"
                      >
                        <InfoCircleOutlined style={{ color: '#1677ff', cursor: 'pointer' }} />
                      </Tooltip>
                    </Space>

                    <div className="flex flex-wrap gap-2">
                      {selectedTask.attachments.map((file, index) => {
                        const fileName = processFileName(file);
                        return (
                          <Tag
                            key={index}
                            color="blue"
                            style={{ cursor: 'pointer', margin: '4px' }}
                            onClick={() => downloadFile(file)}
                            title={fileName}
                          >
                            <FileOutlined /> {fileName}
                          </Tag>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="">
                  <div className="text-gray-500 mb-1">Nội dung công việc</div>
                  <div className="p-1 whitespace-pre-line break-words">
                    {/* Lịch sử thay đổi nội dung */}
                    <div style={{ maxHeight: '20vh', overflowY: 'auto', background: '#f6f8fa', borderRadius: 8, padding: 8, border: '1px solid #e5e7eb', width: '100%', boxSizing: 'border-box', marginTop: 8 }}>
                      {/* Hiển thị nội dung khởi tạo ban đầu */}
                      {firstContent && selectedTask?.createdBy && (
                        <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 4 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                            <UserOutlined style={{ color: '#1677ff' }} />
                            <span style={{ fontWeight: 500 }}> {selectedTask.creator.fullname}</span>
                            <span style={{ color: '#888', fontSize: 14 }}>
                              {format(new Date(selectedTask.createdAt), 'HH:mm dd/MM/yyyy')}
                            </span>
                            <span style={{ color: '#888', fontSize: 14 }}> :</span>
                          </div>
                          {firstContent || <span style={{ color: '#bbb' }}>Chưa có</span>}
                        </div>
                      )}

                      {/* Hiển thị các lần chỉnh sửa */}
                      {sortedHistory?.map((historyItem, idx) => (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', marginBottom: 4 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                            <UserOutlined style={{ color: '#1677ff' }} />
                            <span style={{ fontWeight: 500 }}>
                              {historyItem.changedBy?.fullname || 'Hệ thống'}
                            </span>
                            <span style={{ color: '#888', fontSize: 12 }}>
                              {format(new Date(historyItem.createdAt), 'HH:mm dd/MM/yyyy')}
                            </span>
                          </div>
                          <div style={{
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            overflowWrap: 'break-word'
                          }}>
                            {historyItem.changes.map((change, cidx) =>
                              (change.type === 'content' && (change.field === 'taskDescription' || !change.field)) ? (
                                <div key={cidx} style={{ paddingBottom: 6 }}>
                                  <span style={{ color: '#888', fontSize: 12 }}>  đã cập nhật :</span> {change.newValue || <span style={{ color: '#bbb' }}>Chưa có</span>}
                                </div>
                              ) : null
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {selectedTask?.cancelReason && (
                  <div className="mb-4">
                    <div className="text-gray-500 mb-1">Lý do hủy</div>
                    <div className="bg-gray-50 p-3 rounded text-red-500">
                      {selectedTask.cancelReason}
                    </div>
                  </div>
                )}
              </div>
              <br />
              <div className="flex justify-between items-centermb-3 border border-gray-200 z-10 p-2 rounded-lg shadow-sm ma">
                <div>
                  {selectedTask?.status === 'waiting' && (
                    <Space>
                      <Popconfirm
                        title="Bắt đầu thực hiện công việc?"
                        description="Bạn có chắc chắn muốn bắt đầu thực hiện công việc này?"
                        onConfirm={() => handleStatusChange(selectedTask.id, 'in_progress', false, 'Bắt đầu thực hiện công việc')}
                        okText="Xác nhận"
                        cancelText="Hủy"
                        okButtonProps={{
                          style: {
                            backgroundColor: '#003c71',
                            borderColor: '#003c71',
                            color: 'white'
                          }
                        }}
                      >
                        <Button
                          type="primary"
                          icon={<PlayCircleOutlined />}
                          style={{ backgroundColor: '#003c71', borderColor: '#003c71', marginRight: 8 }}
                        >
                          Bắt đầu thực hiện
                        </Button>
                      </Popconfirm>
                      <Button
                        type="primary"
                        icon={<InfoCircleOutlined />}
                        onClick={() => showReasonModal('pause')}
                        style={{ backgroundColor: '#722ed1', borderColor: '#722ed1', marginRight: 8 }}
                      >
                        Tạm dừng
                      </Button>
                    </Space>
                  )}
                  {selectedTask?.status === 'in_progress' && (
                    <Space>
                      <Popconfirm
                        title="Kết thúc công việc?"
                        description="Bạn có chắc chắn muốn kết thúc công việc này?"
                        onConfirm={() => handleStatusChange(selectedTask.id, 'completed', false, 'Kết thúc công việc')}
                        okText="Xác nhận"
                        cancelText="Hủy"
                        okButtonProps={{
                          style: {
                            backgroundColor: '#003c71',
                            borderColor: '#003c71',
                            color: 'white'
                          }
                        }}
                      >
                        <Button
                          type="primary"
                          icon={<CheckOutlined />}
                          style={{ backgroundColor: '#003c71', borderColor: '#003c71' }}
                        >
                          Kết thúc công việc
                        </Button>
                      </Popconfirm>
                      <Button
                        type="primary"
                        icon={<InfoCircleOutlined />}
                        onClick={() => showReasonModal('pause')}
                        style={{ backgroundColor: '#722ed1', borderColor: '#722ed1', marginRight: 8 }}
                      >
                        Tạm dừng
                      </Button>
                    </Space>
                  )}
                  {selectedTask?.status === 'pending' && (
                    <Space>
                      <Button
                        type="primary"
                        icon={<PlayCircleOutlined />}
                        onClick={() => showReasonModal('resume')}
                        style={{ backgroundColor: '#003c71', borderColor: '#003c71', marginRight: 8 }}
                      >
                        Tiếp tục
                      </Button>
                    </Space>
                  )}
                </div>
                <div>
                  {['waiting', 'in_progress'].includes(selectedTask?.status) && (
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => showModal('edit', selectedTask)}
                      style={{ backgroundColor: '#003c71', borderColor: '#003c71', marginRight: 8 }}
                    >
                      Cập nhật
                    </Button>
                  )}
                  {selectedTask?.status === 'completed' && getCurrentUserRole() === 'manager' && (
                    <Button
                      type="primary"
                      icon={<PlayCircleOutlined />}
                      onClick={() => setReopenModalVisible(true)}
                      style={{ backgroundColor: '#003c71', borderColor: '#003c71', marginRight: 8 }}
                    >
                      Mở lại
                    </Button>
                  )}
                  <Button
                    onClick={async () => {
                      form.resetFields();
                      setModalVisible(false);
                    }}
                  >
                    Đóng
                  </Button>
                </div>
              </div>
            </div>

            {/* Lịch sử thay đổi - bên phải */}
            {modalType !== 'create' && selectedTask?.history?.length > 0 && (
              <div className="w-1/3 p-2 bg-gray-50 border border-gray-200 max-h-[700px] overflow-y-auto rounded">
                <div className="text-lg font-semibold mb-3 sticky top-0 bg-blue-300 z-10 p-2 border rounded-lg shadow-sm">Lịch sử cập nhật</div>
                <Timeline
                  className="mt-4"
                  items={selectedTask.history.map((group, index) => ({
                    key: index,
                    children: (
                      <div className="p-2 border border-gray-200 rounded-lg mb-3">
                        <div className="flex items-center gap-2">
                          <UserOutlined className="text-blue-500" />
                          <span className="font-medium">{group.changedBy?.fullname}</span>
                          <span className="text-gray-500">•</span>
                          <span className="text-gray-500 text-sm">
                            {format(new Date(group.createdAt), 'HH:mm dd/MM/yyyy')}
                          </span>
                          {group.isAutomatic && (
                            <Tag color="blue" className="ml-2">
                              <InfoCircleOutlined /> Tự động
                            </Tag>
                          )}
                        </div>
                        {group.changeReason && (
                          <div className="text-gray-600 italic mt-2 text-sm">
                            {group.changeReason}
                          </div>
                        )}
                        <div className="bg-gray-50 rounded-lg mt-3">
                          {(group.changes || [])
                            .filter(change => !(change.type === 'content' && (change.field === 'taskDescription' || !change.field)))
                            .map((change, idx) => (
                              <div key={idx} className="mb-3 last:mb-0">
                                {renderChangeContent(change)}
                              </div>
                            ))}
                        </div>
                      </div>
                    )
                  }))}
                />
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex gap-4">
          {/* Form cập nhật Task - bên trái */}
          <div className={modalType === 'create' ? 'w-full' : 'w-2/3 rounded-lg'}>
            <div className="flex-1 p-2 bg-white rounded border border-gray-200 shadow min-h-[400px] max-h-[700px] overflow-auto">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleModalSubmit}
              >
                <Row gutter={4}>
                  <Col span={12}>
                    <Form.Item
                      name="location"
                      label="Địa điểm làm việc"
                      rules={[{ required: true, message: 'Vui lòng chọn địa điểm làm việc' }]}
                      style={{ marginBottom: 6 }}
                    >
                      <LocationSelect
                        placeholder="Chọn địa điểm làm việc"
                        disabled={modalType === 'edit'}
                        activeOnly={true}
                        locations={locations}
                        locationsLoading={locationsLoading}
                        locationsError={locationsError}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Nhân sự"
                      name="worker"
                      rules={modalType === 'create' || modalType === 'edit' ? [
                        { required: true, message: 'Vui lòng chọn ít nhất 1 nhân sự' }
                      ] : []}
                      style={{ marginBottom: 6 }}
                    >
                      <PartnerSelect />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={4}>
                  <Col span={12}>
                    <Form.Item
                      name="checkInTime"
                      label="Thời gian bắt đầu"
                      rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu' }]}
                      style={{ marginBottom: 6 }}
                    >
                      <DatePicker
                        showTime={{ format: 'HH:mm' }}
                        format="DD/MM/YYYY HH:mm"
                        placeholder="Chọn thời gian bắt đầu"
                        style={{ width: '100%' }}
                        disabled={modalType === 'edit'}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="checkOutTime"
                      label="Thời gian kết thúc"
                      dependencies={['checkInTime']}
                      rules={[
                        { required: true, message: 'Vui lòng chọn thời gian kết thúc' },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            const checkIn = getFieldValue('checkInTime');
                            if (!value || !checkIn) return Promise.resolve();
                            if (value.isAfter(checkIn)) return Promise.resolve();
                            return Promise.reject(new Error('Thời gian kết thúc phải lớn hơn thời gian bắt đầu!'));
                          }
                        })
                      ]}
                      style={{ marginBottom: 6 }}
                    >
                      <DatePicker
                        showTime={{ format: 'HH:mm' }}
                        format="DD/MM/YYYY HH:mm"
                        placeholder="Chọn thời gian kết thúc "
                        style={{ width: '100%' }}
                        disabled={modalType === 'edit'}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  name="taskTitle"
                  label="Công việc thực hiện"
                  rules={[{ required: true, message: 'Vui lòng nhập ' }]}
                  style={{ marginBottom: 6 }}
                >
                  <TextArea
                    rows={1}
                    autoSize={{ minRows: 1, maxRows: 5 }}
                    placeholder="Nhập nội dung "
                    readOnly={modalType === 'edit'}
                  />
                </Form.Item>
                <Space className="text-gray-500 mb-2" style={{ marginBottom: 6 }}>
                  <span>Phê duyệt</span>
                  <Tooltip
                    title={
                      <>
                        Với các phê duyệt bằng mail thì lưu mail dưới dạng .msg và upload.
                        <br /><br />
                        Với các phê duyệt bằng tin nhắn, chụp màn hình tin nhắn phê duyệt và upload.
                        <br /><br />
                        Hỗ trợ các định dạng: .doc, .docx, .pdf, .xls, .xlsx, .jpg, .jpeg, .png, .msg.
                      </>
                    }
                    placement="right"
                  >
                    <InfoCircleOutlined style={{ color: '#1677ff', cursor: 'pointer' }} />
                  </Tooltip>
                </Space>
                <Form.Item
                  name="attachments"
                  valuePropName="fileList"
                  rules={[{ required: true, message: 'Vui lòng đính kèm tờ trình' }]}
                  getValueFromEvent={(e) => {
                    if (Array.isArray(e)) {
                      return e;
                    }
                    return e?.fileList;
                  }}
                  style={{ marginBottom: 6 }}
                >
                  <Upload
                    multiple
                    maxCount={10}
                    listType="text"
                    action={false}
                    showUploadList={{
                      showDownloadIcon: false,
                      showRemoveIcon: true,
                      removeIcon: <DeleteOutlined style={{ color: '#ff4d4f' }} />
                    }}
                    beforeUpload={(file) => {
                      // Kiểm tra kích thước file
                      const isLt50M = file.size / 1024 / 1024 < 50;
                      if (!isLt50M) {
                        message.error('File không được vượt quá 50MB!');
                        return false;
                      }

                      // Kiểm tra loại file
                      const allowedTypes = [
                        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
                        'application/pdf',
                        'application/msword',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        'application/vnd.ms-excel',
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        'application/vnd.ms-powerpoint',
                        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                        'text/plain', 'text/csv',
                        'application/zip',
                        'application/x-zip-compressed',
                        'application/vnd.ms-outlook',
                        'application/octet-stream'
                      ];

                      // Debug: Log thông tin file
                      console.log('File upload info:', {
                        name: file.name,
                        type: file.type,
                        size: file.size,
                        allowed: allowedTypes.includes(file.type)
                      });

                      // Cho phép tất cả file có extension .msg (tạm thời để test)
                      if (file.name.toLowerCase().endsWith('.msg')) {
                        console.log('✅ Allowing .msg file:', file.name);
                        return true;
                      }

                      if (!allowedTypes.includes(file.type)) {
                        message.error(`Loại file không được hỗ trợ! (${file.type})`);
                        return false;
                      }

                      // Kiểm tra extension
                      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.csv', '.zip', '.ZIP', '.msg'];
                      const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

                      if (!allowedExtensions.includes(fileExtension)) {
                        message.error('Phần mở rộng file không được hỗ trợ!');
                        return false;
                      }

                      // Kiểm tra tên file an toàn
                      const dangerousChars = /[<>:"/\\|?*]/;
                      if (dangerousChars.test(file.name)) {
                        message.error('Tên file chứa ký tự không hợp lệ!');
                        return false;
                      }

                      return true;
                    }}
                    accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip,.msg"
                    onRemove={handleAttachmentRemove}
                    itemRender={(originNode, file) => {
                      const fileName = processFileName(file);
                      if (file.status === 'uploading') {
                        return (
                          <div className="flex items-center justify-between w-full">
                            <Tag color="processing" className="flex-grow">
                              <LoadingOutlined /> {fileName}
                            </Tag>
                            <Button
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => handleAttachmentRemove(file)}
                            />
                          </div>
                        );
                      }
                      return (
                        <div className="flex items-center justify-between w-full">
                          <Tag color="blue">
                            <FileOutlined /> {fileName}
                          </Tag>
                          <Space>
                            <Button
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => handleAttachmentRemove(file)}
                            />
                          </Space>
                        </div>
                      );
                    }}
                  >
                    <Button
                      icon={<UploadOutlined />}
                      type='primary'
                      size='small'
                      style={{ backgroundColor: '#003c71', borderColor: '#003c71', marginBottom: 6 }}
                    >Chọn file</Button>
                  </Upload>
                </Form.Item>
                <Form.Item
                  name="taskDescription"
                  label="Nội dung công việc"
                  style={{ marginBottom: 6 }}
                >
                  <TextArea
                    rows={1}
                    autoSize={{ minRows: 1, maxRows: 5 }}
                    placeholder="Nhập nội dung công việc cần thực hiện"
                  />
                </Form.Item>
                <Form.Item
                  name="changeReason"
                  label="Căn cứ"
                  rules={[
                    { max: 500, message: 'Lý do thay đổi không được vượt quá 500 ký tự' },
                  ]}
                  hidden={modalType === 'create'}
                  style={{ marginBottom: 6 }}
                >
                  <TextArea
                    rows={1}
                    autoSize={{ minRows: 1, maxRows: 5 }}
                    placeholder="Nhập lý do thay đổi thông tin"
                  />
                </Form.Item>
                {/* Lịch sử nội dung công việc khi edit */}
                {modalType === 'edit' && (
                  <div style={{ maxHeight: '25vh', overflowY: 'auto', background: '#f6f8fa', borderRadius: 8, padding: 8, border: '1px solid #e5e7eb', width: '100%', boxSizing: 'border-box', marginBottom: 8 }}>
                    {/* Hiển thị nội dung khởi tạo ban đầu */}
                    {firstContent && selectedTask?.createdBy && (
                      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                          <UserOutlined style={{ color: '#1677ff' }} />
                          <span style={{ fontWeight: 500 }}> {selectedTask.creator.fullname}</span>
                          <span style={{ color: '#888', fontSize: 12 }}>
                            {format(new Date(selectedTask.createdAt), 'HH:mm dd/MM/yyyy')}
                          </span>
                          <span style={{ color: '#888', fontSize: 12 }}> đã tạo:</span> {firstContent || <span style={{ color: '#bbb' }}>Chưa có</span>}
                        </div>
                      </div>
                    )}
                    {/* Hiển thị các lần chỉnh sửa nếu có */}
                    {sortedHistory?.map((historyItem, idx) => (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', marginBottom: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                          <UserOutlined style={{ color: '#1677ff' }} />
                          <span style={{ fontWeight: 500 }}>
                            {historyItem.changedBy?.fullname || 'Hệ thống'}
                          </span>
                          <span style={{ color: '#888', fontSize: 12 }}>
                            {format(new Date(historyItem.createdAt), 'HH:mm dd/MM/yyyy')}
                          </span>
                        </div>
                        <div style={{
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word'
                        }}>
                          {historyItem.changes.map((change, cidx) =>
                            (change.type === 'content' && (change.field === 'taskDescription' || !change.field)) ? (
                              <div key={cidx} style={{ paddingBottom: 6 }}>
                                <span style={{ color: '#888', fontSize: 12 }}>  đã cập nhật :</span> {change.newValue || <span style={{ color: '#bbb' }}>Chưa có</span>}
                              </div>
                            ) : null
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Form>
            </div>
            <br />
            {/* Action Buttons */}
            <div className="flex justify-between gap-1 items-center mb-3 border border-gray-200 z-10 p-2 rounded-lg shadow-sm">
              <Button
                onClick={async () => {
                  form.resetFields();
                  setModalVisible(false);
                }}
                type="primary"
                style={{ backgroundColor: '#003c71', borderColor: '#143c71' }}
              >
                Huỷ
              </Button>
              <Button
                type="primary"
                onClick={handleModalSubmit}
                style={{ backgroundColor: '#003c71', borderColor: '#003c71' }}
              >
                {modalType === 'create' ? 'Thêm mới' : 'Cập nhật'}
              </Button>
            </div>
          </div>

          {/* Lịch sử thay đổi - bên phải */}
          {modalType !== 'create' && selectedTask?.history?.length > 0 && (
            <div className="w-1/3 p-2 bg-gray-50 border border-gray-200 max-h-[700px] overflow-y-auto rounded">
              <div className="text-lg font-semibold mb-3 sticky top-0 bg-blue-300 z-10 p-2 border rounded-lg shadow-sm">Lịch sử cập nhật</div>
              <Timeline
                className="mt-4"
                items={selectedTask.history.map((group, index) => ({
                  key: index,
                  children: (
                    <div className="p-2 border border-gray-200 rounded-lg mb-3">
                      <div className="flex items-center gap-2">
                        <UserOutlined className="text-blue-500" />
                        <span className="font-medium">{group.changedBy?.fullname}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-500 text-sm">
                          {format(new Date(group.createdAt), 'HH:mm dd/MM/yyyy')}
                        </span>
                        {group.isAutomatic && (
                          <Tag color="blue" className="ml-2">
                            <InfoCircleOutlined /> Tự động
                          </Tag>
                        )}
                      </div>
                      {group.changeReason && (
                        <div className="text-gray-600 italic mt-2 text-sm">
                          {group.changeReason}
                        </div>
                      )}
                      <div className="bg-gray-50 rounded-lg mt-3">
                        {(group.changes || [])
                          .filter(change => !(change.type === 'content' && (change.field === 'taskDescription' || !change.field)))
                          .map((change, idx) => (
                            <div key={idx} className="mb-3 last:mb-0">
                              {renderChangeContent(change)}
                            </div>
                          ))}
                      </div>
                    </div>
                  )
                }))}
              />
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
