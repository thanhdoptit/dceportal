import { Modal, Form, Input, DatePicker } from 'antd';

const { TextArea } = Input;

export default function TaskReasonModal({
  pendingAction,
  reasonModalVisible,
  setReasonModalVisible,
  handleReasonSubmit,
  reopenModalVisible,
  setReopenModalVisible,
  handleReopen,
  reasonForm,
  reopenForm
}) {
  return (
    <>
      {/* Modal nhập lý do */}
      <Modal
        title={pendingAction === 'pause' ? 'Lý do tạm dừng' : 'Lý do tiếp tục'}
        open={reasonModalVisible}
        onOk={handleReasonSubmit}
        onCancel={() => {
          setReasonModalVisible(false);
          reasonForm.resetFields();
        }}
        okText="Xác nhận"
        okButtonProps={{
          style: {
            backgroundColor: '#003c71',
            borderColor: '#003c71',
            color: 'white'
          }
        }}
        cancelText="Hủy"
        zIndex={1001}
      >
        <Form form={reasonForm} layout="vertical">
          <Form.Item
            name="reason"
            label="Lý do"
            rules={[
              { required: true, message: 'Vui lòng nhập lý do' },
              { max: 500, message: 'Lý do không được vượt quá 500 ký tự' }
            ]}
          >
            <TextArea
              rows={4}
              placeholder={`Nhập lý do ${pendingAction === 'pause' ? 'tạm dừng' : 'tiếp tục'} công việc`}
              showCount
              maxLength={500}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Reopen Modal (gộp chọn thời gian và lý do) */}
      <Modal
        title="Mở lại công việc"
        open={reopenModalVisible}
        onOk={handleReopen}
        onCancel={() => {
          setReopenModalVisible(false);
          reopenForm.resetFields();
        }}
        okText="Xác nhận"
        zIndex={1003}
        cancelText="Hủy"
        okButtonProps={{
          style: {
            backgroundColor: '#003c71',
            borderColor: '#003c71',
            color: 'white'
          }
        }}
      >
        <Form form={reopenForm} layout="vertical">
          <Form.Item
            name="reopenTime"
            label="Thời gian kết thúc mới"
            required
            rules={[{ required: true, message: 'Vui lòng chọn thời gian kết thúc mới' }]}
          >
            <DatePicker
              showTime={{ format: 'HH:mm' }}
              format="DD/MM/YYYY HH:mm"
              style={{ width: '100%' }}
              placeholder="Chọn thời gian kết thúc mới"
            />
          </Form.Item>
          <Form.Item
            name="reason"
            label="Lý do mở lại công việc"
            rules={[
              { required: true, message: 'Vui lòng nhập lý do mở lại công việc' },
              { max: 500, message: 'Lý do không được vượt quá 500 ký tự' }
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Nhập lý do mở lại công việc"
              showCount
              maxLength={500}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
