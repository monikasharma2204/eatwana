import Subscription from "../models/subscriptionModel.js";

// CREATE SUBSCRIPTION
export const createSubscription = async (req, res) => {
    try {
        const { user, tiffin, plan, price, startDate, nextDelivery } = req.body;

        if (!user || !tiffin || !plan || !price) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const subscription = await Subscription.create({
            user,
            tiffin,
            plan,
            price,
            startDate,
            nextDelivery
        });

        res.status(201).json({
            message: "Subscription created successfully",
            subscription
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create subscription",
            error: error.message
        });
    }
};


// GET ALL SUBSCRIPTIONS
export const getAllSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription
            .find()
            .populate("user")
            .populate("tiffin")
            .sort({ createdAt: -1 });

        res.json(subscriptions);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch subscriptions",
            error: error.message
        });
    }
};


// GET SUBSCRIPTION BY ID
export const getSubscriptionById = async (req, res) => {
    try {
        const subscription = await Subscription
            .findById(req.params.id)
            .populate("user")
            .populate("tiffin");

        if (!subscription) {
            return res.status(404).json({ message: "Subscription not found" });
        }

        res.json(subscription);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch subscription",
            error: error.message
        });
    }
};


// UPDATE SUBSCRIPTION
export const updateSubscription = async (req, res) => {
    try {
        const updatedSubscription = await Subscription.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedSubscription) {
            return res.status(404).json({ message: "Subscription not found" });
        }

        res.json({
            message: "Subscription updated successfully",
            subscription: updatedSubscription
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update subscription",
            error: error.message
        });
    }
};


// DELETE SUBSCRIPTION
export const deleteSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findByIdAndDelete(req.params.id);

        if (!subscription) {
            return res.status(404).json({ message: "Subscription not found" });
        }

        res.json({ message: "Subscription deleted successfully" });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete subscription",
            error: error.message
        });
    }
};
