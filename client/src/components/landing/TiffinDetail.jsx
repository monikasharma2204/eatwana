import React, { useEffect, useState } from 'react';
import { Loader, Star, Clock, Utensils, Check, ShoppingCart } from 'lucide-react';

// TiffinHeader Component
const TiffinHeader = ({ data }) => {
    if (!data) return null;

    return (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-800 mb-3">{data.name}</h1>
                        <div className="flex items-center gap-3 mb-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${data.foodType === 'veg'
                                ? 'bg-green-50 text-green-700 border border-green-200'
                                : 'bg-red-50 text-red-700 border border-red-200'
                                }`}>
                                {data.foodType === 'veg' ? '🌱 Veg' : '🍖 Non-Veg'}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${data.status === 'active'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-gray-50 text-gray-700 border border-gray-200'
                                }`}>
                                {data.status === 'active' ? 'Available' : 'Unavailable'}
                            </span>
                        </div>

                        {data.menu?.menuName && (
                            <div className="flex items-center gap-2 text-gray-700 mb-2">
                                <Utensils className="w-4 h-4 text-orange-500" />
                                <span className="font-medium">{data.menu.menuName}</span>
                                {data.menu?.menuType && (
                                    <span className="text-sm text-gray-500">• {data.menu.menuType}</span>
                                )}
                            </div>
                        )}

                        {data.tags && data.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {data.tags.map((tag, index) => (
                                    <span key={index} className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-sm border border-orange-200">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-200">
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold text-gray-800">
                            {data.rating?.averageRating > 0 ? data.rating.averageRating.toFixed(1) : 'New'}
                        </span>
                        {data.rating?.totalRatings > 0 && (
                            <span className="text-sm text-gray-600">({data.rating.totalRatings})</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// TiffinMenuTabs Component
const TiffinMenuTabs = ({ menu }) => {
    const [selectedDay, setSelectedDay] = useState(0);

    if (!menu || !menu.week || menu.week.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Weekly Menu</h2>
                <p className="text-gray-500">No menu available</p>
            </div>
        );
    }

    const dayData = menu.week[selectedDay];

    return (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Weekly Menu</h2>

            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {menu.week.map((day, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedDay(index)}
                        className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${selectedDay === index
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {day.day}
                    </button>
                ))}
            </div>

            {dayData && (
                <div className="space-y-4">
                    {dayData.note && (
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                            <p className="text-blue-800 text-sm font-medium">{dayData.note}</p>
                        </div>
                    )}

                    <div className="grid md:grid-cols-3 gap-4">
                        {['Breakfast', 'Lunch', 'Dinner'].map((mealType) => {
                            const meals = dayData.meals?.[mealType];
                            if (!meals || meals.length === 0) return null;

                            return (
                                <div key={mealType} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Clock className="w-4 h-4 text-orange-500" />
                                        <h3 className="text-lg font-semibold text-gray-800">{mealType}</h3>
                                    </div>
                                    <ul className="space-y-2">
                                        {meals.map((meal) => (
                                            <li key={meal._id} className="flex items-start gap-2">
                                                <span className={`mt-0.5 px-1.5 py-0.5 rounded text-xs font-medium ${meal.type === 'Veg'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {meal.type === 'Veg' ? '🌱' : '🍖'}
                                                </span>
                                                <span className="text-gray-700 text-sm">{meal.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

// PricingPlans Component
const PricingPlans = ({ pricing, selectedPlan, onSelectPlan }) => {
    if (!pricing) return null;

    const plans = [
        { key: 'oneTime', label: 'One Time', duration: 'Per day' },
        { key: 'monthly', label: 'Monthly', duration: '30 days' },
        { key: 'quarterly', label: 'Quarterly', duration: '90 days' },
        { key: 'halfYearly', label: 'Half Yearly', duration: '180 days' },
        { key: 'annual', label: 'Annual', duration: '365 days' }
    ];

    const availablePlans = plans.filter(plan => {
        if (plan.key === 'oneTime') {
            return pricing.oneTime?.price > 0;
        }
        const planData = pricing[plan.key];
        return planData && (planData.oneTime?.price > 0 || planData.twoTime?.price > 0 || planData.threeTime?.price > 0);
    });

    if (availablePlans.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Pricing Plans</h2>
                <p className="text-gray-500">No pricing plans available</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Choose Your Plan</h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                {availablePlans.map((plan) => {
                    const planData = plan.key === 'oneTime' ? pricing.oneTime : pricing[plan.key];
                    const isSelected = selectedPlan === plan.key;

                    let displayPrice = 0;
                    if (plan.key === 'oneTime') {
                        displayPrice = planData.price;
                    } else {
                        displayPrice = planData.oneTime?.price || planData.twoTime?.price || planData.threeTime?.price || 0;
                    }

                    return (
                        <button
                            key={plan.key}
                            onClick={() => onSelectPlan(plan.key)}
                            className={`relative p-4 rounded-lg border-2 transition-all ${isSelected
                                ? 'border-orange-500 bg-orange-50 shadow-md'
                                : 'border-gray-200 bg-white hover:border-orange-300'
                                }`}
                        >
                            {isSelected && (
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                            )}

                            <div className="text-center">
                                <h3 className="text-base font-bold text-gray-800 mb-1">{plan.label}</h3>
                                <p className="text-xs text-gray-500 mb-2">{plan.duration}</p>
                                <div className="text-2xl font-bold text-orange-600">₹{displayPrice}</div>
                                {plan.key !== 'oneTime' && <p className="text-xs text-gray-500 mt-1">per meal</p>}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

// TiffinAddToCartBar Component
const TiffinAddToCartBar = ({
    selectedPlan,
    pricing,
    deliveryTimings,
    onDeliveryTimingsChange,
    onAddToCart,
    isLoading
}) => {
    const timingOptions = [
        { value: 'breakfast', label: 'Breakfast', icon: '🌅' },
        { value: 'lunch', label: 'Lunch', icon: '☀️' },
        { value: 'dinner', label: 'Dinner', icon: '🌙' }
    ];

    const toggleTiming = (timing) => {
        if (deliveryTimings.includes(timing)) {
            onDeliveryTimingsChange(deliveryTimings.filter(t => t !== timing));
        } else {
            onDeliveryTimingsChange([...deliveryTimings, timing]);
        }
    };

    const calculateTotal = () => {
        if (!selectedPlan || !pricing || deliveryTimings.length === 0) return 0;

        let pricePerMeal = 0;
        if (selectedPlan === 'oneTime') {
            pricePerMeal = pricing.oneTime?.price || 0;

            return pricePerMeal * deliveryTimings.length;
        } else {
            const planData = pricing[selectedPlan];
            if (deliveryTimings.length === 1) {
                pricePerMeal = planData?.oneTime?.price || 0;
            } else if (deliveryTimings.length === 2) {
                pricePerMeal = planData?.twoTime?.price || planData?.oneTime?.price || 0;
            } else if (deliveryTimings.length === 3) {
                pricePerMeal = planData?.threeTime?.price || planData?.twoTime?.price || planData?.oneTime?.price || 0;
            }
        }

        return pricePerMeal;
    };

    const total = calculateTotal();

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex-1 w-full md:w-auto">
                        <p className="text-sm text-gray-600 mb-2 font-medium">Select Delivery Timings:</p>
                        <div className="flex flex-wrap gap-2">
                            {timingOptions.map((option) => {
                                const isSelected = deliveryTimings.includes(option.value);
                                return (
                                    <button
                                        key={option.value}
                                        onClick={() => toggleTiming(option.value)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isSelected
                                            ? 'bg-orange-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        <span>{option.icon}</span>
                                        <span className="text-sm">{option.label}</span>
                                        {isSelected && <Check className="w-4 h-4" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="text-right">
                            <p className="text-sm text-gray-600">Total</p>
                            <p className="text-2xl font-bold text-gray-800">₹{total}</p>
                            {deliveryTimings.length > 0 && (
                                <p className="text-xs text-gray-500">{deliveryTimings.length} meal(s) per day</p>
                            )}
                        </div>

                        <button
                            onClick={onAddToCart}
                            disabled={isLoading || !selectedPlan || deliveryTimings.length === 0}
                            className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                            {isLoading ? (
                                <Loader className="w-5 h-5 animate-spin" />
                            ) : (
                                <ShoppingCart className="w-5 h-5" />
                            )}
                            <span>{isLoading ? 'Adding...' : 'Add to Cart'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Export all components
export { TiffinHeader, TiffinMenuTabs, PricingPlans, TiffinAddToCartBar };