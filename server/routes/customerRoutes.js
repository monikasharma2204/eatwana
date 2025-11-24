// routes/customerRoutes.js
import express from "express";
import { createCustomer, getAllCustomers, deleteCustomer, updateCustomer, signup, login, forgotPassword, verifyOtp, validateUser, getAllUsers } from "../controllers/customerController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Automatic
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.get('/validate', authMiddleware, validateUser);
router.get('/get/all', getAllUsers);



// Manual Creation 
// Create a new customer
router.post("/create", createCustomer);

// Get all customers
router.get("/all", getAllCustomers);
router.put("/update/:id", updateCustomer);
router.delete("/delete/:id", deleteCustomer);

export default router;
