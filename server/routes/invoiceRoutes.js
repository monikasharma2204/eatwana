// routes/invoiceRoutes.js
import express from "express";
import { addPayment } from "../controllers/invoiceController.js";

const router = express.Router();

// Add payment manually and generate tokens
router.post("/add-payment", addPayment);

export default router;
