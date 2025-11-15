import React, { useState } from 'react';
import { Star, X, Copy, Check, ShoppingBag } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import CartItem from '../../components/landing/CartItem';
import CartPriceSummary from '../../components/landing/CartPriceSummary';
import CartPaymentSection from '../../components/landing/CartPaymentSection';
import PaymentDialog from '../../ui/PaymentDialog';
import { clearCart, fetchCart, removeFromCart } from '../../services/cartAction';
import axiosClient from '../../services/axiosClient';
import AlertSnackbar from '../../ui/AlertSnackbar';
import { useEffect } from 'react';

const CartPage = () => {
    const [selectedPayment, setSelectedPayment] = useState('upi');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);

    const cartData = useSelector((state) => state.cart);
    const userAddress = useSelector((state) => state.auth?.user?.address);
    const dispatch = useDispatch();
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info",
    });

    const showSnackbar = (message, severity = "info") => {
        setSnackbar({ open: true, message, severity });
    };

    const handleClose = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    const handleRemoveItem = (itemId) => {
        dispatch(removeFromCart(itemId));
    };

    const handleCheckout = () => {
        if (cartData?.cart?.length === 0) return;
        setIsDialogOpen(true);
    };

    useEffect(() => {
        dispatch(fetchCart());
    }, [])

    const handleConfirmOrder = async (paymentData) => {
        try {
            // Validate address from payment dialog
            if (!paymentData.address || paymentData.address.trim().length < 10) {
                showSnackbar("Please provide a complete delivery address", "error");
                return;
            }

            // Prepare order data
            const orderData = {
                items: cartData.cart.map(item => ({
                    itemType: item.itemType || 'dish',

                    // ✅ FIXED: Send actual tiffin/dish ID, not cart item ID
                    itemId:
                        item.itemType === "tiffin"
                            ? item.tiffin?._id
                            : item.dish?._id,

                    quantity: item.quantity || 1,
                    selectedVariant: item.selectedPlan || null,
                    price: item.price
                })),

                address: paymentData.address, // ✅ Use address from dialog
                paymentMethod: selectedPayment,
                utrNumber: selectedPayment === 'upi' ? paymentData.utr : null
            };

            // Place order via API
            const response = await axiosClient.post("/api/v1/order/place", orderData);

            // Check if order was successful
            if (response.status == 201) {
                // Clear cart after successful order
                const clearResult = await dispatch(clearCart());

                if (clearResult.success) {
                    // Success notification
                    showSnackbar("Order confirmed successfully! ", "success");

                    // Close dialog
                    setIsDialogOpen(false);

                    // Optional: Navigate to success page
                    // navigate(`/order-success/${response.data.order._id}`);
                } else {
                    // Order placed but cart clear failed (non-critical)
                    console.warn('Order placed but failed to clear cart:', clearResult.message);
                    showSnackbar(`Order confirmed! But please refresh to update your cart.
Order ID: ${response.data.order?._id || 'N/A'}`, "success");
                    setIsDialogOpen(false);
                }
            } else {
                // Order failed
                showSnackbar(`Order failed: ${response.data.message || 'Unknown error'}`, "error");
            }
        } catch (error) {
            console.error('Order placement error:', error);

            // Better error handling
            const errorMessage = error.response?.data?.message
                || error.message
                || 'Failed to place order. Please try again.';

            showSnackbar(`Error: ${errorMessage}`, "error");
        }
    };

    return (
        <>
            <AlertSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                duration={8000}
                onClose={handleClose}
                position={{ vertical: "top", horizontal: "right" }}
            />
            <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
                <div className="container mx-auto px-4 py-8 max-w-7xl">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text mb-2">
                            Your Cart
                        </h1>
                        <p className="text-third/70 text-lg">
                            Total Items: <span className="font-semibold text-primary">{cartData?.cart?.length || 0}</span>
                        </p>
                    </div>

                    {!cartData?.cart || cartData.cart.length === 0 ? (
                        <div className="text-center py-20">
                            <ShoppingBag size={64} className="mx-auto text-third/30 mb-4" />
                            <h2 className="text-2xl font-semibold text-third/60">Your cart is empty</h2>
                            <p className="text-third/50 mt-2">Add some delicious items to get started!</p>
                        </div>
                    ) : (
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-4">
                                {cartData.cart.map((item) => (
                                    <CartItem key={item._id} item={item} onRemove={handleRemoveItem} />
                                ))}
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                <CartPriceSummary
                                    cartItems={cartData.cart}
                                    onTotalChange={setTotalAmount}
                                />
                                <CartPaymentSection
                                    selectedPayment={selectedPayment}
                                    onPaymentChange={setSelectedPayment}
                                    amount={totalAmount}
                                />
                            </div>
                        </div>
                    )}

                    {/* Checkout Button - Sticky on Mobile */}
                    {cartData?.cart && cartData.cart.length > 0 && (
                        <div className="fixed lg:static bottom-0 left-0 right-0 p-4 bg-white lg:bg-transparent border-t lg:border-0 border-third/10 lg:mt-8">
                            <button
                                onClick={handleCheckout}
                                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-full font-bold text-lg shadow-lg hover:scale-[1.03] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!cartData?.cart || cartData.cart.length === 0}
                            >
                                Proceed to Pay
                            </button>
                        </div>
                    )}
                </div>

                {/* Payment Dialog - Pass userAddress as initial value */}
                <PaymentDialog
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    selectedPayment={selectedPayment}
                    amount={totalAmount}
                    onConfirm={handleConfirmOrder}
                    userAddress={userAddress}
                />

                <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
            </div>
        </>
    );
};

export default CartPage;