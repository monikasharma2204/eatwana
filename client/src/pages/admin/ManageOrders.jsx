import React, { useState, useEffect } from 'react';
import { Search, Package, Eye, Edit2, X, ChevronDown, ChevronUp } from 'lucide-react';
import axiosClient from '../../services/axiosClient';
import AlertSnackbar from '../../ui/AlertSnackbar';


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
        await onConfirm(order._id, selectedStatus);
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

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Order ID: {order?._id.slice(-8)}
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
                        className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
                    >
                        {isLoading ? 'Updating...' : 'Confirm'}
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
                <div className="absolute left-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px] p-3">
                    {items.map((item, idx) => (
                        <div key={idx} className="py-2 border-b last:border-b-0">
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded mb-1">
                                        {item.itemType}
                                    </span>
                                    <p className="font-medium text-gray-800">{item.itemId.name}</p>
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

// Main AdminOrdersPage Component
const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [paymentFilter, setPaymentFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(order =>
                order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.user.phone.includes(searchTerm) ||
                order._id.includes(searchTerm)
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(order => order.orderStatus === statusFilter);
        }

        // Payment filter
        if (paymentFilter !== 'all') {
            filtered = filtered.filter(order => order.paymentStatus === paymentFilter);
        }

        setFilteredOrders(filtered);
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await axiosClient.put(`/api/v1/order/status/${orderId}`, { status: newStatus });

            // Update local state
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order._id === orderId ? { ...order, orderStatus: newStatus } : order
                )
            );

            showSnackbar('Order updated successfully!', 'success');
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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Package className="text-primary" size={32} />
                        <h1 className="text-3xl font-bold text-gray-800">All Orders</h1>
                    </div>

                    {/* Search and Filters */}
                    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Search Bar */}
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

                            {/* Order Status Filter */}
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

                            {/* Payment Status Filter */}
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

                {/* Orders Table - Desktop */}
                <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-scroll">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Items</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Payment</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">UTR</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Address</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-800">{order.user.name}</p>
                                                <p className="text-sm text-gray-600">{order.user.email}</p>
                                                <p className="text-sm text-gray-500">{order.user.phone}</p>
                                            </div>
                                        </td>
                                        {/* <td className="px-6 py-4">
                                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                {order._id.slice(-8)}
                                            </code>
                                        </td> */}
                                        <td className="px-6 py-4">
                                            <OrderItemsDropdown items={order.items} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-gray-800">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getPaymentBadge(order.paymentStatus)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {order.utrNumber}
                                        </td>

                                        <td className="px-6 py-4">
                                            {getOrderStatusBadge(order.orderStatus)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-600">{order.address}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => {
                                                    setSelectedOrder(order);
                                                    setIsModalOpen(true);
                                                }}
                                                className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors text-sm"
                                            >
                                                <Edit2 size={16} />
                                                Update
                                            </button>
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

                {/* Orders Cards - Mobile */}
                <div className="lg:hidden space-y-4">
                    {filteredOrders.map((order) => (
                        <div key={order._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="font-bold text-gray-800">{order.user.name}</p>
                                    <p className="text-sm text-gray-600">{order.user.email}</p>
                                    <p className="text-sm text-gray-500">{order.user.phone}</p>
                                </div>
                                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                    {order._id.slice(-8)}
                                </code>
                            </div>

                            <div className="space-y-2 mb-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Items:</span>
                                    <OrderItemsDropdown items={order.items} />
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Total:</span>
                                    <span className="font-semibold">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">UTR:</span>
                                    <span className="">{order.utrNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Address:</span>
                                    <span className="text-xs text-right">{order.address}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Payment:</span>
                                    {getPaymentBadge(order.paymentStatus)}
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Status:</span>
                                    {getOrderStatusBadge(order.orderStatus)}
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Date:</span>
                                    <span className="text-sm">{formatDate(order.createdAt)}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    setSelectedOrder(order);
                                    setIsModalOpen(true);
                                }}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors"
                            >
                                <Edit2 size={16} />
                                Update Status
                            </button>
                        </div>
                    ))}

                    {filteredOrders.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-xl">
                            <Package className="mx-auto text-gray-400 mb-4" size={48} />
                            <p className="text-gray-600">No orders found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            <OrderStatusModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                order={selectedOrder}
                onConfirm={handleUpdateStatus}
            />

            {/* Snackbar */}
            <AlertSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                duration={8000}
                onClose={handleClose}
                position={{ vertical: "top", horizontal: "right" }}
            />
        </div>
    );
};

export default ManageOrders;