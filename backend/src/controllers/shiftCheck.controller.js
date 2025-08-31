import db from '../models/index.js';
import { Op } from 'sequelize';
import { trackDeviceErrorChange } from './device.controller.js';
import { 
  getDeviceDisplayInfo, 
  compareDeviceInfo, 
  createDeviceChangeMessage,
  extractDeviceIds,
  createDeviceMap 
} from '../utils/deviceUtils.js';

const { ShiftCheckForm, ShiftCheckItem, WorkShift, User } = db;

/**
 * Tạo mới biên bản kiểm tra thiết bị
 */
export const createShiftCheckForm = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const {
      workShiftId,
      checkerId,
      checkerName,
      location,
      checkedAt,
      notes,
      date,
      shift,
      items,
      deviceErrors
    } = req.body;

    if (!workShiftId || !checkerId || !location || !checkedAt || !items || !Array.isArray(items)) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }

    const newForm = await ShiftCheckForm.create({
      workShiftId,
      checkerId,
      location,
      checkedAt,
      checkerName,
      notes,
      date,
      shift
    }, { transaction });

    // Lấy thông tin device để tạo snapshot
    const deviceIds = [...new Set(items.map(item => item.deviceId))];
    const devices = await db.Device.findAll({
      where: { id: deviceIds },
      attributes: ['id', 'deviceName', 'category', 'position', 'serialNumber']
    });
    
    const deviceMap = devices.reduce((map, device) => {
      map[device.id] = device;
      return map;
    }, {});

    const itemData = items.map((item, idx) => {
      const device = deviceMap[item.deviceId];
      return {
      formId: newForm.id,
      deviceId: item.deviceId,
        // Lưu snapshot thông tin device
        deviceNameSnapshot: device?.deviceName || null,
        deviceCategorySnapshot: device?.category || null,
        devicePositionSnapshot: device?.position || null,
        deviceSerialNumberSnapshot: device?.serialNumber || null,
      status: item.status || 'Bình thường',
      resultStatus: item.resultStatus || 'Bình thường',
      subDeviceName: item.subDeviceName || '',
      serialNumber: item.serialNumber || '',
      createdBy: checkerId,
      errorCode: item.errorCode || '',
      errorCause: item.errorCause || '',
      solution: item.solution || '',
      resolveStatus: item.status === 'Có lỗi' ? (item.resolveStatus || 'Chưa xử lý') : '',
      notes: item.notes || '',
      index: idx + 1
      };
    });

    const createdItems = await ShiftCheckItem.bulkCreate(itemData, { transaction });

    // Xử lý DeviceError
    let errorData = [];
    const errors = Array.isArray(deviceErrors) ? deviceErrors : items;
    
    for (let i = 0; i < errors.length; i++) {
      const item = errors[i];
      
      if (item.id && item.resolveStatus === 'Đã xử lý') {
        // Update DeviceError sang Đã xử lý
        const error = await db.DeviceError.findByPk(item.id, { transaction });
        if (error) {
          await error.update({
          resolveStatus: 'Đã xử lý',
          resolvedAt: item.resolvedAt || null,
          resolvedBy: item.resolvedBy || '',
          resolveNote: item.resolveNote || '',
          updatedAt: new Date()
          }, { transaction });

        // Lưu lịch sử xử lý lỗi
        await trackDeviceErrorChange(
          item.id,
          checkerId,
          'resolve',
          'resolveStatus',
          'Chưa xử lý',
          'Đã xử lý',
          item.resolveNote || 'Xác nhận đã xử lý lỗi',
          false,
          transaction
        );
        }
        continue;
      }

      if (item.status === 'Có lỗi' && item.errorCode && item.errorCause) {
        if (item.id) {
          // Update lỗi cũ
          const error = await db.DeviceError.findByPk(item.id, { transaction });
          if (error) {
            const oldValues = {
              subDeviceName: error.subDeviceName,
              serialNumber: error.serialNumber,
              errorCode: error.errorCode,
              errorCause: error.errorCause,
              solution: error.solution,
              resolveStatus: error.resolveStatus
            };

            await error.update({
            subDeviceName: item.subDeviceName,
            serialNumber: item.serialNumber,
            createdBy: checkerId,
            errorCode: item.errorCode,
            errorCause: item.errorCause,
            solution: item.solution,
            resolveStatus: item.resolveStatus || 'Chưa xử lý',
            resolvedAt: item.resolvedAt || null,
            resolveNote: item.resolveNote || '',
            resolvedBy: item.resolvedBy || '',
            updatedAt: new Date(),
            location: location || null
            }, { transaction });

            // Lưu lịch sử thay đổi cho từng trường
            for (const [field, oldValue] of Object.entries(oldValues)) {
              const newValue = error[field];
              if (oldValue !== newValue) {
          await trackDeviceErrorChange(
            item.id,
            checkerId,
            'update',
                  field,
                  oldValue,
                  newValue,
            'Cập nhật thông tin lỗi thiết bị',
            false,
            transaction
          );
              }
            }
          }
        } else {
          // Kiểm tra trùng lặp
          const existed = await db.DeviceError.findOne({
            where: {
              deviceId: item.deviceId,
              subDeviceName: item.subDeviceName,
              resolveStatus: 'Chưa xử lý'
            },
            transaction
          });

          if (existed) {
            // Update bản ghi cũ
            const oldValues = {
              serialNumber: existed.serialNumber,
              errorCode: existed.errorCode,
              errorCause: existed.errorCause,
              solution: existed.solution,
              resolveStatus: existed.resolveStatus
            };

            await existed.update({
              serialNumber: item.serialNumber,
              createdBy: checkerId,
              errorCode: item.errorCode,
              errorCause: item.errorCause,
              solution: item.solution,
              resolveStatus: item.resolveStatus || 'Chưa xử lý',
              resolvedAt: item.resolvedAt || null,
              resolveNote: item.resolveNote || '',
              resolvedBy: item.resolvedBy || '',
              updatedAt: new Date(),
              location: location || null
            }, { transaction });

            // Lưu lịch sử thay đổi
            for (const [field, oldValue] of Object.entries(oldValues)) {
              const newValue = existed[field];
              if (oldValue !== newValue) {
            await trackDeviceErrorChange(
              existed.id,
              checkerId,
              'update',
                  field,
                  oldValue,
                  newValue,
              'Cập nhật thông tin lỗi thiết bị',
              false,
              transaction
            );
              }
            }
          } else {
            // Tạo mới
            errorData.push({
              deviceId: item.deviceId,
              subDeviceName: item.subDeviceName || '',
              serialNumber: item.serialNumber || '',
              createdBy: checkerId,
              errorCode: item.errorCode,
              errorCause: item.errorCause,
              solution: item.solution || '',
              resolveStatus: item.resolveStatus || 'Chưa xử lý',
              resolvedAt: item.resolvedAt || null,
              resolveNote: item.resolveNote || '',
              resolvedBy: item.resolvedBy || '',
              createdAt: new Date(),
              updatedAt: new Date(),
              location: location || null
            });
          }
        }
      }
    }

    if (errorData.length > 0) {
      const createdErrors = await db.DeviceError.bulkCreate(errorData, { 
        transaction,
        returning: true
      });

      // Lưu lịch sử tạo mới
      for (const err of createdErrors) {
        await trackDeviceErrorChange(
          err.id,
          checkerId,
          'create',
          'all',
          null,
          null,
          'Tạo mới lỗi thiết bị',
          false,
          transaction
        );
      }
    }

    await transaction.commit();
    return res.status(201).json(newForm);
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating shift check form:', error);
    return res.status(500).json({ message: 'Không thể tạo biên bản kiểm tra thiết bị' });
  }
};

