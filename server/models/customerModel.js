import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    // Basic customer info
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String },
    address: { type: String },

    // Current token balance (can be negative)
    tokenBalance: {
        type: Number,
        default: 0,
        comment: "Total remaining meal tokens for the customer"
    },

    // Active plan
    activePlan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MealPlan",
        default: null,
        comment: "Current active monthly plan assigned to customer"
    }

}, { timestamps: true });

export default mongoose.model("Customer", customerSchema);
