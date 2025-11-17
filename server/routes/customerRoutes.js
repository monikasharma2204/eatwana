// routes/customerRoutes.js
import express from "express";
import { createCustomer, getAllCustomers } from "../controllers/customerController.js";

const router = express.Router();

// Create a new customer
router.post("/create", createCustomer);

// Get all customers
router.get("/all", getAllCustomers);

export default router;
