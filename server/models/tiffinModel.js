import mongoose from "mongoose";

const tiffinSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Tiffin name is required"],
            trim: true,
            enum: ["Normal", "Premium", "Deluxe"], // You can expand if needed
        },

        type: {
            type: String,
            enum: ["Veg", "Non-Veg"],
            required: [true, "Tiffin type is required"],
        },

        description: {
            type: String,
            trim: true,
        },

        basePrice: {
            type: Number,
            required: [true, "Base price is required"],
            min: 0,
        },

        discount: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },

        discountedPrice: {
            type: Number,
            default: function () {
                return this.basePrice - (this.basePrice * this.discount) / 100;
            },
        },

        image: {
            type: String,
            required: [true, "Image is required"],
        },

        isAvailable: {
            type: Boolean,
            default: true,
        },

        // To link menu and subscriptions
        menus: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "TiffinMenu",
            },
        ],

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
        },
    },
    { timestamps: true }
);

// Auto update discounted price
tiffinSchema.pre("save", function (next) {
    if (this.isModified("basePrice") || this.isModified("discount")) {
        this.discountedPrice = this.basePrice - (this.basePrice * this.discount) / 100;
    }
    next();
});

export default mongoose.model("Tiffin", tiffinSchema);
