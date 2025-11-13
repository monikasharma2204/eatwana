import mongoose from "mongoose";

const dishSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: {
        type: String,
        enum: ["Veg", "Non-Veg"],
        required: true,
    }
});

const tiffinMenuSchema = new mongoose.Schema(
    {
        // Name of weekly menu
        menuName: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        // Overall tag → Pure-Veg / Includes-Non-Veg
        menuType: {
            type: String,
            enum: ["Pure-Veg", "Includes-Non-Veg"],
            default: "Pure-Veg",
        },

        // Full week
        week: [
            {
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

                meals: {
                    Breakfast: { type: [dishSchema], default: [] },
                    Lunch: { type: [dishSchema], default: [] },
                    Dinner: { type: [dishSchema], default: [] }
                },

                note: { type: String, trim: true }
            }
        ]
    },
    { timestamps: true }
);

export default mongoose.model("TiffinMenu", tiffinMenuSchema);
