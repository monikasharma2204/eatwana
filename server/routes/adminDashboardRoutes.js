import express from "express";
import { getAdminDashboard } from "../controllers/adminDashboardController.js";
import { adminAuth } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

router.get("/get", getAdminDashboard);

export default router;