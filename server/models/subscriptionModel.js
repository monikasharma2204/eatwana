import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },

    tiffin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tiffin",
        required: true
    },

    plan: {
        type: String,
        enum: ["monthly", "quarterly", "halfYearly", "annual"],
        required: true
    },

    price: { type: Number, required: true },

    startDate: { type: Date, default: Date.now },
    nextDelivery: { type: Date, default: Date.now },

    isActive: {
        type: Boolean,
        default: true
    },

    status: {
        type: String,
        enum: ["active", "paused", "expired", "cancelled"],
        default: "active"
    }

}, { timestamps: true });

export default mongoose.model("Subscription", subscriptionSchema);
