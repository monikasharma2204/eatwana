import MealPlan from "../models/mealPlanModel.js";
import Customer from "../models/customerModel.js";
import Invoice from "../models/invoiceModel.js";


export const createMealPlan = async (req, res) => {
    try {
        const {
            customerId,
            tiffinMenuId,
            mealSlots,
            totalPrice,
            amountPaid,   // NEW FIELD
            mealsPerDay
        } = req.body;

        // Validate customer exists
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        // Basic calculations
        const days = 30;
        const totalMeals = days * mealsPerDay;

        // Price per meal based on full-plan pricing
        const pricePerMeal = totalPrice / totalMeals;

        // Tokens based on actual amount paid
        const tokensGenerated = Math.floor(amountPaid / pricePerMeal);

        // Create meal plan
        const mealPlan = await MealPlan.create({
            customer: customerId,
            tiffinMenu: tiffinMenuId,
            mealSlots,
            totalPrice,
            amountPaid,
            mealsPerDay,
            days,
            totalMeals,
            pricePerMeal,
            tokensGenerated,
            isActive: true
        });

        // Update customer token balance
        const previousBalance = customer.tokenBalance || 0;
        const newBalance = previousBalance + tokensGenerated;

        customer.tokenBalance = newBalance;
        customer.activePlan = mealPlan._id;
        await customer.save();

        // Create Invoice for initial payment
        const invoice = await Invoice.create({
            customer: customerId,
            mealPlan: mealPlan._id,
            amountPaid: amountPaid,
            tokensCreated: tokensGenerated,
            previousTokenBalance: previousBalance,
            newTokenBalance: newBalance
        });

        res.status(201).json({
            success: true,
            message: "Meal plan created and invoice generated",
            data: {
                mealPlan,
                invoice,
                updatedCustomer: customer
            }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
