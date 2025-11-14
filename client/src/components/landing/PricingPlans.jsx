


const PricingPlans = ({ pricing, selectedPlan, onSelectPlan }) => {
    const plans = [
        { key: 'oneTime', name: 'One Time', duration: '1 day' },
        { key: 'monthly', name: 'Monthly', duration: '30 days' },
        { key: 'quarterly', name: 'Quarterly', duration: '90 days' },
        { key: 'halfYearly', name: 'Half Yearly', duration: '180 days' },
        { key: 'annual', name: 'Annual', duration: '365 days' }
    ];

    const calculatePrice = (plan) => {
        const originalPrice = plan?.price;
        const discount = plan?.discount;
        const discountedPrice = originalPrice - (originalPrice * discount / 100);
        const savings = originalPrice - discountedPrice;

        return { originalPrice, discountedPrice, savings, discount };
    };

    return (
        <div className="mb-8">
            <h2 className="text-3xl font-bold text-primary mb-6">Choose Your Plan</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {plans?.map(plan => {
                    const planPricing = pricing?.[plan?.key];

                    if (!planPricing) return null;

                    const priceInfo = calculatePrice(planPricing);
                    const isSelected = selectedPlan === plan?.key;

                    return (
                        <div
                            key={plan?.key}
                            className={`bg-white rounded-xl p-6 border-2 transition-all cursor-pointer hover:shadow-lg ${isSelected
                                ? 'border-primary shadow-lg scale-[1.02]'
                                : 'border-third/20 hover:border-primary/50'
                                }`}
                            onClick={() => onSelectPlan(plan?.key)}
                        >
                            <div className="text-center space-y-3">
                                <h3 className="text-lg font-bold text-third">{plan?.name}</h3>
                                <p className="text-sm text-third/70">{plan?.duration}</p>

                                {priceInfo?.discount > 0 && (
                                    <div className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full inline-block">
                                        Save {priceInfo?.discount}%
                                    </div>
                                )}

                                <div>
                                    {priceInfo?.discount > 0 && (
                                        <p className="text-sm text-third/50 line-through">₹{priceInfo?.originalPrice}</p>
                                    )}
                                    <p className="text-3xl font-bold text-primary">₹{priceInfo?.discountedPrice}</p>
                                    {priceInfo?.savings > 0 && (
                                        <p className="text-xs text-green-600 font-medium">You save ₹{priceInfo?.savings}</p>
                                    )}
                                </div>

                                <button
                                    className={`w-full py-2 rounded-full font-medium transition-all ${isSelected
                                        ? 'bg-primary text-white'
                                        : 'bg-third/10 text-third hover:bg-third/20'
                                        }`}
                                >
                                    {isSelected ? 'Selected' : 'Select'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
export default PricingPlans;