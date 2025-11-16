import express from "express";
import {
    createSubscription,
    getAllSubscriptions,
    getSubscriptionById,
    updateSubscription,
    deleteSubscription
} from "../controllers/subscriptionController.js";

const router = express.Router();

router.post("/add", createSubscription);
router.get("/all", getAllSubscriptions);
router.get("/:id", getSubscriptionById);
router.put("/:id", updateSubscription);
router.delete("/:id", deleteSubscription);

export default router;
