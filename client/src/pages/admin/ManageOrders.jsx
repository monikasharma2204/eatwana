import React, { useState, useEffect } from 'react';
import { Search, Package, Edit2, X, ChevronDown, ChevronUp, FileText, CheckCircle, DollarSign, Eye, IndianRupee } from 'lucide-react';
import axiosClient from '../../services/axiosClient';

// Alert Snackbar Component
const AlertSnackbar = ({ open, message, severity, onClose, position, duration }) => {
    useEffect(() => {
        if (open) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [open, duration, onClose]);

    if (!open) return null;

    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
        warning: 'bg-yellow-500'
    };

    return (
        <div className={`fixed ${position.vertical}-4 ${position.horizontal}-4 z-50`}>
            <div className={`${colors[severity]} text-white px-6 py-3 rounded-lg shadow-lg`}>
                {message}
            </div>
        </div>
    );
};

// Payment Confirmation Modal Component
const PaymentConfirmationModal = ({ isOpen, onClose, order, onConfirm }) => {
    const [utrNumber, setUtrNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const willGenerateInvoice = () => {
        if (!order) return { dish: false, tiffin: false };

        const hasDish = order.dishItemsData && order.dishItemsData.length > 0;
        const hasTiffin = order.tiffinItemsData && order.tiffinItemsData.length > 0;

        return {
            dish: hasDish && !order.dishInvoiceGenerated,
            tiffin: hasTiffin && !order.tiffinInvoiceGenerated
        };
    };

    const invoiceStatus = willGenerateInvoice();
    const showInvoiceAlert = invoiceStatus.dish || invoiceStatus.tiffin;

    const handleConfirm = async () => {
        setIsLoading(true);
        await onConfirm(order._id, utrNumber);
        setIsLoading(false);
        setUtrNumber('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Confirm Payment</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Package size={16} className="text-gray-600" />
                        <label className="text-sm font-medium text-gray-700">
                            Order ID: {order?._id.slice(-8)}
                        </label>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                        Payment Method: <span className="font-medium capitalize">{order?.upiPayment?.method}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                        Total Amount: <span className="font-medium">₹{order?.totalAmount?.toLocaleString('en-IN')}</span>
                    </div>
                </div>

                {showInvoiceAlert && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-2">
                            <FileText size={18} className="text-primary mt-0.5 flex-shrink-0" />
                            <div className="text-sm">
                                <p className="font-medium text-blue-800 mb-1">Invoice Generation Alert</p>
                                <p className="text-secondary">
                                    {invoiceStatus.dish && invoiceStatus.tiffin && "Both Dish and Tiffin invoices will be generated after payment confirmation."}
                                    {invoiceStatus.dish && !invoiceStatus.tiffin && "Dish invoice will be generated after payment confirmation."}
                                    {!invoiceStatus.dish && invoiceStatus.tiffin && "Tiffin invoice will be generated after payment confirmation."}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {order?.upiPayment?.method === 'upi' && (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            UTR/Transaction Number (Optional)
                        </label>
                        <input
                            type="text"
                            value={utrNumber}
                            onChange={(e) => setUtrNumber(e.target.value)}
                            placeholder="Enter UTR number if available"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                Processing...
                            </>
                        ) : (
                            <>
                                <CheckCircle size={18} />
                                Confirm Payment
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

// OrderStatusModal Component
const OrderStatusModal = ({ isOpen, onClose, order, onConfirm }) => {
    const [selectedStatus, setSelectedStatus] = useState(order?.orderStatus || 'pending');
    const [isLoading, setIsLoading] = useState(false);
    const statusOptions = [
        { value: 'pending', label: 'Pending' },
        { value: 'order_confirmed', label: 'Order Confirmed' },
        { value: 'preparing', label: 'Preparing' },
        { value: 'dispatch', label: 'Dispatch' },
        { value: 'on_the_way', label: 'On The Way' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' }
    ];

    const handleConfirm = async () => {
        setIsLoading(true);
        await onConfirm(order._id, selectedStatus, order?.paymentStatus);
        setIsLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Update Order Status</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Package size={16} className="text-gray-600" />
                        <label className="text-sm font-medium text-gray-700">
                            Order ID: {order?._id.slice(-8)}
                        </label>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">
                        Payment Status: <span className="font-medium capitalize">{order?.paymentStatus}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                        Current Status: <span className="font-medium capitalize">{order?.orderStatus.replace('_', ' ')}</span>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Status
                    </label>
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                Updating...
                            </>
                        ) : (
                            <>
                                <CheckCircle size={18} />
                                Confirm
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
// OrderDetailsModal Component
const OrderDetailsModal = ({ isOpen, onClose, order }) => {
    if (!isOpen || !order) return null;

    const formatDate = (date) => {
        return new Date(date).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full my-8">
                {/* Header */}
                <div className="bg-primary text-white p-6 rounded-t-xl flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-bold">Order Details</h3>
                        <p className="text-blue-100 text-sm mt-1">Order ID: {order._id}</p>
                    </div>
                    <button onClick={onClose} className="text-white hover:bg-secondary p-2 rounded-lg transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {/* Customer Information */}
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <Package size={20} className="text-primary" />
                            Customer Information
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Name</p>
                                <p className="font-medium text-gray-800">{order.user?.name || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="font-medium text-gray-800">{order.user?.email || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Phone</p>
                                <p className="font-medium text-gray-800">{order.user?.phone || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Customer ID</p>
                                <p className="font-medium text-gray-800">{order.user?._id || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Order Items</h4>
                        <div className="space-y-3">
                            {order.items?.map((item, idx) => (
                                <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-3 py-1 text-xs bg-blue-100 text-secondary rounded-full font-medium">
                                                    {item.itemType}
                                                </span>
                                            </div>
                                            <p className="font-semibold text-gray-800 text-lg">{item.itemId?.name || 'N/A'}</p>
                                            <div className="mt-2 space-y-1">
                                                {item.itemType === 'Dish' && (
                                                    <p className="text-sm text-gray-600">Quantity: <span className="font-medium">{item.quantity}</span></p>
                                                )}
                                                {item.selectedVariant && (
                                                    <p className="text-sm text-gray-600">Variant: <span className="font-medium">{item.selectedVariant}</span></p>
                                                )}
                                                {item.deliveryTimings && item.deliveryTimings.length > 0 && (
                                                    <p className="text-sm text-gray-600">
                                                        Delivery Timings: <span className="font-medium capitalize">{item.deliveryTimings.join(', ')}</span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-gray-800">₹{item.price?.toLocaleString('en-IN')}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment & Order Status */}
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-gray-600 mb-3">Payment Information</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Status:</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                                        order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                        {order.paymentStatus?.toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Method:</span>
                                    <span className="font-medium text-gray-800 capitalize">{order.paymentMethod}</span>
                                </div>
                                {order.utrNumber && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">UTR Number:</span>
                                        <span className="font-medium text-gray-800">{order.utrNumber}</span>
                                    </div>
                                )}
                                {order.upiPayment?.transactionId && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Transaction ID:</span>
                                        <span className="font-medium text-gray-800 text-sm">{order.upiPayment.transactionId}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-gray-600 mb-3">Order Status</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Current Status:</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                                        order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                                            order.orderStatus === 'on_the_way' ? 'bg-indigo-100 text-indigo-800' :
                                                order.orderStatus === 'preparing' ? 'bg-orange-100 text-orange-800' :
                                                    'bg-blue-100 text-blue-800'
                                        }`}>
                                        {order.orderStatus?.replace('_', ' ').toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Order Date:</span>
                                    <span className="font-medium text-gray-800 text-sm">{formatDate(order.createdAt)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Last Updated:</span>
                                    <span className="font-medium text-gray-800 text-sm">{formatDate(order.updatedAt)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Invoice Status */}
                    <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-600 mb-3">Invoice Status</h4>
                        <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${order.dishInvoiceGenerated ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <span className="text-sm text-gray-700">Dish Invoice: {order.dishInvoiceGenerated ? 'Generated' : 'Not Generated'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${order.tiffinInvoiceGenerated ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <span className="text-sm text-gray-700">Tiffin Invoice: {order.tiffinInvoiceGenerated ? 'Generated' : 'Not Generated'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${order.mealPlanInvoiceGenerated ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <span className="text-sm text-gray-700">Meal Plan Invoice: {order.mealPlanInvoiceGenerated ? 'Generated' : 'Not Generated'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-600 mb-3">Delivery Address</h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-800">{order.address}</p>
                        </div>
                    </div>

                    {/* Total Amount */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-gray-800">Total Amount</span>
                            <span className="text-2xl font-bold text-primary">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 p-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

// OrderItemsDropdown Component
const OrderItemsDropdown = ({ items }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 text-primary hover:text-secondary font-medium"
            >
                {items.length} {items.length === 1 ? 'item' : 'items'}
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {isOpen && (
                <div className="absolute left-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[250px] p-3">
                    {items.map((item, idx) => (
                        <div key={idx} className="py-2 border-b last:border-b-0">
                            <div className="flex justify-between items-start gap-3">
                                <div className="flex-1">
                                    <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded mb-1">
                                        {item.itemType}
                                    </span>
                                    <p className="font-medium text-gray-800">{item.itemId?.name || 'N/A'}</p>
                                    <p className="text-sm text-gray-600">
                                        {item.itemType === 'Dish' ? `Qty: ${item.quantity}` : `Plan: ${item.selectedVariant}`}
                                    </p>
                                    {item.selectedVariant && item.itemType === 'Dish' && (
                                        <p className="text-sm text-gray-600">Variant: {item.selectedVariant}</p>
                                    )}
                                </div>
                                <p className="font-semibold text-gray-800">₹{item.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
// Add this component to your existing file

const ViewOrderModal = ({ isOpen, onClose, order }) => {
    if (!isOpen || !order) return null;

    const formatDate = (date) => {
        return new Date(date).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full my-8">
                {/* Header */}
                <div className="bg-primary text-white p-6 rounded-t-xl flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-bold">Order Details</h3>
                        <p className="text-blue-100 text-sm mt-1">Order ID: {order._id}</p>
                    </div>
                    <button onClick={onClose} className="text-white hover:bg-secondary p-2 rounded-lg transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {/* Customer Information */}
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <Package size={20} className="text-primary" />
                            Customer Information
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Name</p>
                                <p className="font-medium text-gray-800">{order.user?.name || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="font-medium text-gray-800">{order.user?.email || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Phone</p>
                                <p className="font-medium text-gray-800">{order.user?.phone || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Customer ID</p>
                                <p className="font-medium text-gray-800">{order.user?._id || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Order Items</h4>
                        <div className="space-y-3">
                            {order.items?.map((item, idx) => (
                                <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-3 py-1 text-xs bg-blue-100 text-secondary rounded-full font-medium">
                                                    {item.itemType}
                                                </span>
                                            </div>
                                            <p className="font-semibold text-gray-800 text-lg">{item.itemId?.name || 'N/A'}</p>
                                            <div className="mt-2 space-y-1">
                                                {item.itemType === 'Dish' && (
                                                    <p className="text-sm text-gray-600">Quantity: <span className="font-medium">{item.quantity}</span></p>
                                                )}
                                                {item.selectedVariant && (
                                                    <p className="text-sm text-gray-600">Variant: <span className="font-medium">{item.selectedVariant}</span></p>
                                                )}
                                                {item.deliveryTimings && item.deliveryTimings.length > 0 && (
                                                    <p className="text-sm text-gray-600">
                                                        Delivery Timings: <span className="font-medium capitalize">{item.deliveryTimings.join(', ')}</span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-gray-800">₹{item.price?.toLocaleString('en-IN')}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment & Order Status */}
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-gray-600 mb-3">Payment Information</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Status:</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                                        order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                        {order.paymentStatus?.toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Method:</span>
                                    <span className="font-medium text-gray-800 capitalize">{order.paymentMethod}</span>
                                </div>
                                {order.utrNumber && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">UTR Number:</span>
                                        <span className="font-medium text-gray-800">{order.utrNumber}</span>
                                    </div>
                                )}
                                {order.upiPayment?.transactionId && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Transaction ID:</span>
                                        <span className="font-medium text-gray-800 text-sm">{order.upiPayment.transactionId}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-gray-600 mb-3">Order Status</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Current Status:</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
                                        order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                                            order.orderStatus === 'on_the_way' ? 'bg-indigo-100 text-indigo-800' :
                                                order.orderStatus === 'preparing' ? 'bg-orange-100 text-orange-800' :
                                                    'bg-blue-100 text-blue-800'
                                        }`}>
                                        {order.orderStatus?.replace('_', ' ').toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Order Date:</span>
                                    <span className="font-medium text-gray-800 text-sm">{formatDate(order.createdAt)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Last Updated:</span>
                                    <span className="font-medium text-gray-800 text-sm">{formatDate(order.updatedAt)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Invoice Status */}
                    <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-600 mb-3">Invoice Status</h4>
                        <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${order.dishInvoiceGenerated ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <span className="text-sm text-gray-700">Dish Invoice: {order.dishInvoiceGenerated ? 'Generated' : 'Not Generated'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${order.tiffinInvoiceGenerated ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <span className="text-sm text-gray-700">Tiffin Invoice: {order.tiffinInvoiceGenerated ? 'Generated' : 'Not Generated'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${order.mealPlanInvoiceGenerated ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                <span className="text-sm text-gray-700">Meal Plan Invoice: {order.mealPlanInvoiceGenerated ? 'Generated' : 'Not Generated'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-600 mb-3">Delivery Address</h4>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-800">{order.address}</p>
                        </div>
                    </div>

                    {/* Total Amount */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-gray-800">Total Amount</span>
                            <span className="text-2xl font-bold text-primary">₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 p-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
// Main ManageOrders Component
const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [paymentFilter, setPaymentFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

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

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        filterOrders();
    }, [searchTerm, statusFilter, paymentFilter, orders]);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const response = await axiosClient.get('/api/v1/order/all');
            setOrders(response.data.orders);
            setFilteredOrders(response.data.orders);
        } catch (error) {
            showSnackbar('Failed to fetch orders', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const filterOrders = () => {
        let filtered = [...orders];

        if (searchTerm) {
            filtered = filtered.filter(order =>
                order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.user.phone.includes(searchTerm) ||
                order._id.includes(searchTerm)
            );
        }

        if (statusFilter !== 'all') {
            filtered = filtered.filter(order => order.orderStatus === statusFilter);
        }

        if (paymentFilter !== 'all') {
            filtered = filtered.filter(order => order.paymentStatus === paymentFilter);
        }

        setFilteredOrders(filtered);
    };

    const handleConfirmPayment = async (orderId, utrNumber) => {
        try {
            const response = await axiosClient.put(`/api/v1/order/payment/${orderId}`, { utrNumber });

            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order._id === orderId ? { ...order, paymentStatus: 'paid', utrNumber: utrNumber || order.utrNumber } : order
                )
            );

            const invoiceMessage = response.data.invoicesGenerated
                ? ` ${response.data.invoiceNote}`
                : '';

            showSnackbar(`Payment confirmed successfully!${invoiceMessage}`, 'success');
            setIsPaymentModalOpen(false);
        } catch (error) {
            showSnackbar('Failed to confirm payment', 'error');
        }
    };

    const handleUpdateStatus = async (orderId, newStatus, paymentStatus) => {
        try {

            const response = await axiosClient.put(`/api/v1/order/status/${orderId}`, { status: newStatus, paymentStatus });

            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order._id === orderId ? { ...order, orderStatus: newStatus } : order
                )
            );

            const invoiceMessage = response.data.invoicesGenerated
                ? ` ${response.data.invoiceNote}`
                : '';

            showSnackbar(`Order updated successfully!${invoiceMessage}`, 'success');
            setIsModalOpen(false);
        } catch (error) {
            showSnackbar('Failed to update order', 'error');
        }
    };

    const getPaymentBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800',
            paid: 'bg-green-100 text-green-800',
            failed: 'bg-red-100 text-red-800'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const getOrderStatusBadge = (status) => {
        const styles = {
            pending: 'bg-gray-100 text-gray-800',
            order_confirmed: 'bg-blue-100 text-blue-800',
            preparing: 'bg-orange-100 text-orange-800',
            dispatch: 'bg-violet-100 text-violet-800',
            on_the_way: 'bg-indigo-100 text-indigo-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };

        const labels = {
            pending: 'Pending',
            order_confirmed: 'Order Confirmed',
            preparing: 'Preparing',
            dispatch: 'Dispatch',
            on_the_way: 'On The Way',
            delivered: 'Delivered',
            cancelled: 'Cancelled'
        };

        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
                {labels[status]}
            </span>
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Package className="text-primary" size={32} />
                        <h1 className="text-3xl font-bold text-gray-800">All Orders</h1>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-1">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Search by name, email, phone, or ID..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full rounded-full border border-gray-300 pl-12 pr-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all">All Order Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="order_confirmed">Order Confirmed</option>
                                    <option value="preparing">Preparing</option>
                                    <option value="dispatch">Dispatch</option>
                                    <option value="on_the_way">On The Way</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>

                            <div>
                                <select
                                    value={paymentFilter}
                                    onChange={(e) => setPaymentFilter(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="all">All Payment Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                    <option value="failed">Failed</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Items</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Method</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-800">{order.user.name}</p>
                                                {/* <p className="text-sm text-gray-600">{order.user.email}</p> */}
                                                <p className="text-sm text-gray-500">{order.user.mobile}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <OrderItemsDropdown items={order.items} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-gray-800">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getPaymentBadge(order.paymentStatus)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-700 capitalize">{order.paymentMethod}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getOrderStatusBadge(order.orderStatus)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                {/* Add this View button */}
                                                <button
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setIsViewModalOpen(true);
                                                    }}
                                                    className="flex items-center gap-2 px-3 py-2 bg-third text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                                                >
                                                    <Eye size={16} />
                                                    View
                                                </button>

                                                {order.paymentStatus !== 'paid' && (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedOrder(order);
                                                            setIsPaymentModalOpen(true);
                                                        }}
                                                        className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                                                    >
                                                        <IndianRupee size={16} />
                                                        Confirm Payment
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors text-sm"
                                                >
                                                    <Edit2 size={16} />
                                                    Update Status
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredOrders.length === 0 && (
                        <div className="text-center py-12">
                            <Package className="mx-auto text-gray-400 mb-4" size={48} />
                            <p className="text-gray-600">No orders found</p>
                        </div>
                    )}
                </div>
            </div>

            <OrderStatusModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                order={selectedOrder}
                onConfirm={handleUpdateStatus}
            />

            <PaymentConfirmationModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                order={selectedOrder}
                onConfirm={handleConfirmPayment}
            />

            <AlertSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                duration={4000}
                onClose={handleClose}
                position={{ vertical: "top", horizontal: "right" }}
            />
            <ViewOrderModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                order={selectedOrder}
            />
        </div>
    );
};

export default ManageOrders;