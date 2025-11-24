import Invoice from "../models/invoiceModel.js";
import Customer from "../models/customerModel.js";
import MealPlan from "../models/mealPlanModel.js";
import Order from "../models/orderModel.js";

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

        // Save invoice for meal plan payment
        const invoice = await Invoice.create({
            invoiceType: "mealPlan",
            customer: customerId,
            mealPlan: plan._id,
            subtotal: amountPaid,
            discount: 0,
            totalAmount: amountPaid,
            paymentMethod: "online", // Default for manual payment
            paymentStatus: "paid",
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

export const getAllInvoices = async (req, res) => {
    try {
        const { invoiceType } = req.query; // Filter by type: dish, tiffin, or mealPlan

        const query = invoiceType ? { invoiceType } : {};

        const invoices = await Invoice.find(query)
            .populate("customer", "name mobile email address tokenBalance")
            .populate("mealPlan", "totalPrice mealsPerDay pricePerMeal")
            .populate("order", "orderStatus paymentStatus")
            .populate("items.itemId")
            .sort({ createdAt: -1 }); // latest first

        res.json({
            success: true,
            count: invoices.length,
            data: invoices
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


/**
 * Get a single invoice by ID
 */
export const getInvoiceById = async (req, res) => {
    try {
        const { invoiceId } = req.params;

        const invoice = await Invoice.findById(invoiceId)
            .populate("customer", "name mobile email address tokenBalance")
            .populate("mealPlan", "totalPrice mealsPerDay pricePerMeal")
            .populate("order", "orderStatus paymentStatus")
            .populate("items.itemId");

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: "Invoice not found"
            });
        }

        res.json({
            success: true,
            data: invoice
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get invoices for a specific customer
export const getCustomerInvoices = async (req, res) => {
    try {
        const { customerId } = req.params;
        const { invoiceType } = req.query; // Optional filter by type

        const query = { customer: customerId };
        if (invoiceType) {
            query.invoiceType = invoiceType;
        }

        const invoices = await Invoice.find(query)
            .populate("order", "orderStatus paymentStatus")
            .populate("items.itemId")
            .populate("mealPlan", "totalPrice mealsPerDay pricePerMeal")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: invoices.length,
            data: invoices
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get invoices for the logged-in user
export const getMyInvoices = async (req, res) => {
    try {
        const userId = req.user._id;
        const { invoiceType } = req.query; // Optional filter by type

        const query = { customer: userId };
        if (invoiceType) {
            query.invoiceType = invoiceType;
        }

        const invoices = await Invoice.find(query)
            .populate("order", "orderStatus paymentStatus")
            .populate("items.itemId")
            .populate("mealPlan", "totalPrice mealsPerDay pricePerMeal")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: invoices.length,
            data: invoices
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};