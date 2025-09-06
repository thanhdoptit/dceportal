import {
  ArrowLeftOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  DownloadOutlined,
  FileTextOutlined,
  LoadingOutlined,
  PlusOutlined,
  SaveOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Spin,
  Tag,
  Typography,
  Upload,
} from 'antd';
import React, { memo, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { processFileName } from '../utils/VietnameseFile';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// Component tùy chỉnh để hiển thị hình ảnh qua API (tương tự SystemInfoPage)
const ImagePreview = ({ image, systemInfoId, style, onClick }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let url;
    const loadImage = async () => {
      try {
        setLoading(true);
        setError(false);
        const token = localStorage.getItem('token');
        console.log('🔍 ImagePreview - Token:', token ? 'Có token' : 'Không có token');
        console.log('🔍 ImagePreview - Loading image:', image.filename);
        console.log('🔍 ImagePreview - SystemInfoId:', systemInfoId);
        console.log(
          '🔍 ImagePreview - Full URL:',
          `${import.meta.env.VITE_API_URL}/api/system-info/${systemInfoId}/files/${image.filename}`
        );

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/system-info/${systemInfoId}/files/${image.filename}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('🔍 ImagePreview - Response status:', res.status);
        if (!res.ok) {
          console.error('🔍 ImagePreview - Response not ok:', res.status, res.statusText);
          throw new Error('Fetch image failed');
        }
        const blob = await res.blob();
        url = window.URL.createObjectURL(blob);
        setImageUrl(url);
        console.log('🔍 ImagePreview - Image loaded successfully');
      } catch (err) {
        console.error('Error loading image (fetch):', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    if (systemInfoId && image.filename) loadImage();
    return () => {
      if (url) window.URL.revokeObjectURL(url);
    };
  }, [systemInfoId, image.filename]);

  if (loading) return <Spin />;
  if (error) return <div>Lỗi tải ảnh</div>;
  return <img src={imageUrl} alt={image.originalName} style={style} onClick={onClick} />;
};

// Component helper để hiển thị ảnh trong các mục con
const SubItemImagePreview = ({ images, systemInfoId, title, onPreview }) => {
  if (!images || images.length === 0) return null;

  return (
    <div style={{ marginTop: '16px' }}>
      <Text strong>Hình ảnh:</Text>
      <Row gutter={[8, 8]} style={{ marginTop: '8px' }}>
        {images.map((image, imgIndex) => (
          <Col span={8} key={imgIndex}>
            <div style={{ position: 'relative' }}>
              <ImagePreview
                image={image}
                systemInfoId={systemInfoId}
                style={{
                  width: '100%',
                  height: '80px',
                  objectFit: 'cover',
                  cursor: 'pointer',
                  borderRadius: '4px',
                }}
                onClick={() => onPreview && onPreview(images, title, imgIndex)}
              />
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

// Tách component cho Purpose Items
const PurposeItems = memo(() => (
  <Form.List name={['purpose', 'items']}>
    {(fields, { add, remove }) => (
      <>
        {fields.map(({ key, name, ...restField }) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <Form.Item {...restField} name={[name]} style={{ flex: 1, marginBottom: 0 }}>
              <Input placeholder={`Điểm ${name + 1}`} />
            </Form.Item>
            <Button
              type='text'
              danger
              icon={<DeleteOutlined />}
              onClick={() => remove(name)}
              style={{ marginLeft: 8 }}
            />
          </div>
        ))}
        <Form.Item>
          <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
            Thêm điểm
          </Button>
        </Form.Item>
      </>
    )}
  </Form.List>
));

// Tách component cho Components Items
const ComponentsItems = memo(({ systemInfoId, onPreview, form, onUpload }) => (
  <Form.List name={['components', 'items']}>
    {(fields, { add, remove }) => (
      <>
        {fields.map(({ key, name, ...restField }) => {
          const currentImages = form.getFieldValue(['components', 'items', name, 'images']) || [];
          const currentTitle =
            form.getFieldValue(['components', 'items', name, 'name']) || `Thành phần ${name + 1}`;

          return (
            <Card size='small' key={key} style={{ marginBottom: 16 }}>
              <Row gutter={16}>
                <Col span={6}>
                  <Form.Item {...restField} name={[name, 'name']} label='Tên thành phần'>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item {...restField} name={[name, 'description']} label='Mô tả'>
                    <TextArea rows={2} />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item {...restField} name={[name, 'tag']} label='Tag'>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={2}>
                  <Button
                    type='text'
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => remove(name)}
                  />
                </Col>
              </Row>

              {/* Hiển thị ảnh đã upload */}
              <SubItemImagePreview
                images={currentImages.filter(img => img.filename)}
                systemInfoId={systemInfoId}
                title={currentTitle}
                onPreview={onPreview}
              />

              {/* Upload ảnh cho thành phần */}
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name={[name, 'images']}
                    label='Ảnh minh họa'
                    valuePropName='fileList'
                    getValueFromEvent={e => (Array.isArray(e) ? e : e && e.fileList)}
                  >
                    <Upload
                      multiple
                      accept='image/*'
                      beforeUpload={file => validateSystemInfoFile(file, 'image')}
                      listType='picture-card'
                      onChange={info => {
                        const newFiles = info.fileList.filter(
                          file => file.originFileObj && !file.filename
                        );
                        newFiles.forEach(file => {
                          onUpload(file.originFileObj, 'components', name, 'image');
                        });
                      }}
                    >
                      <div>Upload ảnh</div>
                    </Upload>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name={[name, 'documents']}
                    label='Tài liệu đính kèm'
                    valuePropName='fileList'
                    getValueFromEvent={e => (Array.isArray(e) ? e : e && e.fileList)}
                  >
                    <Upload
                      multiple
                      accept='.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.rar,.7z'
                      beforeUpload={file => validateSystemInfoFile(file, 'document')}
                      onChange={info => {
                        const newFiles = info.fileList.filter(
                          file => file.originFileObj && !file.filename
                        );
                        newFiles.forEach(file => {
                          onUpload(file.originFileObj, 'components', name, 'document');
                        });
                      }}
                    >
                      <Button icon={<UploadOutlined />}>Upload tài liệu</Button>
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          );
        })}
        <Form.Item>
          <Button
            type='dashed'
            onClick={() => add({ name: '', description: '', tag: '', images: [], documents: [] })}
            block
            icon={<PlusOutlined />}
          >
            Thêm thành phần
          </Button>
        </Form.Item>
      </>
    )}
  </Form.List>
));

// Tách component cho Operation Steps
const OperationSteps = memo(({ operationType, onUpload }) => (
  <>
    <Form.List name={['operation', operationType, 'steps']}>
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <Form.Item {...restField} name={[name]} key={key} style={{ marginBottom: 8 }}>
              <Input placeholder={`Bước ${name + 1}`} />
            </Form.Item>
          ))}
          {fields.length > 0 && (
            <Form.Item>
              <Button type='text' danger onClick={() => remove(fields.length - 1)}>
                Xóa bước cuối
              </Button>
            </Form.Item>
          )}
          <Form.Item>
            <Button type='dashed' onClick={() => add()} block icon={<PlusOutlined />}>
              Thêm bước
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>

    {/* Upload ảnh cho operation */}
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          name={['operation', operationType, 'images']}
          label='Ảnh minh họa'
          valuePropName='fileList'
          getValueFromEvent={e => (Array.isArray(e) ? e : e && e.fileList)}
        >
          <Upload
            multiple
            accept='image/*'
            beforeUpload={file => validateSystemInfoFile(file, 'image')}
            listType='picture-card'
            onChange={info => {
              const newFiles = info.fileList.filter(file => file.originFileObj && !file.filename);
              newFiles.forEach(file => {
                onUpload(file.originFileObj, 'operation', operationType, 'image');
              });
            }}
          >
            <div>Upload ảnh</div>
          </Upload>
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          name={['operation', operationType, 'documents']}
          label='Tài liệu đính kèm'
          valuePropName='fileList'
          getValueFromEvent={e => (Array.isArray(e) ? e : e && e.fileList)}
        >
          <Upload
            multiple
            accept='.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.rar,.7z'
            beforeUpload={file => validateSystemInfoFile(file, 'document')}
            onChange={info => {
              const newFiles = info.fileList.filter(file => file.originFileObj && !file.filename);
              newFiles.forEach(file => {
                onUpload(file.originFileObj, 'operation', operationType, 'document');
              });
            }}
          >
            <Button icon={<UploadOutlined />}>Upload tài liệu</Button>
          </Upload>
        </Form.Item>
      </Col>
    </Row>
  </>
));

// Tách component cho Procedures Items
const ProceduresItems = memo(({ onUpload }) => (
  <Form.List name={['procedures', 'items']}>
    {(fields, { add, remove }) => (
      <>
        {fields.map(({ key, name, ...restField }) => (
          <Card size='small' key={key} style={{ marginBottom: 16 }}>
            <Form.Item {...restField} name={[name, 'title']} label='Tiêu đề quy trình'>
              <Input />
            </Form.Item>
            <Form.Item {...restField} name={[name, 'items']} label='Các bước thực hiện'>
              <Form.List name={[name, 'items']}>
                {(subFields, { add: addSub, remove: removeSub }) => (
                  <>
                    {subFields.map(({ key: subKey, name: subName, ...subRestField }) => (
                      <div
                        key={subKey}
                        style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}
                      >
                        <Form.Item
                          {...subRestField}
                          name={[subName]}
                          style={{ flex: 1, marginBottom: 0 }}
                        >
                          <Input placeholder={`Bước ${subName + 1}`} />
                        </Form.Item>
                        <Button
                          type='text'
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => removeSub(subName)}
                          style={{ marginLeft: 8 }}
                        />
                      </div>
                    ))}
                    <Form.Item>
                      <Button type='dashed' onClick={() => addSub()} block icon={<PlusOutlined />}>
                        Thêm bước
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Form.Item>

            {/* Upload ảnh cho quy trình */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name={[name, 'images']}
                  label='Ảnh minh họa'
                  valuePropName='fileList'
                  getValueFromEvent={e => (Array.isArray(e) ? e : e && e.fileList)}
                >
                  <Upload
                    multiple
                    accept='image/*'
                    beforeUpload={file => validateSystemInfoFile(file, 'image')}
                    listType='picture-card'
                    onChange={info => {
                      const newFiles = info.fileList.filter(
                        file => file.originFileObj && !file.filename
                      );
                      newFiles.forEach(file => {
                        onUpload(file.originFileObj, 'procedures', name, 'image');
                      });
                    }}
                  >
                    <div>Upload ảnh</div>
                  </Upload>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={[name, 'documents']}
                  label='Tài liệu đính kèm'
                  valuePropName='fileList'
                  getValueFromEvent={e => (Array.isArray(e) ? e : e && e.fileList)}
                >
                  <Upload
                    multiple
                    accept='.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.rar,.7z'
                    beforeUpload={file => validateSystemInfoFile(file, 'document')}
                    onChange={info => {
                      const newFiles = info.fileList.filter(
                        file => file.originFileObj && !file.filename
                      );
                      newFiles.forEach(file => {
                        onUpload(file.originFileObj, 'procedures', name, 'document');
                      });
                    }}
                  >
                    <Button icon={<UploadOutlined />}>Upload tài liệu</Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>

            <Button type='text' danger icon={<DeleteOutlined />} onClick={() => remove(name)}>
              Xóa quy trình
            </Button>
          </Card>
        ))}
        <Form.Item>
          <Button
            type='dashed'
            onClick={() => add({ title: '', items: [], images: [], documents: [] })}
            block
            icon={<PlusOutlined />}
          >
            Thêm quy trình
          </Button>
        </Form.Item>
      </>
    )}
  </Form.List>
));

// Tách component cho Issues Items
const IssuesItems = memo(({ onUpload }) => (
  <Form.List name={['issues', 'items']}>
    {(fields, { add, remove }) => (
      <>
        {fields.map(({ key, name, ...restField }) => (
          <Card size='small' key={key} style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item {...restField} name={[name, 'problem']} label='Tiêu đề sự cố'>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item {...restField} name={[name, 'cause']} label='Nguyên nhân'>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item {...restField} name={[name, 'solution']} label='Cách xử lý'>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name={[name, 'images']}
                  label='Ảnh minh họa'
                  valuePropName='fileList'
                  getValueFromEvent={e => (Array.isArray(e) ? e : e && e.fileList)}
                >
                  <Upload
                    multiple
                    accept='image/*'
                    beforeUpload={file => validateSystemInfoFile(file, 'image')}
                    listType='picture-card'
                    onChange={info => {
                      const newFiles = info.fileList.filter(
                        file => file.originFileObj && !file.filename
                      );
                      newFiles.forEach(file => {
                        onUpload(file.originFileObj, 'issues', name, 'image');
                      });
                    }}
                  >
                    <div>Upload ảnh</div>
                  </Upload>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={[name, 'documents']}
                  label='Tài liệu đính kèm'
                  valuePropName='fileList'
                  getValueFromEvent={e => (Array.isArray(e) ? e : e && e.fileList)}
                >
                  <Upload
                    multiple
                    accept='.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.rar,.7z'
                    beforeUpload={file => validateSystemInfoFile(file, 'document')}
                    onChange={info => {
                      const newFiles = info.fileList.filter(
                        file => file.originFileObj && !file.filename
                      );
                      newFiles.forEach(file => {
                        onUpload(file.originFileObj, 'issues', name, 'document');
                      });
                    }}
                  >
                    <Button icon={<UploadOutlined />}>Upload tài liệu</Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
            <Button type='text' danger icon={<DeleteOutlined />} onClick={() => remove(name)}>
              Xóa sự cố
            </Button>
          </Card>
        ))}
        <Form.Item>
          <Button
            type='dashed'
            onClick={() => add({ problem: '', cause: '', solution: '', images: [], documents: [] })}
            block
            icon={<PlusOutlined />}
          >
            Thêm sự cố
          </Button>
        </Form.Item>
      </>
    )}
  </Form.List>
));

// Thêm hàm kiểm tra loại file hợp lệ cho system info
const validateSystemInfoFile = (file, type = 'image') => {
  if (type === 'image') {
    if (!file.type.startsWith('image/')) {
      message.error('Chỉ được upload file ảnh!');
      return Upload.LIST_IGNORE;
    }
    if (file.size / 1024 / 1024 > 100) {
      message.error('File phải nhỏ hơn 100MB!');
      return Upload.LIST_IGNORE;
    }
    return false;
  }
  // Tài liệu
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
  ];
  if (!allowedTypes.includes(file.type)) {
    message.error('Loại file không được hỗ trợ!');
    return Upload.LIST_IGNORE;
  }
  if (file.size / 1024 / 1024 > 100) {
    message.error('File phải nhỏ hơn 100MB!');
    return Upload.LIST_IGNORE;
  }
  return false;
};

const SystemInfoEditPage = memo(() => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [systemData, setSystemData] = useState(null);
  const [removedImages, setRemovedImages] = useState([]);
  const [removedDocuments, setRemovedDocuments] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  // Xác định role prefix
  const getRolePrefix = useCallback(() => {
    console.log('Current user:', currentUser);
    if (!currentUser) return '/dc'; // Fallback nếu chưa load user
    if (currentUser.role?.toLowerCase() === 'manager') return '/manager';
    if (currentUser.role?.toLowerCase() === 'be') return '/be';
    return '/dc';
  }, [currentUser]);

  // Hàm upload file cho mục con
  const uploadSubItemFile = useCallback(
    async (file, fieldName, itemIndex, fileType) => {
      try {
        console.log(`🔄 Uploading ${fileType} for ${fieldName}[${itemIndex}]:`, file.name);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('fieldName', fieldName);
        formData.append('itemIndex', itemIndex);
        formData.append('fileType', fileType);

        const response = await api.post(`/api/system-info/${id}/upload-sub-item`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.success) {
          const uploadedFile = response.data.data;
          console.log(`✅ Uploaded ${fileType} successfully:`, uploadedFile);

          // Cập nhật metadata file thực tế vào form
          const currentFieldValue =
            form.getFieldValue([
              fieldName,
              'items',
              itemIndex,
              fileType === 'image' ? 'images' : 'documents',
            ]) || [];
          const updatedFieldValue = currentFieldValue.map(f => {
            // Nếu là file tạm thời (có originFileObj), thay thế bằng metadata thực tế
            if (f.originFileObj && f.uid === file.uid) {
              return uploadedFile;
            }
            return f;
          });

          form.setFieldValue(
            [fieldName, 'items', itemIndex, fileType === 'image' ? 'images' : 'documents'],
            updatedFieldValue
          );

          message.success(`Upload ${fileType === 'image' ? 'ảnh' : 'tài liệu'} thành công!`);
          return uploadedFile;
        } else {
          throw new Error(response.data.message || 'Upload failed');
        }
      } catch (error) {
        console.error(`❌ Error uploading ${fileType}:`, error);
        message.error(`Lỗi upload ${fileType === 'image' ? 'ảnh' : 'tài liệu'}!`);
        throw error;
      }
    },
    [form, id]
  );

  // Hàm xử lý upload file cho mục con
  const handleSubItemUpload = useCallback(
    async (file, fieldName, itemIndex, fileType) => {
      try {
        await uploadSubItemFile(file, fieldName, itemIndex, fileType);
      } catch {
        // Xóa file khỏi form nếu upload thất bại
        const currentFieldValue =
          form.getFieldValue([
            fieldName,
            'items',
            itemIndex,
            fileType === 'image' ? 'images' : 'documents',
          ]) || [];
        const updatedFieldValue = currentFieldValue.filter(f => f.uid !== file.uid);
        form.setFieldValue(
          [fieldName, 'items', itemIndex, fileType === 'image' ? 'images' : 'documents'],
          updatedFieldValue
        );
      }
    },
    [uploadSubItemFile, form]
  );

  // Load dữ liệu hệ thống
  useEffect(() => {
    console.log('SystemInfoEditPage useEffect - id:', id, 'currentUser:', currentUser);
    if (id) {
      loadSystemData();
    }
  }, [id, currentUser]);

  const loadSystemData = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Loading system data for ID:', id);
      const response = await api.get(`/api/system-info/${id}`);
      console.log('API response:', response.data);
      if (response.data.success) {
        const data = response.data.data;
        setSystemData(data);

        // Parse content JSON
        let content = {};
        if (data.content) {
          try {
            content = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
          } catch {
            content = {};
          }
        }

        // Fallback an toàn cho các trường items/steps về mảng rỗng nếu không phải array
        if (content.purpose && !Array.isArray(content.purpose.items)) content.purpose.items = [];
        if (content.components && !Array.isArray(content.components.items))
          content.components.items = [];
        if (content.operation) {
          if (content.operation.normal && !Array.isArray(content.operation.normal.steps))
            content.operation.normal.steps = [];
          if (content.operation.backup && !Array.isArray(content.operation.backup.steps))
            content.operation.backup.steps = [];
        }
        if (content.procedures && !Array.isArray(content.procedures.items))
          content.procedures.items = [];
        if (content.troubleshooting && !Array.isArray(content.troubleshooting.items))
          content.troubleshooting.items = [];

        // Set form values - ưu tiên content JSON, fallback về các trường riêng lẻ
        const formValues = {
          systemType: data.systemType,
          title: data.title,
          subtitle: data.subtitle,
          isActive: data.isActive,
          purpose: content.purpose || {
            title: 'Mục đích',
            description: data.purpose || '',
            items: [],
            files: [],
          },
          components: content.components || {
            title: 'Thành phần chính',
            description: data.components || '',
            items: [],
            files: [],
          },
          operation: content.operation || {
            title: 'Nguyên lý hoạt động',
            description: data.operation || '',
            items: [],
          },
          procedures: content.procedures || {
            title: 'Quy trình vận hành',
            description: data.procedures || '',
            items: [],
            files: [],
          },
          issues: content.troubleshooting || {
            title: 'Sự cố thường gặp',
            description: data.troubleshooting || '',
            items: [],
            files: [],
          },
        };

        // Tách files từ content để hiển thị trong form upload
        // Chỉ lấy files từ section 'general' cho tài liệu chung
        const generalFiles = [];
        if (content.general?.files && Array.isArray(content.general.files)) {
          content.general.files.forEach(file => {
            // Xử lý cấu trúc đặc biệt của section general
            const processedFile = {
              ...file,
              uid: file.uid || file.filename || `file-${Date.now()}-${Math.random()}`,
              name: file.name || file.originalName, // Ưu tiên name từ file gốc
              status: 'done',
            };

            // Nếu có response object, sử dụng nó làm metadata
            if (file.response) {
              processedFile.response = file.response;
              // Đảm bảo có mimetype từ response
              if (file.response.mimetype) {
                processedFile.mimetype = file.response.mimetype;
              }
            } else {
              // Nếu không có response, sử dụng file trực tiếp
              processedFile.response = file;
            }

            generalFiles.push(processedFile);
          });
        }

        // Tách images và documents từ tài liệu chung
        const images = generalFiles.filter(
          file => file.mimetype && file.mimetype.startsWith('image/')
        );
        const documents = generalFiles.filter(
          file => !file.mimetype || !file.mimetype.startsWith('image/')
        );

        formValues.images = images;
        formValues.documents = documents;

        console.log('Setting form values:', formValues);
        console.log('Images loaded:', images.length);
        console.log('Documents loaded:', documents.length);
        form.setFieldsValue(formValues);
      }
    } catch (error) {
      message.error('Lỗi tải dữ liệu hệ thống');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id, form]);

  // Xử lý xóa file ảnh
  const handleImageRemove = useCallback(
    file => {
      console.log('🗑️ Removing image:', file);

      // Xử lý filename cho section general
      const filename = file.filename || file.response?.filename;

      // Nếu file đã upload thành công (có response hoặc filename), thêm vào removedImages
      if (file.url || file.response || filename) {
        const fileToRemove = file.response || file;
        if (fileToRemove && (fileToRemove.filename || filename)) {
          setRemovedImages(prev => {
            const exists = prev.some(
              f => f && (f.filename === fileToRemove.filename || f.filename === filename)
            );
            if (!exists) {
              console.log('Added to removedImages:', fileToRemove);
              return [...prev, fileToRemove];
            }
            return prev;
          });
        }
      }

      // Cập nhật imageList trong form
      const currentImageList = form.getFieldValue('images') || [];
      const updatedImageList = currentImageList.filter(f => f.uid !== file.uid);
      form.setFieldsValue({ images: updatedImageList });
      console.log('📝 Updated images form value:', updatedImageList);

      return true;
    },
    [form]
  );

  // Xử lý xóa file tài liệu
  const handleDocumentRemove = useCallback(
    file => {
      console.log('🗑️ Removing document:', file);

      // Xử lý filename cho section general
      const filename = file.filename || file.response?.filename;

      // Nếu file đã upload thành công (có response hoặc filename), thêm vào removedDocuments
      if (file.url || file.response || filename) {
        const fileToRemove = file.response || file;
        if (fileToRemove && (fileToRemove.filename || filename)) {
          setRemovedDocuments(prev => {
            const exists = prev.some(
              f => f && (f.filename === fileToRemove.filename || f.filename === filename)
            );
            if (!exists) {
              console.log('Added to removedDocuments:', fileToRemove);
              return [...prev, fileToRemove];
            }
            return prev;
          });
        }
      }

      // Cập nhật docList trong form
      const currentDocList = form.getFieldValue('documents') || [];
      const updatedDocList = currentDocList.filter(f => f.uid !== file.uid);
      form.setFieldsValue({ documents: updatedDocList });
      console.log('📝 Updated documents form value:', updatedDocList);

      return true;
    },
    [form]
  );

  // Hàm download file qua API (bảo mật, có token)
  const handleDownloadImage = async image => {
    try {
      const pathToUse = image.path || image.filename;
      const response = await api.get(
        `/api/system-info/${id}/files/${encodeURIComponent(pathToUse)}`,
        {
          responseType: 'blob',
        }
      );
      const blob = new Blob([response.data], {
        type: image.mimetype || 'application/octet-stream',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = processFileName(image);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download image error:', error);
    }
  };

  // Hàm download document qua API (bảo mật, có token)
  const handleDownloadDocument = async doc => {
    try {
      // Xử lý path cho section general
      const pathToUse = doc.path || doc.filename || doc.response?.path || doc.response?.filename;
      if (!pathToUse) {
        message.error('Không tìm thấy đường dẫn file');
        return;
      }

      const response = await api.get(
        `/api/system-info/${id}/files/${encodeURIComponent(pathToUse)}`,
        {
          responseType: 'blob',
        }
      );

      // Xử lý tên file download
      let downloadName = 'document';
      if (doc.name) {
        downloadName = doc.name;
      } else if (doc.response?.originalName) {
        downloadName = doc.response.originalName;
      } else if (doc.originalName) {
        downloadName = doc.originalName;
      } else {
        downloadName = processFileName(doc);
      }

      const blob = new Blob([response.data], {
        type: doc.mimetype || doc.response?.mimetype || 'application/octet-stream',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = downloadName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download document error:', error);
      message.error('Lỗi tải tài liệu');
    }
  };

  // Hàm xử lý preview ảnh cho các mục con
  const handleSubItemPreview = (images, title, index = 0) => {
    if (images && images.length > 0) {
      const image = images[index];
      if (image.response) {
        // Nếu file đã upload, sử dụng ImagePreview để lấy URL
        const token = localStorage.getItem('token');
        fetch(
          `${import.meta.env.VITE_API_URL}/api/system-info/${id}/files/${image.response.filename}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
          .then(res => {
            if (res.ok) {
              return res.blob();
            }
            throw new Error('Fetch failed');
          })
          .then(blob => {
            const url = window.URL.createObjectURL(blob);
            setPreviewImage(url);
            setPreviewVisible(true);
            setPreviewTitle(`${title} - ${processFileName(image)}`);
          })
          .catch(error => {
            console.error('Error loading preview image:', error);
            message.error('Lỗi tải ảnh preview');
          });
      }
    }
  };

  // Hàm xử lý preview ảnh
  const handlePreview = async file => {
    if (file.response || file.filename || file.path) {
      // Nếu file đã upload, sử dụng ImagePreview để lấy URL
      const token = localStorage.getItem('token');
      const pathToUse =
        file.response?.path || file.path || file.response?.filename || file.filename;
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/system-info/${id}/files/${encodeURIComponent(pathToUse)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.ok) {
          const blob = await res.blob();
          const url = window.URL.createObjectURL(blob);
          setPreviewImage(url);
          setPreviewVisible(true);
          setPreviewTitle(processFileName(file) || '');
        }
      } catch (error) {
        console.error('Error loading preview image:', error);
        message.error('Lỗi tải ảnh preview');
      }
    } else {
      // Nếu file mới upload
      setPreviewImage(file.url || file.thumbUrl);
      setPreviewVisible(true);
      setPreviewTitle(processFileName(file) || '');
    }
  };

  // Xử lý lưu dữ liệu
  const handleSave = async values => {
    setSaving(true);
    try {
      console.log('💾 Saving system data:', values);

      // Chuẩn bị dữ liệu để gửi - lưu cả content JSON và các trường riêng lẻ
      const submitData = {
        systemType: values.systemType,
        title: values.title,
        subtitle: values.subtitle,
        isActive: values.isActive,
        purpose: values.purpose?.description || '',
        components: values.components?.description || '',
        operation: values.operation?.description || '',
        procedures: values.procedures?.description || '',
        troubleshooting: values.issues?.description || '',
        content: JSON.stringify({
          purpose: values.purpose || {
            title: 'Mục đích',
            description: '',
            items: [],
            files: [],
          },
          components: values.components || {
            title: 'Thành phần chính',
            description: '',
            items: [],
            files: [],
          },
          operation: values.operation || {
            title: 'Nguyên lý hoạt động',
            description: '',
            items: [],
          },
          procedures: values.procedures || {
            title: 'Quy trình vận hành',
            description: '',
            items: [],
            files: [],
          },
          troubleshooting: values.issues || {
            title: 'Sự cố thường gặp',
            description: '',
            items: [],
            files: [],
          },
          general: {
            title: 'Tài liệu chung',
            description: '',
            files: [
              ...(values.images || []).filter(img => img.filename || img.response?.filename),
              ...(values.documents || []).filter(doc => doc.filename || doc.response?.filename),
            ],
          },
        }),
      };

      console.log('📤 Submitting data:', submitData);

      // Gửi request cập nhật
      const response = await api.put(`/api/system-info/${id}`, submitData);

      if (response.data.success) {
        message.success('Lưu thành công!');

        // Xóa các file đã xóa
        if (removedImages.length > 0 || removedDocuments.length > 0) {
          console.log('🗑️ Cleaning up removed files...');
          const deletePromises = [];

          removedImages.forEach(image => {
            if (image.filename) {
              deletePromises.push(
                api
                  .delete(`/api/system-info/${id}/files/${image.filename}`)
                  .catch(err => console.error('Error deleting image:', err))
              );
            }
          });

          removedDocuments.forEach(doc => {
            if (doc.filename) {
              deletePromises.push(
                api
                  .delete(`/api/system-info/${id}/files/${doc.filename}`)
                  .catch(err => console.error('Error deleting document:', err))
              );
            }
          });

          await Promise.all(deletePromises);
          console.log('✅ Cleanup completed');
        }

        // Reset removed files lists
        setRemovedImages([]);
        setRemovedDocuments([]);

        // Chuyển về SystemInfoPage tương ứng với systemType
        const systemType = values.systemType;
        // Chuyển đổi systemType thành URL friendly
        const systemTypeUrl = systemType.toLowerCase().replace(/_/g, '-');
        console.log(
          '🔄 Redirecting to SystemInfoPage with systemType:',
          systemType,
          'URL:',
          systemTypeUrl
        );
        navigate(`${getRolePrefix()}/system-info/${systemTypeUrl}`);
      } else {
        throw new Error(response.data.message || 'Save failed');
      }
    } catch (error) {
      console.error('❌ Error saving:', error);
      message.error('Lỗi lưu dữ liệu!');
    } finally {
      setSaving(false);
    }
  };

  const handleBack = useCallback(() => {
    navigate(getRolePrefix() + '/system-info');
  }, [navigate, getRolePrefix]);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (!systemData) {
    return <div>Không tìm thấy dữ liệu</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
              Quay lại
            </Button>
            <Title level={3} style={{ margin: 0 }}>
              Chỉnh sửa: {systemData.title}
            </Title>
          </Space>
          <Button
            type='primary'
            icon={<SaveOutlined />}
            loading={saving}
            onClick={() => form.submit()}
            style={{
              backgroundColor: '#1890ff',
              borderColor: '#1890ff',
              color: 'white',
              fontWeight: 'bold',
              padding: '8px 16px',
              height: 'auto',
            }}
          >
            Lưu thay đổi
          </Button>
        </div>

        <Form form={form} layout='vertical' onFinish={handleSave}>
          {/* Thông tin cơ bản */}
          <Card title='Thông tin cơ bản' style={{ marginBottom: '24px' }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name='systemType'
                  label='Loại hệ thống'
                  rules={[{ required: true, message: 'Vui lòng chọn loại hệ thống' }]}
                >
                  <Select>
                    <Option value='UPS_DISTRIBUTION'>Hệ thống phân phối điện UPS</Option>
                    <Option value='UPS'>Hệ thống UPS</Option>
                    <Option value='COOLING'>Hệ thống làm mát</Option>
                    <Option value='VIDEO_SURVEILLANCE'>Hệ thống giám sát hình ảnh</Option>
                    <Option value='ACCESS_CONTROL'>Hệ thống kiểm soát truy cập</Option>
                    <Option value='FIRE_PROTECTION'>PCCC</Option>
                    <Option value='INFRASTRUCTURE_MONITORING'>
                      Hệ thống giám sát hạ tầng TTDL
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name='isActive' label='Trạng thái'>
                  <Select>
                    <Option value={true}>Hoạt động</Option>
                    <Option value={false}>Không hoạt động</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name='title'
              label='Tiêu đề hệ thống'
              rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item name='subtitle' label='Mô tả ngắn'>
              <Input />
            </Form.Item>
          </Card>

          {/* Mục đích */}
          <Card
            title={
              <Form.Item name={['purpose', 'title']} style={{ margin: 0 }}>
                <Input
                  placeholder='Nhập tên mục đích...'
                  style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    border: 'none',
                    backgroundColor: 'transparent',
                    padding: 0,
                  }}
                />
              </Form.Item>
            }
            style={{ marginBottom: '24px' }}
          >
            <Form.Item name={['purpose', 'description']} label='Mô tả mục đích'>
              <TextArea rows={3} placeholder='Mô tả mục đích của hệ thống...' />
            </Form.Item>

            <Form.Item name={['purpose', 'items']} label='Các điểm chính'>
              <PurposeItems />
            </Form.Item>
          </Card>

          {/* Thành phần */}
          <Card
            title={
              <Form.Item name={['components', 'title']} style={{ margin: 0 }}>
                <Input
                  placeholder='Nhập tên thành phần...'
                  style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    border: 'none',
                    backgroundColor: 'transparent',
                    padding: 0,
                  }}
                />
              </Form.Item>
            }
            style={{ marginBottom: '24px' }}
          >
            <Form.Item name={['components', 'description']} label='Mô tả chung'>
              <TextArea rows={2} placeholder='Mô tả chung về các thành phần...' />
            </Form.Item>

            <Form.Item name={['components', 'items']} label='Danh sách thành phần'>
              <ComponentsItems
                systemInfoId={id}
                form={form}
                onPreview={handleSubItemPreview}
                onUpload={handleSubItemUpload}
              />
            </Form.Item>
          </Card>

          {/* Nguyên lý hoạt động */}
          <Card
            title={
              <Form.Item name={['operation', 'title']} style={{ margin: 0 }}>
                <Input
                  placeholder='Nhập tên nguyên lý hoạt động...'
                  style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    border: 'none',
                    backgroundColor: 'transparent',
                    padding: 0,
                  }}
                />
              </Form.Item>
            }
            style={{ marginBottom: '24px' }}
          >
            <Form.Item name={['operation', 'description']} label='Mô tả chung'>
              <TextArea rows={2} placeholder='Mô tả chung về nguyên lý hoạt động...' />
            </Form.Item>

            <Form.Item name={['operation', 'items']} label='Danh sách nguyên lý hoạt động'>
              <Form.List name={['operation', 'items']}>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Card size='small' key={key} style={{ marginBottom: 16 }}>
                        <Row gutter={16}>
                          <Col span={20}>
                            <Form.Item {...restField} name={[name, 'title']} label='Tên nguyên lý'>
                              <Input placeholder='Nhập tên nguyên lý hoạt động...' />
                            </Form.Item>
                          </Col>
                          <Col span={4}>
                            <Button
                              type='text'
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => remove(name)}
                              style={{ marginTop: 32 }}
                            >
                              Xóa
                            </Button>
                          </Col>
                        </Row>

                        <Form.Item {...restField} name={[name, 'description']} label='Mô tả'>
                          <TextArea rows={2} placeholder='Mô tả nguyên lý hoạt động...' />
                        </Form.Item>

                        <Form.Item {...restField} name={[name, 'steps']} label='Các bước thực hiện'>
                          <Form.List name={[name, 'steps']}>
                            {(stepFields, { add: addStep, remove: removeStep }) => (
                              <>
                                {stepFields.map(
                                  ({ key: stepKey, name: stepName, ...stepRestField }) => (
                                    <div
                                      key={stepKey}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        marginBottom: 8,
                                      }}
                                    >
                                      <Form.Item
                                        {...stepRestField}
                                        name={[stepName]}
                                        style={{ flex: 1, marginBottom: 0 }}
                                      >
                                        <Input placeholder={`Bước ${stepName + 1}`} />
                                      </Form.Item>
                                      <Button
                                        type='text'
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => removeStep(stepName)}
                                        style={{ marginLeft: 8 }}
                                      />
                                    </div>
                                  )
                                )}
                                <Form.Item>
                                  <Button
                                    type='dashed'
                                    onClick={() => addStep()}
                                    block
                                    icon={<PlusOutlined />}
                                  >
                                    Thêm bước
                                  </Button>
                                </Form.Item>
                              </>
                            )}
                          </Form.List>
                        </Form.Item>

                        {/* Upload ảnh cho nguyên lý */}
                        <Row gutter={16}>
                          <Col span={12}>
                            <Form.Item
                              name={[name, 'images']}
                              label='Ảnh minh họa'
                              valuePropName='fileList'
                              getValueFromEvent={e => (Array.isArray(e) ? e : e && e.fileList)}
                            >
                              <Upload
                                multiple
                                accept='image/*'
                                beforeUpload={file => validateSystemInfoFile(file, 'image')}
                                listType='picture-card'
                                onChange={info => {
                                  const newFiles = info.fileList.filter(
                                    file => file.originFileObj && !file.filename
                                  );
                                  newFiles.forEach(file => {
                                    handleSubItemUpload(
                                      file.originFileObj,
                                      'operation',
                                      name,
                                      'image'
                                    );
                                  });
                                }}
                              >
                                <div>Upload ảnh</div>
                              </Upload>
                            </Form.Item>
                          </Col>
                          <Col span={12}>
                            <Form.Item
                              name={[name, 'documents']}
                              label='Tài liệu đính kèm'
                              valuePropName='fileList'
                              getValueFromEvent={e => (Array.isArray(e) ? e : e && e.fileList)}
                            >
                              <Upload
                                multiple
                                accept='.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.rar,.7z'
                                beforeUpload={file => validateSystemInfoFile(file, 'document')}
                                onChange={info => {
                                  const newFiles = info.fileList.filter(
                                    file => file.originFileObj && !file.filename
                                  );
                                  newFiles.forEach(file => {
                                    handleSubItemUpload(
                                      file.originFileObj,
                                      'operation',
                                      name,
                                      'document'
                                    );
                                  });
                                }}
                              >
                                <Button icon={<UploadOutlined />}>Upload tài liệu</Button>
                              </Upload>
                            </Form.Item>
                          </Col>
                        </Row>
                      </Card>
                    ))}
                    <Form.Item>
                      <Button
                        type='dashed'
                        onClick={() =>
                          add({
                            title: '',
                            description: '',
                            steps: [],
                            images: [],
                            documents: [],
                          })
                        }
                        block
                        icon={<PlusOutlined />}
                      >
                        Thêm nguyên lý hoạt động
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </Form.Item>
          </Card>

          {/* Quy trình vận hành */}
          <Card
            title={
              <Form.Item name={['procedures', 'title']} style={{ margin: 0 }}>
                <Input
                  placeholder='Nhập tên quy trình vận hành...'
                  style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    border: 'none',
                    backgroundColor: 'transparent',
                    padding: 0,
                  }}
                />
              </Form.Item>
            }
            style={{ marginBottom: '24px' }}
          >
            <Form.Item name={['procedures', 'description']} label='Mô tả chung'>
              <TextArea rows={2} placeholder='Mô tả chung về quy trình vận hành...' />
            </Form.Item>

            <Form.Item name={['procedures', 'items']} label='Danh sách quy trình'>
              <ProceduresItems onUpload={handleSubItemUpload} />
            </Form.Item>
          </Card>

          {/* Sự cố thường gặp */}
          <Card
            title={
              <Form.Item name={['issues', 'title']} style={{ margin: 0 }}>
                <Input
                  placeholder='Nhập tên sự cố thường gặp...'
                  style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    border: 'none',
                    backgroundColor: 'transparent',
                    padding: 0,
                  }}
                />
              </Form.Item>
            }
            style={{ marginBottom: '24px' }}
          >
            <Form.Item name={['issues', 'description']} label='Mô tả chung'>
              <TextArea rows={2} placeholder='Mô tả chung về các sự cố...' />
            </Form.Item>

            <Form.Item name={['issues', 'items']} label='Danh sách sự cố'>
              <IssuesItems onUpload={handleSubItemUpload} />
            </Form.Item>
          </Card>

          {/* Upload file */}
          <Card title='Hình ảnh và tài liệu' style={{ marginBottom: '24px' }}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name='images'
                  label='Hình ảnh hệ thống'
                  valuePropName='fileList'
                  getValueFromEvent={e => {
                    console.log('📸 Images getValueFromEvent:', e);
                    if (Array.isArray(e)) {
                      return e;
                    }
                    return e?.fileList;
                  }}
                >
                  <Upload
                    multiple
                    maxCount={10}
                    listType='picture-card'
                    showUploadList={{
                      showDownloadIcon: true,
                      showRemoveIcon: true,
                      removeIcon: <DeleteOutlined style={{ color: '#ff4d4f' }} />,
                    }}
                    customRequest={async ({ file, onSuccess, onError, onProgress }) => {
                      try {
                        console.log('🔄 Uploading image:', file.name);

                        // Validate file
                        const isImage = file.type.startsWith('image/');
                        if (!isImage) {
                          onError(new Error('Chỉ được upload file ảnh!'));
                          return;
                        }
                        const isLt100M = file.size / 1024 / 1024 < 100;
                        if (!isLt100M) {
                          onError(new Error('File phải nhỏ hơn 100MB!'));
                          return;
                        }

                        // Tạo FormData
                        const formData = new FormData();
                        formData.append('file', file);
                        formData.append('fileType', 'image');
                        formData.append('section', 'general'); // Upload vào section general

                        // Upload file
                        const response = await api.post(`/api/system-info/${id}/upload`, formData, {
                          headers: {
                            'Content-Type': 'multipart/form-data',
                          },
                          onUploadProgress: progressEvent => {
                            const percentCompleted = Math.round(
                              (progressEvent.loaded * 100) / progressEvent.total
                            );
                            onProgress({ percent: percentCompleted });
                          },
                        });

                        if (response.data.success) {
                          const uploadedFile = response.data.data.uploadedFiles[0];
                          console.log('✅ Image uploaded successfully:', uploadedFile);
                          onSuccess(uploadedFile);
                        } else {
                          onError(new Error(response.data.message || 'Upload failed'));
                        }
                      } catch (error) {
                        console.error('❌ Upload error:', error);
                        onError(error);
                      }
                    }}
                    accept='image/*'
                    onRemove={handleImageRemove}
                    itemRender={(originNode, file) => {
                      // Nếu file đã upload thành công (có response hoặc filename)
                      if (file.response || file.filename) {
                        const imageData = file.response || file;
                        return (
                          <div style={{ position: 'relative' }}>
                            <ImagePreview
                              image={imageData}
                              systemInfoId={id}
                              style={{
                                width: 80,
                                height: 80,
                                objectFit: 'cover',
                                cursor: 'pointer',
                              }}
                              onClick={() => handlePreview(file)}
                            />
                            <Button
                              type='text'
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => handleImageRemove(file)}
                              style={{ position: 'absolute', top: 0, right: 0 }}
                            />
                            <Button
                              type='text'
                              icon={<DownloadOutlined />}
                              onClick={() => handleDownloadImage(imageData)}
                              style={{ position: 'absolute', bottom: 0, right: 0 }}
                            />
                          </div>
                        );
                      }
                      return originNode;
                    }}
                    onPreview={handlePreview}
                  >
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload ảnh</div>
                    </div>
                  </Upload>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name='documents'
                  label='Tài liệu đính kèm'
                  valuePropName='fileList'
                  getValueFromEvent={e => {
                    console.log('📄 Documents getValueFromEvent:', e);
                    if (Array.isArray(e)) {
                      return e;
                    }
                    return e?.fileList;
                  }}
                >
                  <Upload
                    multiple
                    maxCount={10}
                    listType='text'
                    showUploadList={{
                      showDownloadIcon: true,
                      showRemoveIcon: true,
                      removeIcon: <DeleteOutlined style={{ color: '#ff4d4f' }} />,
                    }}
                    customRequest={async ({ file, onSuccess, onError, onProgress }) => {
                      try {
                        console.log('🔄 Uploading document:', file.name);

                        // Validate file
                        const allowedTypes = [
                          'application/pdf',
                          'application/msword',
                          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                          'application/vnd.ms-excel',
                          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                          'text/plain',
                          'application/zip',
                          'application/x-rar-compressed',
                          'application/x-7z-compressed',
                        ];
                        const isValidType = allowedTypes.includes(file.type);
                        if (!isValidType) {
                          onError(new Error('Loại file không được hỗ trợ!'));
                          return;
                        }
                        const isLt100M = file.size / 1024 / 1024 < 100;
                        if (!isLt100M) {
                          onError(new Error('File phải nhỏ hơn 100MB!'));
                          return;
                        }

                        // Tạo FormData
                        const formData = new FormData();
                        formData.append('file', file);
                        formData.append('fileType', 'document');
                        formData.append('section', 'general'); // Upload vào section general

                        // Upload file
                        const response = await api.post(`/api/system-info/${id}/upload`, formData, {
                          headers: {
                            'Content-Type': 'multipart/form-data',
                          },
                          onUploadProgress: progressEvent => {
                            const percentCompleted = Math.round(
                              (progressEvent.loaded * 100) / progressEvent.total
                            );
                            onProgress({ percent: percentCompleted });
                          },
                        });

                        if (response.data.success) {
                          const uploadedFile = response.data.data.uploadedFiles[0];
                          console.log('✅ Document uploaded successfully:', uploadedFile);
                          onSuccess(uploadedFile);
                        } else {
                          onError(new Error(response.data.message || 'Upload failed'));
                        }
                      } catch (error) {
                        console.error('❌ Upload error:', error);
                        onError(error);
                      }
                    }}
                    accept='.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.rar,.7z'
                    onRemove={handleDocumentRemove}
                    itemRender={(originNode, file) => {
                      // Xử lý tên file cho section general
                      let fileName = 'Unknown file';

                      // Ưu tiên lấy tên từ file.name (tên gốc tiếng Việt)
                      if (file.name) {
                        fileName = file.name;
                      } else if (file.response?.originalName) {
                        // Nếu không có name, thử lấy từ response.originalName
                        fileName = file.response.originalName;
                      } else if (file.originalName) {
                        fileName = file.originalName;
                      } else {
                        // Fallback về processFileName
                        fileName = processFileName(file) || 'Unknown file';
                      }

                      // Hiển thị lỗi nếu upload thất bại
                      if (file.status === 'error') {
                        return (
                          <div className='flex items-center justify-between w-full'>
                            <Tag color='red' className='flex-grow'>
                              <CloseCircleOutlined /> {fileName}
                            </Tag>
                            <Button
                              type='text'
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => handleDocumentRemove(file)}
                            />
                          </div>
                        );
                      }

                      // Hiển thị loading nếu đang upload
                      if (file.status === 'uploading') {
                        return (
                          <div className='flex items-center justify-between w-full'>
                            <Tag color='processing' className='flex-grow'>
                              <LoadingOutlined /> {fileName}
                            </Tag>
                            <Button
                              type='text'
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => handleDocumentRemove(file)}
                            />
                          </div>
                        );
                      }

                      // Hiển thị bình thường nếu upload thành công
                      return (
                        <div className='flex items-center justify-between w-full'>
                          <Tag color='blue' className='flex-grow'>
                            <FileTextOutlined /> {fileName}
                          </Tag>
                          <Space>
                            {(file.url || file.filename || file.response?.filename) && (
                              <Button
                                type='text'
                                icon={<DownloadOutlined />}
                                onClick={() => {
                                  const downloadFile = file.response || file;
                                  if (downloadFile.path || downloadFile.filename) {
                                    // Download qua API
                                    handleDownloadDocument(downloadFile);
                                  } else {
                                    window.open(file.url, '_blank');
                                  }
                                }}
                              />
                            )}
                            <Button
                              type='text'
                              danger
                              icon={<DeleteOutlined />}
                              onClick={() => handleDocumentRemove(file)}
                            />
                          </Space>
                        </div>
                      );
                    }}
                  >
                    <Button icon={<UploadOutlined />}>Upload tài liệu</Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
          </Card>
        </Form>

        {/* Nút Save ở cuối trang */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '24px',
            padding: '16px',
            borderTop: '1px solid #f0f0f0',
            backgroundColor: '#fafafa',
          }}
        >
          <Space>
            <Button onClick={handleBack} style={{ padding: '8px 16px' }}>
              Hủy
            </Button>
            <Button
              type='primary'
              icon={<SaveOutlined />}
              loading={saving}
              onClick={() => form.submit()}
              style={{
                backgroundColor: '#1890ff',
                borderColor: '#1890ff',
                color: 'white',
                fontWeight: 'bold',
                padding: '8px 24px',
                height: 'auto',
                fontSize: '16px',
              }}
            >
              Lưu thay đổi
            </Button>
          </Space>
        </div>
      </Card>

      <Modal
        open={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt={previewTitle} style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
});

export default SystemInfoEditPage;
