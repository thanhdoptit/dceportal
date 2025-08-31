import cron from 'node-cron';
import { cleanupOldTempFiles } from '../controllers/shiftController.js';

// Cron job để cleanup temp files cũ (chạy mỗi giờ)
export const startTempFilesCleanupJob = () => {
  // Chạy mỗi giờ vào phút 0
  cron.schedule('0 * * * *', async () => {
    console.log('🕐 Running temp files cleanup job...');
    try {
      await cleanupOldTempFiles();
      console.log('✅ Temp files cleanup job completed');
    } catch (error) {
      console.error('❌ Error in temp files cleanup job:', error);
    }
  });

  console.log('🚀 Temp files cleanup job started (runs every hour)');
};

// Cleanup khi server shutdown
export const cleanupOnShutdown = async () => {
  console.log('🔄 Cleaning up temp files on shutdown...');
  try {
    await cleanupOldTempFiles();
    console.log('✅ Shutdown cleanup completed');
  } catch (error) {
    console.error('❌ Error during shutdown cleanup:', error);
  }
};
