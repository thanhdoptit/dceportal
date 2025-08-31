import db from '../models/index.js';  // Import db object
const { User, WorkShift, UserShift } = db;
const { Op } = db.Sequelize;

export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'fullname', 'email', 'gender', 'dob', 'role', 'isADUser']
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin người dùng'
      });
    }

    res.json({
      success: true,
      data: user,
      message: 'Lấy thông tin người dùng thành công'
    });
  } catch (err) {
    console.error('GET /me error:', err);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông tin người dùng'
    });
  }
};

export const updateProfile = async (req, res) => {
  const { fullname, gender, dob } = req.body;

  try {
    // Validation
    if (!fullname || fullname.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Họ tên phải có ít nhất 2 ký tự'
      });
    }

    if (fullname.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Họ tên không được quá 100 ký tự'
      });
    }

    if (gender && !['male', 'female', 'other'].includes(gender)) {
      return res.status(400).json({
        success: false,
        message: 'Giới tính không hợp lệ'
      });
    }

    // Validation ngày sinh
    if (dob) {
      const dobDate = new Date(dob);
      if (isNaN(dobDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Ngày sinh không hợp lệ'
        });
      }

      if (dobDate > new Date()) {
        return res.status(400).json({
          success: false,
          message: 'Ngày sinh không thể là tương lai'
        });
      }
    }

    const updateData = {
      fullname: fullname.trim(),
      gender: gender || null
    };

    // Chỉ thêm dob nếu hợp lệ
    if (dob && !isNaN(Date.parse(dob))) {
      updateData.dob = dob;
    }

    await User.update(updateData, {
      where: { id: req.user.id }
    });

    // Lấy thông tin user đã cập nhật
    const updatedUser = await User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'fullname', 'email', 'phone', 'gender', 'dob', 'role', 'isADUser']
    });

    res.json({
      success: true,
      data: updatedUser,
      message: 'Cập nhật thông tin thành công'
    });
  } catch (err) {
    console.error('PUT /me error:', err);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật thông tin'
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'fullname', 'role'],
      order: [
        ['fullname', 'ASC']
      ]
    });

    res.json({
      data: users,
      message: 'Lấy danh sách người dùng thành công'
    });
  } catch (err) {
    console.error('GET /users error:', err);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách người dùng' });
  }
};

// Manager user management functions
export const getManagerUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'fullname', 'role', 'isADUser'],
      where: {
        role: {
          [Op.in]: ['datacenter', 'be']
        }
      },
      order: [
        ['fullname', 'ASC']
      ]
    });

    res.json(users);
  } catch (err) {
    console.error('GET /manager/users error:', err);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách người dùng' });
  }
};

export const createUser = async (req, res) => {
  const { username, fullname, role, password } = req.body;

  try {
    // Check if username already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại' });
    }

    // Create new user
    const user = await User.create({
      username,
      fullname,
      role,
      password,
      isADUser: false
    });

    res.status(201).json(user);
  } catch (err) {
    console.error('POST /manager/users error:', err);
    res.status(500).json({ message: 'Lỗi khi tạo người dùng mới' });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { fullname, role, password } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    // Update user
    await user.update({
      fullname,
      role,
      ...(password && { password })
    });

    res.json(user);
  } catch (err) {
    console.error('PUT /manager/users/:id error:', err);
    res.status(500).json({ message: 'Lỗi khi cập nhật người dùng' });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    // Check if user has any active shifts
    const activeShifts = await WorkShift.findAll({
      include: [{
        model: User,
        as: 'Users',
        where: { id },
        through: { where: { status: 'doing' } }
      }]
    });

    if (activeShifts.length > 0) {
      return res.status(400).json({
        message: 'Không thể xóa người dùng đang có ca làm việc'
      });
    }

    await user.destroy();
    res.json({ message: 'Xóa người dùng thành công' });
  } catch (err) {
    console.error('DELETE /manager/users/:id error:', err);
    res.status(500).json({ message: 'Lỗi khi xóa người dùng' });
  }
};
