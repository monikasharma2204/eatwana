import React, { useState, useEffect } from 'react';
import { Package, MapPin, CreditCard, Clock, CheckCircle, XCircle, Truck, ChefHat, ShoppingBag, Circle } from 'lucide-react';
import axiosClient from '../../services/axiosClient';
import { useNavigate } from 'react-router-dom';

// Mock data - replace with actual API call
const mockOrders = [
    {
        _id: '507f1f77bcf86cd799439011',
        items: [
            {
                itemType: 'dish',
                itemId: {
                    name: 'Butter Chicken',
                    images: ['https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400'],
                    foodType: 'Non-Veg'
                },
                quantity: 2,
                selectedVariant: 'Full',
                price: 350
            },
            {
                itemType: 'tiffin',
                itemId: {
                    name: 'Premium Monthly Tiffin',
                    planType: 'monthly'
                },
                quantity: 1,
                price: 3500
            }
        ],
        totalAmount: 4200,
        paymentStatus: 'paid',
        orderStatus: 'on_the_way',
        utrNumber: 'UTR123456789',
        address: '123 Main Street, Apartment 4B, Gurugram, Haryana - 122001',
        upiPayment: {
            method: 'upi',
            transactionId: 'TXN987654321',
            qrEnabled: true
        },
        createdAt: '2025-11-14T10:30:00Z',
        updatedAt: '2025-11-15T08:45:00Z'
    },
    {
        _id: '507f1f77bcf86cd799439012',
        items: [
            {
                itemType: 'dish',
                itemId: {
                    name: 'Paneer Tikka',
                    images: ['https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400'],
                    foodType: 'Veg'
                },
                quantity: 1,
                selectedVariant: 'Half',
                price: 180
            }
        ],
        totalAmount: 180,
        paymentStatus: 'paid',
        orderStatus: 'delivered',
        utrNumber: 'UTR223344556',
        address: '456 Park Avenue, Sector 29, Gurugram, Haryana - 122002',
        upiPayment: {
            method: 'upi',
            transactionId: 'TXN112233445',
            qrEnabled: false
        },
        createdAt: '2025-11-10T14:20:00Z',
        updatedAt: '2025-11-11T19:30:00Z'
    },
    {
        _id: '507f1f77bcf86cd799439013',
        items: [
            {
                itemType: 'dish',
                itemId: {
                    name: 'Biryani',
                    images: ['https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400'],
                    foodType: 'Non-Veg'
                },
                quantity: 3,
                selectedVariant: 'Full',
                price: 900
            }
        ],
        totalAmount: 900,
        paymentStatus: 'pending',
        orderStatus: 'pending',
        address: '789 Green Valley, DLF Phase 3, Gurugram, Haryana - 122022',
        upiPayment: {
            method: 'cod',
            qrEnabled: false
        },
        createdAt: '2025-11-15T09:15:00Z',
        updatedAt: '2025-11-15T09:15:00Z'
    }
];

