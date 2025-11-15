import express from "express";
import {
    addToCart,
    getCart,
    updateCartItem,
    removeFromCart,
    clearCart
} from "../controllers/cartController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/add", authMiddleware, addToCart);
router.get("/get", authMiddleware, getCart);
router.put("/:cartItemId", authMiddleware, updateCartItem);
router.delete("/remove/:cartItemId", authMiddleware, removeFromCart);
router.delete("/clear", authMiddleware, clearCart);

export default router;
