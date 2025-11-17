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
            amountPaid,
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

        // ❌ Prevent duplicate active meal plan with SAME MENU
        const existingPlan = await MealPlan.findOne({
            customer: customerId,
            tiffinMenu: tiffinMenuId,
            isActive: true
        });

        if (existingPlan) {
            return res.status(400).json({
                success: false,
                message: "Customer already has an active meal plan with this menu."
            });
        }

        // Basic calculations
        const days = 30;
        const totalMeals = days * mealsPerDay;
        const pricePerMeal = totalPrice / totalMeals;

        // Tokens generated from AMOUNT PAID
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

        // Create Invoice
        const invoice = await Invoice.create({
            customer: customerId,
            mealPlan: mealPlan._id,
            amountPaid,
            tokensCreated: tokensGenerated,
            previousTokenBalance: previousBalance,
            newTokenBalance: newBalance
        });

        res.status(201).json({
            success: true,
            message: "Meal plan created successfully",
            data: { mealPlan, invoice, updatedCustomer: customer }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const getMealPlanById = async (req, res) => {
    try {
        const { planId } = req.params;

        const mealPlan = await MealPlan.findById(planId)
            .populate("customer")          // customer details
            .populate("tiffinMenu");       // menu details

        if (!mealPlan) {
            return res.status(404).json({
                success: false,
                message: "Meal Plan not found"
            });
        }

        // Fetch all invoices related to this plan
        const invoices = await Invoice.find({ mealPlan: planId }).sort({ createdAt: -1 });

        res.json({
            success: true,
            data: {
                mealPlan,
                invoices
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


/**
 * Get all meal plans (admin dashboard view)
 */
export const getAllMealPlans = async (req, res) => {
    try {
        const mealPlans = await MealPlan.find()
            .populate("customer")        // full user info
            .populate("tiffinMenu")      // weekly menu
            .sort({ createdAt: -1 });    // latest first

        res.json({
            success: true,
            count: mealPlans.length,
            data: mealPlans
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const updateMealPlan = async (req, res) => {
    try {
        const { planId } = req.params;

        const {
            totalPrice,
            additionalAmountPaid,   // NEW PAYMENT
            mealsPerDay,
            mealSlots
        } = req.body;

        // Fetch meal plan
        const mealPlan = await MealPlan.findById(planId);
        if (!mealPlan) {
            return res.status(404).json({
                success: false,
                message: "Meal Plan not found"
            });
        }

        const customer = await Customer.findById(mealPlan.customer);
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        // Update editable fields
        if (totalPrice) mealPlan.totalPrice = totalPrice;
        if (mealsPerDay) mealPlan.mealsPerDay = mealsPerDay;
        if (mealSlots) mealPlan.mealSlots = mealSlots;

        // Recalculate based on updated fields
        mealPlan.days = 30;
        mealPlan.totalMeals = mealPlan.days * mealPlan.mealsPerDay;
        mealPlan.pricePerMeal = mealPlan.totalPrice / mealPlan.totalMeals;

        let tokensGenerated = 0;
        let invoice = null;

        /**
         * If admin adds payment
         */
        if (additionalAmountPaid && additionalAmountPaid > 0) {
            // Add payment to total paid amount
            mealPlan.amountPaid = mealPlan.amountPaid + additionalAmountPaid;

            // Calculate tokens generated from NEW payment
            tokensGenerated = Math.floor(additionalAmountPaid / mealPlan.pricePerMeal);

            const previousBalance = customer.tokenBalance;
            const newBalance = previousBalance + tokensGenerated;

            // Update customer tokens
            customer.tokenBalance = newBalance;
            await customer.save();

            // Create new invoice record
            invoice = await Invoice.create({
                customer: customer._id,
                mealPlan: mealPlan._id,
                amountPaid: additionalAmountPaid,
                tokensCreated: tokensGenerated,
                previousTokenBalance: previousBalance,
                newTokenBalance: newBalance
            });
        }

        // Save updated plan
        await mealPlan.save();

        res.json({
            success: true,
            message: "Meal plan updated successfully",
            data: {
                mealPlan,
                invoice: invoice || null
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};