import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true,
        },

        itemType: {
            type: String,
            enum: ["dish", "tiffin"],
            required: true,
        },

        dish: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Dish",
            default: null,
        },

        tiffin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tiffin",
            default: null,
        },

        // For Dishes → selected quantity option
        selectedQuantity: {
            type: String, // e.g., "half", "full", "large"
            default: null,
        },

        // For Tiffin → selected plan
        selectedPlan: {
            type: String, // e.g., "oneTime", "monthly"
            default: null,
        },

        // For Tiffin → delivery timings (array for multiple timings)
        deliveryTimings: {
            type: [String],
            enum: ["breakfast", "lunch", "dinner"],
            default: [],
            comment: "Delivery timings for tiffin: can include breakfast, lunch, and/or dinner"
        },

        // Final price after discount
        price: {
            type: Number,
            required: true,
        },

        quantity: {
            type: Number,
            default: 1,
            min: 1,
        }
    },
    { timestamps: true }
);

export const CartItem = mongoose.model("Cart", cartSchema);
