import React, { useState } from 'react';
import { Star, X, Copy, Check, ShoppingBag } from 'lucide-react';
import QRCodeGenerator from './QrCodeGenerator';

const CartPaymentSection = ({ selectedPayment, onPaymentChange, amount }) => {
    const paymentOptions = [
        { id: 'upi', label: 'UPI' },
        { id: 'cod', label: 'Cash on Delivery' }
    ];

    return (
        <div className="bg-white rounded-xl p-6 shadow-md border border-third/10">
            <h3 className="text-xl font-bold text-third mb-4">Payment Options</h3>
            <div className="flex flex-wrap gap-3 mb-6">
                {paymentOptions.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => onPaymentChange(option.id)}
                        className={`px-6 py-3 rounded-full font-medium transition-all ${selectedPayment === option.id
                            ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg scale-105'
                            : 'bg-third/10 text-third hover:bg-third/20'
                            }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            {selectedPayment === 'upi' && (
                <QRCodeGenerator
                    upiId="9430512545@ybl"
                    name="Tejasvi Kumar"
                    note="This is testing"
                    amount={amount}
                />
            )}
        </div>
    );
};

export default CartPaymentSection;