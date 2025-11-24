import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, X, Eye, Calendar, CreditCard, Users, TrendingUp, TrendingDown } from 'lucide-react';
import AlertSnackbar from '../../ui/AlertSnackbar';
import axiosClient from '../../services/axiosClient';
import { useNavigate } from 'react-router-dom';


const InvoiceTable = () => {
    const [invoices, setInvoices] = useState([]);
    const [filteredInvoices, setFilteredInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const navigate = useNavigate();
    // Filter states
    const [filters, setFilters] = useState({
        dateFrom: '',
        dateTo: '',
        invoiceType: 'all', // all, dish, tiffin, mealPlan
        paymentStatus: 'all', // all, pending, paid, failed
        paymentMethod: 'all' // all, cod, upi, online
    });

    useEffect(() => {
        fetchInvoices();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchQuery, filters, invoices]);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/api/v1/invoice/all');
            if (response.data.success) {
                setInvoices(response.data.data);
                setFilteredInvoices(response.data.data);
                showSnackbar(`Loaded ${response.data.count} invoices successfully`, 'success');
            }
        } catch (error) {
            showSnackbar('Failed to load invoices', 'error');
            console.error('Error fetching invoices:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...invoices];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(inv =>
                inv.customer?.name?.toLowerCase().includes(query) ||
                inv.customer?.mobile?.includes(query) ||
                inv._id?.toLowerCase().includes(query) ||
                inv.invoiceNumber?.toLowerCase().includes(query) ||
                inv.customer?.email?.toLowerCase().includes(query)
            );
        }

        // Date range filter
        if (filters.dateFrom) {
            filtered = filtered.filter(inv =>
                new Date(inv.createdAt) >= new Date(filters.dateFrom)
            );
        }
        if (filters.dateTo) {
            filtered = filtered.filter(inv =>
                new Date(inv.createdAt) <= new Date(filters.dateTo)
            );
        }

        // Invoice type filter
        if (filters.invoiceType !== 'all') {
            filtered = filtered.filter(inv => inv.invoiceType === filters.invoiceType);
        }

        // Payment status filter
        if (filters.paymentStatus !== 'all') {
            filtered = filtered.filter(inv => inv.paymentStatus === filters.paymentStatus);
        }

        // Payment method filter
        if (filters.paymentMethod !== 'all') {
            filtered = filtered.filter(inv => inv.paymentMethod === filters.paymentMethod);
        }

        setFilteredInvoices(filtered);
    };

    const showSnackbar = (message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }) + ', ' + date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const getTokenChangeColor = (prev, current) => {
        if (current > prev) return 'text-green-600';
        if (current < prev) return 'text-red-600';
        return 'text-gray-600';
    };

    const resetFilters = () => {
        setFilters({
            dateFrom: '',
            dateTo: '',
            invoiceType: 'all',
            paymentStatus: 'all',
            paymentMethod: 'all'
        });
        setSearchQuery('');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
                    <p className="text-third text-lg font-medium">Loading invoices...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-third mb-2">All Invoices</h1>
                    <p className="text-gray-600">Manage and view all customer invoices</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-third/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Invoices</p>
                                <p className="text-2xl font-bold text-third">{invoices.length}</p>
                            </div>
                            <CreditCard className="w-8 h-8 text-primary" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-third/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Revenue</p>
                                <p className="text-2xl font-bold text-third">
                                    ₹{invoices.reduce((sum, inv) => sum + (inv.totalAmount || inv.amountPaid || 0), 0).toLocaleString()}
                                </p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-green-600" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-third/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Dish Invoices</p>
                                <p className="text-2xl font-bold text-third">
                                    {invoices.filter(inv => inv.invoiceType === 'dish').length}
                                </p>
                            </div>
                            <Users className="w-8 h-8 text-secondary" />
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-third/20">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Tiffin Invoices</p>
                                <p className="text-2xl font-bold text-third">
                                    {invoices.filter(inv => inv.invoiceType === 'tiffin').length}
                                </p>
                            </div>
                            <Calendar className="w-8 h-8 text-primary" />
                        </div>
                    </div>
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white rounded-xl shadow-sm border border-third/20 p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by name, mobile, or invoice ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-third/20 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                        </div>

                        {/* Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="bg-primary text-white rounded-lg px-4 py-2 shadow hover:scale-[1.03] transition flex items-center gap-2"
                        >
                            <Filter className="w-5 h-5" />
                            Filters
                            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                        </button>
                    </div>

                    {/* Filter Options */}
                    {showFilters && (
                        <div className="mt-4 pt-4 border-t border-third/20 grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-third mb-1">Date From</label>
                                <input
                                    type="date"
                                    value={filters.dateFrom}
                                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                                    className="w-full px-3 py-2 border border-third/20 rounded-lg text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-third mb-1">Date To</label>
                                <input
                                    type="date"
                                    value={filters.dateTo}
                                    onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                                    className="w-full px-3 py-2 border border-third/20 rounded-lg text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-third mb-1">Invoice Type</label>
                                <select
                                    value={filters.invoiceType}
                                    onChange={(e) => setFilters({ ...filters, invoiceType: e.target.value })}
                                    className="w-full px-3 py-2 border border-third/20 rounded-lg text-sm"
                                >
                                    <option value="all">All Types</option>
                                    <option value="dish">Dish</option>
                                    <option value="tiffin">Tiffin</option>
                                    <option value="mealPlan">Meal Plan</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-third mb-1">Payment Status</label>
                                <select
                                    value={filters.paymentStatus}
                                    onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })}
                                    className="w-full px-3 py-2 border border-third/20 rounded-lg text-sm"
                                >
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                    <option value="failed">Failed</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-third mb-1">Payment Method</label>
                                <select
                                    value={filters.paymentMethod}
                                    onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value })}
                                    className="w-full px-3 py-2 border border-third/20 rounded-lg text-sm"
                                >
                                    <option value="all">All Methods</option>
                                    <option value="cod">Cash on Delivery</option>
                                    <option value="upi">UPI</option>
                                    <option value="online">Online</option>
                                </select>
                            </div>
                            <div className="md:col-span-4 flex justify-end">
                                <button
                                    onClick={resetFilters}
                                    className="text-sm text-primary hover:underline flex items-center gap-1"
                                >
                                    <X className="w-4 h-4" />
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Results Count */}
                <div className="mb-4 text-sm text-gray-600">
                    Showing <span className="font-semibold text-third">{filteredInvoices.length}</span> of <span className="font-semibold text-third">{invoices.length}</span> invoices
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-third/20 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-primary to-secondary text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Invoice #</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Customer</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Items</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Amount</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Payment</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-third/10">
                                {filteredInvoices.map((invoice) => {
                                    const invoiceType = invoice.invoiceType || 'mealPlan';
                                    const totalAmount = invoice.totalAmount || invoice.amountPaid || 0;
                                    const itemsCount = invoice.items?.length || 0;

                                    return (
                                        <tr key={invoice._id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4">
                                                <p className="font-mono text-sm text-third">{invoice.invoiceNumber || invoice._id.slice(-8)}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${invoiceType === 'dish' ? 'bg-blue-100 text-blue-700' :
                                                        invoiceType === 'tiffin' ? 'bg-purple-100 text-purple-700' :
                                                            'bg-green-100 text-green-700'
                                                    }`}>
                                                    {invoiceType.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-semibold text-third">{invoice?.customer?.name || 'N/A'}</p>
                                                    <p className="text-sm text-gray-600">{invoice?.customer?.mobile || ''}</p>
                                                    <p className="text-xs text-gray-500">{invoice?.customer?.email || ''}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {invoiceType === 'mealPlan' ? (
                                                    <div className="text-sm">
                                                        <p className="text-third">Meal Plan</p>
                                                        <p className="text-gray-600">{invoice?.mealPlan?.mealsPerDay || 0} Meals/Day</p>
                                                    </div>
                                                ) : (
                                                    <div className="text-sm">
                                                        <p className="text-third font-medium">{itemsCount} Item{itemsCount !== 1 ? 's' : ''}</p>
                                                        {invoice.items && invoice.items.length > 0 && (
                                                            <p className="text-xs text-gray-600 truncate max-w-[150px]">
                                                                {invoice.items[0].itemName}
                                                                {itemsCount > 1 && ` +${itemsCount - 1} more`}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-semibold text-third">₹{totalAmount.toLocaleString()}</p>
                                                    {invoice.discount > 0 && (
                                                        <p className="text-xs text-gray-500">Discount: ₹{invoice.discount.toLocaleString()}</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${invoice.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                                                            invoice.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                                'bg-red-100 text-red-700'
                                                        }`}>
                                                        {invoice.paymentStatus?.toUpperCase() || 'PENDING'}
                                                    </span>
                                                    <p className="text-xs text-gray-600">{invoice.paymentMethod?.toUpperCase() || 'COD'}</p>
                                                    {invoiceType === 'mealPlan' && invoice.tokensCreated > 0 && (
                                                        <p className="text-xs text-green-600">+{invoice.tokensCreated} tokens</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-gray-700">{formatDate(invoice?.createdAt)}</p>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center space-x-2">
                                                    <button
                                                        onClick={() => setSelectedInvoice(invoice)}
                                                        className="bg-primary text-white rounded-lg px-3 py-1.5 shadow hover:scale-[1.03] transition inline-flex items-center gap-1 text-xs"
                                                    >
                                                        <Eye className="w-3 h-3" />
                                                        View
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden space-y-4">
                    {filteredInvoices.map((invoice) => {
                        const invoiceType = invoice.invoiceType || 'mealPlan';
                        const totalAmount = invoice.totalAmount || invoice.amountPaid || 0;
                        const itemsCount = invoice.items?.length || 0;

                        return (
                            <div key={invoice._id} className="bg-white border border-third/20 shadow rounded-xl p-4 flex flex-col gap-3">
                                {/* Header */}
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${invoiceType === 'dish' ? 'bg-blue-100 text-blue-700' :
                                                    invoiceType === 'tiffin' ? 'bg-purple-100 text-purple-700' :
                                                        'bg-green-100 text-green-700'
                                                }`}>
                                                {invoiceType.toUpperCase()}
                                            </span>
                                            <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${invoice.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                                                    invoice.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-red-100 text-red-700'
                                                }`}>
                                                {invoice.paymentStatus?.toUpperCase() || 'PENDING'}
                                            </span>
                                        </div>
                                        <p className="font-mono text-xs text-gray-500">{invoice.invoiceNumber || invoice._id.slice(-8)}</p>
                                    </div>
                                </div>

                                <div className="h-px bg-third/10"></div>

                                {/* Customer Info */}
                                <div>
                                    <h3 className="font-semibold text-third text-lg">{invoice?.customer?.name || 'N/A'}</h3>
                                    <p className="text-sm text-gray-600">{invoice?.customer?.mobile || ''}</p>
                                    <p className="text-xs text-gray-500">{invoice?.customer?.email || ''}</p>
                                </div>

                                {/* Payment & Items */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                                        <p className="text-lg font-bold text-third">₹{totalAmount.toLocaleString()}</p>
                                        {invoice.discount > 0 && (
                                            <p className="text-xs text-gray-600">Discount: ₹{invoice.discount.toLocaleString()}</p>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">
                                            {invoiceType === 'mealPlan' ? 'Tokens' : 'Items'}
                                        </p>
                                        {invoiceType === 'mealPlan' ? (
                                            <>
                                                <p className="text-lg font-bold text-green-600">+{invoice?.tokensCreated || 0}</p>
                                                <p className="text-xs text-gray-600">
                                                    {invoice?.previousTokenBalance || 0} → {invoice?.newTokenBalance || 0}
                                                </p>
                                            </>
                                        ) : (
                                            <p className="text-lg font-bold text-third">{itemsCount} Item{itemsCount !== 1 ? 's' : ''}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Items or Meal Plan Details */}
                                {invoiceType === 'mealPlan' ? (
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-xs text-gray-500 mb-1">Meal Plan</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-third">{invoice?.mealPlan?.mealsPerDay || 0} Meals/Day</span>
                                            <span className="text-sm text-gray-600">₹{invoice?.mealPlan?.pricePerMeal || 0}/meal</span>
                                        </div>
                                    </div>
                                ) : invoice.items && invoice.items.length > 0 && (
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <p className="text-xs text-gray-500 mb-2">Items</p>
                                        <div className="space-y-1">
                                            {invoice.items.slice(0, 2).map((item, idx) => (
                                                <div key={idx} className="flex justify-between text-sm">
                                                    <span className="text-third">{item.itemName} x{item.quantity}</span>
                                                    <span className="text-gray-600">₹{item.totalPrice}</span>
                                                </div>
                                            ))}
                                            {invoice.items.length > 2 && (
                                                <p className="text-xs text-gray-500">+{invoice.items.length - 2} more items</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Date & Action */}
                                <div className="flex items-center justify-between pt-2 border-t border-third/10">
                                    <p className="text-xs text-gray-500">{formatDate(invoice?.createdAt)}</p>
                                    <button
                                        onClick={() => setSelectedInvoice(invoice)}
                                        className="bg-primary text-white rounded-lg px-4 py-2 shadow hover:scale-[1.03] transition text-sm flex items-center gap-2"
                                    >
                                        <Eye className="w-4 h-4" />
                                        View
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Empty State */}
                {filteredInvoices.length === 0 && (
                    <div className="bg-white rounded-xl shadow-sm border border-third/20 p-12 text-center">
                        <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-third mb-2">No Invoices Found</h3>
                        <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
                        <button
                            onClick={resetFilters}
                            className="bg-primary text-white rounded-lg px-6 py-2 shadow hover:scale-[1.03] transition"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}

                {/* Invoice Detail Modal */}
                {selectedInvoice && (() => {
                    const invoiceType = selectedInvoice.invoiceType || 'mealPlan';
                    const totalAmount = selectedInvoice.totalAmount || selectedInvoice.amountPaid || 0;

                    return (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedInvoice(null)}>
                            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h2 className="text-2xl font-bold text-third">Invoice Details</h2>
                                            <span className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${invoiceType === 'dish' ? 'bg-blue-100 text-blue-700' :
                                                    invoiceType === 'tiffin' ? 'bg-purple-100 text-purple-700' :
                                                        'bg-green-100 text-green-700'
                                                }`}>
                                                {invoiceType.toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500">#{selectedInvoice.invoiceNumber || selectedInvoice._id}</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedInvoice(null)}
                                        className="text-gray-400 hover:text-gray-600 transition"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Customer Details */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="font-semibold text-third mb-3 flex items-center gap-2">
                                            <Users className="w-5 h-5" />
                                            Customer Information
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                            <div>
                                                <p className="text-gray-500">Name</p>
                                                <p className="font-medium text-third">{selectedInvoice?.customer?.name || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Mobile</p>
                                                <p className="font-medium text-third">{selectedInvoice?.customer?.mobile || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Email</p>
                                                <p className="font-medium text-third">{selectedInvoice?.customer?.email || 'N/A'}</p>
                                            </div>
                                            {invoiceType === 'mealPlan' && (
                                                <div>
                                                    <p className="text-gray-500">Token Balance</p>
                                                    <p className="font-medium text-third">{selectedInvoice?.customer?.tokenBalance || 0} tokens</p>
                                                </div>
                                            )}
                                            {(selectedInvoice?.deliveryAddress || selectedInvoice?.customer?.address) && (
                                                <div className="md:col-span-2">
                                                    <p className="text-gray-500">Address</p>
                                                    <p className="font-medium text-third">{selectedInvoice.deliveryAddress || selectedInvoice.customer?.address || 'N/A'}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Items (for Dish/Tiffin) */}
                                    {invoiceType !== 'mealPlan' && selectedInvoice.items && selectedInvoice.items.length > 0 && (
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h3 className="font-semibold text-third mb-3">Order Items</h3>
                                            <div className="space-y-3">
                                                {selectedInvoice.items.map((item, idx) => (
                                                    <div key={idx} className="border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <div>
                                                                <p className="font-medium text-third">{item.itemName}</p>
                                                                <p className="text-xs text-gray-500">
                                                                    {item.selectedVariant && `Variant: ${item.selectedVariant}`}
                                                                    {item.category && ` • ${item.category}`}
                                                                </p>
                                                            </div>
                                                            <p className="font-semibold text-third">₹{item.totalPrice.toLocaleString()}</p>
                                                        </div>
                                                        <div className="flex justify-between text-sm text-gray-600">
                                                            <span>Quantity: {item.quantity}</span>
                                                            <span>Unit Price: ₹{item.unitPrice.toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Payment Details */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="font-semibold text-third mb-3 flex items-center gap-2">
                                            <CreditCard className="w-5 h-5" />
                                            Payment Details
                                        </h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Subtotal</span>
                                                <span className="font-medium text-third">₹{selectedInvoice.subtotal?.toLocaleString() || totalAmount.toLocaleString()}</span>
                                            </div>
                                            {selectedInvoice.discount > 0 && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Discount</span>
                                                    <span className="font-medium text-green-600">-₹{selectedInvoice.discount.toLocaleString()}</span>
                                                </div>
                                            )}
                                            <div className="flex justify-between pt-2 border-t border-gray-200">
                                                <span className="text-gray-700 font-semibold">Total Amount</span>
                                                <span className="font-bold text-third text-lg">₹{totalAmount.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between pt-2">
                                                <span className="text-gray-600">Payment Method</span>
                                                <span className="font-medium text-third">{selectedInvoice.paymentMethod?.toUpperCase() || 'COD'}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Payment Status</span>
                                                <span className={`font-medium ${selectedInvoice.paymentStatus === 'paid' ? 'text-green-600' :
                                                        selectedInvoice.paymentStatus === 'pending' ? 'text-yellow-600' :
                                                            'text-red-600'
                                                    }`}>
                                                    {selectedInvoice.paymentStatus?.toUpperCase() || 'PENDING'}
                                                </span>
                                            </div>
                                            {selectedInvoice.utrNumber && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">UTR/Transaction ID</span>
                                                    <span className="font-mono text-xs text-third">{selectedInvoice.utrNumber}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Token Details (only for Meal Plan) */}
                                    {invoiceType === 'mealPlan' && selectedInvoice.tokensCreated > 0 && (
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h3 className="font-semibold text-third mb-3">Token Transaction</h3>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Tokens Created</span>
                                                    <span className="font-bold text-green-600">+{selectedInvoice.tokensCreated}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Previous Balance</span>
                                                    <span className="font-medium text-gray-700">{selectedInvoice.previousTokenBalance || 0}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">New Balance</span>
                                                    <span className={`font-bold ${getTokenChangeColor(selectedInvoice.previousTokenBalance || 0, selectedInvoice.newTokenBalance || 0)}`}>
                                                        {selectedInvoice.newTokenBalance || 0}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Meal Plan Details (only for Meal Plan) */}
                                    {invoiceType === 'mealPlan' && selectedInvoice.mealPlan && (
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h3 className="font-semibold text-third mb-3">Meal Plan</h3>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Meals Per Day</span>
                                                    <span className="font-bold text-third">{selectedInvoice.mealPlan.mealsPerDay}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Price Per Meal</span>
                                                    <span className="font-medium text-third">₹{selectedInvoice.mealPlan.pricePerMeal}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600">Total Plan Price</span>
                                                    <span className="font-bold text-third">₹{selectedInvoice.mealPlan.totalPrice?.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Date */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h3 className="font-semibold text-third mb-3 flex items-center gap-2">
                                            <Calendar className="w-5 h-5" />
                                            Invoice Date
                                        </h3>
                                        <p className="text-sm text-gray-700">{formatDate(selectedInvoice.createdAt)}</p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setSelectedInvoice(null)}
                                            className="flex-1 bg-gray-200 text-third rounded-lg px-4 py-3 shadow hover:scale-[1.02] transition font-medium"
                                        >
                                            Close
                                        </button>
                                        <button
                                            onClick={() => {
                                                navigate(`/admin/invoice/${selectedInvoice?._id}`);
                                            }}
                                            className="flex-1 bg-primary text-white rounded-lg px-4 py-3 shadow hover:scale-[1.02] transition font-medium"
                                        >
                                            Print Invoice
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })()}
            </div>

            {/* Snackbar */}
            <AlertSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                duration={4000}
                onClose={handleCloseSnackbar}
                position={{ vertical: 'top', horizontal: 'right' }}
            />
        </div >
    );
};

export default InvoiceTable;