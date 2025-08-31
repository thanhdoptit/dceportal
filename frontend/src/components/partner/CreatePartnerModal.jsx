import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Row, Col, message, Tooltip } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import * as partnerService from '../../services/partnerService';

const CreatePartnerModal = ({
  visible,
  onCancel,
  onSuccess,
  existingPartners = [], // Không còn sử dụng cho kiểm tra trùng lặp (để backward compatibility)
  title = "Thêm nhân sự thực hiện"
}) => {
  const [creating, setCreating] = useState(false);
  const [newPartners, setNewPartners] = useState([
    { fullname: '', donVi: '', email: '', phone: '', cccd: '' }
  ]);

  // Thêm dòng mới để nhập đối tác
  const addNewPartnerRow = () => {
    setNewPartners([...newPartners, { fullname: '', donVi: '', email: '', phone: '', cccd: '' }]);
  };

  // Xóa dòng nhập đối tác
  const removePartnerRow = (index) => {
    if (newPartners.length > 1) {
      setNewPartners(newPartners.filter((_, i) => i !== index));
    }
  };

  // Cập nhật thông tin đối tác
  const updatePartnerRow = (index, field, value) => {
    const updated = [...newPartners];
    updated[index] = { ...updated[index], [field]: value };
    setNewPartners(updated);
  };

  // State để lưu trạng thái trùng lặp và cảnh báo
  const [duplicateChecks, setDuplicateChecks] = useState({});
  const [warnings, setWarnings] = useState({});

  // Tối ưu hóa: Không cần fetch toàn bộ partners để kiểm tra trùng lặp
  // Thay vào đó, sử dụng API check-duplicate để kiểm tra trực tiếp với database
  // Kiểm tra trùng lặp khi user nhập đủ thông tin
  useEffect(() => {
    newPartners.forEach((partner, index) => {
      if (partner.fullname?.trim() && partner.donVi?.trim()) {
        // Debounce kiểm tra trùng lặp
        const timeoutId = setTimeout(async () => {
          await checkDuplicateAllFields(partner.fullname, partner.donVi, partner.cccd, index);
        }, 500);

        return () => clearTimeout(timeoutId);
      }
    });
  }, [newPartners]);

  // Kiểm tra trùng lặp: Họ tên + Đơn vị + CCCD (nếu có)
  const checkDuplicateAllFields = async (fullname, donVi, cccd, excludeIndex = -1) => {
    if (!fullname || !fullname.trim() || !donVi || !donVi.trim()) return false;

    const normalizedFullname = fullname.trim();
    const normalizedDonVi = donVi.trim();
    const normalizedCccd = (cccd || '').trim();

    // Kiểm tra với đối tác đang nhập (trừ dòng hiện tại) - kiểm tra local trước
    const newDuplicate = newPartners.find((partner, index) =>
      index !== excludeIndex &&
      partner.fullname?.trim() === normalizedFullname &&
      (partner.donVi || '').trim() === normalizedDonVi &&
      (partner.cccd || '').trim() === normalizedCccd
    );

    if (newDuplicate) return true;

    // Kiểm tra với database bằng API
    try {
      const result = await partnerService.checkDuplicatePartner(
        normalizedFullname,
        normalizedDonVi,
        normalizedCccd
      );

      // Lưu kết quả kiểm tra
      const checkKey = `${normalizedFullname}-${normalizedDonVi}-${normalizedCccd}`;
      setDuplicateChecks(prev => ({
        ...prev,
        [checkKey]: result
      }));

      // Lưu cảnh báo nếu có
      if (result.hasWarning) {
        setWarnings(prev => ({
          ...prev,
          [checkKey]: result
        }));
      } else {
        // Xóa cảnh báo nếu không còn
        setWarnings(prev => {
          const newWarnings = { ...prev };
          delete newWarnings[checkKey];
          return newWarnings;
        });
      }

      return result.isDuplicate;
    } catch (error) {
      console.error('Lỗi khi kiểm tra trùng lặp:', error);
      return false; // Nếu lỗi thì không block user
    }
  };

  // Kiểm tra trùng lặp sync (cho validation real-time)
  const checkDuplicateSync = (fullname, donVi, cccd, excludeIndex = -1) => {
    if (!fullname || !fullname.trim() || !donVi || !donVi.trim()) return false;

    const normalizedFullname = fullname.trim();
    const normalizedDonVi = donVi.trim();
    const normalizedCccd = (cccd || '').trim();

    // Kiểm tra với đối tác đang nhập (trừ dòng hiện tại)
    const newDuplicate = newPartners.find((partner, index) =>
      index !== excludeIndex &&
      partner.fullname?.trim() === normalizedFullname &&
      (partner.donVi || '').trim() === normalizedDonVi &&
      (partner.cccd || '').trim() === normalizedCccd
    );

    if (newDuplicate) return true;

    // Kiểm tra với kết quả đã cache
    const checkKey = `${normalizedFullname}-${normalizedDonVi}-${normalizedCccd}`;
    const cachedResult = duplicateChecks[checkKey];

    return cachedResult?.isDuplicate || false;
  };

  // Kiểm tra cảnh báo sync (cho hiển thị real-time)
  const checkWarningSync = (fullname, donVi, cccd, excludeIndex = -1) => {
    if (!fullname || !fullname.trim() || !donVi || !donVi.trim()) return null;

    const normalizedFullname = fullname.trim();
    const normalizedDonVi = donVi.trim();
    const normalizedCccd = (cccd || '').trim();

    // Kiểm tra với kết quả đã cache
    const checkKey = `${normalizedFullname}-${normalizedDonVi}-${normalizedCccd}`;
    const cachedWarning = warnings[checkKey];

    return cachedWarning?.hasWarning ? cachedWarning : null;
  };

  // Validation cho một đối tác
  const validatePartner = (partner, index) => {
    const errors = [];

    // Kiểm tra trùng lặp local (với các dòng đang nhập)
    if (partner.fullname && partner.fullname.trim() && partner.donVi && partner.donVi.trim()) {
      if (checkDuplicateSync(partner.fullname, partner.donVi, partner.cccd, index)) {
        const cccdText = partner.cccd && partner.cccd.trim() ? ` và số thẻ "${partner.cccd.trim()}"` : '';
        errors.push(`Dòng ${index + 1}: Đã tồn tại đối tác với họ tên "${partner.fullname.trim()}", đơn vị "${partner.donVi.trim()}"${cccdText}`);
      }
    }

    if (partner.cccd && partner.cccd.trim()) {
      // Kiểm tra format CCCD/số thẻ nhân viên (1-12 số)
      if (!/^\d{1,12}$/.test(partner.cccd.trim())) {
        errors.push(`Dòng ${index + 1}: Số thẻ nhân viên phải có 1-12 chữ số`);
      }
    }

    if (partner.email && partner.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(partner.email.trim())) {
        errors.push(`Dòng ${index + 1}: Email không đúng định dạng`);
      }
    }

    if (partner.phone && partner.phone.trim()) {
      const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
      if (!phoneRegex.test(partner.phone.trim())) {
        errors.push(`Dòng ${index + 1}: Số điện thoại không đúng định dạng`);
      }
    }

    return errors;
  };

  // Kiểm tra có thể submit hay không
  const canSubmit = () => {
    // Kiểm tra ít nhất một dòng có đủ thông tin bắt buộc
    const hasValidData = newPartners.some(partner =>
      partner.fullname && partner.fullname.trim() &&
      partner.donVi && partner.donVi.trim() &&
      partner.cccd && partner.cccd.trim()

    );

    // Kiểm tra tất cả các dòng có dữ liệu đều hợp lệ
    const allRowsValid = newPartners.every((partner, index) => {
      // Nếu dòng này có ít nhất một thông tin được nhập, thì phải có đủ thông tin bắt buộc
      const hasAnyData = partner.fullname?.trim() || partner.donVi?.trim() ||
        partner.email?.trim() || partner.phone?.trim() || partner.cccd?.trim();

      if (hasAnyData) {
        // Nếu có dữ liệu, phải có đủ thông tin bắt buộc
        const hasRequiredData = partner.fullname && partner.fullname.trim() &&
          partner.donVi && partner.donVi.trim() && partner.cccd && partner.cccd.trim();

        // Và không có lỗi validation (cảnh báo không block submit)
        const noValidationErrors = validatePartner(partner, index).length === 0;

        return hasRequiredData && noValidationErrors;
      }

      // Nếu không có dữ liệu gì, coi như hợp lệ
      return true;
    });

    return hasValidData && allRowsValid;
  };

  // Lấy thông báo tooltip cho nút submit
  const getSubmitTooltip = () => {
    // Kiểm tra ít nhất một dòng có đủ thông tin bắt buộc
    const hasValidData = newPartners.some(partner =>
      partner.fullname && partner.fullname.trim() &&
      partner.donVi && partner.donVi.trim() &&
      partner.cccd && partner.cccd.trim()
    );

    if (!hasValidData) {
      return 'Vui lòng điền đầy đủ thông tin';
    }

    // Kiểm tra từng dòng có dữ liệu
    const invalidRows = [];
    const warningRows = [];
    newPartners.forEach((partner, index) => {
      const hasAnyData = partner.fullname?.trim() || partner.donVi?.trim() ||
        partner.email?.trim() || partner.phone?.trim() || partner.cccd?.trim();

      if (hasAnyData) {
        const hasRequiredData = partner.fullname && partner.fullname.trim() &&
          partner.donVi && partner.donVi.trim() && partner.cccd && partner.cccd.trim();

        const validationErrors = validatePartner(partner, index);
        const warning = checkWarningSync(partner.fullname, partner.donVi, partner.cccd, index);

        if (!hasRequiredData || validationErrors.length > 0) {
          invalidRows.push(index + 1);
        }

        if (warning) {
          warningRows.push(index + 1);
        }
      }
    });

    if (invalidRows.length > 0) {
      return `Dòng ${invalidRows.join(', ')} chưa hợp lệ. Vui lòng kiểm tra lại thông tin.`;
    }

    if (warningRows.length > 0) {
      return `Dòng ${warningRows.join(', ')} có cảnh báo. Vui lòng kiểm tra lại CCCD.`;
    }

    return '';
  };

  // Tạo mới partners
  const handleCreate = async () => {
    // Validation tất cả đối tác
    const allErrors = [];

    // Kiểm tra trùng lặp với database trước khi tạo
    for (let i = 0; i < newPartners.length; i++) {
      const partner = newPartners[i];
      if (partner.fullname?.trim() && partner.donVi?.trim()) {
        const isDuplicate = await checkDuplicateAllFields(partner.fullname, partner.donVi, partner.cccd, i);
        if (isDuplicate) {
          const cccdText = partner.cccd && partner.cccd.trim() ? ` và số thẻ "${partner.cccd.trim()}"` : '';
          allErrors.push(`Dòng ${i + 1}: Đã tồn tại đối tác với họ tên "${partner.fullname.trim()}", đơn vị "${partner.donVi.trim()}"${cccdText}`);
        }
      }
    }

    // Validation khác
    newPartners.forEach((partner, index) => {
      const errors = validatePartner(partner, index);
      allErrors.push(...errors);
    });

    if (allErrors.length > 0) {
      message.error(allErrors.join('\n'));
      return;
    }

    setCreating(true);
    try {
      const createdPartners = [];

      // Tạo từng đối tác
      for (const partner of newPartners) {
        if (partner.fullname && partner.fullname.trim() && partner.donVi && partner.donVi.trim()) {
          const res = await partnerService.createPartner({
            ...partner,
            fullname: partner.fullname.trim(),
            donVi: partner.donVi.trim(),
            email: partner.email?.trim() || '',
            phone: partner.phone?.trim() || '',
            cccd: partner.cccd?.trim() || ''
          });

          createdPartners.push({
            type: 'partner',
            id: res.id,
            fullName: res.fullname,
            donVi: res.donVi,
            email: res.email,
            phone: res.phone,
            cccd: res.cccd,
            key: res.id,
            value: res.id,
            label: res.fullname + (res.donVi ? ` (${res.donVi})` : '')
          });
        }
      }

      // Reset form
      setNewPartners([{ fullname: '', donVi: '', email: '', phone: '', cccd: '' }]);

      // Gọi callback success
      if (onSuccess) {
        onSuccess(createdPartners);
      }

      if (createdPartners.length > 0) {
        message.success(`Đã tạo thành công ${createdPartners.length} đối tác`);
      }
    } catch (error) {
      console.error('Lỗi khi tạo đối tác:', error);

      // Xử lý lỗi validation từ backend
      if (error.response?.status === 400 && error.response?.data?.errors) {
        const errorMessages = error.response.data.errors;
        if (Array.isArray(errorMessages)) {
          message.error(errorMessages.join('\n'));
        } else {
          message.error(errorMessages);
        }
      } else if (error.response?.status === 500) {
        message.error('Lỗi hệ thống. Vui lòng thử lại sau.');
      } else {
        message.error('Tạo mới đối tác thất bại: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setCreating(false);
    }
  };

  // Xử lý đóng modal
  const handleCancel = () => {
    setNewPartners([{ fullname: '', donVi: '', email: '', phone: '', cccd: '' }]);
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={handleCancel}
      title={title}
      width={800}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Hủy
        </Button>,
        <Tooltip
          key="submit"
          title={!canSubmit() ? getSubmitTooltip() : ''}
          placement="top"
        >
          <Button
            type="primary"
            style={{ backgroundColor: '#003c71', borderColor: '#003c71' }}
            loading={creating}
            disabled={!canSubmit()}
            onClick={handleCreate}
          >
            Tạo mới
          </Button>
        </Tooltip>
      ]}
    >
      <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
        {newPartners.map((partner, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-3 mb-3">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-700">Nhân Sự {index + 1}</span>
              {newPartners.length > 1 && (
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => removePartnerRow(index)}
                  size="small"
                >
                  Xóa
                </Button>
              )}
            </div>

            <Row gutter={[8, 8]}>
              <Col span={12}>
                <Input
                  placeholder="Họ tên "
                  value={partner.fullname}
                  onChange={e => updatePartnerRow(index, 'fullname', e.target.value)}
                  status={
                    !partner.fullname.trim() ||
                      checkDuplicateSync(partner.fullname, partner.donVi, partner.cccd, index)
                      ? 'error' : ''
                  }
                />
              </Col>
              <Col span={12}>
                <Input
                  placeholder="Công ty / Phòng ban"
                  value={partner.donVi}
                  onChange={e => updatePartnerRow(index, 'donVi', e.target.value)}
                  status={
                    !partner.donVi.trim() ||
                      checkDuplicateSync(partner.fullname, partner.donVi, partner.cccd, index)
                      ? 'error' : ''
                  }
                />
              </Col>
              <Col span={8}>
                <Input
                  placeholder="Số thẻ / CCCD (1-12 số)"
                  value={partner.cccd}
                  onChange={e => updatePartnerRow(index, 'cccd', e.target.value)}
                  status={
                    !partner.cccd.trim() ||
                      (partner.cccd && !/^\d{1,12}$/.test(partner.cccd.trim())) ||
                      checkDuplicateSync(partner.fullname, partner.donVi, partner.cccd, index)
                      ? 'error' : ''
                  }
                />
              </Col>
              <Col span={8}>
                <Input
                  placeholder="Email"
                  value={partner.email}
                  onChange={e => updatePartnerRow(index, 'email', e.target.value)}
                  status={partner.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(partner.email.trim()) ? 'error' : ''}
                />
              </Col>
              <Col span={8}>
                <Input
                  placeholder="Số điện thoại"
                  value={partner.phone}
                  onChange={e => updatePartnerRow(index, 'phone', e.target.value)}
                  status={partner.phone && !/^[0-9+\-\s()]{10,15}$/.test(partner.phone.trim()) ? 'error' : ''}
                />
              </Col>

            </Row>

            {/* Hiển thị lỗi validation */}
            {(() => {
              const errors = validatePartner(partner, index);
              return errors.length > 0 ? (
                <div className="mt-2">
                  {errors.map((error, errIndex) => (
                    <div key={errIndex} className="text-red-500 text-xs">
                      {error}
                    </div>
                  ))}
                </div>
              ) : null;
            })()}

            {/* Hiển thị cảnh báo */}
            {(() => {
              const warning = checkWarningSync(partner.fullname, partner.donVi, partner.cccd, index);
              return warning ? (
                <div className="mt-2">
                  <div className="text-orange-500 text-xs flex items-start">
                    <span className="mr-1">⚠️</span>
                    <span>{warning.message}</span>
                  </div>
                  {warning.existingPartner && (
                    <div className="text-gray-500 text-xs mt-1 ml-4">
                      <div> {warning.existingPartner.fullname} - {warning.existingPartner.donVi} - {warning.existingPartner.cccd || 'Chưa có'}</div>
                    </div>
                  )}
                </div>
              ) : null;
            })()}
          </div>
        ))}
        <div className="mb-3">
          <Button
            type="primary"
            size='normal'
            icon={<PlusOutlined />}
            onClick={addNewPartnerRow}
            style={{ width: '80px', backgroundColor: '#0072BC', borderColor: '#0072BC', marginRight: 8 }}
          >
            Thêm
          </Button>
        </div>

        <div className="text-xs text-gray-500 mt-3">
          <div>* Họ tên đối tác là bắt buộc</div>
          <div>* Đơn vị là bắt buộc (Đối với phòng ban thuộc trung tâm hoặc NHCT thì ghi mã phòng ban - ví dụ DCE-ITD)</div>
          <div>* Số thẻ nhân viên / số CCCD bắt buộc</div>
        </div>
      </div>
    </Modal>
  );
};

export default CreatePartnerModal;
