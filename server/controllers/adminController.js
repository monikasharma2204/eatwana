import Admin from "../models/adminModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerAdmin = async (req, res) => {
    try {
        const { name, email, password, businessName } = req.body;

        const existing = await Admin.findOne({ email });
        if (existing) return res.status(400).json({ message: "Admin already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await Admin.create({
            name,
            email,
            password: hashedPassword,
            businessName,
        });

        res.status(201).json({ message: "Admin created", admin });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body)
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(404).json({ message: "Admin not found" });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

        const token = jwt.sign(
            { id: admin._id },
            process.env.ADMIN_JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login successful",
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                businessName: admin.businessName
            },
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message });
    }
};

export const generateAdminOTP = async (req, res) => {
    try {
        const { email } = req.body;

        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(404).json({ message: "Admin not found" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        admin.otp = otp;                // you can hash if you want
        admin.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 min expiry
        await admin.save();

        // send otp by email/SMS here
        res.json({ message: "OTP generated", otp }); // remove otp in production
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const verifyAdminOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(404).json({ message: "Admin not found" });

        if (!admin.otp || !admin.otpExpiry)
            return res.status(400).json({ message: "No OTP generated" });

        if (Date.now() > admin.otpExpiry)
            return res.status(400).json({ message: "OTP expired" });

        if (otp !== admin.otp)
            return res.status(400).json({ message: "Invalid OTP" });

        admin.isVerified = true;
        admin.otp = null;
        admin.otpExpiry = null;
        await admin.save();

        res.json({ message: "OTP verified successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
