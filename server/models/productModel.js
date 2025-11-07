import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        // 🔹 Basic Info
        name: {
            type: String,
            required: [true, "Dish name is required"],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },

        // 🔹 Category: Veg / Non-Veg
        category: {
            type: String,
            enum: ["Veg", "Non-Veg"],
            required: [true, "Please specify dish category"],
        },

        // 🔹 Pricing
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price must be positive"],
        },
        discount: {
            type: Number,
            default: 0, // discount in percentage (e.g. 10 for 10%)
            min: [0, "Discount cannot be negative"],
            max: [100, "Discount cannot exceed 100%"],
        },
        discountedPrice: {
            type: Number,
            default: function () {
                return this.price - (this.price * this.discount) / 100;
            },
        },

        // 🔹 Image
        image: {
            type: String,
            required: [true, "Dish image is required"],
        },

        // 🔹 Ratings
        rating: {
            average: {
                type: Number,
                default: 0,
                min: [0, "Rating cannot be below 0"],
                max: [5, "Rating cannot exceed 5"],
            },
            totalReviews: {
                type: Number,
                default: 0,
            },
        },

        // 🔹 Availability
        isAvailable: {
            type: Boolean,
            default: true,
        },

        // 🔹 Tags (e.g., spicy, sweet, popular)
        tags: {
            type: [String],
            default: [],
        },

        // 🔹 Admin Reference
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
        },
    },
    {
        timestamps: true, // adds createdAt & updatedAt
    }
);

// 🔹 Auto-update discountedPrice when price/discount changes
dishSchema.pre("save", function (next) {
    if (this.isModified("price") || this.isModified("discount")) {
        this.discountedPrice = this.price - (this.price * this.discount) / 100;
    }
    next();
});

export default mongoose.model("Product", productSchema);
