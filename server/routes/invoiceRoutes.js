// routes/invoiceRoutes.js
import express from "express";
import { addPayment, getInvoiceById, getAllInvoices } from "../controllers/invoiceController.js";
import { adminAuth } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

// Add payment manually and generate tokens
router.post("/add-payment", adminAuth, addPayment);
// Get all invoices (latest first)
router.get("/all", adminAuth, getAllInvoices);

// Get invoice by ID
router.get("/:invoiceId", getInvoiceById);
export default router;
