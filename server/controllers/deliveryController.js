import Delivery from "../models/deliveryLogModel.js";
import Customer from "../models/customerModel.js";

export const markMealDelivered = async (req, res) => {
    try {
        const { customerId, mealSlot, quantity } = req.body;

        const customer = await Customer.findById(customerId).populate("activePlan");
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        const activePlan = customer.activePlan;
        if (!activePlan) {
            return res.status(400).json({
                success: false,
                message: "Customer has no active meal plan."
            });
        }

        const tokensToReduce = quantity || 1;

        // Create delivery record
        const delivery = await Delivery.create({
            customer: customerId,
            mealPlan: activePlan._id,
            tiffinMenu: activePlan.tiffinMenu,
            mealSlot,
            quantity: tokensToReduce,
            tokenUsed: tokensToReduce,
            date: new Date(),
            status: "Delivered"
        });

        // Deduct tokens
        customer.tokenBalance -= tokensToReduce;
        await customer.save();

        res.json({
            success: true,
            message: "Meal delivered and tokens consumed",
            data: {
                delivery,
                newTokenBalance: customer.tokenBalance
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllDeliveries = async (req, res) => {
    try {
        const deliveries = await Delivery.find()
            .populate("customer", "name mobile address tokenBalance")
            .populate("mealPlan", "mealsPerDay totalPrice pricePerMeal")
            .populate("tiffinMenu", "menuName menuType")
            .sort({ date: -1 });

        res.json({
            success: true,
            count: deliveries.length,
            data: deliveries
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


/**
 * Get deliveries of a SINGLE customer
 */
export const getDeliveriesByCustomer = async (req, res) => {
    try {
        const { customerId } = req.params;

        const deliveries = await Delivery.find({ customer: customerId })
            .populate("customer", "name mobile address tokenBalance")
            .populate("mealPlan", "mealsPerDay totalPrice pricePerMeal")
            .populate("tiffinMenu", "menuName menuType")
            .sort({ date: -1 });

        res.json({
            success: true,
            count: deliveries.length,
            data: deliveries
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};