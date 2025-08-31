import cron from 'node-cron';
import { startUpdateExpiredTasks } from './updateExpiredTasks.js';
import { startCleanupCron } from './cleanupBlacklistedTokens.js';
import { startCleanupRefreshTokensCron } from './cleanupRefreshTokens.js';
import { startTempFilesCleanupJob } from './cleanupTempFiles.js';

// Khởi động tất cả cron jobs
export const startAllCronJobs = () => {
  console.log('🚀 Khởi động tất cả cron jobs...');
  
  // Update expired tasks
  startUpdateExpiredTasks();
  
  // Cleanup blacklisted tokens
  startCleanupCron();
  // Cleanup refresh tokens
  startCleanupRefreshTokensCron();
  
  // Cleanup temp files
  startTempFilesCleanupJob();
  
  console.log('✅ Tất cả cron jobs đã được khởi động');
};

// Khởi động ngay khi import
startAllCronJobs(); 