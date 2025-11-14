
import { ShoppingCart, Loader } from 'lucide-react';




const TiffinAddToCartBar = ({ selectedPlan, pricing, tiffinId, onAddToCart, isLoading }) => {
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

        const originalPrice = plan.price;
        const discount = plan.discount || 0;
        const discountedPrice = originalPrice - (originalPrice * discount / 100);

        return {
            name: plans[selectedPlan],
            originalPrice,
            discountedPrice,
            hasDiscount: discount > 0
        };
    };

    const details = getPlanDetails();

    return (
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6 border border-third/20 sticky top-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    {details ? (
                        <div>
                            <p className="text-lg font-semibold text-third">Selected Plan: <span className="text-primary">{details.name}</span></p>
                            <div className="flex items-center gap-3 mt-1">
                                {details.hasDiscount && (
                                    <span className="text-third/50 line-through">₹{details.originalPrice}</span>
                                )}
                                <span className="text-2xl font-bold text-primary">₹{details.discountedPrice}</span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-lg text-third">Please select a plan to continue</p>
                    )}
                </div>

                <button
                    disabled={!selectedPlan || isLoading}
                    onClick={onAddToCart}
                    className={`px-8 py-3 rounded-full font-semibold text-lg shadow-lg transition-all flex items-center gap-2 ${selectedPlan && !isLoading
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
    );
};
export default TiffinAddToCartBar;