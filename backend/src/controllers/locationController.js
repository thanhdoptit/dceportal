import db from '../models/index.js';
const { Location } = db;
import { validateLocation } from '../schemas/locationSchema.js';
import { updateShiftConfigFromDatabase, updateFixedShifts } from '../config/shiftConfig.js';

export const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.findAll({
      order: [['id', 'ASC']] // Sắp xếp theo ID từ bé đến lớn để đảm bảo thứ tự
    });
    return res.json(locations);
  } catch (error) {
    console.error('Error in getAllLocations:', error);
    return res.status(500).json({ error: 'Không thể lấy danh sách địa điểm' });
  }
};

// API riêng cho trang quản lý - lấy tất cả địa điểm (cả active và inactive)
export const getAllLocationsForManagement = async (req, res) => {
  try {
    const locations = await Location.findAll({
      order: [['name', 'ASC']]
    });
    return res.json(locations);
  } catch (error) {
    console.error('Error in getAllLocationsForManagement:', error);
    return res.status(500).json({ error: 'Không thể lấy danh sách địa điểm' });
  }
};

export const getLocationById = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await Location.findOne({
      where: { id, isActive: true }
    });
    
    if (!location) {
      return res.status(404).json({ error: 'Không tìm thấy địa điểm' });
    }
    
    return res.json(location);
  } catch (error) {
    console.error('Error in getLocationById:', error);
    return res.status(500).json({ error: 'Không thể lấy thông tin địa điểm' });
  }
};

export const createLocation = async (req, res) => {
  try {
    const { error } = validateLocation(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const locationData = {
      ...req.body,
      createdBy: req.user.id
    };

    const location = await Location.create(locationData);
    
    // Cập nhật shiftConfig sau khi tạo location mới
    await updateShiftConfigFromDatabase();
    await updateFixedShifts();
    
    return res.status(201).json(location);
  } catch (error) {
    console.error('Error in createLocation:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Mã địa điểm đã tồn tại' });
    }
    return res.status(500).json({ error: 'Không thể tạo địa điểm mới' });
  }
};

export const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = validateLocation(req.body);
    
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const locationData = {
      ...req.body,
      updatedBy: req.user.id
    };

    const [updatedRows] = await Location.update(locationData, {
      where: { id }
    });

    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy địa điểm' });
    }

    const location = await Location.findByPk(id);
    
    // Cập nhật shiftConfig sau khi cập nhật location
    await updateShiftConfigFromDatabase();
    await updateFixedShifts();
    
    return res.json(location);
  } catch (error) {
    console.error('Error in updateLocation:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Mã địa điểm đã tồn tại' });
    }
    return res.status(500).json({ error: 'Không thể cập nhật địa điểm' });
  }
};

export const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const [updatedRows] = await Location.update(
      { isActive: false, updatedBy: req.user.id },
      { where: { id } }
    );
    
    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy địa điểm' });
    }
    
    // Cập nhật shiftConfig sau khi xóa location
    await updateShiftConfigFromDatabase();
    await updateFixedShifts();
    
    return res.json({ message: 'Xóa địa điểm thành công' });
  } catch (error) {
    console.error('Error in deleteLocation:', error);
    return res.status(500).json({ error: 'Không thể xóa địa điểm' });
  }
};

// Khôi phục địa điểm đã bị xóa
export const restoreLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const [updatedRows] = await Location.update(
      { isActive: true, updatedBy: req.user.id },
      { where: { id, isActive: false } }
    );
    
    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Không tìm thấy địa điểm đã bị xóa' });
    }
    
    // Cập nhật shiftConfig sau khi khôi phục location
    await updateShiftConfigFromDatabase();
    await updateFixedShifts();

    return res.json({ message: 'Khôi phục địa điểm thành công' });
  } catch (error) {
    console.error('Error in restoreLocation:', error);
    return res.status(500).json({ error: 'Không thể khôi phục địa điểm' });
  }
}; 