import db from '../models/index.js';
const {
  WorkShift,
  WorkSession,
  User,
  ShiftHandover,
  ShiftCheckForm,
  ShiftCheckItem,
  ShiftHandoverUser,
  ShiftHandoverDevice,
  ShiftHandoverTask,
  sequelize,
  Sequelize,
  Device,
  DeviceError,
  TaskUsers,
  Partners

} = db;
import { Op, where } from 'sequelize';
import fs from 'fs';
import path from 'path';
import { getCurrentDateUTC7 } from '../utils/dateUtils.js';
import config from '../config/upload.js';
import { broadcastShiftUpdate } from '../index.js';
import { shiftConfig, FIXED_SHIFTS } from '../config/shiftConfig.js';
// Hàm helper kiểm tra ca liền kề
const checkConsecutiveShifts = (previousShiftCodes, newShiftCode) => {
  // Lấy thứ tự ca từ FIXED_SHIFTS (hoặc Object.keys(shiftConfig))
  const shiftOrder = FIXED_SHIFTS;

  for (const prevCode of previousShiftCodes) {
    const prevIndex = shiftOrder.indexOf(prevCode);
    const newIndex = shiftOrder.indexOf(newShiftCode);
    // Nếu ca mới có index lớn hơn và liền kề với ca cũ
    if (Math.abs(newIndex - prevIndex) === 1) {
      return {
        isConsecutive: true,
        prevCode,
        newCode: newShiftCode
      };
    }
  }
  return { isConsecutive: false };
};

// Hàm cập nhật ShiftHandoverUser khi có thay đổi trong ca
const updateShiftHandoverUsers = async (shiftId, currentUsers) => {
  try {
    console.log('🔄 Updating ShiftHandoverUsers for shift:', shiftId);

    // Lấy các handover mà ca hiện tại là người nhận
    const handovers = await ShiftHandover.findAll({
      where: {
        toShiftId: shiftId  // Chỉ lấy handover mà ca hiện tại là người nhận
      },
      include: [
        {
          model: User,
          as: 'ToUsers',
          through: { attributes: [] },
          attributes: ['id']
        }
      ]
    });

    console.log('📝 Found handovers to update:', handovers.length);

    // Lấy danh sách người đang trong ca từ WorkSession
    const activeUsers = await WorkSession.findAll({
      where: {
        workShiftId: shiftId,
        status: 'active'
      },
      include: [{
        model: User,
        as: 'User',  // Thêm alias 'User' vào đây
        attributes: ['id', 'username', 'fullname']
      }]
    });

    const activeUserIds = activeUsers.map(session => session.User.id);
    console.log('👥 Active users in shift:', activeUserIds);

    // Cập nhật từng handover
    for (const handover of handovers) {
      // Lấy danh sách user hiện tại trong handover
      const currentHandoverUserIds = handover.ToUsers.map(user => user.id);

      // Xóa những user không còn active trong ca
      const usersToRemove = currentHandoverUserIds.filter(id => !activeUserIds.includes(id));
      if (usersToRemove.length > 0) {
        await ShiftHandoverUser.destroy({
          where: {
            shiftHandoverId: handover.id,
            userId: usersToRemove,
            role: 'receiver',
            type: 'to'
          }
        });
        console.log('🗑️ Removed users from handover:', usersToRemove);
      }

      // Thêm những user mới vào handover
      const usersToAdd = activeUserIds.filter(id => !currentHandoverUserIds.includes(id));
      if (usersToAdd.length > 0) {
        await Promise.all(usersToAdd.map(userId =>
          ShiftHandoverUser.create({
            shiftHandoverId: handover.id,
            userId,
            role: 'receiver',
            type: 'to'
          })
        ));
        console.log('➕ Added new users to handover:', usersToAdd);
      }
    }

    console.log('✅ Updated ShiftHandoverUsers for shift:', shiftId);
  } catch (error) {
    console.error('❌ Error updating ShiftHandoverUsers:', error);
    throw error;
  }
};

// Hàm gửi thông báo WebSocket cho shift
const sendShiftUpdate = (shift, changeType = 'status', oldValue = null, newValue = null, userId = null, userName = null) => {
  // Tăng version của shift
  const updatedShift = {
    ...shift.toJSON(),
    version: (shift.version || 0) + 1,
    lastUpdatedBy: userId,
    lastUpdatedByUser: userName
  };

  broadcastShiftUpdate({
    shift: updatedShift,
    changeType,
    oldValue,
    newValue
  });

  // Cập nhật version trong database
  shift.update({ version: updatedShift.version }).catch(error => {
    console.error('Error updating shift version:', error);
  });
};

// Chọn ca làm việc
export const selectShift = async (req, res) => {
  try {
    const { shiftCode, shiftDate } = req.body;
    const userId = req.user.id;

    console.log('🔄 Selecting shift:', { shiftCode, userId, shiftDate });

    // Lấy thông tin user hiện tại
    const currentUser = await User.findByPk(userId);
    console.log('👤 Current user:', currentUser.toJSON());

    // Kiểm tra xem user đã có session nào trong ngày chưa
    const existingSession = await WorkSession.findOne({
      where: {
        userId,
        date: shiftDate
      }
    });
    console.log('🔍 Existing session:', existingSession?.toJSON());

    // Kiểm tra xem user đã có trong workedUsers của ca nào trong ngày chưa
    const shiftsWithUser = await WorkShift.findAll({
      where: {
        date: shiftDate
      }
    });

    // Lọc các ca có chứa user trong workedUsers
    const shiftsContainingUser = shiftsWithUser.filter(shift => {
      const workedUsers = shift.workedUsers || [];
      return workedUsers.some(user => user.id === userId);
    });

    console.log('🔍 Shifts with user:', shiftsContainingUser.map(s => s.toJSON()));

    // Nếu user đã có trong workedUsers của ca khác, không cho phép vào ca mới
    if (shiftsContainingUser.length > 0) {
      const existingShift = shiftsContainingUser[0];
      return res.status(400).json({
        message: `Bạn đã tham gia ca ${existingShift.code} trong ngày hôm nay, không thể tham gia ca khác`
      });
    }

    // Lấy danh sách ca trong ngày
    const todayShifts = await WorkShift.findAll({
      where: {
        date: shiftDate
      }
    });
    console.log('📅 Today shifts:', todayShifts.map(s => s.toJSON()));

    // Lấy danh sách ca đã hoàn thành
    const doneShifts = await WorkShift.findAll({
      where: {
        date: shiftDate,
        status: 'done'
      }
    });
    console.log('🔍 Done shifts:', doneShifts.map(s => s.toJSON()));

    // Tìm ca tương ứng với mã ca
    let shift = await WorkShift.findOne({
      where: {
        code: shiftCode,
        date: shiftDate
      }
    });
    console.log('🔍 Found shift:', shift?.toJSON());



    // Xác định nhóm của ca mới
    const newShiftGroup = shiftCode[0]; // Lấy chữ cái đầu (T, H, V)
    const newShiftIndex = parseInt(shiftCode[1]); // Lấy số thứ tự trong nhóm

    // Kiểm tra ca trước đó trong cùng ngày
    if (newShiftIndex > 1) {
      const previousShiftCode = `${newShiftGroup}${newShiftIndex - 1}`;
      const previousShift = await WorkShift.findOne({
        where: {
          code: previousShiftCode,
          date: shiftDate
        }
      });

      // Cho phép chọn ca khi ca trước đang ở trạng thái 'doing' hoặc 'handover' hoặc 'done'
      if (!previousShift || !['doing', 'handover', 'done'].includes(previousShift.status)) {
        return res.status(400).json({
          message: `Không thể chọn ca ${shiftCode} khi ca ${previousShiftCode} chưa bắt đầu hoặc không ở trạng thái đang làm việc/bàn giao`
        });
      }
    }

    // Kiểm tra ca trước đó từ ngày trước (cho ca đầu tiên của ngày)
    if (newShiftIndex === 1) {
      // Lấy ngày trước đó
      const previousDate = new Date(shiftDate);
      previousDate.setDate(previousDate.getDate() - 1);
      const previousDateStr = previousDate.toISOString().split('T')[0];

      // Danh sách các ca cuối cùng của ngày trước
      const lastShifts = [
        { code: 'V2', group: 'V' },
        { code: 'H2', group: 'H' },
        { code: 'T3', group: 'T' }
      ];

      // Kiểm tra từng ca cuối của ngày trước
      for (const lastShift of lastShifts) {
        const previousDayLastShift = await WorkShift.findOne({
          where: {
            code: lastShift.code,
            date: previousDateStr
          }
        });

        if (previousDayLastShift) {
          const userSession = await WorkSession.findOne({
            where: {
              userId: userId,
              workShiftId: previousDayLastShift.id,
              date: previousDateStr
            }
          });

          if (userSession) {
            return res.status(400).json({
              message: `Bạn đã làm ca ${lastShift.code} ngày ${new Date(previousDateStr).toLocaleDateString('vi-VN')}, không thể tham gia ca ${shiftCode} ngày ${new Date(shiftDate).toLocaleDateString('vi-VN')}`
            });
          }
        }
      }
    }

    // Kiểm tra trạng thái ca trước khi cho join
    if (shift && !['waiting', 'doing', 'done'].includes(shift.status)) {
      return res.status(400).json({
        message: 'Không thể tham gia ca này do đang trong trạng thái ' + shift.status
      });
    }

    // Nếu không tìm thấy ca, tạo ca mới
    if (!shift) {
      const config = shiftConfig[shiftCode];
      if (!config) {
        throw new Error('Mã ca không hợp lệ');
      }

      // Tạo ca làm việc mới
      const newShift = await WorkShift.create({
        code: shiftCode,
        name: config.name,
        date: shiftDate,
        startTime: config.startTime,
        endTime: config.endTime,
        status: 'waiting',
        group: config.group,
        index: config.index,
        createdBy: userId
      });
      console.log('✅ Created new shift:', newShift.toJSON());

      // Tạo WorkSession
      console.log('📝 Creating work session for:', { userId, shiftId: newShift.id, date: shiftDate });
      const workSession = await WorkSession.create({
        userId: userId,
        workShiftId: newShift.id,
        date: shiftDate,
        startedAt: new Date(),
        status: 'active'
      });
      console.log('✅ Created work session:', workSession.toJSON());

      // Thêm user vào shift
      console.log('👤 Adding user to shift');
      await newShift.addUser(currentUser);

      // Cập nhật workedUsers nếu chưa có
      if (!newShift.workedUsers?.find(u => u.id === currentUser.id)) {
        const workedUsers = newShift.workedUsers || [];
        workedUsers.push({
          id: currentUser.id,
          username: currentUser.username,
          fullname: currentUser.fullname
        });
        newShift.workedUsers = workedUsers;
      }

      // Cập nhật trạng thái ca thành 'doing'
      newShift.status = 'doing';
      await newShift.save();

      // Lấy thông tin ca đã cập nhật
      const updatedShift = await WorkShift.findOne({
        where: { id: newShift.id },
        include: [{
          model: User,
          as: 'Users',
          attributes: ['id', 'username', 'fullname']
        }]
      });
      console.log('✅ Updated shift:', updatedShift.toJSON());

      // Cập nhật ShiftHandoverUsers với danh sách người dùng hiện tại
      const currentUsers = updatedShift.Users.map(user => ({
        id: user.id,
        username: user.username,
        fullname: user.fullname
      }));
      await updateShiftHandoverUsers(newShift.id, currentUsers);

      // Kiểm tra và cập nhật form bàn giao đang pending
      const pendingHandover = await ShiftHandover.findOne({
        where: {
          toShiftId: newShift.id,
          status: 'pending'
        }
      });

      if (pendingHandover) {
        console.log('📝 Found pending handover:', pendingHandover.id);

        // Kiểm tra xem người dùng đã có trong ShiftHandoverUser chưa
        const existingHandoverUser = await ShiftHandoverUser.findOne({
          where: {
            shiftHandoverId: pendingHandover.id,
            userId: currentUser.id,
            role: 'receiver',
            type: 'to'
          }
        });

        // Chỉ thêm mới nếu chưa tồn tại
        if (!existingHandoverUser) {
          await ShiftHandoverUser.create({
            shiftHandoverId: pendingHandover.id,
            userId: currentUser.id,
            role: 'receiver',
            type: 'to'
          });
          console.log('➕ Added user to ShiftHandoverUser:', currentUser.id);
        } else {
          console.log('ℹ️ User already exists in ShiftHandoverUser:', currentUser.id);
        }
      }

      // Broadcast update
      sendShiftUpdate(updatedShift, 'select', null, null, currentUser.id, currentUser.fullname);

      return res.json({
        message: 'Đã chọn ca thành công',
        shift: updatedShift
      });
    }

    try {
      // Tạo WorkSession
      console.log('📝 Creating work session for:', { userId, shiftId: shift.id, date: shiftDate });
      const workSession = await WorkSession.create({
        userId: userId,
        workShiftId: shift.id,
        date: shiftDate,
        startedAt: new Date(),
        status: 'active'
      });
      console.log('✅ Created work session:', workSession.toJSON());

      // Thêm user vào shift
      console.log('👤 Adding user to shift');
      await shift.addUser(currentUser);

      // Cập nhật workedUsers nếu chưa có
      if (!shift.workedUsers?.find(u => u.id === currentUser.id)) {
        const workedUsers = shift.workedUsers || [];
        workedUsers.push({
          id: currentUser.id,
          username: currentUser.username,
          fullname: currentUser.fullname
        });
        shift.workedUsers = workedUsers;
      }

      // Cập nhật trạng thái ca thành 'doing'
      shift.status = 'doing';
      await shift.save();

      // Lấy thông tin ca đã cập nhật
      const updatedShift = await WorkShift.findOne({
        where: { id: shift.id },
        include: [{
          model: User,
          as: 'Users',
          attributes: ['id', 'username', 'fullname']
        }]
      });
      console.log('✅ Updated shift:', updatedShift.toJSON());

      // Cập nhật ShiftHandoverUsers
      await updateShiftHandoverUsers(shift.id, shift.workedUsers);

      // Tìm tất cả biên bản bàn giao mà ca hiện tại là bên giao
      const fromHandovers = await ShiftHandover.findAll({
        where: {
          fromShiftId: shift.id
        }
      });

      // Thêm user vào ShiftHandoverUser cho tất cả biên bản bàn giao
      for (const handover of fromHandovers) {
        const existingFromUser = await ShiftHandoverUser.findOne({
          where: {
            shiftHandoverId: handover.id,
            userId: currentUser.id,
            role: 'handover',
            type: 'from'
          }
        });

        if (!existingFromUser) {
          await ShiftHandoverUser.create({
            shiftHandoverId: handover.id,
            userId: currentUser.id,
            role: 'handover',
            type: 'from'
          });
          console.log('➕ Added user to ShiftHandoverUser as from:', currentUser.id);

          // Cập nhật lại danh sách FromUsers trong biên bản
          const fromUsers = handover.FromUsers || [];
          fromUsers.push({
            id: currentUser.id,
            username: currentUser.username,
            fullname: currentUser.fullname
          });
          await handover.update({ fromUsers });
          console.log('✅ Updated handover fromUsers list');
        }
      }

      // Kiểm tra và cập nhật form bàn giao đang pending cho bên nhận
      const pendingToHandovers = await ShiftHandover.findAll({
        where: {
          toShiftId: shift.id,
          status: 'pending'
        }
      });

      for (const handover of pendingToHandovers) {
        console.log('📝 Processing pending handover:', handover.id);

        // Kiểm tra xem user đã có trong ToUsers chưa
        const existingToUser = await ShiftHandoverUser.findOne({
          where: {
            shiftHandoverId: handover.id,
            userId: currentUser.id,
            role: 'receiver',
            type: 'to'
          }
        });

        // Thêm user vào ToUsers nếu chưa có
        if (!existingToUser) {
          await ShiftHandoverUser.create({
            shiftHandoverId: handover.id,
            userId: currentUser.id,
            role: 'receiver',
            type: 'to'
          });
          console.log('➕ Added user to ToUsers:', currentUser.id);

          // Cập nhật lại danh sách ToUsers trong biên bản
          const toUsers = handover.ToUsers || [];
          toUsers.push({
            id: currentUser.id,
            username: currentUser.username,
            fullname: currentUser.fullname
          });
          await handover.update({ toUsers });
          console.log('✅ Updated handover toUsers list');
        }
      }

      // Broadcast update
      sendShiftUpdate(updatedShift, 'select', null, null, currentUser.id, currentUser.fullname);

      return res.json({
        message: 'Chọn ca thành công',
        shift: updatedShift
      });
    } catch (error) {
      console.error('❌ Error in shift operations:', error);
      console.error('❌ Error stack:', error.stack);
      return res.status(500).json({ message: 'Lỗi khi thêm người dùng vào ca' });
    }
  } catch (error) {
    console.error('❌ Error in selectShift:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ message: 'Lỗi khi chọn ca', error: error.message });
  }
};

// Thay đổi ca
export const changeShift = async (req, res) => {
  try {
    const { shiftCode } = req.body;
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0];

    console.log('🔄 Changing shift:', { shiftCode, userId, today });

    // Lấy thông tin user hiện tại
    const currentUser = await User.findByPk(userId);
    if (!currentUser) {
      return res.status(404).json({ message: 'Không tìm thấy thông tin người dùng' });
    }
    console.log('👤 Current user:', currentUser.toJSON());

    // Lấy ca hiện tại của user
    const currentSession = await WorkSession.findOne({
      where: {
        userId,
        date: today,
        status: 'active'
      },
      include: [{
        model: WorkShift,
        as: 'WorkShift'
      }]
    });
    console.log('🔍 Current session:', currentSession?.toJSON());

    if (!currentSession) {
      return res.status(400).json({ message: 'Bạn chưa tham gia ca nào hôm nay' });
    }

    // Lấy tất cả ca trong ngày để kiểm tra thứ tự
    const allShifts = await WorkShift.findAll({
      where: { date: today },
      order: [['code', 'ASC']]
    });
    console.log('📅 All shifts:', allShifts.map(s => s.toJSON()));

    // Kiểm tra xem ca hiện tại có phải là ca cuối cùng không
    const currentShiftIndex = allShifts.findIndex(s => s.code === currentSession.WorkShift.code);
    const newShiftIndex = allShifts.findIndex(s => s.code === shiftCode);

    if (currentShiftIndex === -1 || newShiftIndex === -1) {
      return res.status(400).json({ message: 'Không tìm thấy thông tin ca' });
    }

    // Kiểm tra xem có đang cố chọn ca liền kề không
    const { isConsecutive, prevCode, newCode } = checkConsecutiveShifts([currentSession.WorkShift.code], shiftCode);
    console.log('🔍 Consecutive check result:', {
      isConsecutive,
      prevCode,
      newCode
    });

    if (isConsecutive) {
      console.log('❌ Cannot select consecutive shift:', { prevCode, newCode });
      return res.status(400).json({
        message: `Không thể chuyển sang ca ${newCode} sau khi đã làm ca ${prevCode}. Vui lòng chọn ca khác.`
      });
    }

    // Tìm ca mới
    let newShift = await WorkShift.findOne({
      where: { code: shiftCode, date: today }
    });
    console.log('🔍 Found new shift:', newShift?.toJSON());

    if (!newShift) {
      // Tạo ca mới nếu chưa tồn tại
      newShift = await WorkShift.create({
        code: shiftCode,
        name: shiftCode,
        date: today,
        status: 'waiting',
        createdBy: userId,
        workedUsers: [{
          id: currentUser.id,
          username: currentUser.username,
          fullname: currentUser.fullname
        }]
      });
      console.log('✅ Created new shift:', newShift.toJSON());
    } else if (newShift.status === 'done') {
      return res.status(400).json({ message: 'Ca này đã kết thúc' });
    }

    try {
      // Kết thúc ca hiện tại
      currentSession.status = 'done';
      currentSession.endedAt = new Date();
      await currentSession.save();

      // Cập nhật trạng thái ca hiện tại
      const currentShift = currentSession.WorkShift;
      currentShift.status = 'waiting'; // Luôn đánh dấu là waiting để người khác có thể vào
      await currentShift.save();

      // Tạo WorkSession mới
      console.log('📝 Creating new work session for:', { userId, shiftId: newShift.id, date: today });
      const newSession = await WorkSession.create({
        userId: userId,
        workShiftId: newShift.id,
        date: today,
        startedAt: new Date(),
        status: 'active'
      });
      console.log('✅ Created new work session:', newSession.toJSON());

      // Thêm user vào ca mới
      console.log('👤 Adding user to new shift');
      await newShift.addUser(currentUser);

      // Cập nhật workedUsers nếu chưa có
      if (!newShift.workedUsers?.find(u => u.id === currentUser.id)) {
        const workedUsers = newShift.workedUsers || [];
        workedUsers.push({
          id: currentUser.id,
          username: currentUser.username,
          fullname: currentUser.fullname
        });
        newShift.workedUsers = workedUsers;
      }

      // Cập nhật trạng thái ca mới thành 'doing'
      newShift.status = 'doing';
      await newShift.save();

      // Lấy thông tin ca đã cập nhật
      const updatedShift = await WorkShift.findOne({
        where: { id: newShift.id },
        include: [{
          model: User,
          as: 'Users',
          attributes: ['id', 'username', 'fullname']
        }]
      });
      console.log('✅ Updated shift:', updatedShift.toJSON());

      // Cập nhật ShiftHandoverUsers với danh sách người dùng hiện tại
      const currentUsers = updatedShift.Users.map(user => ({
        id: user.id,
        username: user.username,
        fullname: user.fullname
      }));
      await updateShiftHandoverUsers(newShift.id, currentUsers);

      // Kiểm tra và cập nhật form bàn giao đang pending
      const pendingHandover = await ShiftHandover.findOne({
        where: {
          toShiftId: newShift.id,
          status: 'pending'
        }
      });

      if (pendingHandover) {
        console.log('📝 Found pending handover:', pendingHandover.id);

        // Kiểm tra xem người dùng đã có trong ShiftHandoverUser chưa
        const existingHandoverUser = await ShiftHandoverUser.findOne({
          where: {
            shiftHandoverId: pendingHandover.id,
            userId: currentUser.id,
            role: 'receiver',
            type: 'to'
          }
        });

        // Chỉ thêm mới nếu chưa tồn tại
        if (!existingHandoverUser) {
          await ShiftHandoverUser.create({
            shiftHandoverId: pendingHandover.id,
            userId: currentUser.id,
            role: 'receiver',
            type: 'to'
          });
          console.log('➕ Added user to ShiftHandoverUser:', currentUser.id);
        } else {
          console.log('ℹ️ User already exists in ShiftHandoverUser:', currentUser.id);
        }
      }

      // Broadcast update
      sendShiftUpdate(updatedShift, 'exit', null, null, currentUser.id, currentUser.fullname);

      return res.json({
        message: 'Đã thoát ca thành công',
        shift: updatedShift
      });
    } catch (error) {
      console.error('❌ Error in shift operations:', error);
      console.error('❌ Error stack:', error.stack);
      return res.status(500).json({ message: 'Lỗi khi chuyển ca' });
    }
  } catch (error) {
    console.error('❌ Error in changeShift:', error);
    console.error('❌ Error stack:', error.stack);
    return res.status(500).json({ message: 'Lỗi server khi chuyển ca' });
  }
};

