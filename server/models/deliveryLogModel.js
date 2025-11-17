import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema({

    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },

    mealSlot: {
        type: String,
        enum: ["Breakfast", "Lunch", "Dinner"],
        required: true,
        comment: "Which meal was delivered"
    },

    date: {
        type: Date,
        required: true,
        comment: "Date and time of delivery"
    },

    status: {
        type: String,
        enum: ["Delivered", "Missed", "Cancelled"],
        default: "Delivered"
    },

    tokenUsed: {
        type: Number,
        default: 1,
        comment: "Each delivery consumes 1 token"
    }

}, { timestamps: true });

export default mongoose.model("Delivery", deliverySchema);
