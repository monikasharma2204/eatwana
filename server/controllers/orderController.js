import Order from "../models/orderModel.js";
import Dish from "../models/dishModel.js";
import { Tiffin } from "../models/tiffinModel.js";
import Subscription from "../models/subscriptionModel.js";

// ---------------------------
// PLACE ORDER
// ---------------------------
export const placeOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        console.log(req.body);

        const { items, address, paymentMethod, utrNumber } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "No items in order" });
        }

        if (paymentMethod === "upi" && !utrNumber) {
            return res.status(400).json({
                message: "UTR number is required for UPI payment"
            });
        }

        let total = 0;
        const processedItems = [];

        for (const item of items) {

            // ⭐ Convert lowercase to model names
            let convertedItemType =
                item.itemType === "dish"
                    ? "Dish"
                    : item.itemType === "tiffin"
                        ? "Tiffin"
                        : null;

            if (!convertedItemType) {
                return res.status(400).json({ message: "Invalid item type" });
            }

            // ⭐ Use the correct model according to converted type
            let product;

            if (convertedItemType === "Dish") {
                product = await Dish.findById(item.itemId);
            } else if (convertedItemType === "Tiffin") {
                product = await Tiffin.findById(item.itemId);
            }

            if (!product)
                return res.status(404).json({ message: "Item not found" });

            const price = item.price;
            total += price * (item.quantity || 1);

            processedItems.push({
                itemType: convertedItemType, // ⭐ store model name
                itemId: item.itemId,
                quantity: item.quantity || 1,
                selectedVariant: item.selectedVariant,
                price
            });

            // Auto-create subscription
            if (
                convertedItemType === "Tiffin" &&
                item.selectedVariant &&
                item.selectedVariant !== "oneTime"
            ) {
                await Subscription.create({
                    user: userId,
                    tiffin: item.itemId,
                    plan: item.selectedVariant,
                    price: item.price
                });
            }
        }

        const order = await Order.create({
            user: userId,
            items: processedItems,
            totalAmount: total,
            address,
            utrNumber: utrNumber || null,

            paymentStatus:
                paymentMethod === "upi" ? "paid" : "pending",

            upiPayment: {
                method: paymentMethod === "upi" ? "upi" : "cod",
                transactionId: utrNumber || null,
                qrEnabled: paymentMethod === "upi"
            }
        });

        return res.status(201).json({
            message: "Order placed successfully",
            order
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};



// ---------------------------
// UPDATE ORDER STATUS
// ---------------------------
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        order.orderStatus = status;
        await order.save();

        res.status(200).json({
            message: `Order status updated to ${status}`,
            order
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};


// ---------------------------
// GET USER ORDERS
// ---------------------------
export const getUserOrders = async (req, res) => {
    try {
        console.log(req.user)
        const orders = await Order.find({ user: req.user._id })
            .populate("items.itemId")
            .sort({ createdAt: -1 });
        res.status(200).json({ orders });

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};


// ---------------------------
// ALL ORDERS (Admin)
// ---------------------------
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user")
            .populate("items.itemId")
            .sort({ createdAt: -1 });

        res.status(200).json({ orders });

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

export const verifyUPIPayment = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { utrNumber } = req.body;

        if (!utrNumber) {
            return res.status(400).json({ message: "UTR number is required" });
        }

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        order.utrNumber = utrNumber;
        order.paymentStatus = "paid";
        order.upiPayment.transactionId = utrNumber;

        await order.save();

        res.status(200).json({
            message: "UPI payment verified",
            order
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
};
