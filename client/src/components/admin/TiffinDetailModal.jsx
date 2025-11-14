import React, { useState } from 'react';
import { Star, Leaf, Drumstick, Egg, IndianRupee, Pencil, Trash2, Clock, Calendar, ChevronDown, ChevronUp } from 'lucide-react';



// Tiffin Detail Modal Component
const TiffinDetailModal = ({ tiffin, onClose }) => {
    const [selectedPlan, setSelectedPlan] = useState('monthly');
    const [expandedDay, setExpandedDay] = useState(null);

    const getFoodTypeIcon = (type) => {
        switch (type) {
            case 'veg':
                return <Leaf className="w-5 h-5 text-green-600" />;
            case 'non-veg':
                return <Drumstick className="w-5 h-5 text-red-600" />;
            case 'egg':
                return <Egg className="w-5 h-5 text-yellow-600" />;
            default:
                return null;
        }
    };

    const getFoodTypeLabel = (type) => {
        return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const calculateDiscountedPrice = (price, discount) => {
        return price - (price * discount / 100);
    };

    const planDetails = {
        oneTime: { label: 'One Time', icon: <Clock className="w-4 h-4" /> },
        monthly: { label: 'Monthly', icon: <Calendar className="w-4 h-4" /> },
        quarterly: { label: 'Quarterly', icon: <Calendar className="w-4 h-4" /> },
        halfYearly: { label: 'Half Yearly', icon: <Calendar className="w-4 h-4" /> },
        annual: { label: 'Annual', icon: <Calendar className="w-4 h-4" /> }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="sticky top-0 bg-gradient-to-r from-primary to-secondary p-6 text-white z-10">
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">{tiffin.name}</h2>
                            <p className="text-white/90">{tiffin.menu.menuName}</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                            {getFoodTypeIcon(tiffin.foodType)}
                            <span className="font-medium">{getFoodTypeLabel(tiffin.foodType)}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
                            <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                            <span className="font-bold">{tiffin.rating.averageRating}</span>
                            <span className="text-sm">({tiffin.rating.totalRatings} ratings)</span>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    {/* Pricing Plans */}
                    <div className="mb-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Choose Your Plan</h3>
                        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
                            {Object.keys(planDetails).map(plan => (
                                <button
                                    key={plan}
                                    onClick={() => setSelectedPlan(plan)}
                                    className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap flex items-center gap-2 transition-all ${selectedPlan === plan
                                        ? 'bg-primary text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {planDetails[plan].icon}
                                    {planDetails[plan].label}
                                </button>
                            ))}
                        </div>

                        <div className="bg-linear-to-br from-orange-50 to-blue-50 rounded-xl p-6 border-2 border-primary/20">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-gray-600 mb-2">{planDetails[selectedPlan].label} Plan</p>
                                    <div className="flex items-center gap-2">
                                        <IndianRupee className="w-6 h-6 text-primary" />
                                        <span className="text-4xl font-bold text-gray-800">
                                            {Math.floor(calculateDiscountedPrice(
                                                tiffin.pricing[selectedPlan].price,
                                                tiffin.pricing[selectedPlan].discount
                                            ))}
                                        </span>
                                    </div>
                                    {tiffin.pricing[selectedPlan].discount > 0 && (
                                        <div className="mt-2">
                                            <span className="text-gray-500 line-through text-lg">
                                                ₹{tiffin.pricing[selectedPlan].price}
                                            </span>
                                            <span className="ml-3 text-green-600 font-bold text-lg">
                                                Save {tiffin.pricing[selectedPlan].discount}%
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Weekly Menu */}
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Weekly Menu</h3>
                        <div className="space-y-3">
                            {tiffin.menu.week.map((dayMenu, index) => (
                                <div key={index} className="border rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                                    <button
                                        onClick={() => setExpandedDay(expandedDay === index ? null : index)}
                                        className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                                                {dayMenu.day.substring(0, 1)}
                                            </div>
                                            <span className="font-bold text-lg text-gray-800">{dayMenu.day}</span>
                                        </div>
                                        {expandedDay === index ? (
                                            <ChevronUp className="w-5 h-5 text-primary" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-gray-400" />
                                        )}
                                    </button>

                                    {expandedDay === index && (
                                        <div className="px-6 py-4 space-y-4 bg-gray-50">
                                            {['Breakfast', 'Lunch', 'Dinner'].map(mealType => (
                                                dayMenu.meals[mealType] && dayMenu.meals[mealType].length > 0 && (
                                                    <div key={mealType} className="bg-white rounded-lg p-4 shadow-sm">
                                                        <h4 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full bg-primary"></span>
                                                            {mealType}
                                                        </h4>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                            {dayMenu.meals[mealType].map((dish, dishIndex) => (
                                                                <div
                                                                    key={dishIndex}
                                                                    className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg"
                                                                >
                                                                    <div className={`w-3 h-3 rounded-full ${dish.type === 'Veg' ? 'bg-green-500' : 'bg-red-500'
                                                                        }`}></div>
                                                                    <span className="text-gray-700">{dish.name}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )
                                            ))}
                                            {dayMenu.note && (
                                                <div className="bg-blue-50 border-l-4 border-secondary p-4 rounded">
                                                    <p className="text-sm text-gray-700">
                                                        <span className="font-semibold">Note:</span> {dayMenu.note}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TiffinDetailModal;