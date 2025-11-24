
import React, { useState } from 'react';
import { Star, X, Copy, Check, ShoppingBag } from 'lucide-react';
import { useEffect } from 'react';
const CartPriceSummary = ({ cartItems, onTotalChange }) => {
    const calculateSubtotal = () => {
        return cartItems.reduce((sum, item) => {
            // Use the price directly from cart item (already calculated on backend)
            return sum + (item.price || 0);
        }, 0);
    };

    const subtotal = calculateSubtotal();
    const total = subtotal;

    useEffect(() => {
        onTotalChange(total);
    }, [total, onTotalChange]);

    return (
        <div className="bg-gray-50 rounded-xl p-6 shadow-md border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Price Summary</h3>
            <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-300 pt-3 mt-3">
                    <div className="flex justify-between text-xl font-bold text-primary">
                        <span>Total Amount</span>
                        <span>₹{total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPriceSummary