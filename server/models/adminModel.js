import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true }, // you will hash manually in controller
        businessName: { type: String, trim: true },

        otp: { type: String }, // store plain or hashed (your choice)
        otpExpiry: { type: Date },

        isVerified: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Admin", adminSchema);