const OrderTracker = ({ status }) => {
    const steps = [
        { key: 'pending', label: 'Order Placed', icon: Circle },
        { key: 'order_confirmed', label: 'Confirmed', icon: CheckCircle },
        { key: 'preparing', label: 'Preparing', icon: ChefHat },
        { key: 'dispatch', label: 'Dispatched', icon: Package },
        { key: 'on_the_way', label: 'On the Way', icon: Truck },
        { key: 'delivered', label: 'Delivered', icon: CheckCircle }
    ];

    const cancelledStep = { key: 'cancelled', label: 'Cancelled', icon: XCircle };

    if (status === 'cancelled') {
        return (
            <div className="flex items-center justify-center py-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="text-sm font-medium text-red-700">Order Cancelled</span>
                </div>
            </div>
        );
    }

    const currentIndex = steps.findIndex(step => step.key === status);

    return (
        <div className="py-6 overflow-x-auto">
            <div className="flex items-center justify-between min-w-max px-4">
                {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = index === currentIndex;
                    const isCompleted = index < currentIndex;
                    const isUpcoming = index > currentIndex;

                    return (
                        <React.Fragment key={step.key}>
                            <div className="flex flex-col items-center gap-2">
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isActive
                                        ? 'bg-primary text-white shadow-lg scale-110'
                                        : isCompleted
                                            ? 'bg-primary/20 text-primary'
                                            : 'bg-third/10 text-third'
                                        }`}
                                >
                                    <Icon className="w-6 h-6" />
                                </div>
                                <span
                                    className={`text-xs font-medium whitespace-nowrap ${isActive ? 'text-primary' : isCompleted ? 'text-third' : 'text-third/50'
                                        }`}
                                >
                                    {step.label}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div className="flex-1 h-0.5 mx-2 min-w-[40px]">
                                    <div
                                        className={`h-full transition-all duration-300 ${isCompleted ? 'bg-primary' : 'bg-third/20'
                                            }`}
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

const OrderItem = ({ item }) => {
    const isDish = item.itemType === 'dish';
    const itemData = item.itemId;

    return (
        <div className="flex gap-4 items-start p-3 rounded-lg border border-third/10 bg-white hover:shadow-md transition-shadow duration-200">
            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-third/5">
                {isDish && itemData.images?.[0] ? (
                    <img
                        src={itemData.images[0]}
                        alt={itemData.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                        <ShoppingBag className="w-8 h-8 text-primary" />
                    </div>
                )}
            </div>
            <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <h4 className="font-semibold text-third">{itemData.name}</h4>
                        {isDish && (
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-third/70">Quantity: {item.selectedVariant}</span>
                                <span
                                    className={`text-xs px-2 py-0.5 rounded-full ${itemData.foodType === 'Veg'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                        }`}
                                >
                                    {itemData.foodType}
                                </span>
                            </div>
                        )}
                        {!isDish && (
                            <span className="text-xs text-third/70 capitalize">Plan: {itemData.planType}</span>
                        )}
                    </div>
                    <div className="text-right">
                        <p className="font-semibold text-primary">₹{item.price}</p>
                        <p className="text-xs text-third/70">Qty: {item.quantity}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const OrderCard = ({ order }) => {
    const navigate = useNavigate()
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'paid':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'failed':
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };
    // Check if invoice exists
    const hasInvoice =
        order?.invoiceId ||
        order?.dishInvoiceGenerated ||
        order?.tiffinInvoiceGenerated ||
        order?.mealPlanInvoiceGenerated;

    return (
        <div className="rounded-xl shadow-md border border-third/10 p-5 mb-6 bg-white hover:shadow-lg transition-all duration-300">
            {/* Order Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-third/10">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-third/70" />
                        <span className="text-sm text-third/70">
                            Order placed: {formatDate(order.createdAt)}
                        </span>
                    </div>
                    <p className="text-xs text-third/50">Order ID: #{order._id.slice(-8)}</p>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-primary">₹{order.totalAmount}</p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-third/70">{order.upiPayment.method.toUpperCase()}</span>
                        <span
                            className={`text-xs px-3 py-1 rounded-full border capitalize ${getPaymentStatusColor(
                                order.paymentStatus
                            )}`}
                        >
                            {order.paymentStatus}
                        </span>
                    </div>
                </div>
            </div>

            {/* Order Tracker */}
            <OrderTracker status={order.orderStatus} />

            {/* Ordered Items */}
            <div className="mt-6">
                <h3 className="text-lg font-semibold text-third mb-3 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-primary" />
                    Ordered Items
                </h3>
                <div className="space-y-3">
                    {order.items.map((item, index) => (
                        <OrderItem key={index} item={item} />
                    ))}
                </div>
            </div>

            {/* Payment Information */}
            <div className="mt-6 bg-third/5 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-third mb-3 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-primary" />
                    Payment Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                        <p className="text-third/70">Payment Method</p>
                        <p className="font-medium text-third capitalize">{order.upiPayment.method}</p>
                    </div>
                    <div>
                        <p className="text-third/70">Payment Status</p>
                        <p className={`font-medium capitalize ${order.paymentStatus === 'paid' ? 'text-green-600' :
                            order.paymentStatus === 'pending' ? 'text-yellow-600' :
                                'text-red-600'
                            }`}>
                            {order.paymentStatus}
                        </p>
                    </div>
                    {order.utrNumber && (
                        <div>
                            <p className="text-third/70">UTR Number</p>
                            <p className="font-medium text-third">{order.utrNumber}</p>
                        </div>
                    )}
                    {order.upiPayment.transactionId && (
                        <div>
                            <p className="text-third/70">Transaction ID</p>
                            <p className="font-medium text-third">{order.upiPayment.transactionId}</p>
                        </div>
                    )}
                    {order.upiPayment.qrEnabled && (
                        <div className="md:col-span-2">
                            <p className="text-xs text-primary flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Paid using QR Scan
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Delivery Address */}
            <div className='flex items-center justify-center gap-4'>
                <div className="mt-6 p-4 rounded-lg border border-third/20 bg-white w-full">
                    <h3 className="text-sm font-semibold text-third mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        Delivery Address
                    </h3>
                    <p className="text-sm text-third/70">{order.address}</p>
                </div>

                <div>
                    <button
                        onClick={() => navigate(`/invoice/${order?.invoiceId}`)}
                        disabled={!hasInvoice}
                        className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300
                ${hasInvoice
                                ? "text-white bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:scale-105"
                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                    >
                        View Invoice
                    </button>
                </div>
            </div>


            {/* Last Updated */}
            <div className="mt-4 pt-4 border-t border-third/10">
                <p className="text-xs text-third/50 text-center">
                    Last updated: {formatDate(order.updatedAt)}
                </p>
            </div>
        </div>
    );
};

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API call
        const fetchOrders = async () => {
            try {
                // Replace with actual API call: const response = await getUserOrders();
                const response = await axiosClient.get("/api/v1/order/my-orders")
                setOrders(response.data.orders);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-third/70">Loading your orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Page Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-3">
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            My Orders
                        </span>
                    </h1>
                    <p className="text-third/70 text-lg">Track your current and past orders easily</p>
                </div>

                {/* Orders List */}
                {orders.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl shadow-md">
                        <Package className="w-16 h-16 text-third/30 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-third mb-2">No orders yet</h3>
                        <p className="text-third/70">Start ordering to see your order history here</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <OrderCard key={order._id} order={order} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;