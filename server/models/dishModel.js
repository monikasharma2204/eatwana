// models/Dish.js
import mongoose from "mongoose";

// Sub-schema for quantity options
const quantitySchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["quarter", "half", "full"],
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        discountPrice: {
            type: Number,
            default: 0,
        },
    },
    { _id: false }
);

const dishSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Dish name is required"],
            trim: true,
        },

        image: {
            type: String,
            required: [true, "Dish image is required"],
        },

        rating: {
            type: Number,
            default: 0,
            min: [0, "Rating cannot be less than 0"],
            max: [5, "Rating cannot be more than 5"],
        },

        category: {
            type: String,
            enum: ["veg", "non-veg"],
            required: [true, "Category (veg/non-veg) is required"],
        },

        subCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubCategory",
            required: [true, "Sub-category is required"],
        },

        // ✅ Meal type — Normal, Special, or Gym
        mealType: {
            type: String,
            enum: ["normal", "special", "gym"],
            default: "normal",
            required: [true, "Meal type is required"],
        },

        // 💡 Each dish can have multiple quantity options
        quantities: {
            type: [quantitySchema],
            validate: {
                validator: function (v) {
                    return v && v.length > 0;
                },
                message: "At least one quantity option is required",
            },
        },

        isAvailable: {
            type: Boolean,
            default: true,
        },

        description: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Dish", dishSchema);
