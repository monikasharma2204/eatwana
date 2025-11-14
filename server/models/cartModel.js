import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
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
