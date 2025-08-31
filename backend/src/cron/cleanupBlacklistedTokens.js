import cron from 'node-cron';
import db from '../models/index.js';

// Cleanup blacklisted tokens đã hết hạn
const cleanupBlacklistedTokens = async () => {
  try {
    const result = await db.BlacklistedToken.destroy({
      where: {
        expiresAt: {
          [db.Sequelize.Op.lt]: new Date()
        }
      }
    });

    if (result >= 0) {
      console.log(`🧹 Cleanup: Đã xóa ${result} blacklisted tokens đã hết hạn`);
    }
  } catch (error) {
    console.error('❌ Cleanup blacklisted tokens error:', error);
  }
};

// Chạy cleanup mỗi ngày lúc 2:00 AM
export const startCleanupCron = () => {
  cron.schedule('0 2 * * *', cleanupBlacklistedTokens, {
    scheduled: true,
    timezone: 'Asia/Ho_Chi_Minh'
  });

  console.log('🕐 Cleanup blacklisted tokens cron job đã được khởi động');
};

export default cleanupBlacklistedTokens;
