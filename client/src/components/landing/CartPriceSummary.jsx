
import React, { useState } from 'react';
import { Star, X, Copy, Check, ShoppingBag } from 'lucide-react';
import { useEffect } from 'react';

const CartPriceSummary = ({ cartItems, onTotalChange }) => {
    const calculateSubtotal = () => {
        return cartItems.reduce((sum, item) => {
            if (item.itemType === 'dish') {
                return sum + (item.price || 0);
            } else {
                const pricing = item?.tiffin?.pricing[item.selectedPlan];
                const price = pricing?.price || 0;
                const discount = pricing?.discount || 0;
                return sum + (price - (price * discount / 100));
            }
        }, 0);
    };


    const subtotal = calculateSubtotal();
    const gst = subtotal * 0.05;
    const delivery = 40;
    const total = subtotal + gst + delivery;

    useEffect(() => {
        onTotalChange(total);
    }, [total]);

    return (
        <div className="bg-third/5 rounded-xl p-6 shadow-md border border-third/10">
            <h3 className="text-xl font-bold text-third mb-4">Price Summary</h3>
            <div className="space-y-3">
                <div className="flex justify-between text-third/80">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-third/80">
                    <span>GST (5%)</span>
                    <span>₹{gst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-third/80">
                    <span>Delivery Charges</span>
                    <span>₹{delivery.toFixed(2)}</span>
                </div>
                <div className="border-t border-third/20 pt-3 mt-3">
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