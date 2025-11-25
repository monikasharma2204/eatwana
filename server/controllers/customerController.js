import Customer from "../models/customerModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateOtp } from '../utils/otpHelper.js';
import { sendMail } from "../utils/mailer.js";
import { adminCreatedWelcomeEmail, signupWelcomeEmail } from "../utils/welcomeEmailTemplet.js";


export const signup = async (req, res) => {
    try {
        const { name, email, mobile, password } = req.body;

        // Check if user already exists by email
        const existingUserByEmail = await Customer.findOne({ email });
        if (existingUserByEmail)
            return res.status(400).json({ message: 'User with this email already exists!' });

        // Check if user already exists by mobile
        const existingUserByMobile = await Customer.findOne({ mobile });
        if (existingUserByMobile)
            return res.status(400).json({ message: 'User with this mobile number already exists!' });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await Customer.create({
            name,
            email,
            mobile,
            password: hashedPassword,

        });

        // Generate JWT token
        const token = jwt.sign({ id: newUser._id }, process.env.USER_JWT_SECRET, { expiresIn: '7d' });
        await sendMail({
            to: email,
            subject: "Welcome to Eatwana - Account Created Successfully",
            body: signupWelcomeEmail(name)
        });
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
        console.log(req.body)
        const user = await Customer.findOne({ email });
        console.log(user)
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
        const user = await Customer.findOne({ email });

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

        const user = await Customer.findOne({ email });
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
        const users = await Customer.find().select('-password');

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

export const createCustomer = async (req, res) => {
    try {
        const { name, mobile, email, address } = req.body;

        // Check mobile number uniqueness
        const existingMobile = await Customer.findOne({ mobile });
        if (existingMobile) {
            return res.status(400).json({
                success: false,
                message: "Mobile number is already registered."
            });
        }

        // Check email uniqueness (only if email provided)
        if (email) {
            const existingEmail = await Customer.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({
                    success: false,
                    message: "Email ID is already registered."
                });
            }
        }

        const customer = await Customer.create({
            name,
            mobile,
            email,
            address
        });
        if (email) {
            await sendMail({
                to: email,
                subject: "Welcome to Eatwana - Your Account Details",
                body: adminCreatedWelcomeEmail(name, email, "Eatwana@123")
            });
        }
        res.status(201).json({
            success: true,
            message: "Customer created successfully",
            data: customer
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();

        res.json({
            success: true,
            data: customers
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// UPDATE CUSTOMER
export const updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, mobile, email, address } = req.body;

        // Check if customer exists
        const customer = await Customer.findById(id);
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        // Validate mobile number uniqueness
        if (mobile && mobile !== customer.mobile) {
            const existingMobile = await Customer.findOne({ mobile });
            if (existingMobile) {
                return res.status(400).json({
                    success: false,
                    message: "Mobile number is already registered."
                });
            }
        }

        // Validate email uniqueness
        if (email && email !== customer.email) {
            const existingEmail = await Customer.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({
                    success: false,
                    message: "Email ID is already registered."
                });
            }
        }

        // Update fields
        customer.name = name ?? customer.name;
        customer.mobile = mobile ?? customer.mobile;
        customer.email = email ?? customer.email;
        customer.address = address ?? customer.address;

        await customer.save();

        res.status(200).json({
            success: true,
            message: "Customer updated successfully",
            data: customer
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// DELETE CUSTOMER
export const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;

        const customer = await Customer.findById(id);
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        await Customer.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Customer deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
