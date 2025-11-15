
import React, { useState } from 'react';
import { Star, X, Copy, Check, ShoppingBag } from 'lucide-react';

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
                <span className="text-sm text-third ml-1">{rating?.averageRating || 0}</span>
            </div>
        );
    };

    const getFoodIcon = (type) => {
        if (type === 'veg') return <div className="w-5 h-5 border-2 border-green-600 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-green-600"></div></div>;
        if (type === 'non-veg') return <div className="w-5 h-5 border-2 border-red-600 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-red-600"></div></div>;
        return <div className="w-5 h-5 border-2 border-yellow-600 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-yellow-600"></div></div>;
    };

    if (isDish) {
        return (
            <div className="bg-white rounded-xl shadow-md border border-third/10 p-4 flex gap-4 hover:scale-[1.02] transition-transform">
                <img
                    src={import.meta.env.VITE_API_URL + '/' + data.image}
                    alt={data.name}
                    className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="flex-1">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                {getFoodIcon(data.category)}
                                <h3 className="font-semibold text-lg text-third">{data.name}</h3>
                            </div>
                            {renderStars(data.rating)}
                            <p className="text-sm text-third/70 mt-1">{data.description}</p>
                        </div>
                        <button
                            onClick={() => onRemove(item._id)}
                            className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm text-third/60">{item.selectedQuantity?.type || 'Full'} Plate</span>
                        <span className="text-lg font-bold text-primary">₹{item.price}</span>
                    </div>
                </div>
            </div>
        );
    }

    const plan = item.selectedPlan;
    const pricing = data?.pricing[plan];
    const originalPrice = pricing?.price || 0;
    const discount = pricing?.discount || 0;
    const discountedPrice = originalPrice - (originalPrice * discount / 100);

    return (
        <div className="bg-white rounded-xl shadow-md border border-third/10 p-4 flex gap-4 hover:scale-[1.02] transition-transform">
            <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <ShoppingBag size={40} className="text-primary" />
            </div>
            <div className="flex-1">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            {getFoodIcon(data.foodType)}
                            <h3 className="font-semibold text-lg text-third">{data.name}</h3>
                        </div>
                        {renderStars(data.rating)}
                        <div className="flex flex-wrap gap-1 mt-2">
                            {data.tags?.map((tag, idx) => (
                                <span key={idx} className="text-xs bg-third/10 text-third px-2 py-1 rounded-full">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={() => onRemove(item._id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-secondary capitalize">{plan} Plan</span>
                    <div className="text-right">
                        {discount > 0 && (
                            <>
                                <span className="text-sm text-third/50 line-through">₹{originalPrice.toFixed(2)}</span>
                                <span className="text-lg font-bold text-primary ml-2">₹{discountedPrice.toFixed(2)}</span>
                                <span className="text-xs text-green-600 ml-1">({discount}% off)</span>
                            </>
                        )}
                        {discount === 0 && (
                            <span className="text-lg font-bold text-primary">₹{originalPrice.toFixed(2)}</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default CartItem;