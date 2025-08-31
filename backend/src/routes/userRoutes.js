import express from 'express';
import { getProfile, updateProfile, getAllUsers, getManagerUsers, createUser, updateUser, deleteUser } from '../controllers/userController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { isManager } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Public routes
router.get('/me', authenticate, getProfile);
router.put('/me', authenticate, updateProfile);

// Admin routes
router.get('/list', authenticate, getAllUsers);

// Manager routes
router.get('/manager/users', authenticate, isManager, getManagerUsers);
router.post('/manager/users', authenticate, isManager, createUser);
router.put('/manager/users/:id', authenticate, isManager, updateUser);
router.delete('/manager/users/:id', authenticate, isManager, deleteUser);

export default router;
