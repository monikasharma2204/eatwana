import Delivery from "../models/deliveryLogModel.js";
import Customer from "../models/customerModel.js";

export const markMealDelivered = async (req, res) => {
    try {
        const { customerId, mealSlot } = req.body;

        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        // Create delivery record
        const delivery = await Delivery.create({
            customer: customerId,
            mealSlot,
            date: new Date(),
            status: "Delivered",
            tokenUsed: 1
        });

        // Reduce token balance
        customer.tokenBalance -= 1;
        await customer.save();

        res.json({
            success: true,
            message: "Meal delivered & token deducted",
            data: {
                delivery,
                newTokenBalance: customer.tokenBalance
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
