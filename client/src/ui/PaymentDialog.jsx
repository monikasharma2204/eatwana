import React, { useEffect, useState } from 'react';
import { X, Check, Smartphone, Banknote, AlertCircle, MapPin } from 'lucide-react';

const PaymentDialog = ({ isOpen, onClose, selectedPayment, amount, onConfirm, userAddress }) => {
    const [utr, setUtr] = useState('');
    const [address, setAddress] = useState(userAddress || '');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (userAddress) {
            setAddress(userAddress);
        }
    }, [userAddress]);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        setError('');

        if (!address.trim()) {
            setError('Please enter your delivery address');
            return;
        }

        if (address.trim().length < 10) {
            setError('Please enter a complete delivery address (minimum 10 characters)');
            return;
        }

        if (selectedPayment === 'upi' && !utr.trim()) {
            setError('Please enter your UTR Number');
            return;
        }

        if (selectedPayment === 'upi' && utr.trim().length < 6) {
            setError('UTR Number should be at least 6 characters');
            return;
        }

        setIsProcessing(true);

        try {
            await onConfirm({
                utr: selectedPayment === 'upi' ? utr.trim() : null,
                address: address.trim()
            });

            setUtr('');
            setAddress('');
            setError('');
        } catch (err) {
            setError('Failed to process order. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleClose = () => {
        if (!isProcessing) {
            setUtr('');
            setAddress(userAddress || '');
            setError('');
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white sticky top-0 z-10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {selectedPayment === 'upi' ? <Smartphone className="w-6 h-6" /> : <Banknote className="w-6 h-6" />}
                            <h2 className="text-2xl font-bold">
                                {selectedPayment === 'upi' ? 'UPI Payment' : 'Cash on Delivery'}
                            </h2>
                        </div>
                        <button onClick={handleClose} disabled={isProcessing} className="p-1 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {error && (
                        <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
                            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 text-center">
                        <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                        <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                            ₹{amount.toFixed(2)}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                            <MapPin className="w-4 h-4" />
                            Delivery Address <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={address}
                            onChange={(e) => {
                                setAddress(e.target.value);
                                setError('');
                            }}
                            placeholder="Enter your complete delivery address including house number, street, landmark, city, and pincode"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:outline-none transition-colors resize-none"
                            rows={4}
                            disabled={isProcessing}
                        />
                        <p className="text-xs text-gray-500">
                            Please provide a complete address for accurate delivery
                        </p>
                    </div>

                    {selectedPayment === 'upi' ? (
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700">
                                Enter Your UTR Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={utr}
                                onChange={(e) => {
                                    setUtr(e.target.value);
                                    setError('');
                                }}
                                placeholder="Enter 12-digit UTR Number"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
                                disabled={isProcessing}
                            />
                            <div className="space-y-1">
                                <p className="text-xs text-gray-600">✓ Complete your payment via UPI app first</p>
                                <p className="text-xs text-gray-600">✓ Find UTR in your transaction history</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-green-900">Cash on Delivery Selected</p>
                                    <p className="text-sm text-green-700 mt-1">
                                        Pay with cash when your order arrives at your doorstep.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={handleClose}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                            disabled={isProcessing}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={isProcessing || !address.trim() || (selectedPayment === 'upi' && !utr.trim())}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Check className="w-5 h-5" />
                                    Confirm Order
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default PaymentDialog;