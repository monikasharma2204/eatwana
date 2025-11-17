import Invoice from "../models/invoiceModel.js";
import Customer from "../models/customerModel.js";
import MealPlan from "../models/mealPlanModel.js";

export const addPayment = async (req, res) => {
    try {
        const { customerId, amountPaid } = req.body;

        const customer = await Customer.findById(customerId).populate("activePlan");
        if (!customer) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }

        const plan = customer.activePlan;
        if (!plan) {
            return res.status(400).json({ success: false, message: "Customer has no active plan" });
        }

        // Token calculation → based on price per meal
        const tokensCreated = Math.floor(amountPaid / plan.pricePerMeal);

        const previousBalance = customer.tokenBalance;
        const newBalance = previousBalance + tokensCreated;

        // Update customer balance
        customer.tokenBalance = newBalance;
        await customer.save();

        // Save invoice
        const invoice = await Invoice.create({
            customer: customerId,
            mealPlan: plan._id,
            amountPaid,
            tokensCreated,
            previousTokenBalance: previousBalance,
            newTokenBalance: newBalance
        });

        res.json({
            success: true,
            message: "Payment added & tokens updated",
            data: {
                invoice,
                updatedBalance: newBalance
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
