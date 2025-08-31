import express from 'express';
import { createShiftCheckForm, updateShiftCheckForm, getShiftCheckForms, getShiftCheckFormById, deleteShiftCheckForm } from '../controllers/shiftCheck.controller.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/forms', authenticate, createShiftCheckForm);
router.put('/forms/:id', authenticate, updateShiftCheckForm);
router.get('/forms', authenticate, getShiftCheckForms);
router.get('/forms/:id', authenticate, getShiftCheckFormById);
router.delete('/forms/:id', authenticate, deleteShiftCheckForm);

export default router;