
import { Star, Leaf, Egg, Drumstick } from 'lucide-react';


const TiffinHeader = ({ data }) => {
    const getFoodTypeIcon = (type) => {
        switch (type) {
            case 'veg': return <Leaf className="w-4 h-4" />;
            case 'non-veg': return <Drumstick className="w-4 h-4" />;
            case 'egg': return <Egg className="w-4 h-4" />;
            default: return null;
        }
    };

    const getFoodTypeBadge = (type) => {
        const colors = {
            veg: 'bg-green-100 text-green-700 border-green-300',
            'non-veg': 'bg-red-100 text-red-700 border-red-300',
            egg: 'bg-yellow-100 text-yellow-700 border-yellow-300'
        };
        return colors[type] || colors.veg;
    };

    const getTagColor = (tag) => {
        const colors = {
            special: 'bg-purple-100 text-purple-700',
            gym: 'bg-blue-100 text-blue-700',
            premium: 'bg-amber-100 text-amber-700',
            normal: 'bg-gray-100 text-gray-700'
        };
        return colors[tag] || colors.normal;
    };

    return (
        <div className="mb-8">
            <div className="grid md:grid-cols-2 gap-8 items-start">
                <div>
                    <img
                        src="/picture/non_veg_tiffin.webp"
                        alt={data?.name}
                        className="w-full h-80 object-cover rounded-xl shadow-lg"
                    />
                </div>

                <div className="space-y-4">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                        {data?.name}
                    </h1>

                    <div className="flex items-center gap-3 flex-wrap">
                        <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getFoodTypeBadge(data?.foodType)}`}>
                            {getFoodTypeIcon(data?.foodType)}
                            {data?.foodType === 'veg' ? 'Pure Veg' : data?.foodType === 'non-veg' ? 'Non-Veg' : 'Egg'}
                        </span>

                        {data?.tags?.map(tag => (
                            <span key={tag} className={`px-3 py-1 rounded-full text-sm font-medium ${getTagColor(tag)}`}>
                                {tag.charAt(0).toUpperCase() + tag.slice(1)}
                            </span>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-amber-50 px-3 py-2 rounded-lg">
                            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                            <span className="font-semibold text-amber-900">{data?.rating?.averageRating}</span>
                        </div>
                        <span className="text-third">({data?.rating?.totalRatings} ratings)</span>
                    </div>

                    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg border border-third/20">
                        <p className="text-third">
                            Enjoy a perfectly balanced meal plan with fresh, healthy ingredients delivered daily to your doorstep.
                            Our tiffin service ensures you never miss a nutritious meal.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TiffinHeader;