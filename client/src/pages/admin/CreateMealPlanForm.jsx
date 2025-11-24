import React, { useState, useEffect } from 'react';
import { Users, UtensilsCrossed, Calendar, DollarSign, CheckCircle, Coins, Receipt, AlertCircle } from 'lucide-react';
import axiosClient from '../../services/axiosClient';


const AlertSnackbar = ({ open, message, severity, onClose }) => {
    if (!open) return null;
    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500'
    };
    return (
        <div className={`fixed top-4 right-4 ${colors[severity]} text-white px-6 py-3 rounded-lg shadow-lg z-50`}>
            {message}
            <button onClick={onClose} className="ml-4 font-bold">×</button>
        </div>
    );
};

const InfoTooltip = ({ text }) => (
    <div className="group relative inline-block ml-2">
        <AlertCircle size={16} className="text-blue-500 cursor-help" />
        <div className="invisible group-hover:visible absolute z-10 w-64 p-3 mt-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg -left-28">
            {text}
            <div className="absolute w-3 h-3 bg-gray-900 transform rotate-45 -top-1 left-32"></div>
        </div>
    </div>
);

const CreateMealPlanForm = () => {
    const [customers, setCustomers] = useState([]);
    const [tiffinMenus, setTiffinMenus] = useState([]);
    const [formData, setFormData] = useState({
        customerId: '',
        tiffinMenuId: '',
        mealSlots: [],
        totalPrice: '',
        amountPaid: '',
        mealsPerDay: 1
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(false);

    const mealSlotOptions = ['Breakfast', 'Lunch', 'Dinner'];
    const days = 30;

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setDataLoading(true);
            const [customersRes, menusRes] = await Promise.all([
                axiosClient.get('/api/v1/customer/all'),
                axiosClient.get('/api/v1/menu/all')
            ]);
            setCustomers(customersRes.data.data);
            setTiffinMenus(menusRes.data.data);
        } catch (error) {
            showSnackbar('Failed to load data', 'error');
        } finally {
            setDataLoading(false);
        }
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const toggleMealSlot = (slot) => {
        setFormData(prev => ({
            ...prev,
            mealSlots: prev.mealSlots.includes(slot)
                ? prev.mealSlots.filter(s => s !== slot)
                : [...prev.mealSlots, slot]
        }));
    };

    const validateForm = () => {
        if (!formData.customerId) {
            showSnackbar('Please select a customer', 'warning');
            return false;
        }
        if (!formData.tiffinMenuId) {
            showSnackbar('Please select a tiffin menu', 'warning');
            return false;
        }
        if (formData.mealSlots.length === 0) {
            showSnackbar('Please select at least one meal slot', 'warning');
            return false;
        }
        if (formData.mealsPerDay === 2 && formData.mealSlots.length < 2) {
            showSnackbar('Select at least 2 meal slots for 2 meals per day', 'warning');
            return false;
        }
        if (formData.mealsPerDay === 3 && formData.mealSlots.length < 3) {
            showSnackbar('Select all 3 meal slots for 3 meals per day', 'warning');
            return false;
        }
        if (!formData.totalPrice || parseFloat(formData.totalPrice) <= 0) {
            showSnackbar('Please enter a valid total plan price', 'warning');
            return false;
        }
        if (!formData.amountPaid || parseFloat(formData.amountPaid) <= 0) {
            showSnackbar('Please enter a valid amount paid', 'warning');
            return false;
        }
        if (parseFloat(formData.amountPaid) > parseFloat(formData.totalPrice)) {
            showSnackbar('Amount paid cannot exceed total plan price', 'warning');
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            // 🔒 ONLY SEND RAW USER INPUT - NO CALCULATIONS
            const payload = {
                customerId: formData.customerId,
                tiffinMenuId: formData.tiffinMenuId,
                mealSlots: formData.mealSlots,
                totalPrice: parseFloat(formData.totalPrice),
                amountPaid: parseFloat(formData.amountPaid),
                mealsPerDay: formData.mealsPerDay
            };

            const response = await axiosClient.post('/api/v1/meal-plan/create-plan', payload);

            showSnackbar('Meal plan created successfully! Invoice generated and tokens credited.', 'success');
            handleReset();
        } catch (error) {
            showSnackbar(error.response?.data?.message || 'Something went wrong', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({
            customerId: '',
            tiffinMenuId: '',
            mealSlots: [],
            totalPrice: '',
            amountPaid: '',
            mealsPerDay: 1
        });
    };

    // 👁️ CLIENT-SIDE PREVIEW ONLY (Not sent to backend)
    const totalMeals = days * formData.mealsPerDay;
    const pricePerMeal = formData.totalPrice ? (parseFloat(formData.totalPrice) / totalMeals).toFixed(2) : '0.00';
    const tokensGenerated = formData.amountPaid && formData.totalPrice
        ? Math.floor(parseFloat(formData.amountPaid) / parseFloat(pricePerMeal))
        : 0;
    const remainingAmount = formData.totalPrice && formData.amountPaid
        ? (parseFloat(formData.totalPrice) - parseFloat(formData.amountPaid)).toFixed(2)
        : '0.00';

    if (dataLoading) {
        return (
            <div className='flex items-center justify-center h-screen'>
                <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-orange-600 mb-2">Create Meal Plan</h1>
                    <p className="text-gray-600">Generate a 30-day meal plan with token-based billing system</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Customer Selection */}
                    <div className="bg-white rounded-xl shadow border border-gray-200 p-6 flex flex-col gap-3 hover:shadow-lg transition">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <Users className="text-blue-600" size={20} />
                            </div>
                            <h3 className="font-semibold text-gray-800">Select Customer</h3>
                            <InfoTooltip text="Choose the customer who will receive this meal plan. Their token balance will be updated automatically." />
                        </div>
                        <select
                            value={formData.customerId}
                            onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                        >
                            <option value="">Choose a customer...</option>
                            {customers.map(customer => (
                                <option key={customer._id} value={customer._id}>
                                    {customer.name} - {customer.mobile}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Tiffin Menu Selection */}
                    <div className="bg-white rounded-xl shadow border border-gray-200 p-6 flex flex-col gap-3 hover:shadow-lg transition">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-green-50 rounded-lg">
                                <UtensilsCrossed className="text-green-600" size={20} />
                            </div>
                            <h3 className="font-semibold text-gray-800">Select Tiffin Menu</h3>
                            <InfoTooltip text="Select the menu type that will be served throughout the 30-day plan." />
                        </div>
                        <select
                            value={formData.tiffinMenuId}
                            onChange={(e) => setFormData({ ...formData, tiffinMenuId: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
                        >
                            <option value="">Choose a menu...</option>
                            {tiffinMenus.map(menu => (
                                <option key={menu._id} value={menu._id}>
                                    {menu.menuName} - {menu.menuType}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Meal Slot Selection */}
                    <div className="bg-white rounded-xl shadow border border-gray-200 p-6 flex flex-col gap-3 hover:shadow-lg transition">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-purple-50 rounded-lg">
                                <Calendar className="text-purple-600" size={20} />
                            </div>
                            <h3 className="font-semibold text-gray-800">Meal Slots</h3>
                            <InfoTooltip text="Select which meal times are included (must match Meals Per Day)." />
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {mealSlotOptions.map(slot => (
                                <button
                                    key={slot}
                                    type="button"
                                    onClick={() => toggleMealSlot(slot)}
                                    className={`px-4 py-2 rounded-full border transition ${formData.mealSlots.includes(slot)
                                        ? 'bg-orange-600 text-white border-orange-600'
                                        : 'border-gray-200 hover:bg-orange-50 hover:border-orange-200'
                                        }`}
                                >
                                    {slot}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Meals Per Day */}
                    <div className="bg-white rounded-xl shadow border border-gray-200 p-6 flex flex-col gap-3 hover:shadow-lg transition">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-orange-50 rounded-lg">
                                <UtensilsCrossed className="text-orange-600" size={20} />
                            </div>
                            <h3 className="font-semibold text-gray-800">Meals Per Day</h3>
                            <InfoTooltip text="How many meals delivered daily? Affects total count and pricing." />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {[1, 2, 3].map(num => (
                                <button
                                    key={num}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, mealsPerDay: num })}
                                    className={`p-4 rounded-xl border text-center transition ${formData.mealsPerDay === num
                                        ? 'border-orange-600 bg-orange-50 text-orange-600'
                                        : 'border-gray-200 text-gray-600 hover:border-orange-600'
                                        }`}
                                >
                                    <div className="text-2xl font-bold">{num}</div>
                                    <div className="text-xs mt-1">Meal{num > 1 ? 's' : ''}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Pricing Section */}
                    <div className="md:col-span-2 bg-white rounded-xl shadow border border-gray-200 p-6 flex flex-col gap-4 hover:shadow-lg transition">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-emerald-50 rounded-lg">
                                <DollarSign className="text-emerald-600" size={20} />
                            </div>
                            <h3 className="font-semibold text-gray-800">Pricing & Payment</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    Total Plan Price (₹)
                                    <InfoTooltip text="Full 30-day plan price used to calculate price per meal." />
                                </label>
                                <input
                                    type="number"
                                    value={formData.totalPrice}
                                    onChange={(e) => setFormData({ ...formData, totalPrice: e.target.value })}
                                    placeholder="e.g., 4500"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                                    step="0.01"
                                    min="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    Amount Paid by Customer (₹)
                                    <InfoTooltip text="Actual amount paid TODAY. Tokens generated based on this only." />
                                </label>
                                <input
                                    type="number"
                                    value={formData.amountPaid}
                                    onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value })}
                                    placeholder="e.g., 2000"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50"
                                    step="0.01"
                                    min="0"
                                />
                            </div>
                        </div>

                        {formData.totalPrice && formData.amountPaid && parseFloat(formData.amountPaid) > parseFloat(formData.totalPrice) && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                                <AlertCircle size={16} />
                                <span>Amount paid cannot exceed total plan price</span>
                            </div>
                        )}
                    </div>

                    {/* Live Preview Calculations */}
                    <div className="md:col-span-2 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow border border-blue-200 p-6 flex flex-col gap-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-white rounded-lg">
                                <Receipt className="text-blue-600" size={20} />
                            </div>
                            <h3 className="font-semibold text-gray-800">Plan Preview (Client-side Estimate)</h3>
                            <InfoTooltip text="These are preview calculations. Final values will be computed securely on the server." />
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="p-4 bg-white rounded-lg border border-blue-200 shadow-sm">
                                <div className="text-xs text-gray-500 mb-1">Plan Duration</div>
                                <div className="text-2xl font-bold text-gray-800">{days}</div>
                                <div className="text-xs text-gray-500 mt-1">Days</div>
                            </div>
                            <div className="p-4 bg-white rounded-lg border border-blue-200 shadow-sm">
                                <div className="text-xs text-gray-500 mb-1">Total Meals</div>
                                <div className="text-2xl font-bold text-gray-800">{totalMeals}</div>
                                <div className="text-xs text-gray-500 mt-1">Meals</div>
                            </div>
                            <div className="p-4 bg-white rounded-lg border border-blue-200 shadow-sm">
                                <div className="text-xs text-gray-500 mb-1">Price Per Meal</div>
                                <div className="text-2xl font-bold text-gray-800">₹{pricePerMeal}</div>
                                <div className="text-xs text-gray-500 mt-1">Per Meal</div>
                            </div>
                            <div className="p-4 bg-white rounded-lg border border-blue-200 shadow-sm">
                                <div className="text-xs text-gray-500 mb-1">Remaining Due</div>
                                <div className="text-2xl font-bold text-orange-600">₹{remainingAmount}</div>
                                <div className="text-xs text-gray-500 mt-1">Unpaid</div>
                            </div>
                        </div>

                        <div className="p-5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg">
                            <div className="flex items-center justify-between text-white">
                                <div className="flex items-center gap-3">
                                    <Coins size={32} />
                                    <div>
                                        <div className="text-sm opacity-90">Estimated Tokens</div>
                                        <div className="text-3xl font-bold">{tokensGenerated}</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm opacity-90">Based on</div>
                                    <div className="text-xl font-semibold">₹{formData.amountPaid || '0'} paid</div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="text-sm text-blue-800">
                                <strong>💡 Preview Only:</strong> Final calculations done securely on server. Tokens = Amount Paid ÷ Price Per Meal. Customer can pay remaining ₹{remainingAmount} later for more tokens.
                            </div>
                        </div>
                    </div>

                    {/* Submit Actions */}
                    <div className="md:col-span-2 bg-white rounded-xl shadow border border-gray-200 p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-1 bg-orange-600 text-white py-3 rounded-xl shadow hover:bg-orange-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={20} />
                                        Create Meal Plan & Generate Invoice
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={handleReset}
                                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition font-medium"
                            >
                                Reset Form
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            <AlertSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={handleCloseSnackbar}
            />
        </div>
    );
};

export default CreateMealPlanForm;