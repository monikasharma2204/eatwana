// routes/invoiceRoutes.js
import express from "express";
import { 
    addPayment, 
    getInvoiceById, 
    getAllInvoices, 
    getCustomerInvoices,
    getMyInvoices 
} from "../controllers/invoiceController.js";
import { adminAuth } from "../middleware/adminAuthMiddleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Add payment manually and generate tokens (Admin only)
router.post("/add-payment", adminAuth, addPayment);

// Get all invoices (Admin only) - can filter by type: ?invoiceType=dish|tiffin|mealPlan
router.get("/all", adminAuth, getAllInvoices);

// Get invoices for a specific customer (Admin only)
router.get("/customer/:customerId", adminAuth, getCustomerInvoices);

// Get my invoices (Customer - authenticated)
router.get("/my-invoices", authMiddleware, getMyInvoices);

// Get invoice by ID (Public - but can add auth if needed)
router.get("/get/:invoiceId", getInvoiceById);

export default router;