// Kết thúc ca làm việc
export const closeShift = async (req, res) => {
  try {
    const shiftId = req.params.shiftId;
    const currentUser = req.user;

    console.log('🔄 Closing shift:', { shiftId, userId: currentUser.id });

    // Tìm ca làm việc và kiểm tra trạng thái
    const shift = await db.WorkShift.findOne({
      where: { id: shiftId },
      include: [
        {
          model: db.User,
          attributes: ['id', 'username', 'fullname', 'role']
        },
        {
          model: db.ShiftHandover,
          as: 'HandoversFrom',
          where: { status: 'pending' },
          required: false
        }
      ]
    });

    if (!shift) {
      return res.status(404).json({ message: 'Không tìm thấy ca làm việc' });
    }

    // Kiểm tra trạng thái ca
    if (shift.status !== 'done') {
      return res.status(400).json({ message: 'Ca làm việc chưa được bàn giao xong' });
    }

    // Kiểm tra còn form bàn giao đang chờ không
    if (shift.HandoversFrom?.length > 0) {
      return res.status(400).json({ message: 'Vẫn còn form bàn giao đang chờ xác nhận' });
    }

    // ✅ Bắt đầu transaction
    await db.sequelize.transaction(async (t) => {
      // 1. Cập nhật trạng thái ca làm việc
      await shift.update({
        status: 'closed',
        closedAt: new Date(),
        closedBy: currentUser.id
      }, { transaction: t });

      // 2. Thêm log
      await db.AuditLog.create({
        action: 'CLOSE_SHIFT',
        userId: currentUser.id,
        details: {
          shiftId: shift.id,
          shiftCode: shift.code
        }
      }, { transaction: t });
    });

    // ✅ Lấy thông tin đầy đủ để trả về
    const fullShift = await db.WorkShift.findByPk(shiftId, {
      include: [
        {
          model: db.User,
          attributes: ['id', 'username', 'fullname', 'role']
        },
        {
          model: db.ShiftHandover,
          as: 'HandoversFrom',
          include: [
            {
              model: db.WorkShift,
              as: 'ToShift',
              attributes: ['id', 'code', 'date', 'status']
            }
          ]
        },
        {
          model: db.ShiftHandover,
          as: 'HandoversTo',
          include: [
            {
              model: db.WorkShift,
              as: 'FromShift',
              attributes: ['id', 'code', 'date', 'status']
            }
          ]
        }
      ]
    });

    res.json({
      message: 'Đóng ca thành công',
      shift: fullShift
    });
  } catch (error) {
    console.error('❌ Error in closeShift:', error);
    res.status(500).json({
      message: 'Lỗi khi đóng ca',
      error: error.message
    });
  }
};


// Lấy ca hiện tại của user
export const getCurrentShift = async (req, res) => {
  try {
    const userId = req.user.id;

    console.log('🔍 Getting current shift for user:', { userId });

    // Tìm ca làm việc hiện tại của người dùng (không phụ thuộc vào ngày)
    const currentWorkSession = await WorkSession.findOne({
      where: {
        userId: userId,
        status: 'active'
      },
      include: [{
        model: WorkShift,
        as: 'WorkShift',
        attributes: ['id', 'code', 'name', 'status', 'date', 'workedUsers'],
        include: [{
          model: User,
          as: 'Users',
          through: { attributes: [] },
          attributes: ['id', 'username', 'fullname']
        }]
      }]
    });

    if (!currentWorkSession) {
      return res.json({ shift: null });
    }

    // Lấy thông tin đầy đủ của ca
    const shift = currentWorkSession.WorkShift;

    // Đảm bảo workedUsers luôn là một mảng
    if (!shift.workedUsers) {
      shift.workedUsers = shift.Users.map(user => ({
        id: user.id,
        username: user.username,
        fullname: user.fullname
      }));
      await shift.save();
    }

    return res.json({
      shift: {
        id: shift.id,
        code: shift.code,
        name: shift.name,
        status: shift.status,
        date: shift.date,
        workedUsers: shift.workedUsers,
        currentUsers: shift.Users.map(user => ({
          id: user.id,
          username: user.username,
          fullname: user.fullname
        }))
      }
    });
  } catch (error) {
    console.error('❌ Error in getCurrentShift:', error);
    return res.status(500).json({ message: 'Lỗi server khi lấy thông tin ca hiện tại' });
  }
};


