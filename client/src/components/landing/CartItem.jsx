
import React, { useState } from 'react';
import { Star, X, Copy, Check, ShoppingBag, Clock } from 'lucide-react';
const CartItem = ({ item, onRemove }) => {
    const isDish = item.itemType === 'dish';
    const data = isDish ? item.dish : item.tiffin;

    const renderStars = (rating) => {
        return (
            <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={14}
                        className={i < Math.floor(rating?.averageRating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                ))}
                <span className="text-sm text-gray-600 ml-1">{rating?.averageRating || 0}</span>
            </div>
        );
    };

    const getFoodIcon = (type) => {
        if (type === 'veg') return <div className="w-5 h-5 border-2 border-green-600 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-green-600"></div></div>;
        if (type === 'non-veg') return <div className="w-5 h-5 border-2 border-red-600 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-red-600"></div></div>;
        return <div className="w-5 h-5 border-2 border-yellow-600 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-yellow-600"></div></div>;
    };

    const formatDeliveryTimings = (timings) => {
        if (!timings || timings.length === 0) return 'Not specified';
        return timings.map(time => time.charAt(0).toUpperCase() + time.slice(1)).join(', ');
    };

    const getTimingCount = (timings) => {
        if (!timings || timings.length === 0) return 'One Time';
        if (timings.length === 1) return 'One Time';
        if (timings.length === 2) return 'Two Times';
        if (timings.length === 3) return 'Three Times';
        return `${timings.length} Times`;
    };
    console.log(data)
    if (isDish) {
        return (
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 flex gap-4 hover:scale-[1.02] transition-transform">
                <img
                    src={`${import.meta.env.VITE_API_URL}/${data.image}` || '/placeholder-dish.jpg'}
                    alt={data.name}
                    className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="flex-1">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                {getFoodIcon(data.category)}
                                <h3 className="font-semibold text-lg text-gray-800">{data.name}</h3>
                            </div>
                            {renderStars(data.rating)}
                            <p className="text-sm text-gray-600 mt-1">{data.description}</p>
                        </div>
                        <button
                            onClick={() => onRemove(item._id)}
                            className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm text-gray-600">{item.selectedQuantity || 'Full'} Plate</span>
                        <span className="text-lg font-bold text-primary">₹{item.price}</span>
                    </div>
                </div>
            </div>
        );
    }

    // Tiffin item with new structure
    const getPlanInfo = () => {
        const plan = item.selectedPlan;
        const timings = item.deliveryTimings || [];

        // Handle oneTime plan
        if (plan === 'oneTime') {
            return {
                planName: 'One Time',
                pricing: data?.pricing?.oneTime,
                timingType: null
            };
        }

        // Handle subscription plans (monthly, quarterly, etc.)
        const planPricing = data?.pricing?.[plan];
        if (!planPricing) {
            return {
                planName: plan?.charAt(0).toUpperCase() + plan?.slice(1),
                pricing: { price: item.price, discount: 0 },
                timingType: getTimingCount(timings)
            };
        }

        // Determine timing type based on delivery timings count
        let timingType = 'oneTime';
        if (timings.length === 2) timingType = 'twoTime';
        if (timings.length === 3) timingType = 'threeTime';

        return {
            planName: plan?.charAt(0).toUpperCase() + plan?.slice(1),
            pricing: planPricing[timingType] || { price: item.price, discount: 0 },
            timingType: getTimingCount(timings)
        };
    };

    const planInfo = getPlanInfo();
    const originalPrice = planInfo.pricing?.price || 0;
    const discount = planInfo.pricing?.discount || 0;
    const discountedPrice = originalPrice - (originalPrice * discount / 100);

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 flex gap-4 hover:scale-[1.02] transition-transform">
            <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <ShoppingBag size={40} className="text-primary" />
            </div>
            <div className="flex-1">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            {getFoodIcon(data.foodType)}
                            <h3 className="font-semibold text-lg text-gray-800">{data.name}</h3>
                        </div>
                        {renderStars(data.rating)}

                        {/* Tags */}
                        {data.tags && data.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                                {data.tags.map((tag, idx) => (
                                    <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Delivery Timings */}
                        {item.deliveryTimings && item.deliveryTimings.length > 0 && (
                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                                <Clock size={16} className="text-purple-600" />
                                <span className="font-medium">{formatDeliveryTimings(item.deliveryTimings)}</span>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => onRemove(item._id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Plan and Price */}
                <div className="mt-3 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-purple-600 capitalize">{planInfo.planName} Plan</span>
                        {planInfo.timingType && (
                            <span className="text-xs text-gray-500">{planInfo.timingType} Daily</span>
                        )}
                    </div>
                    <div className="text-right">
                        {discount > 0 ? (
                            <>
                                <span className="text-sm text-gray-400 line-through">₹{originalPrice.toFixed(2)}</span>
                                <span className="text-lg font-bold text-primary ml-2">₹{discountedPrice.toFixed(2)}</span>
                                <span className="text-xs text-green-600 ml-1">({discount}% off)</span>
                            </>
                        ) : (
                            <span className="text-lg font-bold text-primary">₹{item.price.toFixed(2)}</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default CartItem;