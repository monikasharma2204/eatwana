// routes/customerRoutes.js
import express from "express";
import { createCustomer, getAllCustomers, deleteCustomer, updateCustomer } from "../controllers/customerController.js";

const router = express.Router();

// Create a new customer
router.post("/create", createCustomer);

// Get all customers
router.get("/all", getAllCustomers);
router.put("/update/:id", updateCustomer);
router.delete("/delete/:id", deleteCustomer);

export default router;