export const getAllShifts = async (req, res) => {
  try {
    const { page = 1, limit = 15, date, status, code } = req.query;
    const offset = (page - 1) * limit;

    // Build where clause
    const where = {};
    if (date) {
      where.date = date;
    }
    if (status) {
      where.status = status;
    }
    if (code) {
      where.code = code;
    }

    // Get total count
    const total = await WorkShift.count({ where });

    // Get paginated shifts with user information
    const shifts = await WorkShift.findAll({
      where,
      attributes: ['id', 'code', 'name', 'status', 'date',],
      include: [
        {
          model: User,
          as: 'Users',
          through: { attributes: [] },
          attributes: ['id', 'username', 'fullname', 'role']
        },
        {
          model: WorkSession,
          as: 'WorkSessions',
          where: { status: 'active' },
          required: false,
          include: [{
            model: User,
            as: 'User',
            attributes: ['id', 'username', 'fullname', 'role']
          }]
        }
      ],
      order: [['date', 'DESC'], ['code', 'ASC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Format the response to include both Users and active WorkSessions
    const formattedShifts = shifts.map(shift => {
      const shiftData = shift.toJSON();
      // Combine Users and active WorkSessions
      const allUsers = new Set();

      // Add users from Users relation
      shift.Users.forEach(user => {
        allUsers.add(JSON.stringify({
          id: user.id,
          username: user.username,
          fullname: user.fullname,
          role: user.role
        }));
      });

      // Add users from active WorkSessions
      shift.WorkSessions.forEach(session => {
        if (session.User) {
          allUsers.add(JSON.stringify({
            id: session.User.id,
            username: session.User.username,
            fullname: session.User.fullname,
            role: session.User.role
          }));
        }
      });

      // Convert back to objects and remove duplicates
      shiftData.users = Array.from(allUsers).map(userStr => JSON.parse(userStr));
      delete shiftData.WorkSessions; // Remove WorkSessions from response

      return shiftData;
    });

    res.json({
      shifts: formattedShifts,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error getting all shifts:', error);
    res.status(500).json({ message: 'Error getting shifts' });
  }
};

export const getTodayAvailableShifts = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = getCurrentDateUTC7();
    const previousDay = new Date(today);
    previousDay.setDate(previousDay.getDate() - 1);
    const previousDayStr = previousDay.toISOString().split('T')[0];

    // Lấy tất cả các ca của ngày hôm nay và hôm trước
    const shifts = await WorkShift.findAll({
      where: {
        date: {
          [Op.in]: [today, previousDayStr]
        }
      },
      include: [{
        model: User,
        as: 'Users',
        attributes: ['id', 'fullname', 'username']
      }],
      order: [['date', 'DESC'], ['code', 'ASC']]
    });

    // Lấy ca hiện tại của user
    const currentUserShift = await WorkSession.findOne({
      where: { userId },
      include: [{
        model: WorkShift,
        as: 'WorkShift',
        where: {
          date: {
            [Op.in]: [today, previousDayStr]
          },
          status: {
            [Op.in]: ['waiting', 'doing', 'handover']
          }
        }
      }]
    });

    ;

    // Tạo danh sách các ca cố định
    // const FIXED_SHIFTS = ['T1', 'T2', 'T3', 'H1', 'H2', 'V1', 'V2'];

    // Tạo kết quả cho cả ngày hôm nay và hôm trước
    const result = [];

    // Thêm các ca của ngày hôm nay
    FIXED_SHIFTS.forEach(code => {
      const existingShift = shifts.find(s => s.code === code && s.date === today);

      if (existingShift) {
        const isCurrentShift = currentUserShift?.WorkShift.id === existingShift.id;
        result.push({
          ...existingShift.toJSON(),
          exists: true,
          available: existingShift.status !== 'done' && !isCurrentShift,
          isCurrentShift,
          status: existingShift.status || 'waiting'
        });
      } else {
        result.push({
          id: null,
          code,
          date: today,
          status: 'not-started',
          exists: false,
          available: true,
          isCurrentShift: false,
          Users: []
        });
      }
    });

    // Thêm các ca của ngày hôm trước
    FIXED_SHIFTS.forEach(code => {
      const existingShift = shifts.find(s => s.code === code && s.date === previousDayStr);

      if (existingShift) {
        const isCurrentShift = currentUserShift?.WorkShift.id === existingShift.id;
        result.push({
          ...existingShift.toJSON(),
          exists: true,
          available: existingShift.status !== 'done' && !isCurrentShift,
          isCurrentShift,
          status: existingShift.status || 'waiting'
        });
      } else {
        result.push({
          id: null,
          code,
          date: previousDayStr,
          status: 'not-started',
          exists: false,
          available: true,
          isCurrentShift: false,
          Users: []
        });
      }
    });

    res.json(result);
  } catch (error) {
    console.error('❌ getTodayAvailableShifts error:', error);
    res.status(500).json({ error: 'Lỗi khi lấy danh sách ca' });
  }
};

// Bàn giao ca
export const handoverShift = async (req, res) => {
  try {
    const { id } = req.params;
    const { receiveUserIds } = req.body;
    const handoverUserId = req.user.id;

    console.log('🔄 Handing over shift:', { workShiftId: id, handoverUserId, receiveUserIds });

    // Kiểm tra ca tồn tại
    const workShift = await WorkShift.findByPk(id);
    if (!workShift) {
      return res.status(404).json({ message: 'Không tìm thấy ca làm việc' });
    }

    // Kiểm tra người dùng có thuộc ca không
    const isUserInShift = await WorkSession.findOne({
      where: {
        userId: handoverUserId,
        workShiftId: id
      }
    });

    if (!isUserInShift) {
      return res.status(403).json({ message: 'Bạn không thuộc ca này' });
    }

    // Kiểm tra form đã tồn tại chưa
    let form = await ShiftCheckForm.findOne({
      where: { workShiftId: id }
    });

    if (!form) {
      // Nếu chưa có form, tạo mới
      form = await ShiftCheckForm.create({
        workShiftId: id,
        status: 'handover',
        formData: JSON.stringify({})  // Tạo form trống
      });
      console.log('✅ Created new form:', form.id);
    }

    // Cập nhật trạng thái form và ca
    await form.update({ status: 'handover' });
    await workShift.update({ status: 'handover' });

    // Lấy thông tin người trong ca hiện tại
    const currentShiftUsers = await WorkSession.findAll({
      where: { workShiftId: id },
      include: [{
        model: User,
        attributes: ['id', 'username', 'fullname']
      }]
    });

    // Lấy thông tin người trong ca tiếp theo sử dụng shiftConfig
    const currentShiftConfig = shiftConfig[workShift.code];
    if (!currentShiftConfig) {
      console.log('❌ Invalid shift code:', workShift.code);
      return res.status(400).json({
        message: 'Mã ca không hợp lệ'
      });
    }

    // Tìm ca tiếp theo trong cùng nhóm
    const groupShifts = Object.entries(shiftConfig)
      .filter(([code, cfg]) => cfg.group === currentShiftConfig.group)
      .sort((a, b) => a[1].index - b[1].index);

    const currentIdx = groupShifts.findIndex(([code]) => code === workShift.code);
    let nextIndex = currentIdx + 1;

    // Nếu là ca cuối cùng trong nhóm, quay về ca đầu tiên
    if (nextIndex >= groupShifts.length) {
      nextIndex = 0;
    }

    const nextShiftCode = groupShifts[nextIndex][0];

    const nextShift = await WorkShift.findOne({
      where: {
        code: nextShiftCode,
        date: workShift.date,
        status: 'waiting'
      },
      include: [{
        model: User,
        as: 'Users',
        through: { attributes: [] },
        attributes: ['id', 'username', 'fullname']
      }]
    });

    // Lấy thông tin form đã cập nhật
    const updatedForm = await ShiftCheckForm.findByPk(form.id, {
      include: [
        {
          model: WorkShift,
          as: 'workShift',
          include: [{
            model: User,
            as: 'Users',
            through: { attributes: [] },
            attributes: ['id', 'username', 'fullname']
          }]
        }
      ]
    });

    res.status(200).json({
      message: 'Bàn giao ca thành công',
      data: {
        ...updatedForm.toJSON(),
        formData: JSON.parse(updatedForm.formData || '{}'),
        handoverUsers: currentShiftUsers.map(us => ({
          id: us.User.id,
          username: us.User.username,
          fullname: us.User.fullname
        })),
        receiveUsers: nextShift ? nextShift.Users.map(user => ({
          id: user.id,
          username: user.username,
          fullname: user.fullname
        })) : []
      }
    });
  } catch (error) {
    console.error('❌ Lỗi bàn giao ca:', error);
    res.status(500).json({
      message: 'Lỗi server khi bàn giao ca',
      error: error.message
    });
  }
};

// Thoát hoặc hủy chọn ca
export const exitShift = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date().toISOString().split('T')[0];

    console.log('🚪 Exiting shift for user:', { userId, today });

    // 1. Tìm session hiện tại
    const currentSession = await WorkSession.findOne({
      where: {
        userId,
        status: 'active'
      },
      include: [{
        model: WorkShift,
        as: 'WorkShift'
      }]
    });

    if (!currentSession) {
      return res.status(400).json({ message: 'Bạn chưa tham gia ca nào hoặc đã kết thúc ca trước đó' });
    }

    // Kiểm tra trạng thái của ca (chỉ cho phép thoát nếu ca đang waiting hoặc doing)
    const ShiftInfo = await WorkShift.findByPk(currentSession.workShiftId, {
      include: [{ model: User, as: 'Users', through: { attributes: [] } }]
    });

    if (!ShiftInfo) {
      return res.status(404).json({ message: 'Không tìm thấy ca hiện tại!' });
    }

    if (!['waiting', 'doing'].includes(ShiftInfo.status)) {
      return res.status(400).json({
        message: `Bạn chỉ có thể thoát ca khi chưa bàn giao`
      });
    }


    // 2. Kiểm tra số lượng người còn lại trong ca
    const remainingSessions = await WorkSession.findAll({
      where: {
        workShiftId: currentSession.workShiftId,
        status: 'active'  // Bỏ điều kiện date vì có thể gây lỗi
      },
      include: [{
        model: User,
        as: 'User',
        attributes: ['id', 'username', 'fullname']
      }]
    });

    console.log('🔍 All active sessions in shift:', remainingSessions.map(s => ({
      userId: s.User.id,
      username: s.User.username,
      status: s.status,
      date: s.date
    })));

    // Lọc ra những người khác ngoài user hiện tại
    const otherUsers = remainingSessions.filter(s => s.User.id !== userId);
    console.log('🔍 Other users in shift:', otherUsers.map(s => ({
      userId: s.User.id,
      username: s.User.username,
      status: s.status,
      date: s.date
    })));

    // 3. Kiểm tra nếu ca hiện tại có bàn giao từ ca trước
    const receivedHandover = await ShiftHandover.findOne({
      where: {
        toShiftId: currentSession.workShiftId,
        status: 'completed'
      },
      include: [{
        model: User,
        as: 'ToUsers',
        through: {
          model: ShiftHandoverUser,
          where: {
            userId: userId,
            role: 'confirmer',  // Kiểm tra role là confirmer
            type: 'to'
          }
        },
        attributes: ['id', 'username', 'fullname']
      }]
    });

    console.log('🔍 Received handover check:', {
      hasHandover: !!receivedHandover,
      handoverId: receivedHandover?.id,
      handoverStatus: receivedHandover?.status,
      toUsers: receivedHandover?.ToUsers?.map(u => u.id)
    });

    // Kiểm tra xem user có phải là người xác nhận trong handover không
    const isUserConfirmer = receivedHandover?.ToUsers?.length > 0;
    console.log('🔍 Is user confirmer:', isUserConfirmer);

    // Nếu là người xác nhận thì không cho phép thoát ca
    if (isUserConfirmer) {
      console.log('❌ Blocking exit: User is confirmer');
      return res.status(403).json({ message: 'Bạn là người xác nhận bàn giao từ ca trước, không thể thoát ca!' });
    }

    // Nếu là người duy nhất trong ca thì không cho phép thoát
    /* if (otherUsers.length === 0) {
      console.log('❌ Blocking exit: User is last person');
      return res.status(403).json({ message: 'Bạn là người duy nhất trong ca, không thể thoát ca!' });
    } */

    console.log('✅ Allowing exit: User is not confirmer and not last person');
    // 4. Xoá session
    await currentSession.destroy();
    console.log('✅ Deleted current work session');

    // --- Bổ sung: Xóa user khỏi ShiftHandoverUser liên quan đến ca này ---
    const relatedHandovers = await ShiftHandover.findAll({
      where: {
        [Op.or]: [
          { fromShiftId: currentSession.workShiftId },
          { toShiftId: currentSession.workShiftId }
        ]
      },
      attributes: ['id']
    });
    const relatedHandoverIds = relatedHandovers.map(h => h.id);
    if (relatedHandoverIds.length > 0) {
      await ShiftHandoverUser.destroy({
        where: {
          userId,
          shiftHandoverId: { [Op.in]: relatedHandoverIds }
        }
      });
      console.log('🗑️ Đã xóa user khỏi ShiftHandoverUser khi thoát ca:', userId);
    }
    // --- End bổ sung ---

    const currentShift = await WorkShift.findByPk(currentSession.workShiftId, {
      include: [{ model: User, as: 'Users', through: { attributes: [] } }]
    });

    if (!currentShift) {
      return res.status(404).json({ message: 'Không tìm thấy ca hiện tại' });
    }

    // 5. Cập nhật lại danh sách workedUsers
    const updatedWorkedUsers = currentShift.Users
      .filter(user => user.id !== userId)
      .map(user => ({
        id: user.id,
        username: user.username,
        fullname: user.fullname
      }));

    await currentShift.update({ workedUsers: updatedWorkedUsers });

    // 6. Cập nhật ShiftHandoverUser nếu cần
    await updateShiftHandoverUsers(currentShift.id, updatedWorkedUsers);

    // 7. Nếu có bàn giao từ ca trước, cập nhật lại danh sách người nhận
    if (receivedHandover) {
      const updatedToUsers = receivedHandover.ToUsers
        .filter(user => user.id !== userId)
        .map(user => ({
          id: user.id,
          username: user.username,
          fullname: user.fullname
        }));

      await receivedHandover.update({
        toUsers: updatedToUsers
      });
      console.log('✅ Updated handover toUsers list');
    }

    // 8. Kiểm tra nếu không còn ai trong ca -> xử lý xoá ca, biên bản nháp và shiftcheckform
    if (otherUsers.length === 0) {
      console.log('ℹ️ No active users left in shift, checking for draft handovers');

      const handovers = await ShiftHandover.findAll({
        where: {
          fromShiftId: currentShift.id,
          status: 'draft'
        },
        include: [
          { model: User, as: 'FromUsers' },
          { model: User, as: 'ToUsers' }
        ]
      });

      for (const handover of handovers) {
        const fromUsers = handover.FromUsers || [];
        const toUsers = handover.ToUsers || [];

        const isUserOnlyPerson =
          fromUsers.length === 1 &&
          fromUsers[0].id === userId &&
          toUsers.length === 0;

        if (isUserOnlyPerson) {
          await handover.destroy();
          console.log('🗑️ Deleted draft handover:', handover.id);
        } else {
          console.log('⚠️ Skipped handover (still has other users):', handover.id);
        }
      }

      // Xóa ShiftCheckForm và ShiftCheckItem liên quan
      const shiftCheckForms = await ShiftCheckForm.findAll({
        where: {
          workShiftId: currentShift.id
        }
      });

      for (const form of shiftCheckForms) {
        await ShiftCheckItem.destroy({
          where: {
            formId: form.id
          }
        });
        await form.destroy();
        console.log('🗑️ Deleted shift check form and items:', form.id);
      }

      await currentShift.update({ status: 'waiting' });
      console.log('✅ Set shift to wating:', currentShift.id);
    }

    // Broadcast update
    sendShiftUpdate(currentShift, 'exit', null, null, req.user.id, req.user.fullname);

    return res.json({
      message: 'Đã thoát ca thành công',
      shift: currentShift
    });
  } catch (error) {
    console.error('❌ Error in exitShift:', error);
    return res.status(500).json({ message: 'Lỗi server khi thoát ca' });
  }
};

// Lấy danh sách người trong ca tiếp theo
export const getNextShiftUsers = async (req, res) => {
  try {
    const { formId } = req.params;
    const userId = req.user.id;
    console.log('🔍 Getting next shift users:', { formId, userId });

    let currentShift;
    if (formId) {
      // 1. Lấy thông tin form và ca hiện tại
      const form = await ShiftCheckForm.findByPk(formId, {
        include: [{
          model: WorkShift,
          as: 'workShift',
          include: [{
            model: User,
            as: 'Users',
            through: { attributes: [] },
            attributes: ['id', 'username', 'fullname']
          }]
        }]
      });

      if (!form) {
        console.log('❌ Form not found:', formId);
        return res.status(404).json({
          message: 'Không tìm thấy biên bản'
        });
      }

      currentShift = form.workShift;
    } else {
      // Lấy ca hiện tại của user
      const currentUserShift = await WorkSession.findOne({
        where: {
          userId
        },
        include: [{
          model: WorkShift,
          where: {
            status: {
              [Op.ne]: 'done'  // không lấy ca đã done
            }
          }
        }]
      });

      if (!currentUserShift) {
        console.log('ℹ️ No active shift found for user');
        return res.status(200).json({
          users: [],
          message: 'Bạn chưa tham gia ca nào hoặc đã kết thúc ca trước đó'
        });
      }

      currentShift = currentUserShift.WorkShift;
    }

    console.log('📥 Current shift:', currentShift.toJSON());

    // 2. Xác định ca tiếp theo sử dụng shiftConfig
    const currentShiftConfig = shiftConfig[currentShift.code];
    if (!currentShiftConfig) {
      console.log('❌ Invalid shift code:', currentShift.code);
      return res.status(400).json({
        message: 'Mã ca không hợp lệ'
      });
    }

    // Tìm ca tiếp theo trong cùng nhóm
    const groupShifts = Object.entries(shiftConfig)
      .filter(([code, cfg]) => cfg.group === currentShiftConfig.group)
      .sort((a, b) => a[1].index - b[1].index);

    const currentIdx = groupShifts.findIndex(([code]) => code === currentShift.code);
    let nextIndex = currentIdx + 1;

    // Nếu là ca cuối cùng trong nhóm, quay về ca đầu tiên
    if (nextIndex >= groupShifts.length) {
      nextIndex = 0;
    }

    const nextShiftCode = groupShifts[nextIndex][0];

    console.log('🔄 Next shift calculation:', {
      currentCode: currentShift.code,
      nextShiftCode,
      group: currentShiftConfig.group,
      currentIndex: currentShiftConfig.index
    });

    // Chỉ tìm ca tiếp theo trong cùng ngày
    const nextShift = await WorkShift.findOne({
      where: {
        code: nextShiftCode,
        date: currentShift.date,  // Luôn lấy cùng ngày
        status: 'waiting'  // Chỉ lấy ca có trạng thái waiting
      },
      include: [{
        model: User,
        as: 'Users',
        through: { attributes: [] },
        attributes: ['id', 'username', 'fullname']
      }]
    });

    if (!nextShift) {
      console.log('❌ Next shift not found:', { nextShiftCode, date: currentShift.date });
      return res.status(200).json({
        users: [],
        message: 'Không tìm thấy ca tiếp theo đang chờ nhận'
      });
    }

    console.log('📥 Next shift found:', {
      shiftCode: nextShift.code,
      date: nextShift.date,
      users: nextShift.Users.map(u => ({ id: u.id, username: u.username }))
    });

    // 4. Trả về danh sách người trong ca tiếp theo
    res.json({
      users: nextShift.Users.map(user => ({
        id: user.id,
        username: user.username,
        fullname: user.fullname
      }))
    });
  } catch (err) {
    console.error('❌ getNextShiftUsers error:', err);
    res.status(500).json({
      message: 'Lỗi server khi lấy danh sách người trong ca tiếp theo',
      error: err.message
    });
  }
};

// Cập nhật trạng thái ca làm việc
export const updateShiftStatus = async (req, res) => {
  try {
    const { shiftId } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['waiting', 'doing', 'handover', 'done'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái không hợp lệ'
      });
    }

    const shift = await WorkShift.findByPk(shiftId);
    if (!shift) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy ca làm việc'
      });
    }

    // Validate status transition
    if (shift.status === 'done' && status !== 'done') {
      return res.status(400).json({
        success: false,
        message: 'Không thể thay đổi trạng thái của ca đã hoàn thành'
      });
    }

    if (shift.status === 'doing' && status === 'done') {
      return res.status(400).json({
        success: false,
        message: 'Ca phải được bàn giao trước khi hoàn thành'
      });
    }

    const oldStatus = shift.status;
    await shift.update({ status });

    // Broadcast update
    sendShiftUpdate(shift, 'status', oldStatus, status, req.user.id, req.user.fullname);

    res.json({
      success: true,
      message: 'Cập nhật trạng thái thành công',
      data: shift
    });
  } catch (err) {
    console.error('❌ Lỗi khi cập nhật trạng thái ca:', err);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: err.message
    });
  }
};

