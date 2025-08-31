import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Radio, 
  Select, 
  Switch, 
  Steps, 
  Card, 
  Button, 
  Space,
  Typography,
  Divider,
  Row,
  Col,
  Tag,
  List,
  Avatar,
  message
} from 'antd';
import { 
  ToolOutlined,
  EnvironmentOutlined,
  BuildOutlined,
  TaskOutlined,
  EyeOutlined,
  CheckOutlined
} from '@ant-design/icons';
import { handoverFormSchema } from '../schemas/handoverFormSchema';

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Step } = Steps;

const HandoverForm = ({ form, onSubmit, loading }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [previewVisible, setPreviewVisible] = useState(false);

  const renderFormField = (field, section) => {
    const hasOngoingTasks = form.getFieldValue(['handoverForm', section.key, 'hasOngoingTasks']);
    
    switch (field.type) {
      case 'input':
        return <Input placeholder={field.placeholder} />;
      
      case 'textarea':
        return (
          <TextArea 
            rows={field.rows || 2} 
            placeholder={field.placeholder}
          />
        );
      
      case 'select':
        return (
          <Select
            mode={field.mode}
            placeholder={field.placeholder}
            style={{ width: '100%' }}
            options={field.options}
          />
        );
      
      default:
        return <Input placeholder={field.placeholder} />;
    }
  };

  const renderFormSection = (section) => {
    switch (section.type) {
      case 'tools':
        return (
          <>
            <Form.Item 
              name={['handoverForm', section.key, 'status']} 
              label={section.label}
              required={section.required}
            >
              <Radio.Group>
                {section.options.map(option => (
                  <Radio key={option.value} value={option.value}>
                    {option.label}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>

            <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => 
              prevValues?.handoverForm?.[section.key]?.status !== currentValues?.handoverForm?.[section.key]?.status
            }>
              {({ getFieldValue }) => {
                const status = getFieldValue(['handoverForm', section.key, 'status']);
                const conditionalFields = section.conditionalFields?.[status];
                return conditionalFields?.map((field) => (
                  <Form.Item
                    key={field.key}
                    name={['handoverForm', section.key, ...field.key.split('.')]}
                    label={field.label}
                    required={field.required}
                  >
                    {renderFormField(field, section)}
                  </Form.Item>
                ));
              }}
            </Form.Item>
          </>
        );

      case 'environment':
      case 'ongoingTasks':
        return (
          <>
            <Form.Item 
              name={['handoverForm', section.key, 'hasOngoingTasks']} 
              label={section.label}
              required={section.required}
            >
              <Radio.Group>
                {section.options.map(option => (
                  <Radio key={option.value} value={option.value}>
                    {option.label}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>

            <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => 
              prevValues?.handoverForm?.[section.key]?.hasOngoingTasks !== 
              currentValues?.handoverForm?.[section.key]?.hasOngoingTasks
            }>
              {({ getFieldValue }) => {
                const hasOngoingTasks = getFieldValue(['handoverForm', section.key, 'hasOngoingTasks']);
                return hasOngoingTasks && (
                  <Row gutter={16}>
                    {section.fields?.map((field) => (
                      <Col key={field.key} span={field.span || 24}>
                        <Form.Item
                          name={['handoverForm', section.key, field.key]}
                          label={field.label}
                          rules={getFieldRules(field, hasOngoingTasks)}
                        >
                          {renderFormField(field, section)}
                        </Form.Item>
                      </Col>
                    ))}
                  </Row>
                );
              }}
            </Form.Item>
          </>
        );

      case 'infrastructure':
        return (
          <>
            {section.items?.map((item) => (
              <div key={item.key} style={{ marginBottom: 24 }}>
                <h4>{item.label}</h4>
                <Form.Item
                  name={['handoverForm', section.key, item.key, 'status']}
                  required={item.required}
                >
                  <Radio.Group>
                    {section.options.map(option => (
                      <Radio key={option.value} value={option.value}>
                        {option.label}
                      </Radio>
                    ))}
                  </Radio.Group>
                </Form.Item>

                <Form.Item noStyle shouldUpdate>
                  {({ getFieldValue }) => {
                    const status = getFieldValue(['handoverForm', section.key, item.key, 'status']);
                    const conditionalFields = section.conditionalFields?.[status];
                    return status === 'abnormal' && conditionalFields?.map((field) => (
                      <Form.Item
                        key={field.key}
                        name={['handoverForm', section.key, item.key, ...field.key.split('.')]}
                        label={field.label}
                        required={field.required}
                      >
                        {renderFormField(field, section)}
                      </Form.Item>
                    ));
                  }}
                </Form.Item>
                <Divider />
              </div>
            ))}
          </>
        );

      default:
        return null;
    }
  };

  const renderPreview = () => {
    const values = form.getFieldsValue();
    
    return (
      <div className="preview-content">
        <Title level={4}>Xem trước biên bản bàn giao</Title>
        
        <Card title="Công cụ" className="mb-4">
          <Text strong>Trạng thái: </Text>
          <Tag color={values.handoverForm?.tools?.status === 'complete' ? 'success' : 'error'}>
            {values.handoverForm?.tools?.status === 'complete' ? 'Đầy đủ' : 'Thiếu'}
          </Tag>
          {values.handoverForm?.tools?.status === 'incomplete' && (
            <>
              <div className="mt-2">
                <Text strong>Công cụ thiếu: </Text>
                <Select
                  mode="multiple"
                  value={values.handoverForm?.tools?.missing?.items}
                  disabled
                />
              </div>
              <div className="mt-2">
                <Text strong>Mô tả: </Text>
                <Text>{values.handoverForm?.tools?.missing?.description}</Text>
              </div>
            </>
          )}
        </Card>

        <Card title="Môi trường" className="mb-4">
          <Text strong>Có công việc đang thực hiện: </Text>
          <Tag color={values.handoverForm?.environment?.hasOngoingTasks ? 'orange' : 'green'}>
            {values.handoverForm?.environment?.hasOngoingTasks ? 'Có' : 'Không'}
          </Tag>
          {values.handoverForm?.environment?.hasOngoingTasks && (
            <>
              <div className="mt-2">
                <Text strong>Công việc: </Text>
                <Text>{values.handoverForm?.environment?.ongoingTasks}</Text>
              </div>
              <div className="mt-2">
                <Text strong>Tiến độ: </Text>
                <Text>{values.handoverForm?.environment?.progress}</Text>
              </div>
              <div className="mt-2">
                <Text strong>Thời gian hoàn thành: </Text>
                <Text>{values.handoverForm?.environment?.estimatedCompletion}</Text>
              </div>
            </>
          )}
        </Card>

        <Card title="Cơ sở hạ tầng" className="mb-4">
          {Object.entries(values.handoverForm?.infrastructure || {}).map(([key, value]) => (
            <div key={key} className="mb-4">
              <Text strong>{key}: </Text>
              <Tag color={value.status === 'normal' ? 'success' : 'error'}>
                {value.status === 'normal' ? 'Bình thường' : 'Có lỗi'}
              </Tag>
              {value.status === 'abnormal' && value.issues && (
                <div className="mt-2 ml-4">
                  <div>
                    <Text strong>Tên thiết bị: </Text>
                    <Text>{value.issues.deviceName}</Text>
                  </div>
                  <div>
                    <Text strong>Số serial: </Text>
                    <Text>{value.issues.serialNumber}</Text>
                  </div>
                  <div>
                    <Text strong>Vị trí: </Text>
                    <Text>{value.issues.location}</Text>
                  </div>
                  <div>
                    <Text strong>Vấn đề: </Text>
                    <Text>{value.issues.issue}</Text>
                  </div>
                  {value.issues.ongoingTasks && (
                    <div>
                      <Text strong>Công việc đang thực hiện: </Text>
                      <Text>{value.issues.ongoingTasks}</Text>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </Card>

        <Card title="Công việc đang thực hiện" className="mb-4">
          <Text strong>Có công việc đang thực hiện: </Text>
          <Tag color={values.handoverForm?.ongoingTasks?.hasOngoingTasks ? 'orange' : 'green'}>
            {values.handoverForm?.ongoingTasks?.hasOngoingTasks ? 'Có' : 'Không'}
          </Tag>
          {values.handoverForm?.ongoingTasks?.hasOngoingTasks && (
            <>
              <div className="mt-2">
                <Text strong>Số IM: </Text>
                <Text>{values.handoverForm?.ongoingTasks?.imNumber}</Text>
              </div>
              <div className="mt-2">
                <Text strong>Số CM: </Text>
                <Text>{values.handoverForm?.ongoingTasks?.cmNumber}</Text>
              </div>
              <div className="mt-2">
                <Text strong>Email: </Text>
                <Text>{values.handoverForm?.ongoingTasks?.email}</Text>
              </div>
              <div className="mt-2">
                <Text strong>Thông tin công việc: </Text>
                <Text>{values.handoverForm?.ongoingTasks?.taskInfo}</Text>
              </div>
              {values.handoverForm?.ongoingTasks?.relatedTasks && (
                <div className="mt-2">
                  <Text strong>Công việc liên quan: </Text>
                  <Text>{values.handoverForm?.ongoingTasks?.relatedTasks}</Text>
                </div>
              )}
            </>
          )}
        </Card>

        <Card title="Nội dung bàn giao">
          <Text>{values.content}</Text>
        </Card>
      </div>
    );
  };

  return (
    <div className="handover-form">
      <Steps current={currentStep} className="mb-8">
        <Step title="Công cụ" icon={<ToolOutlined />} />
        <Step title="Môi trường" icon={<EnvironmentOutlined />} />
        <Step title="Cơ sở hạ tầng" icon={<BuildOutlined />} />
        <Step title="Công việc" icon={<TaskOutlined />} />
        <Step title="Xem trước" icon={<EyeOutlined />} />
      </Steps>

      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
      >
        {!previewVisible ? (
          <>
            {currentStep === 0 && (
              <Card title="Công cụ">
                {renderFormSection(handoverFormSchema.sections[0])}
              </Card>
            )}

            {currentStep === 1 && (
              <Card title="Môi trường">
                {renderFormSection(handoverFormSchema.sections[1])}
              </Card>
            )}

            {currentStep === 2 && (
              <Card title="Cơ sở hạ tầng">
                {renderFormSection(handoverFormSchema.sections[2])}
              </Card>
            )}

            {currentStep === 3 && (
              <Card title="Công việc đang thực hiện">
                {renderFormSection(handoverFormSchema.sections[3])}
              </Card>
            )}

            {currentStep === 4 && (
              <Card title="Nội dung bàn giao">
                <Form.Item
                  name="content"
                  label="Nội dung"
                  rules={[{ required: true, message: 'Vui lòng nhập nội dung bàn giao' }]}
                >
                  <TextArea rows={6} />
                </Form.Item>
              </Card>
            )}

            <div className="mt-4 flex justify-between">
              <Space>
                {currentStep > 0 && (
                  <Button onClick={() => setCurrentStep(currentStep - 1)}>
                    Quay lại
                  </Button>
                )}
                {currentStep < 4 && (
                  <Button 
                    type="primary" 
                    onClick={() => setCurrentStep(currentStep + 1)}
                  >
                    Tiếp theo
                  </Button>
                )}
                {currentStep === 4 && (
                  <Button 
                    type="primary" 
                    icon={<EyeOutlined />}
                    onClick={() => setPreviewVisible(true)}
                  >
                    Xem trước
                  </Button>
                )}
              </Space>
              <Space>
                <Button onClick={() => form.resetFields()}>
                  Làm mới
                </Button>
                {currentStep === 4 && (
                  <Button 
                    type="primary" 
                    icon={<CheckOutlined />}
                    onClick={() => form.submit()}
                    loading={loading}
                  >
                    Hoàn thành
                  </Button>
                )}
              </Space>
            </div>
          </>
        ) : (
          <>
            {renderPreview()}
            <div className="mt-4 flex justify-end">
              <Space>
                <Button onClick={() => setPreviewVisible(false)}>
                  Quay lại chỉnh sửa
                </Button>
                <Button 
                  type="primary" 
                  icon={<CheckOutlined />}
                  onClick={() => form.submit()}
                  loading={loading}
                >
                  Hoàn thành
                </Button>
              </Space>
            </div>
          </>
        )}
      </Form>
    </div>
  );
};

export default HandoverForm; 