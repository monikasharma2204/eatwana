import express from 'express';
import { signup, login, forgotPassword, verifyOtp } from '../controllers/userAuthController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);


export default router;