// Lấy ca tiếp theo
export const getNextShift = async (req, res) => {
  try {
    const { shiftId } = req.params;
    console.log('🔍 [getNextShift] Starting with shiftId:', shiftId);

    const currentShift = await WorkShift.findByPk(shiftId);
    if (!currentShift) {
      console.log('❌ [getNextShift] Current shift not found:', shiftId);
      return res.status(404).json({ message: 'Không tìm thấy ca làm việc hiện tại' });
    }

    // Lấy tất cả ca thuộc group hiện tại từ shiftConfig
    const groupShifts = Object.entries(shiftConfig)
      .filter(([code, cfg]) => cfg.group === currentShift.group)
      .sort((a, b) => a[1].index - b[1].index);
    const currentIdx = groupShifts.findIndex(([code]) => code === currentShift.code);
    let nextIndex = currentIdx + 1;
    let nextDate = currentShift.date;
    // Nếu là ca cuối cùng của nhóm, chuyển sang ngày mới và lấy ca đầu nhóm
    if (nextIndex >= groupShifts.length) {
      nextIndex = 0;
      const d = new Date(currentShift.date);
      d.setDate(d.getDate() + 1);
      nextDate = d.toISOString().split('T')[0];
    }
    const [nextShiftCode, nextCfg] = groupShifts[nextIndex];
    const nextShift = {
      code: nextShiftCode,
      date: nextDate,
      group: nextCfg.group,
      index: nextCfg.index
    };
    console.log('✅ [getNextShift] Next shift info:', nextShift);
    return res.json({ nextShift });
  } catch (error) {
    console.error('❌ [getNextShift] Error:', error);
    console.error('❌ [getNextShift] Error stack:', error.stack);
    return res.status(500).json({ message: 'Lỗi server khi lấy thông tin ca tiếp theo' });
  }
};

export const receiveShift = async (req, res) => {
  try {
    const { id: shiftId, formId } = req.params;
    const userId = req.user.id;

    console.log('🔄 Receiving shift:', { shiftId, formId, userId });

    // Kiểm tra form đã tồn tại chưa
    const form = await ShiftCheckForm.findOne({
      where: { id: formId },
      include: [{
        model: WorkShift,
        as: 'workShift',
        include: [{
          model: User,
          as: 'Users',
          through: { attributes: [] },
          attributes: ['id', 'username', 'fullname']
        }]
      }]
    });

    if (!form) {
      console.log('❌ Form not found:', formId);
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy biên bản'
      });
    }

    // Kiểm tra trạng thái form
    if (form.status !== 'handover') {
      console.log('❌ Form is not in handover status:', form.status);
      return res.status(400).json({
        success: false,
        message: 'Biên bản chưa được bàn giao'
      });
    }

    // Kiểm tra người dùng có thuộc ca tiếp theo không sử dụng shiftConfig
    const currentShiftConfig = shiftConfig[form.workShift.code];
    if (!currentShiftConfig) {
      console.log('❌ Invalid shift code:', form.workShift.code);
      return res.status(400).json({
        success: false,
        message: 'Mã ca không hợp lệ'
      });
    }

    // Tìm ca tiếp theo trong cùng nhóm
    const groupShifts = Object.entries(shiftConfig)
      .filter(([code, cfg]) => cfg.group === currentShiftConfig.group)
      .sort((a, b) => a[1].index - b[1].index);

    const currentIdx = groupShifts.findIndex(([code]) => code === form.workShift.code);
    let nextIndex = currentIdx + 1;

    // Nếu là ca cuối cùng trong nhóm, quay về ca đầu tiên
    if (nextIndex >= groupShifts.length) {
      nextIndex = 0;
    }

    const nextShiftCode = groupShifts[nextIndex][0];

    const nextShift = await WorkShift.findOne({
      where: {
        code: nextShiftCode,
        date: form.workShift.date,
        status: 'waiting'
      },
      include: [{
        model: User,
        as: 'Users',
        through: { attributes: [] },
        attributes: ['id', 'username', 'fullname']
      }]
    });

    if (!nextShift) {
      console.log('❌ Next shift not found');
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy ca tiếp theo'
      });
    }

    const isUserInNextShift = nextShift.Users.some(user => user.id === userId);
    if (!isUserInNextShift) {
      console.log('❌ User not in next shift:', userId);
      return res.status(403).json({
        success: false,
        message: 'Bạn không thuộc ca tiếp theo'
      });
    }

    // Cập nhật trạng thái form thành completed
    await form.update({ status: 'completed' });

    // Cập nhật trạng thái ca hiện tại thành done
    await form.workShift.update({ status: 'done' });

    // Cập nhật trạng thái ca tiếp theo thành doing
    await nextShift.update({ status: 'doing' });

    console.log('✅ Successfully received shift');
    res.json({
      success: true,
      message: 'Nhận ca thành công',
      data: {
        form,
        nextShift
      }
    });
  } catch (error) {
    console.error('❌ Error in receiveShift:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi nhận ca',
      error: error.message
    });
  }
};

// Lấy thông tin chi tiết form bàn giao
export const getHandoverDetails = async (req, res) => {
  try {
    const { handoverId } = req.params;

    // Lấy thông tin handover
    const handover = await ShiftHandover.findByPk(handoverId, {
      include: [
        {
          model: WorkShift,
          as: 'FromShift',
          attributes: ['id', 'code', 'name', 'date', 'status']
        },
        {
          model: WorkShift,
          as: 'ToShift',
          attributes: ['id', 'code', 'name', 'date', 'status']
        },
        {
          model: User,
          as: 'FromUser',
          attributes: ['id', 'username', 'fullname', 'role']
        },
        {
          model: User,
          as: 'ToUser',
          attributes: ['id', 'username', 'fullname', 'role']
        },
        {
          model: ShiftHandoverDevice,
          as: 'devices',
          attributes: [
            'id', 'deviceId', 'subDeviceName', 'serialNumber',
            'errorCode', 'errorCause', 'solution', 'status', 'resolveStatus',
            'deviceNameSnapshot', 'deviceCategorySnapshot',
            'devicePositionSnapshot', 'deviceSerialNumberSnapshot'
          ]
        },
        {
          model: ShiftHandoverTask,
          as: 'Tasks',
          attributes: [
            'id', 'location', 'taskId', 'fullName', 'taskTitle', 'taskDescription',
            'status', 'attachments', 'checkInTime', 'checkOutTime',
            'signature', 'completedAt', 'cancelReason', 'userId',
            'createdBy', 'completedBy', 'workSessionId', 'workShiftId',
            'index'
          ],
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'fullname']
            },
            {
              model: User,
              as: 'creator',
              attributes: ['id', 'username', 'fullname']
            },
            {
              model: User,
              as: 'completer',
              attributes: ['id', 'username', 'fullname']
            }
          ]
        }
      ]
    });

    if (!handover) {
      return res.status(404).json({ message: 'Không tìm thấy bản bàn giao' });
    }

    // Lấy thông tin ShiftHandoverUser
    const handoverUsers = await ShiftHandoverUser.findAll({
      where: {
        shiftHandoverId: handoverId
      },
      include: [{
        model: User,
        as: 'User',  // Thêm alias 'User' cho quan hệ
        attributes: ['id', 'username', 'fullname', 'role']
      }]
    });

    let fromUsers = [];
    let toUsers = [];

    if (['draft', 'pending'].includes(handover.status)) {
      // Với biên bản draft hoặc pending, lấy từ WorkSession
      const workSessions = await WorkSession.findAll({
        where: {
          workShiftId: handover.fromShiftId,
          status: 'active'
        },
        include: [{
          model: User,
          as: 'User',
          attributes: ['id', 'username', 'fullname', 'role']
        }]
      });

      fromUsers = workSessions.map(session => ({
        ...session.User.toJSON(),
        ShiftHandoverUser: {
          role: handoverUsers.find(hu =>
            hu.userId === session.User.id && hu.type === 'from'
          )?.role || 'handover'
        }
      }));
    } else {
      // Với biên bản completed hoặc rejected, lấy từ ShiftHandoverUsers
      fromUsers = handoverUsers
        .filter(hu => hu.type === 'from')
        .map(hu => ({
          ...hu.User.toJSON(),
          ShiftHandoverUser: {
            role: hu.role || 'handover'
          }
        }));
    }

    // Lấy danh sách người nhận từ WorkSession nếu đang draft/pending
    if (['draft', 'pending'].includes(handover.status)) {
      const toWorkSessions = await WorkSession.findAll({
        where: {
          workShiftId: handover.toShiftId,
          status: 'active'
        },
        include: [{
          model: User,
          as: 'User',
          attributes: ['id', 'username', 'fullname', 'role']
        }]
      });

      toUsers = toWorkSessions.map(session => ({
        ...session.User.toJSON(),
        ShiftHandoverUser: {
          role: handoverUsers.find(hu =>
            hu.userId === session.User.id && hu.type === 'to'
          )?.role || 'handover'
        }
      }));
    } else {
      // Với biên bản completed/rejected, lấy từ ShiftHandoverUsers
      toUsers = handoverUsers
        .filter(hu => hu.type === 'to')
        .map(hu => ({
          ...hu.User.toJSON(),
          ShiftHandoverUser: {
            role: hu.role || 'handover'
          }
        }));
    }

    // Format kết quả
    const result = {
      ...handover.toJSON(),
      FromUsers: fromUsers,
      ToUsers: toUsers
    };

    console.log('📝 Handover details:', {
      id: result.id,
      fromShift: result.FromShift.code,
      toShift: result.ToShift.code,
      fromUsers: fromUsers.length,
      toUsers: toUsers.length,
      status: result.status,
      tasks: result.Tasks.length
    });

    res.json(result);
  } catch (error) {
    console.error('Error getting handover details:', error);
    res.status(500).json({ message: 'Lỗi khi lấy thông tin bản bàn giao' });
  }
};



