import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    // Basic customer info
    name: { 
        type: String, 
        required: true,
        trim: true,
    },
    mobile: { 
        type: String, 
        required: true,
        trim: true,
    },
    email: { 
        type: String,
        lowercase: true,
        trim: true,
    },
    address: { 
        type: String,
        default: '',
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        default: "Eatwana@123",
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
    otp: {
        type: Number
    },
    otpExpiry: {
        type: Date
    },
    // Current token balance (can be negative)
    tokenBalance: {
        type: Number,
        default: 0,
        comment: "Total remaining meal tokens for the customer"
    },

    // For tiffin customers
    planType: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'quarterly', 'half-yearly', 'yearly', 'none'],
        default: 'none',
    },
    
    // Active plan
    activePlan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MealPlan",
        default: null,
        comment: "Current active monthly plan assigned to customer"
    },
    
    isActive: {
        type: Boolean,
        default: true,
    }

}, { timestamps: true });

export default mongoose.model("Customer", customerSchema);
