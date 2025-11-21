
import { Star, Leaf, Drumstick, Egg } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TiffinCard = ({ tiffin }) => {
    const navigate = useNavigate();
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

    return (
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-third/10 overflow-hidden transition-all duration-300 hover:scale-[1.02] group">
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={tiffin.foodType === 'veg' ? './picture/veg_tiffin.webp' :
                        tiffin.foodType === 'non-veg' ? './picture/non_veg_tiffin.webp' :
                            './picture/egg_nonveg_tiffin.webp'}
                    alt={tiffin.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/95 rounded-full p-2 shadow-md">
                    {getFoodTypeIcon()}
                </div>
                <div className="absolute top-3 right-3 bg-white/95 rounded-full px-3 py-1 shadow-md flex items-center gap-1">
                    <Star className="w-4 h-4 fill-secondary text-secondary" />
                    <span className="text-sm font-semibold text-third">{tiffin?.rating?.averageRating}</span>
                </div>
                <div className="absolute bottom-3 left-3 bg-linear-to-r from-primary to-secondary text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                    Tiffin Service
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="text-lg font-bold text-third mb-2">{tiffin.name}</h3>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                    {tiffin.tags.map((tag, index) => (
                        <span
                            key={index}
                            className="text-xs px-2 py-1 rounded-full bg-third/10 text-third"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Pricing */}
                {/* Pricing */}
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center py-2 border-b border-third/5">
                        <span className="text-sm text-gray-600">One Time</span>
                        <div className="text-right">
                            <span className="font-semibold text-third">₹{tiffin.pricing.oneTime.price}</span>
                            {tiffin.pricing.oneTime.discount > 0 && (
                                <span className="block text-xs text-green-600 font-medium">{tiffin.pricing.oneTime.discount}% OFF</span>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-third/5">
                        <span className="text-sm text-gray-600">Monthly</span>
                        <div className="text-right">
                            <span className="font-semibold text-third">₹{tiffin.pricing.monthly.price}</span>
                            {tiffin.pricing.monthly.discount > 0 && (
                                <span className="block text-xs text-green-600 font-medium">{tiffin.pricing.monthly.discount}% OFF</span>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-third/5">
                        <span className="text-sm text-gray-600">Quarterly</span>
                        <div className="text-right">
                            <span className="font-semibold text-third">₹{tiffin.pricing.quarterly.price}</span>
                            {tiffin.pricing.quarterly.discount > 0 && (
                                <span className="block text-xs text-green-600 font-medium">{tiffin.pricing.quarterly.discount}% OFF</span>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-third/5">
                        <span className="text-sm text-gray-600">Half Yearly</span>
                        <div className="text-right">
                            <span className="font-semibold text-third">₹{tiffin.pricing.halfYearly.price}</span>
                            {tiffin.pricing.halfYearly.discount > 0 && (
                                <span className="block text-xs text-green-600 font-medium">{tiffin.pricing.halfYearly.discount}% OFF</span>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-600">Annual</span>
                        <div className="text-right">
                            <span className="font-semibold text-third">₹{tiffin.pricing.annual.price.toFixed(2)}</span>
                            {tiffin.pricing.annual.discount > 0 && (
                                <span className="block text-xs text-green-600 font-medium">{tiffin.pricing.annual.discount}% OFF</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Subscribe Button */}
                <button onClick={() => { navigate(`/tiffin/${tiffin._id}`) }} className="w-full py-3 rounded-full bg-linear-to-r from-primary to-secondary text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                    Subscribe Now
                </button>
            </div>
        </div>
    );
};

export default TiffinCard;