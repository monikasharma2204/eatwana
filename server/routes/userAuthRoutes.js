import express from 'express';
import { signup, login, forgotPassword, verifyOtp, validateUser } from '../controllers/userAuthController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.get('/validate', authMiddleware, validateUser);


export default router;