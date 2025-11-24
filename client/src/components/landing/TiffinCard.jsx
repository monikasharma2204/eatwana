import React from 'react';
import { Star, Leaf, Drumstick, Egg, Clock, Users } from 'lucide-react';

const TiffinCard = ({ tiffin }) => {
    const getFoodTypeIcon = () => {
        switch (tiffin.foodType) {
            case 'veg':
                return <Leaf className="w-4 h-4 text-green-600" />;
            case 'non-veg':
                return <Drumstick className="w-4 h-4 text-red-600" />;
            case 'egg':
                return <Egg className="w-4 h-4 text-yellow-600" />;
            default:
                return null;
        }
    };

    const getFoodTypeLabel = () => {
        switch (tiffin.foodType) {
            case 'veg':
                return { label: 'Pure Veg', color: 'text-green-700 bg-green-50 border-green-200' };
            case 'non-veg':
                return { label: 'Non-Veg', color: 'text-red-700 bg-red-50 border-red-200' };
            case 'egg':
                return { label: 'Egg', color: 'text-yellow-700 bg-yellow-50 border-yellow-200' };
            default:
                return { label: 'Mixed', color: 'text-gray-700 bg-gray-50 border-gray-200' };
        }
    };

    // Extract pricing - handle the nested structure
    const getPricingData = () => {
        const { pricing } = tiffin;
        const plans = [];

        // One Time
        if (pricing.oneTime?.price > 0) {
            plans.push({
                name: 'One Time',
                price: pricing.oneTime.price,
                discount: pricing.oneTime.discount,
                period: 'per meal'
            });
        }

        // Monthly plans
        if (pricing.monthly?.oneTime?.price > 0) {
            plans.push({
                name: 'Monthly',
                price: pricing.monthly.oneTime.price,
                discount: pricing.monthly.oneTime.discount,
                period: 'per day'
            });
        }

        // Quarterly plans
        if (pricing.quarterly?.oneTime?.price > 0) {
            plans.push({
                name: 'Quarterly',
                price: pricing.quarterly.oneTime.price,
                discount: pricing.quarterly.oneTime.discount,
                period: 'per day'
            });
        }

        // Half Yearly
        if (pricing.halfYearly?.oneTime?.price > 0) {
            plans.push({
                name: 'Half Yearly',
                price: pricing.halfYearly.oneTime.price,
                discount: pricing.halfYearly.oneTime.discount,
                period: 'per day'
            });
        }

        // Annual
        if (pricing.annual?.oneTime?.price > 0) {
            plans.push({
                name: 'Annual',
                price: pricing.annual.oneTime.price,
                discount: pricing.annual.oneTime.discount,
                period: 'per day'
            });
        }

        return plans;
    };

    const pricingPlans = getPricingData();
    const foodTypeData = getFoodTypeLabel();
    const hasRating = tiffin?.rating?.totalRatings > 0;

    return (
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 group">
            {/* Image Section */}
            <div className="relative h-56 overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50">
                <img
                    src={
                        tiffin.foodType === 'veg'
                            ? './picture/veg_tiffin.webp'
                            : tiffin.foodType === 'non-veg'
                                ? './picture/non_veg_tiffin.webp'
                                : './picture/egg_nonveg_tiffin.webp'
                    }
                    alt={tiffin.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                {/* Food Type Badge */}
                <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full ${foodTypeData.color} border backdrop-blur-sm shadow-md flex items-center gap-2 font-medium text-sm`}>
                    {getFoodTypeIcon()}
                    <span>{foodTypeData.label}</span>
                </div>

                {/* Rating Badge */}
                {hasRating && (
                    <div className="absolute top-4 right-4 bg-white/95 rounded-full px-3 py-1.5 shadow-lg flex items-center gap-1.5 backdrop-blur-sm">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-bold text-gray-800">
                            {tiffin.rating.averageRating.toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-500">
                            ({tiffin.rating.totalRatings})
                        </span>
                    </div>
                )}

                {/* Menu Badge */}
                <div className="absolute bottom-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                    Tiffin Service
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5">
                {/* Title and Menu Info */}
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{tiffin.name}</h3>
                    <p className="text-sm text-gray-600 font-medium">{tiffin.menu.menuName}</p>
                </div>

                {/* Tags */}
                {tiffin.tags && tiffin.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {tiffin.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 font-medium border border-orange-200"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Quick Info */}
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>7 Days Menu</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{tiffin.menu.menuType}</span>
                    </div>
                </div>

                {/* Pricing Section */}
                {pricingPlans.length > 0 ? (
                    <div className="mb-5">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Subscription Plans</h4>
                        <div className="space-y-2">
                            {pricingPlans.slice(0, 3).map((plan, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-gray-50 to-orange-50 hover:from-orange-50 hover:to-red-50 transition-colors"
                                >
                                    <div>
                                        <span className="text-sm font-medium text-gray-700">{plan.name}</span>
                                        {plan.discount > 0 && (
                                            <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-semibold">
                                                {plan.discount}% OFF
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <span className="text-lg font-bold text-gray-800">₹{plan.price}</span>
                                        <span className="text-xs text-gray-500 block">{plan.period}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {pricingPlans.length > 3 && (
                            <p className="text-xs text-center text-gray-500 mt-2">
                                +{pricingPlans.length - 3} more plans available
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="mb-5 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <p className="text-sm text-center text-orange-700 font-medium">
                            Starting at ₹{tiffin.pricing.oneTime.price}/meal
                        </p>
                    </div>
                )}

                {/* Subscribe Button */}
                <button
                    onClick={() => window.location.href = `/tiffin/${tiffin._id}`}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                >
                    View Details & Subscribe
                </button>
            </div>
        </div>
    );
};

export default TiffinCard;