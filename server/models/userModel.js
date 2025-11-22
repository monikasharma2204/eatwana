import mongoose from 'mongoose';

// ========================
// 🔹 Define User Schema
// ========================
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters long'],
        },
        address: {
            type: String,
            default: '',
            trim: true,
        },
        profilePic: {
            type: String, // URL or file path
            default: '',
        },
        role: {
            type: String,
            enum: ['user', 'admin', 'delivery'],
            default: 'user',
        },
        tokenBalance: {
            type: Number,
            default: 0,
            comment: "Total remaining meal tokens for the customer"
        },


        // For tiffin users
        planType: {
            type: String,
            enum: ['daily', 'weekly', 'monthly', 'quarterly', 'half-yearly', 'yearly', 'none'],
            default: 'none',
        },
        activePlan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MealPlan",
            default: null,
            comment: "Current active monthly plan assigned to customer"
        },
        isActive: {
            type: Boolean,
            default: true,
        },

        // Audit fields
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true, // Automatically adds createdAt & updatedAt
    }
);

// ========================
// 🔹 Create and Export Model
// ========================
const User = mongoose.model('User', userSchema);

export default User;
