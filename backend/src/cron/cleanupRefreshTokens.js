import cron from 'node-cron';
import db from '../models/index.js';

// Dọn dẹp refresh tokens:
// - Xóa token đã hết hạn (expiresAt < NOW)
// - Xóa token đã revoke quá lâu (giữ lại log trong một khoảng thời gian để audit)
export const cleanupRefreshTokens = async () => {
  try {
    const now = new Date();
    const Op = db.Sequelize.Op;

    // 1) Xóa refresh token đã hết hạn
    const deletedExpired = await db.RefreshToken.destroy({
      where: {
        expiresAt: { [Op.lt]: now }
      }
    });

    // 2) Xóa refresh token đã revoke quá hạn giữ log
    const retentionDays = parseInt(process.env.REFRESH_TOKEN_RETENTION_DAYS || '30', 10);
    const revokeThreshold = new Date(now.getTime() - retentionDays * 24 * 60 * 60 * 1000);
    const deletedRevoked = await db.RefreshToken.destroy({
      where: {
        isRevoked: true,
        updatedAt: { [Op.lt]: revokeThreshold }
      }
    });

    console.log(`🧹 Cleanup RefreshTokens: expired=${deletedExpired}, revoked_old=${deletedRevoked}`);
  } catch (error) {
    console.error('❌ Cleanup refresh tokens error:', error);
  }
};

// Chạy cleanup mỗi ngày lúc 2:15 AM (sau khi dọn blacklist)
export const startCleanupRefreshTokensCron = () => {
  cron.schedule('15 2 * * *', cleanupRefreshTokens, {
    scheduled: true,
    timezone: 'Asia/Ho_Chi_Minh'
  });
  console.log('🕐 Cleanup refresh tokens cron job đã được khởi động');
};

export default cleanupRefreshTokens;
