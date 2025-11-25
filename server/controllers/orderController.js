import Order from "../models/orderModel.js";
import Dish from "../models/dishModel.js";
import { Tiffin } from "../models/tiffinModel.js";
import Subscription from "../models/subscriptionModel.js";
import Invoice from "../models/invoiceModel.js";
import MealPlan from "../models/mealPlanModel.js";
import Customer from "../models/customerModel.js";
import { generateMealPlanInvoiceEmail, sendOrderConfirmationEmail } from "../utils/orderConfirmationEmail.js";
// ---------------------------
// PLACE ORDER (Updated - No Invoice Generation)
// ---------------------------
export const placeOrder = async (req, res) => {
    try {
        const userId = req.user._id;

        const { items, address, paymentMethod, utrNumber } = req.body;

        // Validation
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
        const dishItems = [];
        const tiffinItems = [];
        const mealPlansToCreate = [];

        for (const item of items) {

            let convertedItemType =
                item.itemType === "dish"
                    ? "Dish"
                    : item.itemType === "tiffin"
                        ? "Tiffin"
                        : null;

            if (!convertedItemType) {
                return res.status(400).json({ message: "Invalid item type" });
            }

            let product;

            if (convertedItemType === "Dish") {
                product = await Dish.findById(item.itemId);
            } else if (convertedItemType === "Tiffin") {
                product = await Tiffin.findById(item.itemId);
            }

            if (!product) {
                console.error(`Product not found for ID: ${item.itemId}`);
                return res.status(404).json({ message: `Item not found: ${item.itemId}` });
            }


            const price = item.price;
            const quantity = item.quantity || 1;
            total += price * quantity;

            // ✅ FIXED: Handle deliveryTimings properly
            const deliveryTimings = item.deliveryTimings || [];

            processedItems.push({
                itemType: convertedItemType,
                itemId: item.itemId,
                quantity: quantity,
                selectedVariant: item.selectedVariant || null,
                deliveryTimings: deliveryTimings,
                price
            });

            // Separate dishes and tiffins
            if (convertedItemType === "Dish") {
                dishItems.push({
                    itemType: "Dish",
                    itemId: item.itemId,
                    itemName: product.name,
                    quantity: quantity,
                    unitPrice: price,
                    totalPrice: price * quantity,
                    selectedVariant: item.selectedVariant || null,
                    category: product.category
                });
            } else if (convertedItemType === "Tiffin") {
                tiffinItems.push({
                    itemType: "Tiffin",
                    itemId: item.itemId,
                    itemName: product.name,
                    quantity: quantity,
                    unitPrice: price,
                    totalPrice: price * quantity,
                    selectedVariant: item.selectedVariant || "oneTime",
                    deliveryTimings: deliveryTimings,
                    category: product.foodType
                });

                // ✅ FIXED: Create meal plans for subscription variants
                const isSubscription = item.selectedVariant &&
                    item.selectedVariant !== "oneTime" &&
                    item.selectedVariant !== "one-time";


                if (isSubscription && deliveryTimings.length > 0) {
                    mealPlansToCreate.push({
                        tiffinId: item.itemId,
                        selectedVariant: item.selectedVariant,
                        deliveryTimings: deliveryTimings,
                        price: price,
                        quantity: quantity
                    });
                }
            }
        }


        // Create order
        const order = await Order.create({
            user: userId,
            items: processedItems,
            totalAmount: total,
            address,
            utrNumber: utrNumber || null,
            paymentStatus: paymentMethod === "upi" ? "paid" : "pending",
            paymentMethod: paymentMethod,
            upiPayment: {
                method: paymentMethod === "upi" ? "upi" : "cod",
                transactionId: utrNumber || null,
                qrEnabled: paymentMethod === "upi"
            },
            dishItemsData: dishItems,
            tiffinItemsData: tiffinItems
        });


        // Create meal plans (WITHOUT generating invoices or tokens yet)
        const createdMealPlans = [];
        for (const mealPlanData of mealPlansToCreate) {
            try {

                const customer = await Customer.findById(userId);
                if (!customer) {
                    continue;
                }

                // Check for existing active plan
                const existingPlan = await MealPlan.findOne({
                    customer: userId,
                    tiffinMenu: mealPlanData.tiffinId,
                    isActive: true
                });

                if (existingPlan) {
                    continue;
                }

                const mealsPerDay = mealPlanData.deliveryTimings.length;
                const days = 30;
                const totalMeals = days * mealsPerDay;
                const totalPrice = mealPlanData.price;
                const pricePerMeal = totalPrice / totalMeals;


                const mealPlan = await MealPlan.create({
                    customer: userId,
                    tiffinMenu: mealPlanData.tiffinId,
                    mealSlots: mealPlanData.deliveryTimings.map(timing =>
                        timing.charAt(0).toUpperCase() + timing.slice(1)
                    ),
                    totalPrice: totalPrice,
                    amountPaid: 0,
                    mealsPerDay: mealsPerDay,
                    days: days,
                    totalMeals: totalMeals,
                    pricePerMeal: pricePerMeal,
                    tokensGenerated: 0,
                    isActive: false,
                    pendingApproval: true,
                    relatedOrder: order._id
                });
                createdMealPlans.push(mealPlan);
            } catch (error) {
                console.error(`Error creating meal plan: ${error.message}`);
                console.error(error.stack);
            }
        }



        return res.status(201).json({
            message: "Order placed successfully",
            order,
            mealPlans: createdMealPlans.length > 0 ? createdMealPlans : undefined,
            note: "Invoices and tokens will be generated when order status is updated and payment is confirmed"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};

// ---------------------------
// HELPER: Generate Dish Invoice
// ---------------------------
const generateDishInvoice = async (order) => {
    if (!order.dishItemsData || order.dishItemsData.length === 0) {
        return null;
    }

    const dishSubtotal = order.dishItemsData.reduce((sum, item) => sum + item.totalPrice, 0);

    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    const invoiceNumber = `DISH-${timestamp}-${random}`;

    const dishInvoice = await Invoice.create({
        invoiceType: "dish",
        customer: order.user,
        order: order._id,
        items: order.dishItemsData,
        subtotal: dishSubtotal,
        discount: 0,
        totalAmount: dishSubtotal,
        paymentMethod: order.paymentMethod,
        paymentStatus: "paid",
        utrNumber: order.utrNumber || null,
        deliveryAddress: order.address,
        invoiceNumber: invoiceNumber
    });

    return dishInvoice;
};

// ---------------------------
// HELPER: Generate Tiffin Invoice (One-Time Orders Only)
// ---------------------------
const generateTiffinInvoice = async (order) => {

    if (!order.tiffinItemsData || order.tiffinItemsData.length === 0) {
        console.log("No tiffin items data found");
        return null;
    }

    // Filter only one-time tiffin orders (not subscriptions)
    const oneTimeTiffinData = order.tiffinItemsData.filter(item => {
        const isOneTime = !item.selectedVariant ||
            item.selectedVariant === "oneTime" ||
            item.selectedVariant === "one-time";

        return isOneTime;
    });


    if (oneTimeTiffinData.length === 0) {
        return null;
    }

    const tiffinSubtotal = oneTimeTiffinData.reduce((sum, item) => sum + item.totalPrice, 0);

    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
    const invoiceNumber = `TIFFIN-${timestamp}-${random}`;

    const tiffinInvoice = await Invoice.create({
        invoiceType: "tiffin",
        customer: order.user,
        order: order._id,
        items: oneTimeTiffinData,
        subtotal: tiffinSubtotal,
        discount: 0,
        totalAmount: tiffinSubtotal,
        paymentMethod: order.paymentMethod,
        paymentStatus: "paid",
        utrNumber: order.utrNumber || null,
        deliveryAddress: order.address,
        invoiceNumber: invoiceNumber
    });

    console.log("✅ Tiffin invoice created:", tiffinInvoice._id);
    return tiffinInvoice;
};

// ---------------------------
// HELPER: Generate Meal Plan Invoices and Tokens
// ---------------------------
const generateMealPlanInvoicesAndTokens = async (order) => {

    const mealPlanInvoices = [];

    // Find all meal plans related to this order
    const relatedMealPlans = await MealPlan.find({
        relatedOrder: order._id,
        pendingApproval: true
    }).populate('tiffinMenu');
    for (const mealPlan of relatedMealPlans) {
        try {


            const customer = await Customer.findById(mealPlan.customer);
            if (!customer) {
                console.log(`Customer not found for meal plan ${mealPlan._id}`);
                continue;
            }

            // 🔒 BACKEND CALCULATIONS (Token-based)
            const amountPaid = mealPlan.totalPrice; // Full payment for the plan
            const tokensGenerated = Math.floor(amountPaid / mealPlan.pricePerMeal);
            const previousBalance = customer.tokenBalance || 0;
            const newBalance = previousBalance + tokensGenerated;

            // Update meal plan with tokens and activate it
            mealPlan.amountPaid = amountPaid;
            mealPlan.tokensGenerated = tokensGenerated;
            mealPlan.isActive = true;
            mealPlan.pendingApproval = false;
            await mealPlan.save();
            console.log("✅ Meal plan activated");

            // Update customer token balance and active plan
            customer.tokenBalance = newBalance;
            customer.activePlan = mealPlan._id;
            await customer.save();
            console.log("✅ Customer token balance updated");

            // 📄 CREATE MEAL PLAN INVOICE
            const invoice = await Invoice.create({
                invoiceType: "mealPlan",
                customer: customer._id,
                mealPlan: mealPlan._id,
                order: order._id,
                subtotal: mealPlan.totalPrice,
                discount: 0,
                totalAmount: amountPaid,
                paymentMethod: order.paymentMethod,
                paymentStatus: "paid",
                utrNumber: order.utrNumber || null,
                deliveryAddress: order.address,
                tokensCreated: tokensGenerated,
                previousTokenBalance: previousBalance,
                newTokenBalance: newBalance,
                notes: `Meal Plan Payment - ${mealPlan.mealsPerDay} meal(s) per day for ${mealPlan.days} days. Menu: ${mealPlan.tiffinMenu?.menuName || 'N/A'}.`
            });

            await invoice.populate([
                { path: 'customer', select: 'name mobile email' },
                { path: 'mealPlan', populate: { path: 'tiffinMenu', select: 'menuName menuType' } }
            ]);

            console.log(`✅ Meal plan invoice created: ${invoice._id}`);

            mealPlanInvoices.push({
                invoice,
                mealPlan,
                tokenInfo: {
                    tokensGenerated,
                    previousBalance,
                    newBalance
                }
            });

        } catch (error) {
            console.error(`Error generating meal plan invoice: ${error.message}`);
            console.error(error.stack);
        }
    }

    return mealPlanInvoices;
};

// ---------------------------
// UPDATE ORDER STATUS
// ---------------------------
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, paymentStatus } = req.body;

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        // Store previous values
        const previousOrderStatus = order.orderStatus;
        const previousPaymentStatus = order.paymentStatus;


        // Update order status
        order.orderStatus = status;

        // If paymentStatus is sent (COD), update it
        if (paymentStatus) {
            order.paymentStatus = paymentStatus;
        }

        const generatedInvoices = [];
        const mealPlanData = [];

        // -----------------------------
        // 🔍 LOGIC CONDITIONS
        // -----------------------------

        // CASE 1 ➜ COD: payment becomes paid for the first time
        const paymentJustConfirmed =
            previousPaymentStatus !== "paid" && order.paymentStatus === "paid";

        // CASE 2 ➜ Order becomes confirmed (for UPI)
        const orderJustConfirmed =
            previousOrderStatus !== "order_confirmed" && status === "order_confirmed";

        // FINAL DECISION:
        const shouldGenerateInvoice =
            (paymentJustConfirmed && order.orderStatus === "order_confirmed") ||
            (order.paymentMethod === "upi" &&
                order.paymentStatus === "paid" &&
                orderJustConfirmed);


        // -----------------------------
        // 📄 INVOICE GENERATION LOGIC
        // -----------------------------
        if (shouldGenerateInvoice) {
            console.log("\n=== STARTING INVOICE GENERATION ===");

            // Dish Invoice
            if (!order.dishInvoiceGenerated) {
                console.log("Checking dish invoice...");
                const dishInvoice = await generateDishInvoice(order);
                if (dishInvoice) {
                    generatedInvoices.push(dishInvoice);
                    order.dishInvoiceGenerated = true;
                    console.log("✅ Dish invoice generated:", dishInvoice._id);
                }
            }

            // Tiffin Invoice (One-Time Only)
            if (!order.tiffinInvoiceGenerated) {
                console.log("Checking tiffin invoice...");
                const tiffinInvoice = await generateTiffinInvoice(order);
                if (tiffinInvoice) {
                    generatedInvoices.push(tiffinInvoice);
                    order.tiffinInvoiceGenerated = true;
                    console.log("✅ Tiffin invoice generated:", tiffinInvoice._id);
                } else {
                    console.log("No tiffin invoice generated (no one-time tiffins)");
                }
            }

            // 🎟️ Meal Plan Invoices + Token Generation
            if (!order.mealPlanInvoiceGenerated) {
                console.log("Checking meal plan invoices...");
                const mealPlanInvoicesData = await generateMealPlanInvoicesAndTokens(order);
                if (mealPlanInvoicesData.length > 0) {
                    mealPlanInvoicesData.forEach(data => {
                        generatedInvoices.push(data.invoice);
                        mealPlanData.push({
                            mealPlanId: data.mealPlan._id,
                            tokensGenerated: data.tokenInfo.tokensGenerated,
                            previousBalance: data.tokenInfo.previousBalance,
                            newBalance: data.tokenInfo.newBalance
                        });
                    });
                    order.mealPlanInvoiceGenerated = true;
                    console.log(`✅ ${mealPlanInvoicesData.length} meal plan invoice(s) generated`);
                }
            }
        }

        // Save the updated order
        await order.save();
        // After generating invoices
        if (generatedInvoices.length > 0) {
            const customer = await Customer.findById(order.user);

            for (const invoice of generatedInvoices) {
                if (invoice.invoiceType === 'mealPlan') {
                    // Send meal plan email
                    const mealPlan = await MealPlan.findById(invoice.mealPlan).populate('tiffinMenu');
                    const emailData = {
                        customerName: customer.name,
                        invoiceId: invoice._id,
                        mealPlanDetails: {
                            menuName: mealPlan.tiffinMenu?.menuName,
                            mealsPerDay: mealPlan.mealsPerDay,
                            days: mealPlan.days,
                            totalMeals: mealPlan.totalMeals,
                            mealSlots: mealPlan.mealSlots
                        },
                        tokensGenerated: invoice.tokensCreated,
                        previousBalance: invoice.previousTokenBalance,
                        newBalance: invoice.newTokenBalance,
                        totalAmount: invoice.totalAmount,
                        paymentMethod: order.paymentMethod,
                        address: order.address,
                        utrNumber: order.utrNumber
                    };

                    const emailBody = generateMealPlanInvoiceEmail(emailData);
                    await sendMail({
                        to: customer.email,
                        subject: `Meal Plan Activated - ${tokensGenerated} Tokens Added | Eatwana`,
                        body: emailBody
                    });
                } else {
                    // Send regular order confirmation
                    await sendOrderConfirmationEmail(order, invoice, customer);
                }
            }
        }

        res.status(200).json({
            message: `Order status updated to ${status}`,
            order,
            invoicesGenerated: generatedInvoices.length > 0 ? generatedInvoices : undefined,
            mealPlanTokens: mealPlanData.length > 0 ? mealPlanData : undefined,
            invoiceNote: generatedInvoices.length > 0
                ? `${generatedInvoices.length} invoice(s) generated successfully`
                : "No invoice generated"
        });

    } catch (error) {

        console.error(error);
        res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};


// ---------------------------
// NEW ENDPOINT: Confirm Payment (for COD orders)
// ---------------------------
export const confirmPayment = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { utrNumber } = req.body; // Optional for COD

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        if (order.paymentStatus === "paid") {
            return res.status(400).json({ message: "Payment already confirmed" });
        }

        const previousPaymentStatus = order.paymentStatus;
        order.paymentStatus = "paid";

        if (utrNumber) {
            order.utrNumber = utrNumber;
        }

        const generatedInvoices = [];

        // Generate Dish Invoice if not already generated
        if (!order.dishInvoiceGenerated) {
            const dishInvoice = await generateDishInvoice(order);
            if (dishInvoice) {
                generatedInvoices.push(dishInvoice);
                order.dishInvoiceGenerated = true;
            }
        }

        // Generate Tiffin Invoice if not already generated
        if (!order.tiffinInvoiceGenerated) {
            const tiffinInvoice = await generateTiffinInvoice(order);
            if (tiffinInvoice) {
                generatedInvoices.push(tiffinInvoice);
                order.tiffinInvoiceGenerated = true;
            }
        }

        await order.save();

        res.status(200).json({
            message: "Payment confirmed successfully",
            order,
            invoicesGenerated: generatedInvoices.length > 0 ? generatedInvoices : undefined,
            invoiceNote: generatedInvoices.length > 0
                ? `${generatedInvoices.length} invoice(s) generated successfully`
                : undefined
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
        console.log("USER:", req.user);

        // Fetch Orders
        const orders = await Order.find({ user: req.user._id })
            .populate("items.itemId")
            .sort({ createdAt: -1 })
            .lean(); // important to modify results

        // For each order → find its invoice
        const ordersWithInvoice = await Promise.all(
            orders.map(async (order) => {
                const invoice = await Invoice.findOne({ order: order._id }).select("_id");
                return {
                    ...order,
                    invoiceId: invoice ? invoice._id : null
                };
            })
        );

        return res.status(200).json({ orders: ordersWithInvoice });

    } catch (error) {
        console.error("Error getUserOrders:", error);
        return res.status(500).json({ message: "Server Error" });
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
        console.log(error)
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