export const confirmHandover = async (req, res) => {
  try {
    const handoverId = req.params.handoverId;
    const { notes } = req.body;
    const currentUser = req.user;

    console.log('🔄 Confirming handover:', { handoverId, userId: currentUser.id });

    // Tìm bản bàn giao và liên kết
    const handover = await db.ShiftHandover.findOne({
      where: {
        id: handoverId,
        status: 'pending'
      },
      include: [
        {
          model: db.WorkShift,
          as: 'ToShift',
          include: [{
            model: db.User,
            as: 'Users',
            attributes: ['id']
          }]
        },
        {
          model: db.WorkShift,
          as: 'FromShift'
        }
      ]
    });

    if (!handover) {
      return res.status(404).json({ message: 'Không tìm thấy bản bàn giao hoặc không ở trạng thái chờ xác nhận' });
    }

    const toShift = handover.ToShift;

    // Kiểm tra người dùng có thuộc ca nhận không
    const isUserInToShift = toShift?.Users?.some(user => user.id === currentUser.id);
    if (!isUserInToShift) {
      return res.status(403).json({ message: 'Bạn không thuộc ca nhận' });
    }

    // ✅ Bắt đầu transaction
    await db.sequelize.transaction(async (t) => {
      // 1. Lấy danh sách người làm việc từ WorkSession
      const workedSessions = await db.WorkSession.findAll({
        where: {
          workShiftId: handover.fromShiftId,
          status: 'active'
        },
        include: [{
          model: db.User,
          as: 'User',  // Thêm alias 'User'
          attributes: ['id', 'username', 'fullname', 'role']
        }],
        transaction: t
      });

      const workedUsers = workedSessions.map(session => ({
        id: session.User.id,
        username: session.User.username,
        fullname: session.User.fullname,
        role: session.User.role
      }));

      console.log('👥 Worked users to be saved:', workedUsers);

      // 2. Thêm người làm việc vào ShiftHandoverUser trước
      await Promise.all(workedUsers.map(user =>
        db.ShiftHandoverUser.findOrCreate({
          where: {
            shiftHandoverId: handover.id,
            userId: user.id,
            type: 'from'
          },
          defaults: {
            role: 'handover'
          },
          transaction: t
        })
      ));

      // 3. Thêm người xác nhận vào ShiftHandoverUser
      await db.ShiftHandoverUser.update(
        { role: 'confirmer' },  // Cập nhật role thành confirmer
        {
          where: {
            shiftHandoverId: handover.id,
            userId: currentUser.id,
            type: 'to'
          },
          transaction: t
        }
      );

      // 4. Thêm các user còn lại trong ca nhận với role là receiver
      const otherUsers = toShift.Users
        .filter(user => user.id !== currentUser.id)
        .map(user => user.id);

      if (otherUsers.length > 0) {
        const existing = await db.ShiftHandoverUser.findAll({
          where: {
            shiftHandoverId: handover.id,
            userId: otherUsers,
            type: 'to'
          },
          transaction: t
        });

        const existingIds = existing.map(e => e.userId);
        const toAdd = otherUsers.filter(id => !existingIds.includes(id));

        if (toAdd.length > 0) {
          await Promise.all(toAdd.map(uid =>
            db.ShiftHandoverUser.create({
              shiftHandoverId: handover.id,
              userId: uid,
              role: 'receiver',  // Các user khác sẽ là receiver
              type: 'to'
            }, { transaction: t })
          ));
        }
      }

      // 5. Cập nhật workedUsers vào FromShift
      await handover.FromShift.update({
        status: 'done',
        workedUsers: workedUsers
      }, { transaction: t });

      // 6. Cập nhật trạng thái bàn giao
      await handover.update({
        toUserId: currentUser.id,
        status: 'completed',
        confirmedAt: new Date(),
        notes: notes || ''
      }, { transaction: t });

      // 7. Cập nhật thời gian ca ca nhận
      await toShift.update({
        confirmedAt: new Date()
      }, { transaction: t });

      // 8. Cập nhật các form liên quan khác
      await db.ShiftHandover.update(
        { status: 'completed' },
        {
          where: {
            status: 'pending',
            toShiftId: handover.fromShiftId
          },
          transaction: t
        }
      );

      // 9. Cập nhật trạng thái WorkSession của ca bàn giao thành 'done' thay vì xóa
      await db.WorkSession.update(
        { status: 'completed' },
        {
          where: { workShiftId: handover.fromShiftId, status: 'active' },
          transaction: t
        }
      );
    });

    // ✅ Lấy thông tin đầy đủ để trả về
    const fullHandover = await db.ShiftHandover.findByPk(handoverId, {
      include: [
        {
          model: db.WorkShift,
          as: 'FromShift',
          attributes: ['id', 'code', 'date', 'status']
        },
        {
          model: db.WorkShift,
          as: 'ToShift',
          attributes: ['id', 'code', 'date', 'status']
        },
        {
          model: db.User,
          as: 'FromUsers',
          through: { attributes: ['role'] },
          attributes: ['id', 'username', 'fullname', 'role']
        },
        {
          model: db.User,
          as: 'ToUsers',
          through: { attributes: ['role'] },
          attributes: ['id', 'username', 'fullname', 'role']
        }
      ]
    });


    // Broadcast update
    sendShiftUpdate(fullHandover.FromShift, 'handover', 'doing', 'handover', req.user.id, req.user.fullname);

    res.json({
      message: 'Xác nhận bàn giao thành công',
      handover: fullHandover
    });
  } catch (error) {
    console.error('❌ Error in confirmHandover:', error);
    res.status(500).json({
      message: 'Lỗi khi xác nhận bàn giao',
      error: error.message
    });
  }
};


// Từ chối bàn giao ca
export const rejectHandover = async (req, res) => {
  try {
    const { handoverId } = req.params;
    const { notes } = req.body;
    const userId = req.user.id;

    console.log('❌ Rejecting handover:', { handoverId, userId });

    // Tìm form bàn giao
    const handover = await ShiftHandover.findByPk(handoverId, {
      include: [{
        model: WorkShift,
        as: 'FromShift',
        attributes: ['id', 'code', 'name', 'date', 'status']
      }, {
        model: WorkShift,
        as: 'ToShift',
        attributes: ['id', 'code', 'name', 'date', 'status']
      }]
    });

    if (!handover) {
      return res.status(404).json({ message: 'Không tìm thấy form bàn giao' });
    }

    // Kiểm tra quyền từ chối
    if (handover.status !== 'pending') {
      return res.status(400).json({ message: 'Chỉ có thể từ chối form bàn giao ở trạng thái chờ xác nhận' });
    }

    // Kiểm tra người từ chối có thuộc ca tiếp theo không
    const nextWorkSession = await WorkSession.findOne({
      where: {
        workShiftId: handover.toShiftId,
        userId: userId,
        status: 'active'
      }
    });

    if (!nextWorkSession) {
      return res.status(403).json({ message: 'Bạn không thuộc ca tiếp theo nên không thể từ chối bàn giao' });
    }

    // Cập nhật form bàn giao
    handover.toUserId = userId;
    handover.status = 'draft';
    handover.FromShift.status = 'doing'
    handover.rejectNote = notes;
    handover.rejectedAt = new Date();
    await Promise.all([
      handover.save(),
      handover.FromShift.save()
    ]);

    console.log('✅ Updated handover:', handover.toJSON());

    // Broadcast update
    sendShiftUpdate(handover.FromShift, 'handover', 'doing', 'handover', req.user.id, req.user.fullname);

    return res.json({
      message: 'Từ chối bàn giao thành công',
      handover
    });
  } catch (error) {
    console.error('❌ Error in rejectHandover:', error);
    return res.status(500).json({ message: 'Lỗi server khi từ chối bàn giao' });
  }
};

