import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { generateOtp } from '../utils/otpHelper.js';


// ========================
// 🔹 SIGNUP
// ========================
export const signup = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: 'User already exists!' });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await User.create({
            name,
            email,
            phone,
            password: hashedPassword,

        });

        // Generate JWT token
        const token = jwt.sign({ id: newUser._id }, process.env.USER_JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            message: 'User registered successfully!',
            user: { id: newUser._id, name: newUser.name, email: newUser.email },
            token,
        });
    } catch (error) {
        console.error('Signup Error:', error);
        res.status(500).json({ message: 'Server error during signup.' });
    }
};

// ========================
// 🔹 LOGIN
// ========================
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).json({ message: 'User not found!' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: 'Invalid credentials!' });

        const token = jwt.sign({ id: user._id }, process.env.USER_JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({
            message: 'Login successful!',
            user: { id: user._id, name: user.name, email: user.email },
            token,
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};

// ========================
// 🔹 FORGOT PASSWORD (Generate OTP)
// ========================
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user)
            return res.status(404).json({ message: 'User not found!' });

        const { otp, otpExpiry } = generateOtp();

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        // Simulate sending OTP (you can integrate Twilio or Nodemailer)
        console.log(`📩 OTP for ${email}: ${otp}`);

        res.status(200).json({ message: 'OTP sent to your email!' });
    } catch (error) {
        console.error('Forgot Password Error:', error);
        res.status(500).json({ message: 'Error generating OTP.' });
    }
};

// ========================
// 🔹 VERIFY OTP & RESET PASSWORD
// ========================
export const verifyOtp = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).json({ message: 'User not found!' });

        if (user.otp !== otp)
            return res.status(400).json({ message: 'Invalid OTP!' });

        if (user.otpExpiry < Date.now())
            return res.status(400).json({ message: 'OTP expired!' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successful!' });
    } catch (error) {
        console.error('OTP Verification Error:', error);
        res.status(500).json({ message: 'Error verifying OTP.' });
    }
};


export const validateUser = async (req, res) => {
    try {
        // Since authMiddleware already verified the token and set req.user
        return res.status(200).json({
            success: true,
            user: req.user, // already sanitized (password removed)
            message: "User is valid"
        });
    } catch (error) {
        console.error("Validate User Error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
// ========================
// 🔹 GET ALL USERS
// ========================
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');

        res.status(200).json({
            message: 'Users retrieved successfully!',
            count: users.length,
            users,
        });
    } catch (error) {
        console.error('Get All Users Error:', error);
        res.status(500).json({ message: 'Error retrieving users.' });
    }
};