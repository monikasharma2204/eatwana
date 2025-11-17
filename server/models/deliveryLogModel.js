import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema({

    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },

    mealPlan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MealPlan",
        required: true,
        comment: "Which meal plan this delivery belongs to"
    },

    tiffinMenu: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TiffinMenu",
        required: true,
        comment: "Menu followed for this delivery"
    },

    mealSlot: {
        type: String,
        enum: ["Breakfast", "Lunch", "Dinner"],
        required: true
    },

    quantity: {
        type: Number,
        required: true,
        default: 1,
        comment: "How many meals/thalis delivered"
    },

    tokenUsed: {
        type: Number,
        required: true,
        comment: "Tokens deducted = quantity"
    },

    date: {
        type: Date,
        required: true,
        default: Date.now
    },

    status: {
        type: String,
        enum: ["Delivered", "Missed", "Cancelled"],
        default: "Delivered"
    }

}, { timestamps: true });

export default mongoose.model("Delivery", deliverySchema);
