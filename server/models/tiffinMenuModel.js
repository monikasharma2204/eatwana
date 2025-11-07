import mongoose from "mongoose";

const tiffinMenuSchema = new mongoose.Schema(
    {
        tiffin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tiffin",
            required: true,
        },

        day: {
            type: String,
            enum: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
            ],
            required: true,
        },

        mealType: {
            type: String,
            enum: ["Breakfast", "Lunch", "Dinner"],
            required: true,
        },

        // List of dishes for that meal
        dishes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Dish", // from the Dish model
                required: true,
            },
        ],

        // Optional notes (e.g., “served with salad and chutney”)
        note: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("TiffinMenu", tiffinMenuSchema);