// Lấy danh sách form bàn giao theo trạng thái
export const getHandoversByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const { page = 1, limit = 15, dateRange, toShiftId } = req.query;
    const offset = (page - 1) * limit;

    // Build where condition
    const whereCondition = status === 'all' ? {} : { status };

    // Add date range filter if provided
    if (dateRange) {
      const [startDate, endDate] = dateRange.split(',');
      whereCondition.date = {
        [Op.between]: [startDate, endDate]
      };
    }

    // Add toShiftId filter if provided
    if (toShiftId) {
      whereCondition.toShiftId = toShiftId;
    }

    // Get total count
    const total = await ShiftHandover.count({ where: whereCondition });

    // Get paginated handovers
    const handovers = await ShiftHandover.findAll({
      where: whereCondition,
      attributes: ['id', 'status', 'date', 'fromShiftId', 'toShiftId'],
      include: [
        {
          model: WorkShift,
          as: 'FromShift',
          attributes: ['id', 'code', 'name', 'date', 'status']
        },
        {
          model: WorkShift,
          as: 'ToShift',
          attributes: ['id', 'code', 'name', 'date', 'status']
        },
        {
          model: User,
          as: 'FromUsers',
          through: { attributes: ['role'] },
          attributes: ['id', 'username', 'fullname', 'role']
        },
        {
          model: User,
          as: 'ToUsers',
          through: { attributes: ['role'] },
          attributes: ['id', 'username', 'fullname', 'role']
        }
      ],
      order: [['date', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Format lại workedUsers và FromUsers
    const formattedHandovers = await Promise.all(handovers.map(async handover => {
      const handoverData = handover.toJSON();

      // Format lại FromUsers cho các trạng thái chưa completed
      if (handoverData.status !== 'completed' && handoverData.fromShiftId) {
        const workSessions = await WorkSession.findAll({
          where: {
            workShiftId: handoverData.fromShiftId,
            status: 'active'
          },
          include: [{
            model: User,
            as: 'User',
            attributes: ['id', 'username', 'fullname', 'role']
          }]
        });
        handoverData.FromUsers = workSessions.map(session => ({
          ...session.User.toJSON(),
          ShiftHandoverUser: {
            role: handoverData.FromUsers.find(u => u.id === session.User.id)?.ShiftHandoverUser?.role || 'handover'
          }
        }));
      }

      // Giữ nguyên ToUsers như cũ
      handoverData.ToUsers = handoverData.ToUsers.map(user => ({
        ...user,
        ShiftHandoverUser: {
          role: user.ShiftHandoverUser?.role || 'handover'
        }
      }));

      return handoverData;
    }));

    res.json({
      handovers: formattedHandovers,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('❌ Error getting handovers:', error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách bàn giao' });
  }
};

// Lấy lịch sử bàn giao của người dùng
export const getHandoverHistory = async (req, res) => {
  try {
    const currentUser = req.user;

    // Lấy lịch sử bàn giao của người dùng
    const handovers = await ShiftHandover.findAll({
      where: {
        [Op.or]: [
          { fromUserId: currentUser.id },
          { toUserId: currentUser.id }
        ]
      },
      include: [
        {
          model: WorkShift,
          as: 'FromShift',
          attributes: ['id', 'code', 'name', 'date', 'status']
        },
        {
          model: WorkShift,
          as: 'ToShift',
          attributes: ['id', 'code', 'name', 'date', 'status']
        },
        {
          model: User,
          as: 'FromUser',
          attributes: ['id', 'username', 'fullname', 'role']
        },
        {
          model: User,
          as: 'ToUser',
          attributes: ['id', 'username', 'fullname', 'role']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(handovers);
  } catch (error) {
    console.error('Error getting handover history:', error);
    res.status(500).json({ message: 'Lỗi khi lấy lịch sử bàn giao' });
  }
};



// Thống kê bàn giao
export const getHandoverStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Xây dựng điều kiện tìm kiếm
    const where = {};
    if (startDate && endDate) {
      where.createdAt = {
        [Op.between]: [
          new Date(startDate + 'T00:00:00.000Z'),
          new Date(endDate + 'T23:59:59.999Z')
        ]
      };
    }

    // Lấy thống kê theo trạng thái
    const stats = await ShiftHandover.findAll({
      where,
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    // Chuyển đổi kết quả thành object
    const result = stats.reduce((acc, stat) => {
      acc[stat.status] = parseInt(stat.getDataValue('count'));
      return acc;
    }, {
      draft: 0,
      pending: 0,
      confirmed: 0,
      rejected: 0
    });

    // Thêm tổng số
    result.total = Object.values(result).reduce((sum, count) => sum + count, 0);

    res.json(result);
  } catch (error) {
    console.error('Error getting handover stats:', error);
    res.status(500).json({ message: 'Lỗi khi lấy thống kê bàn giao' });
  }
};

// Lấy form bàn giao theo ca
export const getHandoversByShift = async (req, res) => {
  try {
    const { shiftId } = req.params;
    const handovers = await ShiftHandover.findAll({
      where: {
        [Op.or]: [
          { fromShiftId: shiftId },
          { toShiftId: shiftId }
        ]
      },
      include: [
        {
          model: WorkShift,
          as: 'FromShift',
          attributes: ['id', 'code', 'name', 'date', 'status']
        },
        {
          model: WorkShift,
          as: 'ToShift',
          attributes: ['id', 'code', 'name', 'date', 'status']
        },
        {
          model: User,
          as: 'FromUser',
          attributes: ['id', 'username', 'fullname', 'role']
        },
        {
          model: User,
          as: 'ToUser',
          attributes: ['id', 'username', 'fullname', 'role']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(handovers);
  } catch (error) {
    console.error('Error getting handovers by shift:', error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách biên bản bàn giao' });
  }
};

// Lấy form bàn giao theo ngày
export const getHandoversByDate = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Vui lòng cung cấp ngày' });
    }

    // Lấy danh sách bàn giao theo ngày
    const handovers = await ShiftHandover.findAll({
      include: [
        {
          model: WorkShift,
          as: 'FromShift',
          where: { date },
          attributes: ['id', 'code', 'name', 'date', 'status']
        },
        {
          model: WorkShift,
          as: 'ToShift',
          attributes: ['id', 'code', 'name', 'date', 'status']
        },
        {
          model: User,
          as: 'FromUser',
          attributes: ['id', 'username', 'fullname', 'role']
        },
        {
          model: User,
          as: 'ToUser',
          attributes: ['id', 'username', 'fullname', 'role']
        },
        {
          model: User,
          as: 'FromUsers',
          through: { attributes: ['role'] },
          attributes: ['id', 'username', 'fullname']
        },
        {
          model: User,
          as: 'ToUsers',
          through: { attributes: ['role'] },
          attributes: ['id', 'username', 'fullname']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(handovers);
  } catch (error) {
    console.error('Error getting handovers by date:', error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách bàn giao' });
  }
};

// Lấy danh sách phiên làm việc
export const getWorkSessions = async (req, res) => {
  try {
    const { status, date } = req.query;
    console.log('🔍 Getting work sessions:', { status, date });

    const where = {};
    if (status) where.status = status;
    if (date) where.date = date;

    console.log('📝 Query conditions:', where);

    const workSessions = await WorkSession.findAll({
      where,
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['id', 'username', 'fullname']
        },
        {
          model: WorkShift,
          as: 'WorkShift',
          attributes: ['id', 'code', 'name', 'date', 'status']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    console.log('✅ Retrieved work sessions:', {
      count: workSessions.length,
      sessions: workSessions.map(ws => ({
        id: ws.id,
        status: ws.status,
        user: ws.User?.username,
        shift: ws.WorkShift?.code
      }))
    });

    return res.json(workSessions);
  } catch (error) {
    console.error('❌ Error in getWorkSessions:', error);
    console.error('❌ Error stack:', error.stack);
    return res.status(500).json({
      message: 'Lỗi server khi lấy danh sách phiên làm việc',
      error: error.message
    });
  }
};

// 👉 Hàm tìm hoặc tạo ca kế tiếp dựa trên group + index + ngày
const findNextShift = async (currentShift) => {
  // Lấy tất cả ca thuộc group hiện tại từ shiftConfig
  const groupShifts = Object.entries(shiftConfig)
    .filter(([code, cfg]) => cfg.group === currentShift.group)
    .sort((a, b) => a[1].index - b[1].index);
  const currentIdx = groupShifts.findIndex(([code]) => code === currentShift.code);
  let nextIndex = currentIdx + 1;
  let nextDate = currentShift.date;
  // Nếu là ca cuối cùng của nhóm, chuyển sang ngày mới và lấy ca đầu nhóm
  if (nextIndex >= groupShifts.length) {
    nextIndex = 0;
    const d = new Date(currentShift.date);
    d.setDate(d.getDate() + 1);
    nextDate = d.toISOString().split('T')[0];
  }
  const [nextShiftCode, nextCfg] = groupShifts[nextIndex];
  // Tìm ca kế tiếp
  let nextShift = await WorkShift.findOne({
    where: {
      code: nextShiftCode,
      date: nextDate
    }
  });
  // Nếu không tìm thấy, tạo ca mới
  if (!nextShift) {
    const config = shiftConfig[nextShiftCode];
    if (!config) {
      throw new Error('Mã ca không hợp lệ');
    }
    // Lấy userId từ shift hiện tại (người tạo ca tiếp theo là người tạo ca hiện tại)
    const createdBy = currentShift.createdBy || 1;
    nextShift = await WorkShift.create({
      code: nextShiftCode,
      name: config.name,
      date: nextDate,
      startTime: config.startTime,
      endTime: config.endTime,
      status: 'waiting',
      group: config.group,
      index: config.index,
      createdBy
    });
    console.log('✅ Created new shift:', nextShift.toJSON());
  }
  return nextShift;
};

// ✅ [POST] Tạo bản nháp bàn giao ca
export const createDraftHandover = async (req, res) => {
  try {
    const { shiftId, content, handoverUserId, devices } = req.body;
    const userId = req.user.id;

    console.log('📝 Bắt đầu tạo bản nháp bàn giao:', {
      shiftId,
      userId,
      handoverUserId,
      contentLength: content?.length,
      devicesCount: devices?.length
    });

    // Bắt đầu transaction
    const transaction = await db.sequelize.transaction();
    console.log('🔄 Đã bắt đầu transaction');

    try {
      // 1. Kiểm tra ca hiện tại và lấy danh sách người trong ca
      console.log('🔍 Đang kiểm tra thông tin ca:', shiftId);
      const shift = await WorkShift.findByPk(shiftId, {
        include: [{
          model: User,
          as: 'Users',
          through: { attributes: [] },
          attributes: ['id', 'username', 'fullname']
        }],
        transaction
      });

      if (!shift) {
        console.log('❌ Không tìm thấy ca:', shiftId);
        await transaction.rollback();
        return res.status(404).json({ message: 'Không tìm thấy ca làm việc' });
      }
      console.log('✅ Đã tìm thấy ca:', shift.code);

      // Kiểm tra xem ca đã có biên bản bàn giao nào chưa
      console.log('🔍 Kiểm tra biên bản bàn giao tồn tại');
      const existingHandover = await ShiftHandover.findOne({
        where: {
          fromShiftId: shiftId,
          date: shift.date
        },
        transaction
      });

      if (existingHandover) {
        console.log('❌ Đã tồn tại biên bản:', existingHandover.id);
        await transaction.rollback();
        return res.status(400).json({
          message: 'Ca này đã có biên bản bàn giao',
          existingHandover: {
            id: existingHandover.id,
            status: existingHandover.status
          }
        });
      }

      // 2. Kiểm tra người dùng thuộc ca (chỉ WorkSession)
      const activeWorkSession = await WorkSession.findOne({
        where: {
          userId: userId,
          workShiftId: shiftId,
          status: 'active'
        },
        transaction
      });
      if (!activeWorkSession) {
        await transaction.rollback();
        return res.status(403).json({ message: 'Bạn không thuộc ca này' });
      }
      console.log('✅ Người dùng có quyền tạo bản bàn giao');

      // 3. Tìm ca kế tiếp
      console.log('🔍 Tìm ca kế tiếp');
      const nextShift = await findNextShift(shift);
      if (!nextShift) {
        console.log('❌ Không tìm thấy ca kế tiếp');
        await transaction.rollback();
        return res.status(400).json({ message: 'Chưa có ca kế tiếp để bàn giao' });
      }
      console.log('✅ Đã tìm thấy ca kế tiếp:', nextShift.code);

      // 4. Cập nhật workedUsers của ca hiện tại
      console.log('📝 Cập nhật danh sách người làm việc');
      const currentUsers = shift.Users.map(user => ({
        id: user.id,
        username: user.username,
        fullname: user.fullname
      }));

      await shift.update({
        workedUsers: currentUsers,
      }, { transaction });
      console.log('✅ Đã cập nhật danh sách người làm việc:', currentUsers.length, 'người');

      // 5. Kiểm tra người đại diện bàn giao
      const handoverRepId = handoverUserId || userId;
      console.log('🔍 Kiểm tra người đại diện bàn giao:', handoverRepId);
      if (!currentUsers.some(user => user.id === handoverRepId)) {
        console.log('❌ Người đại diện không hợp lệ');
        await transaction.rollback();
        return res.status(400).json({
          message: 'Người đại diện bàn giao không thuộc ca hiện tại'
        });
      }
      console.log('✅ Người đại diện hợp lệ');

      // 6. Tạo bản nháp bàn giao
      console.log('📝 Tạo bản nháp bàn giao');
      const draftHandover = await ShiftHandover.create({
        fromShiftId: shiftId,
        toShiftId: nextShift.id,
        fromUserId: handoverRepId,
        content,
        handoverForm: req.body.handoverForm,
        date: shift.date,
        status: 'draft'
      }, { transaction });
      console.log('✅ Đã tạo bản nháp:', draftHandover.id);

      // 7. Thêm người đại diện bàn giao vào ShiftHandoverUser
      console.log('📝 Thêm người đại diện vào ShiftHandoverUser');
      await ShiftHandoverUser.create({
        shiftHandoverId: draftHandover.id,
        userId: handoverRepId,
        type: 'from',
        role: 'handover'
      }, { transaction });
      console.log('✅ Đã thêm người đại diện');

      // 8. Thêm những người còn lại trong ca
      console.log('📝 Thêm những người còn lại trong ca');
      const otherUsers = currentUsers
        .filter(user => user.id !== handoverRepId)
        .map(user => user.id);

      if (otherUsers.length > 0) {
        console.log('➕ Thêm', otherUsers.length, 'người khác');
        await Promise.all(otherUsers.map(userId =>
          ShiftHandoverUser.create({
            shiftHandoverId: draftHandover.id,
            userId: userId,
            type: 'from'
          }, { transaction })
        ));
      }

      // THÊM ĐOẠN CODE NÀY: Lấy danh sách người trong ca tiếp theo
      const nextShiftUsers = await WorkSession.findAll({
        where: {
          workShiftId: nextShift.id,
          status: 'active'
        },
        include: [{
          model: User,
          as: 'User',
          attributes: ['id', 'username', 'fullname']
        }]
      });

      // THÊM ĐOẠN CODE NÀY: Thêm người nhận từ ca tiếp theo
      if (nextShiftUsers.length > 0) {
        await Promise.all(nextShiftUsers.map(session =>
          ShiftHandoverUser.create({
            shiftHandoverId: draftHandover.id,
            userId: session.User.id,
            type: 'to',
            role: 'receiver'
          }, { transaction })
        ));
      }

      // 9. Lưu danh sách thiết bị
      console.log('📝 Bắt đầu lưu danh sách thiết bị:', devices?.length || 0, 'thiết bị');
      if (devices && Array.isArray(devices)) {
        await Promise.all(devices.map(async (device, index) => {
          console.log(`➕ Lưu thiết bị ${index + 1}:`, {
            deviceId: device.deviceId,
            status: device.status
          });
          await ShiftHandoverDevice.create({
            handoverId: draftHandover.id,
            deviceId: device.deviceId,
            status: device.status,
            subDeviceName: device.subDeviceName,
            serialNumber: device.serialNumber,
            errorCode: device.errorCode,
            errorCause: device.errorCause,
            solution: device.solution,
            resolveStatus: device.status === 'Có lỗi' ? (device.resolveStatus || 'Chưa xử lý') : '',
            index: index + 1
          }, { transaction });
        }));
      }
      console.log('✅ Đã lưu xong danh sách thiết bị');

      // 9.1 Lưu danh sách công việc
      console.log('📝 Bắt đầu lưu danh sách công việc:', req.body.handoverForm?.tasks?.length || 0, 'công việc');
      if (req.body.handoverForm?.tasks && Array.isArray(req.body.handoverForm.tasks)) {
        await Promise.all(req.body.handoverForm.tasks.map(async (task, index) => {
          console.log(`➕ Lưu công việc ${index + 1}:`, {
            taskId: task.id,
            location: task.location
          });

          // Lấy danh sách nhân sự từ TaskUsers
          let fullName = '';
          try {
            console.log(`🔍 Lấy danh sách nhân sự cho task ${task.id}`);

            const taskUsers = await TaskUsers.findAll({
              where: { taskId: task.id },
              include: [
                {
                  model: User,
                  as: 'user',
                  attributes: ['fullname', 'username']
                },
                {
                  model: Partners,
                  as: 'partner',
                  attributes: ['fullname']
                }
              ],
              transaction
            });

            console.log(`📋 TaskUsers cho task ${task.id}:`, taskUsers.length, 'records');
            console.log(`📋 Chi tiết TaskUsers:`, JSON.stringify(taskUsers, null, 2));

            // Tạo chuỗi fullName từ danh sách nhân sự
            const staffNames = taskUsers.map(tu => {
              console.log(`👤 Processing TaskUser:`, {
                userId: tu.userId,
                partnerId: tu.partnerId,
                user: tu.user,
                partner: tu.partner
              });

              if (tu.user) {
                const name = tu.user.fullname || tu.user.username;
                console.log(`👤 User name: ${name}`);
                return name;
              } else if (tu.partner) {
                const name = tu.partner.fullName;
                console.log(`👤 Partner name: ${name}`);
                return name;
              }
              console.log(`❌ No user or partner found for TaskUser`);
              return null;
            }).filter(name => name);

            console.log(`📋 Staff names:`, staffNames);
            fullName = staffNames.join(', ');
            console.log(`📋 Final fullName: "${fullName}"`);

          } catch (error) {
            console.error(`❌ Lỗi khi lấy danh sách nhân sự cho task ${task.id}:`, error);
            // Fallback: sử dụng task.fullName nếu có
            fullName = task.fullName || 'Không xác định';
          }

          // Nếu vẫn không có fullName, tạo một giá trị mặc định
          if (!fullName || fullName.trim() === '') {
            fullName = `Công việc ${task.id}`;
            console.log(`⚠️ Sử dụng fullName mặc định: "${fullName}"`);
          }

          await ShiftHandoverTask.create({
            handoverId: draftHandover.id,
            taskId: task.id,
            location: task.location,
            fullName: fullName,
            taskTitle: task.taskTitle,
            taskDescription: task.taskDescription,
            status: task.status,
            checkInTime: task.checkInTime,
            checkOutTime: task.checkOutTime,
            signature: task.signature,
            completedAt: task.completedAt,
            cancelReason: task.cancelReason,
            userId: task.userId,
            createdBy: task.createdBy,
            completedBy: task.completedBy,
            workSessionId: task.workSessionId,
            workShiftId: task.workShiftId,
            index: index + 1
          }, { transaction });
        }));
      }
      console.log('✅ Đã lưu xong danh sách công việc');

      // 10. Lưu danh sách lỗi thiết bị
      console.log('📝 Bắt đầu lưu danh sách lỗi thiết bị:', req.body.deviceErrors?.length || 0, 'lỗi');
      if (req.body.deviceErrors && req.body.deviceErrors.length > 0) {
        let errorData = [];
        for (const error of req.body.deviceErrors) {
          if (error.id && error.resolveStatus === 'Đã xử lý') {
            // Nếu có id và đã xử lý, update DeviceError sang Đã xử lý
            await DeviceError.update({
              resolveStatus: 'Đã xử lý',
              resolvedAt: error.resolvedAt || null,
              resolvedBy: error.resolvedBy || '',
              resolveNote: error.resolveNote || '',
              updatedAt: new Date()
            }, {
              where: { id: error.id },
              transaction
            });
            continue;
          }

          if (error.status === 'Có lỗi' && error.errorCode && error.errorCause) {
            if (error.id) {
              // Nếu có id, update lỗi cũ
              await DeviceError.update({
                subDeviceName: error.subDeviceName,
                serialNumber: error.serialNumber,
                errorCode: error.errorCode,
                errorCause: error.errorCause,
                solution: error.solution,
                resolveStatus: error.resolveStatus || 'Chưa xử lý',
                resolvedAt: error.resolvedAt || null,
                resolveNote: error.resolveNote || '',
                resolvedBy: error.resolvedBy || '',
                createdBy: userId,
                updatedAt: new Date()
              }, {
                where: { id: error.id },
                transaction
              });
            } else {
              // Kiểm tra trùng lặp chỉ dựa vào deviceId và subDeviceName
              const existed = await DeviceError.findOne({
                where: {
                  deviceId: error.deviceId,
                  subDeviceName: error.subDeviceName,
                  resolveStatus: 'Chưa xử lý'
                },
                transaction
              });

              if (existed) {
                // Update bản ghi cũ
                await existed.update({
                  serialNumber: error.serialNumber,
                  errorCode: error.errorCode,
                  errorCause: error.errorCause,
                  solution: error.solution,
                  resolveStatus: error.resolveStatus || 'Chưa xử lý',
                  resolvedAt: error.resolvedAt || null,
                  resolveNote: error.resolveNote || '',
                  resolvedBy: error.resolvedBy || '',
                  createdBy: userId,
                  updatedAt: new Date()
                }, { transaction });
              } else {
                // Tạo mới nếu chưa có
                errorData.push({
                  deviceId: error.deviceId,
                  subDeviceName: error.subDeviceName || '',
                  serialNumber: error.serialNumber || '',
                  errorCode: error.errorCode,
                  errorCause: error.errorCause,
                  solution: error.solution || '',
                  resolveStatus: error.resolveStatus || 'Chưa xử lý',
                  resolvedAt: error.resolvedAt || null,
                  resolveNote: error.resolveNote || '',
                  resolvedBy: error.resolvedBy || '',
                  createdBy: userId,
                  createdAt: new Date(),
                  updatedAt: new Date()
                });
              }
            }
          }
        }

        if (errorData.length > 0) {
          await DeviceError.bulkCreate(errorData, {
            transaction,
            returning: false
          });
        }
      }
      console.log('✅ Đã lưu xong danh sách lỗi thiết bị');

      // Commit transaction
      await transaction.commit();
      console.log('✅ Đã commit transaction');

      // 11. Trả về kết quả với thông tin đầy đủ
      console.log('🔍 Lấy thông tin đầy đủ của bản nháp');
      const result = await ShiftHandover.findByPk(draftHandover.id, {
        include: [
          {
            model: WorkShift,
            as: 'FromShift',
            attributes: ['id', 'code', 'name']
          },
          {
            model: WorkShift,
            as: 'ToShift',
            attributes: ['id', 'code', 'name']
          },
          {
            model: User,
            as: 'FromUsers',
            through: {
              attributes: ['role']
            },
            attributes: ['id', 'username', 'fullname']
          },
          {
            model: ShiftHandoverDevice,
            as: 'devices'
          }
        ]
      });
      console.log('✅ Đã lấy xong thông tin đầy đủ');

      console.log('🎉 Hoàn thành tạo bản nháp:', result.id);
      res.status(201).json({
        message: 'Đã tạo bản nháp bàn giao',
        handover: result
      });

    } catch (error) {
      console.error('❌ Lỗi trong transaction:', error);
      await transaction.rollback();
      console.log('↩️ Đã rollback transaction');
      throw error;
    }

  } catch (error) {
    console.error('❌ Lỗi tạo bản nháp:', error);
    console.error('Chi tiết lỗi:', error.stack);
    res.status(500).json({
      message: 'Lỗi khi tạo bản nháp bàn giao',
      error: error.message
    });
  }
};

// Cập nhật bản nháp
export const updateDraftHandover = async (req, res) => {
  try {
    const { handoverId } = req.params;
    const { content, devices, deviceErrors, handoverForm } = req.body;
    const currentUser = req.user;

    console.log('📝 Cập nhật bản nháp:', {
      handoverId,
      contentLength: content?.length,
      devicesCount: devices?.length,
      deviceErrorsCount: deviceErrors?.length
    });

    // Bắt đầu transaction
    const transaction = await db.sequelize.transaction();
    console.log('🔄 Đã bắt đầu transaction');

    try {
      // Tìm bản nháp
      const handover = await ShiftHandover.findOne({
        where: {
          id: handoverId,
          status: 'draft'
        },
        include: [
          {
            model: User,
            as: 'FromUsers',
            through: { attributes: [] },
            attributes: ['id']
          }
        ],
        transaction
      });

      if (!handover) {
        await transaction.rollback();
        return res.status(404).json({ message: 'Không tìm thấy bản nháp bàn giao' });
      }

      // Kiểm tra người dùng có thuộc ca không (chỉ WorkSession, KHÔNG kiểm tra ShiftHandoverUser)
      const activeWorkSession = await WorkSession.findOne({
        where: {
          userId: currentUser.id,
          workShiftId: handover.fromShiftId,
          status: 'active'
        }
      });
      if (!activeWorkSession) {
        await transaction.rollback();
        return res.status(403).json({ message: 'Bạn không thuộc ca này' });
      }

      // Cập nhật thông tin cơ bản
      await handover.update({
        content: content || handover.content,
        handoverForm: handoverForm || handover.handoverForm
      }, { transaction });

      // Xóa danh sách thiết bị cũ
      await ShiftHandoverDevice.destroy({
        where: { handoverId },
        transaction
      });

      // Xóa danh sách công việc cũ
      await ShiftHandoverTask.destroy({
        where: { handoverId },
        transaction
      });

      // Thêm danh sách thiết bị mới
      console.log('📝 Cập nhật danh sách thiết bị:', devices?.length || 0, 'thiết bị');
      if (devices && Array.isArray(devices)) {
        await Promise.all(devices.map(async (device, index) => {
          console.log(`➕ Lưu thiết bị ${index + 1}:`, {
            deviceId: device.deviceId,
            status: device.status
          });
          await ShiftHandoverDevice.create({
            handoverId,
            deviceId: device.deviceId,
            status: device.status,
            subDeviceName: device.subDeviceName,
            serialNumber: device.serialNumber,
            errorCode: device.errorCode,
            errorCause: device.errorCause,
            solution: device.solution,
            resolveStatus: device.status === 'Có lỗi' ? (device.resolveStatus || 'Chưa xử lý') : '',
            index: index + 1
          }, { transaction });
        }));
      }
      console.log('✅ Đã cập nhật xong danh sách thiết bị');

      // Cập nhật danh sách lỗi thiết bị
      console.log('📝 Cập nhật danh sách lỗi thiết bị:', deviceErrors?.length || 0, 'lỗi');
      if (deviceErrors && deviceErrors.length > 0) {
        for (const error of deviceErrors) {
          if (error.id && error.resolveStatus === 'Đã xử lý') {
            // Nếu có id và đã xử lý, update DeviceError sang Đã xử lý
            await DeviceError.update({
              resolveStatus: 'Đã xử lý',
              resolvedAt: error.resolvedAt || null,
              resolvedBy: error.resolvedBy || '',
              resolveNote: error.resolveNote || '',
              updatedAt: new Date()
            }, {
              where: { id: error.id },
              transaction
            });
            continue;
          }

          if (error.status === 'Có lỗi' && error.errorCode && error.errorCause) {
            if (error.id) {
              // Nếu có id, update lỗi cũ
              await DeviceError.update({
                subDeviceName: error.subDeviceName,
                serialNumber: error.serialNumber,
                errorCode: error.errorCode,
                errorCause: error.errorCause,
                solution: error.solution,
                resolveStatus: error.resolveStatus || 'Chưa xử lý',
                resolvedAt: error.resolvedAt || null,
                resolveNote: error.resolveNote || '',
                resolvedBy: error.resolvedBy || '',
                updatedAt: new Date()
              }, {
                where: { id: error.id },
                transaction
              });
            } else {
              // Kiểm tra trùng lặp chỉ dựa vào deviceId và subDeviceName
              const existed = await DeviceError.findOne({
                where: {
                  deviceId: error.deviceId,
                  subDeviceName: error.subDeviceName,
                  resolveStatus: 'Chưa xử lý'
                },
                transaction
              });

              if (existed) {
                // Update bản ghi cũ
                await existed.update({
                  serialNumber: error.serialNumber,
                  errorCode: error.errorCode,
                  errorCause: error.errorCause,
                  solution: error.solution,
                  resolveStatus: error.resolveStatus || 'Chưa xử lý',
                  resolvedAt: error.resolvedAt || null,
                  resolveNote: error.resolveNote || '',
                  resolvedBy: error.resolvedBy || '',
                  updatedAt: new Date()
                }, { transaction });
              } else {
                // Tạo mới nếu chưa có
                await DeviceError.create({
                  deviceId: error.deviceId,
                  subDeviceName: error.subDeviceName || '',
                  serialNumber: error.serialNumber || '',
                  errorCode: error.errorCode,
                  errorCause: error.errorCause,
                  solution: error.solution || '',
                  resolveStatus: error.resolveStatus || 'Chưa xử lý',
                  resolvedAt: error.resolvedAt || null,
                  resolveNote: error.resolveNote || '',
                  resolvedBy: error.resolvedBy || '',
                  createdAt: new Date(),
                  updatedAt: new Date()
                }, { transaction });
              }
            }
          }
        }
      }
      console.log('✅ Đã cập nhật xong danh sách lỗi thiết bị');

      // Cập nhật danh sách công việc
      console.log('📝 Cập nhật danh sách công việc:', handoverForm?.tasks?.length || 0, 'công việc');
      if (handoverForm?.tasks && Array.isArray(handoverForm.tasks)) {
        await Promise.all(handoverForm.tasks.map(async (task, index) => {
          console.log(`➕ Lưu công việc ${index + 1}:`, {
            taskId: task.id,
            location: task.location
          });
          await ShiftHandoverTask.create({
            handoverId,
            taskId: task.id,
            location: task.location,
            fullName: task.fullName,
            taskTitle: task.taskTitle,
            taskDescription: task.taskDescription,
            status: task.status,
            checkInTime: task.checkInTime,
            checkOutTime: task.checkOutTime,
            signature: task.signature,
            completedAt: task.completedAt,
            cancelReason: task.cancelReason,
            userId: task.userId,
            createdBy: task.createdBy,
            completedBy: task.completedBy,
            workSessionId: task.workSessionId,
            workShiftId: task.workShiftId,
            index: index + 1
          }, { transaction });
        }));
      }
      console.log('✅ Đã cập nhật xong danh sách công việc');

      // Commit transaction
      await transaction.commit();
      console.log('✅ Đã commit transaction');

      // Lấy thông tin đầy đủ
      const fullHandover = await ShiftHandover.findByPk(handover.id, {
        include: [
          {
            model: WorkShift,
            as: 'FromShift',
            attributes: ['id', 'code', 'name', 'date', 'status']
          },
          {
            model: WorkShift,
            as: 'ToShift',
            attributes: ['id', 'code', 'name', 'date', 'status']
          },
          {
            model: User,
            as: 'FromUsers',
            through: { attributes: [] },
            attributes: ['id', 'username', 'fullname', 'role']
          },
          {
            model: ShiftHandoverDevice,
            as: 'devices'
          }
        ]
      });

      res.json({
        message: 'Cập nhật bản nháp thành công',
        handover: fullHandover
      });

    } catch (error) {
      console.error('❌ Lỗi trong transaction:', error);
      await transaction.rollback();
      console.log('↩️ Đã rollback transaction');
      throw error;
    }
  } catch (error) {
    console.error('❌ Lỗi cập nhật bản nháp:', error);
    res.status(500).json({
      message: 'Lỗi khi cập nhật bản nháp',
      error: error.message
    });
  }
};

// Xóa bản nháp
export const deleteDraftHandover = async (req, res) => {
  try {
    const { handoverId } = req.params;
    const currentUser = req.user;

    // Tìm bản nháp
    const handover = await ShiftHandover.findOne({
      where: {
        id: handoverId,
        status: 'draft'
      }
    });

    if (!handover) {
      return res.status(404).json({ message: 'Không tìm thấy bản nháp bàn giao' });
    }

    // Kiểm tra quyền xóa: chỉ cần user đang active trong ca
    const activeWorkSession = await WorkSession.findOne({
      where: {
        userId: currentUser.id,
        workShiftId: handover.fromShiftId,
        status: 'active'
      }
    });
    if (!activeWorkSession) {
      return res.status(403).json({ message: 'Bạn không thuộc ca này' });
    }

    // Xóa các file đính kèm nếu có
    const attachments = handover.attachments || [];
    if (attachments.length > 0) {
      for (const file of attachments) {
        try {
          if (file.path && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        } catch (err) {
          // Bỏ qua lỗi xóa file
        }
      }
    }

    // Xóa bản nháp
    await handover.destroy();
    res.json({ message: 'Xóa bản nháp thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi xóa bản nháp' });
  }
};

// Lấy danh sách bản nháp
export const getDraftHandovers = async (req, res) => {
  try {
    const userId = req.user.id;

    const drafts = await ShiftHandover.findAll({
      where: {
        userId,
        status: 'draft'
      },
      include: [
        {
          model: WorkShift,
          as: 'WorkShift',
          attributes: ['code', 'date', 'status']
        }
      ]
    });

    res.json(drafts);
  } catch (error) {
    console.error('Error getting draft handovers:', error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách bản nháp' });
  }
};

// Lấy chi tiết bản nháp
export const getDraftHandover = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const handover = await ShiftHandover.findByPk(id, {
      include: [
        {
          model: WorkShift,
          as: 'WorkShift',
          attributes: ['code', 'date', 'status']
        }
      ]
    });

    if (!handover) {
      return res.status(404).json({ message: 'Không tìm thấy bản nháp' });
    }

    // Kiểm tra quyền sở hữu
    if (handover.userId !== userId) {
      return res.status(403).json({ message: 'Bạn không có quyền xem bản nháp này' });
    }

    res.json(handover);
  } catch (error) {
    console.error('Error getting draft handover:', error);
    res.status(500).json({ message: 'Lỗi khi lấy thông tin bản nháp' });
  }
};

// Gửi bản nháp để bàn giao
export const submitDraftHandover = async (req, res) => {
  try {
    const { handoverId } = req.params;
    const currentUser = req.user;

    // Tìm bản nháp
    const handover = await ShiftHandover.findOne({
      where: {
        id: handoverId,
        status: 'draft'
      },
      include: [
        {
          model: WorkShift,
          as: 'FromShift'
        },
        {
          model: User,
          as: 'FromUsers',
          through: { attributes: [] },
          attributes: ['id']
        }
      ]
    });

    if (!handover) {
      return res.status(404).json({ message: 'Không tìm thấy bản nháp bàn giao' });
    }

    // Kiểm tra người dùng có thuộc ca không - kiểm tra cả WorkSession và ShiftHandoverUser
    const [workSession, handoverUser] = await Promise.all([
      WorkSession.findOne({
        where: {
          userId: currentUser.id,
          workShiftId: handover.fromShiftId,
          status: 'active'
        }
      }),
      ShiftHandoverUser.findOne({
        where: {
          shiftHandoverId: handoverId,
          userId: currentUser.id,
          type: 'from'
        }
      })
    ]);

    // Người dùng phải thuộc ca (có WorkSession active) hoặc là người được thêm vào bàn giao
    if (!workSession && !handoverUser) {
      return res.status(403).json({
        message: 'Bạn không thuộc ca này hoặc không được thêm vào danh sách bàn giao',
        details: {
          hasWorkSession: !!workSession,
          hasHandoverUser: !!handoverUser
        }
      });
    }

    // Cập nhật trạng thái
    await handover.update({ status: 'pending' });

    // Cập nhật trạng thái ca hiện tại
    await handover.FromShift.update({ status: 'handover' });

    sendShiftUpdate(handover.FromShift, 'handover', 'doing', 'handover', req.user.id, req.user.fullname);

    // Lấy thông tin đầy đủ
    const fullHandover = await ShiftHandover.findByPk(handover.id, {
      include: [
        {
          model: WorkShift,
          as: 'FromShift',
          attributes: ['id', 'code', 'name', 'date', 'status']
        },
        {
          model: WorkShift,
          as: 'ToShift',
          attributes: ['id', 'code', 'name', 'date', 'status']
        },
        {
          model: User,
          as: 'FromUser',
          attributes: ['id', 'username', 'fullname', 'role']
        },
        {
          model: User,
          as: 'FromUsers',
          through: { attributes: ['role'] },
          attributes: ['id', 'username', 'fullname', 'role']
        }
      ]
    });


    res.json({
      message: 'Gửi bản nháp bàn giao thành công',
      handover: fullHandover
    });
  } catch (error) {
    console.error('Error submitting draft handover:', error);
    res.status(500).json({ message: 'Lỗi khi gửi bản bàn giao' });
  }
};

export const getShiftUsers = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🔍 Getting users for shift:', id);

    const shift = await WorkShift.findOne({
      where: { id },
      include: [{
        model: User,
        as: 'Users',
        through: { attributes: [] },
        attributes: ['id', 'username', 'fullname', 'role']
      }]
    });

    if (!shift) {
      console.log('❌ Shift not found:', id);
      return res.status(404).json({ message: 'Không tìm thấy ca làm việc' });
    }

    console.log('✅ Found users:', shift.Users.map(u => u.username));
    res.json({
      data: shift.Users,
      message: 'Lấy danh sách người dùng trong ca thành công'
    });
  } catch (err) {
    console.error('GET /shifts/:id/users error:', err);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách người dùng trong ca' });
  }
};

// Lấy danh sách ca làm việc của user đăng nhập
export const getMyShifts = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status = 'active', startDate, endDate } = req.query;

    // Tìm tất cả ca làm việc của user
    const whereClause = {
      userId

    };

    if (status) {
      whereClause.status = status;
    }

    const sessions = await WorkSession.findAll({
      where: whereClause,
      attributes: ['id', 'status', 'date'],
      include: [
        {
          model: WorkShift,
          as: 'WorkShift',
          attributes: ['id', 'code', 'name', 'date', 'confirmedAt', 'status', 'group', 'index'],
          include: [
            {
              model: User,
              as: 'Users',
              through: { attributes: [] },
              attributes: ['id', 'username', 'fullname']
            }
          ]
        }
      ],
      order: [
        ['status', 'DESC'], // Sắp xếp active lên đầu
        ['date', 'DESC'],
        ['startedAt', 'DESC']
      ]
    });

    res.json({
      success: true,
      data: sessions
    });
  } catch (error) {
    console.error('❌ Error in getMyShifts:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách ca làm việc',
      error: error.message
    });
  }
};

export default {
  // ... existing exports ...
  getMyShifts,
};

// Upload files for handover
export const uploadHandoverFiles = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user;

    // Kiểm tra files có tồn tại không
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({
        message: 'Không có file nào được tải lên',
        errors: ['Vui lòng chọn ít nhất một file']
      });
    }

    // Tìm handover
    const handover = await ShiftHandover.findOne({
      where: {
        id,
        fromUserId: currentUser.id,
        status: 'draft'
      }
    });

    if (!handover) {
      // Xóa các file đã upload nếu không tìm thấy handover
      req.files.forEach(file => {
        fs.unlinkSync(file.path);
      });
      return res.status(404).json({ message: 'Không tìm thấy bản nháp bàn giao' });
    }

    // Lưu thông tin file vào database
    const fileInfos = req.files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path
    }));

    // Cập nhật attachments trong handover
    const currentAttachments = handover.attachments || [];
    await handover.update({
      attachments: [...currentAttachments, ...fileInfos]
    });

    res.json({
      message: 'Tải file lên thành công',
      files: fileInfos
    });
  } catch (error) {
    console.error('Error uploading handover files:', error);
    // Xóa các file đã upload nếu có lỗi
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach(file => {
        try {
          fs.unlinkSync(file.path);
        } catch (err) {
          console.error('Error deleting file:', err);
        }
      });
    }
    res.status(500).json({ message: 'Lỗi khi tải file lên' });
  }
};

// Xóa file của handover
export const deleteHandoverFile = async (req, res) => {
  try {
    const { id, filename } = req.params;
    const currentUser = req.user;

    // Tìm handover
    const handover = await ShiftHandover.findOne({
      where: {
        id: id,
        fromUserId: currentUser.id,
        status: 'draft'
      }
    });

    if (!handover) {
      return res.status(404).json({ message: 'Không tìm thấy bản nháp bàn giao' });
    }

    // Tìm file cần xóa
    const attachments = handover.attachments || [];
    const fileIndex = attachments.findIndex(file => file.filename === filename);

    if (fileIndex === -1) {
      return res.status(404).json({ message: 'Không tìm thấy file' });
    }

    // Xóa file từ filesystem
    const filePath = path.join(config.rootDir, config.directories.handover, id.toString(), filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`✅ Deleted file: ${filePath}`);
    } else {
      console.warn(`⚠️ File not found at path: ${filePath}`);
    }

    // Cập nhật database - xóa file khỏi mảng attachments
    const updatedAttachments = attachments.filter(file => file.filename !== filename);
    await handover.update({
      attachments: updatedAttachments
    });

    // Lấy lại handover sau khi cập nhật để kiểm tra
    const updatedHandover = await ShiftHandover.findByPk(id);
    console.log('Updated handover attachments:', updatedHandover.attachments);

    res.json({
      message: 'Xóa file thành công',
      handover: updatedHandover
    });
  } catch (error) {
    console.error('Error deleting handover file:', error);
    res.status(500).json({ message: 'Lỗi khi xóa file' });
  }
};

// Manager-specific endpoints
export const getManagerShifts = async (req, res) => {
  try {
    const shifts = await WorkShift.findAll({
      include: [
        {
          model: User,
          as: 'Users',
          through: { attributes: [] },
          attributes: ['id', 'username', 'fullName']
        },
        {
          model: User,
          as: 'Creator',
          attributes: ['id', 'username', 'fullName']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(shifts);
  } catch (error) {
    console.error('Error getting manager shifts:', error);
    res.status(500).json({ message: 'Error getting shifts' });
  }
};

export const createManagerShift = async (req, res) => {
  try {
    const { code, name, startTime, endTime, status } = req.body;

    // Validate required fields
    if (!code || !name || !startTime || !endTime) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create new shift
    const shift = await WorkShift.create({
      code,
      name,
      startTime,
      endTime,
      status: status || 'not_started'
    });

    res.status(201).json(shift);
  } catch (error) {
    console.error('Error creating shift:', error);
    res.status(500).json({ message: 'Error creating shift' });
  }
};

export const updateManagerShift = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, startTime, endTime, status } = req.body;

    // Find shift
    const shift = await WorkShift.findByPk(id);
    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }

    // Update shift
    await shift.update({
      code: code || shift.code,
      name: name || shift.name,
      startTime: startTime || shift.startTime,
      endTime: endTime || shift.endTime,
      status: status || shift.status
    });

    res.json(shift);
  } catch (error) {
    console.error('Error updating shift:', error);
    res.status(500).json({ message: 'Error updating shift' });
  }
};

export const deleteManagerShift = async (req, res) => {
  try {
    const { id } = req.params;

    // Find shift
    const shift = await WorkShift.findByPk(id);
    if (!shift) {
      return res.status(404).json({ message: 'Shift not found' });
    }

    // Check if shift can be deleted
    if (shift.status !== 'not_started') {
      return res.status(400).json({
        message: 'Cannot delete shift that has already started or completed'
      });
    }

    // Delete shift
    await shift.destroy();

    res.json({ message: 'Shift deleted successfully' });
  } catch (error) {
    console.error('Error deleting shift:', error);
    res.status(500).json({ message: 'Error deleting shift' });
  }
};

// Lấy layout các nhóm ca động từ shiftConfig
export const getShiftLayout = async (req, res) => {
  try {
    // Lấy danh sách locations theo thứ tự ID để đảm bảo thứ tự hiển thị
    const locations = await db.Location.findAll({
      where: { isActive: true },
      order: [['id', 'ASC']]
    });

    // Tạo layout theo thứ tự ID của locations
    const layout = locations.map(location => {
      const group = location.code;
      const groupShifts = Object.entries(shiftConfig)
        .filter(([code, config]) => config.group === group)
        .sort((a, b) => a[1].index - b[1].index);

      const firstShift = groupShifts[0];
      return {
        code: group,
        name: location.name, // Sử dụng tên từ location thay vì shift
        locationId: location.id, // Thêm locationId để frontend có thể sắp xếp
        shifts: groupShifts.map(([code, config]) => ({
          code,
          name: config.name,
          startTime: config.startTime,
          endTime: config.endTime,
          index: config.index
        }))
      };
    });

    res.json({
      success: true,
      data: layout
    });
  } catch (error) {
    console.error('❌ Error in getShiftLayout:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy layout ca trực',
      error: error.message
    });
  }
};

// Upload temp files cho handover (chưa lưu vào handover chính thức)
export const uploadTempHandoverFiles = async (req, res) => {
  try {
    const currentUser = req.user;

    // Kiểm tra files có tồn tại không
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({
        message: 'Không có file nào được tải lên',
        errors: ['Vui lòng chọn ít nhất một file']
      });
    }

    // Tạo session ID cho temp files
    const sessionId = req.body.sessionId || `temp_${currentUser.id}_${Date.now()}`;
    
    // Lưu thông tin file tạm vào database hoặc cache
    const tempFileInfos = req.files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
      sessionId: sessionId,
      userId: currentUser.id,
      createdAt: new Date()
    }));

    // Lưu vào temp storage (có thể dùng Redis hoặc database)
    // Ở đây tạm thời lưu vào memory cache
    if (!global.tempFiles) global.tempFiles = new Map();
    global.tempFiles.set(sessionId, tempFileInfos);

    res.json({
      message: 'Tải file tạm thành công',
      sessionId: sessionId,
      files: tempFileInfos.map(f => ({
        filename: f.filename,
        originalname: f.originalname,
        size: f.size
      }))
    });
  } catch (error) {
    console.error('Error uploading temp files:', error);
    // Xóa các file đã upload nếu có lỗi
    if (req.files && Array.isArray(req.files)) {
      req.files.forEach(file => {
        try {
          fs.unlinkSync(file.path);
        } catch (err) {
          console.error('Error deleting file:', err);
        }
      });
    }
    res.status(500).json({ message: 'Lỗi khi tải file tạm' });
  }
};

