import express from 'express';
import { login, logout, getCurrentUser, getBlacklistedTokens, forceLogoutUser, cleanupExpiredTokens, refresh, logoutAll } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/refresh', refresh);

// Protected routes
router.get('/me', authenticate, getCurrentUser);
// Đăng xuất (logout)
router.post('/logout', authenticate, logout);
router.post('/logout-all', authenticate, logoutAll);

// Admin routes for blacklisted tokens management
router.get('/blacklisted-tokens', authenticate, getBlacklistedTokens);
router.post('/force-logout/:userId', authenticate, forceLogoutUser);
router.post('/cleanup-expired-tokens', authenticate, cleanupExpiredTokens);

export default router;
