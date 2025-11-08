// models/SubCategory.js
import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Sub-category name is required"],
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("SubCategory", subCategorySchema);