/**
 * Cập nhật biên bản kiểm tra thiết bị
 */
export const updateShiftCheckForm = async (req, res) => {
  console.log('===> Đã vào updateShiftCheckForm');
  console.log('req.body:', req.body);
  const transaction = await db.sequelize.transaction();
  try {
    const { id } = req.params;
    const {
      location,
      checkedAt,
      notes
    } = req.body;

    const form = await ShiftCheckForm.findByPk(id);
    if (!form) {
      console.log('Không tìm thấy form với id:', id);
      return res.status(404).json({ message: 'Không tìm thấy biên bản kiểm tra' });
    }

    // Lấy tất cả ShiftCheckItem của form này
    const items = await db.ShiftCheckItem.findAll({ where: { formId: id }, transaction });
    const deviceIds = items.map(i => i.deviceId);
    // Lấy tất cả DeviceError có deviceId thuộc deviceIds
    const oldErrors = await db.DeviceError.findAll({
      where: { deviceId: deviceIds.length > 0 ? deviceIds : 0 },
      transaction
    });
    // Hàm chuẩn hóa chuỗi
    const normalize = str => (str || '').trim().toLowerCase();
    // Lấy danh sách lỗi mới (chỉ lấy các trường cần so sánh)
    const newErrorKeys = (req.body.items || [])
      .filter(item => item.status === 'Có lỗi')
      .map(item => `${item.deviceId}__${normalize(item.subDeviceName)}__Chưa xử lý`);

    // Lấy danh sách lỗi cũ (từ DB)
    const errorsToDelete = oldErrors.filter(err => {
      const key = `${err.deviceId}__${normalize(err.subDeviceName)}__${err.resolveStatus}`;
      return !newErrorKeys.includes(key);
    });

    // Debug log
    console.log('oldErrors:', oldErrors.map(e => ({ id: e.id, deviceId: e.deviceId, subDeviceName: e.subDeviceName, resolveStatus: e.resolveStatus })));
    console.log('newErrorKeys:', newErrorKeys);
    console.log('errorsToDelete:', errorsToDelete.map(e => e.id));

    // Xóa các bản ghi lỗi không còn
    for (const err of errorsToDelete) {
      await db.DeviceError.destroy({ where: { id: err.id }, transaction });
    }
    console.log('Đã xóa xong các DeviceError:', errorsToDelete.map(e => e.id));

    form.location = location || form.location;
    form.checkedAt = checkedAt || form.checkedAt;
    form.notes = notes || form.notes;

    await form.save({ transaction });

    await transaction.commit();
    return res.json(form);
  } catch (error) {
    console.error('Error updating shift check form:', error);
    await transaction.rollback();
    return res.status(500).json({ message: 'Không thể cập nhật biên bản kiểm tra' });
  }
};

