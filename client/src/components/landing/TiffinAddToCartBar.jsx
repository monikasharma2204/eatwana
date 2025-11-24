
import { ShoppingCart, Loader } from 'lucide-react';




const TiffinAddToCartBar = ({ selectedPlan, pricing, tiffinId, deliveryTimings, onDeliveryTimingsChange, onAddToCart, isLoading }) => {
    const plans = {
        oneTime: 'One Time',
        monthly: 'Monthly',
        quarterly: 'Quarterly',
        halfYearly: 'Half Yearly',
        annual: 'Annual'
    };

    const getPlanDetails = () => {
        if (!selectedPlan) return null;

        const plan = pricing?.[selectedPlan];
        if (!plan) return null;

        // For oneTime plan, use simple pricing
        if (selectedPlan === 'oneTime') {
            const originalPrice = plan.price || 0;
            const discount = plan.discount || 0;
            const discountedPrice = originalPrice - (originalPrice * discount / 100);

            return {
                name: plans[selectedPlan],
                originalPrice,
                discountedPrice,
                hasDiscount: discount > 0,
                timingCount: deliveryTimings.length || 0
            };
        }

        // For other plans, use timing-based pricing
        const timingCount = deliveryTimings.length;
        if (timingCount === 0) {
            // Show base price or first available timing price
            const timingKey = plan.oneTime ? 'oneTime' : plan.twoTime ? 'twoTime' : 'threeTime';
            const timingPricing = plan[timingKey];
            if (!timingPricing) return null;

            const originalPrice = timingPricing.price || 0;
            const discount = timingPricing.discount || 0;
            const discountedPrice = originalPrice - (originalPrice * discount / 100);

            return {
                name: plans[selectedPlan],
                originalPrice,
                discountedPrice,
                hasDiscount: discount > 0,
                timingCount: 0,
                message: 'Select timing(s) to see price'
            };
        }

        // Determine timing count key
        const timingCountKey = timingCount === 1 ? 'oneTime' : timingCount === 2 ? 'twoTime' : 'threeTime';
        const timingPricing = plan[timingCountKey];
        
        if (!timingPricing) {
            return {
                name: plans[selectedPlan],
                originalPrice: 0,
                discountedPrice: 0,
                hasDiscount: false,
                timingCount,
                message: `Pricing not available for ${timingCount} timing(s)`
            };
        }

        const originalPrice = timingPricing.price || 0;
        const discount = timingPricing.discount || 0;
        const discountedPrice = originalPrice - (originalPrice * discount / 100);

        return {
            name: plans[selectedPlan],
            originalPrice,
            discountedPrice,
            hasDiscount: discount > 0,
            timingCount
        };
    };

    const details = getPlanDetails();

    const timingOptions = [
        { value: 'breakfast', label: 'Breakfast', icon: '🌅' },
        { value: 'lunch', label: 'Lunch', icon: '☀️' },
        { value: 'dinner', label: 'Dinner', icon: '🌙' }
    ];

    return (
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6 border border-third/20 sticky top-4">
            <div className="space-y-4">
                {/* Plan and Price */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        {details ? (
                            <div>
                                <p className="text-lg font-semibold text-third">
                                    Selected Plan: <span className="text-primary">{details.name}</span>
                                    {details.timingCount > 0 && selectedPlan !== 'oneTime' && (
                                        <span className="text-sm text-gray-600 ml-2">
                                            ({details.timingCount} timing{details.timingCount > 1 ? 's' : ''})
                                        </span>
                                    )}
                                </p>
                                {details.message ? (
                                    <p className="text-sm text-gray-500 mt-1">{details.message}</p>
                                ) : (
                                    <div className="flex items-center gap-3 mt-1">
                                        {details.hasDiscount && (
                                            <span className="text-third/50 line-through">₹{details.originalPrice.toLocaleString()}</span>
                                        )}
                                        <span className="text-2xl font-bold text-primary">₹{details.discountedPrice.toLocaleString()}</span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-lg text-third">Please select a plan to continue</p>
                        )}
                    </div>
                </div>

                {/* Delivery Timing Selection - Multiple Selection */}
                {selectedPlan && (
                    <div>
                        <label className="block text-sm font-semibold text-third mb-2">
                            Select Delivery Timing(s) <span className="text-red-500">*</span>
                            <span className="text-xs text-gray-500 font-normal ml-2">(You can select one or more)</span>
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {timingOptions.map((option) => {
                                const isSelected = deliveryTimings.includes(option.value);
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => {
                                            if (isSelected) {
                                                // Remove from selection
                                                onDeliveryTimingsChange(deliveryTimings.filter(t => t !== option.value));
                                            } else {
                                                // Add to selection
                                                onDeliveryTimingsChange([...deliveryTimings, option.value]);
                                            }
                                        }}
                                        className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-2 relative ${
                                            isSelected
                                                ? 'border-primary bg-primary/10 text-primary shadow-md'
                                                : 'border-third/20 bg-white text-third hover:border-primary/50 hover:bg-primary/5'
                                        }`}
                                    >
                                        {isSelected && (
                                            <span className="absolute top-1 right-1 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                                                ✓
                                            </span>
                                        )}
                                        <span className="text-2xl">{option.icon}</span>
                                        <span className="text-sm font-medium">{option.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                        {deliveryTimings.length > 0 && (
                            <p className="text-xs text-gray-600 mt-2">
                                Selected: {deliveryTimings.map(t => timingOptions.find(o => o.value === t)?.label).join(', ')}
                            </p>
                        )}
                    </div>
                )}

                {/* Add to Cart Button */}
                <div className="flex justify-end">
                    <button
                        disabled={!selectedPlan || !deliveryTimings || deliveryTimings.length === 0 || isLoading}
                        onClick={onAddToCart}
                        className={`px-8 py-3 rounded-full font-semibold text-lg shadow-lg transition-all flex items-center gap-2 ${
                            selectedPlan && deliveryTimings && deliveryTimings.length > 0 && !isLoading
                                ? 'bg-primary text-white hover:scale-[1.05] hover:shadow-xl cursor-pointer'
                                : 'bg-third/20 text-third/50 cursor-not-allowed'
                        }`}
                    >
                        {isLoading ? (
                            <>
                                <Loader className="w-5 h-5 animate-spin" />
                                Adding...
                            </>
                        ) : (
                            <>
                                <ShoppingCart className="w-5 h-5" />
                                Add to Cart
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
export default TiffinAddToCartBar;