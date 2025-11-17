import React, { useState, useEffect } from 'react';
import { Search, X, ChevronDown, User, Phone, Mail, MapPin, Coins, Calendar, Package } from 'lucide-react';
import axiosClient from '../../services/axiosClient';
import AlertSnackbar from '../../ui/AlertSnackbar';

// Status Badge Component
const StatusBadge = ({ status }) => {
    const styles = {
        Delivered: 'bg-green-100 text-green-700',
        Missed: 'bg-yellow-100 text-yellow-700',
        Cancelled: 'bg-red-100 text-red-700'
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
            {status}
        </span>
    );
};

// Meal Slot Badge Component
const MealSlotBadge = ({ slot }) => {
    const styles = {
        Breakfast: 'bg-yellow-100 text-yellow-700',
        Lunch: 'bg-green-100 text-green-700',
        Dinner: 'bg-blue-100 text-blue-700'
    };

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[slot] || 'bg-gray-100 text-gray-700'}`}>
            {slot}
        </span>
    );
};

// Format date helper
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true };
    return date.toLocaleDateString('en-GB', options).replace(',', '');
};

// Delivery Drawer Component
const DeliveryDrawer = ({ isOpen, onClose, customer, deliveries, loading }) => {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-third/10 bg-opacity-50 z-40 transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className={`fixed right-0 top-0 h-full w-full md:w-2/3 lg:w-1/2 bg-white shadow-2xl z-50 overflow-y-auto transition-transform transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-primary">Delivery Logs</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-third/10 rounded-lg transition"
                        >
                            <X className="w-6 h-6 text-third" />
                        </button>
                    </div>

                    {/* Customer Summary Card */}
                    {customer && (
                        <div className="p-4 bg-third/5 rounded-xl border border-third/20 mb-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                    <User className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-primary">{customer.name}</h3>
                                    <p className="text-sm text-third/70">{customer.email}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-third/60" />
                                    <span className="text-third">{customer.mobile}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-third/60" />
                                    <span className="text-third">{customer.address}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Coins className="w-4 h-4 text-third/60" />
                                    <span className={`font-semibold ${customer.tokenBalance > 20 ? 'text-green-600' : 'text-red-600'}`}>
                                        {customer.tokenBalance} Tokens
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Package className="w-4 h-4 text-third/60" />
                                    <span className="text-third">
                                        {customer.activePlan ? customer.activePlan.name : 'No Active Plan'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    )}

                    {/* Delivery History */}
                    {!loading && deliveries.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg text-primary mb-4">Delivery History ({deliveries.length})</h3>

                            {/* Desktop Table */}
                            <div className="hidden md:block overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-third/20">
                                            <th className="text-left py-3 px-2 text-sm font-semibold text-third">Date</th>
                                            <th className="text-left py-3 px-2 text-sm font-semibold text-third">Meal Slot</th>
                                            <th className="text-left py-3 px-2 text-sm font-semibold text-third">Quantity</th>
                                            <th className="text-left py-3 px-2 text-sm font-semibold text-third">Tokens Used</th>
                                            <th className="text-left py-3 px-2 text-sm font-semibold text-third">Tiffin Menu</th>
                                            <th className="text-left py-3 px-2 text-sm font-semibold text-third">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {deliveries.map((delivery) => (
                                            <tr key={delivery._id} className="border-b border-third/10 hover:bg-third/5 transition">
                                                <td className="py-3 px-2 text-sm text-third">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-third/60" />
                                                        {formatDate(delivery.date)}
                                                    </div>
                                                </td>
                                                <td className="py-3 px-2">
                                                    <MealSlotBadge slot={delivery.mealSlot} />
                                                </td>
                                                <td className="py-3 px-2 text-sm text-third">{delivery.quantity}</td>
                                                <td className="py-3 px-2 text-sm font-semibold text-primary">{delivery.tokenUsed}</td>
                                                <td className="py-3 px-2 text-sm text-third">
                                                    <div>{delivery.tiffinMenu.menuName}</div>
                                                    <div className="text-xs text-third/60">{delivery.tiffinMenu.menuType}</div>
                                                </td>
                                                <td className="py-3 px-2">
                                                    <StatusBadge status={delivery.status} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="md:hidden space-y-3">
                                {deliveries.map((delivery) => (
                                    <div key={delivery._id} className="bg-white border border-third/20 rounded-xl shadow p-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <MealSlotBadge slot={delivery.mealSlot} />
                                            <StatusBadge status={delivery.status} />
                                        </div>

                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2 text-third/70">
                                                <Calendar className="w-4 h-4" />
                                                <span>{formatDate(delivery.date)}</span>
                                            </div>

                                            <div className="flex justify-between">
                                                <span className="text-third/70">Quantity:</span>
                                                <span className="font-medium text-third">{delivery.quantity}</span>
                                            </div>

                                            <div className="flex justify-between">
                                                <span className="text-third/70">Tokens Used:</span>
                                                <span className="font-semibold text-primary">{delivery.tokenUsed}</span>
                                            </div>

                                            <div className="pt-2 border-t border-third/10">
                                                <div className="font-medium text-third">{delivery.tiffinMenu.menuName}</div>
                                                <div className="text-xs text-third/60">{delivery.tiffinMenu.menuType}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* No Deliveries */}
                    {!loading && deliveries.length === 0 && (
                        <div className="text-center py-12">
                            <Package className="w-16 h-16 text-third/30 mx-auto mb-4" />
                            <p className="text-third/60 text-lg">📭 No deliveries found for this customer.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

// Main Customer Table Component
const CustomerDeliveryTable = () => {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [tokenFilter, setTokenFilter] = useState('all');
    const [planFilter, setPlanFilter] = useState('all');

    // Drawer state
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [deliveries, setDeliveries] = useState([]);
    const [deliveriesLoading, setDeliveriesLoading] = useState(false);

    // Snackbar state
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Fetch customers on mount
    useEffect(() => {
        fetchCustomers();
    }, []);

    // Apply filters
    useEffect(() => {
        let filtered = [...customers];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(customer =>
                customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.mobile.includes(searchTerm) ||
                customer.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Token balance filter
        if (tokenFilter === 'high-to-low') {
            filtered.sort((a, b) => b.tokenBalance - a.tokenBalance);
        } else if (tokenFilter === 'low-to-high') {
            filtered.sort((a, b) => a.tokenBalance - b.tokenBalance);
        }

        // Active plan filter
        if (planFilter === 'yes') {
            filtered = filtered.filter(customer => customer.activePlan);
        } else if (planFilter === 'no') {
            filtered = filtered.filter(customer => !customer.activePlan);
        }

        setFilteredCustomers(filtered);
    }, [searchTerm, tokenFilter, planFilter, customers]);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/api/v1/customer/all');
            if (response.data.success) {
                setCustomers(response.data.data);
                setFilteredCustomers(response.data.data);
                showSnackbar('Customers loaded successfully!', 'success');
            }
        } catch (error) {
            showSnackbar('Failed to fetch customers', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchDeliveries = async (customerId) => {
        try {
            setDeliveriesLoading(true);
            const response = await axiosClient.get(`/api/v1/delivery/customer/${customerId}`);
            if (response.data.success) {
                setDeliveries(response.data.data);
                showSnackbar('Delivery logs loaded!', 'success');
            }
        } catch (error) {
            showSnackbar('Failed to fetch delivery logs', 'error');
            setDeliveries([]);
        } finally {
            setDeliveriesLoading(false);
        }
    };

    const handleViewDeliveries = (customer) => {
        setSelectedCustomer(customer);
        setDrawerOpen(true);
        fetchDeliveries(customer._id);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Customer Management</h1>
                    <p className="text-third/70">Manage all customers and view their delivery logs</p>
                </div>

                {/* Search & Filter Section */}
                <div className="bg-white rounded-xl shadow-lg border border-third/20 p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Bar */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-third/60" />
                            <input
                                type="text"
                                placeholder="Search by name, mobile, or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border border-third/20 pl-10 pr-4 py-2 rounded-lg shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>

                        {/* Token Balance Filter */}
                        <div className="relative">
                            <select
                                value={tokenFilter}
                                onChange={(e) => setTokenFilter(e.target.value)}
                                className="border border-third/20 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none pr-10 bg-white"
                            >
                                <option value="all">All Tokens</option>
                                <option value="high-to-low">High to Low</option>
                                <option value="low-to-high">Low to High</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-third/60 pointer-events-none" />
                        </div>

                        {/* Active Plan Filter */}
                        <div className="relative">
                            <select
                                value={planFilter}
                                onChange={(e) => setPlanFilter(e.target.value)}
                                className="border border-third/20 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none pr-10 bg-white"
                            >
                                <option value="all">All Plans</option>
                                <option value="yes">Has Active Plan</option>
                                <option value="no">No Active Plan</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-third/60 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="bg-white rounded-xl shadow-lg border border-third/20 p-12 flex justify-center items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                )}

                {/* Desktop Table */}
                {!loading && (
                    <div className="hidden md:block bg-white shadow-lg rounded-xl border border-third/20 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-third/5">
                                    <tr>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-third">Name</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-third">Mobile</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-third">Email</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-third">Address</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-third">Token Balance</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-third">Active Plan</th>
                                        <th className="text-left py-4 px-6 text-sm font-semibold text-third">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCustomers.map((customer) => (
                                        <tr
                                            key={customer._id}
                                            className="border-t border-third/20 hover:bg-third/5 transition cursor-pointer"
                                            onClick={() => handleViewDeliveries(customer)}
                                        >
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                                        <User className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <span className="font-medium text-primary">{customer.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-third">{customer.mobile}</td>
                                            <td className="py-4 px-6 text-sm text-third">{customer.email}</td>
                                            <td className="py-4 px-6 text-sm text-third">{customer.address}</td>
                                            <td className="py-4 px-6">
                                                <span className={`font-semibold ${customer.tokenBalance > 20 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {customer.tokenBalance}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-sm text-third">
                                                {customer.activePlan ? (
                                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                        {customer.activePlan.name}
                                                    </span>
                                                ) : (
                                                    <span className="text-third/50">None</span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleViewDeliveries(customer);
                                                    }}
                                                    className="bg-primary text-white px-4 py-2 rounded-lg hover:scale-105 transition text-sm"
                                                >
                                                    View Deliveries
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredCustomers.length === 0 && (
                            <div className="text-center py-12 text-third/60">
                                No customers found matching your criteria.
                            </div>
                        )}
                    </div>
                )}

                {/* Mobile Cards */}
                {!loading && (
                    <div className="md:hidden space-y-4">
                        {filteredCustomers.map((customer) => (
                            <div
                                key={customer._id}
                                onClick={() => handleViewDeliveries(customer)}
                                className="bg-white p-4 rounded-xl shadow border border-third/20 flex flex-col gap-3 cursor-pointer hover:shadow-lg transition"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                        <User className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-primary">{customer.name}</h3>
                                        <p className="text-sm text-third/70">{customer.mobile}</p>
                                    </div>
                                    <span className={`font-bold text-lg ${customer.tokenBalance > 20 ? 'text-green-600' : 'text-red-600'}`}>
                                        {customer.tokenBalance}
                                    </span>
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-third/70">
                                        <Mail className="w-4 h-4" />
                                        <span>{customer.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-third/70">
                                        <MapPin className="w-4 h-4" />
                                        <span>{customer.address}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-third/10">
                                    <span className="text-sm text-third/70">Active Plan:</span>
                                    {customer.activePlan ? (
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                            {customer.activePlan.name}
                                        </span>
                                    ) : (
                                        <span className="text-sm text-third/50">None</span>
                                    )}
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleViewDeliveries(customer);
                                    }}
                                    className="bg-primary text-white px-4 py-2 rounded-lg hover:scale-105 transition text-sm w-full"
                                >
                                    View Deliveries
                                </button>
                            </div>
                        ))}

                        {filteredCustomers.length === 0 && (
                            <div className="text-center py-12 text-third/60 bg-white rounded-xl shadow border border-third/20">
                                No customers found matching your criteria.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Delivery Drawer */}
            <DeliveryDrawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                customer={selectedCustomer}
                deliveries={deliveries}
                loading={deliveriesLoading}
            />

            {/* Snackbar */}
            <AlertSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                duration={4000}
                onClose={handleCloseSnackbar}
                position={{ vertical: 'top', horizontal: 'right' }}
            />
        </div>
    );
};

export default CustomerDeliveryTable;