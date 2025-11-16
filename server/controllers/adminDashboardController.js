import User from "../models/userModel.js";
import Order from "../models/orderModel.js";
import Subscription from "../models/subscriptionModel.js";
import Dish from "../models/dishModel.js";
import { Tiffin } from "../models/tiffinModel.js";
import Enquiry from "../models/enquiryModel.js";

export const getAdminDashboard = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // === BASIC COUNTS === //
        const totalUsers = await User.countDocuments();
        const totalDishes = await Dish.countDocuments();
        const totalTiffins = await Tiffin.countDocuments();
        const totalEnquiries = await Enquiry.countDocuments();

        const totalSubscriptions = await Subscription.countDocuments();
        const activeSubscriptions = await Subscription.countDocuments({
            status: "active",
            isActive: true,
        });

        // === ORDERS === //
        const totalOrders = await Order.countDocuments();

        const orders = await Order.find();

        const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

        const todaysRevenue = orders
            .filter(o => new Date(o.createdAt) >= today)
            .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

        // === ORDER STATUS OVERVIEW === //
        const statusList = [
            "pending",
            "order_confirmed",
            "preparing",
            "dispatch",
            "on_the_way",
            "delivered",
            "cancelled"
        ];

        const ordersByStatus = {};

        for (let status of statusList) {
            ordersByStatus[status] = await Order.countDocuments({ orderStatus: status });
        }

        // === REVENUE - LAST 7 DAYS GRAPH === //
        const last7days = [];
        let datePointer = new Date();
        datePointer.setHours(0, 0, 0, 0);

        for (let i = 0; i < 7; i++) {
            const dayStart = new Date(datePointer);
            const dayEnd = new Date(datePointer);
            dayEnd.setHours(23, 59, 59, 999);

            const dayOrders = await Order.find({
                createdAt: { $gte: dayStart, $lte: dayEnd },
            });

            const dayRevenue = dayOrders.reduce((s, o) => s + o.totalAmount, 0);

            last7days.push({
                date: dayStart.toISOString().slice(0, 10),
                revenue: dayRevenue,
            });

            datePointer.setDate(datePointer.getDate() - 1);
        }

        // === MONTHLY ORDERS === //
        const currentYear = new Date().getFullYear();
        const monthlyOrders = [];

        for (let month = 0; month < 12; month++) {
            const start = new Date(currentYear, month, 1);
            const end = new Date(currentYear, month + 1, 0);

            const count = await Order.countDocuments({
                createdAt: { $gte: start, $lte: end }
            });

            monthlyOrders.push({
                month: month + 1,
                orders: count,
            });
        }

        // === PENDING ENQUIRIES === //
        const pendingEnquiries = await Enquiry.find().sort({ createdAt: -1 }).limit(10);

        // === FINAL RESPONSE === //
        res.status(200).json({
            success: true,
            message: "Admin dashboard overview",
            data: {
                users: {
                    totalUsers,
                },

                orders: {
                    totalOrders,
                    totalRevenue,
                    todaysRevenue,
                    ordersByStatus,
                    monthlyOrders,
                },

                subscriptions: {
                    totalSubscriptions,
                    activeSubscriptions,
                },

                items: {
                    totalDishes,
                    totalTiffins,
                },

                enquiries: {
                    totalEnquiries,
                    recent: pendingEnquiries,
                },

                graphs: {
                    last7daysRevenue: last7days.reverse(),
                }
            }
        });

    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({
            success: false,
            message: "Error loading dashboard",
            error: error.message
        });
    }
};