// Commit temp files vào handover chính thức
export const commitTempFilesToHandover = async (req, res) => {
  try {
    const { handoverId, sessionId } = req.body;
    const currentUser = req.user;

    // Lấy temp files từ session
    if (!global.tempFiles || !global.tempFiles.has(sessionId)) {
      return res.status(404).json({ message: 'Không tìm thấy file tạm' });
    }

    const tempFiles = global.tempFiles.get(sessionId);
    
    // Kiểm tra quyền sở hữu
    const userTempFiles = tempFiles.filter(f => f.userId === currentUser.id);
    if (userTempFiles.length === 0) {
      return res.status(403).json({ message: 'Không có quyền truy cập file tạm' });
    }

    // Tìm handover
    const handover = await ShiftHandover.findOne({
      where: {
        id: handoverId,
        fromUserId: currentUser.id,
        status: 'draft'
      }
    });

    if (!handover) {
      return res.status(404).json({ message: 'Không tìm thấy bản nháp bàn giao' });
    }

    // Tạo thư mục handover chính thức
    const uploadsRoot = config.rootDir;
    const handoverDir = path.join(uploadsRoot, config.directories.handover);
    const handoverPath = path.join(handoverDir, handoverId.toString());
    
    if (!fs.existsSync(handoverPath)) {
      fs.mkdirSync(handoverPath, { recursive: true });
    }

    // Di chuyển files từ temp sang handover chính thức
    const fileInfos = [];
    const movedFiles = [];

    for (const tempFile of userTempFiles) {
      try {
        // Đường dẫn file temp (tuyệt đối)
        const tempFilePath = path.isAbsolute(tempFile.path) 
          ? tempFile.path 
          : path.join(uploadsRoot, tempFile.path);
        
        // Đường dẫn file handover mới
        const handoverFilePath = path.join(handoverPath, tempFile.filename);
        
        // Kiểm tra file temp có tồn tại không
        if (!fs.existsSync(tempFilePath)) {
          console.error(`❌ Temp file không tồn tại: ${tempFilePath}`);
          continue;
        }

        // Di chuyển file từ temp sang handover
        fs.copyFileSync(tempFilePath, handoverFilePath);
        
        // Xóa file temp sau khi copy thành công
        fs.unlinkSync(tempFilePath);
        
        console.log(`✅ Đã di chuyển file: ${tempFile.filename} từ temp sang handover`);

        // Cập nhật thông tin file với đường dẫn mới
        const fileInfo = {
          filename: tempFile.filename,
          originalname: tempFile.originalname,
          mimetype: tempFile.mimetype,
          size: tempFile.size,
          path: path.join(config.directories.handover, handoverId.toString(), tempFile.filename)
        };

        fileInfos.push(fileInfo);
        movedFiles.push(tempFile.filename);

      } catch (error) {
        console.error(`❌ Lỗi khi di chuyển file ${tempFile.filename}:`, error);
        // Tiếp tục với file khác nếu có lỗi
      }
    }

    // Cập nhật attachments trong handover
    const currentAttachments = handover.attachments || [];
    await handover.update({
      attachments: [...currentAttachments, ...fileInfos]
    });

    // Xóa temp files khỏi cache
    global.tempFiles.delete(sessionId);

    console.log(`✅ Đã commit ${movedFiles.length} files vào handover ${handoverId}`);

    res.json({
      message: `Commit ${movedFiles.length} files thành công`,
      files: fileInfos,
      movedFiles: movedFiles
    });
  } catch (error) {
    console.error('Error committing temp files:', error);
    res.status(500).json({ message: 'Lỗi khi commit file' });
  }
};