/**
 * Lấy danh sách biên bản kiểm tra thiết bị theo workShiftId
 */
export const getShiftCheckForms = async (req, res) => {
  try {
    const { workShiftId } = req.query;
    if (!workShiftId) {
      return res.status(400).json({ message: 'Thiếu workShiftId' });
    }

    const forms = await ShiftCheckForm.findAll({
      where: { workShiftId },
      include: [
        {
          model: ShiftCheckItem,
          as: 'items'
        },
        {
          model: User,
          as: 'checker',
          attributes: ['id', 'fullname']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.json(forms);
  } catch (error) {
    console.error('Error fetching shift check forms:', error);
    return res.status(500).json({ message: 'Không thể tải danh sách biên bản kiểm tra' });
  }
};

/**
 * Xem chi tiết 1 biên bản kiểm tra thiết bị
 */
export const getShiftCheckFormById = async (req, res) => {
  try {
    const { id } = req.params;

    const form = await ShiftCheckForm.findByPk(id, {
      include: [
        {
          model: ShiftCheckItem,
          as: 'items'
        },
        {
          model: User,
          as: 'checker',
          attributes: ['id', 'fullname']
        }
      ]
    });

    if (!form) {
      return res.status(404).json({ message: 'Không tìm thấy biên bản kiểm tra' });
    }

    // Lấy thông tin device hiện tại để so sánh
    const deviceIds = extractDeviceIds(form.items);
    const currentDevices = await db.Device.findAll({
      where: { id: deviceIds },
      attributes: ['id', 'deviceName', 'category', 'position', 'serialNumber']
    });
    const deviceMap = createDeviceMap(currentDevices);

    // Xử lý thông tin device cho từng item
    const processedItems = form.items.map(item => {
      const currentDevice = deviceMap[item.deviceId];
      const deviceInfo = getDeviceDisplayInfo(item, currentDevice);
      const comparison = compareDeviceInfo(item, currentDevice);
      
      return {
        ...item.toJSON(),
        deviceInfo,
        deviceChanges: comparison.hasChanges ? comparison.changes : null,
        deviceChangeMessage: comparison.hasChanges ? createDeviceChangeMessage(comparison.changes) : null
      };
    });

    // Tạo response với thông tin đã xử lý
    const response = {
      ...form.toJSON(),
      items: processedItems
    };

    return res.json(response);
  } catch (error) {
    console.error('Error fetching shift check form by id:', error);
    return res.status(500).json({ message: 'Không thể tải biên bản kiểm tra' });
  }
};

/**
 * Xóa biên bản kiểm tra thiết bị
 */
export const deleteShiftCheckForm = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { id } = req.params;

    // Tìm biên bản cần xóa
    const form = await ShiftCheckForm.findByPk(id);
    if (!form) {
      return res.status(404).json({ message: 'Không tìm thấy biên bản kiểm tra' });
    }

    // Xóa các mục kiểm tra liên quan
    await ShiftCheckItem.destroy({
      where: { formId: id },
      transaction
    });

    // Xóa biên bản
    await form.destroy({ transaction });

    await transaction.commit();
    return res.json({ message: 'Xóa biên bản kiểm tra thành công' });
  } catch (error) {
    await transaction.rollback();
    console.error('Error deleting shift check form:', error);
    return res.status(500).json({ message: 'Không thể xóa biên bản kiểm tra' });
  }
};
