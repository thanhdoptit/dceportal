import { Op } from 'sequelize';
import cron from 'node-cron';
import db from '../models/index.js';
import { getCurrentDateTimeUTC7 } from '../utils/dateUtils.js';
import { trackTaskChange } from '../controllers/taskController.js';
import { broadcastTaskUpdate } from '../index.js';

/**
 * Tự động cập nhật trạng thái các task đã hết hạn
 */
export const updateExpiredTasks = async () => {
  const transaction = await db.sequelize.transaction();
  try {
    const now = new Date();

    // Tìm tất cả task đã hết hạn
    const expiredTasks = await db.Task.findAll({
      where: {
        status: {
          [Op.ne]: 'completed'
        },
        checkOutTime: {
          [Op.lt]: now
        }
      },
      transaction
    });


    const updatedTasks = [];
    for (const task of expiredTasks) {
      const oldStatus = task.status;
      await task.update({
        status: 'completed',
        completedBy: null,
        completedAt: task.checkOutTime
      }, { transaction });

      await trackTaskChange(
        task.id,
        null,
        'status',
        'status',
        oldStatus,
        'completed',
        'Tự động hoàn thành do đã quá thời gian kết thúc',
        true,
        transaction
      );

      updatedTasks.push(task);

      // Gửi thông báo WebSocket
      try {
        const message = {
          type: 'task_update',
          task: {
            id: task.id,
            status: 'completed',
            completedAt: task.checkOutTime,
            completedBy: null
          },
          changeType: 'status',
          oldValue: oldStatus,
          newValue: 'completed'
        };

        broadcastTaskUpdate(message);
        console.log(`✅ Đã gửi thông báo WebSocket cho task ${task.id}`);
      } catch (error) {
        console.error(`❌ Lỗi khi gửi thông báo WebSocket cho task ${task.id}:`, error);
        // Không throw error ở đây để không ảnh hưởng đến quá trình cập nhật task
      }
    }

    await transaction.commit();

    return updatedTasks;
  } catch (error) {
    await transaction.rollback();
    console.error('❌ Lỗi khi cập nhật task hết hạn:', error);
    throw error;
  }
};

/**
 * Khởi động cron job cho updateExpiredTasks
 */
export const startUpdateExpiredTasks = () => {
  // Chạy mỗi 1 phút để cập nhật task hết hạn
  cron.schedule('*/1 * * * *', async () => {
    await updateExpiredTasks();
  }, {
    scheduled: true,
    timezone: 'Asia/Ho_Chi_Minh'
  });

  console.log('🕐 Update expired tasks cron job đã được khởi động');
};
