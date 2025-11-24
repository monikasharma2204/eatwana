import React, { useState, useEffect } from 'react';
import axiosClient from '../../services/axiosClient';
import AlertSnackbar from '../../ui/AlertSnackbar';


const MealPlanTable = () => {
    const [mealPlans, setMealPlans] = useState([]);
    const [filteredPlans, setFilteredPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [deliveryModal, setDeliveryModal] = useState({ open: false, plan: null });
    const [deleteModal, setDeleteModal] = useState({ open: false, planId: null });
    const [deliveryForm, setDeliveryForm] = useState({ mealSlot: '', quantity: 1 });
    const [filters, setFilters] = useState({
        status: 'all',
        mealSlot: 'all',
        menuType: 'all',
        upcomingDelivery: false,
        searchQuery: ''
    });

    useEffect(() => {
        fetchMealPlans();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [mealPlans, filters]);

    const fetchMealPlans = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/api/v1/meal-plan/all');
            if (response.data.success) {
                setMealPlans(response.data.data);
                setFilteredPlans(response.data.data);
            }
        } catch (error) {
            showSnackbar('Failed to fetch meal plans', 'error');
        } finally {
            setLoading(false);
        }
    };

    const getCurrentMealTime = () => {
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 11) return 'Breakfast';
        if (hour >= 11 && hour < 16) return 'Lunch';
        if (hour >= 16 && hour < 22) return 'Dinner';
        return null;
    };

    const getUpcomingMealTime = () => {
        const hour = new Date().getHours();
        if (hour >= 0 && hour < 11) return 'Breakfast';
        if (hour >= 11 && hour < 16) return 'Lunch';
        if (hour >= 16 && hour < 24) return 'Dinner';
        return 'Breakfast';
    };

    const applyFilters = () => {
        let filtered = [...mealPlans];

        // Status filter
        if (filters?.status !== 'all') {
            filtered = filtered.filter(plan =>
                filters.status === 'active' ? plan.isActive : !plan.isActive
            );
        }

        // Meal slot filter
        if (filters?.mealSlot !== 'all') {
            filtered = filtered.filter(plan =>
                plan.mealSlots.includes(filters.mealSlot)
            );
        }

        // Menu type filter
        if (filters?.menuType !== 'all') {
            filtered = filtered.filter(plan =>
                plan.tiffinMenu.menuType.toLowerCase() === filters.menuType.toLowerCase()
            );
        }

        // Upcoming delivery filter
        if (filters.upcomingDelivery) {
            const upcomingMeal = getUpcomingMealTime();
            filtered = filtered.filter(plan =>
                plan.isActive &&
                plan.mealSlots.includes(upcomingMeal) &&
                plan.customer.tokenBalance > 0
            );
        }

        // Search filter
        if (filters.searchQuery.trim()) {
            const query = filters.searchQuery.toLowerCase();
            filtered = filtered.filter(plan =>
                plan?.customer?.name?.toLowerCase()?.includes(query) ||
                plan?.customer?.mobile?.includes(query) ||
                plan?.customer?.email?.toLowerCase()?.includes(query) ||
                plan?.tiffinMenu?.menuName?.toLowerCase()?.includes(query)
            );
        }

        setFilteredPlans(filtered);
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => {
        setFilters({
            status: 'all',
            mealSlot: 'all',
            menuType: 'all',
            upcomingDelivery: false,
            searchQuery: ''
        });
    };

    const getUniqueMenuTypes = () => {
        const types = mealPlans?.map(plan => plan?.tiffinMenu?.menuType);
        return [...new Set(types)];
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const openDeliveryModal = (plan) => {
        setDeliveryModal({ open: true, plan });
        setDeliveryForm({ mealSlot: plan.mealSlots[0] || '', quantity: 1 });
    };

    const closeDeliveryModal = () => {
        setDeliveryModal({ open: false, plan: null });
        setDeliveryForm({ mealSlot: '', quantity: 1 });
    };

    const handleMarkDelivery = async () => {
        if (!deliveryForm?.mealSlot || deliveryForm?.quantity < 1) {
            showSnackbar('Please fill all fields correctly', 'error');
            return;
        }

        try {
            const response = await axiosClient.post('/api/v1/delivery/deliver', {
                customerId: deliveryModal?.plan?.customer._id,
                mealSlot: deliveryForm?.mealSlot,
                quantity: parseInt(deliveryForm?.quantity)
            });

            if (response.data.success) {
                showSnackbar('Delivery marked successfully!', 'success');
                closeDeliveryModal();
                fetchMealPlans();
            }
        } catch (error) {
            showSnackbar(error.response?.data?.message || 'Failed to mark delivery', 'error');
        }
    };

    const openDeleteModal = (planId) => {
        setDeleteModal({ open: true, planId });
    };

    const closeDeleteModal = () => {
        setDeleteModal({ open: false, planId: null });
    };

    const handleDeletePlan = async () => {
        try {
            const response = await axiosClient.delete(`/api/v1/meal-plan/${deleteModal.planId}`);
            if (response.data.success) {
                showSnackbar('Meal plan deleted successfully!', 'success');
                closeDeleteModal();
                fetchMealPlans();
            }
        } catch (error) {
            showSnackbar(error.response?.data?.message || 'Failed to delete meal plan', 'error');
        }
    };

    const getMealSlotColor = (slot) => {
        const colors = {
            'Breakfast': 'bg-yellow-100 text-yellow-700 border-yellow-300',
            'Lunch': 'bg-green-100 text-green-700 border-green-300',
            'Dinner': 'bg-blue-100 text-blue-700 border-blue-300'
        };
        return colors[slot] || 'bg-gray-100 text-gray-700 border-gray-300';
    };

    const calculateNewBalance = () => {
        if (!deliveryModal?.plan) return 0;
        const tokensToConsume = deliveryForm?.quantity;
        return deliveryModal?.plan?.customer?.tokenBalance - tokensToConsume;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-primary">Meal Plan Management</h1>
                    <p className="text-gray-600 mt-2">Manage all customer meal plans and deliveries</p>
                </div>

                {/* Filter Component */}
                <div className="bg-white rounded-xl shadow border border-third/20 p-4 md:p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-primary">Filters</h2>
                        <button
                            onClick={resetFilters}
                            className="px-3 py-1.5 text-sm bg-third/10 text-third rounded-lg hover:bg-third/20 transition-colors"
                        >
                            Reset All
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Search by customer name, mobile, email, or menu..."
                            value={filters.searchQuery}
                            onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                            className="w-full px-4 py-2.5 border border-third/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    {/* Filter Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Status Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className="w-full px-3 py-2 border border-third/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active Only</option>
                                <option value="inactive">Inactive Only</option>
                            </select>
                        </div>

                        {/* Meal Slot Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Meal Slot</label>
                            <select
                                value={filters.mealSlot}
                                onChange={(e) => handleFilterChange('mealSlot', e.target.value)}
                                className="w-full px-3 py-2 border border-third/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="all">All Slots</option>
                                <option value="Breakfast">Breakfast</option>
                                <option value="Lunch">Lunch</option>
                                <option value="Dinner">Dinner</option>
                            </select>
                        </div>

                        {/* Menu Type Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Menu Type</label>
                            <select
                                value={filters.menuType}
                                onChange={(e) => handleFilterChange('menuType', e.target.value)}
                                className="w-full px-3 py-2 border border-third/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="all">All Types</option>
                                {getUniqueMenuTypes().map((type) => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        {/* Upcoming Delivery Toggle */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Quick Filter</label>
                            <button
                                onClick={() => handleFilterChange('upcomingDelivery', !filters.upcomingDelivery)}
                                className={`w-full px-4 py-2 rounded-lg font-medium transition-all ${filters.upcomingDelivery
                                    ? 'bg-primary text-white shadow-md'
                                    : 'bg-third/10 text-third hover:bg-third/20'
                                    }`}
                            >
                                {filters.upcomingDelivery ? '✓ ' : ''}Upcoming Deliveries
                            </button>
                        </div>
                    </div>

                    {/* Active Filters Summary */}
                    {(filters.status !== 'all' || filters.mealSlot !== 'all' || filters.menuType !== 'all' || filters.upcomingDelivery || filters.searchQuery) && (
                        <div className="mt-4 pt-4 border-t border-third/20">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm text-gray-600 font-medium">Active filters:</span>
                                {filters.status !== 'all' && (
                                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                                        Status: {filters.status}
                                    </span>
                                )}
                                {filters.mealSlot !== 'all' && (
                                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                                        Slot: {filters.mealSlot}
                                    </span>
                                )}
                                {filters.menuType !== 'all' && (
                                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                                        Type: {filters.menuType}
                                    </span>
                                )}
                                {filters.upcomingDelivery && (
                                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                                        Upcoming Deliveries ({getUpcomingMealTime()})
                                    </span>
                                )}
                                {filters.searchQuery && (
                                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                                        Search: "{filters.searchQuery}"
                                    </span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Results Count */}
                    <div className="mt-4 text-sm text-gray-600">
                        Showing <span className="font-semibold text-primary">{filteredPlans.length}</span> of <span className="font-semibold">{mealPlans.length}</span> meal plans
                    </div>
                </div>

                {/* Desktop Table */}
                <div className="hidden lg:block bg-white rounded-xl shadow border border-third/20 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-primary text-white">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Customer</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Tiffin Menu</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Meal Slots</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Pricing</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Tokens</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-third/20">
                                {filteredPlans.map((plan) => (
                                    <tr key={plan._id} className="hover:bg-third/5 transition-colors">
                                        <td className="px-4 py-4">
                                            <div className="space-y-1">
                                                <p className="font-semibold text-primary">{plan?.customer?.name}</p>
                                                <p className="text-sm text-gray-600">{plan?.customer?.mobile}</p>
                                                <p className="text-xs text-gray-500">{plan?.customer?.email}</p>
                                                <p className="text-xs font-medium text-third">Balance: {plan?.customer?.tokenBalance} tokens</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <p className="font-medium text-gray-900">{plan?.tiffinMenu?.menuName}</p>
                                            <span className="inline-block mt-1 px-2 py-1 rounded-full text-xs bg-third/10 border border-third/20 text-third">
                                                {plan?.tiffinMenu?.menuType}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {plan?.mealSlots?.map((slot) => (
                                                    <span key={slot} className={`px-2 py-1 rounded-full text-xs font-medium border ${getMealSlotColor(slot)}`}>
                                                        {slot}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="space-y-1 text-sm">
                                                <p><span className="font-medium">Total:</span> ₹{plan?.totalPrice}</p>
                                                <p><span className="font-medium">Paid:</span> ₹{plan?.amountPaid}</p>
                                                <p><span className="font-medium">Per Meal:</span> ₹{plan?.pricePerMeal}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="space-y-1 text-sm">
                                                <p><span className="font-medium">Generated:</span> {plan?.tokensGenerated}</p>
                                                <p className="text-third font-medium">Remaining: {plan?.customer?.tokenBalance}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${plan.isActive ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'}`}>
                                                {plan.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex flex-col gap-2">
                                                <button
                                                    onClick={() => openDeliveryModal(plan)}
                                                    className="px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:scale-[1.02] transition-transform"
                                                >
                                                    Mark Delivery
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(plan._id)}
                                                    className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:scale-[1.02] transition-transform"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden space-y-4">
                    {filteredPlans.map((plan) => (
                        <div key={plan._id} className="bg-white rounded-xl shadow border border-third/20 p-4">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-bold text-lg text-primary">{plan?.customer?.name}</h3>
                                    <p className="text-sm text-gray-600">{plan?.customer?.mobile}</p>
                                    <p className="text-xs text-gray-500">{plan?.customer?.email}</p>
                                    <p className="text-sm font-medium text-third mt-1">Token Balance: {plan?.customer?.tokenBalance}</p>
                                </div>

                                <div className="border-t border-third/20 pt-3">
                                    <p className="font-semibold text-gray-900">{plan?.tiffinMenu?.menuName}</p>
                                    <span className="inline-block mt-1 px-2 py-1 rounded-full text-xs bg-third/10 border border-third/20 text-third">
                                        {plan?.tiffinMenu?.menuType}
                                    </span>
                                </div>

                                <div>
                                    <p className="text-xs font-medium text-gray-500 mb-2">Meal Slots:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {plan?.mealSlots?.map((slot) => (
                                            <span key={slot} className={`px-3 py-1 rounded-full text-xs font-medium border ${getMealSlotColor(slot)}`}>
                                                {slot}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-sm">
                                    <p><span className="font-medium">Total Price:</span> ₹{plan?.totalPrice}</p>
                                    <p><span className="font-medium">Amount Paid:</span> ₹{plan?.amountPaid}</p>
                                    <p><span className="font-medium">Price/Meal:</span> ₹{plan?.pricePerMeal}</p>
                                </div>

                                <div className="bg-third/5 rounded-lg p-3 space-y-1 text-sm">
                                    <p><span className="font-medium">Tokens Generated:</span> {plan?.tokensGenerated}</p>
                                    <p className="text-third font-medium">Remaining Balance: {plan?.customer?.tokenBalance}</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${plan.isActive ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'}`}>
                                        {plan?.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <button
                                        onClick={() => openDeliveryModal(plan)}
                                        className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:scale-[1.02] transition-transform"
                                    >
                                        Mark Delivery
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(plan._id)}
                                        className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:scale-[1.02] transition-transform"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredPlans?.length === 0 && !loading && (
                    <div className="bg-white rounded-xl shadow border border-third/20 p-12 text-center">
                        <p className="text-gray-500 text-lg">
                            {mealPlans.length === 0 ? 'No meal plans found' : 'No meal plans match your filters'}
                        </p>
                        {mealPlans?.length > 0 && (
                            <button
                                onClick={resetFilters}
                                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:scale-[1.02] transition-transform"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Mark Delivery Modal */}
            {deliveryModal?.open && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 shadow-xl max-w-lg w-full">
                        <h2 className="text-2xl font-bold text-primary mb-4">Mark Delivery</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
                                <p className="text-gray-900 font-semibold">{deliveryModal?.plan?.customer?.name}</p>
                                <p className="text-sm text-gray-600">{deliveryModal?.plan?.customer?.mobile}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Meal Slot</label>
                                <select
                                    value={deliveryForm?.mealSlot}
                                    onChange={(e) => setDeliveryForm({ ...deliveryForm, mealSlot: e.target.value })}
                                    className="w-full px-4 py-2 border border-third/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    {deliveryModal?.plan?.mealSlots.map((slot) => (
                                        <option key={slot} value={slot}>{slot}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={deliveryForm.quantity}
                                    onChange={(e) => setDeliveryForm({ ...deliveryForm, quantity: e.target.value })}
                                    className="w-full px-4 py-2 border border-third/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div className="bg-third/5 border border-third/20 rounded-lg p-4">
                                <p className="font-medium text-gray-900 mb-2">Delivery Summary</p>
                                <div className="space-y-1 text-sm">
                                    <p>This delivery will consume <span className="font-semibold text-primary">{deliveryForm?.quantity}</span> token(s)</p>
                                    <p>Current Balance: <span className="font-semibold">{deliveryModal?.plan?.customer?.tokenBalance}</span></p>
                                    <p className="text-third font-semibold">New Balance: {calculateNewBalance()}</p>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={closeDeliveryModal}
                                    className="flex-1 px-4 py-2 bg-third/10 text-third rounded-lg font-medium hover:bg-third/20 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleMarkDelivery}
                                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:scale-[1.02] transition-transform"
                                >
                                    Confirm Delivery
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {deleteModal.open && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 shadow-xl max-w-md w-full">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Delete Meal Plan</h2>
                        <p className="text-gray-700 mb-6">Are you sure you want to delete this meal plan? This action cannot be undone.</p>

                        <div className="flex gap-3">
                            <button
                                onClick={closeDeleteModal}
                                className="flex-1 px-4 py-2 bg-third/10 text-third rounded-lg font-medium hover:bg-third/20 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeletePlan}
                                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:scale-[1.02] transition-transform"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <AlertSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                duration={8000}
                onClose={handleCloseSnackbar}
                position={{ vertical: "top", horizontal: "right" }}
            />
        </div>
    );
};

export default MealPlanTable;