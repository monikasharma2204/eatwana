import { CartItem } from "../models/cartModel.js";
import Dish from "../models/dishModel.js";
import { Tiffin } from "../models/tiffinModel.js";

// -----------------------------------------------------
// Add Item to Cart
// -----------------------------------------------------
export const addToCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { itemType } = req.body;

        if (!["dish", "tiffin"].includes(itemType)) {
            return res.status(400).json({ message: "Invalid item type" });
        }

        let price = 0;
        let cartData = {
            user: userId,
            itemType,
        };

        // ---------------------------
        // Case 1: Add Dish
        // ---------------------------
        if (itemType === "dish") {

            const dish = await Dish.findById(req.body.dish);
            if (!dish) return res.status(404).json({ message: "Dish not found" });

            const selectedQtyOption = dish.quantities.find(
                (q) => q.type === req.body.selectedQuantity
            );
            if (!selectedQtyOption)
                return res.status(400).json({ message: "Invalid quantity option" });

            // 🔍 Check if dish with same quantity already exists
            const existingDish = await CartItem.findOne({
                user: userId,
                itemType: "dish",
                dish: dish._id,
                selectedQuantity: req.body.quantityType,
            });

            if (existingDish) {
                return res.status(400).json({
                    success: false,
                    message: "This dish (same quantity) is already in your cart.",
                });
            }

            price = selectedQtyOption.discountPrice || selectedQtyOption.price;

            cartData = {
                ...cartData,
                dish: dish._id,
                selectedQuantity: req.body.quantityType,
                price,
            };
        }

        // ---------------------------
        // Case 2: Add Tiffin
        // ---------------------------
        if (itemType === "tiffin") {
            const { tiffinId, plan, deliveryTimings } = req.body;

            const tiffin = await Tiffin.findById(tiffinId);
            if (!tiffin) return res.status(404).json({ message: "Tiffin not found" });

            if (!tiffin.pricing[plan])
                return res.status(400).json({ message: "Invalid plan selected" });

            // Validate delivery timings (array)
            if (!deliveryTimings || !Array.isArray(deliveryTimings) || deliveryTimings.length === 0) {
                return res.status(400).json({ message: "Please select at least one delivery timing (breakfast, lunch, or dinner)" });
            }

            // Validate each timing
            const validTimings = ["breakfast", "lunch", "dinner"];
            const invalidTimings = deliveryTimings.filter(t => !validTimings.includes(t));
            if (invalidTimings.length > 0) {
                return res.status(400).json({ message: `Invalid delivery timings: ${invalidTimings.join(", ")}` });
            }

            // Remove duplicates and sort
            const uniqueTimings = [...new Set(deliveryTimings)].sort();
            const timingCount = uniqueTimings.length;

            // Handle oneTime plan differently (simple pricing structure)
            let pricingInfo;
            if (plan === "oneTime") {
                // For oneTime plan, use simple pricing structure
                pricingInfo = tiffin.pricing.oneTime;
                if (!pricingInfo || !pricingInfo.price || pricingInfo.price === 0) {
                    return res.status(400).json({ message: `Pricing not configured for oneTime plan` });
                }
            } else {
                // For other plans, use timing-based pricing
                const timingCountKey = timingCount === 1 ? "oneTime" : timingCount === 2 ? "twoTime" : "threeTime";
                pricingInfo = tiffin.pricing[plan]?.[timingCountKey];
                if (!pricingInfo || !pricingInfo.price || pricingInfo.price === 0) {
                    return res.status(400).json({ message: `Pricing not configured for ${plan} plan with ${timingCount} timing(s)` });
                }
            }

            // 🔍 Check if tiffin with same plan and timings already exists
            // Sort timings for comparison
            const existingTiffin = await CartItem.findOne({
                user: userId,
                itemType: "tiffin",
                tiffin: tiffinId,
                selectedPlan: plan,
            });

            if (existingTiffin) {
                // Check if timings match (sort both for comparison)
                const existingTimings = (existingTiffin.deliveryTimings || []).sort().join(",");
                const newTimings = uniqueTimings.join(",");
                
                if (existingTimings === newTimings) {
                    return res.status(400).json({
                        success: false,
                        message: "This tiffin (same plan and timings) is already in your cart.",
                    });
                }
            }

            const basePrice = pricingInfo.price;
            const discount = pricingInfo.discount || 0;
            const discountAmount = (basePrice * discount) / 100;

            price = basePrice - discountAmount;

            cartData = {
                ...cartData,
                tiffin: tiffinId,
                selectedPlan: plan,
                deliveryTimings: uniqueTimings,
                price,
            };
        }

        // Save new cart item
        const newItem = await CartItem.create(cartData);

        res.status(201).json({
            success: true,
            message: "Item added to cart",
            cartItem: newItem,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to add item",
            error: error.message,
        });
    }
};


// -----------------------------------------------------
// Get User Cart
// -----------------------------------------------------
export const getCart = async (req, res) => {
    try {
        const cart = await CartItem.find({ user: req.user._id })
            .populate("dish")
            .populate("tiffin");

        res.status(200).json({
            totalItems: cart.length,
            cart
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch cart", error: error.message });
    }
};

// -----------------------------------------------------
// Update Cart Item Quantity
// -----------------------------------------------------
export const updateCartItem = async (req, res) => {
    try {
        const { cartItemId } = req.params;
        const { quantity } = req.body;

        const item = await CartItem.findById(cartItemId);

        if (!item) return res.status(404).json({ message: "Cart item not found" });

        item.quantity = quantity;
        await item.save();

        res.json({ message: "Cart updated", item });

    } catch (error) {
        res.status(500).json({ message: "Failed to update cart", error: error.message });
    }
};

// -----------------------------------------------------
// Remove Item from Cart
// -----------------------------------------------------
export const removeFromCart = async (req, res) => {
    try {
        const { cartItemId } = req.params;

        await CartItem.findByIdAndDelete(cartItemId);

        res.json({ message: "Item removed from cart" });

    } catch (error) {
        res.status(500).json({ message: "Failed to remove item", error: error.message });
    }
};
export const clearCart = async (req, res) => {
    try {
        await CartItem.deleteMany({ user: req.user._id });

        res.json({ message: "Cart cleared successfully" });

    } catch (error) {
        res.status(500).json({
            message: "Failed to clear cart",
            error: error.message
        });
    }
};
