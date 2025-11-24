import MealPlan from "../models/mealPlanModel.js";
import Customer from "../models/customerModel.js";
import Invoice from "../models/invoiceModel.js";
import TiffinMenu from "../models/tiffinMenuModel.js";


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

        // Validate tiffin menu exists
        const tiffinMenu = await TiffinMenu.findById(tiffinMenuId);
        if (!tiffinMenu) {
            return res.status(404).json({
                success: false,
                message: "Tiffin menu not found"
            });
        }

        // Prevent duplicate active meal plan with SAME MENU
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

        // 🔒 BACKEND CALCULATIONS (Security Layer)
        const days = 30;
        const totalMeals = days * mealsPerDay;
        const pricePerMeal = totalPrice / totalMeals;

        // TOKEN GENERATION LOGIC (Server-side only)
        const tokensGenerated = Math.floor(amountPaid / pricePerMeal);
        const remainingAmount = totalPrice - amountPaid;

        // Validation: Amount paid cannot exceed total price
        if (amountPaid > totalPrice) {
            return res.status(400).json({
                success: false,
                message: "Amount paid cannot exceed total plan price"
            });
        }

        // Validation: Amount paid must be positive
        if (amountPaid <= 0) {
            return res.status(400).json({
                success: false,
                message: "Amount paid must be greater than zero"
            });
        }

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

        // 📄 CREATE INVOICE ACCORDING TO NEW SCHEMA
        const invoice = await Invoice.create({
            // Invoice type for meal plan
            invoiceType: "mealPlan",

            // Customer reference
            customer: customerId,

            // Meal plan reference
            mealPlan: mealPlan._id,

            // Amount details
            subtotal: totalPrice,
            discount: 0,
            totalAmount: amountPaid, // Amount actually paid in this transaction

            // Payment information (default to pending until payment confirmed)
            paymentMethod: "cod", // You can make this dynamic based on user selection
            paymentStatus: "paid", // Since they've paid, mark as paid

            // Token information (for meal plan invoices)
            tokensCreated: tokensGenerated,
            previousTokenBalance: previousBalance,
            newTokenBalance: newBalance,

            // Additional notes
            notes: `Meal Plan Payment - ${mealsPerDay} meal(s) per day for ${days} days. Menu: ${tiffinMenu.menuName}. Remaining balance: ₹${remainingAmount.toFixed(2)}`
        });

        // Populate the invoice with customer and meal plan details
        await invoice.populate([
            { path: 'customer', select: 'name mobile email' },
            { path: 'mealPlan', populate: { path: 'tiffinMenu', select: 'menuName menuType' } }
        ]);

        res.status(201).json({
            success: true,
            message: "Meal plan created successfully",
            data: {
                mealPlan,
                invoice,
                updatedCustomer: {
                    _id: customer._id,
                    name: customer.name,
                    tokenBalance: customer.tokenBalance,
                    activePlan: customer.activePlan
                },
                calculations: {
                    totalMeals,
                    pricePerMeal: pricePerMeal.toFixed(2),
                    tokensGenerated,
                    remainingAmount: remainingAmount.toFixed(2),
                    previousBalance,
                    newBalance
                }
            }
        });

    } catch (error) {
        console.error("Error creating meal plan:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to create meal plan"
        });
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

export const approveMealPlan = async (req, res) => {
    try {
        const { mealPlanId } = req.params;
        const { amountPaid, paymentMethod, utrNumber } = req.body;

        const mealPlan = await MealPlan.findById(mealPlanId);
        if (!mealPlan) {
            return res.status(404).json({
                success: false,
                message: "Meal plan not found"
            });
        }

        if (mealPlan.isActive && !mealPlan.pendingApproval) {
            return res.status(400).json({
                success: false,
                message: "Meal plan already approved"
            });
        }

        const customer = await Customer.findById(mealPlan.customer);
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        const tokensGenerated = Math.floor(amountPaid / mealPlan.pricePerMeal);

        mealPlan.amountPaid = amountPaid;
        mealPlan.tokensGenerated = tokensGenerated;
        mealPlan.isActive = true;
        mealPlan.pendingApproval = false;
        await mealPlan.save();

        const previousBalance = customer.tokenBalance || 0;
        const newBalance = previousBalance + tokensGenerated;

        customer.tokenBalance = newBalance;
        customer.activePlan = mealPlan._id;
        await customer.save();

        const timestamp = Date.now().toString().slice(-8);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
        const invoiceNumber = `MEAL-${timestamp}-${random}`;

        const invoice = await Invoice.create({
            invoiceType: "mealPlan",
            customer: mealPlan.customer,
            order: mealPlan.relatedOrder || null,
            mealPlan: mealPlan._id,
            items: [],
            subtotal: amountPaid,
            discount: 0,
            totalAmount: amountPaid,
            paymentMethod: paymentMethod || "cod",
            paymentStatus: paymentMethod === "upi" ? "paid" : "pending",
            utrNumber: utrNumber || null,
            tokensCreated: tokensGenerated,
            previousTokenBalance: previousBalance,
            newTokenBalance: newBalance,
            invoiceNumber: invoiceNumber
        });

        if (mealPlan.relatedOrder) {
            await Order.findByIdAndUpdate(mealPlan.relatedOrder, {
                paymentStatus: paymentMethod === "upi" ? "paid" : "pending"
            });
        }

        res.status(200).json({
            success: true,
            message: "Meal plan approved and activated successfully",
            data: {
                mealPlan,
                invoice,
                updatedCustomer: {
                    tokenBalance: customer.tokenBalance,
                    activePlan: customer.activePlan
                }
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};

export const getPendingMealPlans = async (req, res) => {
    try {
        const pendingPlans = await MealPlan.find({
            pendingApproval: true,
            isActive: false
        })
            .populate('customer', 'name email phone')
            .populate('tiffinMenu', 'name description')
            .populate('relatedOrder')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: pendingPlans.length,
            data: pendingPlans
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};

export const rejectMealPlan = async (req, res) => {
    try {
        const { mealPlanId } = req.params;
        const { reason } = req.body;

        const mealPlan = await MealPlan.findById(mealPlanId);
        if (!mealPlan) {
            return res.status(404).json({
                success: false,
                message: "Meal plan not found"
            });
        }

        if (!mealPlan.pendingApproval) {
            return res.status(400).json({
                success: false,
                message: "Meal plan is not pending approval"
            });
        }

        await MealPlan.findByIdAndDelete(mealPlanId);

        res.status(200).json({
            success: true,
            message: "Meal plan rejected and deleted",
            reason: reason || "No reason provided"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message
        });
    }
};