// Cleanup temp files
export const cleanupTempFiles = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const currentUser = req.user;

    // Lấy temp files từ session
    if (!global.tempFiles || !global.tempFiles.has(sessionId)) {
      return res.status(404).json({ message: 'Không tìm thấy file tạm' });
    }

    const tempFiles = global.tempFiles.get(sessionId);
    
    // Kiểm tra quyền sở hữu
    const userTempFiles = tempFiles.filter(f => f.userId === currentUser.id);
    if (userTempFiles.length === 0) {
      return res.status(403).json({ message: 'Không có quyền truy cập file tạm' });
    }

    // Xóa files từ filesystem
    userTempFiles.forEach(tempFile => {
      try {
        if (fs.existsSync(tempFile.path)) {
          fs.unlinkSync(tempFile.path);
          console.log(`✅ Deleted temp file: ${tempFile.path}`);
        }
      } catch (err) {
        console.error(`❌ Error deleting temp file: ${tempFile.path}`, err);
      }
    });

    // Xóa khỏi cache
    global.tempFiles.delete(sessionId);

    res.json({
      message: 'Cleanup temp files thành công',
      deletedCount: userTempFiles.length
    });
  } catch (error) {
    console.error('Error cleaning up temp files:', error);
    res.status(500).json({ message: 'Lỗi khi cleanup temp files' });
  }
};

// Xóa file tạm cụ thể
export const deleteTempFile = async (req, res) => {
  try {
    const { sessionId, filename } = req.params;
    const currentUser = req.user;

    // Lấy temp files từ session
    if (!global.tempFiles || !global.tempFiles.has(sessionId)) {
      return res.status(404).json({ message: 'Không tìm thấy session tạm' });
    }

    const tempFiles = global.tempFiles.get(sessionId);
    
    // Tìm file cần xóa
    const tempFile = tempFiles.find(f => f.filename === filename && f.userId === currentUser.id);
    if (!tempFile) {
      return res.status(404).json({ message: 'Không tìm thấy file tạm' });
    }

    // Xóa file từ filesystem
    try {
      if (fs.existsSync(tempFile.path)) {
        fs.unlinkSync(tempFile.path);
        console.log(`✅ Deleted specific temp file: ${tempFile.path}`);
      } else {
        console.warn(`⚠️ Temp file not found at path: ${tempFile.path}`);
      }
    } catch (err) {
      console.error(`❌ Error deleting temp file: ${tempFile.path}`, err);
      return res.status(500).json({ message: 'Lỗi khi xóa file từ server' });
    }

    // Xóa khỏi cache
    const updatedTempFiles = tempFiles.filter(f => f.filename !== filename);
    if (updatedTempFiles.length === 0) {
      // Nếu không còn file nào, xóa session
      global.tempFiles.delete(sessionId);
    } else {
      // Cập nhật session với file đã xóa
      global.tempFiles.set(sessionId, updatedTempFiles);
    }

    res.json({
      message: 'Xóa file tạm thành công',
      deletedFile: filename
    });
  } catch (error) {
    console.error('Error deleting temp file:', error);
    res.status(500).json({ message: 'Lỗi khi xóa file tạm' });
  }
};

// Auto cleanup temp files cũ (có thể chạy cron job)
export const cleanupOldTempFiles = async () => {
  try {
    if (!global.tempFiles) return;

    const now = new Date();
    const maxAge = 24 * 60 * 60 * 1000; // 24 giờ

    for (const [sessionId, tempFiles] of global.tempFiles.entries()) {
      const isOld = tempFiles.some(file => 
        (now - new Date(file.createdAt)) > maxAge
      );

      if (isOld) {
        // Xóa files từ filesystem
        tempFiles.forEach(tempFile => {
          try {
            if (fs.existsSync(tempFile.path)) {
              fs.unlinkSync(tempFile.path);
              console.log(`✅ Auto deleted old temp file: ${tempFile.path}`);
            }
          } catch (err) {
            console.error(`❌ Error auto deleting temp file: ${tempFile.path}`, err);
          }
        });

        // Xóa khỏi cache
        global.tempFiles.delete(sessionId);
        console.log(`✅ Cleaned up old session: ${sessionId}`);
      }
    }
  } catch (error) {
    console.error('Error in auto cleanup:', error);
  }
};
