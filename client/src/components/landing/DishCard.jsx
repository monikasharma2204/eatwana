
import { Star, Leaf, Drumstick, Egg } from 'lucide-react';

const DishCard = ({ dish }) => {
    console.log("Dish data:", dish);
    const getCategoryIcon = () => {
        switch (dish.category) {
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

    const minPrice = Math.min(...dish.quantities.map(q => q.price));

    return (
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-third/10 overflow-hidden transition-all duration-300 hover:scale-[1.02] group">
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={`${import.meta.env.VITE_API_URL}/${dish.image}`}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white/95 rounded-full p-2 shadow-md">
                    {getCategoryIcon()}
                </div>
                <div className="absolute top-3 right-3 bg-white/95 rounded-full px-3 py-1 shadow-md flex items-center gap-1">
                    <Star className="w-4 h-4 fill-secondary text-secondary" />
                    <span className="text-sm font-semibold text-third">{dish.rating}</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-third line-clamp-1">{dish.name}</h3>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-third/10 text-third capitalize whitespace-nowrap ml-2">
                        {dish.mealType}
                    </span>
                </div>

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{dish.description}</p>

                {/* Tags */}
                {/* <div className="flex flex-wrap gap-1 mb-3">
                    {dish.tags.slice(0, 3).map((tag, index) => (
                        <span
                            key={index}
                            className="text-xs px-2 py-1 rounded-full bg-linear-to-r from-primary/10 to-secondary/10 text-primary font-medium"
                        >
                            {tag}
                        </span>
                    ))}
                </div> */}

                {/* Pricing */}
                <div className="flex items-center justify-between pt-3 border-t border-third/10">
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Starting from</p>
                        <p className="text-2xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                            ₹{minPrice}
                        </p>
                    </div>
                    <button className="px-6 py-2 rounded-full bg-linear-to-r from-primary to-secondary text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
};
export default DishCard;